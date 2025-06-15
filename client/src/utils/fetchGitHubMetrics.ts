const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

export async function fetchGitHubContributorData(token: string, username: string) {
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
          pullRequestContributionsByRepository(maxRepositories: 100) {
            repository {
              name
            }
            contributions(first: 100) {
              nodes {
                pullRequest {
                  merged
                  url
                }
              }
            }
          }
        }
        pullRequests(first: 100, states: [OPEN, CLOSED, MERGED]) {
          totalCount
        }
        issues {
          totalCount
        }
        repositoriesContributedTo(contributionTypes: [COMMIT, PULL_REQUEST, ISSUE], first: 100) {
          totalCount
        }
        followers {
          totalCount
        }
        repositories(first: 5, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            name
            stargazerCount
            forkCount
            updatedAt
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error("Failed to fetch GitHub data");
    }

    const user = result.data.user;

    // Count merged PRs from pullRequestContributionsByRepository
    const mergedPRs =
      user.contributionsCollection.pullRequestContributionsByRepository
        .flatMap((repo: any) => repo.contributions.nodes)
        .filter((node: any) => node.pullRequest?.merged)
        .length;

    return {
      totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
      mergedPRs,
      totalPRs: user.pullRequests.totalCount,
      issuesCreated: user.issues.totalCount,
      contributedRepos: user.repositoriesContributedTo.totalCount,
      followers: user.followers.totalCount,
      topRepos: user.repositories.nodes.map((repo: any) => ({
        name: repo.name,
        stargazerCount: repo.stargazerCount,
        forkCount: repo.forkCount,
        updatedAt: repo.updatedAt
      }))
    };

  } catch (error) {
    console.error("GitHub GraphQL fetch failed:", error);
    return null;
  }
}

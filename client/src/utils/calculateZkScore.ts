interface GitHubStats {
    totalContributions?: number;
    topRepos?: { stargazerCount?: number }[];
    mergedPRs?: number;
    issuesCreated?: number;
    followers?: number;
    contributedRepos?: number;
}

interface OnchainStats {
    ethBalance?: string;
    txCount?: number;
    isContractDeployer?: boolean;
    hasNFTs?: boolean;
    contractDeployments?: number;
    daoVotes?: number;
    tokenBalances?: { symbol: string; balance: number }[];
}

interface ZKScoreResult {
    totalScore: number;
    githubScore: number;
    onchainScore: number;
    role: 'Contributor' | 'Investor' | 'Founder';
    roleConfidence: number;
    breakdown: {
        github: {
            activity: number;
            impact: number;
            community: number;
            collaboration: number;
        };
        onchain: {
            wealth: number;
            activity: number;
            technical: number;
            governance: number;
        };
    };
}

export class RealisticZKScoreCalculator {
    // Realistic thresholds based on actual developer profiles
    private static readonly GITHUB_THRESHOLDS = {
        // Average contributor: 1000+ contributions, some PRs/issues, decent stars
        CONTRIBUTOR_MIN_CONTRIBUTIONS: 1000,
        CONTRIBUTOR_MIN_PRS: 20,
        CONTRIBUTOR_MIN_ISSUES: 10,
        CONTRIBUTOR_MIN_STARS: 50,
        
        // Founder: Strong GitHub + onchain presence
        FOUNDER_MIN_CONTRIBUTIONS: 800,
        FOUNDER_MIN_REPOS: 5,
        FOUNDER_MIN_STARS: 100,
    };

    private static readonly ONCHAIN_THRESHOLDS = {
        // Investor: Significant wealth, active trading
        INVESTOR_MIN_ETH: 10, // 10+ ETH
        INVESTOR_MIN_STABLECOINS: 25000, // $25k+ in stablecoins
        INVESTOR_MIN_TXS: 500,
        
        // Founder: Technical activity + some wealth
        FOUNDER_MIN_ETH: 1, // 1+ ETH
        FOUNDER_MIN_TXS: 200,
        FOUNDER_NEEDS_CONTRACTS: true,
    };

    public static calculateZkScore(github: GitHubStats, onchain: OnchainStats): ZKScoreResult {
        const githubBreakdown = this.calculateGitHubScore(github);
        const onchainBreakdown = this.calculateOnchainScore(onchain);

        const githubScore = Object.values(githubBreakdown).reduce((sum, val) => sum + val, 0);
        const onchainScore = Object.values(onchainBreakdown).reduce((sum, val) => sum + val, 0);

        const totalScore = Math.round(githubScore + onchainScore);
        const { role, confidence } = this.determineRole(github, onchain, githubScore, onchainScore);

        return {
            totalScore,
            githubScore: Math.round(githubScore),
            onchainScore: Math.round(onchainScore),
            role,
            roleConfidence: confidence,
            breakdown: {
                github: githubBreakdown,
                onchain: onchainBreakdown
            }
        };
    }

    private static calculateGitHubScore(github: GitHubStats) {
        const {
            totalContributions = 0,
            topRepos = [],
            mergedPRs = 0,
            issuesCreated = 0,
            followers = 0,
            contributedRepos = 0
        } = github;

        const totalStars = topRepos.reduce((sum, repo) => sum + (repo.stargazerCount || 0), 0);
        const repoCount = topRepos.length;

        // Activity Score (0-40 points)
        // Based on contributions with progressive scaling
        let activityScore = 0;
        if (totalContributions > 0) {
            if (totalContributions < 100) {
                activityScore = totalContributions * 0.1; // 0-10 points
            } else if (totalContributions < 500) {
                activityScore = 10 + (totalContributions - 100) * 0.05; // 10-30 points
            } else if (totalContributions < 2000) {
                activityScore = 30 + (totalContributions - 500) * 0.02; // 30-60 points
            } else {
                activityScore = 60 + Math.log10(totalContributions / 2000) * 15; // 60+ points
            }
        }
        activityScore = Math.min(activityScore, 80);

        // Impact Score (0-60 points)
        // PRs and Issues show real contribution impact
        const prScore = Math.min(mergedPRs * 1.5, 40); // Up to 40 points for PRs
        const issueScore = Math.min(issuesCreated * 1, 20); // Up to 20 points for issues
        const impactScore = prScore + issueScore;

        // Community Score (0-40 points)
        // Stars and followers show community recognition
        const starScore = Math.min(totalStars * 0.3, 25); // Up to 25 points for stars
        const followerScore = Math.min(followers * 0.05, 15); // Up to 15 points for followers
        const communityScore = starScore + followerScore;

        // Collaboration Score (0-30 points)
        // Repository ownership and contributions to other repos
        const repoScore = Math.min(repoCount * 2, 15); // Up to 15 points for own repos
        const contribScore = Math.min(contributedRepos * 0.5, 15); // Up to 15 points for contributions
        const collaborationScore = repoScore + contribScore;

        return {
            activity: Math.round(activityScore),
            impact: Math.round(impactScore),
            community: Math.round(communityScore),
            collaboration: Math.round(collaborationScore)
        };
    }

    private static calculateOnchainScore(onchain: OnchainStats) {
        const {
            ethBalance = "0",
            txCount = 0,
            isContractDeployer = false,
            contractDeployments = 0,
            daoVotes = 0,
            tokenBalances = []
        } = onchain;

        // Convert ETH balance (handle wei conversion)
        const rawEthBalance = parseFloat(ethBalance);
        const actualEthBalance = rawEthBalance > 1000000 ? rawEthBalance / 1e18 : rawEthBalance;

        // Calculate stablecoin holdings
        const stablecoinValue = tokenBalances.reduce((sum, token) => {
            if (['USDC', 'DAI', 'USDT', 'USDP', 'FRAX'].includes(token.symbol.toUpperCase())) {
                return sum + (token.balance || 0);
            }
            return sum;
        }, 0);

        // Calculate other token values (simplified - treating as $1 each for scoring)
        const otherTokenValue = tokenBalances.reduce((sum, token) => {
            if (!['USDC', 'DAI', 'USDT', 'USDP', 'FRAX'].includes(token.symbol.toUpperCase())) {
                return sum + (token.balance || 0);
            }
            return sum;
        }, 0);

        // Wealth Score (0-100 points)
        let wealthScore = 0;
        
        // ETH scoring with progressive tiers
        if (actualEthBalance > 0) {
            if (actualEthBalance < 1) {
                wealthScore += actualEthBalance * 10; // 0-10 points
            } else if (actualEthBalance < 10) {
                wealthScore += 10 + (actualEthBalance - 1) * 5; // 10-55 points
            } else if (actualEthBalance < 100) {
                wealthScore += 55 + (actualEthBalance - 10) * 2; // 55-235 points
            } else {
                wealthScore += 235 + Math.log10(actualEthBalance / 100) * 30; // 235+ points
            }
        }

        // Stablecoin scoring
        if (stablecoinValue > 0) {
            if (stablecoinValue < 1000) {
                wealthScore += stablecoinValue * 0.01; // 0-10 points
            } else if (stablecoinValue < 50000) {
                wealthScore += 10 + (stablecoinValue - 1000) * 0.002; // 10-108 points
            } else {
                wealthScore += 108 + Math.log10(stablecoinValue / 50000) * 25; // 108+ points
            }
        }

        // Other tokens (smaller weight)
        wealthScore += Math.min(otherTokenValue * 0.001, 20);
        wealthScore = Math.min(wealthScore, 200);

        // Activity Score (0-50 points)
        let activityScore = 0;
        if (txCount > 0) {
            if (txCount < 100) {
                activityScore = txCount * 0.2; // 0-20 points
            } else if (txCount < 1000) {
                activityScore = 20 + (txCount - 100) * 0.05; // 20-65 points
            } else {
                activityScore = 65 + Math.log10(txCount / 1000) * 15; // 65+ points
            }
        }
        activityScore = Math.min(activityScore, 80);

        // Technical Score (0-80 points)
        let technicalScore = 0;
        if (isContractDeployer) {
            technicalScore += 40; // Base contract deployment bonus
            technicalScore += Math.min(contractDeployments * 10, 30); // Additional deployments
        }
        if (onchain.hasNFTs) {
            technicalScore += 10; // NFT interaction bonus
        }

        // Governance Score (0-30 points)
        const governanceScore = Math.min(daoVotes * 2, 30);

        return {
            wealth: Math.round(wealthScore),
            activity: Math.round(activityScore),
            technical: Math.round(technicalScore),
            governance: Math.round(governanceScore)
        };
    }

    private static determineRole(
        github: GitHubStats, 
        onchain: OnchainStats, 
        githubScore: number, 
        onchainScore: number
    ): { role: ZKScoreResult['role'], confidence: number } {
        
        const totalContributions = github.totalContributions || 0;
        const mergedPRs = github.mergedPRs || 0;
        const issuesCreated = github.issuesCreated || 0;
        const totalStars = github.topRepos?.reduce((sum, repo) => sum + (repo.stargazerCount || 0), 0) || 0;
        
        const rawEthBalance = parseFloat(onchain.ethBalance || "0");
        const actualEthBalance = rawEthBalance > 1000000 ? rawEthBalance / 1e18 : rawEthBalance;
        const stablecoinValue = onchain.tokenBalances?.reduce((sum, token) => {
            if (['USDC', 'DAI', 'USDT', 'USDP', 'FRAX'].includes(token.symbol.toUpperCase())) {
                return sum + (token.balance || 0);
            }
            return sum;
        }, 0) || 0;

        const txCount = onchain.txCount || 0;
        const isContractDeployer = onchain.isContractDeployer || false;
        const contractDeployments = onchain.contractDeployments || 0;

        // Role determination logic
        let role: ZKScoreResult['role'] = 'Contributor';
        let confidence = 50;

        // Founder criteria: Strong GitHub + meaningful onchain presence + technical activity
        const isFounderGitHub = (
            totalContributions >= this.GITHUB_THRESHOLDS.FOUNDER_MIN_CONTRIBUTIONS &&
            (github.topRepos?.length || 0) >= this.GITHUB_THRESHOLDS.FOUNDER_MIN_REPOS &&
            totalStars >= this.GITHUB_THRESHOLDS.FOUNDER_MIN_STARS
        );
        
        const isFounderOnchain = (
            actualEthBalance >= this.ONCHAIN_THRESHOLDS.FOUNDER_MIN_ETH &&
            txCount >= this.ONCHAIN_THRESHOLDS.FOUNDER_MIN_TXS &&
            (isContractDeployer || contractDeployments > 0)
        );

        // Investor criteria: Significant wealth + active trading, limited GitHub
        const isInvestorWealth = (
            actualEthBalance >= this.ONCHAIN_THRESHOLDS.INVESTOR_MIN_ETH ||
            stablecoinValue >= this.ONCHAIN_THRESHOLDS.INVESTOR_MIN_STABLECOINS
        );
        
        const isInvestorActive = txCount >= this.ONCHAIN_THRESHOLDS.INVESTOR_MIN_TXS;
        const hasLimitedGitHub = (
            totalContributions < this.GITHUB_THRESHOLDS.CONTRIBUTOR_MIN_CONTRIBUTIONS ||
            mergedPRs < this.GITHUB_THRESHOLDS.CONTRIBUTOR_MIN_PRS
        );

        // Contributor criteria: Strong GitHub activity
        const isContributorGitHub = (
            totalContributions >= this.GITHUB_THRESHOLDS.CONTRIBUTOR_MIN_CONTRIBUTIONS &&
            (mergedPRs >= this.GITHUB_THRESHOLDS.CONTRIBUTOR_MIN_PRS || 
             issuesCreated >= this.GITHUB_THRESHOLDS.CONTRIBUTOR_MIN_ISSUES)
        );

        // Determine role with priority: Founder > Investor > Contributor
        if (isFounderGitHub && isFounderOnchain) {
            role = 'Founder';
            confidence = 85 + Math.min(10, (githubScore + onchainScore) / 50);
        } else if (isInvestorWealth && isInvestorActive && hasLimitedGitHub) {
            role = 'Investor';
            confidence = 80 + Math.min(15, onchainScore / 20);
        } else if (isContributorGitHub) {
            role = 'Contributor';
            confidence = 75 + Math.min(20, githubScore / 15);
        } else {
            // Fallback based on dominant score
            if (onchainScore > githubScore * 2 && onchainScore > 50) {
                role = 'Investor';
                confidence = Math.min(70, 50 + onchainScore / 10);
            } else if (githubScore > onchainScore && githubScore > 30) {
                role = 'Contributor';
                confidence = Math.min(70, 50 + githubScore / 10);
            } else {
                role = 'Contributor'; // Default
                confidence = 50;
            }
        }

        return { 
            role, 
            confidence: Math.max(50, Math.min(95, Math.round(confidence))) 
        };
    }
}

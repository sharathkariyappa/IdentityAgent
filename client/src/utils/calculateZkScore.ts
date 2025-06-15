// calculateZkscore.ts - Fixed ZK Score Calculator with Corrected Role Detection

interface GitHubStats {
    totalContributions?: number;
    topRepos?: { stargazerCount?: number }[];
    mergedPRs?: number;
    issuesCreated?: number;
    followers?: number;
    contributedRepos?: number;
}

interface OnchainStats {
    balance?: string;
    txCount?: number;
    isContractDeployer?: boolean;
    hasNFTs?: boolean;
    tokenBalances?: { symbol: string; balance: number }[];
}

interface ZKScoreResult {
    totalScore: number;
    githubScore: number;
    onchainScore: number;
    role: 'Contributor' | 'Investor' | 'Founder' | 'Newcomer';
    roleConfidence: number;
    breakdown: {
        github: {
            contributions: number;
            repositories: number;
            community: number;
            impact: number;
        };
        onchain: {
            activity: number;
            wealth: number;
            defi: number;
            technical: number;
        };
    };
}

export class ZKScoreCalculator {
    // Scoring weights for different categories
    private static readonly WEIGHTS = {
        github: {
            contributions: 0.3,
            repos: 3,
            stars: 2,
            prs: 8,
            issues: 4,
            followers: 1.5,
            contributedRepos: 6
        },
        onchain: {
            txCount: 0.05,
            ethBalance: 50,
            tokenValue: 0.005,
            contractDeployer: 40,
            nfts: 20
        }
    };

    // Fixed role thresholds - more realistic for actual classification
    private static readonly ROLE_THRESHOLDS = {
        github: {
            minimal: 10,    // Very basic activity
            low: 50,        // Some meaningful activity  
            medium: 150,    // Solid contributor
            high: 400       // Very active contributor
        },
        onchain: {
            minimal: 5,     // Very basic activity
            low: 25,        // Some meaningful activity
            medium: 75,     // Active user
            high: 200       // Power user
        }
    };

    /**
     * Calculate ZK Score and determine role
     */
    public static calculateZkScore(github: GitHubStats, onchain: OnchainStats): ZKScoreResult {
        // Calculate GitHub score components
        const githubBreakdown = this.calculateGitHubScore(github);
        const githubScore = Object.values(githubBreakdown).reduce((sum, val) => sum + val, 0);

        // Calculate Onchain score components
        const onchainBreakdown = this.calculateOnchainScore(onchain);
        const onchainScore = Object.values(onchainBreakdown).reduce((sum, val) => sum + val, 0);

        const totalScore = Math.round(githubScore + onchainScore);

        // Determine role based on score distribution
        const { role, confidence } = this.determineRole(githubScore, onchainScore);

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

    /**
     * Calculate GitHub-specific scores
     */
    private static calculateGitHubScore(github: GitHubStats) {
        const contributions = github?.totalContributions || 0;
        const repos = github?.topRepos?.length || 0;
        const stars = github?.topRepos?.reduce((sum, repo) => sum + (repo.stargazerCount || 0), 0) || 0;
        const prs = github?.mergedPRs || 0;
        const issues = github?.issuesCreated || 0;
        const followers = github?.followers || 0;
        const contributedRepos = github?.contributedRepos || 0;

        return {
            contributions: contributions * this.WEIGHTS.github.contributions,
            repositories: repos * this.WEIGHTS.github.repos,
            community: (stars * this.WEIGHTS.github.stars) + (followers * this.WEIGHTS.github.followers),
            impact: (prs * this.WEIGHTS.github.prs) + (issues * this.WEIGHTS.github.issues) + 
                   (contributedRepos * this.WEIGHTS.github.contributedRepos)
        };
    }

    /**
     * Calculate Onchain-specific scores
     */
    private static calculateOnchainScore(onchain: OnchainStats) {
        const ethBalance = parseFloat(onchain?.balance?.toString() || '0');
        const txCount = onchain?.txCount || 0;
        const isContractDeployer = onchain?.isContractDeployer || false;
        const hasNFTs = onchain?.hasNFTs || false;

        // Calculate total stablecoin value
        const stablecoinValue = onchain?.tokenBalances?.reduce((sum, token) => {
            if (['USDC', 'DAI', 'USDT'].includes(token.symbol)) {
                return sum + (token.balance || 0);
            }
            return sum;
        }, 0) || 0;

        return {
            activity: txCount * this.WEIGHTS.onchain.txCount,
            wealth: (ethBalance * this.WEIGHTS.onchain.ethBalance) + 
                   (stablecoinValue * this.WEIGHTS.onchain.tokenValue),
            defi: stablecoinValue > 1000 ? Math.log10(stablecoinValue) * 10 : 0,
            technical: (isContractDeployer ? this.WEIGHTS.onchain.contractDeployer : 0) + 
                      (hasNFTs ? this.WEIGHTS.onchain.nfts : 0)
        };
    }

    /**
     * FIXED: Determine user role based on GitHub vs Onchain score distribution
     */
    private static determineRole(githubScore: number, onchainScore: number): { role: ZKScoreResult['role'], confidence: number } {
        const { github: ghThresh, onchain: ocThresh } = this.ROLE_THRESHOLDS;

        // Classify GitHub activity level
        const githubLevel = githubScore >= ghThresh.high ? 'high' : 
                           githubScore >= ghThresh.medium ? 'medium' : 
                           githubScore >= ghThresh.low ? 'low' : 
                           githubScore >= ghThresh.minimal ? 'minimal' : 'none';

        // Classify Onchain activity level  
        const onchainLevel = onchainScore >= ocThresh.high ? 'high' : 
                            onchainScore >= ocThresh.medium ? 'medium' : 
                            onchainScore >= ocThresh.low ? 'low' : 
                            onchainScore >= ocThresh.minimal ? 'minimal' : 'none';

        let role: ZKScoreResult['role'];
        let confidence: number;

        // CORRECTED LOGIC: Check for zero/minimal onchain activity first
        if (onchainScore <= 5 && githubScore >= ghThresh.minimal) {
            // Clear GitHub activity with essentially zero onchain = Contributor
            role = 'Contributor';
            if (githubScore >= ghThresh.high) {
                confidence = 95;
            } else if (githubScore >= ghThresh.medium) {
                confidence = 90;
            } else if (githubScore >= ghThresh.low) {
                confidence = 82;
            } else {
                confidence = 75;
            }
        }
        // Check for zero/minimal GitHub activity with onchain activity
        else if (githubScore <= 10 && onchainScore >= ocThresh.minimal) {
            // Clear onchain activity with essentially zero GitHub = Investor
            role = 'Investor';
            if (onchainScore >= ocThresh.high) {
                confidence = 93;
            } else if (onchainScore >= ocThresh.medium) {
                confidence = 88;
            } else if (onchainScore >= ocThresh.low) {
                confidence = 80;
            } else {
                confidence = 72;
            }
        }
        // Both have significant activity
        else if (githubLevel >= 'medium' && onchainLevel >= 'medium') {
            role = 'Founder';
            const balanceRatio = Math.min(githubScore, onchainScore) / Math.max(githubScore, onchainScore);
            confidence = Math.min(95, 70 + (balanceRatio * 25));
        }
        // Determine primary strength when both have some activity
        else if (githubLevel >= 'low' && onchainLevel >= 'low') {
            const githubDominance = githubScore / (githubScore + onchainScore);
            if (githubDominance > 0.75) {
                role = 'Contributor';
                confidence = Math.min(85, 60 + (githubScore / 8));
            } else if (githubDominance < 0.25) {
                role = 'Investor';
                confidence = Math.min(85, 60 + (onchainScore / 6));
            } else {
                // Balanced but not high enough for Founder
                role = githubScore > onchainScore ? 'Contributor' : 'Investor';
                confidence = Math.min(75, 50 + Math.abs(githubScore - onchainScore) / 10);
            }
        }
        // Single area activity (low level)
        else if (githubLevel >= 'minimal' && onchainLevel === 'none') {
            role = 'Contributor';
            confidence = Math.min(80, 50 + (githubScore / 10));
        }
        else if (onchainLevel >= 'minimal' && githubLevel === 'none') {
            role = 'Investor';  
            confidence = Math.min(80, 50 + (onchainScore / 8));
        }
        // Very minimal activity in both or neither
        else {
            role = 'Newcomer';
            confidence = Math.max(85, 95 - (githubScore + onchainScore) / 4);
        }

        return { role, confidence: Math.round(confidence) };
    }

    /**
     * Generate ZK-friendly hash of the calculation (for potential circom integration)
     */
    public static generateProofInputs(github: GitHubStats, onchain: OnchainStats) {
        const inputs = {
            contributions: github?.totalContributions || 0,
            repos: github?.topRepos?.length || 0,
            stars: github?.topRepos?.reduce((sum, repo) => sum + (repo.stargazerCount || 0), 0) || 0,
            prs: github?.mergedPRs || 0,
            issues: github?.issuesCreated || 0,
            followers: github?.followers || 0,
            contributedRepos: github?.contributedRepos || 0,
            
            ethBalance: Math.round((parseFloat(onchain?.balance?.toString() || '0')) * 1000),
            txCount: onchain?.txCount || 0,
            isContractDeployer: onchain?.isContractDeployer ? 1 : 0,
            hasNFTs: onchain?.hasNFTs ? 1 : 0,
            stablecoinBalance: Math.round((onchain?.tokenBalances?.reduce((sum, token) => {
                if (['USDC', 'DAI', 'USDT'].includes(token.symbol)) {
                    return sum + (token.balance || 0);
                }
                return sum;
            }, 0) || 0) * 100)
        };

        return inputs;
    }

    /**
     * Create a simple hash for ZK proof
     */
    public static createScoreHash(result: ZKScoreResult): string {
        const dataString = `${result.totalScore}-${result.githubScore}-${result.onchainScore}-${result.role}`;
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
}

// Legacy function for backward compatibility
export function calculateZkScore(github: GitHubStats, onchain: OnchainStats): number {
    const result = ZKScoreCalculator.calculateZkScore(github, onchain);
    return result.totalScore;
}

// Role descriptions for UI display
export const ROLE_DESCRIPTIONS = {
    Founder: {
        description: "High activity in both development and onchain. Likely building and using DeFi protocols.",
        characteristics: ["Active developer", "Significant capital", "Technical expertise", "Market participant"]
    },
    Contributor: {
        description: "Strong GitHub presence with minimal onchain activity. Focused on building.",
        characteristics: ["Open source contributor", "Technical skills", "Limited trading", "Developer-focused"]
    },
    Investor: {
        description: "High onchain activity with limited development. Focused on DeFi and trading.",
        characteristics: ["Active trader", "DeFi user", "Capital deployment", "Market-focused"]
    },
    Newcomer: {
        description: "Limited activity in both areas. New to the ecosystem or exploring.",
        characteristics: ["Learning phase", "Minimal activity", "Potential growth", "Ecosystem explorer"]
    }
};

export default ZKScoreCalculator;
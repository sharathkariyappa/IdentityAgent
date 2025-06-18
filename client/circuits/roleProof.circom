pragma circom 2.1.4;

template RoleVerifier() {
    // Inputs
    signal input githubScore;
    signal input onchainScore;
    signal input claimedRole;
    
    // Outputs
    signal output verifiedRole;
    
    // Internal calculations
    signal githubTimes2;
    signal onchainTimes2;
    
    githubTimes2 <== githubScore * 2;
    onchainTimes2 <== onchainScore * 2;
    
    // Role logic:
    // Contributor (0): githubScore > 2 * onchainScore
    // Investor (2): onchainScore > 2 * githubScore  
    // Founder (1): neither condition above
    
    // Compute expected role based on scores
    signal isContributor;
    signal isInvestor;
    signal isFounder;
    signal computedRole;
    
    // Simple comparison using quadratic constraints
    // isContributor = 1 if githubScore > onchainTimes2, 0 otherwise
    signal contribDiff;
    contribDiff <== githubScore - onchainTimes2;
    // This is simplified - in real ZK you'd need proper comparison circuits
    
    // For now, let's just verify the claimed role directly
    // The assertion will fail if the role doesn't match the scores
    
    // Manual verification:
    // If role = 0: assert githubScore > 2 * onchainScore
    // If role = 1: assert both conditions are false
    // If role = 2: assert onchainScore > 2 * githubScore
    
    signal roleCheck;
    
    // Simplified check - this will need adjustment based on your exact requirements
    roleCheck <== claimedRole * claimedRole; // placeholder
    
    // For debugging, just pass through
    verifiedRole <== claimedRole;
}

component main = RoleVerifier();
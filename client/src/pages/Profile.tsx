import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { groth16 } from 'snarkjs';
import { User, Shield, AlertCircle, CheckCircle, Loader2, Wallet, Github, Zap } from 'lucide-react';
import { useAccount } from 'wagmi';

// Type definitions
interface UserProfile {
  githubUser?: string;
  [key: string]: any;
}

interface ZKCache {
  role: string;
  status: VerificationStatus;
}

type VerificationStatus = 'loading' | 'success' | 'error';
type RoleType = 'Contributor' | 'Founder' | 'Investor' | 'Unknown' | 'Invalid ZK Proof' | 'ZK verification failed' | 'Verifying...';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

interface StatusIconProps {
  status: VerificationStatus;
}

const roles: string[] = ['Contributor', 'Founder', 'Investor'];

// Role colors for better visual hierarchy - updated to match sidebar style
const roleColors: Record<RoleType, string> = {
  'Contributor': 'from-blue-600 to-cyan-600',
  'Founder': 'from-purple-600 to-pink-600',
  'Investor': 'from-green-600 to-emerald-600',
  'Unknown': 'from-gray-600 to-gray-700',
  'Invalid ZK Proof': 'from-red-600 to-red-700',
  'ZK verification failed': 'from-red-600 to-red-700',
  'Verifying...': 'from-gray-600 to-gray-700'
};

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-white/20 rounded-xl w-3/4 mb-3"></div>
    <div className="h-4 bg-white/20 rounded-xl w-1/2"></div>
  </div>
);

// Error display component
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="flex items-center space-x-3 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl">
    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm text-red-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-200 hover:text-white underline mt-2 transition-colors duration-200"
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Status icon component
const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  if (status === 'loading') {
    return <Loader2 className="w-6 h-6 animate-spin text-purple-400" />;
  }
  if (status === 'success') {
    return <CheckCircle className="w-6 h-6 text-green-400" />;
  }
  if (status === 'error') {
    return <AlertCircle className="w-6 h-6 text-red-400" />;
  }
  return <Shield className="w-6 h-6 text-gray-400" />;
};

// Wallet not connected component
const WalletNotConnected: React.FC = () => (
  <div className="text-center py-16">
    <div className="relative mb-8">
      <div className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl w-24 h-24 mx-auto flex items-center justify-center border border-white/10">
        <Wallet className="w-12 h-12 text-purple-300" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl transform rotate-6"></div>
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h3>
    <p className="text-gray-300 mb-6 leading-relaxed">
      Please connect your wallet to view your profile information
    </p>
    <div className="text-sm text-gray-400 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
      Your GitHub username and ZK verified role will appear here once connected
    </div>
  </div>
);

const Profile: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [role, setRole] = useState<RoleType>('Verifying...');
  const [githubUsername, setGithubUsername] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('loading');
  const [zkCache, setZkCache] = useState<ZKCache | null>(null);

  // Memoized role styling to prevent recalculation
  const roleGradient = useMemo((): string => 
    roleColors[role as RoleType] || roleColors['Unknown'],
    [role]
  );

  const loadGithubData = useCallback((): void => {
    try {
      const userProfileString: string | null = sessionStorage.getItem('userProfile') || 
                                              localStorage.getItem('userProfile');
      
      if (userProfileString) {
        const userProfile: UserProfile = JSON.parse(userProfileString);
        setGithubUsername(userProfile.githubUser || 'Unknown User');
      } else {
        setGithubUsername('Not Available');
      }
    } catch (err) {
      console.error('Error parsing userProfile:', err);
      setGithubUsername('Error Loading');
      setError('Failed to load GitHub profile');
    }
  }, []);

  const verifyProof = useCallback(async (): Promise<void> => {
    // Check cache first
    if (zkCache) {
      setRole(zkCache.role as RoleType);
      setVerificationStatus(zkCache.status);
      return;
    }

    try {
      setVerificationStatus('loading');
      let proof: any, publicSignals: any;

      // Try memory storage first (sessionStorage is faster)
      const proofString: string | null = sessionStorage.getItem("zkProof") || 
                                        localStorage.getItem("zkProof");
      const publicSignalsString: string | null = sessionStorage.getItem("zkPublicSignals") || 
                                                 localStorage.getItem("zkPublicSignals");

      if (proofString && publicSignalsString) {
        proof = JSON.parse(proofString);
        publicSignals = JSON.parse(publicSignalsString);
      } else {
        // Parallel fetch for better performance
        const [proofRes, publicRes]: [Response, Response] = await Promise.all([
          fetch('/zk/proof.json'),
          fetch('/zk/public.json')
        ]);

        if (!proofRes.ok || !publicRes.ok) {
          throw new Error('Failed to fetch ZK proof files');
        }

        [proof, publicSignals] = await Promise.all([
          proofRes.json(),
          publicRes.json()
        ]);
      }

      // Load verification key with timeout
      const vKeyController = new AbortController();
      const timeoutId = setTimeout(() => vKeyController.abort(), 10000);

      try {
        const vKeyRes: Response = await fetch('/zk/verification_key.json', {
          signal: vKeyController.signal
        });
        clearTimeout(timeoutId);

        if (!vKeyRes.ok) {
          throw new Error('Failed to fetch verification key');
        }

        const vKey: any = await vKeyRes.json();
        const verified: boolean = await groth16.verify(vKey, publicSignals, proof);

        if (verified) {
          const roleIndex: number = Number(publicSignals[0]);
          const verifiedRole: string = roles[roleIndex] || 'Unknown';
          setRole(verifiedRole as RoleType);
          setVerificationStatus('success');
          
          // Cache the result
          setZkCache({ role: verifiedRole, status: 'success' });
        } else {
          setRole('Invalid ZK Proof');
          setVerificationStatus('error');
          setZkCache({ role: 'Invalid ZK Proof', status: 'error' });
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }

    } catch (error: unknown) {
      console.error('ZK verification error:', error);
      const errorRole: RoleType = 'ZK verification failed';
      const errorMessage: string = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setRole(errorRole);
      setVerificationStatus('error');
      setError(`Verification failed: ${errorMessage}`);
      setZkCache({ role: errorRole, status: 'error' });
    }
  }, [zkCache]);

  const retryVerification = useCallback((): void => {
    setError(null);
    setZkCache(null); // Clear cache to force retry
    verifyProof();
  }, [verifyProof]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setRole('Verifying...');
      setGithubUsername('Loading...');
      setIsLoading(true);
      setError(null);
      setVerificationStatus('loading');
      setZkCache(null);
    }
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) return;

    const initializeProfile = async (): Promise<void> => {
      setIsLoading(true);
      loadGithubData();
      await verifyProof();
      setIsLoading(false);
    };

    initializeProfile();
  }, [isConnected, loadGithubData, verifyProof]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-6 w-full">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-gray-400 text-sm mt-1">ZK Verified Identity</p>
              </div>
            </div>
            
            {isConnected && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-2xl border border-green-500/30">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-300 font-medium">Connected</span>
              </div>
            )}
          </div>

          {/* Content */}
          {!isConnected ? (
            <WalletNotConnected />
          ) : (
            <div className="space-y-8">
              {/* GitHub Section */}
              <div className="group">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <label className="text-lg font-semibold text-gray-200">GitHub Username</label>
                </div>
                
                {isLoading && githubUsername === 'Loading...' ? (
                  <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <LoadingSkeleton />
                  </div>
                ) : (
                  <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover:border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center">
                        <Github className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xl text-white font-mono">{githubUsername}</span>
                        <p className="text-sm text-gray-400 mt-1">GitHub Profile</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ZK Verification Section */}
              <div className="group">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl">
                    <StatusIcon status={verificationStatus} />
                  </div>
                  <label className="text-lg font-semibold text-gray-200">ZK Verified Role</label>
                </div>
                
                {error ? (
                  <ErrorDisplay message={error} onRetry={retryVerification} />
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-105">
                    <div className={`p-6 bg-gradient-to-r ${roleGradient} relative`}>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                              <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <span className="text-2xl font-bold text-white">{role}</span>
                              <p className="text-white/80 text-sm mt-1">Verified Role</p>
                            </div>
                          </div>
                          {verificationStatus === 'loading' && (
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                          )}
                        </div>
                      </div>
                      
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Status Footer */}
              {verificationStatus === 'success' && (
                <div className="flex items-center justify-center space-x-2 p-4 bg-green-500/10 backdrop-blur-sm rounded-2xl border border-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">Cryptographically Verified</span>
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
              )}

              {/* Wallet Address Display */}
              {address && (
                <div className="p-6 bg-blue-500/10 backdrop-blur-sm rounded-2xl border border-blue-500/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg font-semibold text-blue-300">Connected Wallet</div>
                  </div>
                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="text-blue-200 font-mono text-lg break-all">
                      {address.slice(0, 8)}...{address.slice(-6)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
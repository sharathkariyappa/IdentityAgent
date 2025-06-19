import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { groth16 } from 'snarkjs';
import { User, Shield, AlertCircle, CheckCircle, Loader2, Github, Zap } from 'lucide-react';
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

// Role colors for better visual hierarchy
const roleColors: Record<RoleType, string> = {
  'Contributor': 'from-blue-500 to-cyan-500',
  'Founder': 'from-purple-500 to-pink-500',
  'Investor': 'from-green-500 to-emerald-500',
  'Unknown': 'from-gray-500 to-gray-600',
  'Invalid ZK Proof': 'from-red-500 to-red-600',
  'ZK verification failed': 'from-red-500 to-red-600',
  'Verifying...': 'from-gray-500 to-gray-600'
};

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
  </div>
);

// Error display component
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-600 hover:text-red-800 underline mt-1"
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
    return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
  }
  if (status === 'success') {
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  }
  if (status === 'error') {
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  }
  return <Shield className="w-4 h-4 text-gray-500" />;
};

// Wallet not connected component
const WalletNotConnected: React.FC = () => (
  <div className="text-center py-8">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <User className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Not Connected</h3>
    <p className="text-gray-600 text-sm mb-4">
      Please connect your wallet to view your profile information
    </p>
    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
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
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-600">ZK Verified Identity</p>
          </div>
          {isConnected && (
            <div className="ml-auto flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-700 font-medium">Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!isConnected ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <WalletNotConnected />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GitHub Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Github className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">GitHub Profile</h3>
              </div>
              
              {isLoading && githubUsername === 'Loading...' ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <LoadingSkeleton />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Github className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-mono text-gray-900 font-medium">{githubUsername}</div>
                    <div className="text-sm text-gray-600">GitHub Username</div>
                  </div>
                </div>
              )}
            </div>

            {/* ZK Verification Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <StatusIcon status={verificationStatus} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">ZK Verified Role</h3>
              </div>
              
              {error ? (
                <ErrorDisplay message={error} onRetry={retryVerification} />
              ) : (
                <div className="relative overflow-hidden rounded-lg">
                  <div className={`p-4 bg-gradient-to-r ${roleGradient} text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{role}</div>
                          <div className="text-white/80 text-sm">Verified Role</div>
                        </div>
                      </div>
                      {verificationStatus === 'loading' && (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification Status Footer */}
        {verificationStatus === 'success' && (
          <div className="mt-6 flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-700 font-medium text-sm">Cryptographically Verified</span>
            <Zap className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
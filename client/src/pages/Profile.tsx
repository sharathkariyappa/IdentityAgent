import React, { useEffect, useState, useCallback } from 'react';
import { groth16 } from 'snarkjs';
import { User, Shield, AlertCircle, CheckCircle, Loader2, Github, Award, Copy, Check, Globe, Hash, Eye, Key, Download,Fingerprint} from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { createProfileWorkflowSimple, loadProfileFromIPFS } from '../utils/ceramic';

// Type definitions
interface UserProfile {
  did: string;
  github: string;
  role: string;
  address: string;
  network: string;
  timestamp: number;
}

interface ProfileData {
  profile: UserProfile;
  verifiableCredential: string;
  metadata: {
    created: string;
    version: string;
    type: string;
    network: string;
  };
}

interface ZKProofDetails {
  proof: any;
  publicSignals: any;
  verified: boolean;
  verificationTime: number;
  circuit: string;
}

type VerificationStatus = 'loading' | 'success' | 'error' | 'idle';
type RoleType = 'Contributor' | 'Founder' | 'Investor' | 'Unknown' | 'Invalid ZK Proof' | 'ZK verification failed' | 'Verifying...';

const roles: string[] = ['Contributor', 'Founder', 'Investor'];

const roleColors: Record<RoleType, string> = {
  'Contributor': 'from-blue-500 to-cyan-500',
  'Founder': 'from-purple-500 to-pink-500',
  'Investor': 'from-green-500 to-emerald-500',
  'Unknown': 'from-gray-500 to-gray-600',
  'Invalid ZK Proof': 'from-red-500 to-red-600',
  'ZK verification failed': 'from-red-500 to-red-600',
  'Verifying...': 'from-yellow-500 to-orange-500'
};
const StatusIcon: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  if (status === 'loading') return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
  if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
  return <Shield className="w-4 h-4 text-gray-500" />;
};

const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = "Copy" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-gray-100 rounded transition-colors"
      title={label}
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3 text-gray-500" />
      )}
    </button>
  );
};

// Verified Badge Component
const VerifiedBadge: React.FC<{ isValid: boolean; vcJwt?: string }> = ({ isValid, vcJwt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyVC = useCallback(() => {
    if (vcJwt) {
      navigator.clipboard.writeText(vcJwt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [vcJwt]);

  if (!isValid) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full border border-red-200">
        <AlertCircle className="w-3 h-3 text-red-500" />
        <span className="text-xs text-red-700 font-medium">Invalid VC</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
        <Award className="w-3 h-3 text-green-500" />
        <span className="text-xs text-green-700 font-medium">Verified VC</span>
      </div>
      {vcJwt && (
        <button
          onClick={handleCopyVC}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Copy Verifiable Credential"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 text-gray-500" />
          )}
        </button>
      )}
    </div>
  );
};

// Data display card component
const DataCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  className?: string;
  gradient?: string;
}> = ({ title, icon, children, className = "", gradient = "from-gray-50 to-blue-50" }) => (
  <div className={`bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 ${className}`}>
    <div className="flex items-center space-x-3 mb-4">
      <div className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
    </div>
    {children}
  </div>
);

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
  </div>
);

// Error display component
const ErrorDisplay: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-sm text-red-700 font-medium mb-1">Verification Failed</p>
      <p className="text-xs text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-600 hover:text-red-800 underline mt-2 font-medium"
          type="button"
        >
          Retry Verification
        </button>
      )}
    </div>
  </div>
);

// Wallet not connected component
const WalletNotConnected: React.FC = () => (
  <div className="text-center py-12">
    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <User className="w-10 h-10 text-gray-500" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect Your Wallet</h3>
    <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
      Connect your wallet to view your ZK-verified profile, GitHub credentials, and decentralized identity
    </p>
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>ZK Proofs</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="flex items-center space-x-1">
          <Github className="w-3 h-3" />
          <span>GitHub Verification</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="flex items-center space-x-1">
          <Globe className="w-3 h-3" />
          <span>DID Profile</span>
        </div>
      </div>
    </div>
  </div>
);

const Profile: React.FC = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const chainNameMap: Record<number, string> = {
    1: 'mainnet',
    11155111: 'sepolia',
    137: 'polygon',
    10: 'optimism',
  };
  const networkName: "sepolia" | "mainnet" | undefined = chainNameMap[chainId] as "sepolia" | "mainnet" | undefined || 'sepolia';
  // console.log('Current network:', networkName);

  // ZK Proof state
  const [zkRole, setZkRole] = useState<RoleType>('Unknown');
  const [zkStatus, setZkStatus] = useState<VerificationStatus>('idle');
  const [zkError, setZkError] = useState<string | null>(null);
  const [zkProofDetails, setZkProofDetails] = useState<ZKProofDetails | null>(null);
  
  // DID-VC state
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [vcStatus, setVcStatus] = useState<VerificationStatus>('idle');
  const [vcError, setVcError] = useState<string | null>(null);
  const [vcJwt, setVcJwt] = useState<string | null>(null);
  const [isVcValid, setIsVcValid] = useState<boolean>(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [githubUsername, setGithubUsername] = useState<string>('');
  const [showRawData, setShowRawData] = useState<boolean>(false);

  // Load GitHub data from storage
  const loadGithubData = useCallback((): void => {
    try {
      const userProfileString = sessionStorage.getItem('userProfile') || localStorage.getItem('userProfile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        setGithubUsername(userProfile.githubUser || '');
      }
    } catch (err) {
      console.error('Error parsing userProfile:', err);
      setGithubUsername('');
    }
  }, []);

  // ZK Proof verification
  const verifyZKProof = useCallback(async (): Promise<void> => {
    try {
      setZkStatus('loading');
      setZkError(null);

      const proofString = sessionStorage.getItem("zkProof") || localStorage.getItem("zkProof");
      const publicSignalsString = sessionStorage.getItem("zkPublicSignals") || localStorage.getItem("zkPublicSignals");

      if (!proofString || !publicSignalsString) {
        throw new Error('ZK proof not found in storage');
      }

      const proof = JSON.parse(proofString);
      const publicSignals = JSON.parse(publicSignalsString);

      const vKeyRes = await fetch('/zk/verification_key.json');
      if (!vKeyRes.ok) throw new Error('Failed to fetch verification key');
      
      const vKey = await vKeyRes.json();
      const verificationTime = Date.now();
      const verified = await groth16.verify(vKey, publicSignals, proof);

      const zkDetails: ZKProofDetails = {
        proof,
        publicSignals,
        verified,
        verificationTime,
        circuit: 'groth16'
      };

      setZkProofDetails(zkDetails);

      if (verified) {
        const roleIndex = Number(publicSignals[0]);
        const verifiedRole = roles[roleIndex] || 'Unknown';
        setZkRole(verifiedRole as RoleType);
        setZkStatus('success');
      } else {
        setZkRole('Invalid ZK Proof');
        setZkStatus('error');
      }
    } catch (error: unknown) {
      console.error('ZK verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setZkRole('ZK verification failed');
      setZkStatus('error');
      setZkError(errorMessage);
    }
  }, []);

  // Create or fetch DID profile
  const handleDIDProfile = useCallback(async (): Promise<void> => {
    if (!githubUsername || zkRole === 'Unknown' || zkStatus !== 'success') return;

    try {
      setVcStatus('loading');
      setVcError(null);

      // console.log('Creating DID profile with:', { githubUsername, zkRole, address });

      // Try to create VC with GitHub username and verified role
      const result = await createProfileWorkflowSimple(githubUsername, zkRole, networkName);
      console.log(result.ipfsHash)
      localStorage.setItem('ipfsHash', result.ipfsHash);
      // console.log('DID profile result:', result);

      if (result && result.verification) {
        setVcJwt(result.vcJwt || null);
        setIsVcValid(true);
        setVcStatus('success');
        
        // Handle different possible response structures
        if (result.ipfsResult) {
          setProfileData(result.ipfsResult);
        } else if (result.profileData) {
          setProfileData(result.profileData);
        } else {
          const fallbackProfileData: ProfileData = {
            profile: {
              did: result.did || 'Unknown',
              github: githubUsername,
              role: zkRole,
              address: address || '',
              network: networkName,
              timestamp: Date.now()
            },
            verifiableCredential: result.vcJwt || '',
            metadata: {
              created: new Date().toISOString(),
              version: '1.0',
              type: 'VerifiableCredential',
              network: networkName
            }
          };
          // console.log('Using fallback profile data:', fallbackProfileData);
          setProfileData(fallbackProfileData);
        }
      } else {
        throw new Error('VC verification failed - no verification result');
      }
    } catch (error: unknown) {
      console.error('DID profile error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create DID profile';
      setVcError(errorMessage);
      setVcStatus('error');
    }
  }, [githubUsername, zkRole, zkStatus, address]);

  useEffect(() => {
    const ipfsHash = localStorage.getItem('ipfsHash');
    if (ipfsHash) {
      const fetchData = async () => {
        try {
          const result = await loadProfileFromIPFS(ipfsHash);
          if (result) {
            setProfileData(result.profileData);
            setVcStatus('success') 
            setIsVcValid(true)
          }
        } catch (error) {
          console.error('Failed to load profile from IPFS:', error);
        }
      };
      fetchData();
    }
  }, []);
  

  // Export profile data
  const exportProfileData = useCallback(() => {
    const exportData = {
      profile: profileData?.profile,
      zkProof: zkProofDetails,
      verifiableCredential: vcJwt,
      metadata: {
        ...profileData?.metadata,
        exportedAt: new Date().toISOString(),
        walletAddress: address
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-${githubUsername}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [profileData, zkProofDetails, vcJwt, address, githubUsername]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setZkRole('Unknown');
      setZkStatus('idle');
      setZkError(null);
      setZkProofDetails(null);
      setProfileData(null);
      setVcStatus('idle');
      setVcError(null);
      setVcJwt(null);
      setIsVcValid(false);
      setGithubUsername('');
      setIsLoading(false);
      setShowRawData(false);
    }
  }, [isConnected]);

  // Initialize profile when wallet connects
  useEffect(() => {
    if (!isConnected) return;

    const initializeProfile = async () => {
      setIsLoading(true);
      loadGithubData();
      await verifyZKProof();
      setIsLoading(false);
    };

    initializeProfile();
  }, [isConnected, loadGithubData, verifyZKProof]);

  // Create DID profile when ZK verification succeeds
  // useEffect(() => {
  //   if (zkStatus === 'success' && githubUsername && vcStatus === 'idle') {
  //     handleDIDProfile();
  //   }
  // }, [zkStatus, githubUsername, vcStatus, handleDIDProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Dashboard</h1>
              <p className="text-sm text-gray-600">Zero-Knowledge Identity & Verifiable Credentials</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isConnected && profileData && (
              <>
                <button
                  onClick={() => setShowRawData(!showRawData)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    {showRawData ? 'Hide' : 'Show'} Raw Data
                  </span>
                </button>
                <button
                  onClick={exportProfileData}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                >
                  <Download className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Export</span>
                </button>
              </>
            )}
            {isConnected && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {!isConnected ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <WalletNotConnected />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Main Profile Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* GitHub Profile Card */}
              <DataCard 
                title="GitHub Identity" 
                icon={<Github className="w-5 h-5 text-gray-700" />}
                gradient="from-gray-100 to-gray-200"
              >
                {isLoading ? (
                  <LoadingSkeleton />
                ) : githubUsername ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Username</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-semibold">{githubUsername}</span>
                        <CopyButton text={githubUsername} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        Verified
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                    No GitHub username found
                  </p>
                )}
              </DataCard>

              {/* ZK Verification Card */}
              <DataCard 
                title="ZK Verified Role" 
                icon={<Shield className="w-5 h-5 text-purple-700" />}
                gradient="from-purple-100 to-pink-100"
              >
                {zkError ? (
                  <ErrorDisplay message={zkError} onRetry={verifyZKProof} />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Role</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${roleColors[zkRole]}`}>
                          {zkRole}
                        </span>
                        <StatusIcon status={zkStatus} />
                      </div>
                    </div>
                    {zkProofDetails && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Verified</span>
                        <span className="text-xs text-gray-500">
                          {new Date(zkProofDetails.verificationTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </DataCard>

              {/* Wallet Info Card */}
              <DataCard 
                title="Wallet Address" 
                icon={<Key className="w-5 h-5 text-blue-700" />}
                gradient="from-blue-100 to-cyan-100"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Address</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs">
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                      </span>
                      {address && <CopyButton text={address} />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Network</span>
                    <span className="text-xs font-medium text-blue-700">{networkName}</span>
                  </div>
                </div>
              </DataCard>
            </div>

            {/* Verifiable Credential Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <StatusIcon status={vcStatus} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Verifiable Credential</h3>
                    <p className="text-sm text-gray-600">Decentralized identity proof</p>
                  </div>
                </div>
                <VerifiedBadge isValid={isVcValid} vcJwt={vcJwt || undefined} />
              </div>

              {vcError ? (
                <ErrorDisplay message={vcError} onRetry={handleDIDProfile} />
              ) : vcStatus === 'loading' ? (
                <div className="p-6 bg-blue-50/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-blue-700 font-medium">Creating verifiable credential...</span>
                  </div>
                </div>
              ) : vcStatus === 'success' && isVcValid ? (
                <div>
                  {profileData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <DataCard 
                        title="Profile Details" 
                        icon={<User className="w-4 h-4 text-green-700" />}
                        gradient="from-green-100 to-emerald-100"
                        className="bg-transparent border-0 shadow-none p-4"
                      >
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700">GitHub:</span>
                            <span className="font-mono text-green-900">{profileData.profile?.github || githubUsername}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Role:</span>
                            <span className="font-semibold text-green-900">{profileData.profile?.role || zkRole}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Network:</span>
                            <span className="font-mono text-green-900">{profileData.profile?.network || networkName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Address:</span>
                            <span className="font-mono text-xs text-green-900">
                              {profileData.profile?.address ? 
                                `${profileData.profile.address.slice(0, 6)}...${profileData.profile.address.slice(-4)}` : 
                                (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A')
                              }
                            </span>
                          </div>
                        </div>
                      </DataCard>

                      <DataCard 
                        title="DID Information" 
                        icon={<Globe className="w-4 h-4 text-blue-700" />}
                        gradient="from-blue-100 to-purple-100"
                        className="bg-transparent border-0 shadow-none p-4"
                      >
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-blue-700">DID:</span>
                            <div className="font-mono text-xs text-blue-900 mt-1 break-all bg-white/50 p-2 rounded flex items-center justify-between">
                              <span>{profileData.profile?.did ? `${profileData.profile.did.slice(0, 20)}...` : 'Not available'}</span>
                              {profileData.profile?.did && <CopyButton text={profileData.profile.did} />}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Created:</span>
                            <span className="text-xs text-blue-900">
                              {profileData.profile?.timestamp ? 
                                new Date(profileData.profile.timestamp).toLocaleString() : 
                                new Date().toLocaleString()
                              }
                            </span>
                          </div>
                        </div>
                      </DataCard>

                      <DataCard 
                        title="Credential Info" 
                        icon={<Award className="w-4 h-4 text-purple-700" />}
                        gradient="from-purple-100 to-pink-100"
                        className="bg-transparent border-0 shadow-none p-4"
                      >
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-purple-700">Version:</span>
                            <span className="font-mono text-purple-900">{profileData.metadata?.version || '1.0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Type:</span>
                            <span className="text-purple-900">{profileData.metadata?.type || 'VerifiableCredential'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">VC JWT:</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-purple-900">
                                {vcJwt ? 'Available' : 'Not available'}
                              </span>
                              {vcJwt && <CopyButton text={vcJwt} label="Copy VC JWT" />}
                            </div>
                          </div>
                        </div>
                      </DataCard>
                    </div>
                  ) : (
                    <div className="p-6 bg-green-50/50 rounded-xl border border-green-200/50">
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                        <p className="text-green-700 font-medium mb-2">Verifiable Credential Created Successfully!</p>
                        <p className="text-green-600 text-sm mb-4">
                          Your ZK-verified role and GitHub identity have been successfully linked in a verifiable credential.
                        </p>
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                          <div className="p-3 bg-white/50 rounded-lg">
                            <div className="text-xs text-green-700 font-medium">GitHub</div>
                            <div className="font-mono text-sm">@{githubUsername}</div>
                          </div>
                          <div className="p-3 bg-white/50 rounded-lg">
                            <div className="text-xs text-green-700 font-medium">Role</div>
                            <div className="font-semibold">{zkRole}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-gray-50/50 rounded-xl border border-gray-200/50">
                  <div className="text-center">
                    <Hash className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">
                      Verifiable credential will be generated automatically once ZK proof and GitHub identity are verified
                    </p>
                    {zkStatus === 'success' && githubUsername && vcStatus === 'idle' && (
                      <button
                        onClick={handleDIDProfile}
                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Create Verifiable Credential
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Raw Data Section */}
            {showRawData && (profileData || zkProofDetails) && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <Fingerprint className="w-5 h-5" />
                    <span>Raw Data</span>
                  </h3>
                  <button
                    onClick={() => setShowRawData(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {zkProofDetails && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>ZK Proof Details</span>
                      </h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                        <pre className="text-green-400 text-xs font-mono">
                          {JSON.stringify(zkProofDetails, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {profileData && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Profile Data</span>
                      </h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                        <pre className="text-blue-400 text-xs font-mono">
                          {JSON.stringify(profileData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  {vcJwt && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Award className="w-4 h-4" />
                        <span>Verifiable Credential JWT</span>
                      </h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                        <pre className="text-purple-400 text-xs font-mono">
                          {vcJwt}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default Profile;
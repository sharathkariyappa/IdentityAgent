import { useEffect, useState } from 'react';
import { useAccount} from 'wagmi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchGitHubContributorData } from '../utils/fetchGitHubMetrics';
import { fetchOnchainStats } from '../utils/fetchOnchainStats';
// import { RealisticZKScoreCalculator } from '../utils/calculateZkScore';
import * as snarkjs from "snarkjs";
import { 
  Wallet, 
  Github, 
  Shield, 
  Settings, 
  AlertCircle, 
  User,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Loader2
} from 'lucide-react';

// Wallet not connected component with clean styling
const WalletNotConnected = () => (
  <div className="w-full h-full bg-gray-50">
    {/* Header */}
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Welcome to IdentityAgent</h1>
          <p className="text-sm text-gray-600">Zero-Knowledge Verified Profiles</p>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            {/* Hero Icon */}
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Connect your wallet to begin your journey into the world of zero-knowledge verified profiles.
            </p>
            
            {/* Setup Steps */}
            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Shield className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-semibold text-gray-900">Setup Your Profile</h3>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    icon: Github,
                    title: "Link GitHub",
                    description: "Connect your GitHub account to verify contributions",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: User,
                    title: "Select Role",
                    description: "Choose your role: Contributor, Founder, Investor",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Lock,
                    title: "Generate Proof",
                    description: "Create your ZK proof for secure verification",
                    color: "from-purple-500 to-pink-500"
                  }
                ].map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-lg mx-auto mb-4 flex items-center justify-center shadow-sm`}>
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    
                    {/* Step connector */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-lg font-semibold text-green-800">Secure & Private</span>
              </div>
              <p className="text-gray-700">
                Your GitHub data and role are cryptographically verified using zero-knowledge proofs. 
                Your privacy is protected while maintaining verifiable authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [role, setRole] = useState<string>('');
  const [githubLinked, setGithubLinked] = useState(false);
  const [githubUser, setGithubUser] = useState<string | null>(null);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proofStatus, setProofStatus] = useState<string>('');

  const navigate = useNavigate();

  // Fixed witness calculator loader with proper error handling
  const loadWitnessCalculator = async (): Promise<any> => {
    try {
      // Load the witness calculator code as text and modify it for browser
      const response = await fetch("/zk/roleProof_js/witness_calculator.js");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const code = await response.text();
      
      // Replace module.exports with window assignment
      const modifiedCode = code
        .replace(/module\.exports\s*=/, 'window.witnessCalculatorBuilder =')
        .replace(/module\.exports/g, 'window.witnessCalculatorBuilder');
      
      // Execute the modified code
      const script = document.createElement("script");
      script.textContent = modifiedCode;
      document.body.appendChild(script);
      
      // Wait a bit for the script to execute
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!(window as any).witnessCalculatorBuilder) {
        throw new Error("witnessCalculatorBuilder not found on window");
      }
      
      return (window as any).witnessCalculatorBuilder;
    } catch (error) {
      console.error("Failed to load witness calculator:", error);
      throw new Error("Failed to load witness_calculator.js");
    }
  };
  
  useEffect(() => {
    const storedUser = localStorage.getItem('githubUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setGithubUser(parsedUser.login || parsedUser.username);
      setGithubLinked(true);
    }
  }, []);

  const handleLinkGithub = () => {
    const client_id = import.meta.env.VITE_GITHUB_CLIENT_ID;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=https://identitybackend-production.up.railway.app/api/github/callback`;
  };

  function buildFinalProfile (
    githubStats: any,
    onchainStats: any,
  ) {
    return {
      totalContributions: githubStats.totalContributions,
      pullRequests: githubStats.totalPRs,
      issues: githubStats.issuesCreated,
      repositoriesContributedTo: githubStats.contributedRepos,
      followers: githubStats.followers,
      repositories: githubStats.topRepos.length,
      ethBalance: onchainStats.ethBalance,
      txCount: onchainStats.txCount,
      isContractDeployer: onchainStats.isContractDeployer,
      contractDeployments: onchainStats.contractDeployments,
      tokenBalances: onchainStats.tokenBalances.reduce(
        (sum: number, token: any) => sum + token.balance,
        0
      ),
      nftCount: onchainStats.nftCount,
      daoVotes: onchainStats.daoVotes,
      hasNFTs: onchainStats.hasNFTs,
    };
  }

  const saveProfile = async () => {
    const token = localStorage.getItem("access_token");
  
    if (!role || !githubUser || !token || !address) {
      setProofStatus(" Missing required information");
      console.warn("Missing info: role, GitHub user, token, or wallet");
      return;
    }
  
    const profileData = { role, githubUser, wallet: address };
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    setIsGeneratingProof(true);
    setProofStatus("Fetching data...");
  
    try {
      const [githubStats, onchainStats] = await Promise.all([
        fetchGitHubContributorData(token, githubUser),
        fetchOnchainStats(address),
      ]);
      // console.log("GitHub Stats:", githubStats);
      // console.log("Onchain Stats:", onchainStats);
      if (!githubStats) {
        throw new Error("Failed to fetch GitHub stats");
      }

      setProofStatus("Calculating scores...");
      // const result = RealisticZKScoreCalculator.calculateZkScore(githubStats, onchainStats);
      const finalProfile = buildFinalProfile(githubStats, onchainStats);
      // console.log("Final Profile:", finalProfile);
      const flaskResponse = await axios.post("https://identitybackend-production.up.railway.app/api/calculate-role", finalProfile); 
      // console.log("Flask Response:", flaskResponse.data);

      const githubScore = flaskResponse.data.githubScore;
      const onchainScore = flaskResponse.data.onchainScore;
      const calculatedRole = flaskResponse.data.role;
      
      // console.log("GitHub Score:", githubScore);
      // console.log("Onchain Score:", onchainScore);
      // console.log("Calculated Role:", calculatedRole);

      // Convert role strings to numbers for circuit
      const roleToNumber = (roleStr: string): number => {
        switch(roleStr) {
          case "Contributor": return 0;
          case "Founder": return 1;
          case "Investor": return 2;
          default: throw new Error(`Unknown role: ${roleStr}`);
        }
      };

      const claimedRoleNum = roleToNumber(role);
      const calculatedRoleNum = roleToNumber(calculatedRole);

      // Check if claimed role matches calculated role
      if (claimedRoleNum !== calculatedRoleNum) {
        setProofStatus(`Role mismatch: You claimed ${role} but your scores indicate ${calculatedRole}`);
        setIsGeneratingProof(false);
        return;
      }

      // Prepare circuit input
      const input = {
        githubScore: githubScore,
        onchainScore: onchainScore,
        claimedRole: claimedRoleNum
      };

      // console.log("Circuit input:", input);
      setProofStatus("Loading ZK files...");

      // Load ZK files with better error handling
      const [wasmBuffer, zkeyBuffer, verificationKey] = await Promise.all([
        fetch("/zk/roleProof_js/roleProof.wasm").then(res => {
          if (!res.ok) throw new Error(`Failed to load WASM: ${res.status}`);
          return res.arrayBuffer();
        }),
        fetch("/zk/roleProof_final.zkey").then(res => {
          if (!res.ok) throw new Error(`Failed to load zkey: ${res.status}`);
          return res.arrayBuffer();
        }),
        fetch("/zk/verification_key.json").then(res => {
          if (!res.ok) throw new Error(`Failed to load verification key: ${res.status}`);
          return res.json();
        })
      ]);
      // console.log("WASM, Zkey, Verification Key loaded successfully");

      setProofStatus("Calculating witness...");
      const witnessCalculatorBuilder = await loadWitnessCalculator();
      const wc = await witnessCalculatorBuilder(wasmBuffer);
      const witness = await wc.calculateWTNSBin(input, 0);
      // console.log("Witness calculated successfully");
      setProofStatus("Generating ZK proof...");
      const { proof, publicSignals } = await snarkjs.groth16.prove(new Uint8Array(zkeyBuffer), witness);
      // console.log("ZK proof generated successfully");
      // Store proof data
      localStorage.setItem("zkProof", JSON.stringify(proof));
      localStorage.setItem("zkPublicSignals", JSON.stringify(publicSignals));
      // console.log("Proof and public signals stored in localStorage");

      setProofStatus("Verifying proof...");
      const verified = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
      // console.log("Proof verification result:", verified);
      
      if (!verified) {
        throw new Error("ZK proof verification failed");
      }

      // console.log("✅ ZK Proof verified successfully!");
      // console.log("🪪 Proven Role:", publicSignals[0]);
      
      setProofStatus("Proof generated and verified!");
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate("/profile");
      }, 2000);

    } catch (error) {
      console.error("Failed during saveProfile:", error);
      setProofStatus(` Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsGeneratingProof(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('✅')) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status.includes('❌')) return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
  };

  const getStatusColor = (status: string) => {
    if (status.includes('✅')) return 'bg-green-50 border-green-200';
    if (status.includes('❌')) return 'bg-red-50 border-red-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <>
      {isConnected ? (
        <div className="w-full h-full bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Setup Your Profile</h1>
                <p className="text-sm text-gray-600">Complete your zero-knowledge verified profile</p>
              </div>
              <div className="ml-auto flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-700 font-medium">Connected</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* GitHub Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Github className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">GitHub Profile Connection</h3>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handleLinkGithub}
                    disabled={isGeneratingProof}
                    className={`
                      inline-flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200
                      ${githubLinked 
                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }
                      ${isGeneratingProof ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
                    `}
                  >
                    {githubLinked ? <CheckCircle className="w-5 h-5" /> : <Github className="w-5 h-5" />}
                    <span>{githubLinked ? 'GitHub Connected' : 'Connect GitHub'}</span>
                  </button>
                  
                  {githubUser && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">Connected Successfully</p>
                          <p className="text-sm text-green-600">@{githubUser}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Select Your Role</h3>
                </div>
                
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isGeneratingProof}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:bg-gray-50"
                >
                  <option value="">Choose your role...</option>
                  <option value="Investor"> Investor - Fund and support projects</option>
                  <option value="Founder"> Founder - Build and lead projects</option>
                  <option value="Contributor"> Contributor - Develop and contribute code</option>
                </select>
              </div>

              {/* Status Display */}
              {proofStatus && (
                <div className={`p-4 border rounded-lg ${getStatusColor(proofStatus)}`}>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(proofStatus)}
                    <div>
                      <p className="font-medium text-gray-900">Processing Status</p>
                      <p className="text-sm text-gray-600">{proofStatus}</p>
                    </div>
                  </div>
                  
                  {isGeneratingProof && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <button
                  onClick={saveProfile}
                  disabled={isGeneratingProof || !role || !githubLinked}
                  className={`
                    w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3
                    ${isGeneratingProof || !role || !githubLinked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg transform hover:scale-[1.02]'
                    }
                  `}
                >
                  {isGeneratingProof ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Proof...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Generate ZK Proof & Save Profile</span>
                    </>
                  )}
                </button>

                <p className="mt-4 text-sm text-gray-500 text-center">
                  By generating your proof, you're creating a cryptographically secure verification 
                  of your role and contributions while maintaining complete privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <WalletNotConnected />
      )}
    </>
  );
}
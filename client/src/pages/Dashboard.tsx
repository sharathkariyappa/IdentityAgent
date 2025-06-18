import { useEffect, useState } from 'react';
import { useAccount} from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { fetchGitHubContributorData } from '../utils/fetchGitHubMetrics';
import { fetchOnchainStats } from '../utils/fetchOnchainStats';
import { RealisticZKScoreCalculator } from '../utils/calculateZkScore';
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
  Zap
} from 'lucide-react';

// Wallet not connected component with enhanced UI
const WalletNotConnected = () => (
  <>
  <div className="flex-1 w-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
    </div>

    <div className="relative z-10 flex flex-col h-full p-6 w-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="text-center">
                {/* Hero Icon */}
                <div className="relative  mb-8">
                  <div className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl w-32 h-32 mx-auto flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Wallet className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg animate-bounce">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                  Welcome to IdentityAgent
                </h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-lg mx-auto">
                  Connect your wallet to begin your journey into the world of zero-knowledge verified profiles.
                </p>
                
                {/* Setup Steps */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    <Shield className="w-6 h-6 text-purple-400" />
                    <h3 className="text-2xl font-bold text-white">Setup Your Profile</h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      {
                        icon: Github,
                        title: "Link GitHub",
                        description: "Connect your GitHub account to verify contributions",
                        color: "from-green-500 to-emerald-600"
                      },
                      {
                        icon: User,
                        title: "Select Role",
                        description: "Choose your role: Contributor, Founder, Investor",
                        color: "from-blue-500 to-cyan-600"
                      },
                      {
                        icon: Lock,
                        title: "Generate Proof",
                        description: "Create your ZK proof for secure verification process",
                        color: "from-purple-500 to-pink-600"
                      }
                    ].map((step, index) => (
                      <div key={index} className="group relative">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                          <div className={`p-4 bg-gradient-to-r ${step.color} rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-xl`}>
                            <step.icon className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                          <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
                        </div>
                        
                        {/* Step connector */}
                        {index < 2 && (
                          <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                            <ArrowRight className="w-6 h-6 text-purple-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <AlertCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-lg font-semibold text-green-400">Secure & Private</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Your GitHub data and role are cryptographically verified using zero-knowledge proofs. 
                    Your privacy is protected while maintaining verifiable authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
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
      throw new Error("❌ Failed to load witness_calculator.js");
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
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:4000/api/github/callback`;
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("access_token");
  
    if (!role || !githubUser || !token || !address) {
      setProofStatus("❌ Missing required information");
      console.warn("Missing info: role, GitHub user, token, or wallet");
      return;
    }
  
    const profileData = { role, githubUser, wallet: address };
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    setIsGeneratingProof(true);
    setProofStatus("🔄 Fetching data...");
  
    try {
      const [githubStats, onchainStats] = await Promise.all([
        fetchGitHubContributorData(token, githubUser),
        fetchOnchainStats(address),
      ]);
  
      if (!githubStats) {
        throw new Error("Failed to fetch GitHub stats");
      }

      setProofStatus("🔄 Calculating scores...");
      const result = RealisticZKScoreCalculator.calculateZkScore(githubStats, onchainStats);

      const githubScore = result.githubScore;
      const onchainScore = result.onchainScore;
      const calculatedRole = result.role;
      
      console.log("GitHub Score:", githubScore);
      console.log("Onchain Score:", onchainScore);
      console.log("Calculated Role:", calculatedRole);

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
        setProofStatus(`❌ Role mismatch: You claimed ${role} but your scores indicate ${calculatedRole}`);
        setIsGeneratingProof(false);
        return;
      }

      // Prepare circuit input
      const input = {
        githubScore: githubScore,
        onchainScore: onchainScore,
        claimedRole: claimedRoleNum
      };

      console.log("Circuit input:", input);
      setProofStatus("🔄 Loading ZK files...");

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

      setProofStatus("🔄 Calculating witness...");
      const witnessCalculatorBuilder = await loadWitnessCalculator();
      const wc = await witnessCalculatorBuilder(wasmBuffer);
      const witness = await wc.calculateWTNSBin(input, 0);

      setProofStatus("🔄 Generating ZK proof...");
      const { proof, publicSignals } = await snarkjs.groth16.prove(new Uint8Array(zkeyBuffer), witness);
      
      // Store proof data
      localStorage.setItem("zkProof", JSON.stringify(proof));
      localStorage.setItem("zkPublicSignals", JSON.stringify(publicSignals));

      setProofStatus("🔄 Verifying proof...");
      const verified = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
      
      if (!verified) {
        throw new Error("ZK proof verification failed");
      }

      console.log("✅ ZK Proof verified successfully!");
      console.log("🪪 Proven Role:", publicSignals[0]);
      
      setProofStatus("✅ Proof generated and verified!");
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate("/profile");
      }, 2000);

    } catch (error) {
      console.error("❌ Failed during saveProfile:", error);
      setProofStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsGeneratingProof(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('✅')) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status.includes('❌')) return <AlertCircle className="w-5 h-5 text-red-400" />;
    return <Zap className="w-5 h-5 text-blue-400 animate-pulse" />;
  };

  const getStatusColor = (status: string) => {
    if (status.includes('✅')) return 'from-green-900/20 to-emerald-900/20 border-green-500/20';
    if (status.includes('❌')) return 'from-red-900/20 to-pink-900/20 border-red-500/20';
    return 'from-blue-900/20 to-purple-900/20 border-blue-500/20';
  };

  return (
    <>
      {isConnected ? (
        <div className="flex-1 w-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
          </div>

          <div className="relative z-10 flex flex-col h-full p-6 w-full">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                  <div className="p-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                      <div className="flex items-center justify-center space-x-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl">
                          <Settings className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          Setup Your Profile
                        </h2>
                      </div>
                      <p className="text-gray-300 text-lg">
                        Complete your zero-knowledge verified profile in just a few steps
                      </p>
                    </div>

                    {/* GitHub Section */}
                    <div className="mb-8">
                      <label className="block text-lg font-semibold text-white mb-4 flex items-center space-x-3">
                        <Github className="w-6 h-6" />
                        <span>GitHub Profile Connection</span>
                      </label>
                      
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <button
                          onClick={handleLinkGithub}
                          disabled={isGeneratingProof}
                          className={`
                            px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl
                            ${githubLinked 
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                              : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white'
                            }
                            ${isGeneratingProof ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            {githubLinked ? <CheckCircle className="w-6 h-6" /> : <Github className="w-6 h-6" />}
                            <span>{githubLinked ? 'GitHub Connected' : 'Connect GitHub'}</span>
                          </div>
                        </button>
                        
                        {githubUser && (
                          <div className="mt-4 p-4 bg-green-900/20 border border-green-500/20 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-500/20 rounded-full">
                                <User className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <p className="text-green-400 font-semibold">Connected Successfully</p>
                                <p className="text-green-300">@{githubUser}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-8">
                      <label className="block text-lg font-semibold text-white mb-4 flex items-center space-x-3">
                        <User className="w-6 h-6" />
                        <span>Select Your Role</span>
                      </label>
                      
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          disabled={isGeneratingProof}
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50"
                        >
                          <option value="" className="bg-slate-800 text-white">Choose your role...</option>
                          <option value="Investor" className="bg-slate-800 text-white">💼 Investor - Fund and support projects</option>
                          <option value="Founder" className="bg-slate-800 text-white">🚀 Founder - Build and lead projects</option>
                          <option value="Contributor" className="bg-slate-800 text-white">👨‍💻 Contributor - Develop and contribute code</option>
                        </select>
                      </div>
                    </div>

                    {/* Status Display */}
                    {proofStatus && (
                      <div className={`mb-8 p-6 bg-gradient-to-r ${getStatusColor(proofStatus)} backdrop-blur-sm border rounded-2xl`}>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(proofStatus)}
                          <div>
                            <p className="text-lg font-semibold text-white">Processing Status</p>
                            <p className="text-gray-300">{proofStatus}</p>
                          </div>
                        </div>
                        
                        {isGeneratingProof && (
                          <div className="mt-4">
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={saveProfile}
                      disabled={isGeneratingProof || !role || !githubLinked}
                      className={`
                        w-full py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl
                        ${isGeneratingProof || !role || !githubLinked
                          ? 'bg-gray-600 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-purple-500/25'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        {isGeneratingProof ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Generating Proof...</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-6 h-6" />
                            <span>Generate ZK Proof & Save Profile</span>
                          </>
                        )}
                      </div>
                    </button>

                    {/* Helper Text */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-400 text-sm">
                        By generating your proof, you're creating a cryptographically secure verification 
                        of your role and contributions while maintaining complete privacy.
                      </p>
                    </div>
                  </div>
                </div>
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
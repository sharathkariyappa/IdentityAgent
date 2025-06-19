import React from 'react';
import { 
  BookOpen, 
  Code, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Link, 
  Github, 
  Layers,
  FileCode,
  Database,
  Package,
  Cpu,
  Shield,
  Fingerprint,
  Palette,
  Feather,
  PlayCircle,
  Download,
  Key,
  Rocket,
  Info,
  Code2
} from 'lucide-react';

const Documentation = () => {
  const techStack = [
    {
      icon: Zap,
      title: 'Vite + React',
      description: 'Fast development with hot module replacement',
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-50 to-purple-50',
      borderColor: 'border-blue-100'
    },
    {
      icon: FileCode,
      title: 'TypeScript',
      description: 'Type-safe development with better tooling',
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-100'
    },
    {
      icon: Github,
      title: 'GitHub OAuth',
      description: 'Secure authentication with GitHub',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-100'
    },
    {
      icon: Database,
      title: 'GraphQL',
      description: 'Efficient data fetching and management',
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50',
      borderColor: 'border-green-100'
    },
    {
      icon: Link,
      title: 'Ethers.js',
      description: 'Ethereum blockchain interaction library',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-100'
    },
    {
      icon: ShieldCheck,
      title: 'ZK Proofs',
      description: 'Privacy-preserving verification system',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-100'
    }
  ];

  const dependencies = [
    {
      icon: Link,
      name: 'ethers',
      description: 'Blockchain interaction',
      gradient: 'from-orange-400 to-red-400'
    },
    {
      icon: Cpu,
      name: 'circom',
      description: 'ZK circuits',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      icon: Shield,
      name: 'snarkjs',
      description: 'ZK proof generation',
      gradient: 'from-purple-400 to-indigo-400'
    },
    {
      icon: Fingerprint,
      name: 'ceramic',
      description: 'DID creation',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Palette,
      name: 'tailwindcss',
      description: 'Styling',
      gradient: 'from-cyan-400 to-blue-400'
    },
    {
      icon: Feather,
      name: 'lucide-react',
      description: 'Icons',
      gradient: 'from-gray-400 to-gray-600'
    }
  ];

  const setupSteps = [
    {
      number: 1,
      title: 'Environment Setup',
      icon: Download,
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-50 to-purple-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-600',
      code: `# Clone the repository
git clone <repo-url>

# Install dependencies
npm install`,
      description: 'Clone the repository and install all required dependencies using npm.'
    },
    {
      number: 2,
      title: 'Configure API Keys',
      icon: Key,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-500',
      iconColor: 'text-orange-600',
      code: `VITE_ALCHEMY_API_KEY=your_alchemy_key
VITE_INFURA_API_KEY=your_infura_key
VITE_GITHUB_CLIENT_ID=your_github_client_id`,
      description: 'Replace the placeholder values with your actual API keys from the respective services.',
      note: 'Create a .env file in your project root:'
    },
    {
      number: 3,
      title: 'Run Development Server',
      icon: Rocket,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-500',
      iconColor: 'text-green-600',
      code: 'npm run dev',
      description: 'Start the development server and open your browser to begin developing!'
    }
  ];

  const quickStats = [
    { icon: Zap, label: 'Vite', sublabel: 'Lightning Fast' },
    { icon: ShieldCheck, label: 'ZK', sublabel: 'Zero Knowledge' },
    { icon: Link, label: 'Web3', sublabel: 'Blockchain Ready' },
    { icon: Github, label: 'OAuth', sublabel: 'Secure Auth' }
  ];

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Project Documentation</h1>
              <p className="text-sm text-gray-600">Complete setup guide for your web3 application</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl p-12 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
              <div className="absolute top-20 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-10 left-20 w-12 h-12 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-20 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              {/* Hero Icon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                  <Code className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Decentralized Application
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                A modern web3 application built with cutting-edge technologies including React, TypeScript, ZK proofs, and blockchain integration.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {quickStats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <stat.icon className="w-5 h-5 text-white" />
                      <span className="text-2xl font-bold text-white">{stat.label}</span>
                    </div>
                    <p className="text-sm text-white/80">{stat.sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Built with modern technologies to ensure performance, security, and scalability.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br ${tech.bgGradient} rounded-xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border ${tech.borderColor}`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${tech.gradient} rounded-lg flex items-center justify-center`}>
                      <tech.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">{tech.title}</span>
                  </div>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dependencies Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Key Dependencies</h2>
                <p className="text-gray-600">Essential packages powering the application</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dependencies.map((dep, index) => (
                <div key={index} className="group flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${dep.gradient} rounded-lg flex items-center justify-center`}>
                      <dep.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">{dep.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">{dep.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Setup Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Setup Guide</h2>
                <p className="text-gray-600">Get your development environment running in minutes</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {setupSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className={`bg-gradient-to-r ${step.bgGradient} rounded-xl p-6 border-l-4 ${step.borderColor}`}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <step.icon className={`w-5 h-5 mr-2 ${step.iconColor}`} />
                          {step.title}
                        </h3>
                        {step.note && (
                          <p className="text-gray-700 mb-4">{step.note}</p>
                        )}
                        <div className="bg-gray-900 rounded-lg p-4 text-sm mb-4">
                          <code className="text-green-400 whitespace-pre-line">
                            {step.code}
                          </code>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Note */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Important Requirements</h4>
                  <p className="text-blue-800 leading-relaxed">
                    Ensure you have <strong>Node.js 18+</strong> installed and configure your wallet for blockchain interactions. 
                    You'll also need accounts with Alchemy, Infura, and GitHub to obtain the required API keys.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 rounded-xl p-8 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to Build?</h3>
              <p className="text-lg mb-6 text-white/90">
                Everything you need to get started with modern web3 development. 
                Build the future of decentralized applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                  Start Coding
                </button>
                <a
                    href="https://github.com/sharathkariyappa/IdentityAgent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200"
                    >
                    View GitHub
                </a>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Documentation;
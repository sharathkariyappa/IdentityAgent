import { 
  ShieldCheck, 
  EyeOff, 
  Brain, 
  KeyRound, 
  Zap, 
  SearchCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'ZK-Based Identity Proofs',
    description: 'Uses zero-knowledge cryptography to verify user claims without revealing private data, ensuring full privacy.',
    color: 'from-purple-500 to-pink-500',
    category: 'Privacy'
  },
  {
    icon: EyeOff,
    title: 'Role Prediction Engine',
    description: 'AI models trained on both on-chain behaviors and off-chain contributions to predict whether you are a founder, contributor, or investor.',
    color: 'from-blue-500 to-cyan-500',
    category: 'AI/ML'
  },
  {
    icon: Brain,
    title: 'Behavioral Pattern Recognition',
    description: 'Learns from wallet activity, transaction history, PRs, and proposals to build identity clusters.',
    color: 'from-indigo-500 to-purple-500',
    category: 'AI/ML'
  },
  {
    icon: KeyRound,
    title: 'Self-Sovereign Identity Control',
    description: 'Your identity lives in your wallet. No central servers. No custodians.',
    color: 'from-teal-500 to-green-500',
    category: 'Privacy'
  },
  {
    icon: Zap,
    title: 'Lightning Fast ZK Generation',
    description: 'Proof generation happens in under 1 second for seamless UX, powered by optimized snarkjs circuits.',
    color: 'from-yellow-500 to-orange-500',
    category: 'Performance'
  },
  {
    icon: SearchCheck,
    title: 'Real-Time Auditability',
    description: 'Verifiers can validate claims instantly without revealing the user\'s data — audit-friendly, privacy-safe.',
    color: 'from-pink-500 to-rose-500',
    category: 'Verification'
  },
];

const categories = [
  { name: 'Privacy', icon: Lock, color: 'from-purple-500 to-pink-500' },
  { name: 'AI/ML', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  { name: 'Performance', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { name: 'Verification', icon: SearchCheck, color: 'from-pink-500 to-rose-500' },
];

const FeaturesPage = () => {
  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">IdentityAgent Features</h1>
            <p className="text-sm text-gray-600">Discover the power of zero-knowledge verified profiles</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="text-center">
              {/* Hero Icon */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Revolutionary Identity Infrastructure
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                Built on cutting-edge zero-knowledge cryptography and AI-powered analysis to create 
                the most secure and private identity verification system in Web3.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { number: "< 1s", label: "Proof Generation", icon: Zap },
                  { number: "100%", label: "Privacy Preserved", icon: EyeOff },
                  { number: "∞", label: "Verification Speed", icon: SearchCheck }
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{stat.number}</span>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className={`w-6 h-6 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                  <category.icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full">
                      <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">{feature.category}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Feature Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Feature Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your ZK Identity?</h3>
              <p className="text-lg mb-6 text-white/90">
                Join the future of decentralized identity verification. Create your cryptographically 
                secure profile today and experience true privacy-preserving authentication.
              </p>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
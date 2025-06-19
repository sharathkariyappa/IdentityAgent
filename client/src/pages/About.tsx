import React from 'react';
import { 
  Shield, 
  Brain, 
  Eye, 
  GitBranch, 
  CheckCheck, 
  Users,
  Sparkles,
  ArrowRight,
  Target,
  Lightbulb,
  Code2,
  Globe,
  Lock,
  Zap,
  Heart,
  Star
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Native',
      description: 'Built with ZK proofs at the core to ensure maximum user privacy and censorship resistance.',
      color: 'from-purple-500 to-pink-500',
      category: 'Privacy'
    },
    {
      icon: Eye,
      title: 'Transparent yet Private',
      description: 'Proofs are verifiable on-chain without exposing raw user data or violating trust boundaries.',
      color: 'from-green-500 to-emerald-500',
      category: 'Transparency'
    },
    {
      icon: GitBranch,
      title: 'Contributions, Not Credentials',
      description: 'Identity is earned through provable actions on-chain and off-chain — not degrees or docs.',
      color: 'from-orange-500 to-red-500',
      category: 'Merit-Based'
    },
  ];

  const mission = {
    title: "Our Mission",
    description: "To create a decentralized identity layer that enables trustless verification of roles and contributions while preserving user privacy through cutting-edge zero-knowledge cryptography.",
    icon: Target
  };

  const vision = {
    title: "Our Vision", 
    description: "A world where your digital identity is truly yours — verified, portable, and private. Where trust is built through provable actions, not centralized authorities.",
    icon: Lightbulb
  };

  const team = [
    {
      role: "Core Philosophy",
      title: "Privacy First",
      description: "Every decision we make prioritizes user privacy and data sovereignty.",
      icon: Lock
    },
    {
      role: "Technical Excellence", 
      title: "Innovation Driven",
      description: "Pushing the boundaries of what's possible with ZK proofs and AI analysis.",
      icon: Code2
    },
    {
      role: "Community Focus",
      title: "Built for Everyone",
      description: "Creating tools that empower individuals and communities alike.",
      icon: Heart
    }
  ];

  const stats = [
    { number: "100%", label: "Privacy Preserved", icon: Shield },
    { number: "∞", label: "Verification Scalability", icon: Globe },
    { number: "< 1s", label: "Proof Generation", icon: Zap },
    { number: "0", label: "Centralized Servers", icon: Users }
  ];

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">About IdentityAgent</h1>
            <p className="text-sm text-gray-600">Building the future of decentralized identity</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl p-12 text-white text-center relative overflow-hidden">
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
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Revolutionizing Digital Identity
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                IdentityAgent is a ZK-native reputation protocol designed to help applications, DAOs, and communities determine who someone truly is — without compromising privacy.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <stat.icon className="w-5 h-5 text-white" />
                      <span className="text-2xl font-bold text-white">{stat.number}</span>
                    </div>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            {[mission, vision].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we build and every decision we make in creating the future of decentralized identity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100"
                  >
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-white rounded-full border border-gray-200">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-600">{value.category}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Value Icon */}
                    <div className={`w-14 h-14 bg-gradient-to-r ${value.color} rounded-xl mb-4 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Value Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-200">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Philosophy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Drives Us</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our commitment to building technology that serves humanity, not the other way around.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-purple-600 font-medium mb-2">{item.role}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 rounded-xl p-8 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Join the Identity Revolution</h3>
              <p className="text-lg mb-6 text-white/90">
                Be part of building a more private, secure, and equitable digital future. 
                Your identity, your data, your control.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                  Get Started
                </button>
                <button className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
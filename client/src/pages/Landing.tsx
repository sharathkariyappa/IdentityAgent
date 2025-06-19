import React, { useState, useEffect } from 'react';
import { Shield, Zap, Users, TrendingUp, Lock, Database, ArrowRight, CheckCircle, Star, Github, Twitter, Linkedin, Brain, Eye, GitBranch, Target, Globe, Heart } from 'lucide-react';

const IdentityAgentLanding = () => {
  const [activeRole, setActiveRole] = useState('founder');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const roles = [
    { id: 'founder', label: 'Founder', icon: Zap, color: 'from-purple-500 to-pink-500' },
    { id: 'contributor', label: 'Contributor', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 'investor', label: 'Investor', icon: TrendingUp, color: 'from-green-500 to-emerald-500' }
  ];

  const features = [
    {
      icon: Database,
      title: 'Multi-Source Data Analysis',
      description: 'Combines on-chain transactions with off-chain reputation signals for comprehensive identity mapping',
      category: 'Data Intelligence'
    },
    {
      icon: Shield,
      title: 'Zero-Knowledge Verification',
      description: 'Privacy-preserving verification that proves identity without revealing sensitive information',
      category: 'Privacy First'
    },
    {
      icon: Lock,
      title: 'Cryptographic Security',
      description: 'Military-grade encryption ensures your data remains secure and tamper-proof',
      category: 'Security'
    },
    {
      icon: Brain,
      title: 'AI-Driven Assessment',
      description: 'Machine learning algorithms analyze patterns to accurately determine roles and contributions',
      category: 'Intelligence'
    },
    {
      icon: Eye,
      title: 'Transparent Proofs',
      description: 'Verifiable on-chain without exposing raw user data or violating trust boundaries',
      category: 'Transparency'
    },
    {
      icon: GitBranch,
      title: 'Merit-Based Identity',
      description: 'Identity earned through provable actions, not credentials or documentation',
      category: 'Merit System'
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'For Founders',
      description: 'Prove your founding role and track record across multiple projects',
      features: ['Verified startup history', 'Funding round participation', 'Team building metrics']
    },
    {
      icon: Users,
      title: 'For Contributors',
      description: 'Showcase your contributions and expertise across the ecosystem',
      features: ['Code contributions', 'Community engagement', 'Protocol governance']
    },
    {
      icon: TrendingUp,
      title: 'For Investors',
      description: 'Demonstrate your investment portfolio and market involvement',
      features: ['Investment history', 'Due diligence participation', 'Market analysis']
    }
  ];

  const stats = [
    { value: '1000+', label: 'Verified Identities', icon: Shield },
    { value: '99.9%', label: 'Accuracy Rate', icon: Target },
    { value: '<1s', label: 'Verification Time', icon: Zap },
    { value: '100%', label: 'Privacy Preserved', icon: Lock }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">IdentityAgent</span>
              <div className="text-xs text-gray-500">ZK-Verified Identity</div>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Hero Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-purple-200">
              <Star className="w-4 h-4" />
              <span>Revolutionary ZK-Native Identity Protocol</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 leading-tight">
              ZK-Verified
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Identity Scoring
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionary identity model that analyzes on-chain and off-chain data to verify your role in the ecosystem through zero-knowledge proofs
            </p>

            {/* Role Selector */}
            <div className="flex justify-center flex-wrap gap-4 mb-12">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                      activeRole === role.id
                        ? `bg-gradient-to-r ${role.color} border-transparent text-white shadow-lg`
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{role.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <span>Verify Your Identity</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <stat.icon className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology stack combining AI, cryptography, and blockchain analysis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">{feature.category}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're building, contributing, or investing, IdentityAgent helps you prove your role
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 mb-6">{benefit.description}</p>
                  
                  <ul className="space-y-2">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Verification Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and lightning-fast identity verification
            </p>
          </div>
          
          <div className="relative">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: 1, title: 'Data Collection', desc: 'On-chain & off-chain analysis', icon: Database },
                { step: 2, title: 'Score Calculation', desc: 'AI-powered role assessment', icon: Brain },
                { step: 3, title: 'ZK Verification', desc: 'Privacy-preserving proof', icon: Shield },
                { step: 4, title: 'Role Assignment', desc: 'Verified identity badge', icon: CheckCircle }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 text-center relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg font-bold mb-4 mx-auto">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Globe className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Verify Your Identity?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of verified founders, contributors, and investors building the future of decentralized identity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="group bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">IdentityAgent</span>
                <div className="text-sm text-gray-400">ZK-Verified Identity</div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 IdentityAgent. Securing digital identity through zero-knowledge proofs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IdentityAgentLanding;
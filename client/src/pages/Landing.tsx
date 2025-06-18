import React, { useState, useEffect } from 'react';
import { Shield, Zap, Users, TrendingUp, Lock, Database, ArrowRight, CheckCircle, Star, Github, Twitter, Linkedin } from 'lucide-react';

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
      description: 'Combines on-chain transactions with off-chain reputation signals for comprehensive identity mapping'
    },
    {
      icon: Shield,
      title: 'Zero-Knowledge Verification',
      description: 'Privacy-preserving verification that proves identity without revealing sensitive information'
    },
    {
      icon: Lock,
      title: 'Cryptographic Security',
      description: 'Military-grade encryption ensures your data remains secure and tamper-proof'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            IdentityAgent
          </span>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Launch App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div 
          className="transform transition-transform duration-1000"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            ZK-Verified
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Identity Scoring
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Revolutionary identity model that analyzes on-chain and off-chain data to verify your role in the ecosystem through zero-knowledge proofs
          </p>

          {/* Role Selector */}
          <div className="flex justify-center space-x-4 mb-12">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`px-8 py-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    activeRole === role.id
                      ? `bg-gradient-to-r ${role.color} border-transparent shadow-2xl`
                      : 'border-gray-600 hover:border-gray-400 bg-white/5 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6" />
                    <span className="font-semibold">{role.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="group px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <span className="flex items-center space-x-3">
              <span>Verify Your Identity</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: '10K+', label: 'Verified Identities' },
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '<1s', label: 'Verification Time' }
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Verification Process
          </h2>
          
          <div className="relative">
            <div className="flex justify-between items-center">
              {[
                { step: 1, title: 'Data Collection', desc: 'On-chain & off-chain analysis' },
                { step: 2, title: 'Score Calculation', desc: 'AI-powered role assessment' },
                { step: 3, title: 'ZK Verification', desc: 'Privacy-preserving proof' },
                { step: 4, title: 'Role Assignment', desc: 'Verified identity badge' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-2xl">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{item.title}</h3>
                  <p className="text-gray-400 text-center text-sm max-w-32">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 -z-10"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Verify Your Identity?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of verified founders, contributors, and investors building the future of decentralized identity.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="group px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span className="flex items-center space-x-3">
                <span>Get Started Now</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                IdentityAgent
              </span>
            </div>
            
            <div className="flex space-x-6">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2025 IdentityAgent. Securing digital identity through zero-knowledge proofs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IdentityAgentLanding;
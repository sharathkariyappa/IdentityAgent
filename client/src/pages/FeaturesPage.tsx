import { ShieldCheck, EyeOff, BarChart3, Users, Brain, KeyRound, Code2, Zap, SearchCheck } from 'lucide-react';
import React from 'react';

const features = [
  {
    icon: ShieldCheck,
    title: 'ZK-Based Identity Proofs',
    description:
      'Uses zero-knowledge cryptography to verify user claims without revealing private data, ensuring full privacy.',
  },
  {
    icon: EyeOff,
    title: 'Role Prediction Engine',
    description:
      'AI models trained on both on-chain behaviors and off-chain contributions to predict whether you are a founder, contributor, or investor.',
  },
  {
    icon: BarChart3,
    title: 'Reputation Score Generation',
    description:
      'Assigns a dynamic identity score based on interaction depth, token activity, social presence, and GitHub history.',
  },
  {
    icon: Users,
    title: 'Multi-Role Mapping',
    description:
      'Users can hold multiple verified identities (e.g., Contributor + Investor) with context-aware badges.',
  },
  {
    icon: Brain,
    title: 'Behavioral Pattern Recognition',
    description:
      'Learns from wallet activity, transaction history, PRs, and proposals to build identity clusters.',
  },
  {
    icon: KeyRound,
    title: 'Self-Sovereign Identity Control',
    description:
      'Your identity lives in your wallet. No central servers. No custodians.',
  },
  {
    icon: Code2,
    title: 'Developer Friendly APIs',
    description:
      'Plug identity verification into your dApp via SDKs and REST endpoints for zk-based scoring.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast ZK Generation',
    description:
      'Proof generation happens in under 1 second for seamless UX, powered by optimized snarkjs circuits.',
  },
  {
    icon: SearchCheck,
    title: 'Real-Time Auditability',
    description:
      'Verifiers can validate claims instantly without revealing the user’s data — audit-friendly, privacy-safe.',
  },
];

const FeaturesPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          IdentityAgent Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
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
  );
};

export default FeaturesPage;

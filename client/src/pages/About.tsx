import React from 'react';
import { Shield, Brain, Eye, GitBranch, CheckCheck, Users} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Native',
      description:
        'Built with ZK proofs at the core to ensure maximum user privacy and censorship resistance.'
    },
    {
      icon: Brain,
      title: 'AI-Driven Reasoning',
      description:
        'Leverages machine learning to assess roles and contributions from structured and unstructured data.'
    },
    {
      icon: Eye,
      title: 'Transparent yet Private',
      description:
        'Proofs are verifiable on-chain without exposing raw user data or violating trust boundaries.'
    },
    {
      icon: GitBranch,
      title: 'Contributions, Not Credentials',
      description:
        'Identity is earned through provable actions on-chain and off-chain — not degrees or docs.'
    },
    {
        icon: CheckCheck,
        title: 'Programmable Identity',
        description:
          'Composable identity scores that plug into DAOs, apps, airdrops, and trust frameworks.'
      },
      {
        icon: Users,
        title: 'Community-Curated Roles',
        description:
          'Backed by community intelligence. Roles are assigned based on peer and protocol interactions.'
      },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
          About IdentityAgent
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
          IdentityAgent is a ZK-native reputation protocol designed to help applications, DAOs, and communities determine who someone truly is — without compromising privacy.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map(({ icon: Icon, title, description }, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;

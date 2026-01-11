
import React from 'react';
import { BookOpen, Trophy, Play, Info } from 'lucide-react';

const challenges = [
  {
    title: "The Typo Hunter",
    description: "Identify and fix spelling mistakes in a mock project README. Practice the flow of fork -> branch -> commit.",
    difficulty: "Easy",
    points: 100,
    type: "Documentation"
  },
  {
    title: "Dependency Update",
    description: "Update a specific library in the package.json and verify if the project still builds in the simulator.",
    difficulty: "Easy",
    points: 150,
    type: "Maintenance"
  },
  {
    title: "Add a Test Case",
    description: "Implement a unit test for a simple calculator function that currently has no test coverage.",
    difficulty: "Medium",
    points: 300,
    type: "Quality"
  }
];

const PracticeZone: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-indigo-500" />
          Make Your Hands Dirty
        </h1>
        <p className="text-zinc-400">Safe sandbox challenges to build your confidence before your first real contribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {challenges.map((c, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:translate-y-[-4px] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                c.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {c.difficulty}
              </span>
              <div className="flex items-center gap-1 text-zinc-400 text-xs font-bold">
                <Trophy size={14} className="text-amber-500" />
                {c.points} XP
              </div>
            </div>
            
            <h3 className="text-white font-bold mb-2">{c.title}</h3>
            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
              {c.description}
            </p>

            <button className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <Play size={14} fill="currentColor" />
              Start Challenge
            </button>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
        <div className="flex gap-6 items-center">
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 hidden sm:block">
            <Info size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Simulated Pull Request Practice</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Our simulator lets you go through the entire GitHub PR UI without actually touching GitHub. 
              Get feedback on your commit messages, PR descriptions, and code formatting from our AI coach.
            </p>
            <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20">
              Open Simulator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeZone;


import React, { useState } from 'react';
import { 
  Terminal, 
  GitFork, 
  GitBranch, 
  GitCommit, 
  GitPullRequest,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const steps = [
  {
    title: "What is Open Source?",
    description: "Open source software is code that is designed to be publicly accessible—anyone can see, modify, and distribute the code as they see fit.",
    icon: Terminal,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    title: "The Fork & Clone",
    description: "Forking creates a personal copy of someone else's project. Cloning downloads it to your machine. It's like taking a library book home to add notes.",
    icon: GitFork,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Branching Strategy",
    description: "Always create a new branch for your features. This keeps the main code clean and allows you to work on multiple things simultaneously.",
    icon: GitBranch,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Committing Changes",
    description: "Commits are like 'save points' in a game. They record exactly what you changed and why. Keep your messages clear and concise!",
    icon: GitCommit,
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
    title: "The Pull Request (PR)",
    description: "A PR is your request to merge your changes back into the original project. It's the ultimate 'look at what I built' moment!",
    icon: GitPullRequest,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Open Source Launchpad</h1>
        <p className="text-zinc-400 max-w-lg mx-auto">Master the fundamentals of collaboration. We'll guide you through every concept, step-by-step.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-12">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'bg-indigo-500' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Terminal size={200} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`p-6 rounded-2xl ${steps[currentStep].bg} ${steps[currentStep].color} mb-8`}>
            {React.createElement(steps[currentStep].icon, { size: 48 })}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">{steps[currentStep].title}</h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-2xl">
            {steps[currentStep].description}
          </p>

          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                Continue
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all"
              >
                Complete Onboarding
                <CheckCircle2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <h4 className="text-white font-semibold mb-2">Confidence Booster</h4>
          <p className="text-zinc-500 text-sm">Everyone starts at zero. Your first PR might be a typo fix, and that's amazing!</p>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <h4 className="text-white font-semibold mb-2">Why Contribute?</h4>
          <p className="text-zinc-500 text-sm">Build a public portfolio, learn from top engineers, and give back to tools you use.</p>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <h4 className="text-white font-semibold mb-2">Need Help?</h4>
          <p className="text-zinc-500 text-sm">Use the AI Buddy anytime if you're stuck on a Git command or confused by a concept.</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

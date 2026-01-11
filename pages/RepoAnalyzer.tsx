import React, { useState } from "react";
import {
  Search,
  Zap,
  Code2,
  Lightbulb,
  Bot,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { analyzeRepo } from "../services/geminiService";
import { RepoAnalysis, Difficulty } from "../types";

const RepoAnalyzer: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeRepo(url);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze repository. Please try a valid GitHub URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Zap className="text-amber-500" />
          Repo Insights Engine
        </h1>
        <p className="text-zinc-400">
          Paste any GitHub URL and let AI break down how you can contribute.
        </p>
      </div>

      <div className="flex gap-4 mb-12">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={20}
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/facebook/react"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 size={48} className="text-indigo-500 animate-spin" />
          <p className="text-zinc-400 animate-pulse">
            Our AI is reading through the repository structure...
          </p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Beginner Explanation */}
              <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bot size={20} className="text-indigo-400" />
                  AI Summary
                </h3>
                <p className="text-zinc-400 leading-relaxed italic">
                  "{analysis.beginnerExplanation}"
                </p>
              </section>

              {/* Tech Stack */}
              <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Code2 size={20} className="text-blue-400" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm border border-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              {/* Contribution Ideas */}
              <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Lightbulb size={20} className="text-amber-400" />
                  Where to Start?
                </h3>
                <div className="space-y-4">
                  {analysis.contributionIdeas.map((idea, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <div
                        className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                          idea.level === "Beginner"
                            ? "bg-emerald-500"
                            : idea.level === "Intermediate"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">
                          {idea.level}
                        </span>
                        <p className="text-zinc-300 text-sm">{idea.idea}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* AI Assistant Prompts */}
              <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  AI Ready Prompts
                </h3>
                <div className="space-y-3">
                  {analysis.prompts.map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full text-left p-3 bg-zinc-800/30 hover:bg-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-white transition-all border border-transparent hover:border-zinc-700 truncate"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </section>

              {/* Project Structure Map */}
              <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  Key Directories
                </h3>
                <div className="font-mono text-xs text-indigo-400 space-y-1">
                  {analysis.structure.map((dir, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-zinc-700">└─</span>
                      {dir}
                    </div>
                  ))}
                </div>
              </section>

              <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                Visit Repository <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoAnalyzer;

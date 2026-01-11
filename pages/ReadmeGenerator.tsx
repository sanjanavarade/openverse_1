import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  Download,
  Wand2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { generateReadme } from "../services/geminiService";

const ReadmeGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");
  const [copied, setCopied] = useState(false);

  const tones = [
    "Professional",
    "Beginner-Friendly",
    "FAANG-style",
    "Minimalist",
    "Creative",
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Mocking user data that would normally come from GitHub API
      const mockUserData = {
        username: "dev_pro_99",
        repos: 45,
        languages: ["TypeScript", "Rust", "Go"],
        topContributions: ["React", "Vite", "Turborepo"],
        achievements: ["Pull Shark", "Quickdraw", "YOLO"],
      };
      const result = await generateReadme(mockUserData, tone);
      setGeneratedMarkdown(result);
    } catch (error) {
      alert("Error generating README.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="text-purple-500" />
          AI Profile Architect
        </h1>
        <p className="text-zinc-400">
          Generate a stunning GitHub Profile README based on your actual
          contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-6">Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                  Tone & Style
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                        tone === t
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Wand2 size={20} />
                  )}
                  {loading ? "Analyzing Profile..." : "Generate README"}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
            <h4 className="text-indigo-400 font-bold text-sm mb-2 flex items-center gap-2">
              <Sparkles size={16} />
              Pro Tip
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Our AI automatically fetches your top repositories and stats from
              GitHub to include them in the generated markdown.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">Live Preview</h3>
            {generatedMarkdown && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex items-center gap-2 text-xs"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copied ? "Copied" : "Copy MD"}
                </button>
                <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex items-center gap-2 text-xs">
                  <Download size={14} />
                  Download
                </button>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl min-h-[500px] relative overflow-hidden">
            {!generatedMarkdown && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                <div className="p-4 bg-zinc-800 rounded-full text-zinc-600 mb-4">
                  <FileText size={48} />
                </div>
                <h4 className="text-white font-semibold mb-2">
                  Ready to Build?
                </h4>
                <p className="text-zinc-500 text-sm max-w-xs">
                  Click the generate button to create your custom GitHub profile
                  README.
                </p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-10">
                <Loader2
                  size={32}
                  className="text-indigo-500 animate-spin mb-4"
                />
                <p className="text-zinc-400 text-sm">
                  Crafting your professional profile...
                </p>
              </div>
            )}

            {generatedMarkdown && (
              <div className="p-8 font-mono text-sm text-zinc-300 whitespace-pre-wrap h-full max-h-[700px] overflow-y-auto">
                {generatedMarkdown}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadmeGenerator;

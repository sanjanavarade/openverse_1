import React, { useState } from "react";
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  Layout,
  Book,
  Globe,
} from "lucide-react";
import { Difficulty } from "../types";

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "shadcn/ui",
    description:
      "Beautifully designed components that you can copy and paste into your apps.",
    stars: 52000,
    tags: ["React", "Tailwind", "TypeScript"],
    difficulty: Difficulty.BEGINNER,
    isGoodFirstIssue: true,
  },
  {
    id: "2",
    name: "trpc/trpc",
    description:
      "Move Fast and Break Nothing. End-to-end typesafe APIs made easy.",
    stars: 32000,
    tags: ["TypeScript", "Node.js", "React"],
    difficulty: Difficulty.INTERMEDIATE,
    isGoodFirstIssue: false,
  },
  {
    id: "3",
    name: "facebook/react",
    description: "The library for web and native user interfaces.",
    stars: 221000,
    tags: ["JavaScript", "React"],
    difficulty: Difficulty.ADVANCED,
    isGoodFirstIssue: true,
  },
  {
    id: "4",
    name: "vercel/next.js",
    description: "The React Framework for the Web.",
    stars: 118000,
    tags: ["React", "Framework", "TypeScript"],
    difficulty: Difficulty.INTERMEDIATE,
    isGoodFirstIssue: true,
  },
];

const Explorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">
          Explore the Open Verse
        </h1>
        <p className="text-zinc-400">
          Discover repositories that match your skill level and tech stack.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search projects by name, language or tag..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 flex items-center gap-2 hover:bg-zinc-800 transition-colors text-sm">
            <Filter size={18} />
            Filters
          </button>
          <button className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 flex items-center gap-2 hover:bg-zinc-800 transition-colors text-sm">
            Sort: Stars
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 group-hover:scale-110 transition-transform">
                <Layout size={24} />
              </div>
              <div className="flex items-center gap-1 text-zinc-500 text-sm">
                <Star size={14} className="text-amber-500" />
                {(project.stars / 1000).toFixed(1)}k
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md text-[10px] font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    project.difficulty === Difficulty.BEGINNER
                      ? "bg-emerald-500"
                      : project.difficulty === Difficulty.INTERMEDIATE
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                />
                <span className="text-xs text-zinc-400 font-medium">
                  {project.difficulty}
                </span>
              </div>
              {project.isGoodFirstIssue && (
                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                  <CheckCircle2 size={12} />
                  Good First Issues
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explorer;

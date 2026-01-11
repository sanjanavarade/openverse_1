
import React from 'react';
import { Users, Calendar, MessageSquare, ExternalLink, GraduationCap } from 'lucide-react';

const events = [
  { name: "Google Summer of Code 2024", date: "Apply by March", org: "Google", type: "Mentorship" },
  { name: "Hacktoberfest", date: "Starts Oct 1", org: "DigitalOcean", type: "Event" },
  { name: "GirlScript Summer of Code", date: "Ongoing", org: "GirlScript", type: "Mentorship" },
  { name: "MLH Fellowship", date: "Rolling Admissions", org: "Major League Hacking", type: "Fellowship" }
];

const Community: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="text-blue-500" />
          Community Hub
        </h1>
        <p className="text-zinc-400">Connect with mentors, find teammates, and stay updated on major OSS events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Discussion Channels */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4">Active Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChannelCard title="Beginner Support" users={1240} description="Ask anything, no matter how small." icon={<GraduationCap />} />
              <ChannelCard title="Project Matchmaking" users={850} description="Find contributors for your repository." icon={<Users />} />
              <ChannelCard title="Career Advice" users={3200} description="How OSS helps you land jobs." icon={<MessageSquare />} />
              <ChannelCard title="Showcase" users={1100} description="Share your merged PRs and celebrate!" icon={<ExternalLink />} />
            </div>
          </section>

          {/* Mentors */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4">Available Mentors</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(m => (
                <div key={m} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={`https://picsum.photos/seed/${m}/100/100`} className="w-12 h-12 rounded-full border-2 border-zinc-800" />
                    <div>
                      <h4 className="text-white font-semibold">Mentor Name {m}</h4>
                      <p className="text-zinc-500 text-xs">Specialty: React, TypeScript, GraphQL</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-xs font-bold transition-all">
                    Book Session
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Events */}
        <div className="space-y-8">
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-400" />
              OSS Calendar
            </h3>
            <div className="space-y-6">
              {events.map((e, i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">{e.org}</p>
                  <h4 className="text-white font-medium group-hover:text-indigo-400 transition-colors">{e.name}</h4>
                  <p className="text-zinc-500 text-xs mt-1">{e.date} • {e.type}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white text-sm font-bold transition-colors">
              Sync with Google Cal
            </button>
          </section>

          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold mb-2">Host an Event?</h3>
            <p className="text-indigo-100 text-sm mb-4 leading-relaxed">Want to run a workshop or a local hackathon? We can help with resources.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold text-xs transition-all">
              Become an Organizer
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

const ChannelCard = ({ title, users, description, icon }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:bg-zinc-800/50 cursor-pointer transition-all border-l-4 border-l-indigo-500">
    <div className="flex items-center gap-3 mb-3">
      <div className="text-indigo-400">{icon}</div>
      <h4 className="text-white font-bold">{title}</h4>
    </div>
    <p className="text-zinc-500 text-xs mb-4">{description}</p>
    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
      {users.toLocaleString()} Active Contributors
    </div>
  </div>
);

export default Community;

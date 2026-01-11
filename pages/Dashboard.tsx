import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  GitPullRequest, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, Developer! 👋
          </h1>
          <p className="text-zinc-400">
            Your open-source journey is looking strong. Keep up the momentum!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Flame className="text-orange-500" size={18} />
            <span className="text-sm font-semibold text-white">
              {dashboard.streak} Day Streak
            </span>
          </div>

          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold text-white transition-colors">
            Share Progress
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<ShieldCheck className="text-emerald-500" size={24} />}
          label="Confidence Score"
          value={dashboard.confidenceScore}
          suffix="%"
          trend="+ based on recent activity"
        />
        <StatCard 
          icon={<GitPullRequest className="text-indigo-500" size={24} />}
          label="Active PRs"
          value={dashboard.activePRs}
          trend="Merged & opened PRs"
        />
        <StatCard 
          icon={<TrendingUp className="text-blue-500" size={24} />}
          label="Global Rank"
          value={`#${dashboard.globalRank}`}
          trend="Among OpenVerse users"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-amber-500" size={24} />}
          label="Badges Earned"
          value={dashboard.badges}
          trend="Keep contributing!"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contribution Activity */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-zinc-400" />
              <h3 className="font-semibold text-white">
                Contribution Activity
              </h3>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.contributionGraph}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="name"
                  stroke="#52525b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#818cf8' }}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestones (still static, later backend-ready) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-6">
            Upcoming Milestones
          </h3>

          <div className="space-y-6">
            <MilestoneItem 
              title="First Documentation Fix"
              progress={100}
              reward="Docs Ninja Badge"
              completed
            />
            <MilestoneItem 
              title="Merge 5 Pull Requests"
              progress={80}
              reward="Rising Contributor"
            />
            <MilestoneItem 
              title="Review an Issue"
              progress={0}
              reward="Eagle Eye"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, suffix = "", trend }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-colors">
    <div className="flex items-center justify-between mb-4">
      {icon}
      <ArrowUpRight className="text-zinc-600" size={16} />
    </div>
    <p className="text-zinc-400 text-sm mb-1">{label}</p>
    <div className="flex items-baseline gap-1 mb-2">
      <span className="text-2xl font-bold text-white">{value}</span>
      {suffix && <span className="text-zinc-500 font-medium">{suffix}</span>}
    </div>
    <p className="text-xs text-zinc-500">{trend}</p>
  </div>
);

const MilestoneItem = ({ title, progress, reward, completed = false }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className={`${completed ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
        {title}
      </span>
      <span className="text-indigo-400 text-xs">
        {completed ? 'Completed' : `${progress}%`}
      </span>
    </div>
    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-500 ${
          completed ? 'bg-emerald-500' : 'bg-indigo-500'
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
      Reward: {reward}
    </p>
  </div>
);

export default Dashboard;

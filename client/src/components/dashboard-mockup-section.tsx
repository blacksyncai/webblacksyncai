import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Phone,
  Calendar,
  BarChart3,
  Settings,
  Plug,
  Search,
  Bell,
  Plus,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  PhoneOutgoing,
} from "lucide-react";

const leads = [
  {
    name: "Maria Sanchez",
    phone: "+1 (555) 234-1198",
    status: "Qualified",
    industry: "Real Estate",
    agent: "AI Agent · Emma",
    statusColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  },
  {
    name: "James Patel",
    phone: "+1 (555) 887-3041",
    status: "Booked",
    industry: "Mortgage",
    agent: "AI Agent · Alex",
    statusColor: "bg-primary/15 text-primary border-primary/30",
  },
  {
    name: "Daniel Roberts",
    phone: "+1 (555) 412-8830",
    status: "Calling",
    industry: "Insurance",
    agent: "AI Agent · Emma",
    statusColor:
      "bg-amber-500/15 text-amber-600 border-amber-500/30 animate-pulse",
  },
  {
    name: "Aisha Williams",
    phone: "+1 (555) 661-2284",
    status: "Qualified",
    industry: "Home Services",
    agent: "AI Agent · Sarah",
    statusColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  },
  {
    name: "Marcus Lee",
    phone: "+1 (555) 309-7714",
    status: "Follow-up",
    industry: "Real Estate",
    agent: "AI Agent · Alex",
    statusColor:
      "bg-secondary/40 text-foreground/70 border-secondary",
  },
  {
    name: "Sophia Nguyen",
    phone: "+1 (555) 998-5526",
    status: "Booked",
    industry: "Mortgage",
    agent: "AI Agent · Emma",
    statusColor: "bg-primary/15 text-primary border-primary/30",
  },
  {
    name: "Carlos Rivera",
    phone: "+1 (555) 220-4471",
    status: "Calling",
    industry: "Auto & P&C",
    agent: "AI Agent · Sarah",
    statusColor:
      "bg-amber-500/15 text-amber-600 border-amber-500/30 animate-pulse",
  },
];

function SideBars({ side }: { side: "left" | "right" }) {
  const rows = Array.from({ length: 22 });
  return (
    <div
      aria-hidden
      className={`pointer-events-none hidden lg:flex absolute top-12 ${
        side === "left" ? "left-0 items-end" : "right-0 items-start"
      } bottom-12 w-[14%] xl:w-[16%] flex-col gap-2 px-4`}
      style={{
        maskImage:
          side === "left"
            ? "linear-gradient(to right, black 30%, transparent)"
            : "linear-gradient(to left, black 30%, transparent)",
        WebkitMaskImage:
          side === "left"
            ? "linear-gradient(to right, black 30%, transparent)"
            : "linear-gradient(to left, black 30%, transparent)",
      }}
    >
      {rows.map((_, i) => {
        const w = 30 + ((i * 37) % 70);
        return (
          <div
            key={i}
            className="h-1.5 rounded-sm bg-blue-600/70 dark:bg-blue-500/70"
            style={{ width: `${w}%` }}
          />
        );
      })}
    </div>
  );
}

export function DashboardMockupSection() {
  // Interactive 3D tilt — the panel sits in real perspective and reacts to the cursor.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  // Rest pose (px=py=0.5) is a gentle 3/4 view, so it reads as 3D even without the cursor.
  const rotateX = useSpring(useTransform(py, [0, 1], [14, 2]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-16, 6]), { stiffness: 150, damping: 18 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <section
      data-testid="section-dashboard-mockup"
      className="relative pt-4 pb-0 hero-gradient overflow-hidden"
    >
      <SideBars side="left" />
      <SideBars side="right" />

      <div
        className="relative max-w-[920px] mx-auto px-4 sm:px-6"
        style={{ perspective: "1600px" }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-t-2xl overflow-hidden border border-white/10 border-b-0 bg-[#0e0d12] text-zinc-200 ring-1 ring-black/5 [transform-style:preserve-3d]"
          style={{
            rotateX,
            rotateY,
            boxShadow:
              "0 -20px 60px -20px hsl(14 76% 49% / 0.30), 0 40px 80px -40px rgba(0,0,0,0.45), 0 -2px 0 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#15141a] border-b border-white/5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center text-[11px] text-zinc-500 font-medium">
              BlackSync · Leads
            </span>
          </div>

          <div className="flex h-[360px] sm:h-[440px]">
            {/* Sidebar */}
            <aside className="hidden sm:flex w-[150px] md:w-[180px] shrink-0 border-r border-white/5 bg-[#0a0a0e] flex-col">
              <div className="px-4 py-4 flex items-center gap-2 border-b border-white/5">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary via-orange-500 to-amber-500 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">B</span>
                </div>
                <span className="text-xs font-semibold tracking-tight">BlackSync</span>
              </div>
              <nav className="flex-1 py-3 space-y-0.5 px-2 text-[11px]">
                {[
                  { icon: LayoutDashboard, label: "Dashboard" },
                  { icon: Users, label: "Leads", active: true },
                  { icon: Phone, label: "Agents" },
                  { icon: Calendar, label: "Bookings" },
                  { icon: BarChart3, label: "Analytics" },
                  { icon: Plug, label: "Integrations" },
                  { icon: Settings, label: "Settings" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md font-medium ${
                      item.active
                        ? "bg-primary/20 text-white border border-primary/30"
                        : "text-zinc-400"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </nav>
              <div className="px-3 py-3 border-t border-white/5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/40 text-white flex items-center justify-center text-[9px] font-bold">
                  JS
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-semibold">John Smith</p>
                  <p className="text-[9px] text-zinc-500">Admin</p>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Topbar */}
              <header className="flex items-center justify-end sm:justify-between px-3 sm:px-5 py-3 border-b border-white/5">
                <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/5 flex-1">
                    <Search className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] text-zinc-500">Search leads…</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-white/5 border border-white/5 text-[10px]">
                    <Filter className="w-3 h-3" /> Filter
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary text-white text-[10px] font-semibold">
                    <Plus className="w-3 h-3" /> New Lead
                  </button>
                  <Bell className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </header>

              {/* Stat strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-3 sm:px-5 py-3 border-b border-white/5">
                {[
                  { icon: PhoneOutgoing, label: "Calls Today", value: "1,247", change: "+18%" },
                  { icon: CheckCircle2, label: "Qualified", value: "286", change: "+12%" },
                  { icon: Calendar, label: "Booked", value: "94", change: "+34%" },
                  { icon: Clock, label: "Avg Response", value: "11s", change: "−2s" },
                ].map((s) => (
                  <div key={s.label} className="p-2 rounded-md bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <s.icon className="w-2.5 h-2.5" />
                      <span className="text-[9px]">{s.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-sm font-bold text-white">{s.value}</span>
                      <span className="text-[9px] text-emerald-400">{s.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-[1.6fr_0.9fr_0.4fr] sm:grid-cols-[1.4fr_1.3fr_0.9fr_0.4fr] lg:grid-cols-[1.4fr_1.3fr_0.9fr_1fr_1.1fr_0.4fr] gap-2 px-3 sm:px-5 py-2 text-[9px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-white/5">
                  <span>Lead</span>
                  <span className="hidden sm:block">Phone</span>
                  <span>Status</span>
                  <span className="hidden lg:block">Industry</span>
                  <span className="hidden lg:block">Agent</span>
                  <span></span>
                </div>
                {leads.map((lead, i) => (
                  <div
                    key={lead.name}
                    className={`grid grid-cols-[1.6fr_0.9fr_0.4fr] sm:grid-cols-[1.4fr_1.3fr_0.9fr_0.4fr] lg:grid-cols-[1.4fr_1.3fr_0.9fr_1fr_1.1fr_0.4fr] gap-2 px-3 sm:px-5 py-2 items-center text-[10px] border-b border-white/[0.04] ${
                      i % 2 === 1 ? "bg-white/[0.015]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/70 to-orange-500/70 text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                        {lead.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-zinc-100 truncate">{lead.name}</span>
                    </div>
                    <span className="hidden sm:block text-zinc-400 truncate">{lead.phone}</span>
                    <span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[9px] font-semibold ${lead.statusColor}`}>
                        {lead.status}
                      </span>
                    </span>
                    <span className="hidden lg:block text-zinc-400 truncate">{lead.industry}</span>
                    <span className="hidden lg:block text-zinc-400 truncate">{lead.agent}</span>
                    <MoreHorizontal className="w-3 h-3 text-zinc-600 justify-self-end" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom fade into page background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"
          />
        </motion.div>
      </div>
    </section>
  );
}

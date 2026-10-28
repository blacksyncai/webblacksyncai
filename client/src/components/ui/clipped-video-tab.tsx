"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Mic,
  CalendarCheck,
  Database,
  CheckCircle2,
  LoaderCircle,
  Circle,
} from "lucide-react";

const items = [
  {
    icon: Zap,
    label: "AI Voice Calling",
    title: "AI Voice Calling",
    description:
      "Your AI agent dials leads within seconds of capture — handling objections, mirroring tone, and qualifying automatically.",
    video:
      "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622196/new107_qhrklf.mp4",
    card: {
      heading: "Outbound Calling",
      badge: "Live",
      goal: "Reach new leads within 11 seconds and qualify them before a human ISA ever picks up the phone.",
      tasks: [
        { title: "Lead imported from CRM", meta: "Completed in 1.2s", status: "completed" },
        { title: "Script & objections loaded", meta: "Completed in 2.4s", status: "completed" },
        { title: "Outbound call placed", meta: "In progress... 11s", status: "progress" },
        { title: "Qualification result logged", meta: "Pending", status: "pending" },
      ],
    },
  },
  {
    icon: Mic,
    label: "Lead Qualification",
    title: "Lead Qualification",
    description:
      "Emotion detection, tone mirroring, and smart question branching — your AI qualifies like a seasoned ISA.",
    video:
      "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622271/02_u2efg7.mp4",
    card: {
      heading: "Qualify & Score",
      badge: "Auto-scored",
      goal: "Ask qualifying questions, detect buying signals, and route hot leads instantly to your team.",
      tasks: [
        { title: "Detect lead intent", meta: "Completed in 3.1s", status: "completed" },
        { title: "Run objection handling", meta: "Completed in 5.8s", status: "completed" },
        { title: "Score & categorize lead", meta: "In progress... 9s", status: "progress" },
        { title: "Trigger hot-lead SMS alert", meta: "Pending", status: "pending" },
      ],
    },
  },
  {
    icon: CalendarCheck,
    label: "Calendar Booking",
    title: "Calendar Booking",
    description:
      "Qualified leads get booked directly into your calendar. Integrates with Calendly, Google Calendar, and your CRM.",
    video:
      "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779621768/new105_meaomd.mp4",
    card: {
      heading: "Auto-Book",
      badge: "Booked",
      goal: "Convert qualified conversations into confirmed calendar appointments — zero manual follow-up needed.",
      tasks: [
        { title: "Confirm lead availability", meta: "Completed in 2.0s", status: "completed" },
        { title: "Match open calendar slot", meta: "Completed in 1.5s", status: "completed" },
        { title: "Send calendar invite", meta: "In progress... 4s", status: "progress" },
        { title: "Log appointment in CRM", meta: "Pending", status: "pending" },
      ],
    },
  },
  {
    icon: Database,
    label: "CRM & Analytics",
    title: "CRM & Analytics",
    description:
      "Every call, score, and appointment syncs back to Follow Up Boss, Sierra, kvCORE, and more — in real time.",
    video:
      "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622220/new108_k1a47m.mp4",
    card: {
      heading: "Sync & Report",
      badge: "Synced",
      goal: "Keep your CRM up to date automatically and surface actionable analytics across your entire pipeline.",
      tasks: [
        { title: "Push call transcript to CRM", meta: "Completed in 1.9s", status: "completed" },
        { title: "Update lead status & score", meta: "Completed in 2.3s", status: "completed" },
        { title: "Generate call analytics", meta: "In progress... 6s", status: "progress" },
        { title: "Export weekly report", meta: "Pending", status: "pending" },
      ],
    },
  },
];

export default function ClippedVideoTab() {
  const [activeTab, setActiveTab] = useState(0);
  const activeItem = items[activeTab];

  return (
    <section
      id="hear-it-in-action"
      className="bg-background py-20 overflow-hidden scroll-mt-28"
      data-testid="section-platform-demo"
    >
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-start mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[46px] md:leading-[50px] leading-tight tracking-tight font-semibold text-foreground max-w-2xl">
              Your AI Agent,<br />In Action
            </h2>
          </div>
          <div>
            <p className="text-[18px] leading-[32px] text-muted-foreground max-w-lg">
              From the first ring to a booked appointment — see exactly how BlackSync's AI handles every stage of your{" "}
              <span className="font-medium text-foreground">outbound pipeline</span>.
            </p>
          </div>
        </div>
      </div>

      {/* IMAGE AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* MOBILE TABS (horizontal scroll) */}
        <div className="md:hidden -mx-4 px-4 mb-4 flex gap-2 overflow-x-auto pb-2">
          {items.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex shrink-0 items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  isActive
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-foreground/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* FLOATING TABS (desktop) */}
        <div className="hidden md:block absolute left-2 bottom-16 z-20">
          <div className="bg-background rounded-[28px] shadow-xl border border-border p-3 w-[240px]">
            <div className="flex flex-col gap-2">
              {items.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    data-testid={`tab-platform-${index}`}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 border
                      ${isActive
                        ? "bg-primary/10 border-primary"
                        : "border-transparent hover:border-primary hover:bg-primary/5"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                      }`}
                    />
                    <span
                      className={`text-[15px] font-medium transition-colors duration-300 ${
                        isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* VIDEO CONTAINER */}
        <div
          className="relative overflow-hidden h-[440px] sm:h-[560px] md:h-[690px] bg-gradient-to-br from-[#241812] via-[#311f15] to-[#3e2517]"
          style={{
            clipPath: "polygon(0 0, 92% 0, 100% 12%, 100% 100%, 30% 100%, 22% 88%, 0 88%)",
            borderRadius: "34px",
          }}
        >
          {/* Warm glow fallback so the area is never bare if the video is slow/blocked */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, hsl(14 80% 55% / 0.35), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 100%, hsl(32 80% 55% / 0.25), transparent 70%)",
            }}
          />
          {/* VIDEO */}
          <AnimatePresence mode="wait">
            <motion.video
              key={activeItem.video}
              src={activeItem.video}
              autoPlay
              muted
              loop
              playsInline
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/20" />

          {/* CENTER CARD */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.card.heading}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.35 }}
                className="w-[88%] max-w-[320px] rounded-[26px] border border-white/30 bg-white/85 backdrop-blur-xl shadow-2xl p-5"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-semibold text-[#3d2e28]">
                    {activeItem.card.heading}
                  </h3>
                  <span className="text-[11px] bg-primary/15 text-primary px-2 py-1 rounded-md font-medium">
                    {activeItem.card.badge}
                  </span>
                </div>

                {/* GOAL */}
                <div className="mt-4 border border-[#e7e7e7] rounded-xl p-3">
                  <p className="text-[11px] text-[#777]">Goal</p>
                  <p className="text-[13px] leading-[20px] mt-1 text-[#3d2e28]">
                    {activeItem.card.goal}
                  </p>
                </div>

                {/* TASKS */}
                <div className="mt-4 flex flex-col gap-3">
                  {activeItem.card.tasks.map((task, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-[2px]">
                        {task.status === "completed" && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                        {task.status === "progress" && (
                          <LoaderCircle className="w-4 h-4 text-primary animate-spin" />
                        )}
                        {task.status === "pending" && (
                          <Circle className="w-4 h-4 text-[#bdbdbd]" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-[13px] ${
                            task.status === "completed"
                              ? "line-through text-[#888]"
                              : task.status === "progress"
                              ? "text-primary font-medium"
                              : "text-[#999]"
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-[#999]">{task.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-5 text-[11px] text-[#888]">
                  <span>2/4 tasks complete</span>
                  <span>Est. ~11s remaining</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

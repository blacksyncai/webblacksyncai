import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  BarChart,
  Plug,
  Brain,
  Users,
  Bot,
} from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "AI Voice Calling",
    description: "Natural, human-sounding calls that handle objections live.",
  },
  {
    icon: MessageSquare,
    title: "Smart SMS Sequences",
    description: "Multi-touch texts triggered by lead behavior and timing.",
  },
  {
    icon: Mail,
    title: "Email Drip Campaigns",
    description: "AI-written emails personalized to every prospect.",
  },
  {
    icon: Calendar,
    title: "Direct Calendar Booking",
    description: "Books appointments in real time, confirms both sides.",
  },
  {
    icon: Brain,
    title: "Lead Scoring & Qualification",
    description: "Scores every lead on budget, timeline, and intent.",
  },
  {
    icon: Plug,
    title: "CRM & Lead Source Sync",
    description: "Native, bi-directional sync with 100+ CRMs.",
  },
  {
    icon: BarChart,
    title: "Real-Time Analytics",
    description: "Tracks connect rates and cost-per-appointment by source.",
  },
  {
    icon: Users,
    title: "Team Distribution",
    description: "Round-robin or priority-based routing by rep.",
  },
  {
    icon: Bot,
    title: "ChatGPT & Claude Plugins",
    badge: "New",
    description: "Run campaigns and check results from your assistant.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" data-testid="section-features" className="pt-8 md:pt-10 pb-24 md:pb-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-4">Platform Capabilities</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything Your{" "}
            <span className="gradient-text">AI Colleague</span> Can Do
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A full outbound sales stack powered by AI. Calls, texts, emails,
            qualification, and booking - all on autopilot.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 [&>*:nth-child(9)]:col-span-2 sm:[&>*:nth-child(9)]:col-span-1">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group p-4 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover-elevate transition-all duration-200"
              data-testid={`feature-${index}`}
            >
              <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                <feature.icon className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm mb-1">
                {feature.title}
                {feature.badge && (
                  <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                    {feature.badge}
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

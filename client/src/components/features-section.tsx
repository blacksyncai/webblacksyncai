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
    description:
      "Natural, human-sounding outbound calls. Your AI handles objections, answers questions, and keeps the conversation flowing like a seasoned sales pro.",
  },
  {
    icon: MessageSquare,
    title: "Smart SMS Sequences",
    description:
      "Multi-touch text campaigns that feel personal. Automated follow-up cadences triggered by lead behavior, responses, and time-based rules.",
  },
  {
    icon: Mail,
    title: "Email Drip Campaigns",
    description:
      "AI-written emails personalized to each prospect. Market updates for real estate, rate alerts for mortgage, and renewal reminders for insurance.",
  },
  {
    icon: Calendar,
    title: "Direct Calendar Booking",
    description:
      "Syncs with Google Calendar, Outlook, and Calendly. Your AI books appointments in real-time and sends confirmations to both you and the prospect.",
  },
  {
    icon: Brain,
    title: "Lead Scoring & Qualification",
    description:
      "AI scores every lead based on conversation signals. Budget, timeline, motivation level, and intent - all tracked and updated in real time.",
  },
  {
    icon: Plug,
    title: "CRM & Lead Source Sync",
    description:
      "Native integrations with Follow Up Boss, kvCORE, Salesforce, HubSpot, AgentCRM, and 100+ platforms. Bi-directional sync keeps everything current.",
  },
  {
    icon: BarChart,
    title: "Real-Time Analytics",
    description:
      "Track call volume, connect rates, appointment rates, and cost-per-appointment. See which lead sources and scripts perform best.",
  },
  {
    icon: Users,
    title: "Team Distribution",
    description:
      "Round-robin or priority-based lead routing. Assign leads to agents based on geography, specialization, performance, or availability.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" data-testid="section-features" className="pt-12 md:pt-16 pb-24 md:pb-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group p-5 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover-elevate transition-all duration-200"
              data-testid={`feature-${index}`}
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 group p-6 rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 via-card/30 to-card/30 backdrop-blur-sm hover-elevate transition-all duration-200"
          data-testid="feature-chatgpt-plugin"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-10 h-10 shrink-0 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1.5">
                ChatGPT & Claude Plugins
                <span className="ml-2 text-xs font-medium uppercase tracking-wide text-primary">
                  New
                </span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Control your AI calling agents from ChatGPT or Claude. Launch
                campaigns, check call results, and update lead lists straight
                from the assistant you already use — no dashboard required.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

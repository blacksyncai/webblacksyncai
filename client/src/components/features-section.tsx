import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function FeaturesSection() {
  return (
    <section id="features" data-testid="section-features" className="pt-2 md:pt-4 pb-14 md:pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
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
      </div>
    </section>
  );
}

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { usePageMeta } from "@/hooks/use-page-meta";

export function LegalPage({
  title,
  description,
  path,
  lastUpdated,
  children,
}: {
  title: string;
  description: string;
  path: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  usePageMeta({ title, description, path });

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-testid={`page-legal-${path.replace(/\//g, "")}`}
    >
      <Navbar />
      <div className="flex-1 pt-28 pb-20 md:pt-36">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: {lastUpdated}</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

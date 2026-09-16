import { ToolDock, ToolDockTile, type ToolDockItem } from "@/components/ui/techstack";

type Brand = { label: string; file: string; fit: string };

const BRANDS: Brand[] = [
  { label: "Salesforce", file: "salesforce", fit: "size-[56%]" },
  { label: "HubSpot", file: "hubspot", fit: "size-[58%]" },
  { label: "ZoomInfo", file: "zoominfo", fit: "size-[56%]" },
  { label: "Outreach", file: "outreach", fit: "size-[58%]" },
  { label: "Gong", file: "gong", fit: "size-[62%]" },
  { label: "Oracle", file: "oracle", fit: "size-[72%]" },
];

/** A brand's official mark, stored locally under /brand-logos, in a neutral charcoal tone. */
function BrandLogo({ file, fit }: { file: string; fit: string }) {
  return (
    <img
      src={`/brand-logos/${file}.svg`}
      alt=""
      draggable={false}
      className={`${fit} object-contain`}
    />
  );
}

function logo(brand: Brand): ToolDockItem {
  return {
    label: brand.label,
    icon: (
      <ToolDockTile>
        <BrandLogo file={brand.file} fit={brand.fit} />
      </ToolDockTile>
    ),
  };
}

const STACK_ITEMS: ToolDockItem[] = BRANDS.map(logo);

export function StackDockSection() {
  return (
    <section className="py-8 md:py-12 border-b border-border" aria-label="Works with your existing stack">
      <h2 className="text-center text-[15px] font-medium text-foreground sm:text-[17px]">
        Works with your existing stack
      </h2>

      {/* Desktop and up: the animated overlapping dock. The dock reserves its
          own room above for the tooltip, which is the gap under the heading. */}
      <div className="hidden md:block">
        <ToolDock items={STACK_ITEMS} label="Works with your existing stack" />
      </div>

      {/* Below the dock's breakpoint: a static grid instead. Hover-driven
          magnify/tilt/tooltips don't translate to touch, so mobile gets its
          own clean, always-legible presentation with the brand name shown
          directly on each card. */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mt-6 px-4 md:hidden">
        {BRANDS.map((brand) => (
          <div
            key={brand.label}
            className="flex items-center gap-2.5 rounded-xl border border-card-border bg-card px-3 py-3 shadow-sm"
            data-testid={`stack-grid-${brand.label.toLowerCase()}`}
          >
            <div className="size-9 shrink-0">
              <ToolDockTile>
                <BrandLogo file={brand.file} fit={brand.fit} />
              </ToolDockTile>
            </div>
            <span className="text-sm font-medium text-foreground">{brand.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

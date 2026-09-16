import { ToolDock, ToolDockTile, type ToolDockItem } from "@/components/ui/techstack";

/** A brand's official mark, stored locally under /brand-logos, on a neutral app-icon tile. */
function logo(label: string, file: string, fit: string): ToolDockItem {
  return {
    label,
    icon: (
      <ToolDockTile>
        <img
          src={`/brand-logos/${file}.svg`}
          alt=""
          draggable={false}
          className={`${fit} object-contain`}
        />
      </ToolDockTile>
    ),
  };
}

const STACK_ITEMS: ToolDockItem[] = [
  logo("Salesforce", "salesforce", "size-[56%]"),
  logo("HubSpot", "hubspot", "size-[58%]"),
  logo("ZoomInfo", "zoominfo", "size-[56%]"),
  logo("Outreach", "outreach", "size-[58%]"),
  logo("Gong", "gong", "size-[62%]"),
  logo("Oracle", "oracle", "size-[62%]"),
];

export function StackDockSection() {
  return (
    <section className="py-12 md:py-16 border-b border-border" aria-label="Works with your existing stack">
      <h2 className="text-center text-[15px] font-medium text-foreground sm:text-[17px]">
        Works with your existing stack
      </h2>
      {/* The dock reserves its own room above for the tooltip, which is the
          gap under the heading. */}
      <ToolDock items={STACK_ITEMS} label="Works with your existing stack" />
    </section>
  );
}

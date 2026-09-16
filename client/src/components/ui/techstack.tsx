"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ToolDockItem = {
  /** Shown in the tooltip and read out by screen readers. */
  label: string;
  /** Fills the tile. It is decorative: give images `alt=""`. */
  icon: React.ReactNode;
};

export type ToolDockProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items: ToolDockItem[];
  /** Largest tile size in px. The row shrinks to fit a narrower container. */
  size?: number;
  /**
   * How far each tile tucks under the one before it, as a share of its
   * width. Negative leaves a gap instead.
   */
  overlap?: number;
  /** How much the tile under the pointer grows: 0.28 is 28%. */
  magnification?: number;
  /** Lean each tile its own way at rest. */
  tilt?: boolean;
  /** Accessible name for the list. */
  label?: string;
};

/** Fixed per position, so the row leans the same way on every render. */
const TILT = [-7, 5, -4, 8, -6, 4, -8, 6, -3, 7, -5, 6];
/** How many tile widths either side of the pointer still swell. */
const REACH = 1.2;
/** How far a fully swollen tile rises, in tile heights. */
const LIFT = 0.19;
/** Quick to settle, with no wobble, so a tile is home right after the pointer moves on. */
const SPRING = { stiffness: 520, damping: 40, mass: 0.5 };

/** Each slot's resting centre along the row, measured without transforms. */
type Layout = { centers: number[]; width: number };

/**
 * How swollen tile `k` is with the pointer at `x`, from 0 to 1. Squared, so
 * the tile under the pointer takes almost all of it and its neighbours only
 * stir.
 */
function swellAt({ centers, width }: Layout, k: number, x: number) {
  const center = centers[k];
  if (!Number.isFinite(x) || center === undefined || !width) return 0;
  return Math.max(0, 1 - Math.abs(x - center) / width / REACH) ** 2;
}

/**
 * The tiles deal themselves in, left to right, the first time the row is in
 * view: each rises a little and sharpens as it lands. With reduced motion
 * they are simply there. The starting state is the same either way, so
 * server and client render alike.
 */
const deal: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.94, filter: "blur(3px)" },
  shown: ({ index, still }: { index: number; still: boolean }) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: still
      ? { duration: 0 }
      : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 },
    transitionEnd: { filter: "none" },
  }),
};

type DockTileProps = {
  item: ToolDockItem;
  index: number;
  count: number;
  pointer: MotionValue<number>;
  layout: React.MutableRefObject<Layout>;
  still: boolean;
  overlap: number;
  magnification: number;
  tilt: boolean;
};

/**
 * One tile. Everything it does is worked out from the pointer's position
 * along the row against the tile's resting centre, never from what is under
 * the pointer: the tiles swell and overlap, so hit-testing them would change
 * the hovered one as they grew, which is what makes most docks flicker.
 *
 * Tiles never change places in the stack. The row makes room instead: as a
 * tile swells, everything on its left slides left and everything on its right
 * slides right, just far enough for the grown tile to clear the neighbours it
 * used to tuck under, so no logo is ever covered by more than it is at rest.
 */
const DockTile = React.memo(function DockTile({
  item,
  index,
  count,
  pointer,
  layout,
  still,
  overlap,
  magnification,
  tilt,
}: DockTileProps) {
  const lean = tilt ? TILT[index % TILT.length] : 0;
  // A fully swollen tile pushes each neighbour this far, in tile widths: half
  // its own growth, plus the overlap it has to clear or less the gap it has.
  const room = Math.max(0, overlap + magnification / 2);

  const near = useTransform(pointer, (x) =>
    still ? 0 : swellAt(layout.current, index, x),
  );
  // Pushed right by every swollen tile on its left and left by every one on
  // its right, so the row opens up around the pointer like a dock does.
  const push = useTransform(pointer, (x) => {
    if (still) return 0;
    const { centers, width } = layout.current;
    let shift = 0;
    for (let k = 0; k < centers.length; k++) {
      if (k !== index) {
        shift += swellAt(layout.current, k, x) * (k < index ? 1 : -1);
      }
    }
    return shift * width * room;
  });

  const swell = useSpring(near, SPRING);
  const x = useSpring(push, SPRING);
  const scale = useTransform(swell, (v) => 1 + v * magnification);
  const y = useTransform(swell, (v) => -v * LIFT * layout.current.width);
  const rotate = useTransform(swell, (v) => lean * (1 - v));

  return (
    <motion.li
      data-slot="tool-dock-item"
      custom={{ index, still }}
      variants={deal}
      className="pointer-events-none relative flex"
      style={{
        // At rest each tile covers the one after it.
        zIndex: count - index,
        marginLeft:
          index === 0 ? 0 : `calc(var(--tool-dock-size) * ${-overlap})`,
      }}
    >
      <motion.div
        role="img"
        aria-label={item.label}
        style={{ x, y, scale, rotate }}
        className="size-(--tool-dock-size) origin-bottom will-change-transform select-none"
      >
        {item.icon}
      </motion.div>
    </motion.li>
  );
});

/**
 * An overlapping, tilted row of tiles that swells around the pointer, with
 * one label that glides to whichever tile is nearest.
 */
export function ToolDock({
  items,
  size = 56,
  overlap = 0.12,
  magnification = 0.28,
  tilt = true,
  label = "Tools",
  className,
  ...props
}: ToolDockProps) {
  const rail = React.useRef<HTMLUListElement>(null);
  const layout = React.useRef<Layout>({ centers: [], width: 0 });
  const still = useReducedMotion() ?? false;
  // The pointer's position along the row in px, Infinity when elsewhere.
  const pointer = useMotionValue(Number.POSITIVE_INFINITY);
  const [active, setActive] = React.useState<number | null>(null);
  // Read by the pointer handlers, which can fire twice before a render.
  const current = React.useRef<number | null>(null);
  // The tooltip glides between tiles, but appears in place when it opens.
  const [glide, setGlide] = React.useState(false);
  const [at, setAt] = React.useState(0);
  // Kept once the pointer leaves, so the text does not blank out mid-fade.
  const [text, setText] = React.useState(items[0]?.label ?? "");

  // Slots never move (only the tiles inside them do), so their centres are
  // measured once and again whenever the row changes size.
  React.useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const measure = () => {
      const slots = Array.from(el.children) as HTMLElement[];
      layout.current = {
        centers: slots.map((li) => li.offsetLeft + li.offsetWidth / 2),
        width: slots[0]?.offsetWidth ?? 0,
      };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  const track = (clientX: number) => {
    const el = rail.current;
    if (!el) return;
    const x = clientX - el.getBoundingClientRect().left;
    pointer.set(x);
    const { centers } = layout.current;
    if (centers.length === 0) return;
    let nearest = 0;
    for (let i = 1; i < centers.length; i++) {
      if (Math.abs(x - centers[i]) < Math.abs(x - centers[nearest])) nearest = i;
    }
    if (nearest === current.current) return;
    setGlide(current.current !== null);
    current.current = nearest;
    setActive(nearest);
    setText(items[nearest].label);
    setAt(centers[nearest]);
  };

  const release = () => {
    pointer.set(Number.POSITIVE_INFINITY);
    current.current = null;
    setActive(null);
  };

  // The row fits its container, `size` or smaller, with room to open up
  // around a swollen tile on either side.
  const span =
    1 +
    (items.length - 1) * (1 - overlap) +
    2 * Math.max(0, overlap + magnification / 2);
  // A swollen tile rises this far above the row; the label sits clear of it.
  const rise = LIFT + magnification;

  return (
    <div
      data-slot="tool-dock"
      className={cn("flex w-full justify-center @container", className)}
      {...props}
    >
      <div
        className="relative w-fit pt-[calc(var(--tool-dock-size)*var(--tool-dock-rise)+2.75rem)]"
        style={
          {
            "--tool-dock-size": `min(${size}px, calc((100cqw - 1rem) / ${span}))`,
            "--tool-dock-rise": rise,
          } as React.CSSProperties
        }
      >
        <span
          aria-hidden
          data-slot="tool-dock-tooltip"
          data-state={active === null ? "closed" : "open"}
          className={cn(
            "pointer-events-none absolute bottom-[calc(var(--tool-dock-size)*(1+var(--tool-dock-rise))+0.625rem)] left-0 z-50 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-[13px] font-medium text-popover-foreground shadow-sm opacity-0 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=open]:opacity-100 motion-reduce:transition-none",
            glide
              ? "transition-[translate,opacity] duration-300"
              : "transition-opacity duration-200",
          )}
          style={{ translate: `calc(${at}px - 50%) 0` }}
        >
          {text}
          <span className="absolute -bottom-[5px] left-1/2 -ml-[4.5px] size-[9px] rotate-45 rounded-br-[2px] border-r border-b border-border bg-popover" />
        </span>

        <motion.ul
          ref={rail}
          role="list"
          aria-label={label}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.2 }}
          onPointerMove={(event) => {
            if (event.pointerType === "mouse") track(event.clientX);
          }}
          onPointerDown={(event) => {
            if (event.pointerType === "mouse") track(event.clientX);
          }}
          onPointerLeave={release}
          onPointerUp={(event) => {
            if (event.pointerType !== "mouse") release();
          }}
          onPointerCancel={release}
          className="relative flex w-fit touch-pan-y"
        >
          {items.map((item, index) => (
            <DockTile
              key={item.label}
              item={item}
              index={index}
              count={items.length}
              pointer={pointer}
              layout={layout}
              still={still}
              overlap={overlap}
              magnification={magnification}
              tilt={tilt}
            />
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

/**
 * An app-icon tile for a logo: a rounded square with a soft lift, a top
 * highlight and a hairline edge that holds on light and dark pages alike.
 * Set its colour with `className`.
 */
export function ToolDockTile({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="tool-dock-tile"
      className={cn(
        "relative grid size-full place-items-center overflow-hidden rounded-[23%] bg-white shadow-[0_0_0_0.5px_rgb(0_0_0/0.08),0_1px_1.5px_rgb(0_0_0/0.16),0_0_0.5px_rgb(0_0_0/0.12)]",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-linear-to-b after:from-white/15 after:to-transparent after:shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.14),inset_0_1px_0_rgb(255_255_255/0.3)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

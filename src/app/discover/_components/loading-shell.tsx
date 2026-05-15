import { SkeletonCard } from "@/components/ui/card";

export default function DiscoverLoadingShell() {
  const arr = new Array(20).fill(0);

  return (
    <ul className="discover-grid">
      {arr.map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </ul>
  );
}

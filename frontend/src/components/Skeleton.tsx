interface SkeletonProps {
  height?: string;
  width?: string;
}

export function Skeleton({ height = "1rem", width = "100%" }: SkeletonProps) {
  return (
    <span
      className="skeleton"
      style={{ height, width }}
      aria-hidden="true"
    />
  );
}
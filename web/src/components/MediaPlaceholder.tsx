type MediaPlaceholderProps = {
  label?: string;
  className?: string;
  ratio?: "hero" | "square";
};

/** Empty media slot until final photography/video is approved. */
export function MediaPlaceholder({
  label = "Image placeholder",
  className = "",
  ratio = "hero",
}: MediaPlaceholderProps) {
  return (
    <div
      className={`media-placeholder media-placeholder--${ratio} ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      <span>{label}</span>
    </div>
  );
}

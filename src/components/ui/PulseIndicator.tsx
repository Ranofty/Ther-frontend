export function PulseIndicator() {
  return (
    <span className="relative inline-flex w-2 h-2">
      <span className="absolute inset-0 rounded-full bg-[var(--green)] animate-ping opacity-60" />
      <span className="relative rounded-full w-2 h-2 bg-[var(--green)]" />
    </span>
  );
}

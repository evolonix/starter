export function AdminIndicator({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute top-0 right-0 size-18 overflow-hidden ${className}`}
    >
      <div className="pointer-events-none absolute -top-1 -right-9 w-[100px] rotate-45 transform bg-red-500 pt-4 pb-1 text-center text-xs font-normal text-zinc-950 dark:bg-red-400">
        <span className="not-sr-only">Admin</span>
        <span className="sr-only">This user is an admin.</span>
      </div>
    </div>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        width="22"
        height="22"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id="ld-logo" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="#111114" />
        <path
          d="M8 22 Q 12 10, 16 16 T 24 14"
          stroke="url(#ld-logo)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="8" cy="22" r="2" fill="#a78bfa" />
        <circle cx="24" cy="14" r="2" fill="#6366f1" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight text-white">
        Infinite <span className="text-brand">Draw</span>
      </span>
    </div>
  )
}

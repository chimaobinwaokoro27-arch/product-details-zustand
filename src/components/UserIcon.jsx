export default function UserIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.75 20a7.25 7.25 0 0 1 14.5 0" />
    </svg>
  )
}
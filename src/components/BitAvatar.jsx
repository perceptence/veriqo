import { C } from "../styles/tokens.js";

/* User avatar — static, framed illustration */
export function BitAvatar({ size = 132 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 132 132" style={{ display: "block" }}>
      <circle cx="66" cy="66" r="60" fill="#F7E9D3" />
      <path d="M40 122c2-17 12-25 26-25s24 8 26 25z" fill={C.acc} />
      <rect x="59" y="86" width="14" height="16" rx="7" fill="#F0C6A0" />
      <circle cx="66" cy="60" r="30" fill="#F5CFA8" />
      <path d="M37 58c0-19 13-30 29-30s29 11 29 30c-5-7-10-9-10-9s-3 5-19 5-18-5-18-5-6 2-11 9z" fill={C.ink} />
      <path d="M37 58c-1 6 0 11 2 15-3-9-1-18-1-18zM95 58c1 6 0 11-2 15 3-9 1-18 1-18z" fill={C.ink} />
      <circle cx="37" cy="62" r="5" fill="#F0C6A0" />
      <circle cx="95" cy="62" r="5" fill="#F0C6A0" />
      <path d="M52 58q4-5 8 0" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M72 58q4-5 8 0" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="49" cy="68" r="5" fill="#FF9E86" opacity=".5" />
      <circle cx="83" cy="68" r="5" fill="#FF9E86" opacity=".5" />
      <path d="M54 70q12 12 24 0" stroke={C.ink} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M57 73q9 7 18 0z" fill="#fff" />
    </svg>
  );
}

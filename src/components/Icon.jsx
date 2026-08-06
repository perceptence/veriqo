import {
  ShieldCheck, Camera, CreditCard, BookOpen, User, Lightbulb, Glasses,
  Smartphone, Lock, Trash2, ArrowRight, ArrowUpRight, Check, Eye, RotateCcw, Wallet as WalletIcon, QrCode,
  Share2, Plus, ChevronRight, Bell, Key, Clock, SlidersHorizontal, Globe,
  Fingerprint, X, MoreHorizontal, LogOut, Pencil, Copy, AlertTriangle,
  Mail, Flag, FileText, Search, Star, Calendar, Hash, MapPin,
} from "lucide-react";
import { strokeFor } from "../styles/tokens.js";

/* Film-grain overlay used across dark cards and surfaces */
export function Grain({ o = 0.05, blend = "overlay" }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
      opacity: o, mixBlendMode: blend, pointerEvents: "none", zIndex: 50 }}>
      <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#gr)" />
    </svg>
  );
}

/* Icon system: custom SVG paths for specialty marks, Lucide for standard UI.
   Stroke width is derived from size (see STROKE/strokeFor in tokens.js) so
   every icon carries the same perceived weight — do not pass sw per call site. */
export function Ic({ n, s = 22, c = "currentColor", sw = strokeFor(s) }) {
  const SV = {
    pulse: <polyline fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" points="2,12 5,12 7,5 9,19 11,12 13,15 15,9 17,12 22,12" />,
    devices: <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><rect x="9" y="17" width="6" height="3" rx="1.5" fill={c} stroke="none" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="15" y2="11" /></g>,
    contacts: <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round"><circle cx="9" cy="7" r="4" /><path d="M2 21v-1a7 7 0 0 1 14 0v1" /><circle cx="19" cy="11" r="3" /><path d="M22 21v-1a4 4 0 0 0-6-3.6" /></g>,
    grip: <g>
      <circle cx={7.5} cy={7} r={1.3} fill={c} stroke="none" />
      <circle cx={7.5} cy={12} r={1.3} fill={c} stroke="none" />
      <circle cx={7.5} cy={17} r={1.3} fill={c} stroke="none" />
      <circle cx={13.5} cy={7} r={1.3} fill={c} stroke="none" />
      <circle cx={13.5} cy={12} r={1.3} fill={c} stroke="none" />
      <circle cx={13.5} cy={17} r={1.3} fill={c} stroke="none" />
    </g>,
    faceid: <><path d="M4 8V4H8M16 4H20V8M20 16V20H16M8 20H4V16" /><path d="M9.3 10.5v1.6M14.7 10.5v1.6" /><path d="M9 15.3Q12 17.3 15 15.3" /></>,
    license: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><rect x="6" y="8.5" width="5" height="6" rx="1" /><path d="M14 9h4M14 12h4M14 15h3" /></>,
    stateid: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><circle cx="8" cy="11" r="2" /><path d="M13 10h5M13 13.5h5M6 15.5h7" /></>,
    passport: <path fill={c} strokeWidth="0.7" transform="scale(1.045) translate(-0.52 -0.52)" d="M8.5 18.192h7v-.884h-7zM12 15.04q1.864 0 3.191-1.328q1.328-1.328 1.328-3.211q0-1.863-1.328-3.191T12 5.98q-1.883 0-3.21 1.328Q7.462 8.637 7.462 10.5q0 1.883 1.328 3.21q1.327 1.33 3.21 1.33m0-1.002q-.412-.603-.675-1.384q-.263-.782-.32-1.71h1.97q-.056.928-.32 1.71q-.263.782-.655 1.384m-1.127-.075q-.984-.318-1.66-1.123t-.844-1.897h1.752q.031.722.208 1.476q.177.755.544 1.544m2.12 0q.386-.731.601-1.496q.216-.764.266-1.524h1.752q-.189 1.09-.893 1.897t-1.727 1.123M8.37 10.058q.189-1.148.912-1.973T11.008 7q-.406.616-.621 1.39q-.216.773-.266 1.668zm2.637 0q.055-.967.319-1.759T12 6.925q.392.583.656 1.374q.263.792.319 1.759zm2.853 0q-.03-.837-.246-1.611q-.215-.774-.64-1.447q1.061.26 1.785 1.094q.723.835.854 1.964zM5 21V3h12.385q.67 0 1.143.472q.472.472.472 1.144v14.769q0 .67-.472 1.143q-.472.472-1.143.472zm1-1h11.385q.23 0 .423-.192t.192-.424V4.616q0-.231-.192-.424T17.384 4H6zm0 0V4z" />,
    dogtag: <><path d="M9 4.5a3 3 0 016 0" /><rect x="7" y="7" width="10" height="15" rx="5" /><circle cx="12" cy="11" r="1.3" /></>,
    dogtags: <><circle cx="12" cy="4.5" r="1.5" /><path d="M12 6v2" /><rect x="6.5" y="8" width="11" height="14" rx="4.5" /></>,
    car: <><path d="M5 12L7 8Q9 6.5 12 6.5Q15 6.5 17 8l2 4" /><rect x="2" y="12" width="20" height="3" rx="1.5" /><circle cx="7" cy="15" r="2.5" /><circle cx="17" cy="15" r="2.5" /></>,
    wine: <path d="M6 4h12M6 4L12 13 18 4M12 13v6M8.5 19h7" />,
    cake: <><rect x="3" y="15" width="18" height="6" rx="2" /><rect x="6.5" y="11" width="11" height="4" rx="1.5" /><path d="M12 11V8" /><path d="M11 8Q12 6 13 8" /></>,
    spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
    anchor: <><circle cx="12" cy="5" r="2" /><path d="M12 7v13M7 11h10M5 16a7 7 0 0014 0" /></>,
    scan: <><path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3" /><path d="M4 12h16" /></>,
    history: <><path d="M3.5 9a9 9 0 113.5 11" /><path d="M3 4v5h5" /><path d="M12 8v4l3 2" /></>,
    building: <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h6M10 21v-3h4v3" /></>,
    applewallet: <g transform="scale(0.2)" stroke="none"><path fill="#1e1e1f" d="M26,0H94a25.9482,25.9482,0,0,1,26,26V94a25.9482,25.9482,0,0,1-26,26H26A25.9482,25.9482,0,0,1,0,94V26A26.012,26.012,0,0,1,26,0Z" /><path fill="#d9d6cc" fillRule="evenodd" d="M22,26H98a8.02352,8.02352,0,0,1,8,8V86a8.02352,8.02352,0,0,1-8,8H22a8.02352,8.02352,0,0,1-8-8V34A8.02352,8.02352,0,0,1,22,26Z" /><path fill="#3b99c9" fillRule="evenodd" d="M24,30H96a6.01764,6.01764,0,0,1,6,6V70a6.01764,6.01764,0,0,1-6,6H24a6.01764,6.01764,0,0,1-6-6V36A6.01764,6.01764,0,0,1,24,30Z" /><path fill="#ffb003" fillRule="evenodd" d="M24,37H96a6.01764,6.01764,0,0,1,6,6V55a6.01764,6.01764,0,0,1-6,6H24a6.01764,6.01764,0,0,1-6-6V43A6.01764,6.01764,0,0,1,24,37Z" /><path fill="#50be3d" fillRule="evenodd" d="M24,44H96a6.01764,6.01764,0,0,1,6,6V62a6.01764,6.01764,0,0,1-6,6H24a6.01764,6.01764,0,0,1-6-6V50A6.01764,6.01764,0,0,1,24,44Z" /><path fill="#f26d5f" fillRule="evenodd" d="M24,51H96a6.01764,6.01764,0,0,1,6,6V69a6.01764,6.01764,0,0,1-6,6H24a6.01764,6.01764,0,0,1-6-6V57A6.01764,6.01764,0,0,1,24,51Z" /><path fill="#d9d6cc" fillRule="evenodd" d="M14,58h92V86a8.02352,8.02352,0,0,1-8,8H22a8.02352,8.02352,0,0,1-8-8Zm27,0c9,0,10,11.5,19,11.5S70,58,79,58Z" /></g>,
    plug: <><path d="M12 22v-5" /><path d="M9 8V2M15 8V2" /><rect x="5" y="8" width="14" height="7" rx="2" /><path d="M9 15a3 3 0 006 0" /></>,
    chart: <><path d="M3 3v18h18" /><polyline points="5,15 9,10 14,13 20,5" /><circle cx="5" cy="15" r="1.2" /><circle cx="9" cy="10" r="1.2" /><circle cx="14" cy="13" r="1.2" /><circle cx="20" cy="5" r="1.2" /></>,
    badge: <><path d="M12 2v3" /><rect x="9" y="5" width="6" height="2.5" rx="1.2" /><rect x="5" y="7.5" width="14" height="14" rx="2.5" /><circle cx="12" cy="13" r="2.8" /><path d="M8 21c0-2.2 1.8-3.2 4-3.2s4 1 4 3.2" /></>,
    locktime: <><path d="M8 12V8Q8 4 12 4Q16 4 16 8V12" /><rect x="3" y="12" width="18" height="10" rx="3" /><circle cx="12" cy="17" r="1" fill={c} stroke="none" /><path d="M12 17V14.5M12 17L14.5 18.5" /></>,
    toggle: <path d="M3 6h18M6 12h12M10 18h4" />,
    checkcirc: <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>,
    sliders: <><path d="M5 2V9M5 15V22" /><circle cx="5" cy="12" r="3" /><path d="M12 2V13M12 19V22" /><circle cx="12" cy="16" r="3" /><path d="M19 2V4M19 10V22" /><circle cx="19" cy="7" r="3" /></>,
  };
  if (SV[n]) return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{SV[n]}</svg>;

  const LM = {
    shield: ShieldCheck, camera: Camera, card: CreditCard, book: BookOpen,
    face: User, bulb: Lightbulb, glasses: Glasses, phone: Smartphone, lock: Lock,
    trash: Trash2, arrow: ArrowRight, upright: ArrowUpRight, check: Check, eye: Eye, rotate: RotateCcw,
    wallet: WalletIcon, qr: QrCode, share: Share2, plus: Plus, chev: ChevronRight,
    bell: Bell, key: Key, clock: Clock, sliders: SlidersHorizontal, globe: Globe,
    finger: Fingerprint, x: X, more: MoreHorizontal, logout: LogOut, user: User,
    edit: Pencil, copy: Copy, alert: AlertTriangle, mail: Mail, flag: Flag,
    file: FileText, search: Search, star: Star, calendar: Calendar, hash: Hash,
    mappin: MapPin,
  };
  const L = LM[n];
  if (L) return <L size={s} color={c} strokeWidth={sw} />;
  return null;
}

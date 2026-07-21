// import "./AdminDashboard.css";
// import { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import {
//   Users, UserPlus, Key, Eye, EyeOff, Trash2, Copy,
//   LayoutDashboard, LogOut, Palette, Megaphone, Building2,
//   RefreshCw, Search, Mail, Phone, Calendar,
//   ShieldCheck, ArrowUpRight, FolderOpen, User, CheckCircle,
//   Bell, Menu, Loader2, Sun, Moon, Upload, X,
// } from "lucide-react";
// import {
//   BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
//   LineChart, Line, CartesianGrid,
// } from "recharts";
// import {
//   apiAdminDashboard,
//   apiAdminGetUsers,
//   apiAdminCreateUser,
//   apiAdminProfile,
//   apiAdminChangePassword,
//   apiAdminUploadProfileImage,
//   apiAdminRemoveProfileImage,
//   apiAdminDesignProjects,
//   clearAdminSession,
// } from "@/lib/api";

// // ── Constants ────────────────────────────────────────────────────────────────
// // NOTE: pehle yahan CLIENT_STORE_KEY/TEAM_STORE_KEY (localStorage keys)
// // the — ab clients/team backend se aate hain, in constants ki zarurat nahi.

// // ── Types ─────────────────────────────────────────────────────────────────────
// type Role = "client" | "graphic_designer" | "smm";
// type Tab =
//   | "overview"
//   | "clients"
//   | "smm"
//   | "gd"
//   | "workspace"
//   | "profile"
//   | "add_client"
//   | "add_smm"
//   | "add_gd";

// interface TeamMember {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   role: Role;
//   password: string;
//   createdAt: string;
//   status: "active" | "inactive";
//   clientId?: string;
// }

// interface Client {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   company: string;
//   industry: string;
//   password: string;
//   createdAt: string;
//   status: "active" | "inactive";
//   assignedDesigner?: string;
//   assignedSMM?: string;
//   platforms: string[];
//   postsThisMonth: number;
//   budget?: string;
// }

// interface AdminSession {
//   token: string;
//   email: string;
//   name: string;
// }

// // ── Helpers ──────────────────────────────────────────────────────────────────
// const generatePassword = (): string => {
//   const chars =
//     "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
//   return Array.from(
//     { length: 12 },
//     () => chars[Math.floor(Math.random() * chars.length)]
//   ).join("");
// };

// const generateId = (): string =>
//   Math.random().toString(36).slice(2, 10).toUpperCase();


// // ── Platform config ───────────────────────────────────────────────────────────
// const PLATFORMS = [
//   { id: "Instagram",  color: "#E1306C", bg: "#fdf2f8", label: "Instagram" },
//   { id: "Facebook",   color: "#1877F2", bg: "#eff6ff", label: "Facebook" },
//   { id: "Twitter",    color: "#1DA1F2", bg: "#e0f2fe", label: "Twitter / X" },
//   { id: "LinkedIn",   color: "#0A66C2", bg: "#eff6ff", label: "LinkedIn" },
//   { id: "YouTube",    color: "#FF0000", bg: "#fff1f2", label: "YouTube" },
//   { id: "Pinterest",  color: "#E60023", bg: "#fff1f2", label: "Pinterest" },
//   { id: "Snapchat",   color: "#FFFC00", bg: "#fefce8", label: "Snapchat" },
//   { id: "TikTok",     color: "#010101", bg: "#f8fafc", label: "TikTok" },
//   { id: "Google",     color: "#4285F4", bg: "#eff6ff", label: "Google Ads" },
//   { id: "WhatsApp",   color: "#25D366", bg: "#f0fdf4", label: "WhatsApp" },
// ];

// // ── Platform SVG icons ────────────────────────────────────────────────────────
// const PlatformIcon = ({ id, size = 14 }: { id: string; size?: number }) => {
//   const icons: Record<string, JSX.Element> = {
//     Instagram: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//         <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="2"/>
//         <circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2"/>
//         <circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/>
//       </svg>
//     ),
//     Facebook: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
//         <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
//       </svg>
//     ),
//     Twitter: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DA1F2">
//         <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
//       </svg>
//     ),
//     LinkedIn: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
//         <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
//         <circle cx="4" cy="4" r="2" fill="#0A66C2"/>
//       </svg>
//     ),
//     YouTube: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000">
//         <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
//         <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
//       </svg>
//     ),
//     Pinterest: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="#E60023">
//         <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
//       </svg>
//     ),
//     TikTok: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="#010101">
//         <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.19a8.16 8.16 0 0 0 4.77 1.52V6.28a4.85 4.85 0 0 1-1-.59z"/>
//       </svg>
//     ),
//     Google: (
//       <svg width={size} height={size} viewBox="0 0 24 24">
//         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//         <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//         <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//         <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//       </svg>
//     ),
//     WhatsApp: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
//         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
//       </svg>
//     ),
//     Snapchat: (
//       <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFFC00">
//         <path d="M12.166.006c.167 0 1.12.027 1.993.477.596.306 1.83 1.196 1.83 3.035v.282c0 .59.026 2.012.372 2.953.05.135.074.178.14.23.184.143.474.142.665.099.133-.03.273-.072.437-.072.159 0 .283.035.373.107.177.14.208.367.065.538-.123.148-.466.397-1.04.583l-.047.016c-.023.008-.046.016-.07.023l-.027.009c-.038.013-.075.025-.11.037l-.054.019-.061.022a2.7 2.7 0 0 0-.104.042l-.063.03-.066.035a1.447 1.447 0 0 0-.119.074l-.053.038-.054.045-.043.039c-.25.237-.393.57-.359.916.021.217.065.456.122.683.182.727.565 1.337 1.119 1.767.35.27.81.462 1.396.568.236.043.427.22.427.458 0 .278-.217.508-.487.544-.107.014-.214.028-.32.028-.204 0-.405-.041-.605-.082-.2-.042-.4-.083-.604-.083-.242 0-.482.073-.72.249-.38.281-.608.777-.673 1.273-.053.416.041.786.228 1.056.109.16.188.327.196.498.006.135-.027.25-.103.344-.157.195-.457.26-.72.26-.067 0-.13-.006-.19-.013-.144-.018-.29-.036-.44-.036-.134 0-.267.014-.393.028l-.057.007c-.136.016-.267.032-.398.032-.168 0-.333-.022-.494-.067-.34-.095-.659-.33-.942-.697-.354-.46-.638-1.13-.798-1.927a.29.29 0 0 0-.064-.133c-.08-.085-.19-.12-.298-.12-.095 0-.192.026-.287.052-.096.026-.193.052-.289.052-.116 0-.207-.038-.28-.117a.407.407 0 0 1-.1-.28c0-.043.007-.088.022-.135l.032-.116c.074-.27.146-.54.175-.803.03-.262-.007-.527-.108-.75a2.019 2.019 0 0 0-.18-.316 1.89 1.89 0 0 0-.48-.49c-.164-.117-.344-.19-.525-.215a1.27 1.27 0 0 0-.174-.012c-.357 0-.667.151-.905.34-.397.315-.712.79-.868 1.362-.175.634-.14 1.35.066 1.963l.058.18c.068.21.135.416.135.622 0 .22-.066.409-.2.558-.243.272-.652.374-1.066.374-.167 0-.333-.02-.487-.04l-.152-.019a2.45 2.45 0 0 0-.323-.024c-.29 0-.577.055-.862.11-.286.055-.571.11-.856.11-.21 0-.356-.044-.457-.136-.14-.124-.17-.326-.076-.522.05-.108.1-.217.101-.33.002-.13-.05-.255-.153-.378-.443-.532-.797-1.163-.994-1.777a4.55 4.55 0 0 1-.204-1.344 3.95 3.95 0 0 1 .063-.712C2.05 14.49 1.8 14.38 1.6 14.258c-.24-.145-.41-.322-.41-.543 0-.24.194-.416.432-.458.586-.106 1.046-.298 1.396-.568.553-.43.937-1.04 1.118-1.766.058-.228.102-.467.123-.684.034-.347-.11-.68-.36-.916a1.86 1.86 0 0 0-.21-.167c-.044-.03-.09-.06-.138-.088l-.054-.031a2.634 2.634 0 0 0-.164-.085l-.063-.029a2.63 2.63 0 0 0-.105-.043l-.06-.022-.055-.019-.109-.037-.027-.009c-.024-.007-.047-.015-.07-.023l-.047-.016c-.574-.186-.917-.435-1.04-.583-.143-.171-.112-.398.065-.538.09-.072.214-.107.373-.107.164 0 .304.043.437.072.191.043.481.044.665-.099.066-.051.09-.094.14-.23.346-.941.372-2.363.372-2.953v-.282C3.82 1.19 5.084.305 5.677-.006A4.124 4.124 0 0 1 7.636-.5C7.8-.5 7.964-.487 8.12-.46c.586.1 1.12.38 1.527.702.254.203.5.457.716.752.217-.295.463-.549.716-.752A4.006 4.006 0 0 1 12.166.006z" stroke="none"/>
//       </svg>
//     ),
//   };
//   return icons[id] ?? <span style={{ fontSize: size * 0.7, fontWeight: 700, color: "#94a3b8" }}>{id.charAt(0)}</span>;
// };

// // ── GCLogo ────────────────────────────────────────────────────────────────────
// const GCLogo = ({ collapsed = false, darkMode = false }: { collapsed?: boolean; darkMode?: boolean }) => (
//   <div className="flex items-center gap-2.5">
//     <div className="relative shrink-0">
//       <div
//         style={{
//           width: 36,
//           height: 36,
//           borderRadius: 10,
//           background: "#33496a",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
         
//         }}
//       >
//         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//           <path
//             d="M3 14 L7 9 L10 12 L14 6 L17 10"
//             stroke="white"
//             strokeWidth="2.2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//           <circle cx="17" cy="10" r="2" fill="white" />
//         </svg>
//       </div>
//     </div>
//     {!collapsed && (
//       <div className="leading-none">
//         <div
//           style={{
//             fontFamily: "'Poppins', sans-serif",
//             fontWeight: 700,
//             fontSize: 15,
//             color: darkMode ? "#f1f5f9" : "#1a1a2e",
//             letterSpacing: "-0.3px",
//           }}
//         >
//           Growthcraft<span style={{ color: "#33496a" }}>360</span>
//         </div>
//         <div
//           style={{
//             fontSize: 10,
//             color: darkMode ? "#64748b" : "#94a3b8",
//             fontWeight: 500,
//             letterSpacing: "0.5px",
//             textTransform: "uppercase",
//           }}
//         >
//           Admin Panel
//         </div>
//       </div>
//     )}
//   </div>
// );

// // ── StatCard ──────────────────────────────────────────────────────────────────
// interface StatCardProps {
//   label: string;
//   value: number | string;
//   icon: React.ElementType;
//   color: string;
//   bg: string;
//   trend?: string;
//   dm: { card: string; border: string; text: string };
//   darkMode: boolean;
// }

// const StatCard = ({ label, value, icon: Icon, color, bg, trend, dm, darkMode }: StatCardProps) => (
//   <div
//     style={{
//       background: dm.card,
//       borderRadius: 16,
//       padding: "20px 22px",
//       border: `1px solid ${dm.border}`,
//       boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
//       display: "flex",
//       flexDirection: "column",
//       gap: 12,
//     }}
//   >
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//       }}
//     >
//       <div
//         style={{
//           width: 44,
//           height: 44,
//           borderRadius: 12,
//           background: bg,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Icon size={20} color={color} />
//       </div>
//       {trend && (
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 4,
//             fontSize: 12,
//             fontWeight: 600,
//             color: "#22c55e",
//           }}
//         >
//           <ArrowUpRight size={14} /> {trend}
//         </div>
//       )}
//     </div>
//     <div>
//       <div
//         style={{
//           fontSize: 28,
//           fontWeight: 800,
//           color: dm.text,
//           letterSpacing: "-1px",
//           lineHeight: 1,
//         }}
//       >
//         {value}
//       </div>
//       <div
//         style={{ fontSize: 12.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4, fontWeight: 500 }}
//       >
//         {label}
//       </div>
//     </div>
//   </div>
// );

// // ── PwField ───────────────────────────────────────────────────────────────────
// interface PwFieldProps {
//   password: string;
//   id: string;
//   show: boolean;
//   onToggle: (id: string) => void;
//   onCopy: (pw: string) => void;
//   dm: { mutedBg: string; borderMd: string };
//   darkMode: boolean;
// }

// const PwField = ({ password, id, show, onToggle, onCopy, dm, darkMode }: PwFieldProps) => (
//   <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       gap: 8,
//       background: dm.mutedBg,
//       borderRadius: 10,
//       padding: "8px 12px",
//       border: `1px solid ${dm.borderMd}`,
//     }}
//   >
//     <Key size={14} color="#94a3b8" />
//     <span
//       style={{ flex: 1, fontFamily: "monospace", fontSize: 13, color: darkMode ? "#94a3b8" : "#475569" }}
//     >
//       {show ? password : "•".repeat(password.length)}
//     </span>
//     <button
//       onClick={() => onToggle(id)}
//       style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
//     >
//       {show ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#94a3b8" />}
//     </button>
//     <button
//       onClick={() => onCopy(password)}
//       style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
//     >
//       <Copy size={14} color="#94a3b8" />
//     </button>
//   </div>
// );

// // ── AddMemberForm ─────────────────────────────────────────────────────────────
// interface AddMemberFormProps {
//   role: "smm" | "graphic_designer";
//   onAdd: (m: TeamMember) => void;
//   onCancel: () => void;
//   dm: { card: string; border: string; text: string; textSm: string; muted: string; borderMd: string; mutedBg: string; input: string; inputText: string };
//   darkMode: boolean;
// }

// const AddMemberForm = ({ role, onAdd, onCancel, dm, darkMode }: AddMemberFormProps) => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPw, setShowPw] = useState(false);

//   const label = role === "smm" ? "SMM Executive" : "Graphic Designer";
//   const accentColor = role === "smm" ? "#33496a" : "#8b5cf6";

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.name || !form.email) {
//       toast.error("Fill required fields");
//       return;
//     }
//     setLoading(true);
//     setTimeout(() => {
//       onAdd({
//         id: "T" + generateId(),
//         ...form,
//         role,
//         createdAt: new Date().toISOString().slice(0, 10),
//         status: "active",
//       });
//       setLoading(false);
//     }, 600);
//   };

//   return (
//     <div style={{ maxWidth: 520 }}>
//       <div style={{ marginBottom: 24 }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             marginBottom: 6,
//           }}
//         >
//           <div
//             style={{
//               width: 40,
//               height: 40,
//               borderRadius: 10,
//               background: accentColor + "18",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {role === "smm" ? (
//               <Megaphone size={18} color={accentColor} />
//             ) : (
//               <Palette size={18} color={accentColor} />
//             )}
//           </div>
//           <h1 style={{ fontSize: 22, fontWeight: 800, color: dm.text }}>
//             Add {label}
//           </h1>
//         </div>
//         <p style={{ color: darkMode ? "#64748b" : "#94a3b8", fontSize: 13.5 }}>
//           Credentials will be shared with the new team member.
//         </p>
//       </div>

//       <div
//         style={{
//           background: dm.card,
//           borderRadius: 18,
//           padding: 28,
//           border: `1px solid ${dm.border}`,
//           boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//         }}
//       >
//         <form
//           onSubmit={handleSubmit}
//           style={{ display: "flex", flexDirection: "column", gap: 18 }}
//         >
//           <div>
//             <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>
//               Full Name *
//             </label>
//             <input
//               type="text"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               placeholder="e.g. Karan Mehta"
//               required
//               style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box" }}
//             />
//           </div>
//           <div>
//             <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>
//               Email Address *
//             </label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               placeholder="karan@agency.com"
//               required
//               style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box" }}
//             />
//           </div>
//           <div>
//             <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>
//               Phone Number
//             </label>
//             <input
//               type="text"
//               value={form.phone}
//               onChange={(e) => setForm({ ...form, phone: e.target.value })}
//               placeholder="+91 98765 43210"
//               style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box" }}
//             />
//           </div>

//           <div>
//             <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>
//               Password *
//             </label>
//             <div style={{ position: "relative" }}>
//               <input
//                 type={showPw ? "text" : "password"}
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 placeholder="Enter password"
//                 required
//                 style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box" }}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPw(!showPw)}
//                 style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}
//               >
//                 {showPw ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
//               </button>
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 flex: 1,
//                 padding: "11px",
//                 borderRadius: 10,
//                 background: loading
//                   ? "#e2e8f0"
//                   : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
//                 color: loading ? "#94a3b8" : "white",
//                 border: "none",
//                 fontWeight: 700,
//                 fontSize: 14,
//                 cursor: loading ? "not-allowed" : "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 8,
//               }}
//             >
//               {loading && (
//                 <Loader2
//                   size={15}
//                   style={{ animation: "spin 1s linear infinite" }}
//                 />
//               )}
//               Add {label}
//             </button>
//             <button
//               type="button"
//               onClick={onCancel}
//               style={{
//                 padding: "11px 20px",
//                 borderRadius: 10,
//                 background: dm.card,
//                 border: `1.5px solid ${dm.borderMd}`,
//                 color: dm.muted,
//                 fontWeight: 600,
//                 fontSize: 14,
//                 cursor: "pointer",
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [tab, setTab] = useState<Tab>("overview");
//   const [sideCollapsed, setSideCollapsed] = useState(false);
//   const [mobileSideOpen, setMobileSideOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
//   const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
//   const [authChecked, setAuthChecked] = useState(false);
//   const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("gc_admin_dark") === "true");
//   const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem("gc_admin_profile_img") || null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [imgUploading, setImgUploading] = useState(false);
//   const [editClient, setEditClient] = useState<Client | null>(null);
//   const [editMember, setEditMember] = useState<TeamMember | null>(null);
//   const [projects, setProjects] = useState<any[]>([]);

//   // ── Dark mode style helper ──────────────────────────────────────────────────
//   const dm = {
//     bg: darkMode ? "#0f172a" : "#f8fafc",
//     card: darkMode ? "#1e293b" : "white",
//     cardBorder: darkMode ? "#334155" : "#f1f5f9",
//     text: darkMode ? "#f1f5f9" : "#0f172a",
//     textSm: darkMode ? "#cbd5e1" : "#1e293b",
//     muted: darkMode ? "#94a3b8" : "#64748b",
//     mutedBg: darkMode ? "#0f172a" : "#f8fafc",
//     border: darkMode ? "#334155" : "#f1f5f9",
//     borderMd: darkMode ? "#475569" : "#e2e8f0",
//     input: darkMode ? "#1e293b" : "white",
//     inputBorder: darkMode ? "#475569" : "#e2e8f0",
//     inputText: darkMode ? "#f1f5f9" : "#1e293b",
//     hover: darkMode ? "#334155" : "#f8fafc",
//     topbar: darkMode ? "#1e293b" : "white",
//     topbarBorder: darkMode ? "#334155" : "#f1f5f9",
//     bellBg: darkMode ? "#1e293b" : "white",
//     bellBorder: darkMode ? "#334155" : "#f1f5f9",
//     toggleBg: darkMode ? "#1e293b" : "white",
//   };



//   // ── Workspace form state ──
//   const [workspaceForm, setWorkspaceForm] = useState({
//     agencyName: "",
//     description: "",
//     address: "",
//   });
//   const [workspaceSaving, setWorkspaceSaving] = useState(false);

//   // ── Data states ──
//   // FIXED: pehle yahan localStorage se initial data load hota tha
//   // (CLIENT_STORE_KEY/TEAM_STORE_KEY) — localStorage har browser/PC ke
//   // liye ALAG hota hai, isliye doosre device/browser pe hamesha khaali
//   // milta tha, aur ek baar cache ho jaane ke baad MongoDB se delete kiya
//   // hua data bhi screen pe dikhta rehta tha. Ab sirf backend hi source
//   // of truth hai — neeche wale useEffect me jo aayega wahi dikhega.
//   const [clients, setClients] = useState<Client[]>([]);
//   const [team, setTeam] = useState<TeamMember[]>([]);
//   const [usersLoading, setUsersLoading] = useState(true);
//   const [usersError, setUsersError] = useState<string | null>(null);

//   // ── Add client form state ──
//   const [clientForm, setClientForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     password: "",
//     budget: "",
//   });
//   const [clientLoading, setClientLoading] = useState(false);
//   const [showClientPw, setShowClientPw] = useState(false);


//   // ── Dark mode effect ────────────────────────────────────────────────────────
//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("gc_admin_dark", String(darkMode));
//   }, [darkMode]);

//   // ── Auth guard ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const raw = localStorage.getItem("sf_admin_session");
//     if (!raw) {
//       navigate("/admin-login");
//       return;
//     }
//     try {
//       const s = JSON.parse(raw);
//       if (!s?.token) {
//         navigate("/admin-login");
//         return;
//       }
//       setAdminSession(s);
//       setAuthChecked(true);
//     } catch {
//       navigate("/admin-login");
//     }
//   }, [navigate]);

//   // ── Fetch data after session loaded ──────────────────────────────────────
//   useEffect(() => {
//     if (!adminSession?.token) return;
//     const token = adminSession.token;

//     apiAdminDashboard(token).then(({ data }) => {
//       if (data) {
//         // dashStats could be used for live data; currently using local state
//       }
//     });

//     apiAdminGetUsers(token).then(({ data, error }) => {
//       // FIXED: pehle "if (clientUsers.length > 0)" guard tha — matlab
//       // agar backend se genuinely khaali list aati (client delete ho
//       // chuka MongoDB se) YA request hi fail ho jaati (CORS/network),
//       // tab bhi setClients kabhi call nahi hota tha, aur jo purana data
//       // state me pehle se tha (stale/localStorage se) wahi dikhta rehta
//       // tha — chahe wo MongoDB me ab exist hi na karta ho.
//       // Ab hum HAMESHA state ko backend response ke hisaab se set karte
//       // hain (khaali ho tab bhi), aur error alag se dikhate hain taaki
//       // "blank" aur "fetch fail hua" me farak pata chale.
//       setUsersLoading(false);

//       if (error) {
//         setUsersError(error);
//         setClients([]);
//         setTeam([]);
//         return;
//       }
//       setUsersError(null);

//       const users: any[] =
//         (data as any)?.data || (data as any)?.users || [];

//       const clientUsers = users.filter((u: any) => u.role === "Client");
//       const smmUsers = users.filter((u: any) => u.role === "SMM");
//       const gdUsers = users.filter((u: any) => u.role === "Graphic Designer");

//       setClients(
//         clientUsers.map((u: any) => ({
//           id: u._id,
//           name: u.name,
//           email: u.email,
//           phone: u.phoneNumber || "",
//           company: u.companyName || "",
//           industry: u.industry || "",
//           password: "••••••",
//           createdAt: u.createdAt?.slice(0, 10) || "",
//           status: u.isActive ? "active" : "inactive",
//           platforms: [],
//           postsThisMonth: 0,
//         }))
//       );

//       const teamFromApi: TeamMember[] = [
//         ...smmUsers.map((u: any) => ({
//           id: u._id,
//           name: u.name,
//           email: u.email,
//           phone: u.phoneNumber || "",
//           role: "smm" as Role,
//           password: "••••••",
//           createdAt: u.createdAt?.slice(0, 10) || "",
//           status: (u.isActive ? "active" : "inactive") as "active" | "inactive",
//         })),
//         ...gdUsers.map((u: any) => ({
//           id: u._id,
//           name: u.name,
//           email: u.email,
//           phone: u.phoneNumber || "",
//           role: "graphic_designer" as Role,
//           password: "••••••",
//           createdAt: u.createdAt?.slice(0, 10) || "",
//           status: (u.isActive ? "active" : "inactive") as "active" | "inactive",
//         })),
//       ];

//       setTeam(teamFromApi);
//     });

//     apiAdminProfile(token).then(({ data }) => {
//       const d = data as any;
//       setWorkspaceForm({
//         agencyName: d?.agencyName || d?.workspace?.agencyName || "",
//         description: d?.description || d?.workspace?.description || "",
//         address: d?.address || d?.workspace?.address || "",
//       });
//     });

//     apiAdminDesignProjects(token).then(({ data }) => {
//       const raw = (data as any)?.data || (data as any)?.projects || (data as any) || [];
//       const list: any[] = Array.isArray(raw) ? raw : [];
//       setProjects(list);
//     });
//   }, [adminSession]);

//   // NOTE: clients/team ab localStorage me persist nahi hote — backend
//   // (MongoDB) hi single source of truth hai. Isse har device/browser pe
//   // hamesha latest, sahi data dikhega.


//   // ── Profile Image Handlers ────────────────────────────────────────────────
//   const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const token = adminSession?.token || "";
//     setImgUploading(true);
//     const { data, error } = await apiAdminUploadProfileImage(token, file);
//     setImgUploading(false);
//     if (error) { toast.error(error); return; }
//     // Use server URL if provided, otherwise convert to base64 for persistence
//     const serverUrl = (data as any)?.imageUrl || (data as any)?.profileImage;
//     if (serverUrl) {
//       setProfileImage(serverUrl);
//       localStorage.setItem("gc_admin_profile_img", serverUrl);
//       toast.success("Profile image updated!");
//     } else {
//       // Convert to base64 so it survives page reloads
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64 = reader.result as string;
//         setProfileImage(base64);
//         localStorage.setItem("gc_admin_profile_img", base64);
//         toast.success("Profile image updated!");
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = async () => {
//     const token = adminSession?.token || "";
//     setImgUploading(true);
//     const { error } = await apiAdminRemoveProfileImage(token);
//     setImgUploading(false);
//     if (error) { toast.error(error); return; }
//     setProfileImage(null);
//     localStorage.removeItem("gc_admin_profile_img");
//     toast.success("Profile image removed!");
//   };

//   // ── Helpers ───────────────────────────────────────────────────────────────
//   const togglePassword = useCallback(
//     (id: string) => setShowPasswords((p) => ({ ...p, [id]: !p[id] })),
//     []
//   );

//   const copyPw = useCallback((pw: string) => {
//     navigator.clipboard.writeText(pw);
//     toast.success("Password copied!");
//   }, []);

//   const smm = team.filter((t) => t.role === "smm");
//   const gd = team.filter((t) => t.role === "graphic_designer");

//   // ── Dynamic chart data ────────────────────────────────────────────────────
//   const activityData = (() => {
//     const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     const today = new Date();
//     return Array.from({ length: 7 }, (_, i) => {
//       const d = new Date(today);
//       d.setDate(today.getDate() - (6 - i));
//       const dayLabel = days[d.getDay()];
//       const dayStr = d.toISOString().slice(0, 10);
//       const postsOnDay = clients.reduce((sum, c) => {
//         const joined = c.createdAt?.slice(0, 10);
//         return sum + (joined === dayStr ? c.postsThisMonth : 0);
//       }, 0);
//       const clientsOnDay = clients.filter((c) => c.createdAt?.slice(0, 10) === dayStr).length;
//       return { day: dayLabel, posts: postsOnDay, clients: clientsOnDay };
//     });
//   })();

//   const growthData = (() => {
//     const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//     const now = new Date();
//     return Array.from({ length: 7 }, (_, i) => {
//       const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
//       const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
//       const count = clients.filter((c) => c.createdAt?.slice(0, 7) === key).length;
//       return { month: months[d.getMonth()], clients: count };
//     });
//   })();

//   const filteredClients = clients.filter(
//     (c) =>
//       c.name.toLowerCase().includes(search.toLowerCase()) ||
//       c.email.toLowerCase().includes(search.toLowerCase()) ||
//       c.company.toLowerCase().includes(search.toLowerCase())
//   );

//   // ── Add Client Handler ────────────────────────────────────────────────────
//   const handleAddClient = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!clientForm.name || !clientForm.email) {
//       toast.error("Name and email are required");
//       return;
//     }
//     const token = adminSession?.token || "";
//     setClientLoading(true);
//     const body = {
//       name: clientForm.name,
//       email: clientForm.email,
//       password: clientForm.password,
//       role: "Client",
//       companyName: clientForm.company,
//       phoneNumber: clientForm.phone,
//     };
//     const { error, data } = await apiAdminCreateUser(token, body);
//     setClientLoading(false);
//     if (error) {
//       toast.error(error);
//       return;
//     }
//     const newId = (data as any)?.data?.user?._id || "C" + generateId();
//     const nc: Client = {
//       id: newId,
//       name: clientForm.name,
//       email: clientForm.email,
//       phone: clientForm.phone,
//       company: clientForm.company,
//       password: clientForm.password,
//       budget: clientForm.budget,
//       industry: "",
//       createdAt: new Date().toISOString().slice(0, 10),
//       status: "active",
//       platforms: [],
//       postsThisMonth: 0,
//     };
//     setClients((c) => [nc, ...c]);
//     setClientForm({
//       name: "",
//       email: "",
//       phone: "",
//       company: "",
//       password: "",
//       budget: "",
//     });
//     setTab("clients");
//     toast.success("Client created!");
//   };

//   // ── Nav items ─────────────────────────────────────────────────────────────
//   const navItems: {
//     id: Tab;
//     icon: React.ElementType;
//     label: string;
//     count?: number;
//   }[] = [
//     { id: "overview", icon: LayoutDashboard, label: "Overview" },
//     { id: "clients", icon: Building2, label: "Total Clients", count: clients.length },
//     { id: "smm", icon: Megaphone, label: "SMM Executives", count: smm.length },
//     { id: "gd", icon: Palette, label: "Graphic Designers", count: gd.length },
//     { id: "workspace", icon: FolderOpen, label: "Workspace" },
//     { id: "profile", icon: User, label: "Profile" },
//   ];

//   // ── Sidebar ───────────────────────────────────────────────────────────────
//   const SidebarContent = () => (
//     <aside
//       style={{
//         width: sideCollapsed ? 72 : 240,
//         minHeight: "100vh",
//         background: darkMode ? "#1e293b" : "white",
//         borderRight: darkMode ? "1px solid #334155" : "1px solid #f1f5f9",
//         display: "flex",
//         flexDirection: "column",
//         transition: "width 0.2s ease",
//         position: "sticky",
//         top: 0,
//         height: "100vh",
//         overflow: "hidden",
//         flexShrink: 0,
//       }}
//     >
//       {/* Logo */}
//       <div
//         style={{
//           padding: sideCollapsed ? "20px 18px" : "20px 20px",
//           borderBottom: `1px solid ${dm.border}`,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <GCLogo collapsed={sideCollapsed} darkMode={darkMode} />
//         <button
//           onClick={() => setSideCollapsed(!sideCollapsed)}
//           style={{
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             padding: 4,
//             marginLeft: sideCollapsed ? 0 : 8,
//             color: darkMode ? "#64748b" : "#94a3b8",
//             display: "flex",
//           }}
//         >
//           <Menu size={18} />
//         </button>
//       </div>

//       {/* Admin Badge */}
//       {!sideCollapsed ? (
//         <div
//           style={{
//             margin: "16px 14px 8px",
//             padding: "10px 14px",
//             background:"#33496a",
//             borderRadius: 12,
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//           }}
//         >
//           <div
//             style={{
//               width: 32,
//               height: 32,
//               borderRadius: 8,
//               background: "rgba(255,255,255,0.2)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ShieldCheck size={16} color="white" />
//           </div>
//           <div>
//             <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>
//                Admin
//             </div>
//             <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.75)" }}>
//               {adminSession?.email || "admin@growthcraft360.com"}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div
//           style={{
//             margin: "12px auto",
//             width: 40,
//             height: 40,
//             borderRadius: 10,
//             background: "#33496a",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <ShieldCheck size={18} color="white" />
//         </div>
//       )}

//       {/* Nav */}
//       <nav
//         style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}
//       >
//         {!sideCollapsed && (
//           <div
//             style={{
//               fontSize: 10,
//               fontWeight: 700,
//               color: "#cbd5e1",
//               letterSpacing: "0.8px",
//               textTransform: "uppercase",
//               padding: "4px 10px 8px",
//             }}
//           >
//             NAVIGATION
//           </div>
//         )}
//         {navItems.map((n) => {
//           const active = tab === n.id;
//           return (
//             <button
//               key={n.id}
//               onClick={() => {
//                 setTab(n.id);
//                 setSearch("");
//                 setMobileSideOpen(false);
//               }}
//               title={sideCollapsed ? n.label : undefined}
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 padding: sideCollapsed ? "11px 0" : "10px 12px",
//                 justifyContent: sideCollapsed ? "center" : "flex-start",
//                 borderRadius: 10,
//                 border: "none",
//                 cursor: "pointer",
//                 marginBottom: 2,
//                 transition: "all 0.15s",
//                 background: active
//                   ? "linear-gradient(135deg, #fff7ed, #ffedd5)"
//                   : "transparent",
//                 color: active ? "#33496a" : "#64748b",
//                 fontWeight: active ? 700 : 500,
//                 fontSize: 13.5,
//               }}
//             >
//               <n.icon size={18} />
//               {!sideCollapsed && (
//                 <>
//                   <span style={{ flex: 1, textAlign: "left" }}>{n.label}</span>
//                   {n.count !== undefined && (
//                     <span
//                       style={{
//                         fontSize: 11,
//                         fontWeight: 700,
//                         background: active ? "#33496a" : "#f1f5f9",
//                         color: active ? "white" : "#94a3b8",
//                         borderRadius: 20,
//                         padding: "1px 7px",
//                       }}
//                     >
//                       {n.count}
//                     </span>
//                   )}
//                 </>
//               )}
//             </button>
//           );
//         })}

//         {/* Quick Add */}
//         {!sideCollapsed && (
//           <>
//             <div
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 color: "#cbd5e1",
//                 letterSpacing: "0.8px",
//                 textTransform: "uppercase",
//                 padding: "12px 10px 8px",
//               }}
//             >
//               QUICK ADD
//             </div>
//             {(
//               [
//                 { id: "add_client" as Tab, label: "Add Client", color: "#3b82f6" },
//                 { id: "add_smm" as Tab, label: "Add SMM", color: "#33496a" },
//                 { id: "add_gd" as Tab, label: "Add Designer", color: "#8b5cf6" },
//               ] as const
//             ).map((q) => (
//               <button
//                 key={q.id}
//                 onClick={() => {
//                   setTab(q.id);
//                   setMobileSideOpen(false);
//                 }}
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   padding: "9px 12px",
//                   borderRadius: 10,
//                   border: "none",
//                   cursor: "pointer",
//                   marginBottom: 2,
//                   background: tab === q.id ? q.color + "15" : "transparent",
//                   color: tab === q.id ? q.color : "#94a3b8",
//                   fontWeight: 600,
//                   fontSize: 13,
//                 }}
//               >
//                 <UserPlus size={15} />
//                 <span>{q.label}</span>
//               </button>
//             ))}
//           </>
//         )}
//       </nav>

//       {/* Sign Out */}
//       <div style={{ padding: "12px 10px", borderTop: `1px solid ${dm.border}` }}>
//         <button
//           onClick={() => {
//             clearAdminSession();
//             localStorage.removeItem("socialflow_role");
//             navigate("/admin-login");
//           }}
//           style={{
//             width: "100%",
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             padding: sideCollapsed ? "10px 0" : "10px 12px",
//             justifyContent: sideCollapsed ? "center" : "flex-start",
//             borderRadius: 10,
//             border: "none",
//             background: "none",
//             cursor: "pointer",
//             color: darkMode ? "#64748b" : "#94a3b8",
//             fontSize: 13.5,
//             fontWeight: 500,
//           }}
//         >
//           <LogOut size={17} />
//           {!sideCollapsed && "Sign Out"}
//         </button>
//       </div>
//     </aside>
//   );

//   // ── OVERVIEW TAB ──────────────────────────────────────────────────────────
//   const OverviewTab = () => (
//     <div style={{ maxWidth: 1100 }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 28,
//         }}
//       >
//         <div>
//           <h1
//             style={{ fontSize: 24, fontWeight: 800, color: dm.text, margin: 0 }}
//           >
//             Welcome back, {adminSession?.name || adminSession?.email?.split('@')[0] || 'Admin'} 👋
//           </h1>
//           <p style={{ color: darkMode ? "#64748b" : "#94a3b8", fontSize: 13.5, marginTop: 4 }}>
//             Here's what's happening at Growthcraft360 today.
//           </p>
//           {usersError && (
//             <div
//               style={{
//                 marginTop: 10,
//                 padding: "8px 14px",
//                 borderRadius: 8,
//                 background: "#fef2f2",
//                 color: "#b91c1c",
//                 fontSize: 12.5,
//                 fontWeight: 600,
//                 maxWidth: 520,
//               }}
//             >
//               ⚠️ Clients/team data load nahi ho paaya: {usersError}. Backend URL
//               (VITE_API_BASE_URL) aur CORS settings check karein, phir page
//               refresh karein.
//             </div>
//           )}
//         </div>
//         <button
//           onClick={() => setTab("add_client")}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 7,
//             padding: "9px 18px",
//             borderRadius: 10,
//             background: "#33496a",
//             color: "white",
//             border: "none",
//             fontWeight: 700,
//             fontSize: 13,
//             cursor: "pointer",
        
//           }}
//         >
//           <UserPlus size={15} /> Add Client
//         </button>
//       </div>

//       {/* Stats */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(4, 1fr)",
//           gap: 16,
//           marginBottom: 28,
//         }}
//       >
//         <StatCard
//           label="Total Clients"
//           value={clients.length}
//           icon={Building2}
//           color="#3b82f6"
//           bg="#eff6ff"
//           trend="+12%"
//         dm={dm}
//         darkMode={darkMode}
//         />
//         <StatCard
//           label="Active Clients"
//           value={clients.filter((c) => c.status === "active").length}
//           icon={CheckCircle}
//           color="#22c55e"
//           bg="#f0fdf4"
//           trend="+8%"
//         dm={dm}
//         darkMode={darkMode}
//         />
//         <StatCard
//           label="SMM Executives"
//           value={smm.length}
//           icon={Megaphone}
//           color="#33496a"
//           bg="#fff7ed"
//         dm={dm}
//         darkMode={darkMode}
//         />
//         <StatCard
//           label="Graphic Designers"
//           value={gd.length}
//           icon={Palette}
//           color="#8b5cf6"
//           bg="#f5f3ff"
//         dm={dm}
//         darkMode={darkMode}
//         />
//       </div>

//       {/* Charts */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: 20,
//           marginBottom: 24,
//         }}
//       >
//         <div
//           style={{
//             background: dm.card,
//             borderRadius: 18,
//             padding: 22,
//             border: `1px solid ${dm.border}`,
//             boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 18,
//             }}
//           >
//             <div>
//               <h3
//                 style={{ fontSize: 15, fontWeight: 700, color: dm.text, margin: 0 }}
//               >
//                 Weekly Activity
//               </h3>
//               <p style={{ fontSize: 12, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 2 }}>
//                 Posts published this week
//               </p>
//             </div>
//             <div
//               style={{
//                 padding: "4px 10px",
//                 background: "#f0fdf4",
//                 borderRadius: 20,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: "#22c55e",
//               }}
//             >
//               Live
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={160}>
//             <BarChart data={activityData} barGap={4}>
//               <XAxis
//                 dataKey="day"
//                 tick={{ fontSize: 11, fill: "#94a3b8" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fontSize: 11, fill: "#94a3b8" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <Tooltip
//                 contentStyle={{
//                   borderRadius: 10,
//                   border: "none",
//                   boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//                   fontSize: 12,
//                 }}
//               />
//               <Bar dataKey="posts" fill="#33496a" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div
//           style={{
//             background: dm.card,
//             borderRadius: 18,
//             padding: 22,
//             border: `1px solid ${dm.border}`,
//             boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//           }}
//         >
//           <div style={{ marginBottom: 18 }}>
//             <h3
//               style={{ fontSize: 15, fontWeight: 700, color: dm.text, margin: 0 }}
//             >
//               Client Growth
//             </h3>
//             <p style={{ fontSize: 12, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 2 }}>
//               New clients per month
//             </p>
//           </div>
//           <ResponsiveContainer width="100%" height={160}>
//             <LineChart data={growthData}>
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 11, fill: "#94a3b8" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fontSize: 11, fill: "#94a3b8" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <Tooltip
//                 contentStyle={{
//                   borderRadius: 10,
//                   border: "none",
//                   boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//                   fontSize: 12,
//                 }}
//               />
//               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//               <Line
//                 type="monotone"
//                 dataKey="clients"
//                 stroke="#3b82f6"
//                 strokeWidth={2.5}
//                 dot={{ fill: "#3b82f6", r: 4 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Clients Table */}
//       <div
//         style={{
//           background: dm.card,
//           borderRadius: 18,
//           border: `1px solid ${dm.border}`,
//           boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             padding: "18px 22px",
//             borderBottom: `1px solid ${dm.border}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <h3 style={{ fontSize: 15, fontWeight: 700, color: dm.text, margin: 0 }}>
//             Recent Clients
//           </h3>
//           <button
//             onClick={() => setTab("clients")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 5,
//               fontSize: 13,
//               fontWeight: 600,
//               color: "#33496a",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             View All
//           </button>
//         </div>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ background: "#fafafa" }}>
//               {["Client", "Company", "Platforms", "Posts/mo", "Assigned To", "Status"].map(
//                 (h) => (
//                   <th
//                     key={h}
//                     style={{
//                       padding: "11px 18px",
//                       textAlign: "left",
//                       fontSize: 11.5,
//                       fontWeight: 700,
//                       color: darkMode ? "#64748b" : "#94a3b8",
//                       textTransform: "uppercase",
//                       letterSpacing: "0.5px",
//                     }}
//                   >
//                     {h}
//                   </th>
//                 )
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {clients.slice(0, 5).map((c) => (
//               <tr key={c.id} style={{ borderTop: `1px solid ${dm.border}` }}>
//                 <td style={{ padding: "14px 18px" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <div
//                       style={{
//                         width: 36,
//                         height: 36,
//                         borderRadius: 10,
//                         background: "#eff6ff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 13,
//                         fontWeight: 700,
//                         color: "#3b82f6",
//                       }}
//                     >
//                       {c.name.charAt(0)}
//                     </div>
//                     <div>
//                       <div
//                         style={{ fontSize: 13.5, fontWeight: 600, color: dm.textSm }}
//                       >
//                         {c.name}
//                       </div>
//                       <div style={{ fontSize: 11.5, color: darkMode ? "#64748b" : "#94a3b8" }}>
//                         {c.email}
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//                 <td style={{ padding: "14px 18px", fontSize: 13.5, color: dm.muted }}>
//                   {c.company || "—"}
//                 </td>
//                 <td style={{ padding: "14px 18px" }}>
//                   <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
//                     {c.platforms.length === 0 ? (
//                       <span style={{ fontSize: 12, color: "#cbd5e1" }}>—</span>
//                     ) : (
//                       c.platforms.slice(0, 2).map((p) => {
//                         const cfg = PLATFORMS.find((pl) => pl.id === p);
//                         return (
//                           <span
//                             key={p}
//                             className="platform-pill"
//                             style={{
//                               background: cfg?.bg ?? (darkMode ? "#1e293b" : "#f8fafc"),
//                               color: cfg?.color ?? "#64748b",
//                               border: `1px solid ${cfg?.color ?? "#e2e8f0"}22`,
//                             }}
//                           >
//                             <PlatformIcon id={p} size={11} />
//                             {cfg?.label ?? p}
//                           </span>
//                         );
//                       })
//                     )}
//                   </div>
//                 </td>
//                 <td
//                   style={{
//                     padding: "14px 18px",
//                     fontSize: 13.5,
//                     fontWeight: 700,
//                     color: "#33496a",
//                   }}
//                 >
//                   {c.postsThisMonth}
//                 </td>
//                 <td
//                   style={{ padding: "14px 18px", fontSize: 12.5, color: dm.muted }}
//                 >
//                   {c.assignedSMM
//                     ? team.find((t) => t.id === c.assignedSMM)?.name || "—"
//                     : "—"}
//                 </td>
//                 <td style={{ padding: "14px 18px" }}>
//                   <span
//                     style={{
//                       fontSize: 11.5,
//                       fontWeight: 700,
//                       padding: "3px 10px",
//                       borderRadius: 20,
//                       background:
//                         c.status === "active" ? "#dcfce7" : "#f1f5f9",
//                       color: c.status === "active" ? "#16a34a" : "#94a3b8",
//                     }}
//                   >
//                     {c.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   // ── CLIENTS TAB ───────────────────────────────────────────────────────────
//   const ClientsTab = () => (
//     <div style={{ maxWidth: 900 }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 24,
//         }}
//       >
//         <div>
//           <h1 style={{ fontSize: 22, fontWeight: 800, color: dm.text, margin: 0 }}>
//             Total Clients
//           </h1>
//           <p style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 3 }}>
//             {clients.length} clients registered
//           </p>
//         </div>
//         <button
//           onClick={() => setTab("add_client")}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 7,
//             padding: "9px 18px",
//             borderRadius: 10,
//             background: "#33496a",
//             color: "white",
//             border: "none",
//             fontWeight: 700,
//             fontSize: 13,
//             cursor: "pointer",
//           }}
//         >
//           <UserPlus size={15} /> Add Client
//         </button>
//       </div>

//       <div style={{ position: "relative", marginBottom: 20 }}>
//         <Search
//           size={15}
//           style={{
//             position: "absolute",
//             left: 14,
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: darkMode ? "#64748b" : "#94a3b8",
//           }}
//         />
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search clients by name, email or company..."
//           style={{
//             width: "100%",
//             padding: "11px 14px 11px 40px",
//             borderRadius: 12,
//             border: `1.5px solid ${dm.borderMd}`,
//             fontSize: 13.5,
//             color: dm.inputText,
//             background: dm.input,
//             outline: "none",
//             boxSizing: "border-box",
//           }}
//         />
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//         {filteredClients.map((c) => (
//           <div
//             key={c.id}
//             style={{
//               background: dm.card,
//               borderRadius: 16,
//               padding: 20,
//               border: `1px solid ${dm.border}`,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: 12,
//               }}
//             >
//               <div
//                 style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
//               >
//                 <div
//                   style={{
//                     width: 46,
//                     height: 46,
//                     borderRadius: 12,
//                     background: "#eff6ff",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 16,
//                     fontWeight: 800,
//                     color: "#3b82f6",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {c.name.charAt(0)}
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     <span
//                       style={{ fontSize: 15, fontWeight: 700, color: dm.textSm }}
//                     >
//                       {c.name}
//                     </span>
//                     <span
//                       style={{
//                         fontSize: 10.5,
//                         fontWeight: 700,
//                         padding: "2px 8px",
//                         borderRadius: 20,
//                         background:
//                           c.status === "active" ? "#dcfce7" : "#f1f5f9",
//                         color: c.status === "active" ? "#16a34a" : "#94a3b8",
//                       }}
//                     >
//                       {c.status}
//                     </span>
//                     <span style={{ fontSize: 11, color: "#cbd5e1" }}>
//                       ID: {c.id}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 600,
//                       color: dm.muted,
//                       marginTop: 2,
//                     }}
//                   >
//                     {c.company}
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: 14,
//                       marginTop: 8,
//                     }}
//                   >
//                     {(
//                       [
//                         { icon: Mail, text: c.email },
//                         { icon: Phone, text: c.phone || "—" },
//                         { icon: Calendar, text: `Joined ${c.createdAt}` },
//                       ] as { icon: React.ElementType; text: string }[]
//                     ).map(({ icon: Icon, text }) => (
//                       <span
//                         key={text}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 5,
//                           fontSize: 12,
//                           color: darkMode ? "#64748b" : "#94a3b8",
//                         }}
//                       >
//                         <Icon size={12} /> {text}
//                       </span>
//                     ))}
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: 5,
//                       marginTop: 8,
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     {c.platforms.map((p) => {
//                       const cfg = PLATFORMS.find((pl) => pl.id === p);
//                       return (
//                         <span
//                           key={p}
//                           className="platform-pill"
//                           style={{
//                             background: cfg?.bg ?? (darkMode ? "#1e293b" : "#f8fafc"),
//                             color: cfg?.color ?? dm.muted,
//                             border: `1px solid ${cfg?.color ?? dm.borderMd}22`,
//                           }}
//                         >
//                           <PlatformIcon id={p} size={12} />
//                           {cfg?.label ?? p}
//                         </span>
//                       );
//                     })}
//                   </div>
//                   {c.budget && (
//                     <div style={{ fontSize: 12, marginTop: 6, color: darkMode ? "#94a3b8" : "#64748b" }}>
//                       Budget: <strong style={{ color: "#33496a" }}>{c.budget}</strong>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button
//                   onClick={() => setEditClient(c)}
//                   style={{
//                     width: 36, height: 36, borderRadius: 9,
//                     border: "1px solid #dbeafe", background: "#eff6ff",
//                     display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
//                   }}
//                 >
//                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
//                 </button>
//                 <button
//                   onClick={() => {
//                     setClients((cs) => cs.filter((x) => x.id !== c.id));
//                     toast.success("Client removed");
//                   }}
//                   style={{
//                     width: 36,
//                     height: 36,
//                     borderRadius: 9,
//                     border: "1px solid #fee2e2",
//                     background: "#fff5f5",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                 <Trash2 size={15} color="#33496a" />
//                 </button>
//               </div>
//             </div>
//             <div
//               style={{
//                 marginTop: 14,
//                 paddingTop: 14,
//                 borderTop: `1px solid ${dm.border}`,
//               }}
//             >
//               <PwField
//                 password={c.password}
//                 id={c.id}
//                 show={!!showPasswords[c.id]}
//                 onToggle={togglePassword}
//                 onCopy={copyPw}
//                   dm={dm}
//                   darkMode={darkMode}
//                 />
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 16,
//                   marginTop: 10,
//                   fontSize: 12.5,
//                   color: darkMode ? "#64748b" : "#94a3b8",
//                 }}
//               >
//                 <span>
//                   Posts this month:{" "}
//                   <strong style={{ color: "#33496a" }}>{c.postsThisMonth}</strong>
//                 </span>
//                 {c.assignedSMM && (
//                   <span>
//                     SMM:{" "}
//                     <strong style={{ color: dm.text }}>
//                       {team.find((t) => t.id === c.assignedSMM)?.name ||
//                         c.assignedSMM}
//                     </strong>
//                   </span>
//                 )}
//                 {c.assignedDesigner && (
//                   <span>
//                     Designer:{" "}
//                     <strong style={{ color: dm.text }}>
//                       {team.find((t) => t.id === c.assignedDesigner)?.name ||
//                         c.assignedDesigner}
//                     </strong>
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//         {filteredClients.length === 0 && (
//           <div
//             style={{ textAlign: "center", padding: "60px 0", color: darkMode ? "#64748b" : "#94a3b8" }}
//           >
//             <Building2
//               size={40}
//               style={{ margin: "0 auto 12px", opacity: 0.3 }}
//             />
//             <p style={{ fontSize: 14 }}>No clients found.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // ── TEAM LIST ─────────────────────────────────────────────────────────────
//   interface TeamListProps {
//     members: TeamMember[];
//     roleLabel: string;
//     accentColor: string;
//     icon: React.ElementType;
//     addTab: Tab;
//   }

//   const TeamList = ({
//     members,
//     roleLabel,
//     accentColor,
//     icon: Icon,
//     addTab,
//   }: TeamListProps) => {
//     const filteredMembers = members.filter(
//       (m) =>
//         m.name.toLowerCase().includes(search.toLowerCase()) ||
//         m.email.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//       <div style={{ maxWidth: 900 }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 24,
//           }}
//         >
//           <div>
//             <h1
//               style={{ fontSize: 22, fontWeight: 800, color: dm.text, margin: 0 }}
//             >
//               {roleLabel}s
//             </h1>
//             <p style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 3 }}>
//               {members.length} {roleLabel.toLowerCase()}s in team
//             </p>
//           </div>
//           <button
//             onClick={() => setTab(addTab)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 7,
//               padding: "9px 18px",
//               borderRadius: 10,
//               background:"#33496a",
//               color: "white",
//               border: "none",
//               fontWeight: 700,
//               fontSize: 13,
//               cursor: "pointer",
//             }}
//           >
//             <UserPlus size={15} /> Add {roleLabel}
//           </button>
//         </div>

//         <div style={{ position: "relative", marginBottom: 20 }}>
//           <Search
//             size={15}
//             style={{
//               position: "absolute",
//               left: 14,
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: darkMode ? "#64748b" : "#94a3b8",
//             }}
//           />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder={`Search ${roleLabel.toLowerCase()}s...`}
//             style={{
//               width: "100%",
//               padding: "11px 14px 11px 40px",
//               borderRadius: 12,
//               border: `1.5px solid ${dm.borderMd}`,
//               fontSize: 13.5,
//               color: dm.inputText,
//               background: dm.input,
//               outline: "none",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>

//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {filteredMembers.map((m) => (
//             <div
//               key={m.id}
//               style={{
//                 background: dm.card,
//                 borderRadius: 16,
//                 padding: 20,
//                 border: `1px solid ${dm.border}`,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   gap: 12,
//                 }}
//               >
//                 <div
//                   style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
//                 >
//                   <div
//                     style={{
//                       width: 46,
//                       height: 46,
//                       borderRadius: 12,
//                       background: accentColor + "18",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                     }}
//                   >
//                     <Icon size={20} color={accentColor} />
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 8,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: 15,
//                           fontWeight: 700,
//                           color: dm.textSm,
//                         }}
//                       >
//                         {m.name}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: 10.5,
//                           fontWeight: 700,
//                           padding: "2px 8px",
//                           borderRadius: 20,
//                           background: accentColor + "18",
//                           color: accentColor,
//                         }}
//                       >
//                         {roleLabel}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: 10.5,
//                           fontWeight: 700,
//                           padding: "2px 8px",
//                           borderRadius: 20,
//                           background:
//                             m.status === "active" ? "#dcfce7" : "#f1f5f9",
//                           color:
//                             m.status === "active" ? "#16a34a" : "#94a3b8",
//                         }}
//                       >
//                         {m.status}
//                       </span>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexWrap: "wrap",
//                         gap: 14,
//                         marginTop: 8,
//                       }}
//                     >
//                       {(
//                         [
//                           { icon: Mail, text: m.email },
//                           { icon: Phone, text: m.phone || "—" },
//                           { icon: Calendar, text: `Joined ${m.createdAt}` },
//                         ] as { icon: React.ElementType; text: string }[]
//                       ).map(({ icon: Ico, text }) => (
//                         <span
//                           key={text}
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 5,
//                             fontSize: 12,
//                             color: darkMode ? "#64748b" : "#94a3b8",
//                           }}
//                         >
//                           <Ico size={12} /> {text}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", gap: 8 }}>
//                   <button
//                     onClick={() => setEditMember(m)}
//                     style={{
//                       width: 36, height: 36, borderRadius: 9,
//                       border: "1px solid #dbeafe", background: "#eff6ff",
//                       display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
//                     }}
//                   >
//                     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
//                   </button>
//                   <button
//                     onClick={() => {
//                       setTeam((ts) => ts.filter((x) => x.id !== m.id));
//                       toast.success("Member removed");
//                     }}
//                     style={{
//                       width: 36,
//                       height: 36,
//                       borderRadius: 9,
//                       border: "1px solid #fee2e2",
//                       background: "#fff5f5",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <Trash2 size={15} color="#33496a" />
//                   </button>
//                 </div>
//               </div>
//               <div
//                 style={{
//                   marginTop: 14,
//                   paddingTop: 14,
//                   borderTop: `1px solid ${dm.border}`,
//                 }}
//               >
//                 <PwField
//                   password={m.password}
//                   id={m.id}
//                   show={!!showPasswords[m.id]}
//                   onToggle={togglePassword}
//                   onCopy={copyPw}
//                   dm={dm}
//                   darkMode={darkMode}
//                 />
//               </div>
//             </div>
//           ))}
//           {filteredMembers.length === 0 && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "60px 0",
//                 color: darkMode ? "#64748b" : "#94a3b8",
//               }}
//             >
//               <Icon
//                 size={40}
//                 style={{ margin: "0 auto 12px", opacity: 0.3 }}
//               />
//               <p style={{ fontSize: 14 }}>No {roleLabel.toLowerCase()}s found.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ── ADD CLIENT TAB ────────────────────────────────────────────────────────
//   const AddClientTab = () => {
//     const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", password: "", budget: "" });
//     const [loading, setLoading] = useState(false);
//     const [showPw, setShowPw] = useState(false);
//     const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

//     const togglePlatform = (id: string) =>
//       setSelectedPlatforms((prev) =>
//         prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
//       );

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
//       const token = adminSession?.token || "";
//       setLoading(true);
//       const body = { name: form.name, email: form.email, password: form.password, role: "Client", companyName: form.company, phoneNumber: form.phone };
//       const { error, data } = await apiAdminCreateUser(token, body);
//       setLoading(false);
//       if (error) { toast.error(error); return; }
//       const newId = (data as any)?.data?.user?._id || "C" + generateId();
//       const nc: Client = {
//         id: newId, name: form.name, email: form.email, phone: form.phone,
//         company: form.company, password: form.password, budget: form.budget,
//         industry: "", createdAt: new Date().toISOString().slice(0, 10),
//         status: "active", platforms: selectedPlatforms, postsThisMonth: 0,
//       };
//       setClients((c) => [nc, ...c]);
//       setTab("clients");
//       toast.success("Client created!");
//     };

//     return (
//       <div style={{ maxWidth: 520 }}>
//         <div style={{ marginBottom: 24 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <UserPlus size={18} color="#3b82f6" />
//             </div>
//             <h1 style={{ fontSize: 22, fontWeight: 800, color: dm.text }}>Add Client</h1>
//           </div>
//           <p style={{ color: darkMode ? "#64748b" : "#94a3b8", fontSize: 13.5 }}>Create a client account and set their login credentials.</p>
//         </div>

//         <div style={{ background: dm.card, borderRadius: 18, padding: 28, border: `1px solid ${dm.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
//           <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
//             <div>
//               <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Full Name *</label>
//               <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" required style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
//             </div>
//             <div>
//               <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Email Address *</label>
//               <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@company.com" required style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
//             </div>
//             <div>
//               <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Phone Number</label>
//               <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
//             </div>
//             <div>
//               <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Company Name</label>
//               <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company Pvt. Ltd." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
//             </div>
//             <div>
//               <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Budget</label>
//               <input type="text" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. ₹50,000 / month" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
//             </div>
//             <div>
//               <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Platforms</label>
//               <div className="platform-selector__grid">
//                 {PLATFORMS.map((p) => {
//                   const selected = selectedPlatforms.includes(p.id);
//                   return (
//                     <button
//                       key={p.id}
//                       type="button"
//                       onClick={() => togglePlatform(p.id)}
//                       className={`platform-selector__chip ${selected ? "platform-selector__chip--selected" : "platform-selector__chip--unselected"}`}
//                       style={selected ? {} : { borderColor: dm.borderMd, background: dm.input, color: dm.muted }}
//                     >
//                       <PlatformIcon id={p.id} size={13} />
//                       {p.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//             <div>
//               <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Password *</label>
//               <div style={{ position: "relative" }}>
//                 <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" required style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
//                 <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
//                   {showPw ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
//                 </button>
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
//               <button type="submit" disabled={loading} style={{ flex: 1, padding: "11px", borderRadius: 10, background: loading ? "#e2e8f0" : "linear-gradient(135deg, #3b82f6, #2563eb)", color: loading ? "#94a3b8" : "white", border: "none", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
//                 Add Client
//               </button>
//               <button type="button" onClick={() => setTab("overview")} style={{ padding: "11px 20px", borderRadius: 10, background: dm.input, border: `1.5px solid ${dm.borderMd}`, color: dm.inputText, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   // ── WORKSPACE TAB ─────────────────────────────────────────────────────────

//   // ── PROFILE TAB ───────────────────────────────────────────────────────────
//   const ProfileTab = () => {
//     const [cpForm, setCpForm] = useState({
//       oldPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//     const [cpLoading, setCpLoading] = useState(false);
//     const [showOld, setShowOld] = useState(false);
//     const [showNew, setShowNew] = useState(false);

//     const handleChangePassword = async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (
//         !cpForm.oldPassword ||
//         !cpForm.newPassword ||
//         !cpForm.confirmPassword
//       ) {
//         toast.error("Please fill all fields");
//         return;
//       }
//       if (cpForm.newPassword !== cpForm.confirmPassword) {
//         toast.error("New passwords do not match");
//         return;
//       }
//       if (cpForm.newPassword.length < 8) {
//         toast.error("New password must be at least 8 characters");
//         return;
//       }
//       const token = adminSession?.token || "";
//       setCpLoading(true);
//       const { error, data } = await apiAdminChangePassword(
//         token,
//         cpForm.oldPassword,
//         cpForm.newPassword,
//         cpForm.confirmPassword
//       );
//       setCpLoading(false);
//       if (error) {
//         toast.error(error);
//         return;
//       }
//       toast.success((data as any)?.message || "Password changed successfully!");
//       setCpForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
//     };

//     return (
//       <div style={{ maxWidth: 600 }}>
//         <div style={{ marginBottom: 28 }}>
//           <h1
//             style={{ fontSize: 22, fontWeight: 800, color: dm.text, margin: 0 }}
//           >
//             Admin Profile
//           </h1>
//           <p style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
//             Manage your account settings and preferences.
//           </p>
//         </div>

//         {/* Profile Card */}
//         <div
//           style={{
//             background: dm.card,
//             borderRadius: 18,
//             padding: 28,
//             border: `1px solid ${dm.border}`,
//             boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//             marginBottom: 20,
//           }}
//         >
//           <div
//             style={{
             
//               gap: 20,
//               paddingBottom: 24,
//               borderBottom: `1px solid ${dm.border}`,
//               marginBottom: 24,
//             }}
//           >
//             {/* Profile Image — Option 2: badge corner + text links */}
//             <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
//               {/* Avatar with pencil badge */}
//               <div style={{ position: "relative", flexShrink: 0 }}>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   style={{ display: "none" }}
//                   onChange={handleUploadImage}
//                 />
//                 <div
//                   style={{
//                     width: 72,
//                     height: 72,
//                     borderRadius: 18,
//                     background: profileImage ? "transparent" : "#33496a",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 26,
//                     fontWeight: 800,
//                     color: "white",
//                     overflow: "hidden",
//                     border: profileImage ? `2px solid ${dm.border}` : "none",
//                   }}
//                 >
//                   {profileImage
//                     ? <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     : (adminSession?.name || "A").charAt(0).toUpperCase()}
//                 </div>
//                 {/* Pencil badge bottom-right */}
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   disabled={imgUploading}
//                   title="Change profile photo"
//                   style={{
//                     position: "absolute",
//                     bottom: -4,
//                     right: -4,
//                     width: 24,
//                     height: 24,
//                     borderRadius: "50%",
//                     background: "#33496a",
//                     border: `2px solid ${darkMode ? "#1e293b" : "white"}`,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: imgUploading ? "not-allowed" : "pointer",
//                     opacity: imgUploading ? 0.7 : 1,
//                     padding: 0,
//                   }}
//                 >
//                   {imgUploading
//                     ? <Loader2 size={11} color="white" style={{ animation: "spin 1s linear infinite" }} />
//                     : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
//                   }
//                 </button>
//               </div>

//               {/* Name / email / badge / text links */}
//               <div>
//                 <div style={{ fontSize: 20, fontWeight: 800, color: dm.text }}>
//                   {adminSession?.name || "Admin"}
//                 </div>
//                 <div style={{ fontSize: 13.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 3 }}>
//                   {adminSession?.email || ""}
//                 </div>
//                 <span
//                   style={{
//                     fontSize: 11,
//                     fontWeight: 700,
//                     padding: "3px 10px",
//                     borderRadius: 20,
//                     background: "#33496a",
//                     color: "white",
//                     display: "inline-block",
//                     marginTop: 8,
//                   }}
//                 >
//                   Super Admin
//                 </span>

//                 {/* Change photo / Remove text links */}
//                 <div style={{ gap: 14, marginTop: 12 }}>
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={imgUploading}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       padding: 0,
//                       fontSize: 12.5,
//                       fontWeight: 600,
//                       color: "#33496a",
//                       cursor: imgUploading ? "not-allowed" : "pointer",
//                       opacity: imgUploading ? 0.6 : 1,
//                     }}
//                   >
//                     {imgUploading ? "Uploading…" : "Change photo"}
//                   </button>
//                   {profileImage && (
//                     <>
//                       <span style={{ width: 1, height: 12, background: darkMode ? "#334155" : "#e2e8f0", display: "inline-block" }} />
//                       <button
//                         onClick={handleRemoveImage}
//                         disabled={imgUploading}
//                         style={{
//                           background: "none",
//                           border: "none",
//                           padding: 0,
//                           fontSize: 12.5,
//                           fontWeight: 600,
//                           color: darkMode ? "#64748b" : "#94a3b8",
//                           cursor: imgUploading ? "not-allowed" : "pointer",
//                           opacity: imgUploading ? 0.6 : 1,
//                         }}
//                       >
//                         Remove
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//           {(
//             [
//               { label: "Full Name", value: adminSession?.name || "Admin", icon: User },
//               { label: "Email Address", value: adminSession?.email || "", icon: Mail },
//               { label: "Role", value: "Administrator", icon: ShieldCheck },
//             ] as { label: string; value: string; icon: React.ElementType }[]
//           ).map(({ label, value, icon: Icon }) => (
//             <div
//               key={label}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 padding: "14px 0",
//                 borderBottom: `1px solid ${dm.border}`,
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   width: 180,
//                 }}
//               >
//                 <Icon size={15} color="#94a3b8" />
//                 <span
//                   style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", fontWeight: 500 }}
//                 >
//                   {label}
//                 </span>
//               </div>
//               <span
//                 style={{ fontSize: 13.5, color: dm.textSm, fontWeight: 600 }}
//               >
//                 {value}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Change Password */}
//         <div
//           style={{
//             background: dm.card,
//             borderRadius: 18,
//             padding: 28,
//             border: `1px solid ${dm.border}`,
//             boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//             marginBottom: 20,
//           }}
//         >
//           <div style={{ marginBottom: 20 }}>
//             <h2
//               style={{
//                 fontSize: 16,
//                 fontWeight: 700,
//                 color: dm.text,
//                 margin: 0,
//               }}
//             >
//               Change Password
//             </h2>
//             <p style={{ fontSize: 12.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
//               Update your admin account password.
//             </p>
//           </div>

//           <form
//             onSubmit={handleChangePassword}
//             style={{ display: "flex", flexDirection: "column", gap: 14 }}
//           >
//             <div>
//               <label
//                 style={{
//                   fontSize: 12.5,
//                   fontWeight: 600,
//                   color: dm.textSm,
//                   display: "block",
//                   marginBottom: 6,
//                 }}
//               >
//                 Current Password
//               </label>
//               <div style={{ position: "relative" }}>
//                 <Input
//                   type={showOld ? "text" : "password"}
//                   value={cpForm.oldPassword}
//                   onChange={(e) =>
//                     setCpForm((f) => ({ ...f, oldPassword: e.target.value }))
//                   }
//                   placeholder="Enter current password"
//                   required
//                   style={{ paddingRight: 36 }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowOld((s) => !s)}
//                   style={{
//                     position: "absolute",
//                     right: 10,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: darkMode ? "#64748b" : "#94a3b8",
//                   }}
//                 >
//                   {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label
//                 style={{
//                   fontSize: 12.5,
//                   fontWeight: 600,
//                   color: dm.textSm,
//                   display: "block",
//                   marginBottom: 6,
//                 }}
//               >
//                 New Password
//               </label>
//               <div style={{ position: "relative" }}>
//                 <Input
//                   type={showNew ? "text" : "password"}
//                   value={cpForm.newPassword}
//                   onChange={(e) =>
//                     setCpForm((f) => ({ ...f, newPassword: e.target.value }))
//                   }
//                   placeholder="Min 8 characters"
//                   required
//                   style={{ paddingRight: 36 }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowNew((s) => !s)}
//                   style={{
//                     position: "absolute",
//                     right: 10,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: darkMode ? "#64748b" : "#94a3b8",
//                   }}
//                 >
//                   {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label
//                 style={{
//                   fontSize: 12.5,
//                   fontWeight: 600,
//                   color: dm.textSm,
//                   display: "block",
//                   marginBottom: 6,
//                 }}
//               >
//                 Confirm New Password
//               </label>
//               <Input
//                 type="password"
//                 value={cpForm.confirmPassword}
//                 onChange={(e) =>
//                   setCpForm((f) => ({ ...f, confirmPassword: e.target.value }))
//                 }
//                 placeholder="Repeat new password"
//                 required
                
//               />
         
//             </div>
              
//             <Button
//               type="submit"
//               disabled={cpLoading}
//               style={{
//                 alignSelf: "flex-start",
//                 background: "#33496a",
//                 color: "white",
//                 border: "none",
//                 padding: "10px 24px",
//                 borderRadius: 10,
//                 fontSize: 13.5,
//                 fontWeight: 600,
//                 cursor: cpLoading ? "not-allowed" : "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               {cpLoading && (
//                 <Loader2 size={14} className="animate-spin" />
//               )}
//               Update Password
//             </Button>
//           </form>
//         </div>

//         {/* Stats */}
//         <div
//           style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
//         >
//           <div
//             style={{
//               background: dm.card,
//               borderRadius: 14,
//               padding: "18px 20px",
//               border: `1px solid ${dm.border}`,
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{ fontSize: 28, fontWeight: 800, color: "#f97316" }}
//             >
//               {clients.length}
//             </div>
//             <div style={{ fontSize: 12.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
//               Total Clients Managed
//             </div>
//           </div>
//           <div
//             style={{
//               background: dm.card,
//               borderRadius: 14,
//               padding: "18px 20px",
//               border: `1px solid ${dm.border}`,
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{ fontSize: 28, fontWeight: 800, color: "#8b5cf6" }}
//             >
//               {team.length}
//             </div>
//             <div style={{ fontSize: 12.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
//               Team Members
//             </div>
//           </div>
//         </div>
//       </div>
//       </div>
//     );
//   };

//   // ── RENDER ────────────────────────────────────────────────────────────────
//   if (!authChecked || !adminSession) {
//     return (
//       <div style={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: darkMode ? "#0f172a" : "#f8fafc",
//       }}>
//         <div style={{ textAlign: "center" }}>
//           <Loader2 size={32} color="#33496a" style={{ animation: "spin 1s linear infinite" }} />
//           <p style={{ marginTop: 12, color: "#94a3b8", fontSize: 14 }}>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         fontFamily: "'Inter', sans-serif",
//         background: darkMode ? "#0f172a" : "#f8fafc",
//         color: darkMode ? "#f1f5f9" : "#0f172a",
//         transition: "background 0.2s, color 0.2s",
//       }}
//     >
//       {/* Desktop Sidebar */}
//       <div className="hidden md:block">
//         <SidebarContent />
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {mobileSideOpen && (
//         <div
//           style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               background: "rgba(0,0,0,0.4)",
//             }}
//             onClick={() => setMobileSideOpen(false)}
//           />
//           <div
//             style={{
//               position: "relative",
//               width: 240,
//               background: dm.card,
//               height: "100%",
//               overflowY: "auto",
//               zIndex: 51,
//             }}
//           >
//             <SidebarContent />
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div
//         style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
//       >
//         {/* Topbar */}
//         <div
//           style={{
//             background: dm.card,
//             borderBottom: `1px solid ${dm.border}`,
//             padding: "0 24px",
//             height: 60,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             position: "sticky",
//             top: 0,
//             zIndex: 10,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <button
//               className="md:hidden"
//               onClick={() => setMobileSideOpen(true)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 padding: 4,
//               }}
//             >
//               <Menu size={22} color="#64748b" />
//             </button>
//             <div style={{ fontSize: 13.5, color: darkMode ? "#64748b" : "#94a3b8" }}>
//               <span style={{ color: "#33496a", fontWeight: 600 }}>Admin</span>
//               {" / "}
//               <span style={{ fontWeight: 600, color: dm.textSm }}>
//                 {navItems.find((n) => n.id === tab)?.label || tab}
//               </span>
//             </div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <button
//               style={{
//                 width: 38,
//                 height: 38,
//                 borderRadius: 10,
//                 border: `1px solid ${dm.border}`,
//                 background: dm.bellBg,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//               }}
//             >
//               <Bell size={17} color={dm.muted} />
//             </button>
//             {/* Dark Mode Toggle */}
//             <button
//               onClick={() => setDarkMode((d) => !d)}
//               title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//               style={{
//                 width: 38,
//                 height: 38,
//                 borderRadius: 10,
//                 border: `1px solid ${dm.border}`,
//                 background: darkMode ? "#1e293b" : "white",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 transition: "background 0.2s",
//               }}
//             >
//               {darkMode
//                 ? <Sun size={17} color="#33496a" />
//                 : <Moon size={17} color="#64748b" />}
//             </button>
//             {/* Avatar — click to go to Profile tab */}
//             <button
//               onClick={() => setTab("profile")}
//               title="View Profile"
//               style={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: 10,
//                 background: profileImage ? "transparent" : "#33496a",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 13,
//                 fontWeight: 800,
//                 color: "white",
//                 border: "none",
//                 cursor: "pointer",
//                 overflow: "hidden",
//                 padding: 0,
//               }}
//             >
//               {profileImage
//                 ? <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                 : (adminSession?.name || "A").charAt(0).toUpperCase()}
//             </button>
//           </div>
//         </div>

//         {/* Page Content */}
//         <div
//           style={{
//             flex: 1,
//             padding: "28px 28px 40px",
//             overflowY: "auto",
//             background: dm.bg,
//           }}
//         >
//           {tab === "overview" && <OverviewTab />}
//           {tab === "clients" && <ClientsTab />}
//           {tab === "smm" && (
//             <TeamList
//               members={smm}
//               roleLabel="SMM Executive"
//               accentColor="#33496a"
//               icon={Megaphone}
//               addTab="add_smm"
//             />
//           )}
//           {tab === "gd" && (
//             <TeamList
//               members={gd}
//               roleLabel="Graphic Designer"
//               accentColor="#8b5cf6"
//               icon={Palette}
//               addTab="add_gd"
//             />
//           )}
//           {tab === "workspace" && (
//               <div style={{ maxWidth: 900 }}>
//                 <div style={{ marginBottom: 28 }}>
//                   <h1 style={{ fontSize: 22, fontWeight: 800, color: dm.text, margin: 0 }}>
//                     Workspace
//                   </h1>
//                   <p style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
//                     Overview of client–team assignments and active work.
//                   </p>
//                 </div>
          
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 20,
//                     marginBottom: 24,
//                   }}
//                 >
//                   {/* Client Assignments */}
//                   <div
//                     style={{
//                       background: dm.card,
//                       borderRadius: 18,
//                       padding: 22,
//                       border: `1px solid ${dm.border}`,
//                       boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//                     }}
//                   >
//                     <h3
//                       style={{
//                         fontSize: 14,
//                         fontWeight: 700,
//                         color: dm.text,
//                         marginBottom: 16,
//                       }}
//                     >
//                       Client Assignments
//                     </h3>
//                     {clients.map((c) => (
//                       <div
//                         key={c.id}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 12,
//                           padding: "10px 0",
//                           borderBottom: `1px solid ${dm.border}`,
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: 34,
//                             height: 34,
//                             borderRadius: 9,
//                             background: "#eff6ff",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: 12,
//                             fontWeight: 800,
//                             color: "#3b82f6",
//                           }}
//                         >
//                           {c.name.charAt(0)}
//                         </div>
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontSize: 13, fontWeight: 600, color: dm.textSm }}>
//                             {c.name}
//                           </div>
//                           <div style={{ fontSize: 11.5, color: darkMode ? "#64748b" : "#94a3b8" }}>{c.company}</div>
//                         </div>
//                         <div style={{ textAlign: "right" }}>
//                           <div style={{ fontSize: 11, color: "#33496a", fontWeight: 600 }}>
//                             {c.postsThisMonth} posts
//                           </div>
//                           <div style={{ fontSize: 10.5, color: darkMode ? "#64748b" : "#94a3b8" }}>
//                             {c.platforms.join(", ") || "No platforms"}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
          
//                   {/* Team Status */}
//                   <div
//                     style={{
//                       background: dm.card,
//                       borderRadius: 18,
//                       padding: 22,
//                       border: `1px solid ${dm.border}`,
//                       boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//                     }}
//                   >
//                     <h3
//                       style={{
//                         fontSize: 14,
//                         fontWeight: 700,
//                         color: dm.text,
//                         marginBottom: 16,
//                       }}
//                     >
//                       Team Status
//                     </h3>
//                     {team.map((m) => {
//                       const color = m.role === "smm" ? "#f97316" : "#8b5cf6";
//                       const MemberIcon = m.role === "smm" ? Megaphone : Palette;
//                       return (
//                         <div
//                           key={m.id}
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 12,
//                             padding: "10px 0",
//                             borderBottom: `1px solid ${dm.border}`,
//                           }}
//                         >
//                           <div
//                             style={{
//                               width: 34,
//                               height: 34,
//                               borderRadius: 9,
//                               background: color + "18",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             <MemberIcon size={16} color={color} />
//                           </div>
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontSize: 13, fontWeight: 600, color: dm.textSm }}>
//                               {m.name}
//                             </div>
//                             <div style={{ fontSize: 11.5, color: darkMode ? "#64748b" : "#94a3b8" }}>
//                               {m.role === "smm" ? "SMM Executive" : "Graphic Designer"}
//                             </div>
//                           </div>
//                           <span
//                             style={{
//                               fontSize: 11,
//                               fontWeight: 700,
//                               padding: "2px 9px",
//                               borderRadius: 20,
//                               background: m.status === "active" ? "#dcfce7" : "#f1f5f9",
//                               color: m.status === "active" ? "#16a34a" : "#94a3b8",
//                             }}
//                           >
//                             {m.status}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
          
//                 {/* Posts Summary Chart */}
//                 <div
//                   style={{
//                     background: dm.card,
//                     borderRadius: 18,
//                     padding: 22,
//                     border: `1px solid ${dm.border}`,
//                     boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//                   }}
//                 >
//                   <h3
//                     style={{
//                       fontSize: 14,
//                       fontWeight: 700,
//                       color: dm.text,
//                       marginBottom: 16,
//                     }}
//                   >
//                     Monthly Posts Summary
//                   </h3>
//                   <ResponsiveContainer width="100%" height={180}>
//                     <BarChart
//                       data={clients.map((c) => ({
//                         name: c.company || c.name,
//                         posts: c.postsThisMonth,
//                       }))}
//                     >
//                       <XAxis
//                         dataKey="name"
//                         tick={{ fontSize: 12, fill: "#94a3b8" }}
//                         axisLine={false}
//                         tickLine={false}
//                       />
//                       <YAxis
//                         tick={{ fontSize: 11, fill: "#94a3b8" }}
//                         axisLine={false}
//                         tickLine={false}
//                       />
//                       <Tooltip
//                         contentStyle={{
//                           borderRadius: 10,
//                           border: "none",
//                           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//                           fontSize: 12,
//                         }}
//                       />
//                       <Bar dataKey="posts" fill="#f97316" radius={[6, 6, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
          
//                 {/* Project Details List */}
//                 <div
//                   style={{
//                     background: dm.card,
//                     borderRadius: 18,
//                     padding: 22,
//                     border: `1px solid ${dm.border}`,
//                     boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//                     marginTop: 20,
//                   }}
//                 >
//                   <h3 style={{ fontSize: 14, fontWeight: 700, color: dm.text, marginBottom: 16 }}>
//                     Project Details
//                   </h3>
//                   {!Array.isArray(projects) || projects.length === 0 ? (
//                     <div style={{ textAlign: "center", padding: "32px 0", color: darkMode ? "#64748b" : "#94a3b8" }}>
//                       <FolderOpen size={36} style={{ margin: "0 auto 10px", opacity: 0.3 }} />
//                       <p style={{ fontSize: 13 }}>No projects found.</p>
//                     </div>
//                   ) : (
//                     <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                       {projects.map((p: any, i: number) => {
//                         const statusColor: Record<string, string> = {
//                           pending: "#f59e0b",
//                           "in-progress": "#3b82f6",
//                           completed: "#16a34a",
//                           approved: "#16a34a",
//                           revision: "#ef4444",
//                         };
//                         const status = p.status || p.projectStatus || "pending";
//                         const color = statusColor[status.toLowerCase()] || "#94a3b8";
//                         return (
//                           <div
//                             key={p._id || i}
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "space-between",
//                               padding: "12px 14px",
//                               borderRadius: 12,
//                               background: darkMode ? "#0f172a" : "#f8fafc",
//                               border: `1px solid ${dm.border}`,
//                               flexWrap: "wrap",
//                               gap: 10,
//                             }}
//                           >
//                             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                               <div style={{ width: 36, height: 36, borderRadius: 9, background: "#33496a18", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <FolderOpen size={16} color="#33496a" />
//                               </div>
//                               <div>
//                                 <div style={{ fontSize: 13.5, fontWeight: 700, color: dm.textSm }}>
//                                   {p.title || p.projectTitle || p.name || `Project #${i + 1}`}
//                                 </div>
//                                 <div style={{ fontSize: 11.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 2 }}>
//                                   {p.clientName || p.client?.name || ""}
//                                   {p.assignedTo && ` · Designer: ${p.assignedTo?.name || p.assignedTo}`}
//                                   {p.createdAt && ` · ${String(p.createdAt).slice(0, 10)}`}
//                                 </div>
//                               </div>
//                             </div>
//                             <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: color + "18", color }}>
//                               {status}
//                             </span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>
//           )}
//           {tab === "profile" && <ProfileTab />}
//           {tab === "add_client" && <AddClientTab />}
//           {tab === "add_smm" && (
//             <AddMemberForm
//               role="smm"
//               onAdd={async (m) => {
//                 const token = adminSession?.token || "";
//                 const body = {
//                   name: m.name,
//                   email: m.email,
//                   password: m.password,
//                   role: "SMM",
//                   phoneNumber: m.phone,
//                 };
//                 const { error, data } = await apiAdminCreateUser(token, body);
//                 if (error) {
//                   toast.error(error);
//                   return;
//                 }
//                 const newId =
//                   (data as any)?.data?.user?._id || m.id;
//                 setTeam((t) => [{ ...m, id: newId }, ...t]);
//                 setTab("smm");
//                 toast.success("SMM Executive created!");
//               }}
//               onCancel={() => setTab("smm")}
//               dm={dm}
//               darkMode={darkMode}
//             />
//           )}
//           {tab === "add_gd" && (
//             <AddMemberForm
//               role="graphic_designer"
//               onAdd={async (m) => {
//                 const token = adminSession?.token || "";
//                 const body = {
//                   name: m.name,
//                   email: m.email,
//                   password: m.password,
//                   role: "Graphic Designer",
//                   phoneNumber: m.phone,
//                 };
//                 const { error, data } = await apiAdminCreateUser(token, body);
//                 if (error) {
//                   toast.error(error);
//                   return;
//                 }
//                 const newId =
//                   (data as any)?.data?.user?._id || m.id;
//                 setTeam((t) => [{ ...m, id: newId }, ...t]);
//                 setTab("gd");
//                 toast.success("Graphic Designer created!");
//               }}
//               onCancel={() => setTab("gd")}
//               dm={dm}
//               darkMode={darkMode}
//             />
//           )}
//         </div>
//       </div>

//       {/* ── Edit Client Modal ───────────────────────────────────────────── */}
//       {editClient && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setEditClient(null)}>
//           <div style={{ background: darkMode ? "#1e293b" : "white", borderRadius: 18, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: `1px solid ${dm.border}` }} onClick={(e) => e.stopPropagation()}>
//             <h2 style={{ fontSize: 18, fontWeight: 800, color: dm.text, marginBottom: 20 }}>Edit Client</h2>
//             <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//               {([
//                 { label: "Full Name *", key: "name", type: "text", placeholder: "Priya Sharma" },
//                 { label: "Email *", key: "email", type: "email", placeholder: "client@company.com" },
//                 { label: "Phone", key: "phone", type: "text", placeholder: "+91 98765 43210" },
//                 { label: "Company", key: "company", type: "text", placeholder: "Company Pvt. Ltd." },
//                 { label: "Budget", key: "budget", type: "text", placeholder: "₹50,000 / month" },
//               ] as { label: string; key: keyof Client; type: string; placeholder: string }[]).map(({ label, key, type, placeholder }) => (
//                 <div key={key}>
//                   <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>{label}</label>
//                   <input
//                     type={type}
//                     value={(editClient[key] as string) || ""}
//                     onChange={(e) => setEditClient({ ...editClient, [key]: e.target.value })}
//                     placeholder={placeholder}
//                     style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${dm.borderMd}`, fontSize: 13.5, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//               <button
//                 onClick={() => {
//                   setClients((cs) => cs.map((c) => c.id === editClient.id ? editClient : c));
//                   setEditClient(null);
//                   toast.success("Client updated!");
//                 }}
//                 style={{ flex: 1, padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
//               >Save Changes</button>
//               <button onClick={() => setEditClient(null)} style={{ padding: "10px 20px", borderRadius: 10, background: dm.input, border: `1.5px solid ${dm.borderMd}`, color: dm.inputText, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Edit Member Modal ───────────────────────────────────────────── */}
//       {editMember && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setEditMember(null)}>
//           <div style={{ background: darkMode ? "#1e293b" : "white", borderRadius: 18, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: `1px solid ${dm.border}` }} onClick={(e) => e.stopPropagation()}>
//             <h2 style={{ fontSize: 18, fontWeight: 800, color: dm.text, marginBottom: 20 }}>Edit {editMember.role === "smm" ? "SMM Executive" : "Graphic Designer"}</h2>
//             <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//               {([
//                 { label: "Full Name *", key: "name", type: "text", placeholder: "Karan Mehta" },
//                 { label: "Email *", key: "email", type: "email", placeholder: "karan@agency.com" },
//                 { label: "Phone", key: "phone", type: "text", placeholder: "+91 98765 43210" },
//               ] as { label: string; key: keyof TeamMember; type: string; placeholder: string }[]).map(({ label, key, type, placeholder }) => (
//                 <div key={key}>
//                   <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>{label}</label>
//                   <input
//                     type={type}
//                     value={(editMember[key] as string) || ""}
//                     onChange={(e) => setEditMember({ ...editMember, [key]: e.target.value })}
//                     placeholder={placeholder}
//                     style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${dm.borderMd}`, fontSize: 13.5, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }}
//                   />
//                 </div>
//               ))}
//               <div>
//                 <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>Status</label>
//                 <select
//                   value={editMember.status}
//                   onChange={(e) => setEditMember({ ...editMember, status: e.target.value as "active" | "inactive" })}
//                   style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${dm.borderMd}`, fontSize: 13.5, color: dm.textSm, outline: "none", background: dm.input }}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//               <button
//                 onClick={() => {
//                   setTeam((ts) => ts.map((t) => t.id === editMember.id ? editMember : t));
//                   setEditMember(null);
//                   toast.success("Member updated!");
//                 }}
//                 style={{ flex: 1, padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #33496a, #1e3a5f)", color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
//               >Save Changes</button>
//               <button onClick={() => setEditMember(null)} style={{ padding: "10px 20px", borderRadius: 10, background: dm.input, border: `1.5px solid ${dm.borderMd}`, color: dm.inputText, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminDashboard;



import "./AdminDashboard.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Users, UserPlus, Key, Eye, EyeOff, Trash2, Copy,
  LayoutDashboard, LogOut, Palette, Megaphone, Building2,
  RefreshCw, Search, Mail, Phone, Calendar,
  ShieldCheck, ArrowUpRight, FolderOpen, User, CheckCircle,
  Bell, Menu, Loader2, Sun, Moon, Upload, X,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, CartesianGrid,
} from "recharts";
import {
  apiAdminDashboard,
  apiAdminGetUsers,
  apiAdminCreateUser,
  apiAdminUpdateUser,
  apiAdminChangeUserPassword,
  apiAdminProfile,
  apiAdminChangePassword,
  apiAdminUploadProfileImage,
  apiAdminRemoveProfileImage,
  apiAdminDesignProjects,
  clearAdminSession,
} from "@/lib/api";

// ── Constants ────────────────────────────────────────────────────────────────
// NOTE: pehle yahan CLIENT_STORE_KEY/TEAM_STORE_KEY (localStorage keys)
// the — ab clients/team backend se aate hain, in constants ki zarurat nahi.

// ── Password cache ───────────────────────────────────────────────────────────
// FIXED: Security ke liye backend asli password wapas nahi bhejta (sirf
// hashed store hota hai), isliye list refresh hone par password field
// hamesha masked "••••••" aata tha — eye button "on" karne par bhi wahi
// masked string dikhti thi, isliye ON aur OFF dono me password "hidden"
// jaisa hi lagta tha. Ab jab bhi admin is browser se koi client/SMM/GD
// banata hai, uska plain-text password yahan (localStorage) cache ho
// jaata hai, aur list load hone par us cache se real password wapas
// dikhaya jaata hai — taaki eye button dabane par sach me real password
// aur dots ke beech toggle ho. (Jo users kisi doosre browser/device se
// bane the, unke liye real password is browser ko pata hi nahi, isliye
// unke liye masked dots hi dikhega — yeh security ki wajah se hai,
// backend plain password kabhi return nahi karta.)
const PW_CACHE_KEY = "smm_admin_pw_cache_v1";

const loadPwCache = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(PW_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
};

const cachePassword = (id: string, password: string) => {
  if (!id || !password) return;
  try {
    const cache = loadPwCache();
    cache[id] = password;
    localStorage.setItem(PW_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage not available — ignore, falls back to masked password
  }
};

// ── Types ─────────────────────────────────────────────────────────────────────
type Role = "client" | "graphic_designer" | "smm";
type Tab =
  | "overview"
  | "clients"
  | "smm"
  | "gd"
  | "workspace"
  | "profile"
  | "add_client"
  | "add_smm"
  | "add_gd";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  password: string;
  createdAt: string;
  status: "active" | "inactive";
  clientId?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  password: string;
  createdAt: string;
  status: "active" | "inactive";
  assignedDesigner?: string;
  assignedSMM?: string;
  platforms: string[];
  postsThisMonth: number;
  budget?: string;
}

interface AdminSession {
  token: string;
  email: string;
  name: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const generatePassword = (): string => {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const generateId = (): string =>
  Math.random().toString(36).slice(2, 10).toUpperCase();


// ── Platform config ───────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "Instagram",  color: "#E1306C", bg: "#fdf2f8", label: "Instagram" },
  { id: "Facebook",   color: "#1877F2", bg: "#eff6ff", label: "Facebook" },
  { id: "YouTube",    color: "#FF0000", bg: "#fff1f2", label: "YouTube" },
  { id: "Pinterest",  color: "#E60023", bg: "#fff1f2", label: "Pinterest" },
  { id: "Threads",    color: "#000000", bg: "#f8fafc", label: "Threads" },
];

// ── Platform SVG icons ────────────────────────────────────────────────────────
const PlatformIcon = ({ id, size = 14 }: { id: string; size?: number }) => {
  const icons: Record<string, JSX.Element> = {
    Instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/>
      </svg>
    ),
    Facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    Twitter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DA1F2">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
      </svg>
    ),
    LinkedIn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2" fill="#0A66C2"/>
      </svg>
    ),
    YouTube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
      </svg>
    ),
    Pinterest: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#E60023">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
    TikTok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#010101">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.19a8.16 8.16 0 0 0 4.77 1.52V6.28a4.85 4.85 0 0 1-1-.59z"/>
      </svg>
    ),
    Google: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    WhatsApp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
    Threads: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.878-6.43 2.523-8.482C5.845 1.205 8.598.024 12.18 0h.014c2.746.019 5.043.7 6.826 2.025 1.68 1.248 2.858 3.038 3.505 5.322l-2.032.575c-1.086-3.83-3.734-5.79-7.878-5.83-2.999.02-5.267.982-6.744 2.86-1.386 1.762-2.101 4.24-2.126 7.36.025 3.12.74 5.598 2.126 7.36 1.477 1.878 3.745 2.84 6.744 2.86 2.703-.019 4.49-.664 5.972-2.157 1.688-1.7 1.655-3.802 1.119-5.101-.318-.772-.892-1.414-1.663-1.89-.192 1.35-.628 2.427-1.302 3.212-.897 1.045-2.174 1.617-3.798 1.702-1.229.064-2.415-.223-3.34-.808-1.096-.694-1.735-1.744-1.8-2.958-.062-1.18.396-2.276 1.29-3.086.858-.777 2.061-1.235 3.481-1.324a10.24 10.24 0 0 1 2.541.135c-.106-.628-.322-1.13-.646-1.494-.443-.497-1.13-.753-2.041-.762h-.03c-.734 0-1.716.202-2.346 1.156l-1.752-1.198c.844-1.267 2.226-1.966 3.896-1.966h.045c2.796.018 4.463 1.735 4.629 4.777.096.05.19.101.284.153 1.32.735 2.284 1.848 2.788 3.219.694 1.881.759 4.949-1.71 7.362-1.867 1.826-4.14 2.652-7.363 2.674z"/>
      </svg>
    ),
    Snapchat: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFFC00">
        <path d="M12.166.006c.167 0 1.12.027 1.993.477.596.306 1.83 1.196 1.83 3.035v.282c0 .59.026 2.012.372 2.953.05.135.074.178.14.23.184.143.474.142.665.099.133-.03.273-.072.437-.072.159 0 .283.035.373.107.177.14.208.367.065.538-.123.148-.466.397-1.04.583l-.047.016c-.023.008-.046.016-.07.023l-.027.009c-.038.013-.075.025-.11.037l-.054.019-.061.022a2.7 2.7 0 0 0-.104.042l-.063.03-.066.035a1.447 1.447 0 0 0-.119.074l-.053.038-.054.045-.043.039c-.25.237-.393.57-.359.916.021.217.065.456.122.683.182.727.565 1.337 1.119 1.767.35.27.81.462 1.396.568.236.043.427.22.427.458 0 .278-.217.508-.487.544-.107.014-.214.028-.32.028-.204 0-.405-.041-.605-.082-.2-.042-.4-.083-.604-.083-.242 0-.482.073-.72.249-.38.281-.608.777-.673 1.273-.053.416.041.786.228 1.056.109.16.188.327.196.498.006.135-.027.25-.103.344-.157.195-.457.26-.72.26-.067 0-.13-.006-.19-.013-.144-.018-.29-.036-.44-.036-.134 0-.267.014-.393.028l-.057.007c-.136.016-.267.032-.398.032-.168 0-.333-.022-.494-.067-.34-.095-.659-.33-.942-.697-.354-.46-.638-1.13-.798-1.927a.29.29 0 0 0-.064-.133c-.08-.085-.19-.12-.298-.12-.095 0-.192.026-.287.052-.096.026-.193.052-.289.052-.116 0-.207-.038-.28-.117a.407.407 0 0 1-.1-.28c0-.043.007-.088.022-.135l.032-.116c.074-.27.146-.54.175-.803.03-.262-.007-.527-.108-.75a2.019 2.019 0 0 0-.18-.316 1.89 1.89 0 0 0-.48-.49c-.164-.117-.344-.19-.525-.215a1.27 1.27 0 0 0-.174-.012c-.357 0-.667.151-.905.34-.397.315-.712.79-.868 1.362-.175.634-.14 1.35.066 1.963l.058.18c.068.21.135.416.135.622 0 .22-.066.409-.2.558-.243.272-.652.374-1.066.374-.167 0-.333-.02-.487-.04l-.152-.019a2.45 2.45 0 0 0-.323-.024c-.29 0-.577.055-.862.11-.286.055-.571.11-.856.11-.21 0-.356-.044-.457-.136-.14-.124-.17-.326-.076-.522.05-.108.1-.217.101-.33.002-.13-.05-.255-.153-.378-.443-.532-.797-1.163-.994-1.777a4.55 4.55 0 0 1-.204-1.344 3.95 3.95 0 0 1 .063-.712C2.05 14.49 1.8 14.38 1.6 14.258c-.24-.145-.41-.322-.41-.543 0-.24.194-.416.432-.458.586-.106 1.046-.298 1.396-.568.553-.43.937-1.04 1.118-1.766.058-.228.102-.467.123-.684.034-.347-.11-.68-.36-.916a1.86 1.86 0 0 0-.21-.167c-.044-.03-.09-.06-.138-.088l-.054-.031a2.634 2.634 0 0 0-.164-.085l-.063-.029a2.63 2.63 0 0 0-.105-.043l-.06-.022-.055-.019-.109-.037-.027-.009c-.024-.007-.047-.015-.07-.023l-.047-.016c-.574-.186-.917-.435-1.04-.583-.143-.171-.112-.398.065-.538.09-.072.214-.107.373-.107.164 0 .304.043.437.072.191.043.481.044.665-.099.066-.051.09-.094.14-.23.346-.941.372-2.363.372-2.953v-.282C3.82 1.19 5.084.305 5.677-.006A4.124 4.124 0 0 1 7.636-.5C7.8-.5 7.964-.487 8.12-.46c.586.1 1.12.38 1.527.702.254.203.5.457.716.752.217-.295.463-.549.716-.752A4.006 4.006 0 0 1 12.166.006z" stroke="none"/>
      </svg>
    ),
  };
  return icons[id] ?? <span style={{ fontSize: size * 0.7, fontWeight: 700, color: "#94a3b8" }}>{id.charAt(0)}</span>;
};

// ── GCLogo ────────────────────────────────────────────────────────────────────
const GCLogo = ({ collapsed = false, darkMode = false }: { collapsed?: boolean; darkMode?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <div className="relative shrink-0">
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#33496a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
         
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 14 L7 9 L10 12 L14 6 L17 10"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="10" r="2" fill="white" />
        </svg>
      </div>
    </div>
    {!collapsed && (
      <div className="leading-none">
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: darkMode ? "#f1f5f9" : "#1a1a2e",
            letterSpacing: "-0.3px",
          }}
        >
          Growthcraft<span style={{ color: "#33496a" }}>360</span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: darkMode ? "#64748b" : "#94a3b8",
            fontWeight: 500,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Admin Panel
        </div>
      </div>
    )}
  </div>
);

// ── StatCard ──────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
  trend?: string;
  dm: { card: string; border: string; text: string };
  darkMode: boolean;
}

const StatCard = ({ label, value, icon: Icon, color, bg, trend, dm, darkMode }: StatCardProps) => (
  <div
    style={{
      background: dm.card,
      borderRadius: 16,
      padding: "20px 22px",
      border: `1px solid ${dm.border}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} color={color} />
      </div>
      {trend && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: "#22c55e",
          }}
        >
          <ArrowUpRight size={14} /> {trend}
        </div>
      )}
    </div>
    <div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: dm.text,
          letterSpacing: "-1px",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{ fontSize: 12.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4, fontWeight: 500 }}
      >
        {label}
      </div>
    </div>
  </div>
);

// ── PwField ───────────────────────────────────────────────────────────────────
interface PwFieldProps {
  password: string;
  id: string;
  show: boolean;
  onToggle: (id: string) => void;
  onCopy: (pw: string) => void;
  dm: { mutedBg: string; borderMd: string };
  darkMode: boolean;
}

const PwField = ({ password, id, show, onToggle, onCopy, dm, darkMode }: PwFieldProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: dm.mutedBg,
      borderRadius: 10,
      padding: "8px 12px",
      border: `1px solid ${dm.borderMd}`,
    }}
  >
    <Key size={14} color="#94a3b8" />
    <span
      style={{ flex: 1, fontFamily: "monospace", fontSize: 13, color: darkMode ? "#94a3b8" : "#475569" }}
    >
      {show ? password : "•".repeat(password.length)}
    </span>
    <button
      onClick={() => onToggle(id)}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
    >
      {show ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#94a3b8" />}
    </button>
    <button
      onClick={() => onCopy(password)}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
    >
      <Copy size={14} color="#94a3b8" />
    </button>
  </div>
);

// ── AddMemberForm ─────────────────────────────────────────────────────────────
interface AddMemberFormProps {
  role: "smm" | "graphic_designer";
  onAdd: (m: TeamMember) => void;
  onCancel: () => void;
  dm: { card: string; border: string; text: string; textSm: string; muted: string; borderMd: string; mutedBg: string; input: string; inputText: string };
  darkMode: boolean;
}

const AddMemberForm = ({ role, onAdd, onCancel, dm, darkMode }: AddMemberFormProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const label = role === "smm" ? "SMM Executive" : "Graphic Designer";
  const accentColor = role === "smm" ? "#33496a" : "#8b5cf6";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Fill required fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onAdd({
        id: "T" + generateId(),
        ...form,
        role,
        createdAt: new Date().toISOString().slice(0, 10),
        status: "active",
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: accentColor + "18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {role === "smm" ? (
              <Megaphone size={18} color={accentColor} />
            ) : (
              <Palette size={18} color={accentColor} />
            )}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: dm.text }}>
            Add {label}
          </h1>
        </div>
        <p style={{ color: darkMode ? "#64748b" : "#94a3b8", fontSize: 13.5 }}>
          Credentials will be shared with the new team member.
        </p>
      </div>

      <div
        style={{
          background: dm.card,
          borderRadius: 18,
          padding: 28,
          border: `1px solid ${dm.border}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>
              Full Name *
            </label>
            <input
              type="text"
              name="new_member_name"
              autoComplete="off"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Karan Mehta"
              required
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>
              Email Address *
            </label>
            <input
              type="email"
              name="new_member_email"
              autoComplete="off"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="karan@agency.com"
              required
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>
              Phone Number
            </label>
            <input
              type="text"
              name="new_member_phone"
              autoComplete="off"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>
              Password *
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                name="new_member_password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                required
                style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box" }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}
              >
                {showPw ? <Eye size={15} color="#94a3b8" /> : <EyeOff size={15} color="#94a3b8" />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 10,
                background: loading
                  ? "#e2e8f0"
                  : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                color: loading ? "#94a3b8" : "white",
                border: "none",
                fontWeight: 700,
                fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading && (
                <Loader2
                  size={15}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              )}
              Add {label}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "11px 20px",
                borderRadius: 10,
                background: dm.card,
                border: `1.5px solid ${dm.borderMd}`,
                color: dm.muted,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [mobileSideOpen, setMobileSideOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("gc_admin_dark") === "true");
  const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem("gc_admin_profile_img") || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editClientSaving, setEditClientSaving] = useState(false);
  const [editClientNewPassword, setEditClientNewPassword] = useState("");
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [editMemberSaving, setEditMemberSaving] = useState(false);
  const [editMemberNewPassword, setEditMemberNewPassword] = useState("");
  const [projects, setProjects] = useState<any[]>([]);

  // ── Dark mode style helper ──────────────────────────────────────────────────
  const dm = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#1e293b" : "white",
    cardBorder: darkMode ? "#334155" : "#f1f5f9",
    text: darkMode ? "#f1f5f9" : "#0f172a",
    textSm: darkMode ? "#cbd5e1" : "#1e293b",
    muted: darkMode ? "#94a3b8" : "#64748b",
    mutedBg: darkMode ? "#0f172a" : "#f8fafc",
    border: darkMode ? "#334155" : "#f1f5f9",
    borderMd: darkMode ? "#475569" : "#e2e8f0",
    input: darkMode ? "#1e293b" : "white",
    inputBorder: darkMode ? "#475569" : "#e2e8f0",
    inputText: darkMode ? "#f1f5f9" : "#1e293b",
    hover: darkMode ? "#334155" : "#f8fafc",
    topbar: darkMode ? "#1e293b" : "white",
    topbarBorder: darkMode ? "#334155" : "#f1f5f9",
    bellBg: darkMode ? "#1e293b" : "white",
    bellBorder: darkMode ? "#334155" : "#f1f5f9",
    toggleBg: darkMode ? "#1e293b" : "white",
  };



  // ── Workspace form state ──
  const [workspaceForm, setWorkspaceForm] = useState({
    agencyName: "",
    description: "",
    address: "",
  });
  const [workspaceSaving, setWorkspaceSaving] = useState(false);

  // ── Data states ──
  // FIXED: pehle yahan localStorage se initial data load hota tha
  // (CLIENT_STORE_KEY/TEAM_STORE_KEY) — localStorage har browser/PC ke
  // liye ALAG hota hai, isliye doosre device/browser pe hamesha khaali
  // milta tha, aur ek baar cache ho jaane ke baad MongoDB se delete kiya
  // hua data bhi screen pe dikhta rehta tha. Ab sirf backend hi source
  // of truth hai — neeche wale useEffect me jo aayega wahi dikhega.
  const [clients, setClients] = useState<Client[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // ── Add client form state ──
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    budget: "",
  });
  const [clientLoading, setClientLoading] = useState(false);
  const [showClientPw, setShowClientPw] = useState(false);


  // ── Dark mode effect ────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("gc_admin_dark", String(darkMode));
  }, [darkMode]);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem("sf_admin_session");
    if (!raw) {
      navigate("/admin-login");
      return;
    }
    try {
      const s = JSON.parse(raw);
      if (!s?.token) {
        navigate("/admin-login");
        return;
      }
      setAdminSession(s);
      setAuthChecked(true);
    } catch {
      navigate("/admin-login");
    }
  }, [navigate]);

  // ── Fetch data after session loaded ──────────────────────────────────────
  useEffect(() => {
    if (!adminSession?.token) return;
    const token = adminSession.token;

    apiAdminDashboard(token).then(({ data }) => {
      if (data) {
        // dashStats could be used for live data; currently using local state
      }
    });

    apiAdminGetUsers(token, { limit: 1000, page: 1 }).then(({ data, error }) => {
      // FIXED: pehle "if (clientUsers.length > 0)" guard tha — matlab
      // agar backend se genuinely khaali list aati (client delete ho
      // chuka MongoDB se) YA request hi fail ho jaati (CORS/network),
      // tab bhi setClients kabhi call nahi hota tha, aur jo purana data
      // state me pehle se tha (stale/localStorage se) wahi dikhta rehta
      // tha — chahe wo MongoDB me ab exist hi na karta ho.
      // Ab hum HAMESHA state ko backend response ke hisaab se set karte
      // hain (khaali ho tab bhi), aur error alag se dikhate hain taaki
      // "blank" aur "fetch fail hua" me farak pata chale.
      setUsersLoading(false);

      if (error) {
        setUsersError(error);
        setClients([]);
        setTeam([]);
        return;
      }
      setUsersError(null);

      try {
      // FIXED: pehle sirf "(data as any)?.data" check hota tha. Agar
      // backend paginated shape bhejta (e.g. { data: { users: [...],
      // total, page } } — ek object, array nahi) to "users" variable
      // array ki jagah OBJECT ban jaata tha, aur neeche ".filter()" call
      // silently (uncaught) fail ho jaata — jiski wajah se list state
      // kabhi update hi nahi hoti thi aur "0 found" dikhta rehta tha,
      // chahe backend me record maujood ho (jaise login hokar confirm
      // hua). Ab hum har mumkin common shape try karte hain aur hamesha
      // ek asli array hi nikalte hain.
      const raw: any = data;
      const users: any[] = (
        (Array.isArray(raw?.data) && raw.data) ||
        (Array.isArray(raw?.users) && raw.users) ||
        (Array.isArray(raw?.data?.users) && raw.data.users) ||
        (Array.isArray(raw?.data?.data) && raw.data.data) ||
        (Array.isArray(raw) && raw) ||
        []
      );

      // Role strings backend se thoda alag case/spacing me aa sakte
      // hain (e.g. "smm", "SMM ", "Smm Executive") — isliye ab normalize
      // karke case-insensitive match karte hain taaki naye add kiye
      // hue users role-mismatch ki wajah se list se gayab na ho.
      const normRole = (r: unknown) =>
        String(r ?? "").trim().toLowerCase();

      const clientUsers = users.filter((u: any) => normRole(u.role) === "client");
      const smmUsers = users.filter((u: any) =>
        normRole(u.role) === "smm" || normRole(u.role).includes("smm")
      );
      const gdUsers = users.filter((u: any) => {
        const r = normRole(u.role);
        return (
          r === "graphic designer" ||
          r === "graphic_designer" ||
          r === "gd" ||
          r.includes("graphic")
        );
      });

      // FIXED: pehle hardcoded "••••••" bhej dete the, isliye eye button
      // ON/OFF dono me masked dots hi dikhte the. Ab is-browser-me-cached
      // real password (agar maujood ho) use karte hain.
      const pwCache = loadPwCache();

      setClients(
        clientUsers.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phoneNumber || "",
          company: u.companyName || "",
          industry: u.industry || "",
          password: pwCache[u._id] || "••••••",
          createdAt: u.createdAt?.slice(0, 10) || "",
          status: u.isActive ? "active" : "inactive",
          platforms: [],
          postsThisMonth: 0,
        }))
      );

      const teamFromApi: TeamMember[] = [
        ...smmUsers.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phoneNumber || "",
          role: "smm" as Role,
          password: pwCache[u._id] || "••••••",
          createdAt: u.createdAt?.slice(0, 10) || "",
          status: (u.isActive ? "active" : "inactive") as "active" | "inactive",
        })),
        ...gdUsers.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phoneNumber || "",
          role: "graphic_designer" as Role,
          password: pwCache[u._id] || "••••••",
          createdAt: u.createdAt?.slice(0, 10) || "",
          status: (u.isActive ? "active" : "inactive") as "active" | "inactive",
        })),
      ];

      setTeam(teamFromApi);
      } catch (e) {
        console.error("Failed to parse admin users response:", e, data);
        setUsersError("Could not read the users list from server response.");
      }
    });

    apiAdminProfile(token).then(({ data }) => {
      const d = data as any;
      setWorkspaceForm({
        agencyName: d?.agencyName || d?.workspace?.agencyName || "",
        description: d?.description || d?.workspace?.description || "",
        address: d?.address || d?.workspace?.address || "",
      });
    });

    apiAdminDesignProjects(token).then(({ data }) => {
      const raw = (data as any)?.data || (data as any)?.projects || (data as any) || [];
      const list: any[] = Array.isArray(raw) ? raw : [];
      setProjects(list);
    });
  }, [adminSession]);

  // NOTE: clients/team ab localStorage me persist nahi hote — backend
  // (MongoDB) hi single source of truth hai. Isse har device/browser pe
  // hamesha latest, sahi data dikhega.


  // ── Profile Image Handlers ────────────────────────────────────────────────
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = adminSession?.token || "";
    setImgUploading(true);
    const { data, error } = await apiAdminUploadProfileImage(token, file);
    setImgUploading(false);
    if (error) { toast.error(error); return; }
    // Use server URL if provided, otherwise convert to base64 for persistence
    const serverUrl = (data as any)?.imageUrl || (data as any)?.profileImage;
    if (serverUrl) {
      setProfileImage(serverUrl);
      localStorage.setItem("gc_admin_profile_img", serverUrl);
      toast.success("Profile image updated!");
    } else {
      // Convert to base64 so it survives page reloads
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem("gc_admin_profile_img", base64);
        toast.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    const token = adminSession?.token || "";
    setImgUploading(true);
    const { error } = await apiAdminRemoveProfileImage(token);
    setImgUploading(false);
    if (error) { toast.error(error); return; }
    setProfileImage(null);
    localStorage.removeItem("gc_admin_profile_img");
    toast.success("Profile image removed!");
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const togglePassword = useCallback(
    (id: string) => setShowPasswords((p) => ({ ...p, [id]: !p[id] })),
    []
  );

  const copyPw = useCallback((pw: string) => {
    navigator.clipboard.writeText(pw);
    toast.success("Password copied!");
  }, []);

  const smm = team.filter((t) => t.role === "smm");
  const gd = team.filter((t) => t.role === "graphic_designer");

  // ── Dynamic chart data ────────────────────────────────────────────────────
  const activityData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dayLabel = days[d.getDay()];
      const dayStr = d.toISOString().slice(0, 10);
      const postsOnDay = clients.reduce((sum, c) => {
        const joined = c.createdAt?.slice(0, 10);
        return sum + (joined === dayStr ? c.postsThisMonth : 0);
      }, 0);
      const clientsOnDay = clients.filter((c) => c.createdAt?.slice(0, 10) === dayStr).length;
      return { day: dayLabel, posts: postsOnDay, clients: clientsOnDay };
    });
  })();

  const growthData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const count = clients.filter((c) => c.createdAt?.slice(0, 7) === key).length;
      return { month: months[d.getMonth()], clients: count };
    });
  })();

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  // ── Add Client Handler ────────────────────────────────────────────────────
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email) {
      toast.error("Name and email are required");
      return;
    }
    const token = adminSession?.token || "";
    setClientLoading(true);
    const body = {
      name: clientForm.name,
      email: clientForm.email,
      password: clientForm.password,
      role: "Client",
      companyName: clientForm.company,
      phoneNumber: clientForm.phone,
    };
    const { error, data } = await apiAdminCreateUser(token, body);
    setClientLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    const newId = (data as any)?.data?.user?._id || "C" + generateId();
    cachePassword(newId, clientForm.password);
    const nc: Client = {
      id: newId,
      name: clientForm.name,
      email: clientForm.email,
      phone: clientForm.phone,
      company: clientForm.company,
      password: clientForm.password,
      budget: clientForm.budget,
      industry: "",
      createdAt: new Date().toISOString().slice(0, 10),
      status: "active",
      platforms: [],
      postsThisMonth: 0,
    };
    setClients((c) => [nc, ...c]);
    setClientForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      password: "",
      budget: "",
    });
    setTab("clients");
    toast.success("Client created!");
  };

  // ── Nav items ─────────────────────────────────────────────────────────────
  const navItems: {
    id: Tab;
    icon: React.ElementType;
    label: string;
    count?: number;
  }[] = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "clients", icon: Building2, label: "Total Clients", count: clients.length },
    { id: "smm", icon: Megaphone, label: "SMM Executives", count: smm.length },
    { id: "gd", icon: Palette, label: "Graphic Designers", count: gd.length },
    { id: "workspace", icon: FolderOpen, label: "Workspace" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <aside
      style={{
        width: sideCollapsed ? 72 : 240,
        minHeight: "100vh",
        background: darkMode ? "#1e293b" : "white",
        borderRight: darkMode ? "1px solid #334155" : "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: sideCollapsed ? "20px 18px" : "20px 20px",
          borderBottom: `1px solid ${dm.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <GCLogo collapsed={sideCollapsed} darkMode={darkMode} />
        <button
          onClick={() => setSideCollapsed(!sideCollapsed)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            marginLeft: sideCollapsed ? 0 : 8,
            color: darkMode ? "#64748b" : "#94a3b8",
            display: "flex",
          }}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Admin Badge */}
      {!sideCollapsed ? (
        <div
          style={{
            margin: "16px 14px 8px",
            padding: "10px 14px",
            background:"#33496a",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldCheck size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>
               Admin
            </div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.75)" }}>
              {adminSession?.email || "admin@growthcraft360.com"}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            margin: "12px auto",
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "#33496a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShieldCheck size={18} color="white" />
        </div>
      )}

      {/* Nav */}
      <nav
        style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}
      >
        {!sideCollapsed && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#cbd5e1",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "4px 10px 8px",
            }}
          >
            NAVIGATION
          </div>
        )}
        {navItems.map((n) => {
          const active = tab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => {
                setTab(n.id);
                setSearch("");
                setMobileSideOpen(false);
              }}
              title={sideCollapsed ? n.label : undefined}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: sideCollapsed ? "11px 0" : "10px 12px",
                justifyContent: sideCollapsed ? "center" : "flex-start",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                marginBottom: 2,
                transition: "all 0.15s",
                background: active
                  ? "linear-gradient(135deg, #fff7ed, #ffedd5)"
                  : "transparent",
                color: active ? "#33496a" : "#64748b",
                fontWeight: active ? 700 : 500,
                fontSize: 13.5,
              }}
            >
              <n.icon size={18} />
              {!sideCollapsed && (
                <>
                  <span style={{ flex: 1, textAlign: "left" }}>{n.label}</span>
                  {n.count !== undefined && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: active ? "#33496a" : "#f1f5f9",
                        color: active ? "white" : "#94a3b8",
                        borderRadius: 20,
                        padding: "1px 7px",
                      }}
                    >
                      {n.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {/* Quick Add */}
        {!sideCollapsed && (
          <>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#cbd5e1",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                padding: "12px 10px 8px",
              }}
            >
              QUICK ADD
            </div>
            {(
              [
                { id: "add_client" as Tab, label: "Add Client", color: "#3b82f6" },
                { id: "add_smm" as Tab, label: "Add SMM", color: "#33496a" },
                { id: "add_gd" as Tab, label: "Add Designer", color: "#8b5cf6" },
              ] as const
            ).map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setTab(q.id);
                  setMobileSideOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 2,
                  background: tab === q.id ? q.color + "15" : "transparent",
                  color: tab === q.id ? q.color : "#94a3b8",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <UserPlus size={15} />
                <span>{q.label}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Sign Out */}
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${dm.border}` }}>
        <button
          onClick={() => {
            clearAdminSession();
            localStorage.removeItem("socialflow_role");
            navigate("/");
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: sideCollapsed ? "10px 0" : "10px 12px",
            justifyContent: sideCollapsed ? "center" : "flex-start",
            borderRadius: 10,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: darkMode ? "#64748b" : "#94a3b8",
            fontSize: 13.5,
            fontWeight: 500,
          }}
        >
          <LogOut size={17} />
          {!sideCollapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );

  // ── OVERVIEW TAB ──────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <div style={{ maxWidth: 1100 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{ fontSize: 24, fontWeight: 800, color: dm.text, margin: 0 }}
          >
            Welcome back, {adminSession?.name || adminSession?.email?.split('@')[0] || 'Admin'} 👋
          </h1>
          <p style={{ color: darkMode ? "#64748b" : "#94a3b8", fontSize: 13.5, marginTop: 4 }}>
            Here's what's happening at Growthcraft360 today.
          </p>
          {usersError && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 14px",
                borderRadius: 8,
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: 12.5,
                fontWeight: 600,
                maxWidth: 520,
              }}
            >
              ⚠️ Clients/team data load nahi ho paaya: {usersError}. Backend URL
              (VITE_API_BASE_URL) aur CORS settings check karein, phir page
              refresh karein.
            </div>
          )}
        </div>
        <button
          onClick={() => setTab("add_client")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 18px",
            borderRadius: 10,
            background: "#33496a",
            color: "white",
            border: "none",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
        
          }}
        >
          <UserPlus size={15} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Total Clients"
          value={clients.length}
          icon={Building2}
          color="#3b82f6"
          bg="#eff6ff"
          trend="+12%"
        dm={dm}
        darkMode={darkMode}
        />
        <StatCard
          label="Active Clients"
          value={clients.filter((c) => c.status === "active").length}
          icon={CheckCircle}
          color="#22c55e"
          bg="#f0fdf4"
          trend="+8%"
        dm={dm}
        darkMode={darkMode}
        />
        <StatCard
          label="SMM Executives"
          value={smm.length}
          icon={Megaphone}
          color="#33496a"
          bg="#fff7ed"
        dm={dm}
        darkMode={darkMode}
        />
        <StatCard
          label="Graphic Designers"
          value={gd.length}
          icon={Palette}
          color="#8b5cf6"
          bg="#f5f3ff"
        dm={dm}
        darkMode={darkMode}
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: dm.card,
            borderRadius: 18,
            padding: 22,
            border: `1px solid ${dm.border}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div>
              <h3
                style={{ fontSize: 15, fontWeight: 700, color: dm.text, margin: 0 }}
              >
                Weekly Activity
              </h3>
              <p style={{ fontSize: 12, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 2 }}>
                Posts published this week
              </p>
            </div>
            <div
              style={{
                padding: "4px 10px",
                background: "#f0fdf4",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                color: "#22c55e",
              }}
            >
              Live
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData} barGap={4}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="posts" fill="#33496a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: dm.card,
            borderRadius: 18,
            padding: 22,
            border: `1px solid ${dm.border}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <h3
              style={{ fontSize: 15, fontWeight: 700, color: dm.text, margin: 0 }}
            >
              Client Growth
            </h3>
            <p style={{ fontSize: 12, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 2 }}>
              New clients per month
            </p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={growthData}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <Line
                type="monotone"
                dataKey="clients"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Clients Table */}
      <div
        style={{
          background: dm.card,
          borderRadius: 18,
          border: `1px solid ${dm.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: `1px solid ${dm.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: dm.text, margin: 0 }}>
            Recent Clients
          </h3>
          <button
            onClick={() => setTab("clients")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 13,
              fontWeight: 600,
              color: "#33496a",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View All
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Client", "Company", "Platforms", "Posts/mo", "Assigned To", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 18px",
                      textAlign: "left",
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: darkMode ? "#64748b" : "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {clients.slice(0, 5).map((c) => (
              <tr key={c.id} style={{ borderTop: `1px solid ${dm.border}` }}>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#3b82f6",
                      }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div
                        style={{ fontSize: 13.5, fontWeight: 600, color: dm.textSm }}
                      >
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: darkMode ? "#64748b" : "#94a3b8" }}>
                        {c.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 18px", fontSize: 13.5, color: dm.muted }}>
                  {c.company || "—"}
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {c.platforms.length === 0 ? (
                      <span style={{ fontSize: 12, color: "#cbd5e1" }}>—</span>
                    ) : (
                      c.platforms.slice(0, 2).map((p) => {
                        const cfg = PLATFORMS.find((pl) => pl.id === p);
                        return (
                          <span
                            key={p}
                            className="platform-pill"
                            style={{
                              background: cfg?.bg ?? (darkMode ? "#1e293b" : "#f8fafc"),
                              color: cfg?.color ?? "#64748b",
                              border: `1px solid ${cfg?.color ?? "#e2e8f0"}22`,
                            }}
                          >
                            <PlatformIcon id={p} size={11} />
                            {cfg?.label ?? p}
                          </span>
                        );
                      })
                    )}
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 18px",
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "#33496a",
                  }}
                >
                  {c.postsThisMonth}
                </td>
                <td
                  style={{ padding: "14px 18px", fontSize: 12.5, color: dm.muted }}
                >
                  {c.assignedSMM
                    ? team.find((t) => t.id === c.assignedSMM)?.name || "—"
                    : "—"}
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background:
                        c.status === "active" ? "#dcfce7" : "#f1f5f9",
                      color: c.status === "active" ? "#16a34a" : "#94a3b8",
                    }}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── CLIENTS TAB ───────────────────────────────────────────────────────────
  const ClientsTab = () => (
    <div style={{ maxWidth: 900 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: dm.text, margin: 0 }}>
            Total Clients
          </h1>
          <p style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 3 }}>
            {clients.length} clients registered
          </p>
        </div>
        <button
          onClick={() => setTab("add_client")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 18px",
            borderRadius: 10,
            background: "#33496a",
            color: "white",
            border: "none",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <UserPlus size={15} /> Add Client
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search
          size={15}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: darkMode ? "#64748b" : "#94a3b8",
          }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name, email or company..."
          style={{
            width: "100%",
            padding: "11px 14px 11px 40px",
            borderRadius: 12,
            border: `1.5px solid ${dm.borderMd}`,
            fontSize: 13.5,
            color: dm.inputText,
            background: dm.input,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filteredClients.map((c) => (
          <div
            key={c.id}
            style={{
              background: dm.card,
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${dm.border}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#3b82f6",
                    flexShrink: 0,
                  }}
                >
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{ fontSize: 15, fontWeight: 700, color: dm.textSm }}
                    >
                      {c.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background:
                          c.status === "active" ? "#dcfce7" : "#f1f5f9",
                        color: c.status === "active" ? "#16a34a" : "#94a3b8",
                      }}
                    >
                      {c.status}
                    </span>
                    <span style={{ fontSize: 11, color: "#cbd5e1" }}>
                      ID: {c.id}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: dm.muted,
                      marginTop: 2,
                    }}
                  >
                    {c.company}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 14,
                      marginTop: 8,
                    }}
                  >
                    {(
                      [
                        { icon: Mail, text: c.email },
                        { icon: Phone, text: c.phone || "—" },
                        { icon: Calendar, text: `Joined ${c.createdAt}` },
                      ] as { icon: React.ElementType; text: string }[]
                    ).map(({ icon: Icon, text }) => (
                      <span
                        key={text}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          color: darkMode ? "#64748b" : "#94a3b8",
                        }}
                      >
                        <Icon size={12} /> {text}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      marginTop: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {c.platforms.map((p) => {
                      const cfg = PLATFORMS.find((pl) => pl.id === p);
                      return (
                        <span
                          key={p}
                          className="platform-pill"
                          style={{
                            background: cfg?.bg ?? (darkMode ? "#1e293b" : "#f8fafc"),
                            color: cfg?.color ?? dm.muted,
                            border: `1px solid ${cfg?.color ?? dm.borderMd}22`,
                          }}
                        >
                          <PlatformIcon id={p} size={12} />
                          {cfg?.label ?? p}
                        </span>
                      );
                    })}
                  </div>
                  {c.budget && (
                    <div style={{ fontSize: 12, marginTop: 6, color: darkMode ? "#94a3b8" : "#64748b" }}>
                      Budget: <strong style={{ color: "#33496a" }}>{c.budget}</strong>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => { setEditClient(c); setEditClientNewPassword(""); }}
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    border: "1px solid #dbeafe", background: "#eff6ff",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button
                  onClick={() => {
                    setClients((cs) => cs.filter((x) => x.id !== c.id));
                    toast.success("Client removed");
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    border: "1px solid #fee2e2",
                    background: "#fff5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                <Trash2 size={15} color="#33496a" />
                </button>
              </div>
            </div>
            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: `1px solid ${dm.border}`,
              }}
            >
              <PwField
                password={c.password}
                id={c.id}
                show={!!showPasswords[c.id]}
                onToggle={togglePassword}
                onCopy={copyPw}
                  dm={dm}
                  darkMode={darkMode}
                />
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 10,
                  fontSize: 12.5,
                  color: darkMode ? "#64748b" : "#94a3b8",
                }}
              >
                <span>
                  Posts this month:{" "}
                  <strong style={{ color: "#33496a" }}>{c.postsThisMonth}</strong>
                </span>
                {c.assignedSMM && (
                  <span>
                    SMM:{" "}
                    <strong style={{ color: dm.text }}>
                      {team.find((t) => t.id === c.assignedSMM)?.name ||
                        c.assignedSMM}
                    </strong>
                  </span>
                )}
                {c.assignedDesigner && (
                  <span>
                    Designer:{" "}
                    <strong style={{ color: dm.text }}>
                      {team.find((t) => t.id === c.assignedDesigner)?.name ||
                        c.assignedDesigner}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "60px 0", color: darkMode ? "#64748b" : "#94a3b8" }}
          >
            <Building2
              size={40}
              style={{ margin: "0 auto 12px", opacity: 0.3 }}
            />
            <p style={{ fontSize: 14 }}>No clients found.</p>
          </div>
        )}
      </div>
    </div>
  );

  // ── TEAM LIST ─────────────────────────────────────────────────────────────
  interface TeamListProps {
    members: TeamMember[];
    roleLabel: string;
    accentColor: string;
    icon: React.ElementType;
    addTab: Tab;
  }

  const TeamList = ({
    members,
    roleLabel,
    accentColor,
    icon: Icon,
    addTab,
  }: TeamListProps) => {
    const filteredMembers = members.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div style={{ maxWidth: 900 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{ fontSize: 22, fontWeight: 800, color: dm.text, margin: 0 }}
            >
              {roleLabel}s
            </h1>
            <p style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 3 }}>
              {members.length} {roleLabel.toLowerCase()}s in team
            </p>
          </div>
          <button
            onClick={() => setTab(addTab)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 18px",
              borderRadius: 10,
              background:"#33496a",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <UserPlus size={15} /> Add {roleLabel}
          </button>
        </div>

        <div style={{ position: "relative", marginBottom: 20 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: darkMode ? "#64748b" : "#94a3b8",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${roleLabel.toLowerCase()}s...`}
            style={{
              width: "100%",
              padding: "11px 14px 11px 40px",
              borderRadius: 12,
              border: `1.5px solid ${dm.borderMd}`,
              fontSize: 13.5,
              color: dm.inputText,
              background: dm.input,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredMembers.map((m) => (
            <div
              key={m.id}
              style={{
                background: dm.card,
                borderRadius: 16,
                padding: 20,
                border: `1px solid ${dm.border}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: accentColor + "18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={accentColor} />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: dm.textSm,
                        }}
                      >
                        {m.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: accentColor + "18",
                          color: accentColor,
                        }}
                      >
                        {roleLabel}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background:
                            m.status === "active" ? "#dcfce7" : "#f1f5f9",
                          color:
                            m.status === "active" ? "#16a34a" : "#94a3b8",
                        }}
                      >
                        {m.status}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 14,
                        marginTop: 8,
                      }}
                    >
                      {(
                        [
                          { icon: Mail, text: m.email },
                          { icon: Phone, text: m.phone || "—" },
                          { icon: Calendar, text: `Joined ${m.createdAt}` },
                        ] as { icon: React.ElementType; text: string }[]
                      ).map(({ icon: Ico, text }) => (
                        <span
                          key={text}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            color: darkMode ? "#64748b" : "#94a3b8",
                          }}
                        >
                          <Ico size={12} /> {text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => { setEditMember(m); setEditMemberNewPassword(""); }}
                    style={{
                      width: 36, height: 36, borderRadius: 9,
                      border: "1px solid #dbeafe", background: "#eff6ff",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    onClick={() => {
                      setTeam((ts) => ts.filter((x) => x.id !== m.id));
                      toast.success("Member removed");
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      border: "1px solid #fee2e2",
                      background: "#fff5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={15} color="#33496a" />
                  </button>
                </div>
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${dm.border}`,
                }}
              >
                <PwField
                  password={m.password}
                  id={m.id}
                  show={!!showPasswords[m.id]}
                  onToggle={togglePassword}
                  onCopy={copyPw}
                  dm={dm}
                  darkMode={darkMode}
                />
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: darkMode ? "#64748b" : "#94a3b8",
              }}
            >
              <Icon
                size={40}
                style={{ margin: "0 auto 12px", opacity: 0.3 }}
              />
              <p style={{ fontSize: 14 }}>No {roleLabel.toLowerCase()}s found.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── ADD CLIENT TAB ────────────────────────────────────────────────────────
  const AddClientTab = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", password: "", budget: "" });
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    const togglePlatform = (id: string) =>
      setSelectedPlatforms((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
      const token = adminSession?.token || "";
      setLoading(true);
      // FIXED: pehle 'platforms' (jo admin ne checkbox se select kiya)
      // request body me include hi nahi hota tha — sirf locally UI me
      // dikhaya jaata tha, backend ko kabhi bheja hi nahi jaata tha.
      // Isi wajah se backend response me platforms hamesha khaali [] aata
      // tha, aur SMM ki Channels page me har client ke liye static/saare
      // platforms dikhte the (kyunki asal data hi missing tha).
      const body = { name: form.name, email: form.email, password: form.password, role: "Client", companyName: form.company, phoneNumber: form.phone, platforms: selectedPlatforms };
      const { error, data } = await apiAdminCreateUser(token, body);
      setLoading(false);
      if (error) { toast.error(error); return; }
      const newId = (data as any)?.data?.user?._id || "C" + generateId();
      cachePassword(newId, form.password);
      const nc: Client = {
        id: newId, name: form.name, email: form.email, phone: form.phone,
        company: form.company, password: form.password, budget: form.budget,
        industry: "", createdAt: new Date().toISOString().slice(0, 10),
        status: "active", platforms: selectedPlatforms, postsThisMonth: 0,
      };
      setClients((c) => [nc, ...c]);
      setTab("clients");
      toast.success("Client created!");
    };

    return (
      <div style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserPlus size={18} color="#3b82f6" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: dm.text }}>Add Client</h1>
          </div>
          <p style={{ color: darkMode ? "#64748b" : "#94a3b8", fontSize: 13.5 }}>Create a client account and set their login credentials.</p>
        </div>

        <div style={{ background: dm.card, borderRadius: 18, padding: 28, border: `1px solid ${dm.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Full Name *</label>
              <input type="text" name="new_client_name" autoComplete="off" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" required style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Email Address *</label>
              <input type="email" name="new_client_email" autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@company.com" required style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Phone Number</label>
              <input type="text" name="new_client_phone" autoComplete="off" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Company Name</label>
              <input type="text" name="new_client_company" autoComplete="off" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company Pvt. Ltd." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Budget</label>
              <input type="text" name="new_client_budget" autoComplete="off" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. ₹50,000 / month" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Platforms</label>
              <div className="platform-selector__grid">
                {PLATFORMS.map((p) => {
                  const selected = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`platform-selector__chip ${selected ? "platform-selector__chip--selected" : "platform-selector__chip--unselected"}`}
                      style={selected ? {} : { borderColor: dm.borderMd, background: dm.input, color: dm.muted }}
                    >
                      <PlatformIcon id={p.id} size={13} />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 6 }}>Password *</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} name="new_client_password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" required style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: `1.5px solid ${dm.borderMd}`, fontSize: 14, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                  {showPw ? <Eye size={15} color="#94a3b8" /> : <EyeOff size={15} color="#94a3b8" />}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: "11px", borderRadius: 10, background: loading ? "#e2e8f0" : "linear-gradient(135deg, #3b82f6, #2563eb)", color: loading ? "#94a3b8" : "white", border: "none", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
                Add Client
              </button>
              <button type="button" onClick={() => setTab("overview")} style={{ padding: "11px 20px", borderRadius: 10, background: dm.input, border: `1.5px solid ${dm.borderMd}`, color: dm.inputText, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ── WORKSPACE TAB ─────────────────────────────────────────────────────────

  // ── PROFILE TAB ───────────────────────────────────────────────────────────
  const ProfileTab = () => {
    const [cpForm, setCpForm] = useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    const [cpLoading, setCpLoading] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !cpForm.oldPassword ||
        !cpForm.newPassword ||
        !cpForm.confirmPassword
      ) {
        toast.error("Please fill all fields");
        return;
      }
      if (cpForm.newPassword !== cpForm.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (cpForm.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        return;
      }
      const token = adminSession?.token || "";
      setCpLoading(true);
      const { error, data } = await apiAdminChangePassword(
        token,
        cpForm.oldPassword,
        cpForm.newPassword,
        cpForm.confirmPassword
      );
      setCpLoading(false);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success((data as any)?.message || "Password changed successfully!");
      setCpForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    return (
      <div style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{ fontSize: 22, fontWeight: 800, color: dm.text, margin: 0 }}
          >
            Admin Profile
          </h1>
          <p style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: dm.card,
            borderRadius: 18,
            padding: 28,
            border: `1px solid ${dm.border}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
             
              gap: 20,
              paddingBottom: 24,
              borderBottom: `1px solid ${dm.border}`,
              marginBottom: 24,
            }}
          >
            {/* Profile Image — Option 2: badge corner + text links */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              {/* Avatar with pencil badge */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleUploadImage}
                />
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    background: profileImage ? "transparent" : "#33496a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    fontWeight: 800,
                    color: "white",
                    overflow: "hidden",
                    border: profileImage ? `2px solid ${dm.border}` : "none",
                  }}
                >
                  {profileImage
                    ? <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : (adminSession?.name || "A").charAt(0).toUpperCase()}
                </div>
                {/* Pencil badge bottom-right */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imgUploading}
                  title="Change profile photo"
                  style={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "#33496a",
                    border: `2px solid ${darkMode ? "#1e293b" : "white"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: imgUploading ? "not-allowed" : "pointer",
                    opacity: imgUploading ? 0.7 : 1,
                    padding: 0,
                  }}
                >
                  {imgUploading
                    ? <Loader2 size={11} color="white" style={{ animation: "spin 1s linear infinite" }} />
                    : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  }
                </button>
              </div>

              {/* Name / email / badge / text links */}
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: dm.text }}>
                  {adminSession?.name || "Admin"}
                </div>
                <div style={{ fontSize: 13.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 3 }}>
                  {adminSession?.email || ""}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "#33496a",
                    color: "white",
                    display: "inline-block",
                    marginTop: 8,
                  }}
                >
                  Super Admin
                </span>

                {/* Change photo / Remove text links */}
                <div style={{ gap: 14, marginTop: 12 }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imgUploading}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#33496a",
                      cursor: imgUploading ? "not-allowed" : "pointer",
                      opacity: imgUploading ? 0.6 : 1,
                    }}
                  >
                    {imgUploading ? "Uploading…" : "Change photo"}
                  </button>
                  {profileImage && (
                    <>
                      <span style={{ width: 1, height: 12, background: darkMode ? "#334155" : "#e2e8f0", display: "inline-block" }} />
                      <button
                        onClick={handleRemoveImage}
                        disabled={imgUploading}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: darkMode ? "#64748b" : "#94a3b8",
                          cursor: imgUploading ? "not-allowed" : "pointer",
                          opacity: imgUploading ? 0.6 : 1,
                        }}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

          {(
            [
              { label: "Full Name", value: adminSession?.name || "Admin", icon: User },
              { label: "Email Address", value: adminSession?.email || "", icon: Mail },
              { label: "Role", value: "Administrator", icon: ShieldCheck },
            ] as { label: string; value: string; icon: React.ElementType }[]
          ).map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: `1px solid ${dm.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: 180,
                }}
              >
                <Icon size={15} color="#94a3b8" />
                <span
                  style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", fontWeight: 500 }}
                >
                  {label}
                </span>
              </div>
              <span
                style={{ fontSize: 13.5, color: dm.textSm, fontWeight: 600 }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Change Password */}
        <div
          style={{
            background: dm.card,
            borderRadius: 18,
            padding: 28,
            border: `1px solid ${dm.border}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            marginBottom: 20,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: dm.text,
                margin: 0,
              }}
            >
              Change Password
            </h2>
            <p style={{ fontSize: 12.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
              Update your admin account password.
            </p>
          </div>

          <form
            onSubmit={handleChangePassword}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div>
              <label
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: dm.textSm,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Current Password
              </label>
              <div style={{ position: "relative" }}>
                <Input
                  type={showOld ? "text" : "password"}
                  value={cpForm.oldPassword}
                  onChange={(e) =>
                    setCpForm((f) => ({ ...f, oldPassword: e.target.value }))
                  }
                  placeholder="Enter current password"
                  required
                  style={{ paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowOld((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: darkMode ? "#64748b" : "#94a3b8",
                  }}
                >
                  {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: dm.textSm,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <Input
                  type={showNew ? "text" : "password"}
                  value={cpForm.newPassword}
                  onChange={(e) =>
                    setCpForm((f) => ({ ...f, newPassword: e.target.value }))
                  }
                  placeholder="Min 8 characters"
                  required
                  style={{ paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: darkMode ? "#64748b" : "#94a3b8",
                  }}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: dm.textSm,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Confirm New Password
              </label>
              <Input
                type="password"
                value={cpForm.confirmPassword}
                onChange={(e) =>
                  setCpForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                placeholder="Repeat new password"
                required
                
              />
         
            </div>
              
            <Button
              type="submit"
              disabled={cpLoading}
              style={{
                alignSelf: "flex-start",
                background: "#33496a",
                color: "white",
                border: "none",
                padding: "10px 24px",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: cpLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {cpLoading && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Update Password
            </Button>
          </form>
        </div>

        {/* Stats */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <div
            style={{
              background: dm.card,
              borderRadius: 14,
              padding: "18px 20px",
              border: `1px solid ${dm.border}`,
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: 28, fontWeight: 800, color: "#f97316" }}
            >
              {clients.length}
            </div>
            <div style={{ fontSize: 12.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
              Total Clients Managed
            </div>
          </div>
          <div
            style={{
              background: dm.card,
              borderRadius: 14,
              padding: "18px 20px",
              border: `1px solid ${dm.border}`,
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: 28, fontWeight: 800, color: "#8b5cf6" }}
            >
              {team.length}
            </div>
            <div style={{ fontSize: 12.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
              Team Members
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  if (!authChecked || !adminSession) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: darkMode ? "#0f172a" : "#f8fafc",
      }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={32} color="#33496a" style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: 12, color: "#94a3b8", fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Inter', sans-serif",
        background: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "#f1f5f9" : "#0f172a",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSideOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
            }}
            onClick={() => setMobileSideOpen(false)}
          />
          <div
            style={{
              position: "relative",
              width: 240,
              background: dm.card,
              height: "100%",
              overflowY: "auto",
              zIndex: 51,
            }}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        {/* Topbar */}
        <div
          style={{
            background: dm.card,
            borderBottom: `1px solid ${dm.border}`,
            padding: "0 24px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="md:hidden"
              onClick={() => setMobileSideOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <Menu size={22} color="#64748b" />
            </button>
            <div style={{ fontSize: 13.5, color: darkMode ? "#64748b" : "#94a3b8" }}>
              <span style={{ color: "#33496a", fontWeight: 600 }}>Admin</span>
              {" / "}
              <span style={{ fontWeight: 600, color: dm.textSm }}>
                {navItems.find((n) => n.id === tab)?.label || tab}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: `1px solid ${dm.border}`,
                background: dm.bellBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Bell size={17} color={dm.muted} />
            </button>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: `1px solid ${dm.border}`,
                background: darkMode ? "#1e293b" : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {darkMode
                ? <Sun size={17} color="#33496a" />
                : <Moon size={17} color="#64748b" />}
            </button>
            {/* Avatar — click to go to Profile tab */}
            <button
              onClick={() => setTab("profile")}
              title="View Profile"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: profileImage ? "transparent" : "#33496a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "white",
                border: "none",
                cursor: "pointer",
                overflow: "hidden",
                padding: 0,
              }}
            >
              {profileImage
                ? <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : (adminSession?.name || "A").charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            padding: "28px 28px 40px",
            overflowY: "auto",
            background: dm.bg,
          }}
        >
          {tab === "overview" && <OverviewTab />}
          {tab === "clients" && <ClientsTab />}
          {tab === "smm" && (
            <TeamList
              members={smm}
              roleLabel="SMM Executive"
              accentColor="#33496a"
              icon={Megaphone}
              addTab="add_smm"
            />
          )}
          {tab === "gd" && (
            <TeamList
              members={gd}
              roleLabel="Graphic Designer"
              accentColor="#8b5cf6"
              icon={Palette}
              addTab="add_gd"
            />
          )}
          {tab === "workspace" && (
              <div style={{ maxWidth: 900 }}>
                <div style={{ marginBottom: 28 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: dm.text, margin: 0 }}>
                    Workspace
                  </h1>
                  <p style={{ fontSize: 13, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 4 }}>
                    Overview of client–team assignments and active work.
                  </p>
                </div>
          
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                    marginBottom: 24,
                  }}
                >
                  {/* Client Assignments */}
                  <div
                    style={{
                      background: dm.card,
                      borderRadius: 18,
                      padding: 22,
                      border: `1px solid ${dm.border}`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: dm.text,
                        marginBottom: 16,
                      }}
                    >
                      Client Assignments
                    </h3>
                    {clients.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 0",
                          borderBottom: `1px solid ${dm.border}`,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 9,
                            background: "#eff6ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#3b82f6",
                          }}
                        >
                          {c.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: dm.textSm }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: darkMode ? "#64748b" : "#94a3b8" }}>{c.company}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#33496a", fontWeight: 600 }}>
                            {c.postsThisMonth} posts
                          </div>
                          <div style={{ fontSize: 10.5, color: darkMode ? "#64748b" : "#94a3b8" }}>
                            {c.platforms.join(", ") || "No platforms"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
          
                  {/* Team Status */}
                  <div
                    style={{
                      background: dm.card,
                      borderRadius: 18,
                      padding: 22,
                      border: `1px solid ${dm.border}`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: dm.text,
                        marginBottom: 16,
                      }}
                    >
                      Team Status
                    </h3>
                    {team.map((m) => {
                      const color = m.role === "smm" ? "#f97316" : "#8b5cf6";
                      const MemberIcon = m.role === "smm" ? Megaphone : Palette;
                      return (
                        <div
                          key={m.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "10px 0",
                            borderBottom: `1px solid ${dm.border}`,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 9,
                              background: color + "18",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MemberIcon size={16} color={color} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: dm.textSm }}>
                              {m.name}
                            </div>
                            <div style={{ fontSize: 11.5, color: darkMode ? "#64748b" : "#94a3b8" }}>
                              {m.role === "smm" ? "SMM Executive" : "Graphic Designer"}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "2px 9px",
                              borderRadius: 20,
                              background: m.status === "active" ? "#dcfce7" : "#f1f5f9",
                              color: m.status === "active" ? "#16a34a" : "#94a3b8",
                            }}
                          >
                            {m.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
          
                {/* Posts Summary Chart */}
                <div
                  style={{
                    background: dm.card,
                    borderRadius: 18,
                    padding: 22,
                    border: `1px solid ${dm.border}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: dm.text,
                      marginBottom: 16,
                    }}
                  >
                    Monthly Posts Summary
                  </h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={clients.map((c) => ({
                        name: c.company || c.name,
                        posts: c.postsThisMonth,
                      }))}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 10,
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="posts" fill="#f97316" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
          
                {/* Project Details List */}
                <div
                  style={{
                    background: dm.card,
                    borderRadius: 18,
                    padding: 22,
                    border: `1px solid ${dm.border}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    marginTop: 20,
                  }}
                >
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: dm.text, marginBottom: 16 }}>
                    Project Details
                  </h3>
                  {!Array.isArray(projects) || projects.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 0", color: darkMode ? "#64748b" : "#94a3b8" }}>
                      <FolderOpen size={36} style={{ margin: "0 auto 10px", opacity: 0.3 }} />
                      <p style={{ fontSize: 13 }}>No projects found.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {projects.map((p: any, i: number) => {
                        const statusColor: Record<string, string> = {
                          pending: "#f59e0b",
                          "in-progress": "#3b82f6",
                          completed: "#16a34a",
                          approved: "#16a34a",
                          revision: "#ef4444",
                        };
                        const status = p.status || p.projectStatus || "pending";
                        const color = statusColor[status.toLowerCase()] || "#94a3b8";
                        return (
                          <div
                            key={p._id || i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px 14px",
                              borderRadius: 12,
                              background: darkMode ? "#0f172a" : "#f8fafc",
                              border: `1px solid ${dm.border}`,
                              flexWrap: "wrap",
                              gap: 10,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#33496a18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FolderOpen size={16} color="#33496a" />
                              </div>
                              <div>
                                <div style={{ fontSize: 13.5, fontWeight: 700, color: dm.textSm }}>
                                  {p.title || p.projectTitle || p.name || `Project #${i + 1}`}
                                </div>
                                <div style={{ fontSize: 11.5, color: darkMode ? "#64748b" : "#94a3b8", marginTop: 2 }}>
                                  {p.clientName || p.client?.name || ""}
                                  {p.assignedTo && ` · Designer: ${p.assignedTo?.name || p.assignedTo}`}
                                  {p.createdAt && ` · ${String(p.createdAt).slice(0, 10)}`}
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: color + "18", color }}>
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
          )}
          {tab === "profile" && <ProfileTab />}
          {tab === "add_client" && <AddClientTab />}
          {tab === "add_smm" && (
            <AddMemberForm
              role="smm"
              onAdd={async (m) => {
                const token = adminSession?.token || "";
                const body = {
                  name: m.name,
                  email: m.email,
                  password: m.password,
                  role: "SMM",
                  phoneNumber: m.phone,
                };
                const { error, data } = await apiAdminCreateUser(token, body);
                if (error) {
                  toast.error(error);
                  return;
                }
                const newId =
                  (data as any)?.data?.user?._id || m.id;
                cachePassword(newId, m.password);
                setTeam((t) => [{ ...m, id: newId }, ...t]);
                setTab("smm");
                toast.success("SMM Executive created!");
              }}
              onCancel={() => setTab("smm")}
              dm={dm}
              darkMode={darkMode}
            />
          )}
          {tab === "add_gd" && (
            <AddMemberForm
              role="graphic_designer"
              onAdd={async (m) => {
                const token = adminSession?.token || "";
                const body = {
                  name: m.name,
                  email: m.email,
                  password: m.password,
                  role: "Graphic Designer",
                  phoneNumber: m.phone,
                };
                const { error, data } = await apiAdminCreateUser(token, body);
                if (error) {
                  toast.error(error);
                  return;
                }
                const newId =
                  (data as any)?.data?.user?._id || m.id;
                cachePassword(newId, m.password);
                setTeam((t) => [{ ...m, id: newId }, ...t]);
                setTab("gd");
                toast.success("Graphic Designer created!");
              }}
              onCancel={() => setTab("gd")}
              dm={dm}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>

      {/* ── Edit Client Modal ───────────────────────────────────────────── */}
      {editClient && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => { setEditClient(null); setEditClientNewPassword(""); }}>
          {/* FIXED: modal ki height fixed nahi thi, isliye content zyada
              hone par popup viewport se bahar chala jaata tha aur neeche
              wale "Save Changes" / "Cancel" buttons tak scroll/click nahi
              ho paata tha. Ab maxHeight + internal scroll add kiya hai
              taaki poora popup screen ke andar hi rahe aur buttons hamesha
              click karne layak hon. */}
          <div style={{ background: darkMode ? "#1e293b" : "white", borderRadius: 18, padding: 22, width: "100%", maxWidth: 480, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: `1px solid ${dm.border}` }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: dm.text, marginBottom: 14, flexShrink: 0 }}>Edit Client</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingRight: 4 }}>
              {([
                { label: "Full Name *", key: "name", type: "text", placeholder: "Priya Sharma" },
                { label: "Email *", key: "email", type: "email", placeholder: "client@company.com" },
                { label: "Phone", key: "phone", type: "text", placeholder: "+91 98765 43210" },
                { label: "Company", key: "company", type: "text", placeholder: "Company Pvt. Ltd." },
                { label: "Budget", key: "budget", type: "text", placeholder: "₹50,000 / month" },
              ] as { label: string; key: keyof Client; type: string; placeholder: string }[]).map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>{label}</label>
                  <input
                    type={type}
                    value={(editClient[key] as string) || ""}
                    onChange={(e) => setEditClient({ ...editClient, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${dm.borderMd}`, fontSize: 13.5, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>
                  Reset Password <span style={{ fontWeight: 400, color: darkMode ? "#64748b" : "#94a3b8" }}>(leave blank to keep current password)</span>
                </label>
                <input
                  type="text"
                  value={editClientNewPassword}
                  onChange={(e) => setEditClientNewPassword(e.target.value)}
                  placeholder="Set a new password"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${dm.borderMd}`, fontSize: 13.5, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>Platforms</label>
                <div className="platform-selector__grid">
                  {PLATFORMS.map((p) => {
                    const selected = (editClient.platforms ?? []).includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          setEditClient({
                            ...editClient,
                            platforms: selected
                              ? (editClient.platforms ?? []).filter((pid) => pid !== p.id)
                              : [...(editClient.platforms ?? []), p.id],
                          })
                        }
                        className={`platform-selector__chip ${selected ? "platform-selector__chip--selected" : "platform-selector__chip--unselected"}`}
                        style={selected ? {} : { borderColor: dm.borderMd, background: dm.input, color: dm.muted }}
                      >
                        <PlatformIcon id={p.id} size={13} />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexShrink: 0 }}>
              <button
                disabled={editClientSaving}
                onClick={async () => {
                  setEditClientSaving(true);
                  const { error } = await apiAdminUpdateUser(adminSession?.token || "", editClient.id, {
                    name: editClient.name,
                    email: editClient.email,
                    phoneNumber: editClient.phone,
                    companyName: editClient.company,
                    budget: editClient.budget,
                    platforms: editClient.platforms,
                  });
                  if (error) {
                    setEditClientSaving(false);
                    toast.error("Update failed: " + error);
                    return;
                  }
                  // FIXED: agar admin ne "Reset Password" field me kuch
                  // likha hai, to backend par naya password set karo aur
                  // usse turant local cache me bhi save karo — taaki eye
                  // button ab is client ke liye real password dikha sake
                  // (pehle purane/pehle-se-bane users ke liye password
                  // hamesha "hidden dots" hi dikhta tha kyunki unka real
                  // password kabhi bhi is browser ko pata nahi tha).
                  let updatedPassword = editClient.password;
                  if (editClientNewPassword.trim()) {
                    const pwRes = await apiAdminChangeUserPassword(
                      adminSession?.token || "",
                      editClient.id,
                      editClientNewPassword.trim(),
                      editClientNewPassword.trim()
                    );
                    if (pwRes.error) {
                      setEditClientSaving(false);
                      toast.error("Password reset failed: " + pwRes.error);
                      return;
                    }
                    updatedPassword = editClientNewPassword.trim();
                    cachePassword(editClient.id, updatedPassword);
                  }
                  setEditClientSaving(false);
                  setClients((cs) => cs.map((c) => c.id === editClient.id ? { ...editClient, password: updatedPassword } : c));
                  setEditClientNewPassword("");
                  setEditClient(null);
                  toast.success("Client updated!");
                }}
                style={{ flex: 1, padding: "10px", borderRadius: 10, background: editClientSaving ? "#93c5fd" : "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: editClientSaving ? "not-allowed" : "pointer" }}
              >{editClientSaving ? "Saving..." : "Save Changes"}</button>
              <button onClick={() => { setEditClient(null); setEditClientNewPassword(""); }} style={{ padding: "10px 20px", borderRadius: 10, background: dm.input, border: `1.5px solid ${dm.borderMd}`, color: dm.inputText, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Member Modal ───────────────────────────────────────────── */}
      {editMember && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => { setEditMember(null); setEditMemberNewPassword(""); }}>
          <div style={{ background: darkMode ? "#1e293b" : "white", borderRadius: 18, padding: 22, width: "100%", maxWidth: 480, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: `1px solid ${dm.border}` }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: dm.text, marginBottom: 14, flexShrink: 0 }}>Edit {editMember.role === "smm" ? "SMM Executive" : "Graphic Designer"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingRight: 4 }}>
              {([
                { label: "Full Name *", key: "name", type: "text", placeholder: "Karan Mehta" },
                { label: "Email *", key: "email", type: "email", placeholder: "karan@agency.com" },
                { label: "Phone", key: "phone", type: "text", placeholder: "+91 98765 43210" },
              ] as { label: string; key: keyof TeamMember; type: string; placeholder: string }[]).map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>{label}</label>
                  <input
                    type={type}
                    value={(editMember[key] as string) || ""}
                    onChange={(e) => setEditMember({ ...editMember, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${dm.borderMd}`, fontSize: 13.5, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>Status</label>
                <select
                  value={editMember.status}
                  onChange={(e) => setEditMember({ ...editMember, status: e.target.value as "active" | "inactive" })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${dm.borderMd}`, fontSize: 13.5, color: dm.textSm, outline: "none", background: dm.input }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: darkMode ? "#94a3b8" : "#475569", display: "block", marginBottom: 5 }}>
                  Reset Password <span style={{ fontWeight: 400, color: darkMode ? "#64748b" : "#94a3b8" }}>(leave blank to keep current password)</span>
                </label>
                <input
                  type="text"
                  value={editMemberNewPassword}
                  onChange={(e) => setEditMemberNewPassword(e.target.value)}
                  placeholder="Set a new password"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${dm.borderMd}`, fontSize: 13.5, color: dm.textSm, outline: "none", boxSizing: "border-box", background: dm.input }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexShrink: 0 }}>
              <button
                disabled={editMemberSaving}
                onClick={async () => {
                  setEditMemberSaving(true);
                  const { error } = await apiAdminUpdateUser(adminSession?.token || "", editMember.id, {
                    name: editMember.name,
                    email: editMember.email,
                    phoneNumber: editMember.phone,
                    status: editMember.status,
                  });
                  if (error) {
                    setEditMemberSaving(false);
                    toast.error("Update failed: " + error);
                    return;
                  }
                  // FIXED: agar admin ne "Reset Password" field bhara hai,
                  // to naya password backend par set karo aur local cache
                  // me bhi save karo, taaki eye button ab real password
                  // dikha sake (purane users ke liye pehle hamesha masked
                  // dots hi dikhte the).
                  let updatedPassword = editMember.password;
                  if (editMemberNewPassword.trim()) {
                    const pwRes = await apiAdminChangeUserPassword(
                      adminSession?.token || "",
                      editMember.id,
                      editMemberNewPassword.trim(),
                      editMemberNewPassword.trim()
                    );
                    if (pwRes.error) {
                      setEditMemberSaving(false);
                      toast.error("Password reset failed: " + pwRes.error);
                      return;
                    }
                    updatedPassword = editMemberNewPassword.trim();
                    cachePassword(editMember.id, updatedPassword);
                  }
                  setEditMemberSaving(false);
                  setTeam((ts) => ts.map((t) => t.id === editMember.id ? { ...editMember, password: updatedPassword } : t));
                  setEditMemberNewPassword("");
                  setEditMember(null);
                  toast.success("Member updated!");
                }}
                style={{ flex: 1, padding: "10px", borderRadius: 10, background: editMemberSaving ? "#93c5fd" : "linear-gradient(135deg, #33496a, #1e3a5f)", color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: editMemberSaving ? "not-allowed" : "pointer" }}
              >{editMemberSaving ? "Saving..." : "Save Changes"}</button>
              <button onClick={() => { setEditMember(null); setEditMemberNewPassword(""); }} style={{ padding: "10px 20px", borderRadius: 10, background: dm.input, border: `1.5px solid ${dm.borderMd}`, color: dm.inputText, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
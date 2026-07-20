import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard, FolderOpen, Calendar, Bell, LogOut,
  CheckCircle2, Clock, Eye, RefreshCw, Search, Filter,
  ChevronRight, Download, X, Loader2, User,
  ThumbsUp, ThumbsDown, Image, FileText, AlertCircle,
  Building2, Instagram, Facebook, Twitter, ArrowUpRight,
  CalendarDays, Layers, Star, BarChart2, Globe, Zap,
  MessageSquare
} from "lucide-react";
import { clearSession, getSession, BASE_URL } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type ClientView = "overview" | "projects" | "calendar" | "notifications";
type ProjectStatus = "Pending" | "In Progress" | "Under Review" | "Revision" | "Completed" | "Cancelled";

interface DesignFile {
  _id: string;
  fileName: string;
  fileType: "Draft" | "Final";
  fileUrl: string;
  version: number;
  uploadedAt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  designType: string;
  status: ProjectStatus;
  priority: "Low" | "Medium" | "High" | "Urgent";
  deadline: string;
  createdAt: string;
  progressPercentage?: number;
  designFiles?: DesignFile[];
  revisionInfo?: { used: number; limit: number; remaining: number };
  clientApproval?: { action: string; feedback: string; reviewedAt: string };
  assignedBy?: { name?: string };
  designer?: { name?: string };
}

interface DashboardStats {
  totalProjects: number;
  pendingReview: number;
  approvedProjects: number;
  completedProjects: number;
}

interface Post {
  _id: string;
  content: string;
  platforms: string[];
  status: string;
  scheduledAt?: string;
  createdAt: string;
  media?: string[];
}

interface NotificationItem {
  _id: string;
  event?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── API Helper ───────────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_API_KEY || "sf_live_a7k92mXpQ3nR8vTz5wYdJ6bLcU1eHi4o";

async function clientRequest<T = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  token: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
      "x-api-key": API_KEY,
    };
    if (method !== "GET" && body) headers["Content-Type"] = "application/json";
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("sf_session");
        localStorage.removeItem("socialflow_role");
        localStorage.removeItem("socialflow_user_name");
        window.location.href = "/user-login";
      }
      return { data: null, error: json?.message || json?.msg || json?.error || `Error ${res.status}` };
    }
    if (json?.success === false) return { data: null, error: json?.message || json?.msg || "Request failed" };
    return { data: json as T, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  "Pending":      { label: "Pending",        bg: "#f8fafc", text: "#64748b", border: "#e2e8f0", dot: "#94a3b8" },
  "In Progress":  { label: "In Progress",    bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe", dot: "#3b82f6" },
  "Under Review": { label: "Under Review",   bg: "#fefce8", text: "#ca8a04", border: "#fde68a", dot: "#eab308" },
  "Revision":     { label: "Revision",       bg: "#fff7ed", text: "#ea580c", border: "#fed7aa", dot: "#f97316" },
  "Completed":    { label: "Completed",      bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", dot: "#22c55e" },
  "Cancelled":    { label: "Cancelled",      bg: "#f8fafc", text: "#94a3b8", border: "#e2e8f0", dot: "#cbd5e1" },
};

const priorityConfig: Record<string, { bg: string; text: string; dot: string }> = {
  High:   { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
  Urgent: { bg: "#fff1f2", text: "#be123c", dot: "#e11d48" },
  Medium: { bg: "#fffbeb", text: "#d97706", dot: "#f59e0b" },
  Low:    { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
};

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram, facebook: Facebook, twitter: Twitter,
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
const ClientLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0ea5e9, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(14,165,233,0.4)" }}>
      <Building2 size={18} color="white" />
    </div>
    <div style={{ lineHeight: 1 }}>
      <div style={{ fontFamily: "'Syne', 'Poppins', sans-serif", fontWeight: 800, fontSize: 14, color: "#0f172a", letterSpacing: "-0.3px" }}>
        Social<span style={{ color: "#0ea5e9" }}>Flow</span>
      </div>
      <div style={{ fontSize: 9.5, color: "#38bdf8", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginTop: 1 }}>Client Portal</div>
    </div>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, bg, sub }: {
  label: string; value: number | string; icon: React.ElementType; color: string; bg: string; sub?: string;
}) => (
  <div style={{ background: "white", borderRadius: 16, padding: "20px 22px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </div>
      {sub && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#22c55e" }}><ArrowUpRight size={14} />{sub}</div>}
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] || { label: status, bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0", dot: "#94a3b8" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }: { priority: string }) => {
  const cfg = priorityConfig[priority] || { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.text, padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {priority}
    </span>
  );
};

// ─── Review Modal ──────────────────────────────────────────────────────────────
const ReviewModal = ({ project, token, onClose, onSuccess }: {
  project: Project; token: string; onClose: () => void; onSuccess: () => void;
}) => {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!action) return toast.error("Approve ya Reject karo pehle");
    if (!feedback.trim()) return toast.error("Feedback zaroor dena hai");
    setLoading(true);
    const { error } = await clientRequest(
      `/api/client/design-projects/${project._id}/review`,
      "PATCH",
      token,
      { action, feedback }
    );
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success(action === "approve" ? "Design approve kar diya! 🎉" : "Design reject kar diya, GD ko notification chali gayi");
    onSuccess();
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 500, boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Review Design</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{project.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <button onClick={() => setAction("approve")} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${action === "approve" ? "#16a34a" : "#e2e8f0"}`, background: action === "approve" ? "#f0fdf4" : "white", color: action === "approve" ? "#16a34a" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.15s" }}>
            <ThumbsUp size={16} /> Approve
          </button>
          <button onClick={() => setAction("reject")} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${action === "reject" ? "#dc2626" : "#e2e8f0"}`, background: action === "reject" ? "#fef2f2" : "white", color: action === "reject" ? "#dc2626" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.15s" }}>
            <ThumbsDown size={16} /> Reject
          </button>
        </div>

        {/* Feedback */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {action === "approve" ? "Approval Note" : action === "reject" ? "Rejection Reason (Kya change chahiye?)" : "Your Feedback"}
          </label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder={action === "approve" ? "e.g. Bilkul sahi hai! Bahut achha bana hai." : action === "reject" ? "e.g. Color thoda dark chahiye, font size bada karo..." : "Apna feedback dein..."}
            style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1.5px solid ${action === "approve" ? "#bbf7d0" : action === "reject" ? "#fecaca" : "#e2e8f0"}`, fontSize: 13, outline: "none", resize: "vertical", minHeight: 100, boxSizing: "border-box", lineHeight: 1.6, color: "#334155" }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Cancel</button>
          <button onClick={submit} disabled={loading || !action || !feedback.trim()} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: !action || !feedback.trim() ? "#e2e8f0" : action === "approve" ? "linear-gradient(135deg, #16a34a, #22c55e)" : "linear-gradient(135deg, #dc2626, #ef4444)", color: !action || !feedback.trim() ? "#94a3b8" : "white", cursor: !action || !feedback.trim() ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, boxShadow: action && feedback.trim() ? "0 4px 14px rgba(0,0,0,0.15)" : "none" }}>
            {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Loader2 size={14} className="animate-spin" /> Submitting...</span> : action === "approve" ? "✅ Approve Design" : action === "reject" ? "❌ Reject Design" : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Project Detail Panel ─────────────────────────────────────────────────────
const ProjectDetailPanel = ({ project, token, onReview, onClose }: {
  project: Project; token: string; onReview: (p: Project) => void; onClose: () => void;
}) => {
  const [detail, setDetail] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await clientRequest<any>(`/api/client/design-projects/${project._id}`, "GET", token);
      setLoading(false);
      if (data) setDetail(data?.data?.project || data?.project || data?.data);
    })();
  }, [project._id, token]);

  const p = detail || project;

  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "auto", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", height: "100%" }}>
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#94a3b8" }}><Loader2 size={28} className="animate-spin" /></div>
      ) : (
        <div style={{ maxWidth: 620 }}>
          {/* Header */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, color: "#0ea5e9", background: "#f0f9ff", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{p.designType}</span>
              <PriorityBadge priority={p.priority} />
              <StatusBadge status={p.status} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", lineHeight: 1.2, margin: "0 0 6px" }}>{p.title}</h2>
            <div style={{ fontSize: 12.5, color: "#94a3b8" }}>Created {new Date(p.createdAt).toLocaleDateString()} · Deadline {new Date(p.deadline).toLocaleDateString()}</div>
          </div>

          {/* Under Review Banner — Main Action */}
          {p.status === "Under Review" && (
            <div style={{ background: "linear-gradient(135deg, #fefce8, #fffbeb)", borderRadius: 14, padding: "18px 20px", border: "2px solid #fde68a", marginBottom: 20, boxShadow: "0 4px 16px rgba(234,179,8,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Eye size={20} color="#ca8a04" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#92400e" }}>Design Ready for Review! 🎨</div>
                  <div style={{ fontSize: 12.5, color: "#78350f", marginTop: 2 }}>GD ne design submit kar diya hai — aapka feedback chahiye</div>
                </div>
                <button onClick={() => onReview(p)} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #ca8a04, #d97706)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(202,138,4,0.35)" }}>
                  Review Now
                </button>
              </div>
            </div>
          )}

          {/* Approval Result */}
          {p.clientApproval && (
            <div style={{ background: p.clientApproval.action === "approve" ? "#f0fdf4" : "#fef2f2", borderRadius: 12, padding: "14px 16px", border: `1px solid ${p.clientApproval.action === "approve" ? "#bbf7d0" : "#fecaca"}`, marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                {p.clientApproval.action === "approve" ? <ThumbsUp size={16} color="#16a34a" /> : <ThumbsDown size={16} color="#dc2626" />}
                <span style={{ fontSize: 12.5, fontWeight: 700, color: p.clientApproval.action === "approve" ? "#16a34a" : "#dc2626" }}>
                  {p.clientApproval.action === "approve" ? "Aapne Approve Kiya" : "Aapne Reject Kiya"}
                </span>
                <span style={{ fontSize: 11.5, color: "#94a3b8", marginLeft: "auto" }}>{new Date(p.clientApproval.reviewedAt).toLocaleDateString()}</span>
              </div>
              <p style={{ fontSize: 13, color: p.clientApproval.action === "approve" ? "#166534" : "#991b1b", margin: 0, lineHeight: 1.5 }}>{p.clientApproval.feedback}</p>
            </div>
          )}

          {/* Info Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
            {[
              { label: "Design Type", value: p.designType },
              { label: "Deadline", value: new Date(p.deadline).toLocaleDateString() },
              ...(p.assignedBy ? [{ label: "SMM Manager", value: p.assignedBy.name || "—" }] : []),
              ...(p.designer ? [{ label: "Designer", value: p.designer.name || "—" }] : []),
              ...(p.revisionInfo ? [{ label: "Revisions Used", value: `${p.revisionInfo.used} / ${p.revisionInfo.limit}` }] : []),
            ].map(item => (
              <div key={item.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px", border: "1px solid #f1f5f9", marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Project Description</div>
            <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.7, margin: 0 }}>{p.description}</p>
          </div>

          {/* Final Design Files */}
          {detail?.designFiles && detail.designFiles.filter(f => f.fileType === "Final").length > 0 && (
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "14px 16px", border: "1px solid #bbf7d0", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>
                Final Design Files ({detail.designFiles.filter(f => f.fileType === "Final").length})
              </div>
              {detail.designFiles.filter(f => f.fileType === "Final").map(file => (
                <div key={file._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "white", borderRadius: 8, marginBottom: 7, border: "1px solid #d1fae5" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={14} color="#16a34a" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#166534", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.fileName}</div>
                    <div style={{ fontSize: 11, color: "#4ade80" }}>Final · v{file.version} · {new Date(file.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <a href={file.fileUrl} target="_blank" rel="noreferrer" style={{ width: 32, height: 32, borderRadius: 8, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a", textDecoration: "none" }}>
                    <Download size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Review Button at Bottom */}
          {p.status === "Under Review" && (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { onReview(p); }} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 14px rgba(14,165,233,0.35)" }}>
                <Eye size={15} /> Review & Give Feedback
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ClientDashboard = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [view, setView] = useState<ClientView>("overview");
  const [userName, setUserName] = useState("Client");
  const [companyName, setCompanyName] = useState("");

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Review Modal
  const [reviewProject, setReviewProject] = useState<Project | null>(null);

  // Calendar / Posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Profile
  const [profile, setProfile] = useState<any>(null);

  // ── Init
  useEffect(() => {
    const session = getSession();
    if (!session?.token) { navigate("/user-login"); return; }
    setToken(session.token);
    setUserName(localStorage.getItem("socialflow_user_name") || "Client");
    setCompanyName(localStorage.getItem("socialflow_company") || "");
  }, [navigate]);

  // ── Load Profile
  const loadProfile = useCallback(async () => {
    if (!token) return;
    const { data } = await clientRequest<any>("/api/client/profile", "GET", token);
    if (data) {
      const p = data?.data || data;
      setProfile(p);
      if (p?.name) { setUserName(p.name); localStorage.setItem("socialflow_user_name", p.name); }
      if (p?.companyName) { setCompanyName(p.companyName); localStorage.setItem("socialflow_company", p.companyName); }
    }
  }, [token]);

  // ── Load Dashboard Stats
  const loadStats = useCallback(async () => {
    if (!token) return;
    setLoadingStats(true);
    const { data, error } = await clientRequest<any>("/api/client/dashboard", "GET", token);
    setLoadingStats(false);
    if (error) { toast.error("Dashboard load nahi hua: " + error); return; }
    const d = data?.data || data;
    setStats(d?.stats || d);
    setRecentProjects(d?.recentProjects || []);
  }, [token]);

  // ── Load Projects
  const loadProjects = useCallback(async () => {
    if (!token) return;
    setLoadingProjects(true);
    const params = new URLSearchParams();
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (searchQuery) params.set("search", searchQuery);
    params.set("limit", "50");
    const { data, error } = await clientRequest<any>(`/api/client/design-projects?${params.toString()}`, "GET", token);
    setLoadingProjects(false);
    if (error) { toast.error("Projects load nahi hue"); return; }
    setProjects(data?.data?.projects || data?.projects || data?.data || []);
  }, [token, filterStatus, searchQuery]);

  // ── Load Calendar Posts
  const loadPosts = useCallback(async () => {
    if (!token) return;
    setLoadingPosts(true);
    const { data } = await clientRequest<any>(`/api/client/content-calendar?month=${calendarMonth}`, "GET", token);
    setLoadingPosts(false);
    if (data) {
      const d = data?.data || data;
      setPosts(d?.posts || [...(d?.scheduledPosts || []), ...(d?.publishedPosts || [])]);
    }
  }, [token, calendarMonth]);

  // ── Load Notifications
  const loadNotifications = useCallback(async () => {
    if (!token) return;
    setLoadingNotifs(true);
    const { data } = await clientRequest<any>("/api/notifications?limit=20", "GET", token);
    setLoadingNotifs(false);
    if (data) {
      setNotifications(data?.data?.notifications || data?.notifications || []);
      setUnreadCount(data?.data?.unreadCount || 0);
    }
  }, [token]);

  useEffect(() => {
    if (token) { loadStats(); loadProfile(); loadNotifications(); }
  }, [token, loadStats, loadProfile, loadNotifications]);

  useEffect(() => {
    if (token && view === "projects") loadProjects();
  }, [token, view, filterStatus, searchQuery, loadProjects]);

  useEffect(() => {
    if (token && view === "calendar") loadPosts();
  }, [token, view, calendarMonth, loadPosts]);

  useEffect(() => {
    if (token && view === "notifications") loadNotifications();
  }, [token, view, loadNotifications]);

  // ── Mark Read
  const markRead = async (id: string) => {
    await clientRequest(`/api/notifications/${id}/read`, "PATCH", token);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await clientRequest("/api/notifications/read-all", "PATCH", token);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // ── Logout
  const handleLogout = () => {
    clearSession();
    localStorage.removeItem("socialflow_role");
    localStorage.removeItem("socialflow_user_name");
    localStorage.removeItem("socialflow_company");
    navigate("/");
    toast.success("Logged out!");
  };

  const pendingReview = stats?.pendingReview || projects.filter(p => p.status === "Under Review").length;

  const navItems: { key: ClientView; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "projects", label: "My Projects", icon: FolderOpen },
    { key: "calendar", label: "Content Calendar", icon: Calendar },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  // Calendar grid builder
  const buildCalendarGrid = () => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    return grid;
  };

  const getPostsForDay = (day: number) => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return posts.filter(p => {
      const d = p.scheduledAt || p.createdAt;
      return d && d.startsWith(dateStr);
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 240, background: "white", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: "2px 0 12px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <ClientLogo />
        </div>

        <div style={{ padding: "16px 16px 0" }}>
          {/* Profile Card */}
          <div style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", borderRadius: 14, padding: "14px", border: "1px solid #bae6fd", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #0ea5e9, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(14,165,233,0.3)" }}>
                <Building2 size={18} color="white" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0c4a6e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
                {companyName && <div style={{ fontSize: 11, color: "#0ea5e9", fontWeight: 600, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{companyName}</div>}
                <div style={{ fontSize: 10, color: "#7dd3fc", fontWeight: 500, marginTop: 1 }}>Client</div>
              </div>
            </div>
            {pendingReview > 0 && (
              <div style={{ marginTop: 10, background: "#fefce8", borderRadius: 8, padding: "7px 10px", border: "1px solid #fde68a", display: "flex", alignItems: "center", gap: 6 }}>
                <Eye size={13} color="#ca8a04" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>{pendingReview} Design{pendingReview > 1 ? "s" : ""} waiting for review</span>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = view === item.key;
              const badge = item.key === "notifications" ? unreadCount : item.key === "projects" ? pendingReview : 0;
              return (
                <button key={item.key} onClick={() => { setView(item.key); setSelectedProject(null); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: isActive ? "linear-gradient(135deg, #0ea5e9, #2563eb)" : "transparent", color: isActive ? "white" : "#64748b", fontSize: 13.5, fontWeight: 600, textAlign: "left", transition: "all 0.15s", boxShadow: isActive ? "0 4px 12px rgba(14,165,233,0.35)" : "none" }}>
                  <Icon size={16} /> {item.label}
                  {badge > 0 && (
                    <span style={{ marginLeft: "auto", background: isActive ? "rgba(255,255,255,0.25)" : "#fef2f2", color: isActive ? "white" : "#dc2626", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20 }}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Project Status Summary */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>Project Status</div>
            {[
              { label: "Pending Review", val: stats?.pendingReview || 0, color: "#ca8a04", bg: "#fefce8" },
              { label: "Approved",       val: stats?.approvedProjects || 0, color: "#16a34a", bg: "#f0fdf4" },
              { label: "Completed",      val: stats?.completedProjects || 0, color: "#0ea5e9", bg: "#f0f9ff" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: s.color, background: s.bg, padding: "2px 8px", borderRadius: 20 }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; (e.currentTarget as HTMLButtonElement).style.color = "#dc2626"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── TOPBAR ── */}
        <header style={{ background: "white", borderBottom: "1px solid #f1f5f9", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 0 #f1f5f9", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px" }}>
              {view === "overview" ? "Dashboard Overview" : view === "projects" ? "My Design Projects" : view === "calendar" ? "Content Calendar" : "Notifications"}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1, fontWeight: 500 }}>
              {view === "overview" ? `Welcome back, ${userName}!` : view === "projects" ? "Apne saare design projects dekho aur review karo" : view === "calendar" ? "Scheduled aur published posts dekho" : "Saari notifications ek jagah"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {pendingReview > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fefce8", border: "1px solid #fde68a", borderRadius: 20, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, color: "#92400e" }}>
                <Eye size={13} /> {pendingReview} Awaiting Review
              </div>
            )}
            {/* Notifications Bell */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowNotifDropdown(v => !v)} style={{ width: 36, height: 36, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                <Bell size={16} color="#64748b" />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>
                )}
              </button>
              {showNotifDropdown && (
                <div style={{ position: "absolute", right: 0, top: 44, width: 320, background: "white", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #f1f5f9", zIndex: 200 }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Notifications</span>
                    {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: 11.5, color: "#0ea5e9", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Mark all read</button>}
                  </div>
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {notifications.slice(0, 8).length === 0 ? (
                      <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No notifications</div>
                    ) : notifications.slice(0, 8).map(n => (
                      <div key={n._id} onClick={() => markRead(n._id)} style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", background: n.isRead ? "white" : "#f0f9ff", cursor: "pointer" }}>
                        <div style={{ fontSize: 12.5, fontWeight: n.isRead ? 500 : 700, color: "#334155", marginBottom: 3 }}>{n.title}</div>
                        <div style={{ fontSize: 11.5, color: "#64748b" }}>{n.message}</div>
                        <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9" }}>
                    <button onClick={() => { setView("notifications"); setShowNotifDropdown(false); }} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: "#0ea5e9", fontWeight: 600 }}>View All Notifications</button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => { loadStats(); loadNotifications(); if (view === "projects") loadProjects(); if (view === "calendar") loadPosts(); }} style={{ width: 36, height: 36, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <RefreshCw size={15} color="#64748b" />
            </button>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>

          {/* ═══════════════ OVERVIEW ═══════════════ */}
          {view === "overview" && (
            <div>
              {loadingStats ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: "#94a3b8" }}><Loader2 size={28} className="animate-spin" /></div>
              ) : (
                <>
                  {/* Stat Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                    <StatCard label="Total Projects" value={stats?.totalProjects || 0} icon={Layers} color="#0ea5e9" bg="#f0f9ff" />
                    <StatCard label="Pending Review" value={stats?.pendingReview || 0} icon={Eye} color="#ca8a04" bg="#fefce8" />
                    <StatCard label="Approved" value={stats?.approvedProjects || 0} icon={CheckCircle2} color="#16a34a" bg="#f0fdf4" />
                    <StatCard label="Completed" value={stats?.completedProjects || 0} icon={Star} color="#7c3aed" bg="#f5f3ff" />
                  </div>

                  {/* Pending Review Alert */}
                  {pendingReview > 0 && (
                    <div style={{ background: "linear-gradient(135deg, #fefce8, #fffbeb)", borderRadius: 16, padding: "20px 24px", border: "2px solid #fde68a", marginBottom: 24, boxShadow: "0 4px 20px rgba(234,179,8,0.12)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 14, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Zap size={22} color="#ca8a04" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#92400e" }}>Action Required: {pendingReview} Design{pendingReview > 1 ? "s" : ""} Waiting for Review!</div>
                          <div style={{ fontSize: 13, color: "#78350f", marginTop: 2 }}>GD ne design submit kar diya hai — aapka feedback zaroor chahiye taki project aage badh sake</div>
                        </div>
                        <button onClick={() => { setView("projects"); setFilterStatus("Under Review"); }} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #ca8a04, #d97706)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(202,138,4,0.3)" }}>
                          Review Now →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Recent Projects */}
                  <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                    <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Recent Projects</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Aapke latest design projects</div>
                      </div>
                      <button onClick={() => setView("projects")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#64748b" }}>
                        View All <ChevronRight size={14} />
                      </button>
                    </div>
                    {recentProjects.length === 0 ? (
                      <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                        <FolderOpen size={36} color="#e2e8f0" style={{ margin: "0 auto 12px", display: "block" }} />
                        Abhi koi project nahi
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "#f8fafc" }}>
                              {["Project Name", "Type", "Deadline", "Priority", "Status", "Action"].map(h => (
                                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {recentProjects.slice(0, 6).map((project, idx) => (
                              <tr key={project._id} style={{ borderBottom: idx < recentProjects.length - 1 ? "1px solid #f8fafc" : "none", cursor: "pointer" }}
                                onClick={() => { setView("projects"); setSelectedProject(project); }}
                                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc"}
                                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#1e293b", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.title}</td>
                                <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#64748b" }}>{project.designType}</td>
                                <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{new Date(project.deadline).toLocaleDateString()}</td>
                                <td style={{ padding: "13px 16px" }}><PriorityBadge priority={project.priority} /></td>
                                <td style={{ padding: "13px 16px" }}><StatusBadge status={project.status} /></td>
                                <td style={{ padding: "13px 16px" }}>
                                  {project.status === "Under Review" ? (
                                    <button onClick={e => { e.stopPropagation(); setReviewProject(project); }} style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #ca8a04, #d97706)", color: "white", cursor: "pointer", fontSize: 11.5, fontWeight: 700 }}>
                                      Review
                                    </button>
                                  ) : (
                                    <button onClick={e => { e.stopPropagation(); setView("projects"); setSelectedProject(project); }} style={{ padding: "5px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", cursor: "pointer", fontSize: 11.5, fontWeight: 600 }}>
                                      View
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══════════════ PROJECTS ═══════════════ */}
          {view === "projects" && (
            <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, height: "calc(100vh - 148px)" }}>
              {/* Left: Project List */}
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                {/* Search */}
                <div style={{ padding: "14px 14px 10px" }}>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search projects..." style={{ width: "100%", padding: "9px 9px 9px 32px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 12.5, color: "#334155", outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
                  </div>
                </div>
                {/* Filter Pills */}
                <div style={{ padding: "0 14px 10px", display: "flex", gap: 5, overflowX: "auto" }}>
                  {[
                    { key: "all", label: "All" },
                    { key: "Under Review", label: "Review" },
                    { key: "In Progress", label: "Active" },
                    { key: "Completed", label: "Done" },
                    { key: "Revision", label: "Revision" },
                  ].map(f => (
                    <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: filterStatus === f.key ? "linear-gradient(135deg, #0ea5e9, #2563eb)" : "#f1f5f9", color: filterStatus === f.key ? "white" : "#64748b", fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap", boxShadow: filterStatus === f.key ? "0 2px 8px rgba(14,165,233,0.3)" : "none" }}>
                      {f.label}
                    </button>
                  ))}
                </div>
                {/* Project Cards */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 10px" }}>
                  {loadingProjects ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}><Loader2 size={24} className="animate-spin" /></div>
                  ) : projects.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: 13 }}>
                      <FolderOpen size={36} color="#e2e8f0" style={{ display: "block", margin: "0 auto 12px" }} />
                      No projects found
                    </div>
                  ) : projects.map(project => {
                    const isSelected = selectedProject?._id === project._id;
                    const needsReview = project.status === "Under Review";
                    return (
                      <div key={project._id} onClick={() => setSelectedProject(project)} style={{ padding: "14px", borderRadius: 12, marginBottom: 6, border: isSelected ? "1.5px solid #38bdf8" : needsReview ? "1.5px solid #fde68a" : "1px solid #f1f5f9", background: isSelected ? "#f0f9ff" : needsReview ? "#fffbeb" : "white", cursor: "pointer", transition: "all 0.15s", boxShadow: isSelected ? "0 4px 14px rgba(14,165,233,0.12)" : needsReview ? "0 2px 8px rgba(234,179,8,0.08)" : "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1.3, flex: 1 }}>{project.title}</div>
                          <StatusBadge status={project.status} />
                        </div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 10, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                          {project.description}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11, color: "#0ea5e9", background: "#f0f9ff", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{project.designType}</span>
                            <PriorityBadge priority={project.priority} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}>
                            <CalendarDays size={11} /> {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        </div>
                        {needsReview && (
                          <div style={{ marginTop: 8, padding: "7px 10px", background: "#fefce8", borderRadius: 8, border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11.5, color: "#92400e", fontWeight: 600 }}>👀 Review required</span>
                            <button onClick={e => { e.stopPropagation(); setReviewProject(project); }} style={{ fontSize: 11, background: "linear-gradient(135deg, #ca8a04, #d97706)", color: "white", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 700 }}>
                              Review
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Project Detail */}
              {selectedProject ? (
                <ProjectDetailPanel
                  project={selectedProject}
                  token={token}
                  onReview={p => setReviewProject(p)}
                  onClose={() => setSelectedProject(null)}
                />
              ) : (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <FolderOpen size={28} color="#38bdf8" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Select a project</div>
                    <div style={{ fontSize: 12.5, color: "#94a3b8" }}>Kisi bhi project pe click karke details dekho</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ CALENDAR ═══════════════ */}
          {view === "calendar" && (
            <div>
              {/* Month Navigation */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                  {new Date(calendarMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => {
                    const [y, m] = calendarMonth.split("-").map(Number);
                    const prev = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
                    setCalendarMonth(prev);
                  }} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                    ← Prev
                  </button>
                  <button onClick={() => {
                    const [y, m] = calendarMonth.split("-").map(Number);
                    const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
                    setCalendarMonth(next);
                  }} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                    Next →
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
                <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{posts.length}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Total Posts</div>
                </div>
                <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0ea5e9" }}>{posts.filter(p => p.status === "scheduled").length}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Scheduled</div>
                </div>
                <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>{posts.filter(p => p.status === "published").length}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Published</div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                {/* Day Headers */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #f1f5f9" }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} style={{ padding: "12px 8px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{d}</div>
                  ))}
                </div>
                {/* Days */}
                {loadingPosts ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}><Loader2 size={24} className="animate-spin" /></div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                    {buildCalendarGrid().map((day, idx) => {
                      const dayPosts = day ? getPostsForDay(day) : [];
                      const today = new Date();
                      const isToday = day && today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") === calendarMonth && today.getDate() === day;
                      return (
                        <div key={idx} style={{ minHeight: 90, padding: "8px 6px", border: "1px solid #f8fafc", background: isToday ? "#f0f9ff" : "white", borderLeft: idx % 7 === 0 ? "none" : "1px solid #f8fafc" }}>
                          {day && (
                            <>
                              <div style={{ fontSize: 12.5, fontWeight: isToday ? 800 : 500, color: isToday ? "#0ea5e9" : "#334155", marginBottom: 4, width: isToday ? 24 : "auto", height: isToday ? 24 : "auto", borderRadius: isToday ? "50%" : 0, background: isToday ? "#0ea5e9" : "transparent", display: isToday ? "flex" : "block", alignItems: "center", justifyContent: "center", color: isToday ? "white" : "#334155" }}>
                                {day}
                              </div>
                              {dayPosts.slice(0, 2).map(post => (
                                <div key={post._id} style={{ fontSize: 10.5, padding: "3px 6px", borderRadius: 5, marginBottom: 2, background: post.status === "published" ? "#f0fdf4" : "#eff6ff", color: post.status === "published" ? "#16a34a" : "#2563eb", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {post.platforms?.[0] ? post.platforms[0].slice(0, 2).toUpperCase() : "—"} · {post.content?.slice(0, 15)}…
                                </div>
                              ))}
                              {dayPosts.length > 2 && (
                                <div style={{ fontSize: 10, color: "#94a3b8", padding: "2px 4px" }}>+{dayPosts.length - 2} more</div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Posts List */}
              {posts.length > 0 && (
                <div style={{ marginTop: 20, background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                    All Posts This Month
                  </div>
                  <div style={{ padding: "8px 12px" }}>
                    {posts.map(post => (
                      <div key={post._id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px", borderRadius: 10, marginBottom: 4, border: "1px solid #f8fafc", background: "#fafafa" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: post.status === "published" ? "#f0fdf4" : "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Globe size={16} color={post.status === "published" ? "#16a34a" : "#2563eb"} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 4, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{post.content}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {post.platforms?.map(p => (
                              <span key={p} style={{ fontSize: 10.5, color: "#64748b", background: "#f1f5f9", padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>{p}</span>
                            ))}
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: 11.5, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: post.status === "published" ? "#f0fdf4" : "#eff6ff", color: post.status === "published" ? "#16a34a" : "#2563eb", whiteSpace: "nowrap" }}>
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ NOTIFICATIONS ═══════════════ */}
          {view === "notifications" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                  All Notifications {unreadCount > 0 && <span style={{ background: "#ef4444", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginLeft: 8 }}>{unreadCount} unread</span>}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#0ea5e9" }}>
                    Mark All Read
                  </button>
                )}
              </div>
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                {loadingNotifs ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}><Loader2 size={24} className="animate-spin" /></div>
                ) : notifications.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                    <Bell size={36} color="#e2e8f0" style={{ display: "block", margin: "0 auto 12px" }} />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>No notifications yet</div>
                  </div>
                ) : notifications.map((n, idx) => {
                  const eventEmojis: Record<string, string> = {
                    project_assigned: "📋",
                    design_submitted: "🎨",
                    client_approved: "✅",
                    client_rejected: "❌",
                    revision_requested: "⚠️",
                    project_completed: "🏆",
                    post_published: "📢",
                  };
                  const emoji = eventEmojis[n.event || ""] || "🔔";
                  return (
                    <div key={n._id} onClick={() => !n.isRead && markRead(n._id)} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", borderBottom: idx < notifications.length - 1 ? "1px solid #f8fafc" : "none", background: n.isRead ? "white" : "#f0f9ff", cursor: n.isRead ? "default" : "pointer", transition: "background 0.15s" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: n.isRead ? "#f1f5f9" : "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
                        {emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: n.isRead ? 500 : 700, color: "#1e293b", marginBottom: 3 }}>{n.title}</div>
                        <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5 }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                      {!n.isRead && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0ea5e9", flexShrink: 0, marginTop: 6 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── REVIEW MODAL ── */}
      {reviewProject && token && (
        <ReviewModal
          project={reviewProject}
          token={token}
          onClose={() => setReviewProject(null)}
          onSuccess={() => {
            setReviewProject(null);
            loadStats();
            if (view === "projects") loadProjects();
          }}
        />
      )}

      {/* Notification dropdown backdrop */}
      {showNotifDropdown && (
        <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={() => setShowNotifDropdown(false)} />
      )}
    </div>
  );
};

export default ClientDashboard;

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Palette, LogOut, CheckCircle2, Clock, AlertCircle,
  FileImage, MessageSquare, Calendar, Upload, Send,
  X, ChevronRight, Image, Film, BookImage, Eye,
  TrendingUp, Layers, Star, Bell, Search, Filter,
  ArrowUpRight, Zap, MoreHorizontal, Download, Paperclip,
  RefreshCw, User, Loader2
} from "lucide-react";
import { clearSession, getSession, BASE_URL } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type Priority = "High" | "Medium" | "Low" | "Urgent";
type TaskStatus = "Pending" | "In Progress" | "Under Review" | "Revision" | "Completed" | "Cancelled";
type GDView = "overview" | "tasks" | "uploads";

interface DesignFile {
  _id: string;
  fileName: string;
  fileType: "Draft" | "Final";
  fileUrl: string;
  version: number;
  uploadedAt: string;
}

interface Revision {
  _id: string;
  revisionMessage: string;
  designerReply?: string;
  status: string;
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  designType: string;
  client?: { name?: string; companyName?: string };
  deadline: string;
  priority: Priority;
  status: TaskStatus;
  assignedBy?: { name?: string };
  createdAt: string;
  progressPercentage?: number;
  internalNotes?: string;
  brandColors?: string;
  fontPreferences?: string;
  targetAudience?: string;
  revisionLimit?: number;
  designFiles?: DesignFile[];
  revisions?: Revision[];
}

interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  underReviewTasks: number;
  revisionTasks: number;
  completedTasks: number;
  dueToday: number;
}

interface DeadlineData {
  todayProjects: Task[];
  upcomingProjects: Task[];
  overdueProjects: Task[];
}

// ─── API Helper ───────────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_API_KEY || "sf_live_a7k92mXpQ3nR8vTz5wYdJ6bLcU1eHi4o";

async function gdRequest<T = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  token: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: string | null; status?: number }> {
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
      // 401 = token invalid/expired — session clear karke redirect
      if (res.status === 401) {
        localStorage.removeItem("sf_session");
        localStorage.removeItem("socialflow_role");
        localStorage.removeItem("socialflow_user_name");
        window.location.href = "/user-login";
      }
      return { data: null, error: json?.message || json?.msg || json?.error || `Error ${res.status}`, status: res.status };
    }
    if (json?.success === false) return { data: null, error: json?.message || json?.msg || "Request failed", status: res.status };
    return { data: json as T, error: null, status: res.status };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

async function gdFormRequest<T = unknown>(
  path: string,
  token: string,
  formData: FormData
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "x-api-key": API_KEY,
      },
      body: formData,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("sf_session");
        window.location.href = "/user-login";
      }
      return { data: null, error: json?.message || json?.msg || json?.error || `Error ${res.status}` };
    }
    if (json?.success === false) return { data: null, error: json?.message || json?.msg || "Upload failed" };
    return { data: json as T, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────
const priorityConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  High:   { label: "High",   dot: "#ef4444", bg: "#fef2f2", text: "#dc2626" },
  Urgent: { label: "Urgent", dot: "#dc2626", bg: "#fff1f2", text: "#be123c" },
  Medium: { label: "Medium", dot: "#f59e0b", bg: "#fffbeb", text: "#d97706" },
  Low:    { label: "Low",    dot: "#22c55e", bg: "#f0fdf4", text: "#16a34a" },
};

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  "Pending":      { label: "Pending",        bg: "#f8fafc", text: "#64748b", border: "#e2e8f0", icon: Clock },
  "In Progress":  { label: "In Progress",    bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe", icon: AlertCircle },
  "Under Review": { label: "Under Review",   bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", icon: Eye },
  "Revision":     { label: "Needs Revision", bg: "#fff7ed", text: "#ea580c", border: "#fed7aa", icon: MessageSquare },
  "Completed":    { label: "Completed",      bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", icon: CheckCircle2 },
  "Cancelled":    { label: "Cancelled",      bg: "#f8fafc", text: "#94a3b8", border: "#e2e8f0", icon: X },
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
const GDLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
      <Palette size={18} color="white" />
    </div>
    <div style={{ lineHeight: 1 }}>
      <div style={{ fontFamily: "'Syne', 'Poppins', sans-serif", fontWeight: 800, fontSize: 14, color: "#0f172a", letterSpacing: "-0.3px" }}>
        Social<span style={{ color: "#7c3aed" }}>Flow</span>
      </div>
      <div style={{ fontSize: 9.5, color: "#a78bfa", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginTop: 1 }}>Design Studio</div>
    </div>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, bg, trend }: { label: string; value: number | string; icon: React.ElementType; color: string; bg: string; trend?: string }) => (
  <div style={{ background: "white", borderRadius: 16, padding: "20px 22px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </div>
      {trend && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#22c55e" }}><ArrowUpRight size={14} /> {trend}</div>}
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] || { label: status, bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap" }}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }: { priority: string }) => {
  const cfg = priorityConfig[priority] || { label: priority, dot: "#94a3b8", bg: "#f1f5f9", text: "#64748b" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.text, padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
};

// ─── Upload Modal ─────────────────────────────────────────────────────────────
const UploadModal = ({ task, token, onClose, onSuccess }: { task: Task; token: string; onClose: () => void; onSuccess: () => void }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"Draft" | "Final">("Final");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file) return toast.error("Pehle file select karo");
    setLoading(true);
    const fd = new FormData();
    fd.append("designFile", file);
    fd.append("fileType", fileType);
    fd.append("fileName", fileName || file.name.replace(/\.[^/.]+$/, ""));
    const { error } = await gdFormRequest(`/api/gd/projects/${task._id}/files`, token, fd);
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("File upload ho gayi!");
    onSuccess();
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Upload Design</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{task.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* File Type Toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["Draft", "Final"] as const).map(ft => (
            <button key={ft} onClick={() => setFileType(ft)} style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1.5px solid ${fileType === ft ? "#7c3aed" : "#e2e8f0"}`, background: fileType === ft ? "#ede9fe" : "white", color: fileType === ft ? "#7c3aed" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              {ft}
            </button>
          ))}
        </div>

        {/* Custom File Name */}
        <input value={fileName} onChange={e => setFileName(e.target.value)} placeholder="File name (optional)" style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 12.5, color: "#334155", outline: "none", boxSizing: "border-box", marginBottom: 12 }} />

        {/* Drop Zone */}
        <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }} onClick={() => inputRef.current?.click()} style={{ border: `2px dashed ${dragging ? "#7c3aed" : "#e2e8f0"}`, borderRadius: 14, padding: "32px 20px", textAlign: "center", background: dragging ? "#faf5ff" : "#f8fafc", cursor: "pointer", transition: "all 0.2s", marginBottom: 16 }}>
          <input ref={inputRef} type="file" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Upload size={22} color="#7c3aed" />
          </div>
          {file ? (
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#7c3aed" }}>{file.name}</div>
              <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 4 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>Drop your file here</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>PNG, JPG, PDF, AI, PSD — max 50MB</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={!file || loading} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: file ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#e2e8f0", color: file ? "white" : "#94a3b8", cursor: file ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700, boxShadow: file ? "0 4px 14px rgba(124,58,237,0.35)" : "none" }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {loading ? "Uploading..." : "Upload File"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Comment Modal ─────────────────────────────────────────────────────────────
const CommentModal = ({ task, token, onClose }: { task: Task; token: string; onClose: () => void }) => {
  const [comments, setComments] = useState<Array<{ _id: string; message: string; sender?: { name?: string; role?: string }; createdAt: string }>>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadComments = useCallback(async () => {
    const { data } = await gdRequest(`/api/gd/projects/${task._id}/comments`, "GET", token);
    if (data) setComments((data as any)?.data?.comments || (data as any)?.comments || []);
    setLoading(false);
  }, [task._id, token]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const sendComment = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    const { error } = await gdRequest(`/api/gd/projects/${task._id}/comments`, "POST", token, { message: newMsg });
    setSending(false);
    if (error) { toast.error(error); return; }
    setNewMsg("");
    loadComments();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Comments</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{task.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {loading ? <div style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>Loading...</div> : comments.length === 0 ? (
            <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>Abhi koi comment nahi</div>
          ) : comments.map(c => (
            <div key={c._id} style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{c.sender?.name || "Unknown"} <span style={{ fontSize: 10, color: "#7c3aed", fontWeight: 600 }}>({c.sender?.role || ""})</span></span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.5 }}>{c.message}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
          <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendComment()} placeholder="SMM ko message bhejo..." style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none" }} />
          <button onClick={sendComment} disabled={sending || !newMsg.trim()} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            {sending ? <Loader2 size={14} /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Revision Reply Modal ──────────────────────────────────────────────────────
const RevisionModal = ({ revision, token, onClose, onSuccess }: { revision: Revision; token: string; onClose: () => void; onSuccess: () => void }) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!reply.trim()) return;
    setLoading(true);
    const { error } = await gdRequest(`/api/gd/revisions/${revision._id}/reply`, "PUT", token, { designerReply: reply, status: "In Progress" });
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Revision reply bhej diya!");
    onSuccess();
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Reply to Revision</div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} color="#64748b" /></button>
        </div>
        <div style={{ padding: "12px 14px", background: "#fff7ed", borderRadius: 10, border: "1px solid #fed7aa", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#ea580c", marginBottom: 4 }}>REVISION REQUEST</div>
          <p style={{ fontSize: 13, color: "#9a3412", margin: 0, lineHeight: 1.5 }}>{revision.revisionMessage}</p>
        </div>
        <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Apna reply likho..." style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", resize: "vertical", minHeight: 100, boxSizing: "border-box", marginBottom: 12 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Cancel</button>
          <button onClick={submit} disabled={loading || !reply.trim()} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            {loading ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Submit for Review Modal ──────────────────────────────────────────────────
const SubmitReviewModal = ({ task, token, onClose, onSuccess }: { task: Task; token: string; onClose: () => void; onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const { error } = await gdRequest(`/api/gd/projects/${task._id}/submit-for-review`, "PATCH", token);
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Design review ke liye submit ho gaya! Client ko notification chali gayi 🎉");
    onSuccess();
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Send size={24} color="#16a34a" />
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Submit for Review?</div>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>"{task.title}" ko client review ke liye submit karne wale ho. Pehle ensure karo ke Final file upload ho chuki hai.</p>
        </div>
        {!task.designFiles?.some(f => f.fileType === "Final") && (
          <div style={{ padding: "10px 14px", background: "#fff7ed", borderRadius: 10, border: "1px solid #fed7aa", marginBottom: 16 }}>
            <div style={{ fontSize: 12.5, color: "#ea580c", fontWeight: 600 }}>⚠️ Koi Final file nahi mili — pehle upload karo</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Cancel</button>
          <button onClick={submit} disabled={loading} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
            {loading ? "Submitting..." : "✅ Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const GDDashboard = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [view, setView] = useState<GDView>("overview");
  const [userName, setUserName] = useState("Designer");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineData | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [uploadTask, setUploadTask] = useState<Task | null>(null);
  const [commentTask, setCommentTask] = useState<Task | null>(null);
  const [replyRevision, setReplyRevision] = useState<Revision | null>(null);
  const [submitReviewTask, setSubmitReviewTask] = useState<Task | null>(null);
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ── Init
  useEffect(() => {
    const session = getSession();
    if (!session?.token) {
      navigate("/user-login");
      return;
    }
    setToken(session.token);
    setUserName(localStorage.getItem("socialflow_user_name") || "Designer");
  }, [navigate]);

  // ── Load dashboard stats
  const loadStats = useCallback(async () => {
    if (!token) return;
    setLoadingStats(true);
    const { data, error } = await gdRequest<any>("/api/gd/dashboard", "GET", token);
    setLoadingStats(false);
    if (error) { toast.error("Stats load nahi hue: " + error); return; }
    setStats(data?.data || data);
  }, [token]);

  // ── Load deadlines
  const loadDeadlines = useCallback(async () => {
    if (!token) return;
    const { data } = await gdRequest<any>("/api/gd/projects/deadlines", "GET", token);
    if (data) setDeadlines(data?.data || data);
  }, [token]);

  // ── Load tasks list
  const loadTasks = useCallback(async () => {
    if (!token) return;
    setLoadingTasks(true);
    const params = new URLSearchParams();
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (searchQuery) params.set("search", searchQuery);
    const qs = params.toString();
    const { data, error } = await gdRequest<any>(`/api/gd/projects${qs ? "?" + qs : ""}`, "GET", token);
    setLoadingTasks(false);
    if (error) { toast.error("Tasks load nahi hue"); return; }
    setTasks(data?.data?.projects || data?.projects || data?.data || []);
  }, [token, filterStatus, searchQuery]);

  // ── Load task detail
  const loadTaskDetail = useCallback(async (taskId: string) => {
    if (!token) return;
    setLoadingDetail(true);
    const { data } = await gdRequest<any>(`/api/gd/projects/${taskId}`, "GET", token);
    setLoadingDetail(false);
    if (data) setSelectedTaskDetail(data?.data?.project || data?.project || data?.data);
  }, [token]);

  // ── Load notifications
  const loadNotifications = useCallback(async () => {
    if (!token) return;
    const { data } = await gdRequest<any>("/api/notifications?limit=10", "GET", token);
    if (data) {
      setNotifications(data?.data?.notifications || []);
      setUnreadCount(data?.data?.unreadCount || 0);
    }
  }, [token]);

  useEffect(() => {
    if (token) { loadStats(); loadDeadlines(); loadNotifications(); }
  }, [token, loadStats, loadDeadlines, loadNotifications]);

  useEffect(() => {
    if (token && view === "tasks") loadTasks();
  }, [token, view, filterStatus, searchQuery, loadTasks]);

  useEffect(() => {
    if (selectedTask?._id) loadTaskDetail(selectedTask._id);
  }, [selectedTask?._id, loadTaskDetail]);

  // ── Update Progress
  const updateProgress = async (taskId: string, status: string, progressPercentage?: number) => {
    setUpdatingStatus(true);
    const body: Record<string, unknown> = { status };
    if (progressPercentage !== undefined) body.progressPercentage = progressPercentage;
    const { error } = await gdRequest(`/api/gd/projects/${taskId}/progress`, "PUT", token, body);
    setUpdatingStatus(false);
    if (error) { toast.error(error); return; }
    toast.success("Status update ho gaya!");
    loadStats();
    if (selectedTask?._id === taskId) loadTaskDetail(taskId);
    loadTasks();
  };

  // ── Mark notification read
  const markRead = async (id: string) => {
    await gdRequest(`/api/notifications/${id}/read`, "PATCH", token);
    loadNotifications();
  };

  const markAllRead = async () => {
    await gdRequest("/api/notifications/read-all", "PATCH", token);
    loadNotifications();
  };

  const handleLogout = () => {
    clearSession();
    localStorage.removeItem("socialflow_role");
    localStorage.removeItem("socialflow_user_name");
    navigate("/");
    toast.success("Logged out!");
  };

  const counts = {
    all: stats?.totalTasks || tasks.length,
    pending: stats?.pendingTasks || 0,
    in_progress: stats?.inProgressTasks || 0,
    under_review: stats?.underReviewTasks || 0,
    revision: stats?.revisionTasks || 0,
    completed: stats?.completedTasks || 0,
    dueToday: stats?.dueToday || 0,
  };

  const navItems: { key: GDView; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: Layers },
    { key: "tasks", label: "All Tasks", icon: FileImage },
    { key: "uploads", label: "Uploads", icon: Upload },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 240, background: "white", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: "2px 0 12px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <GDLogo />
        </div>
        <div style={{ padding: "16px 16px 0" }}>
          {/* Profile Card */}
          <div style={{ background: "linear-gradient(135deg, #faf5ff, #ede9fe)", borderRadius: 14, padding: "14px", border: "1px solid #ddd6fe", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(124,58,237,0.3)" }}>
                <Palette size={18} color="white" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
                <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600, marginTop: 1 }}>Graphic Designer</div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
              {[
                { label: "Active", val: counts.in_progress + counts.pending, color: "#7c3aed" },
                { label: "Done", val: counts.completed, color: "#16a34a" },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, background: "white", borderRadius: 8, padding: "6px 8px", textAlign: "center", border: "1px solid rgba(124,58,237,0.12)" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = view === item.key;
              return (
                <button key={item.key} onClick={() => { setView(item.key); setSelectedTask(null); setSelectedTaskDetail(null); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: isActive ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent", color: isActive ? "white" : "#64748b", fontSize: 13.5, fontWeight: 600, textAlign: "left", transition: "all 0.15s", boxShadow: isActive ? "0 4px 12px rgba(124,58,237,0.3)" : "none" }}>
                  <Icon size={16} /> {item.label}
                  {item.key === "tasks" && counts.revision > 0 && (
                    <span style={{ marginLeft: "auto", background: isActive ? "rgba(255,255,255,0.25)" : "#fef2f2", color: isActive ? "white" : "#dc2626", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20 }}>{counts.revision}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>Quick Stats</div>
            {[
              { label: "Pending",      val: counts.pending,     color: "#64748b", bg: "#f1f5f9" },
              { label: "In Progress",  val: counts.in_progress, color: "#2563eb", bg: "#eff6ff" },
              { label: "Under Review", val: counts.under_review, color: "#16a34a", bg: "#f0fdf4" },
              { label: "Revision",     val: counts.revision,    color: "#ea580c", bg: "#fff7ed" },
              { label: "Completed",    val: counts.completed,   color: "#16a34a", bg: "#f0fdf4" },
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
              {view === "overview" ? "Dashboard Overview" : view === "tasks" ? "My Design Tasks" : "Upload Center"}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1, fontWeight: 500 }}>
              {view === "overview" ? "Your daily work summary & active tasks" : view === "tasks" ? "Tasks assigned by SMM team" : "Upload completed designs"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {counts.revision > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 20, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, color: "#ea580c" }}>
                <AlertCircle size={13} /> {counts.revision} Revision{counts.revision > 1 ? "s" : ""} Needed
              </div>
            )}
            {counts.dueToday > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#ede9fe", border: "1px solid #ddd6fe", borderRadius: 20, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, color: "#7c3aed" }}>
                <Zap size={13} /> {counts.dueToday} Due Today
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
                    {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Mark all read</button>}
                  </div>
                  <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No notifications</div>
                    ) : notifications.map((n: any) => (
                      <div key={n._id} onClick={() => markRead(n._id)} style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", background: n.isRead ? "white" : "#faf5ff", cursor: "pointer" }}>
                        <div style={{ fontSize: 12.5, fontWeight: n.isRead ? 500 : 700, color: "#334155", marginBottom: 3 }}>{n.title}</div>
                        <div style={{ fontSize: 11.5, color: "#64748b" }}>{n.message}</div>
                        <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => { loadStats(); loadDeadlines(); loadNotifications(); if (view === "tasks") loadTasks(); }} style={{ width: 36, height: 36, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
                    <StatCard label="Total Tasks" value={counts.all} icon={Layers} color="#7c3aed" bg="#f5f3ff" />
                    <StatCard label="In Progress" value={counts.in_progress} icon={TrendingUp} color="#2563eb" bg="#eff6ff" />
                    <StatCard label="Needs Revision" value={counts.revision} icon={MessageSquare} color="#ea580c" bg="#fff7ed" />
                    <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} color="#16a34a" bg="#f0fdf4" />
                  </div>

                  {/* Today + Upcoming */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                    {/* Due Today */}
                    <div style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Today's Deadlines</div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", background: "#f8fafc", padding: "4px 10px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
                          {deadlines?.todayProjects?.length || 0} task{(deadlines?.todayProjects?.length || 0) !== 1 ? "s" : ""}
                        </div>
                      </div>
                      {!deadlines?.todayProjects?.length ? (
                        <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>🎉 Aaj koi deadline nahi!</div>
                      ) : deadlines.todayProjects.slice(0, 4).map(task => (
                        <div key={task._id} onClick={() => { setView("tasks"); setSelectedTask(task); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid #f1f5f9", cursor: "pointer", background: "#fafafa", marginBottom: 8, transition: "all 0.15s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#f5f3ff"}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#fafafa"}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: task.status === "Revision" ? "#ea580c" : task.status === "In Progress" ? "#2563eb" : "#94a3b8" }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{task.client?.companyName || task.client?.name} · {task.designType}</div>
                          </div>
                          <StatusBadge status={task.status} />
                        </div>
                      ))}
                    </div>

                    {/* Overdue */}
                    <div style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>🔥 Overdue Tasks</div>
                        <div style={{ fontSize: 11.5, color: "#dc2626", background: "#fef2f2", padding: "4px 10px", borderRadius: 20, border: "1px solid #fecaca" }}>
                          {deadlines?.overdueProjects?.length || 0} overdue
                        </div>
                      </div>
                      {!deadlines?.overdueProjects?.length ? (
                        <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>No overdue tasks 🎉</div>
                      ) : deadlines.overdueProjects.slice(0, 4).map(task => (
                        <div key={task._id} onClick={() => { setView("tasks"); setSelectedTask(task); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid #fee2e2", background: "#fff5f5", cursor: "pointer", marginBottom: 8, transition: "all 0.15s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#fef2f2"}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#fff5f5"}>
                          <Star size={14} color="#ef4444" fill="#ef4444" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>Due: {new Date(task.deadline).toLocaleDateString()}</div>
                          </div>
                          <PriorityBadge priority={task.priority} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Projects */}
                  {(deadlines?.upcomingProjects?.length || 0) > 0 && (
                    <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden", marginBottom: 28 }}>
                      <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Upcoming Deadlines</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Next 7 days mein due</div>
                        </div>
                        <button onClick={() => setView("tasks")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#64748b" }}>
                          View All <ChevronRight size={14} />
                        </button>
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "#f8fafc" }}>
                              {["Task Name", "Client", "Design Type", "Deadline", "Priority", "Status"].map(h => (
                                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {deadlines!.upcomingProjects.slice(0, 5).map((task, idx) => (
                              <tr key={task._id} style={{ borderBottom: idx < deadlines!.upcomingProjects.length - 1 ? "1px solid #f8fafc" : "none", cursor: "pointer" }} onClick={() => { setView("tasks"); setSelectedTask(task); }}
                                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fafafe"}
                                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#1e293b", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</td>
                                <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#334155" }}>{task.client?.companyName || task.client?.name}</td>
                                <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#64748b" }}>{task.designType}</td>
                                <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}><Calendar size={12} color="#94a3b8" style={{ marginRight: 4 }} />{new Date(task.deadline).toLocaleDateString()}</td>
                                <td style={{ padding: "13px 16px" }}><PriorityBadge priority={task.priority} /></td>
                                <td style={{ padding: "13px 16px" }}><StatusBadge status={task.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ═══════════════ TASKS VIEW ═══════════════ */}
          {view === "tasks" && (
            <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, height: "calc(100vh - 148px)" }}>
              {/* Left: Task List */}
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                {/* Search */}
                <div style={{ padding: "14px 14px 10px" }}>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tasks or clients…" style={{ width: "100%", padding: "9px 9px 9px 32px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 12.5, color: "#334155", outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
                  </div>
                </div>
                {/* Filter Pills */}
                <div style={{ padding: "0 14px 10px", display: "flex", gap: 5, overflowX: "auto" }}>
                  {([
                    { key: "all", label: "All", count: counts.all },
                    { key: "Pending", label: "Pending", count: counts.pending },
                    { key: "In Progress", label: "Active", count: counts.in_progress },
                    { key: "Revision", label: "Revision", count: counts.revision },
                    { key: "Under Review", label: "Review", count: counts.under_review },
                    { key: "Completed", label: "Done", count: counts.completed },
                  ] as { key: string; label: string; count: number }[]).map(f => (
                    <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 20, border: "none", cursor: "pointer", background: filterStatus === f.key ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#f1f5f9", color: filterStatus === f.key ? "white" : "#64748b", fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap", boxShadow: filterStatus === f.key ? "0 2px 8px rgba(124,58,237,0.3)" : "none" }}>
                      {f.label}
                      <span style={{ background: filterStatus === f.key ? "rgba(255,255,255,0.25)" : "#e2e8f0", color: filterStatus === f.key ? "white" : "#64748b", padding: "1px 6px", borderRadius: 20, fontSize: 10.5, fontWeight: 700 }}>{f.count}</span>
                    </button>
                  ))}
                </div>
                {/* Task Cards */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 10px" }}>
                  {loadingTasks ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}><Loader2 size={24} className="animate-spin" /></div>
                  ) : tasks.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: 13 }}>No tasks found</div>
                  ) : tasks.map(task => {
                    const isSelected = selectedTask?._id === task._id;
                    return (
                      <div key={task._id} onClick={() => setSelectedTask(task)} style={{ padding: "14px", borderRadius: 12, marginBottom: 6, border: isSelected ? "1.5px solid #a78bfa" : "1px solid #f1f5f9", background: isSelected ? "#faf5ff" : "white", cursor: "pointer", transition: "all 0.15s", boxShadow: isSelected ? "0 4px 14px rgba(124,58,237,0.1)" : "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1.3, flex: 1 }}>{task.title}</div>
                          <StatusBadge status={task.status} />
                        </div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 10, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                          {task.description}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11, color: "#7c3aed", background: "#f5f3ff", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{task.designType}</span>
                            <PriorityBadge priority={task.priority} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}>
                            <Calendar size={11} /> {new Date(task.deadline).toLocaleDateString()}
                          </div>
                        </div>
                        {task.status === "Revision" && (
                          <div style={{ marginTop: 8, padding: "7px 10px", background: "#fff7ed", borderRadius: 8, border: "1px solid #fed7aa" }}>
                            <div style={{ fontSize: 11.5, color: "#ea580c", fontWeight: 600 }}>⚠ Revision Requested by SMM</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Task Detail */}
              {selectedTask ? (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "auto", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  {loadingDetail ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}><Loader2 size={28} className="animate-spin" /></div>
                  ) : selectedTaskDetail ? (
                    <div style={{ maxWidth: 620 }}>
                      {/* Task Header */}
                      <div style={{ marginBottom: 22 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 11.5, color: "#7c3aed", background: "#f5f3ff", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{selectedTaskDetail.designType}</span>
                          <PriorityBadge priority={selectedTaskDetail.priority} />
                          <StatusBadge status={selectedTaskDetail.status} />
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", lineHeight: 1.2, margin: "0 0 6px" }}>{selectedTaskDetail.title}</h2>
                        <div style={{ fontSize: 12.5, color: "#94a3b8" }}>Assigned by {selectedTaskDetail.assignedBy?.name} · {new Date(selectedTaskDetail.createdAt).toLocaleDateString()}</div>
                      </div>

                      {/* Revision Alerts */}
                      {selectedTaskDetail.status === "Revision" && selectedTaskDetail.revisions && selectedTaskDetail.revisions.filter(r => r.status !== "Resolved").length > 0 && (
                        <div style={{ marginBottom: 18 }}>
                          {selectedTaskDetail.revisions.filter(r => r.status !== "Resolved").map(rev => (
                            <div key={rev._id} style={{ padding: "14px 16px", background: "#fff7ed", borderRadius: 12, border: "1px solid #fed7aa", marginBottom: 10 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "#ea580c" }}>
                                  <MessageSquare size={14} /> Revision Requested
                                </div>
                                <button onClick={() => setReplyRevision(rev)} style={{ fontSize: 12, color: "#7c3aed", background: "#ede9fe", border: "none", borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontWeight: 600 }}>
                                  Reply
                                </button>
                              </div>
                              <p style={{ fontSize: 13, color: "#9a3412", lineHeight: 1.6, margin: 0 }}>{rev.revisionMessage}</p>
                              {rev.designerReply && <div style={{ marginTop: 8, fontSize: 12, color: "#64748b", fontStyle: "italic" }}>Your reply: {rev.designerReply}</div>}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Task Info Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                        {[
                          { label: "Client", value: selectedTaskDetail.client?.companyName || selectedTaskDetail.client?.name || "—" },
                          { label: "Design Type", value: selectedTaskDetail.designType },
                          { label: "Deadline", value: new Date(selectedTaskDetail.deadline).toLocaleDateString() },
                          { label: "Assigned By", value: selectedTaskDetail.assignedBy?.name || "—" },
                          ...(selectedTaskDetail.brandColors ? [{ label: "Brand Colors", value: selectedTaskDetail.brandColors }] : []),
                          ...(selectedTaskDetail.targetAudience ? [{ label: "Target Audience", value: selectedTaskDetail.targetAudience }] : []),
                          ...(selectedTaskDetail.revisionLimit !== undefined ? [{ label: "Revision Limit", value: String(selectedTaskDetail.revisionLimit) }] : []),
                        ].map(item => (
                          <div key={item.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", border: "1px solid #f1f5f9" }}>
                            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{item.label}</div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>{item.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px", border: "1px solid #f1f5f9", marginBottom: 16 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Task Description</div>
                        <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.7, margin: 0 }}>{selectedTaskDetail.description}</p>
                      </div>

                      {/* Internal Notes */}
                      {selectedTaskDetail.internalNotes && (
                        <div style={{ background: "#eff6ff", borderRadius: 12, padding: "14px 16px", border: "1px solid #bfdbfe", marginBottom: 16 }}>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Internal Notes</div>
                          <p style={{ fontSize: 13, color: "#1e40af", lineHeight: 1.6, margin: 0 }}>{selectedTaskDetail.internalNotes}</p>
                        </div>
                      )}

                      {/* Font Preferences */}
                      {selectedTaskDetail.fontPreferences && (
                        <div style={{ background: "#faf5ff", borderRadius: 12, padding: "14px 16px", border: "1px solid #ddd6fe", marginBottom: 16 }}>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Font Preferences</div>
                          <p style={{ fontSize: 13, color: "#6d28d9", lineHeight: 1.6, margin: 0 }}>{selectedTaskDetail.fontPreferences}</p>
                        </div>
                      )}

                      {/* Design Files */}
                      {selectedTaskDetail.designFiles && selectedTaskDetail.designFiles.length > 0 && (
                        <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "14px 16px", border: "1px solid #bbf7d0", marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Uploaded Files ({selectedTaskDetail.designFiles.length})</div>
                          {selectedTaskDetail.designFiles.map(file => (
                            <div key={file._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "white", borderRadius: 8, marginBottom: 6, border: "1px solid #d1fae5" }}>
                              <CheckCircle2 size={14} color="#16a34a" />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#166534", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.fileName}</div>
                                <div style={{ fontSize: 11, color: "#4ade80" }}>{file.fileType} · v{file.version}</div>
                              </div>
                              <a href={file.fileUrl} target="_blank" rel="noreferrer" style={{ color: "#16a34a" }}><Download size={14} /></a>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ background: "white", borderRadius: 12, padding: "16px", border: "1px solid #f1f5f9" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 12 }}>Update Status</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                          {selectedTaskDetail.status === "Pending" && (
                            <button onClick={() => updateProgress(selectedTaskDetail._id, "In Progress", 10)} disabled={updatingStatus} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>
                              <AlertCircle size={14} /> Start Working
                            </button>
                          )}
                          {selectedTaskDetail.status === "Revision" && (
                            <button onClick={() => updateProgress(selectedTaskDetail._id, "In Progress")} disabled={updatingStatus} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>
                              <RefreshCw size={14} /> Start Revision
                            </button>
                          )}
                          {selectedTaskDetail.status === "Completed" && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 13, fontWeight: 700 }}>
                              <CheckCircle2 size={18} /> Task Completed!
                            </div>
                          )}
                          {selectedTaskDetail.status === "Under Review" && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 13, fontWeight: 600 }}>
                              <Eye size={16} /> Client Review mein hai
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                          <button onClick={() => setUploadTask(selectedTaskDetail)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 700, boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}>
                            <Upload size={14} /> Upload File
                          </button>
                          {["In Progress", "Revision"].includes(selectedTaskDetail.status) && selectedTaskDetail.designFiles?.some(f => f.fileType === "Final") && (
                            <button onClick={() => setSubmitReviewTask(selectedTaskDetail)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #16a34a, #22c55e)", border: "none", color: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 700, boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
                              <Send size={14} /> Submit for Review
                            </button>
                          )}
                          <button onClick={() => setCommentTask(selectedTaskDetail)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, background: "white", border: "1.5px solid #e2e8f0", color: "#64748b", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>
                            <MessageSquare size={14} /> Comments
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <FileImage size={28} color="#a78bfa" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Select a task</div>
                    <div style={{ fontSize: 12.5, color: "#94a3b8" }}>Click any task to view details</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ UPLOADS VIEW ═══════════════ */}
          {view === "uploads" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                <StatCard label="Total Tasks" value={counts.all} icon={Layers} color="#7c3aed" bg="#f5f3ff" />
                <StatCard label="In Progress" value={counts.in_progress} icon={Clock} color="#2563eb" bg="#eff6ff" />
                <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} color="#16a34a" bg="#f0fdf4" />
              </div>
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Upload Center</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Task select karo aur design file upload karo</div>
                  </div>
                  <button onClick={loadTasks} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#64748b" }}>
                    <RefreshCw size={13} /> Refresh
                  </button>
                </div>
                {loadingTasks ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}><Loader2 size={24} className="animate-spin" /></div>
                ) : (
                  <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                    {tasks.filter(t => t.status !== "Completed" && t.status !== "Cancelled").map(task => (
                      <div key={task._id} style={{ borderRadius: 12, border: "1px solid #f1f5f9", overflow: "hidden", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div style={{ padding: "14px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b", lineHeight: 1.3, flex: 1 }}>{task.title}</div>
                            <StatusBadge status={task.status} />
                          </div>
                          <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 10 }}>
                            {task.client?.companyName || task.client?.name} · {task.designType} · Due {new Date(task.deadline).toLocaleDateString()}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => { setView("tasks"); setSelectedTask(task); setUploadTask(task); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", cursor: "pointer", fontSize: 12, fontWeight: 700, boxShadow: "0 3px 10px rgba(124,58,237,0.3)" }}>
                              <Upload size={13} /> Upload File
                            </button>
                            {task.status === "In Progress" && (
                              <button onClick={() => { setView("tasks"); setSelectedTask(task); setSubmitReviewTask(task); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                                <Send size={13} /> Submit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => t.status !== "Completed" && t.status !== "Cancelled").length === 0 && (
                      <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                        Koi pending task nahi — sab complete! 🎉
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── MODALS ── */}
      {uploadTask && token && (
        <UploadModal
          task={uploadTask}
          token={token}
          onClose={() => setUploadTask(null)}
          onSuccess={() => {
            loadStats();
            if (selectedTask?._id === uploadTask._id) loadTaskDetail(uploadTask._id);
            loadTasks();
          }}
        />
      )}

      {commentTask && token && (
        <CommentModal task={commentTask} token={token} onClose={() => setCommentTask(null)} />
      )}

      {replyRevision && token && (
        <RevisionModal
          revision={replyRevision}
          token={token}
          onClose={() => setReplyRevision(null)}
          onSuccess={() => {
            if (selectedTask?._id) loadTaskDetail(selectedTask._id);
            loadStats();
            loadTasks();
          }}
        />
      )}

      {submitReviewTask && token && (
        <SubmitReviewModal
          task={submitReviewTask}
          token={token}
          onClose={() => setSubmitReviewTask(null)}
          onSuccess={() => {
            loadStats();
            loadTasks();
            if (selectedTask?._id) loadTaskDetail(selectedTask._id);
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

export default GDDashboard;

// // // import { useState, useEffect, useRef, useCallback } from "react";
// // // import { useNavigate, useLocation } from "react-router-dom";
// // // import "./SMMDashboard.css";
// // // import { Logo } from "@/components/Logo";
// // // import { Button } from "@/components/ui/button";
// // // import { Card } from "@/components/ui/card";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { toast } from "sonner";
// // // import {
// // //   Megaphone, LogOut, LayoutDashboard, Calendar,
// // //   PenSquare, BarChart3, FileImage, Plus, X,
// // //   CheckCircle2, Send, Loader2, AlertCircle,
// // //   Eye, Heart, TrendingUp, Users, Clock, Inbox,
// // //   FileText, Globe, Trash2, Edit2, RefreshCw,
// // //   LinkIcon, Palette, MessageSquare,
// // //   Bell, BellOff, Moon, Sun,
// // // } from "lucide-react";
// // // import {
// // //   clearSession, getSession,
// // //   BASE_URL,
// // //   apiGetPosts, apiCreatePost, apiSaveDraft, apiGetAnalytics,
// // //   apiGetQueuedPosts, apiGetDrafts, apiUpdateDraft, apiDeleteDraft,
// // //   apiPublishPost, apiGetOverview, apiGetSocialAccounts,
// // //   apiGetOAuthUrl, apiDisconnectSocialAccount,
// // //   apiSMMDashboard, apiSMMGetDesignProjects, apiSMMCreateDesignProject,
// // //   apiSMMDeleteDesignProject,
// // //   apiSMMApproveRejectProject, apiSMMRequestRevision,
// // //   apiSMMGetComments, apiSMMAddComment,
// // //   type Post, type OverviewRes,
// // // } from "@/lib/api";
// // // import {
// // //   LineChart, Line, ResponsiveContainer, Tooltip,
// // //   XAxis, YAxis, CartesianGrid,
// // // } from "recharts";

// // // // ─── Keys ─────────────────────────────────────────────────────────────────────
// // // const GD_TASKS_KEY  = "socialflow_gd_tasks";
// // // const DARK_MODE_KEY = "socialflow_dark_mode";
// // // const NOTIF_KEY     = "socialflow_notifications";

// // // // ─── Types ────────────────────────────────────────────────────────────────────
// // // type TaskStatus = "pending" | "in_progress" | "revision" | "completed";
// // // type Priority   = "high" | "medium" | "low";
// // // type NotifType  = "success" | "warning" | "error" | "info";
// // // type SMMView    = "overview"|"compose"|"queue"|"drafts"|"published"|"calendar"|"gd_tasks"|"design_projects"|"analytics"|"channels"|"clients_gd";

// // // interface GDTask {
// // //   id: string; title: string; description: string; clientName: string;
// // //   gdName: string;
// // //   platform: string; deadline: string; priority: Priority; status: TaskStatus;
// // //   assignedBy: string; assignedAt: string; notes?: string; revisionComment?: string;
// // // }

// // // interface DesignProject {
// // //   _id?: string; id?: string;
// // //   title: string; designType: string; priority: string; status: string;
// // //   deadline: string; description?: string;
// // //   clientId?: { _id?: string; name?: string } | string;
// // //   designerId?: { _id?: string; name?: string } | string;
// // //   revisionInfo?: { used: number; limit: number; remaining: number };
// // // }

// // // interface AppNotif {
// // //   id: string; type: NotifType; title: string; message: string;
// // //   timestamp: string; read: boolean; action?: { label: string; view: SMMView };
// // // }

// // // // Client with their connected social channels
// // // interface ClientWithChannels {
// // //   id: string;
// // //   name: string;
// // //   email: string;
// // //   channels: ConnectedChannel[];
// // //   loadingChannels?: boolean;
// // // }

// // // interface ConnectedChannel {
// // //   _id?: string;
// // //   id?: string;
// // //   platform: string;
// // //   username?: string;
// // //   name?: string;
// // //   status?: string;
// // // }

// // // // ─── Constants ────────────────────────────────────────────────────────────────
// // // const PLATFORMS = [
// // //   { id: "instagram",  label: "Instagram"  },
// // //   { id: "facebook",   label: "Facebook"   },
// // //   { id: "twitter",    label: "Twitter/X"  },
// // //   { id: "linkedin",   label: "LinkedIn"   },
// // //   { id: "youtube",    label: "YouTube"    },
// // //   { id: "pinterest",  label: "Pinterest"  },
// // // ];

// // // const CONNECTABLE_PLATFORMS = [
// // //   { id: "instagram", label: "Instagram", color: "from-pink-500 to-orange-400", icon: "📸" },
// // //   { id: "facebook",  label: "Facebook",  color: "from-blue-600 to-blue-700",   icon: "👍" },
// // //   { id: "twitter",   label: "Twitter/X", color: "from-sky-400 to-sky-500",     icon: "🐦" },
// // //   { id: "linkedin",  label: "LinkedIn",  color: "from-blue-700 to-blue-800",   icon: "💼" },
// // //   { id: "youtube",   label: "YouTube",   color: "from-red-500 to-red-600",     icon: "▶️" },
// // //   { id: "pinterest", label: "Pinterest", color: "from-red-600 to-pink-600",    icon: "📌" },
// // // ];

// // // // Queue auto-remove after 5 minutes (in ms)
// // // const QUEUE_DISPLAY_MS = 5 * 60 * 1000;

// // // // ─── Notif helper ─────────────────────────────────────────────────────────────
// // // const mkNotif = (type: NotifType, title: string, message: string, action?: AppNotif["action"]): AppNotif => ({
// // //   id: `n_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
// // //   type, title, message, timestamp: new Date().toISOString(), read: false, action,
// // // });

// // // // ─── Component ────────────────────────────────────────────────────────────────
// // // const SMMDashboard = () => {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   const session  = getSession();
// // //   const token    = session?.token ?? "";

// // //   const [view, setView] = useState<SMMView>("overview");

// // //   useEffect(() => {
// // //     const locState = location.state as { view?: string } | null;
// // //     if (locState?.view === "channels") {
// // //       setView("channels");
// // //       window.history.replaceState({}, "");
// // //     }
// // //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   const [userName, setUserName] = useState("SMM Executive");

// // //   // ── Dark Mode ──────────────────────────────────────────────────────────────
// // //   const [dark, setDark] = useState<boolean>(() => localStorage.getItem(DARK_MODE_KEY) === "true");
// // //   useEffect(() => {
// // //     localStorage.setItem(DARK_MODE_KEY, String(dark));
// // //     document.documentElement.classList.toggle("smm-dark", dark);
// // //   }, [dark]);

// // //   // ── Notifications ──────────────────────────────────────────────────────────
// // //   const [notifs, setNotifs]       = useState<AppNotif[]>(() => {
// // //     try { return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "[]"); } catch { return []; }
// // //   });
// // //   const [notifOpen, setNotifOpen] = useState(false);
// // //   const [notifTab, setNotifTab]   = useState<0|1>(0);
// // //   const notifRef                  = useRef<HTMLDivElement>(null);

// // //   const saveNotifs = useCallback((arr: AppNotif[]) => {
// // //     const t = arr.slice(0, 50);
// // //     localStorage.setItem(NOTIF_KEY, JSON.stringify(t));
// // //     return t;
// // //   }, []);

// // //   const pushNotif = useCallback((n: AppNotif) => {
// // //     setNotifs(prev => saveNotifs([n, ...prev]));
// // //   }, [saveNotifs]);

// // //   const markAllRead = () => setNotifs(prev => saveNotifs(prev.map(n => ({ ...n, read: true }))));
// // //   const clearNotifs = () => { setNotifs([]); localStorage.removeItem(NOTIF_KEY); };
// // //   const deleteNotif = (id: string) => setNotifs(prev => saveNotifs(prev.filter(n => n.id !== id)));
// // //   const unreadCount = notifs.filter(n => !n.read).length;

// // //   useEffect(() => {
// // //     if (!notifOpen) return;
// // //     const h = (e: MouseEvent) => {
// // //       if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
// // //     };
// // //     document.addEventListener("mousedown", h);
// // //     return () => document.removeEventListener("mousedown", h);
// // //   }, [notifOpen]);

// // //   // ── API state ──────────────────────────────────────────────────────────────
// // //   const [overview, setOverview]         = useState<OverviewRes | null>(null);
// // //   const [overviewLoading, setOvLoading] = useState(false);
// // //   const [smmDashData, setSmmDashData]   = useState<any>(null);

// // //   // clientList and gdList — extracted from design projects API
// // //   const [clientList, setClientList]     = useState<{ id:string; name:string; email:string }[]>([]);
// // //   const [gdList, setGdList]             = useState<{ id:string; name:string; email:string }[]>([]);

// // //   // Clients with their channels (for Channels view)
// // //   const [clientsWithChannels, setClientsWithChannels]   = useState<ClientWithChannels[]>([]);
// // //   const [clientChannelsLoading, setClientChannelsLoading] = useState(false);

// // //   const [designProjects, setDesignProjects]   = useState<DesignProject[]>([]);
// // //   const [designLoading,  setDesignLoading]    = useState(false);
// // //   const [showAddDesign,  setShowAddDesign]    = useState(false);
// // //   const [designFilter,   setDesignFilter]    = useState("");
// // //   const [newDP, setNewDP] = useState({
// // //     clientId:"", designerId:"", title:"", designType:"Social Post",
// // //     deadline:"", priority:"Medium", description:"",
// // //     targetAudience:"", brandColors:"", fontPreferences:"", revisionLimit:3,
// // //   });
// // //   const [dpSaving, setDpSaving]               = useState(false);
// // //   const [selProject, setSelProject]           = useState<DesignProject | null>(null);
// // //   const [projComments, setProjComments]       = useState<any[]>([]);
// // //   const [newComment, setNewComment]           = useState("");
// // //   const [commentSending, setCommentSending]   = useState(false);

// // //   const [posts, setPosts]               = useState<Post[]>([]);
// // //   const [postsLoading, setPostsLoading] = useState(false);
// // //   const [postsError, setPostsError]     = useState<string | null>(null);

// // //   // Queue: track publishedAt for instant posts, auto-remove after 5 min
// // //   const [queuedPosts, setQueuedPosts]   = useState<(Post & { queuedAt?: number })[]>([]);
// // //   const [queueLoading, setQueueLoading] = useState(false);
// // //   const [publishingId, setPublishingId] = useState<string | null>(null);

// // //   const [drafts, setDrafts]             = useState<Post[]>([]);
// // //   const [draftsLoading, setDraftsLoading] = useState(false);
// // //   const [deletingDid, setDeletingDid]   = useState<string | null>(null);

// // //   const [pubPosts, setPubPosts]         = useState<Post[]>([]);
// // //   const [pubLoading, setPubLoading]     = useState(false);

// // //   // My agency's own channels
// // //   const [channels, setChannels]               = useState<any[]>([]);
// // //   const [channelsLoading, setChanLoading]     = useState(false);
// // //   const [disconnectingId, setDiscId]          = useState<string | null>(null);
// // //   const [connectingPlatform, setConnPlat]     = useState<string | null>(null);

// // //   const [analytics, setAnalytics]             = useState<any>(null);
// // //   const [analyticsLoading, setAnaLoading]     = useState(false);

// // //   // ── Compose state ──────────────────────────────────────────────────────────
// // //   const [composeContent, setComposeContent]   = useState("");
// // //   // Selected client for this post
// // //   const [composeClientId, setComposeClientId] = useState("");
// // //   // Channels of the selected client
// // //   const [clientConnectedChannels, setClientConnectedChannels] = useState<ConnectedChannel[]>([]);
// // //   const [clientChannelsFetching, setClientChannelsFetching]   = useState(false);
// // //   const [composePlatforms, setComposePlatforms] = useState<string[]>([]);
// // //   const [composeScheduleDate, setComposeScheduleDate] = useState("");
// // //   const [composeScheduleTime, setComposeScheduleTime] = useState("");
// // //   const [composeSaving, setComposeSaving]     = useState(false);
// // //   const [composeMedia, setComposeMedia]       = useState<File | null>(null);
// // //   const [composePreview, setComposePreview]   = useState<string | null>(null);
// // //   const [composeTags, setComposeTags]         = useState<string[]>([]);
// // //   const [composeTagInput, setComposeTagInput] = useState("");
// // //   const [editingDraft, setEditingDraft]       = useState<Post | null>(null);

// // //   // GD Tasks (local storage based)
// // //   const [gdTasks, setGdTasks]           = useState<GDTask[]>([]);
// // //   const completedGDCount = gdTasks.filter(t => t.status === "completed").length;
// // //   const totalBadgeCount = (notifs.filter(n => !n.read).length) + completedGDCount;
// // //   const [showAddTask, setShowAddTask]   = useState(false);
// // //   const [newTask, setNewTask] = useState({
// // //     title:"", description:"", clientName:"", gdName:"",
// // //     platform:"Instagram", deadline:"", priority:"medium" as Priority, notes:"",
// // //   });

// // //   const [calMonth, setCalMonth] = useState(new Date());
// // //   const prevGDTasksRef = useRef<GDTask[]>([]);

// // //   // Connecting channel state per client
// // //   const [connectingForClient, setConnectingForClient] = useState<string|null>(null);

// // //   // ── Auto-remove instant posts from queue after 5 min ──────────────────────
// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       const now = Date.now();
// // //       setQueuedPosts(prev => {
// // //         const filtered = prev.filter(p => {
// // //           // If post has no scheduleAt, it's an instant post — remove after QUEUE_DISPLAY_MS
// // //           const isInstant = !p.scheduleAt && !p.scheduled_at;
// // //           if (isInstant && p.queuedAt && (now - p.queuedAt) >= QUEUE_DISPLAY_MS) {
// // //             return false;
// // //           }
// // //           return true;
// // //         });
// // //         return filtered;
// // //       });
// // //     }, 10_000); // check every 10s
// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   // Watch for GD tasks becoming completed → push notification
// // //   useEffect(() => {
// // //     const prev = prevGDTasksRef.current;
// // //     if (prev.length > 0) {
// // //       gdTasks.forEach(task => {
// // //         const prevTask = prev.find(t => t.id === task.id);
// // //         if (prevTask && prevTask.status !== "completed" && task.status === "completed") {
// // //           pushNotif(mkNotif("info", "GD Task Completed! 🎨",
// // //             `"${task.title}" by ${task.gdName} is ready for review`,
// // //             { label: "Review Now", view: "gd_tasks" }));
// // //         }
// // //       });
// // //     }
// // //     prevGDTasksRef.current = gdTasks;
// // //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [gdTasks]);

// // //   // ── Init ────────────────────────────────────────────────────────────────────
// // //   useEffect(() => {
// // //     const name = localStorage.getItem("socialflow_user_name") || "SMM Executive";
// // //     setUserName(name);
// // //     const stored = localStorage.getItem(GD_TASKS_KEY);
// // //     if (stored) setGdTasks(JSON.parse(stored));
// // //     if (token) {
// // //       loadOverview();
// // //       loadPosts();
// // //       loadSMMDashboard();
// // //       loadUsersForDropdowns();
// // //     }
// // //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [token]);

// // //   useEffect(() => {
// // //     if (!token) return;
// // //     if (view === "overview")        { loadOverview(); loadPosts(); }
// // //     if (view === "queue")           loadQueued();
// // //     if (view === "drafts")          loadDrafts();
// // //     if (view === "published")       loadPublished();
// // //     if (view === "analytics")       loadAnalytics();
// // //     if (view === "calendar")        loadPosts();
// // //     if (view === "channels")        { loadChannels(); loadClientsWithChannels(); }
// // //     if (view === "design_projects") loadDesignProjects();
// // //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [view]);

// // //   // When client changes in compose, fetch their channels
// // //   useEffect(() => {
// // //     if (composeClientId) fetchClientChannels(composeClientId);
// // //     else { setClientConnectedChannels([]); setComposePlatforms([]); }
// // //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [composeClientId]);

// // //   // ── Loaders ─────────────────────────────────────────────────────────────────
// // //   const loadOverview = async () => {
// // //     setOvLoading(true);
// // //     try { const { data } = await apiGetOverview(token); if (data) setOverview(data); } catch {}
// // //     setOvLoading(false);
// // //   };

// // //   const loadSMMDashboard = async () => {
// // //     const { data } = await apiSMMDashboard(token);
// // //     if (data) {
// // //       const d = (data as any)?.data ?? data;
// // //       setSmmDashData(d);
// // //       extractUsers((d as any)?.recentProjects ?? []);
// // //     }
// // //   };

// // //   const extractUsers = (projects: any[]) => {
// // //     if (!Array.isArray(projects) || !projects.length) return;
// // //     const cm = new Map<string,{id:string;name:string;email:string}>();
// // //     const gm = new Map<string,{id:string;name:string;email:string}>();
// // //     projects.forEach((p:any) => {
// // //       const c = p.clientId;
// // //       if (c && typeof c==="object" && c._id)
// // //         cm.set(c._id, {id:c._id, name:c.name||"Client", email:c.email||""});
// // //       const g = p.designerId;
// // //       if (g && typeof g==="object" && g._id)
// // //         gm.set(g._id, {id:g._id, name:g.name||"Designer", email:g.email||""});
// // //     });
// // //     if (cm.size) setClientList(prev => {
// // //       const m=new Map(prev.map(x=>[x.id,x])); cm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
// // //     });
// // //     if (gm.size) setGdList(prev => {
// // //       const m=new Map(prev.map(x=>[x.id,x])); gm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
// // //     });
// // //   };

// // //   const loadUsersForDropdowns = async () => {
// // //     const sc = localStorage.getItem("socialflow_clients");
// // //     const st = localStorage.getItem("socialflow_team_members");
// // //     if (sc) { try { const p:any[]=JSON.parse(sc); if(p.length) setClientList(p.map(c=>({id:c.id||c._id,name:c.name,email:c.email||""}))); } catch {} }
// // //     if (st) { try { const p:any[]=JSON.parse(st); const gds=p.filter(m=>m.role==="graphic_designer"||m.role==="GD"); if(gds.length) setGdList(gds.map(g=>({id:g.id||g._id,name:g.name,email:g.email||""}))); } catch {} }
// // //     const { data } = await apiSMMGetDesignProjects(token,{limit:100});
// // //     const raw=data as any;
// // //     const projects=raw?.data?.projects??raw?.projects??raw?.data??[];
// // //     if(Array.isArray(projects)&&projects.length) extractUsers(projects);
// // //   };

// // //   // Fetch channels for a specific client (by clientId)
// // //  const fetchClientChannels = async (clientId: string) => {
// // //   if (!clientId) return;
// // //   setClientChannelsFetching(true);
// // //   try {
// // //     const endpoints = [
// // //       `${BASE_URL}/api/social-accounts?userId=${clientId}`,
// // //       `${BASE_URL}/api/social-accounts?clientId=${clientId}`,
// // //       `${BASE_URL}/api/clients/${clientId}/social-accounts`,
// // //       `${BASE_URL}/api/clients/${clientId}/channels`,
// // //     ];
// // //     let found: ConnectedChannel[] = [];
// // //     for (const url of endpoints) {
// // //       try {
// // //         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// // //         if (res.ok) {
// // //           const json = await res.json();
// // //           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// // //           const arr = Array.isArray(raw) ? raw : [];
// // //           if (arr.length > 0) { found = arr; break; }
// // //         }
// // //       } catch { /* try next */ }
// // //     }
// // //     setClientConnectedChannels(found);
// // //     setComposePlatforms([]);
// // //   } catch {
// // //     setClientConnectedChannels([]);
// // //   }
// // //   setClientChannelsFetching(false);
// // // };

// // //   // Load all clients and their channels for Channels view
// // // const loadClientsWithChannels = async () => {
// // //   setClientChannelsLoading(true);

// // //   // FIX: don't rely on stale clientList state — fetch fresh
// // //   let clients = clientList;
// // //   if (clients.length === 0) {
// // //     const { data } = await apiSMMGetDesignProjects(token, { limit: 100 });
// // //     const raw = data as any;
// // //     const projects = raw?.data?.projects ?? raw?.projects ?? raw?.data ?? [];
// // //     const cm = new Map<string, { id: string; name: string; email: string }>();
// // //     if (Array.isArray(projects)) {
// // //       projects.forEach((p: any) => {
// // //         const c = p.clientId;
// // //         if (c && typeof c === "object" && c._id)
// // //           cm.set(c._id, { id: c._id, name: c.name || "Client", email: c.email || "" });
// // //       });
// // //     }
// // //     clients = Array.from(cm.values());
// // //     if (clients.length > 0) setClientList(clients); // update state too
// // //   }

// // //   if (clients.length === 0) { setClientChannelsLoading(false); return; }

// // //   const updated: ClientWithChannels[] = [];
// // //   for (const client of clients) {
// // //     // FIX: try multiple endpoint patterns
// // //     const endpoints = [
// // //       `${BASE_URL}/api/social-accounts?userId=${client.id}`,
// // //       `${BASE_URL}/api/social-accounts?clientId=${client.id}`,
// // //       `${BASE_URL}/api/clients/${client.id}/social-accounts`,
// // //       `${BASE_URL}/api/clients/${client.id}/channels`,
// // //     ];
// // //     let channels: ConnectedChannel[] = [];
// // //     for (const url of endpoints) {
// // //       try {
// // //         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// // //         if (res.ok) {
// // //           const json = await res.json();
// // //           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// // //           const arr = Array.isArray(raw) ? raw : [];
// // //           if (arr.length > 0) { channels = arr; break; }
// // //         }
// // //       } catch { /* try next */ }
// // //     }
// // //     updated.push({ ...client, channels });
// // //   }
// // //   setClientsWithChannels(updated);
// // //   setClientChannelsLoading(false);
// // // };

// // //   const loadDesignProjects = async () => {
// // //     setDesignLoading(true);
// // //     const { data, error } = await apiSMMGetDesignProjects(token, designFilter ? {status:designFilter} : undefined);
// // //     if (error) { toast.error("Load failed: "+error); pushNotif(mkNotif("error","Projects Load Failed",error)); }
// // //     else {
// // //       const raw=data as any;
// // //       const list=raw?.data?.projects??raw?.projects??raw?.data??(Array.isArray(raw)?raw:[]);
// // //       const arr=Array.isArray(list)?list:[];
// // //       setDesignProjects(arr); extractUsers(arr);
// // //     }
// // //     setDesignLoading(false);
// // //   };

// // //   const loadPosts = async () => {
// // //     setPostsLoading(true); setPostsError(null);
// // //     const { data, error } = await apiGetPosts(token);
// // //     if (error) { if(!error.includes("404")&&!error.includes("not found")) setPostsError(error); }
// // //     else {
// // //       const raw=data as any;
// // //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// // //       setPosts(Array.isArray(list)?list:[]);
// // //     }
// // //     setPostsLoading(false);
// // //   };

// // //   const loadQueued = async () => {
// // //     setQueueLoading(true);
// // //     const { data, error } = await apiGetQueuedPosts(token);
// // //     if (error) toast.error("Queue load failed: "+error);
// // //     else {
// // //       const raw=data as any;
// // //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// // //       const arr: (Post & { queuedAt?: number })[] = Array.isArray(list) ? list : [];
// // //       // Preserve existing queuedAt timestamps for posts already in state
// // //       const merged = arr.map(p => {
// // //         const existing = queuedPosts.find(q => (q._id??q.id) === (p._id??p.id));
// // //         return existing ? { ...p, queuedAt: existing.queuedAt } : { ...p, queuedAt: Date.now() };
// // //       });
// // //       if (merged.length > queuedPosts.length && queuedPosts.length > 0)
// // //         pushNotif(mkNotif("info","Queue Updated",`${merged.length-queuedPosts.length} new post(s) added to queue`,{label:"View Queue",view:"queue"}));
// // //       setQueuedPosts(merged);
// // //     }
// // //     setQueueLoading(false);
// // //   };

// // //   const loadDrafts = async () => {
// // //     setDraftsLoading(true);
// // //     const { data, error } = await apiGetDrafts(token);
// // //     if (error) toast.error("Drafts load failed: "+error);
// // //     else {
// // //       const raw=data as any;
// // //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// // //       setDrafts(Array.isArray(list)?list:[]);
// // //     }
// // //     setDraftsLoading(false);
// // //   };

// // //   const loadPublished = async () => {
// // //     setPubLoading(true);
// // //     const { data, error } = await apiGetPosts(token, "published");
// // //     if (error) toast.error("Published load failed: "+error);
// // //     else {
// // //       const raw=data as any;
// // //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// // //       setPubPosts(Array.isArray(list)?list:[]);
// // //     }
// // //     setPubLoading(false);
// // //   };

// // //   const loadAnalytics = async () => {
// // //     setAnaLoading(true);
// // //     const { data } = await apiGetAnalytics(token,"7d");
// // //     if (data?.data) setAnalytics(data.data);
// // //     setAnaLoading(false);
// // //   };

// // //   const loadChannels = async () => {
// // //     setChanLoading(true);
// // //     const { data, error } = await apiGetSocialAccounts(token);
// // //     if (error) toast.error("Channels load failed: "+error);
// // //     else {
// // //       const raw=data as any;
// // //       const list=raw?.channels??raw?.accounts??raw?.data??(Array.isArray(raw)?raw:[]);
// // //       setChannels(Array.isArray(list)?list:[]);
// // //     }
// // //     setChanLoading(false);
// // //   };

// // //   // ── Actions ─────────────────────────────────────────────────────────────────
// // //   const handleLogout = () => {
// // //     clearSession(); localStorage.removeItem("socialflow_role"); navigate("/"); toast.success("Logged out successfully");
// // //   };

// // //   const togglePlat = (id:string) => setComposePlatforms(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);

// // //   const handleCompose = async (action:"draft"|"queue"|"schedule") => {
// // //     if (!composeContent.trim()) { toast.error("Please add some content"); return; }
// // //     if (action!=="draft"&&composePlatforms.length===0) { toast.error("Please select at least one platform"); return; }
// // //     if (action!=="draft"&&!composeClientId) { toast.error("Please select a client"); return; }
// // //     setComposeSaving(true);
// // //     try {
// // //       if (action==="draft") {
// // //         if (editingDraft) {
// // //           const id=editingDraft._id??editingDraft.id??"";
// // //           const {error}=await apiUpdateDraft(token,id,composeContent,composePlatforms,composeMedia?[composeMedia]:[]);
// // //           if(error){toast.error("Update failed: "+error);return;}
// // //           toast.success("Draft updated!");
// // //           pushNotif(mkNotif("success","Draft Updated","Draft saved successfully",{label:"View Drafts",view:"drafts"}));
// // //         } else {
// // //           const {error}=await apiSaveDraft(token,composeContent,composePlatforms,composeTags,composeMedia?[composeMedia]:[]);
// // //           if(error){toast.error("Save failed: "+error);return;}
// // //           toast.success("Draft saved!");
// // //           pushNotif(mkNotif("success","Draft Saved","New draft saved",{label:"View Drafts",view:"drafts"}));
// // //         }
// // //         resetCompose(); setView("drafts");
// // //       } else {
// // //         let schedAt: string | null = null;
// // //         if (composeScheduleDate && composeScheduleTime) {
// // //           schedAt = new Date(`${composeScheduleDate}T${composeScheduleTime}`).toISOString();
// // //         } else if (composeScheduleDate) {
// // //           schedAt = new Date(`${composeScheduleDate}T00:00`).toISOString();
// // //         }
// // //         const {error}=await apiCreatePost(
// // //           token, composeContent, composePlatforms, composeTags,
// // //           composeMedia?[composeMedia]:[], schedAt??"",
// // //           // pass clientId so the backend publishes on client's channels
// // //           { clientId: composeClientId }
// // //         );
// // //         if(error){toast.error("Post failed: "+error);return;}
// // //         const isScheduled = !!schedAt;
// // //         toast.success(isScheduled?"Post scheduled!":"Post added to queue!");
// // //         pushNotif(mkNotif("success",isScheduled?"Post Scheduled":"Post Queued",
// // //           isScheduled?`Will publish on ${new Date(schedAt!).toLocaleString("en-IN")}`:"Instant post added to queue — will publish in ~5 minutes",
// // //           {label:"View Queue",view:"queue"}));
// // //         resetCompose(); setView("queue");
// // //         // Refresh queue immediately
// // //         setTimeout(() => loadQueued(), 500);
// // //       }
// // //     } catch { toast.error("Network error"); }
// // //     finally { setComposeSaving(false); }
// // //   };

// // //   const resetCompose = () => {
// // //     setComposeContent(""); setComposePlatforms([]);
// // //     setComposeScheduleDate(""); setComposeScheduleTime("");
// // //     setComposeMedia(null); setComposePreview(null);
// // //     setEditingDraft(null); setComposeTags([]); setComposeTagInput("");
// // //     setComposeClientId(""); setClientConnectedChannels([]);
// // //   };

// // //   const handleTagKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
// // //     if (e.key==="Enter"||e.key===","||e.key===" ") {
// // //       e.preventDefault();
// // //       const t=composeTagInput.trim().replace(/^#/,"");
// // //       if(t&&!composeTags.includes(t)) setComposeTags(p=>[...p,t]);
// // //       setComposeTagInput("");
// // //     }
// // //   };

// // //   const handlePublishNow = async (pid:string) => {
// // //     setPublishingId(pid);
// // //     const {error}=await apiPublishPost(token,pid);
// // //     if(error){
// // //       toast.error("Publish failed: "+error);
// // //       pushNotif(mkNotif("error","Publish Failed",error));
// // //     } else {
// // //       toast.success("Post published!");
// // //       pushNotif(mkNotif("success","Published! 🎉","Post published successfully",{label:"View Published",view:"published"}));
// // //       // Remove from queue immediately
// // //       setQueuedPosts(prev => prev.filter(p => (p._id??p.id) !== pid));
// // //       loadOverview();
// // //     }
// // //     setPublishingId(null);
// // //   };

// // //   const handleDeleteDraft = async (id:string) => {
// // //     if(!confirm("Are you sure you want to delete this draft?")) return;
// // //     setDeletingDid(id);
// // //     const {error}=await apiDeleteDraft(token,id);
// // //     if(error) toast.error("Delete failed: "+error);
// // //     else{toast.success("Draft deleted!");pushNotif(mkNotif("warning","Draft Deleted","A draft was deleted"));loadDrafts();}
// // //     setDeletingDid(null);
// // //   };

// // //   const handleEditDraft = (d:Post) => {
// // //     setEditingDraft(d); setComposeContent(d.content); setComposePlatforms(d.platforms??[]);
// // //     setView("compose");
// // //   };

// // //   // Connect a channel for a specific client
// // // const handleConnectForClient = async (platId: string, clientId: string) => {
// // //   const key = `${clientId}_${platId}`;
// // //   setConnectingForClient(key);
// // //   const { data, error } = await apiGetOAuthUrl(token, platId);
// // //   if (error) { toast.error("OAuth failed: " + error); setConnectingForClient(null); return; }
// // //   const url = (data as any)?.authUrl ?? (data as any)?.url ?? (data as any)?.redirectUrl;
// // //   const oauthState = (data as any)?.state ?? (data as any)?.oauthState ?? null;
// // //   if (url) {
// // //     localStorage.setItem("oauth_platform", platId);
// // //     localStorage.setItem("oauth_client_id", clientId);
// // //     if (oauthState) localStorage.setItem("oauth_state", oauthState);
// // //     // window.open(url, "_blank");
// // //     window.location.href = url;
// // //     pushNotif(mkNotif("info", "Platform Connect", `Connecting ${platId} for client...`, { label: "View Channels", view: "channels" }));

// // //     // ✅ FIX: Refresh channels when user comes back after OAuth
// // //     const refreshOnFocus = () => {
// // //       window.removeEventListener("focus", refreshOnFocus);
// // //       setTimeout(() => {
// // //         loadClientsWithChannels();
// // //         if (composeClientId === clientId) fetchClientChannels(clientId);
// // //       }, 1500);
// // //     };
// // //     window.addEventListener("focus", refreshOnFocus);
// // //   } else toast.error("No OAuth URL returned");
// // //   setConnectingForClient(null);
// // // };

// // //   // Disconnect a channel for a client
// // //   const handleDisconnectClientChannel = async (channelId:string, clientId:string) => {
// // //     if(!confirm("Are you sure you want to disconnect this account?")) return;
// // //     const {error}=await apiDisconnectSocialAccount(token,channelId);
// // //     if(error) toast.error("Disconnect failed: "+error);
// // //     else{
// // //       toast.success("Disconnected!");
// // //       pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));
// // //       // Update local state
// // //       setClientsWithChannels(prev => prev.map(c =>
// // //         c.id === clientId
// // //           ? { ...c, channels: c.channels.filter(ch => (ch._id??ch.id) !== channelId) }
// // //           : c
// // //       ));
// // //       // Also refresh compose client channels if needed
// // //       if(composeClientId === clientId) fetchClientChannels(clientId);
// // //     }
// // //   };

// // //   const handleConnect = async (platId:string) => {
// // //     setConnPlat(platId);
// // //     const {data,error}=await apiGetOAuthUrl(token,platId);
// // //     if(error){toast.error("OAuth failed: "+error);setConnPlat(null);return;}
// // //     const url=(data as any)?.authUrl??(data as any)?.url??(data as any)?.redirectUrl;
// // //     const oauthState=(data as any)?.state??(data as any)?.oauthState??null;
// // //     if(url){
// // //       localStorage.setItem("oauth_platform", platId);
// // //       if(oauthState) localStorage.setItem("oauth_state", oauthState);
// // //       // window.open(url,"_blank");
// // //       window.location.href = url;
// // //       pushNotif(mkNotif("info","Platform Connect",`Connecting ${platId}...`,{label:"View Channels",view:"channels"}));
// // //     } else toast.error("No OAuth URL returned");
// // //     setConnPlat(null);
// // //   };

// // //   const handleDisconnect = async (cid:string) => {
// // //     if(!confirm("Are you sure you want to disconnect this account?")) return;
// // //     setDiscId(cid);
// // //     const {error}=await apiDisconnectSocialAccount(token,cid);
// // //     if(error) toast.error("Disconnect failed: "+error);
// // //     else{toast.success("Disconnected!");pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));loadChannels();}
// // //     setDiscId(null);
// // //   };

// // //   const handleCreateDP = async (e:React.FormEvent) => {
// // //     e.preventDefault();
// // //     if(!newDP.clientId||!newDP.designerId||!newDP.title||!newDP.deadline){toast.error("Please fill all required fields");return;}
// // //     setDpSaving(true);
// // //     const {error}=await apiSMMCreateDesignProject(token,{...newDP});
// // //     if(error) toast.error("Create failed: "+error);
// // //     else{
// // //       toast.success("Project created!");
// // //       pushNotif(mkNotif("success","Project Created",`"${newDP.title}" assigned to designer`,{label:"View Projects",view:"design_projects"}));
// // //       setShowAddDesign(false);
// // //       setNewDP({clientId:"",designerId:"",title:"",designType:"Social Post",deadline:"",priority:"Medium",description:"",targetAudience:"",brandColors:"",fontPreferences:"",revisionLimit:3});
// // //       loadDesignProjects();
// // //     }
// // //     setDpSaving(false);
// // //   };

// // //   const handleDeleteDP = async (id:string) => {
// // //     if(!confirm("Are you sure you want to delete this project?")) return;
// // //     const {error}=await apiSMMDeleteDesignProject(token,id);
// // //     if(error) toast.error("Delete failed: "+error);
// // //     else{toast.success("Deleted!");pushNotif(mkNotif("warning","Project Deleted","Design project deleted"));loadDesignProjects();}
// // //   };

// // //   const handleApproveReject = async (id:string, act:"approve"|"reject") => {
// // //     const note=prompt(act==="approve"?"Approval note (optional):":"Rejection reason:");
// // //     if(act==="reject"&&!note) return;
// // //     const {error}=await apiSMMApproveRejectProject(token,id,act,note??"");
// // //     if(error) toast.error("Action failed: "+error);
// // //     else{
// // //       toast.success(act==="approve"?"Approved!":"Rejected!");
// // //       pushNotif(mkNotif(act==="approve"?"success":"warning",act==="approve"?"Project Approved":"Project Rejected","Design project "+act+"ed",{label:"View Projects",view:"design_projects"}));
// // //       loadDesignProjects();
// // //     }
// // //   };

// // //   const handleRevisionReq = async (id:string) => {
// // //     const msg=prompt("Please enter revision details:");
// // //     if(!msg) return;
// // //     const {error}=await apiSMMRequestRevision(token,id,msg);
// // //     if(error) toast.error("Revision failed: "+error);
// // //     else{toast.success("Revision request sent!");pushNotif(mkNotif("info","Revision Requested","Revision request sent to designer",{label:"View Projects",view:"design_projects"}));loadDesignProjects();}
// // //   };

// // //   const openProjectDetail = async (project:DesignProject) => {
// // //     setSelProject(project);
// // //     const pid=project._id??project.id??"";
// // //     const {data}=await apiSMMGetComments(token,pid);
// // //     const raw=data as any;
// // //     const list=raw?.data??raw?.comments??[];
// // //     setProjComments(Array.isArray(list)?list:[]);
// // //   };

// // //   const handleSendComment = async () => {
// // //     if(!newComment.trim()||!selProject) return;
// // //     setCommentSending(true);
// // //     const pid=selProject._id??selProject.id??"";
// // //     const {error}=await apiSMMAddComment(token,pid,newComment);
// // //     if(error) toast.error("Comment failed: "+error);
// // //     else{toast.success("Comment sent!");setNewComment("");openProjectDetail(selProject);}
// // //     setCommentSending(false);
// // //   };

// // //   const handleAssignTask = (e:React.FormEvent) => {
// // //     e.preventDefault();
// // //     if(!newTask.title||!newTask.clientName||!newTask.deadline){toast.error("Please fill all required fields");return;}
// // //     const task:GDTask={
// // //       id:"T"+Date.now().toString().slice(-6), ...newTask,
// // //       status:"pending", assignedBy:`${userName} (SMM)`,
// // //       assignedAt:new Date().toISOString().split("T")[0],
// // //     };
// // //     const upd=[task,...gdTasks];
// // //     setGdTasks(upd);
// // //     localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
// // //     setShowAddTask(false);
// // //     setNewTask({title:"",description:"",clientName:"",gdName:"",platform:"Instagram",deadline:"",priority:"medium",notes:""});
// // //     toast.success("Task assigned!");
// // //     pushNotif(mkNotif("success","Task Assigned",`"${task.title}" assigned to designer`,{label:"GD Tasks",view:"gd_tasks"}));
// // //   };

// // //   const handleRevision = (tid:string, comment:string) => {
// // //     const upd=gdTasks.map(t=>t.id===tid?{...t,status:"revision" as TaskStatus,revisionComment:comment}:t);
// // //     setGdTasks(upd); localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
// // //     toast.success("Revision request sent");
// // //     pushNotif(mkNotif("info","Revision Requested","Revision requested for GD task",{label:"GD Tasks",view:"gd_tasks"}));
// // //   };

// // //   const handleGDTaskApproveReject = (taskId: string, action: "approve"|"reject") => {
// // //     const upd = gdTasks.map(t =>
// // //       t.id === taskId
// // //         ? { ...t, status: (action === "approve" ? "completed" : "revision") as TaskStatus }
// // //         : t
// // //     );
// // //     setGdTasks(upd);
// // //     localStorage.setItem(GD_TASKS_KEY, JSON.stringify(upd));
// // //     toast.success(action === "approve" ? "Task approved!" : "Task sent for revision!");
// // //     pushNotif(mkNotif(
// // //       action === "approve" ? "success" : "warning",
// // //       action === "approve" ? "Task Approved ✅" : "Task Rejected",
// // //       action === "approve" ? "GD task approved and marked complete" : "GD task sent back for revision",
// // //       { label: "GD Tasks", view: "gd_tasks" }
// // //     ));
// // //     setNotifOpen(false);
// // //   };

// // //   // ── Computed ─────────────────────────────────────────────────────────────────
// // //   const taskCounts = {
// // //     pending:     gdTasks.filter(t=>t.status==="pending").length,
// // //     in_progress: gdTasks.filter(t=>t.status==="in_progress").length,
// // //     revision:    gdTasks.filter(t=>t.status==="revision").length,
// // //     completed:   gdTasks.filter(t=>t.status==="completed").length,
// // //   };

// // //   const calDays = (() => {
// // //     const y=calMonth.getFullYear(), m=calMonth.getMonth();
// // //     const off=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
// // //     const cells:(Date|null)[]= [];
// // //     for(let i=0;i<off;i++) cells.push(null);
// // //     for(let d=1;d<=dim;d++) cells.push(new Date(y,m,d));
// // //     while(cells.length%7!==0) cells.push(null);
// // //     return cells;
// // //   })();

// // //   const postsForDay=(d:Date)=>posts.filter(p=>{
// // //     const ds=p.scheduleAt??p.scheduled_at??p.createdAt;
// // //     if(!ds)return false;
// // //     const pd=new Date(ds);
// // //     return pd.getFullYear()===d.getFullYear()&&pd.getMonth()===d.getMonth()&&pd.getDate()===d.getDate();
// // //   });

// // //   const weeklyData = analytics?.weeklyData?.length
// // //     ? analytics.weeklyData
// // //     : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>({day,reach:0,engagement:0}));

// // //   const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];

// // //   const ovTotal     = overview?.total     ?? (overview?.data as any)?.total     ?? posts.length;
// // //   const ovPublished = overview?.published ?? (overview?.data as any)?.published ?? posts.filter(p=>p.status==="published").length;
// // //   const ovScheduled = overview?.scheduled ?? (overview?.data as any)?.scheduled ?? posts.filter(p=>p.status==="scheduled").length;
// // //   const ovFailed    = overview?.failed    ?? (overview?.data as any)?.failed    ?? posts.filter(p=>p.status==="failed").length;

// // //   // Queue time remaining helper
// // //   const queueTimeLeft = (p: Post & { queuedAt?: number }): string | null => {
// // //     if (p.scheduleAt || p.scheduled_at) return null; // scheduled post — show schedule time
// // //     if (!p.queuedAt) return null;
// // //     const remaining = QUEUE_DISPLAY_MS - (Date.now() - p.queuedAt);
// // //     if (remaining <= 0) return "Publishing soon...";
// // //     const mins = Math.floor(remaining / 60000);
// // //     const secs = Math.floor((remaining % 60000) / 1000);
// // //     return `Publishing in ${mins}m ${secs}s`;
// // //   };

// // //   const navItems:{key:SMMView;icon:React.ElementType;label:string}[] = [
// // //     {key:"overview",        icon:LayoutDashboard, label:"Overview"},
// // //     {key:"compose",         icon:PenSquare,       label:"Create Post"},
// // //     {key:"queue",           icon:Inbox,           label:"Queue"},
// // //     {key:"drafts",          icon:FileText,        label:"Drafts"},
// // //     {key:"published",       icon:Globe,           label:"Published"},
// // //     {key:"calendar",        icon:Calendar,        label:"Calendar"},
// // //     {key:"design_projects", icon:Palette,         label:"Design Projects"},
// // //     {key:"gd_tasks",        icon:FileImage,       label:"GD Tasks"},
// // //     {key:"analytics",       icon:BarChart3,       label:"Analytics"},
// // //     {key:"channels",        icon:LinkIcon,        label:"Channels"},
// // //     {key:"clients_gd",      icon:Users,           label:"Clients & GD"},
// // //   ];

// // //   const viewTitle:Record<SMMView,string>={
// // //     overview:"SMM Dashboard", compose:editingDraft?"Edit Draft":"Create Post",
// // //     queue:"Queue", drafts:"Drafts", published:"Published",
// // //     calendar:"Content Calendar", gd_tasks:"GD Tasks",
// // //     design_projects:"Design Projects", analytics:"Analytics", channels:"Channels",
// // //     clients_gd:"Clients & Graphic Designers",
// // //   };

// // //   const statusBadge=(s:string)=>{
// // //     const m:Record<string,string>={
// // //       draft:"bg-yellow-100 text-yellow-700",
// // //       scheduled:"bg-blue-100 text-blue-700",
// // //       published:"bg-green-100 text-green-700",
// // //       failed:"bg-red-100 text-red-700",
// // //       queued:"bg-purple-100 text-purple-700",
// // //     };
// // //     return m[s]??"bg-slate-100 text-slate-600";
// // //   };
// // //   const notifIcon=(t:NotifType)=>({success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"}[t]);

// // //   // ── RENDER ───────────────────────────────────────────────────────────────────
// // //   return (
// // //     <div className={`smm-root min-h-screen flex ${dark?"smm-dark":""}`}>

// // //       {/* ── Sidebar ── */}
// // //       <aside className="smm-sidebar hidden md:flex w-64 flex-col shrink-0">
// // //         <div className="p-5 border-b smm-border"><Logo /></div>
// // //         <div className="p-4 flex-1">
// // //           <div className="smm-profile-card flex items-center gap-3 p-3 rounded-xl mb-4 border">
// // //             <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
// // //               <Megaphone className="w-5 h-5 text-white" />
// // //             </div>
// // //             <div className="min-w-0">
// // //               <div className="text-sm font-semibold smm-text-primary truncate">{userName}</div>
// // //               <div className="text-xs text-green-600 font-medium">SMM Executive</div>
// // //             </div>
// // //           </div>
// // //           <nav className="space-y-0.5">
// // //             {navItems.map(n=>(
// // //               <button key={n.key} onClick={()=>{resetCompose();setView(n.key);}}
// // //                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${view===n.key?"smm-nav-active":"smm-nav-idle"}`}>
// // //                 <n.icon className="w-4 h-4 shrink-0" />
// // //                 {n.label}
// // //                 {n.key==="queue"&&queuedPosts.length>0&&(
// // //                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-green-100 text-green-700"}`}>
// // //                     {queuedPosts.length}
// // //                   </span>
// // //                 )}
// // //                 {n.key==="drafts"&&drafts.length>0&&(
// // //                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-yellow-100 text-yellow-700"}`}>
// // //                     {drafts.length}
// // //                   </span>
// // //                 )}
// // //               </button>
// // //             ))}
// // //           </nav>
// // //         </div>
// // //         <div className="p-4 border-t smm-border">
// // //           <Button variant="ghost" className="w-full justify-start smm-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
// // //             <LogOut className="w-4 h-4 mr-2" /> Logout
// // //           </Button>
// // //         </div>
// // //       </aside>

// // //       {/* ── Main ── */}
// // //       <main className="smm-main flex-1 min-w-0 overflow-y-auto">

// // //         {/* Header */}
// // //         <header className="smm-header px-6 py-4 flex items-center justify-between sticky top-0 z-20">
// // //           <div>
// // //             <h1 className="text-xl font-bold smm-text-primary">{viewTitle[view]}</h1>
// // //             <p className="text-sm smm-text-muted">Welcome back, {userName}</p>
// // //           </div>
// // //           <div className="flex items-center gap-2">
// // //             {view==="gd_tasks"&&(
// // //               <Button onClick={()=>setShowAddTask(true)} className="bg-green-600 hover:bg-green-700">
// // //                 <Plus className="w-4 h-4 mr-2"/>Assign Task to GD
// // //               </Button>
// // //             )}
// // //             {view==="design_projects"&&(
// // //               <Button onClick={()=>setShowAddDesign(true)} className="bg-green-600 hover:bg-green-700">
// // //                 <Plus className="w-4 h-4 mr-2"/>New Design Project
// // //               </Button>
// // //             )}
// // //             {view==="queue"&&(
// // //               <Button variant="outline" size="sm" onClick={loadQueued} disabled={queueLoading} className="smm-btn-outline">
// // //                 <RefreshCw className={`w-4 h-4 mr-1 ${queueLoading?"animate-spin":""}`}/>Refresh
// // //               </Button>
// // //             )}
// // //             {view==="drafts"&&(
// // //               <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{resetCompose();setView("compose");}}>
// // //                 <Plus className="w-4 h-4 mr-1"/>New Post
// // //               </Button>
// // //             )}
// // //             {view==="published"&&(
// // //               <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
// // //                 <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
// // //               </Button>
// // //             )}
// // //             {view==="compose"&&(
// // //               <Button variant="outline" size="sm" onClick={()=>{resetCompose();setView("overview");}} className="smm-btn-outline">
// // //                 ← Back
// // //               </Button>
// // //             )}
// // //             {view==="channels"&&(
// // //               <Button variant="outline" size="sm" onClick={()=>{loadChannels();loadClientsWithChannels();}} className="smm-btn-outline">
// // //                 <RefreshCw className="w-4 h-4 mr-1"/>Refresh
// // //               </Button>
// // //             )}

// // //             {/* Dark Mode */}
// // //             <button onClick={()=>setDark(d=>!d)} className="smm-icon-btn p-2 rounded-lg transition" title={dark?"Light mode":"Dark mode"}>
// // //               {dark?<Sun className="w-5 h-5 text-yellow-400"/>:<Moon className="w-5 h-5 smm-text-secondary"/>}
// // //             </button>

// // //             {/* Notifications */}
// // //             <div className="relative" ref={notifRef}>
// // //               <button onClick={()=>setNotifOpen(o=>!o)} className="smm-icon-btn relative p-2 rounded-lg transition">
// // //                 <Bell className="w-5 h-5 smm-text-secondary"/>
// // //                 {totalBadgeCount>0&&(
// // //                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
// // //                     {totalBadgeCount>9?"9+":totalBadgeCount}
// // //                   </span>
// // //                 )}
// // //               </button>

// // //               {notifOpen&&(
// // //                 <div className="smm-notif-panel absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border overflow-hidden z-50">
// // //                   <div className="flex items-center justify-between px-4 py-3 border-b smm-border smm-notif-header">
// // //                     <span className="font-semibold text-sm smm-text-primary flex items-center gap-2">
// // //                       <Bell className="w-4 h-4"/>Notifications
// // //                       {unreadCount>0&&<span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
// // //                     </span>
// // //                     <div className="flex gap-2">
// // //                       {notifs.length>0&&(
// // //                         <>
// // //                           <button onClick={markAllRead} className="text-xs text-green-600 hover:underline">Mark all read</button>
// // //                           <button onClick={clearNotifs} className="text-xs text-red-500 hover:underline">Clear</button>
// // //                         </>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                   <div>
// // //                     <div className="flex border-b smm-border">
// // //                       <button
// // //                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===0?"border-b-2 border-green-500 text-green-600":"smm-text-muted hover:smm-text-primary"}`}
// // //                         onClick={()=>setNotifTab(0)}
// // //                       >
// // //                         All Notifications {unreadCount>0&&<span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">{unreadCount}</span>}
// // //                       </button>
// // //                       <button
// // //                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===1?"border-b-2 border-orange-500 text-orange-600":"smm-text-muted hover:smm-text-primary"}`}
// // //                         onClick={()=>setNotifTab(1)}
// // //                       >
// // //                         GD Tasks Done {completedGDCount>0&&<span className="ml-1 bg-orange-500 text-white text-[9px] px-1 py-0.5 rounded-full">{completedGDCount}</span>}
// // //                       </button>
// // //                     </div>
// // //                     <div className="max-h-[400px] overflow-y-auto">
// // //                       {notifTab===0?(
// // //                         notifs.length===0?(
// // //                           <div className="px-4 py-8 text-center smm-text-muted">
// // //                             <BellOff className="w-8 h-8 mx-auto mb-2 opacity-30"/>
// // //                             <p className="text-sm">No notifications</p>
// // //                           </div>
// // //                         ):notifs.map(n=>(
// // //                           <div key={n.id} className={`smm-notif-item flex items-start gap-3 px-4 py-3 border-b last:border-b-0 smm-border transition ${!n.read?"smm-notif-unread":""}`}>
// // //                             <span className="text-base shrink-0 mt-0.5">{notifIcon(n.type)}</span>
// // //                             <div className="flex-1 min-w-0">
// // //                               <div className="flex items-start justify-between gap-1">
// // //                                 <p className="text-xs font-semibold smm-text-primary leading-tight">{n.title}</p>
// // //                                 <button onClick={()=>deleteNotif(n.id)} className="text-slate-300 hover:text-red-400 shrink-0"><X className="w-3 h-3"/></button>
// // //                               </div>
// // //                               <p className="text-xs smm-text-muted mt-0.5 leading-snug">{n.message}</p>
// // //                               <div className="flex items-center justify-between mt-1.5">
// // //                                 <span className="text-[10px] smm-text-muted">{new Date(n.timestamp).toLocaleString("en-IN",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</span>
// // //                                 {n.action&&(
// // //                                   <button onClick={()=>{setView(n.action!.view);setNotifOpen(false);}} className="text-[10px] text-green-600 font-medium hover:underline">
// // //                                     {n.action.label} →
// // //                                   </button>
// // //                                 )}
// // //                               </div>
// // //                             </div>
// // //                           </div>
// // //                         ))
// // //                       ):(
// // //                         completedGDCount===0?(
// // //                           <div className="px-4 py-8 text-center smm-text-muted">
// // //                             <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30"/>
// // //                             <p className="text-sm">No completed GD tasks pending review</p>
// // //                           </div>
// // //                         ):gdTasks.filter(t=>t.status==="completed").map(task=>(
// // //                           <div key={task.id} className="px-4 py-4 border-b last:border-b-0 smm-border bg-orange-50/50 dark:bg-orange-900/10">
// // //                             <div className="flex items-start justify-between gap-2 mb-2">
// // //                               <div className="flex-1 min-w-0">
// // //                                 <p className="text-xs font-bold smm-text-primary leading-tight flex items-center gap-1">
// // //                                   <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0"/>
// // //                                   {task.title}
// // //                                 </p>
// // //                                 <p className="text-[11px] smm-text-muted mt-0.5">Designer: <strong>{task.gdName}</strong></p>
// // //                                 <p className="text-[11px] smm-text-muted">Client: <strong>{task.clientName}</strong></p>
// // //                                 <p className="text-[11px] smm-text-muted">Platform: {task.platform} · Due: {task.deadline}</p>
// // //                                 {task.description&&<p className="text-[11px] smm-text-muted mt-1 line-clamp-2 italic">{task.description}</p>}
// // //                               </div>
// // //                               <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium shrink-0">Done</span>
// // //                             </div>
// // //                             <div className="flex gap-2 mt-2">
// // //                               <button
// // //                                 onClick={()=>handleGDTaskApproveReject(task.id,"approve")}
// // //                                 className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition"
// // //                               ><CheckCircle2 className="w-3 h-3"/>Approve</button>
// // //                               <button
// // //                                 onClick={()=>handleGDTaskApproveReject(task.id,"reject")}
// // //                                 className="flex-1 flex items-center justify-center gap-1 text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md font-medium transition"
// // //                               ><X className="w-3 h-3"/>Reject</button>
// // //                             </div>
// // //                           </div>
// // //                         ))
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </header>

// // //         <div className="p-6">

// // //           {/* ── OVERVIEW ── */}
// // //           {view==="overview"&&(
// // //             <div className="space-y-6">
// // //               {postsError&&(
// // //                 <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200">
// // //                   <AlertCircle className="w-4 h-4 shrink-0"/>{postsError}
// // //                 </div>
// // //               )}

// // //               {smmDashData?.designStats&&(
// // //                 <div>
// // //                   <h3 className="font-semibold smm-text-muted mb-3 text-sm uppercase tracking-wide">Design Projects</h3>
// // //                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// // //                     {[
// // //                       {label:"Total",        value:smmDashData.designStats.totalProjects??0,       border:"border-l-slate-400"},
// // //                       {label:"Pending",      value:smmDashData.designStats.pendingProjects??0,     border:"border-l-yellow-400"},
// // //                       {label:"In Progress",  value:smmDashData.designStats.inProgressProjects??0,  border:"border-l-blue-400"},
// // //                       {label:"Under Review", value:smmDashData.designStats.underReviewProjects??0, border:"border-l-purple-400"},
// // //                       {label:"Revision",     value:smmDashData.designStats.revisionProjects??0,    border:"border-l-orange-400"},
// // //                       {label:"Completed",    value:smmDashData.designStats.completedProjects??0,   border:"border-l-green-400"},
// // //                       {label:"Overdue",      value:smmDashData.designStats.overdueProjects??0,     border:"border-l-red-400"},
// // //                       {label:"Due Today",    value:smmDashData.designStats.dueTodayProjects??0,    border:"border-l-pink-400"},
// // //                     ].map(s=>(
// // //                       <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.border} cursor-pointer hover:shadow-md transition`} onClick={()=>setView("design_projects")}>
// // //                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// // //                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// // //                       </Card>
// // //                     ))}
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// // //                 {[
// // //                   {label:"Total Posts",        value:overviewLoading?"…":ovTotal,     icon:PenSquare,   color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30",    onClick:()=>setView("queue")},
// // //                   {label:"Published",          value:overviewLoading?"…":ovPublished, icon:Globe,       color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30",  onClick:()=>setView("published")},
// // //                   {label:"Scheduled / Queued", value:overviewLoading?"…":ovScheduled, icon:Clock,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30",onClick:()=>setView("queue")},
// // //                   {label:"Failed",             value:overviewLoading?"…":ovFailed,    icon:AlertCircle, color:"text-red-500",    bg:"bg-red-50 dark:bg-red-900/30",      onClick:()=>setView("published")},
// // //                 ].map(s=>(
// // //                   <Card key={s.label} className="smm-card p-5 cursor-pointer hover:shadow-md transition" onClick={s.onClick}>
// // //                     <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
// // //                     <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// // //                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// // //                   </Card>
// // //                 ))}
// // //               </div>

// // //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                 <Card className="smm-card p-5 border-l-4 border-l-purple-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("queue")}>
// // //                   <div className="flex items-center justify-between">
// // //                     <div><div className="text-sm font-semibold smm-text-primary">Queue</div><div className="text-xs smm-text-muted mt-0.5">Posts waiting to publish</div></div>
// // //                     <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"><Inbox className="w-5 h-5 text-purple-600"/></div>
// // //                   </div>
// // //                   <div className="text-2xl font-bold smm-text-primary mt-3">{queuedPosts.length}</div>
// // //                 </Card>
// // //                 <Card className="smm-card p-5 border-l-4 border-l-yellow-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("drafts")}>
// // //                   <div className="flex items-center justify-between">
// // //                     <div><div className="text-sm font-semibold smm-text-primary">Drafts</div><div className="text-xs smm-text-muted mt-0.5">Saved, not published yet</div></div>
// // //                     <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-yellow-600"/></div>
// // //                   </div>
// // //                   <div className="text-2xl font-bold smm-text-primary mt-3">{drafts.length}</div>
// // //                 </Card>
// // //                 <Card className="smm-card p-5 border-l-4 border-l-green-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("compose")}>
// // //                   <div className="flex items-center justify-between">
// // //                     <div><div className="text-sm font-semibold smm-text-primary">Create Post</div><div className="text-xs smm-text-muted mt-0.5">New post, schedule or draft</div></div>
// // //                     <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><PenSquare className="w-5 h-5 text-green-600"/></div>
// // //                   </div>
// // //                   <div className="text-sm text-green-600 font-medium mt-3">→ Create now</div>
// // //                 </Card>
// // //               </div>

// // //               <Card className="smm-card p-6">
// // //                 <h3 className="font-semibold smm-text-primary mb-3">Recent Posts</h3>
// // //                 {postsLoading?(
// // //                   <div className="flex items-center gap-2 smm-text-muted py-4"><Loader2 className="w-4 h-4 animate-spin"/>Loading...</div>
// // //                 ):posts.length===0?(
// // //                   <p className="text-sm smm-text-muted">No posts yet. <button onClick={()=>setView("compose")} className="text-green-600 hover:underline">Create your first post →</button></p>
// // //                 ):(
// // //                   <div className="space-y-2">
// // //                     {posts.slice(0,6).map(p=>(
// // //                       <div key={p._id??p.id} className="flex items-center gap-3 p-3 rounded-lg border smm-border hover:smm-bg-hover">
// // //                         <div className="flex-1 min-w-0">
// // //                           <p className="text-sm smm-text-primary truncate">{p.content}</p>
// // //                           <div className="flex gap-2 mt-1 flex-wrap">
// // //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// // //                             {p.platforms?.slice(0,2).map(pl=><span key={pl} className="text-xs smm-text-muted capitalize">{pl}</span>)}
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </Card>
// // //             </div>
// // //           )}

// // //           {/* ── COMPOSE ── */}
// // //           {view==="compose"&&(
// // //             <div className="max-w-2xl space-y-5">
// // //               {editingDraft&&(
// // //                 <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 px-4 py-2.5 rounded-lg border border-yellow-200 dark:border-yellow-700">
// // //                   <Edit2 className="w-4 h-4"/>Editing a draft
// // //                 </div>
// // //               )}
// // //               <Card className="smm-card p-6 space-y-5">

// // //                 {/* ── Step 1: Select Client ── */}
// // //                 <div>
// // //                   <Label className="smm-text-primary font-semibold">Step 1 — Select Client *</Label>
// // //                   <select
// // //                     value={composeClientId}
// // //                     onChange={e => setComposeClientId(e.target.value)}
// // //                     className="smm-select mt-2 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// // //                   >
// // //                     <option value="">— Select Client —</option>
// // //                     {clientList.map(c => (
// // //                       <option key={c.id} value={c.id}>{c.name}{c.email?` (${c.email})`:""}</option>
// // //                     ))}
// // //                   </select>
// // //                   {composeClientId&&(
// // //                     <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
// // //                       ✓ Post will be created for: <strong>{clientList.find(c=>c.id===composeClientId)?.name}</strong>
// // //                     </p>
// // //                   )}
// // //                 </div>

// // //                 {/* ── Step 2: Select Platform (from client's connected channels) ── */}
// // //                 <div>
// // //                   <Label className="smm-text-primary font-semibold">
// // //                     Step 2 — Select Platform *
// // //                     {composeClientId&&<span className="ml-2 text-xs font-normal smm-text-muted">(client's connected channels)</span>}
// // //                   </Label>
// // //                   {!composeClientId?(
// // //                     <p className="text-xs smm-text-muted mt-2 italic">Please select a client first to see their connected channels.</p>
// // //                   ):clientChannelsFetching?(
// // //                     <div className="flex items-center gap-2 smm-text-muted mt-2 text-sm"><Loader2 className="w-4 h-4 animate-spin"/>Loading channels...</div>
// // //                   ):clientConnectedChannels.length===0?(
// // //                     <div className="mt-2 space-y-2">
// // //                       <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
// // //                         ⚠️ This client has no connected channels yet.{" "}
// // //                         <button onClick={()=>setView("channels")} className="font-semibold underline">
// // //                           Go to Channels to connect
// // //                         </button>
// // //                       </p>
// // //                       {/* Fallback: allow manual platform selection */}
// // //                       <p className="text-xs smm-text-muted">Or select platform manually:</p>
// // //                       <div className="flex flex-wrap gap-2">
// // //                         {PLATFORMS.map(p=>(
// // //                           <button key={p.id} type="button" onClick={()=>togglePlat(p.id)}
// // //                             className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${composePlatforms.includes(p.id)?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
// // //                             {p.label}
// // //                           </button>
// // //                         ))}
// // //                       </div>
// // //                     </div>
// // //                   ):(
// // //                     <div className="mt-2 space-y-2">
// // //                       <div className="flex flex-wrap gap-2">
// // //                         {clientConnectedChannels.map(ch=>{
// // //                           const platId = ch.platform?.toLowerCase();
// // //                           const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===platId);
// // //                           const channelId = ch._id??ch.id??platId;
// // //                           const isSelected = composePlatforms.includes(platId);
// // //                           return(
// // //                             <button key={channelId} type="button"
// // //                               onClick={()=>togglePlat(platId)}
// // //                               className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${isSelected?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
// // //                               <span>{platInfo?.icon??"🔗"}</span>
// // //                               <span className="capitalize">{platInfo?.label??ch.platform}</span>
// // //                               {(ch.username||ch.name)&&(
// // //                                 <span className={`text-xs ${isSelected?"text-white/80":"smm-text-muted"}`}>
// // //                                   @{ch.username??ch.name}
// // //                                 </span>
// // //                               )}
// // //                             </button>
// // //                           );
// // //                         })}
// // //                       </div>
// // //                       <p className="text-xs smm-text-muted">
// // //                         {composePlatforms.length} platform{composePlatforms.length!==1?"s":""} selected
// // //                       </p>
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 {/* ── Step 3: Content ── */}
// // //                 <div>
// // //                   <Label className="smm-text-primary font-semibold">Step 3 — Content *</Label>
// // //                   <textarea value={composeContent} onChange={e=>setComposeContent(e.target.value)}
// // //                     placeholder="Write your post here..." rows={6} maxLength={2000}
// // //                     className="smm-textarea mt-2 w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// // //                   <div className="text-xs smm-text-muted text-right mt-1">{composeContent.length}/2000</div>
// // //                 </div>

// // //                 {/* ── Step 4: Schedule (optional) ── */}
// // //                 <div>
// // //                   <Label className="smm-text-primary font-semibold">Step 4 — Schedule Date (optional)</Label>
// // //                   <p className="text-xs smm-text-muted mb-2">Leave empty for instant post (will show in queue for 5 minutes)</p>
// // //                   <Input type="date" value={composeScheduleDate} onChange={e=>setComposeScheduleDate(e.target.value)}
// // //                     min={new Date().toISOString().slice(0,10)} className="smm-input"/>
// // //                 </div>
// // //                 {composeScheduleDate&&(
// // //                   <div>
// // //                     <Label className="smm-text-primary">Schedule Time</Label>
// // //                     <Input type="time" value={composeScheduleTime} onChange={e=>setComposeScheduleTime(e.target.value)} className="smm-input mt-2"/>
// // //                     <p className="text-xs smm-text-muted mt-1">
// // //                       {composeScheduleTime
// // //                         ? `✅ Will publish on ${composeScheduleDate} at ${composeScheduleTime}`
// // //                         : "Leave time empty to schedule at midnight"}
// // //                     </p>
// // //                   </div>
// // //                 )}

// // //                 {/* Tags */}
// // //                 <div>
// // //                   <Label className="smm-text-primary">Tags (optional)</Label>
// // //                   <div className="mt-2">
// // //                     <div className="flex flex-wrap gap-1.5 mb-2">
// // //                       {composeTags.map(tag=>(
// // //                         <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
// // //                           #{tag}
// // //                           <button type="button" onClick={()=>setComposeTags(p=>p.filter(t=>t!==tag))} className="hover:text-red-500">
// // //                             <X className="w-3 h-3"/>
// // //                           </button>
// // //                         </span>
// // //                       ))}
// // //                     </div>
// // //                     <Input value={composeTagInput} onChange={e=>setComposeTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
// // //                       placeholder="Type a tag and press Enter" className="smm-input text-sm"/>
// // //                   </div>
// // //                 </div>

// // //                 {/* Media */}
// // //                 <div>
// // //                   <Label className="smm-text-primary">Image / Video (optional)</Label>
// // //                   {composePreview?(
// // //                     <div className="relative mt-2 inline-block">
// // //                       <img src={composePreview} alt="preview" className="max-h-40 rounded-lg border smm-border"/>
// // //                       <button type="button" onClick={()=>{setComposePreview(null);setComposeMedia(null);}}
// // //                         className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
// // //                     </div>
// // //                   ):(
// // //                     <label className="smm-upload-area mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer text-sm smm-text-muted">
// // //                       🖼 Upload image or video
// // //                       <input type="file" accept="image/*,video/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f){setComposeMedia(f);setComposePreview(URL.createObjectURL(f));}}}/>
// // //                     </label>
// // //                   )}
// // //                 </div>

// // //                 {/* Actions */}
// // //                 <div className="flex gap-3 flex-wrap pt-2 border-t smm-border">
// // //                   <Button variant="outline" onClick={()=>handleCompose("draft")} disabled={composeSaving} className="smm-btn-outline">
// // //                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
// // //                     <FileText className="w-4 h-4 mr-2"/>{editingDraft?"Update Draft":"Save as Draft"}
// // //                   </Button>
// // //                   <Button className="bg-purple-600 hover:bg-purple-700" onClick={()=>handleCompose("queue")} disabled={composeSaving}>
// // //                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
// // //                     <Inbox className="w-4 h-4 mr-2"/>
// // //                     {composeScheduleDate?"Schedule Post":"Add to Queue (Instant)"}
// // //                   </Button>
// // //                 </div>
// // //               </Card>
// // //             </div>
// // //           )}

// // //           {/* ── QUEUE ── */}
// // //           {view==="queue"&&(
// // //             <div className="space-y-4">
// // //               <div className="flex items-center justify-between">
// // //                 <p className="text-sm smm-text-muted">Posts in queue — instant posts auto-publish in 5 minutes</p>
// // //                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// // //                   <Plus className="w-4 h-4 mr-1"/>New Post
// // //                 </Button>
// // //               </div>
// // //               {queueLoading?(
// // //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// // //               ):queuedPosts.length===0?(
// // //                 <Card className="smm-card p-12 text-center">
// // //                   <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// // //                   <p className="smm-text-secondary font-medium">Queue is empty</p>
// // //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// // //                     <Plus className="w-4 h-4 mr-2"/>Create Post
// // //                   </Button>
// // //                 </Card>
// // //               ):(
// // //                 <div className="space-y-3">
// // //                   {queuedPosts.map(p=>{
// // //                     const pid=p._id??p.id??"";
// // //                     const timeLeft = queueTimeLeft(p);
// // //                     const isScheduled = !!(p.scheduleAt??p.scheduled_at);
// // //                     return(
// // //                       <Card key={pid} className="smm-card p-5">
// // //                         <div className="flex items-start justify-between gap-4 flex-wrap">
// // //                           <div className="flex-1 min-w-0">
// // //                             <div className="flex items-center gap-2 mb-2 flex-wrap">
// // //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// // //                               {isScheduled?(
// // //                                 <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
// // //                                   📅 Scheduled
// // //                                 </span>
// // //                               ):(
// // //                                 <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium animate-pulse">
// // //                                   ⚡ Instant
// // //                                 </span>
// // //                               )}
// // //                               {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// // //                             </div>
// // //                             <p className="text-sm smm-text-primary">{p.content}</p>
// // //                             {isScheduled?(
// // //                               <p className="text-xs smm-text-muted mt-2 flex items-center gap-1">
// // //                                 <Clock className="w-3 h-3"/>
// // //                                 Scheduled: {new Date(p.scheduleAt??p.scheduled_at??"").toLocaleString("en-IN")}
// // //                               </p>
// // //                             ):timeLeft?(
// // //                               <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
// // //                                 <Clock className="w-3 h-3"/>{timeLeft}
// // //                               </p>
// // //                             ):null}
// // //                           </div>
// // //                           <Button size="sm" className="bg-green-600 hover:bg-green-700 shrink-0" onClick={()=>handlePublishNow(pid)} disabled={publishingId===pid}>
// // //                             {publishingId===pid?<Loader2 className="w-4 h-4 animate-spin"/>:<><CheckCircle2 className="w-4 h-4 mr-1"/>Publish Now</>}
// // //                           </Button>
// // //                         </div>
// // //                       </Card>
// // //                     );
// // //                   })}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* ── DRAFTS ── */}
// // //           {view==="drafts"&&(
// // //             <div className="space-y-4">
// // //               <p className="text-sm smm-text-muted">Saved drafts — edit or add to queue</p>
// // //               {draftsLoading?(
// // //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// // //               ):drafts.length===0?(
// // //                 <Card className="smm-card p-12 text-center">
// // //                   <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// // //                   <p className="smm-text-secondary font-medium">No drafts found</p>
// // //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// // //                     <Plus className="w-4 h-4 mr-2"/>Create Post
// // //                   </Button>
// // //                 </Card>
// // //               ):(
// // //                 <div className="space-y-3">
// // //                   {drafts.map(d=>{const did=d._id??d.id??"";return(
// // //                     <Card key={did} className="smm-card p-5">
// // //                       <div className="flex items-start justify-between gap-4 flex-wrap">
// // //                         <div className="flex-1 min-w-0">
// // //                           <div className="flex items-center gap-2 mb-2 flex-wrap">
// // //                             <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">Draft</span>
// // //                             {d.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// // //                           </div>
// // //                           <p className="text-sm smm-text-primary line-clamp-3">{d.content}</p>
// // //                           {d.createdAt&&<p className="text-xs smm-text-muted mt-2">Saved: {new Date(d.createdAt).toLocaleString("en-IN")}</p>}
// // //                         </div>
// // //                         <div className="flex gap-2 shrink-0">
// // //                           <Button size="sm" variant="outline" onClick={()=>handleEditDraft(d)} className="smm-btn-outline">
// // //                             <Edit2 className="w-4 h-4 mr-1"/>Edit
// // //                           </Button>
// // //                           <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDraft(did)} disabled={deletingDid===did}>
// // //                             {deletingDid===did?<Loader2 className="w-4 h-4 animate-spin"/>:<Trash2 className="w-4 h-4"/>}
// // //                           </Button>
// // //                         </div>
// // //                       </div>
// // //                     </Card>
// // //                   );})}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* ── PUBLISHED ── */}
// // //           {view==="published"&&(
// // //             <div className="space-y-4">
// // //               <div className="flex items-center justify-between">
// // //                 <p className="text-sm smm-text-muted">Record of all published posts</p>
// // //                 <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
// // //                   <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
// // //                 </Button>
// // //               </div>
// // //               {pubLoading?(
// // //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// // //               ):pubPosts.length===0?(
// // //                 <Card className="smm-card p-12 text-center">
// // //                   <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// // //                   <p className="smm-text-secondary font-medium">No published posts yet</p>
// // //                   <p className="text-xs smm-text-muted mt-1">Posts published from the queue will appear here</p>
// // //                 </Card>
// // //               ):(
// // //                 <div className="space-y-3">
// // //                   {pubPosts.map(p=>{const pid=p._id??p.id??"";return(
// // //                     <Card key={pid} className="smm-card p-5">
// // //                       <div className="flex items-start gap-4">
// // //                         <div className="flex-1 min-w-0">
// // //                           <div className="flex items-center gap-2 mb-2 flex-wrap">
// // //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// // //                             {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// // //                           </div>
// // //                           <p className="text-sm smm-text-primary">{p.content}</p>
// // //                           {p.createdAt&&<p className="text-xs smm-text-muted mt-2 flex items-center gap-1"><Globe className="w-3 h-3"/>Published: {new Date(p.createdAt).toLocaleString("en-IN")}</p>}
// // //                         </div>
// // //                       </div>
// // //                     </Card>
// // //                   );})}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* ── CHANNELS ── */}
// // //           {view==="channels"&&(
// // //             <div className="space-y-8">

// // //               {/* ── My Agency Channels ── */}
// // //               <div>
// // //                 <div className="flex items-center gap-3 mb-4">
// // //                   <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
// // //                     <LinkIcon className="w-4 h-4 text-green-600"/>
// // //                   </div>
// // //                   <div>
// // //                     <h2 className="text-base font-bold smm-text-primary">My Agency Channels</h2>
// // //                     <p className="text-xs smm-text-muted">Your own connected social accounts</p>
// // //                   </div>
// // //                 </div>
// // //                 {channelsLoading?(
// // //                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// // //                 ):(
// // //                   <>
// // //                     {channels.length>0&&(
// // //                       <div className="space-y-3 mb-4">
// // //                         {channels.map(ch=>{
// // //                           const cid=ch._id??ch.id??"";
// // //                           const platInfo=CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
// // //                           return(
// // //                             <Card key={cid} className="smm-card p-4 flex items-center justify-between gap-4">
// // //                               <div className="flex items-center gap-3">
// // //                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>{platInfo?.icon??"🔗"}</div>
// // //                                 <div>
// // //                                   <div className="text-sm font-semibold smm-text-primary capitalize">{ch.platform}</div>
// // //                                   <div className="text-xs smm-text-muted">{ch.username??ch.name??"Connected"}</div>
// // //                                 </div>
// // //                               </div>
// // //                               <div className="flex items-center gap-2">
// // //                                 <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">Connected</span>
// // //                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDisconnect(cid)} disabled={disconnectingId===cid}>
// // //                                   {disconnectingId===cid?<Loader2 className="w-4 h-4 animate-spin"/>:"Disconnect"}
// // //                                 </Button>
// // //                               </div>
// // //                             </Card>
// // //                           );
// // //                         })}
// // //                       </div>
// // //                     )}
// // //                     <div>
// // //                       <h4 className="text-sm font-semibold smm-text-primary mb-3">Connect a New Account</h4>
// // //                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// // //                         {CONNECTABLE_PLATFORMS.map(p=>{
// // //                           const isConnected=channels.some(ch=>ch.platform?.toLowerCase()===p.id);
// // //                           return(
// // //                             <Card key={p.id} className={`smm-card p-4 flex items-center justify-between gap-3 ${isConnected?"opacity-60":""}`}>
// // //                               <div className="flex items-center gap-2">
// // //                                 <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base bg-gradient-to-br ${p.color}`}>{p.icon}</span>
// // //                                 <div className="text-sm font-medium smm-text-primary">{p.label}</div>
// // //                               </div>
// // //                               <Button size="sm"
// // //                                 className={isConnected?"bg-slate-400 cursor-not-allowed":"bg-green-600 hover:bg-green-700"}
// // //                                 onClick={()=>!isConnected&&handleConnect(p.id)}
// // //                                 disabled={connectingPlatform===p.id||isConnected}>
// // //                                 {connectingPlatform===p.id?<Loader2 className="w-4 h-4 animate-spin"/>:isConnected?"✓ Connected":"Connect"}
// // //                               </Button>
// // //                             </Card>
// // //                           );
// // //                         })}
// // //                       </div>
// // //                     </div>
// // //                   </>
// // //                 )}
// // //               </div>

// // //               {/* ── Client Channels ── */}
// // //               <div>
// // //                 <div className="flex items-center gap-3 mb-4">
// // //                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
// // //                     <Users className="w-4 h-4 text-blue-600"/>
// // //                   </div>
// // //                   <div>
// // //                     <h2 className="text-base font-bold smm-text-primary">Client Channels</h2>
// // //                     <p className="text-xs smm-text-muted">Manage social accounts for each client — connect platforms on their behalf</p>
// // //                   </div>
// // //                 </div>
// // //                 {clientChannelsLoading?(
// // //                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading client channels...</div>
// // //                 ):clientList.length===0?(
// // //                   <Card className="smm-card p-8 text-center">
// // //                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// // //                     <p className="text-sm smm-text-muted">No clients found. Clients appear once design projects are loaded.</p>
// // //                     <Button variant="outline" size="sm" className="mt-3 smm-btn-outline" onClick={()=>{loadUsersForDropdowns().then(()=>loadClientsWithChannels());}}>
// // //                       <RefreshCw className="w-4 h-4 mr-1"/>Load Clients
// // //                     </Button>
// // //                   </Card>
// // //                 ):(
// // //                   <div className="space-y-4">
// // //                     {(clientsWithChannels.length > 0 ? clientsWithChannels : clientList.map(c=>({...c,channels:[]}))).map(client=>(
// // //                       <Card key={client.id} className="smm-card p-5">
// // //                         {/* Client header */}
// // //                         <div className="flex items-center gap-3 mb-4">
// // //                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
// // //                             <span className="text-sm font-bold text-blue-600">{client.name.charAt(0).toUpperCase()}</span>
// // //                           </div>
// // //                           <div>
// // //                             <div className="font-semibold smm-text-primary text-sm">{client.name}</div>
// // //                             {client.email&&<div className="text-xs smm-text-muted">{client.email}</div>}
// // //                           </div>
// // //                           <div className="ml-auto">
// // //                             {(client as ClientWithChannels).channels?.length > 0 ? (
// // //                               <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
// // //                                 {(client as ClientWithChannels).channels.length} connected
// // //                               </span>
// // //                             ):(
// // //                               <span className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full">
// // //                                 No channels
// // //                               </span>
// // //                             )}
// // //                           </div>
// // //                         </div>

// // //                         {/* Connected channels for this client */}
// // //                         {(client as ClientWithChannels).channels?.length > 0 && (
// // //                           <div className="mb-4">
// // //                             <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connected Accounts</p>
// // //                             <div className="space-y-2">
// // //                               {(client as ClientWithChannels).channels.map(ch=>{
// // //                                 const chId = ch._id??ch.id??"";
// // //                                 const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
// // //                                 return(
// // //                                   <div key={chId} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border smm-border bg-slate-50/50 dark:bg-slate-800/30">
// // //                                     <div className="flex items-center gap-2">
// // //                                       <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>
// // //                                         {platInfo?.icon??"🔗"}
// // //                                       </span>
// // //                                       <div>
// // //                                         <div className="text-xs font-medium smm-text-primary capitalize">{platInfo?.label??ch.platform}</div>
// // //                                         {(ch.username||ch.name)&&<div className="text-[10px] smm-text-muted">@{ch.username??ch.name}</div>}
// // //                                       </div>
// // //                                     </div>
// // //                                     <div className="flex items-center gap-2">
// // //                                       <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium">✓ Connected</span>
// // //                                       <button
// // //                                         onClick={()=>handleDisconnectClientChannel(chId, client.id)}
// // //                                         className="text-[10px] text-red-500 hover:underline px-1"
// // //                                       >Disconnect</button>
// // //                                     </div>
// // //                                   </div>
// // //                                 );
// // //                               })}
// // //                             </div>
// // //                           </div>
// // //                         )}

// // //                         {/* Connect new platform for this client */}
// // //                         <div>
// // //                           <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connect Platform</p>
// // //                           <div className="flex flex-wrap gap-2">
// // //                             {CONNECTABLE_PLATFORMS.map(plat=>{
// // //                               const key=`${client.id}_${plat.id}`;
// // //                               const isLoading=connectingForClient===key;
// // //                               const isAlreadyConnected=(client as ClientWithChannels).channels?.some(ch=>ch.platform?.toLowerCase()===plat.id);
// // //                               return(
// // //                                 <Button key={plat.id} size="sm" variant="outline"
// // //                                   className={`text-xs gap-1.5 ${isAlreadyConnected?"opacity-50 cursor-not-allowed smm-btn-outline":"smm-btn-outline hover:border-blue-500 hover:text-blue-600"}`}
// // //                                   onClick={()=>!isAlreadyConnected&&handleConnectForClient(plat.id, client.id)}
// // //                                   disabled={isLoading||isAlreadyConnected}>
// // //                                   {isLoading?<Loader2 className="w-3 h-3 animate-spin"/>:<span>{plat.icon}</span>}
// // //                                   {isAlreadyConnected?"✓ "+plat.label:plat.label}
// // //                                 </Button>
// // //                               );
// // //                             })}
// // //                           </div>
// // //                         </div>
// // //                       </Card>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* ── CLIENTS & GD ── */}
// // //           {view==="clients_gd"&&(
// // //             <div className="space-y-8">
// // //               {/* Clients Section */}
// // //               <div>
// // //                 <div className="flex items-center gap-3 mb-4">
// // //                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
// // //                     <Users className="w-4 h-4 text-blue-600"/>
// // //                   </div>
// // //                   <div>
// // //                     <h2 className="text-base font-bold smm-text-primary">Clients</h2>
// // //                     <p className="text-xs smm-text-muted">{clientList.length} client(s)</p>
// // //                   </div>
// // //                 </div>
// // //                 {clientList.length===0?(
// // //                   <Card className="smm-card p-8 text-center">
// // //                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// // //                     <p className="text-sm smm-text-muted">No clients found. They will appear once design projects are loaded.</p>
// // //                   </Card>
// // //                 ):(
// // //                   <div className="space-y-2">
// // //                     {clientList.map(c=>(
// // //                       <Card key={c.id} className="smm-card p-4 flex items-center gap-3">
// // //                         <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
// // //                           <span className="text-sm font-bold text-blue-600">{c.name.charAt(0).toUpperCase()}</span>
// // //                         </div>
// // //                         <div>
// // //                           <div className="font-semibold smm-text-primary text-sm">{c.name}</div>
// // //                           {c.email&&<div className="text-xs smm-text-muted">{c.email}</div>}
// // //                         </div>
// // //                         <Button size="sm" variant="outline" className="ml-auto smm-btn-outline text-xs" onClick={()=>setView("channels")}>
// // //                           <LinkIcon className="w-3 h-3 mr-1"/>Manage Channels
// // //                         </Button>
// // //                       </Card>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               {/* Graphic Designers Section */}
// // //               <div>
// // //                 <div className="flex items-center gap-3 mb-4">
// // //                   <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
// // //                     <Palette className="w-4 h-4 text-purple-600"/>
// // //                   </div>
// // //                   <div>
// // //                     <h2 className="text-base font-bold smm-text-primary">Graphic Designers</h2>
// // //                     <p className="text-xs smm-text-muted">{gdList.length} designer(s)</p>
// // //                   </div>
// // //                 </div>
// // //                 {gdList.length===0?(
// // //                   <Card className="smm-card p-8 text-center">
// // //                     <Palette className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// // //                     <p className="text-sm smm-text-muted">No graphic designers found. They appear once design projects are loaded.</p>
// // //                   </Card>
// // //                 ):(
// // //                   <div className="space-y-2">
// // //                     {gdList.map(g=>(
// // //                       <Card key={g.id} className="smm-card p-4 flex items-center gap-3">
// // //                         <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center shrink-0">
// // //                           <span className="text-sm font-bold text-purple-600">{g.name.charAt(0).toUpperCase()}</span>
// // //                         </div>
// // //                         <div>
// // //                           <div className="font-semibold smm-text-primary text-sm">{g.name}</div>
// // //                           {g.email&&<div className="text-xs smm-text-muted">{g.email}</div>}
// // //                         </div>
// // //                       </Card>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* ── CALENDAR ── */}
// // //           {view==="calendar"&&(
// // //             <div className="space-y-4">
// // //               <div className="flex items-center gap-2">
// // //                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()-1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">←</button>
// // //                 <span className="font-semibold smm-text-primary min-w-[160px] text-center">{monthNames[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
// // //                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()+1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">→</button>
// // //                 <Button size="sm" variant="outline" onClick={()=>setCalMonth(new Date())} className="smm-btn-outline">Today</Button>
// // //                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}><Plus className="w-3 h-3 mr-1"/>New Post</Button>
// // //               </div>
// // //               <Card className="smm-card overflow-hidden">
// // //                 <div className="grid grid-cols-7 border-b smm-border smm-cal-header">
// // //                   {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
// // //                     <div key={d} className="p-3 text-xs font-semibold smm-text-muted text-center uppercase tracking-wide">{d}</div>
// // //                   ))}
// // //                 </div>
// // //                 <div className="grid grid-cols-7">
// // //                   {calDays.map((d,i)=>{
// // //                     const dp=d?postsForDay(d):[];
// // //                     const today=d?d.toDateString()===new Date().toDateString():false;
// // //                     return(
// // //                       <div key={i} className="min-h-[100px] border-r border-b smm-border p-2 last:border-r-0">
// // //                         {d&&(
// // //                           <>
// // //                             <div className={`text-xs font-medium mb-1 inline-flex items-center justify-center w-6 h-6 rounded-full ${today?"bg-green-600 text-white":"smm-text-muted"}`}>{d.getDate()}</div>
// // //                             <div className="space-y-1">
// // //                               {dp.slice(0,2).map(p=>(
// // //                                 <div key={p._id??p.id} className={`text-xs px-2 py-1 rounded truncate ${statusBadge(p.status)}`}>{p.content.slice(0,20)}…</div>
// // //                               ))}
// // //                               {dp.length>2&&<div className="text-xs smm-text-muted px-1">+{dp.length-2} more</div>}
// // //                             </div>
// // //                           </>
// // //                         )}
// // //                       </div>
// // //                     );
// // //                   })}
// // //                 </div>
// // //               </Card>
// // //             </div>
// // //           )}

// // //           {/* ── GD TASKS ── */}
// // //           {view==="gd_tasks"&&(
// // //             <div className="space-y-4">
// // //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// // //                 {[
// // //                   {label:"Pending",        count:taskCounts.pending,     color:"border-l-slate-400"},
// // //                   {label:"In Progress",    count:taskCounts.in_progress, color:"border-l-blue-400"},
// // //                   {label:"Needs Revision", count:taskCounts.revision,    color:"border-l-orange-400"},
// // //                   {label:"Completed",      count:taskCounts.completed,   color:"border-l-green-400"},
// // //                 ].map(s=>(
// // //                   <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.color}`}>
// // //                     <div className="text-2xl font-bold smm-text-primary">{s.count}</div>
// // //                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// // //                   </Card>
// // //                 ))}
// // //               </div>
// // //               {gdTasks.length===0?(
// // //                 <Card className="smm-card p-12 text-center">
// // //                   <FileImage className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// // //                   <p className="smm-text-secondary">No tasks yet. Click "Assign Task to GD" to get started.</p>
// // //                 </Card>
// // //               ):(
// // //                 <div className="space-y-3">
// // //                   {gdTasks.map(task=>(
// // //                     <Card key={task.id} className="smm-card p-5">
// // //                       <div className="flex items-start justify-between gap-4 flex-wrap">
// // //                         <div className="flex-1 min-w-0">
// // //                           <div className="flex items-center gap-2 flex-wrap mb-1">
// // //                             <h3 className="font-semibold smm-text-primary">{task.title}</h3>
// // //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status==="completed"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":task.status==="revision"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":task.status==="in_progress"?"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300":"bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}>
// // //                               {task.status.replace("_"," ")}
// // //                             </span>
// // //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.priority==="high"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":task.priority==="medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
// // //                               {task.priority}
// // //                             </span>
// // //                           </div>
// // //                           <p className="text-sm smm-text-muted mb-2">{task.description}</p>
// // //                           <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap">
// // //                             <span>Client: <strong className="smm-text-secondary">{task.clientName}</strong></span>
// // //                             {task.gdName&&<span>Designer: <strong className="smm-text-secondary">{task.gdName}</strong></span>}
// // //                             <span>Platform: <strong className="smm-text-secondary">{task.platform}</strong></span>
// // //                             <span>Due: <strong className="smm-text-secondary">{task.deadline}</strong></span>
// // //                           </div>
// // //                           {task.status==="revision"&&task.revisionComment&&(
// // //                             <div className="mt-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-800">
// // //                               Revision note: {task.revisionComment}
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                         {task.status==="completed"&&(
// // //                           <div className="flex flex-col gap-2">
// // //                             <Button size="sm" variant="outline" className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
// // //                               onClick={()=>{const c=prompt("Revision comment:");if(c)handleRevision(task.id,c);}}>
// // //                               Request Revision
// // //                             </Button>
// // //                             <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={()=>handleGDTaskApproveReject(task.id,"approve")}>
// // //                               <CheckCircle2 className="w-3 h-3 mr-1"/>Approve
// // //                             </Button>
// // //                             <Button size="sm" variant="outline" className="text-xs text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
// // //                               onClick={()=>handleGDTaskApproveReject(task.id,"reject")}>
// // //                               Reject
// // //                             </Button>
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </Card>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* ── DESIGN PROJECTS ── */}
// // //           {view==="design_projects"&&(
// // //             <div className="space-y-4">
// // //               <div className="flex items-center gap-3 flex-wrap">
// // //                 <select value={designFilter} onChange={e=>{setDesignFilter(e.target.value);setTimeout(()=>loadDesignProjects(),0);}}
// // //                   className="smm-select px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// // //                   <option value="">All Status</option>
// // //                   {["Pending","In Progress","Under Review","Revision","Completed","Cancelled"].map(s=>(
// // //                     <option key={s} value={s}>{s}</option>
// // //                   ))}
// // //                 </select>
// // //                 <Button size="sm" variant="outline" onClick={loadDesignProjects} disabled={designLoading} className="smm-btn-outline">
// // //                   <RefreshCw className={`w-4 h-4 mr-1 ${designLoading?"animate-spin":""}`}/>Refresh
// // //                 </Button>
// // //               </div>
// // //               {designLoading?(
// // //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// // //               ):designProjects.length===0?(
// // //                 <Card className="smm-card p-12 text-center">
// // //                   <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// // //                   <p className="smm-text-secondary font-medium">No design projects found</p>
// // //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setShowAddDesign(true)}>
// // //                     <Plus className="w-4 h-4 mr-2"/>New Design Project
// // //                   </Button>
// // //                 </Card>
// // //               ):(
// // //                 <div className="space-y-3">
// // //                   {designProjects.map(p=>{
// // //                     const pid=p._id??p.id??"";
// // //                     const clientName=typeof p.clientId==="object"?p.clientId?.name:clientList.find(c=>c.id===p.clientId)?.name??"—";
// // //                     const designerName=typeof p.designerId==="object"?p.designerId?.name:gdList.find(g=>g.id===p.designerId)?.name??"—";
// // //                     const sc:Record<string,string>={
// // //                       "Pending":"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
// // //                       "In Progress":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
// // //                       "Under Review":"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
// // //                       "Revision":"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
// // //                       "Completed":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
// // //                       "Cancelled":"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
// // //                     };
// // //                     return(
// // //                       <Card key={pid} className="smm-card p-5">
// // //                         <div className="flex items-start justify-between gap-4 flex-wrap">
// // //                           <div className="flex-1 min-w-0">
// // //                             <div className="flex items-center gap-2 flex-wrap mb-1">
// // //                               <h3 className="font-semibold smm-text-primary">{p.title}</h3>
// // //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc[p.status]??"bg-slate-100 text-slate-600"}`}>{p.status}</span>
// // //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.priority==="Urgent"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":p.priority==="High"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":p.priority==="Medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
// // //                                 {p.priority}
// // //                               </span>
// // //                             </div>
// // //                             <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap mt-1">
// // //                               <span>Type: <strong className="smm-text-secondary">{p.designType}</strong></span>
// // //                               <span>Client: <strong className="smm-text-secondary">{clientName}</strong></span>
// // //                               <span>Designer: <strong className="smm-text-secondary">{designerName}</strong></span>
// // //                               <span>Deadline: <strong className="smm-text-secondary">{p.deadline?.slice(0,10)}</strong></span>
// // //                             </div>
// // //                             {p.description&&<p className="text-sm smm-text-muted mt-1 truncate">{p.description}</p>}
// // //                           </div>
// // //                           <div className="flex gap-2 flex-wrap shrink-0">
// // //                             <Button size="sm" variant="outline" onClick={()=>openProjectDetail(p)} className="smm-btn-outline">
// // //                               <MessageSquare className="w-4 h-4 mr-1"/>Comments
// // //                             </Button>
// // //                             {p.status==="Under Review"&&(
// // //                               <>
// // //                                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>handleApproveReject(pid,"approve")}>
// // //                                   <CheckCircle2 className="w-4 h-4 mr-1"/>Approve
// // //                                 </Button>
// // //                                 <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={()=>handleRevisionReq(pid)}>
// // //                                   Revision
// // //                                 </Button>
// // //                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleApproveReject(pid,"reject")}>
// // //                                   Reject
// // //                                 </Button>
// // //                               </>
// // //                             )}
// // //                             <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDP(pid)}>
// // //                               <Trash2 className="w-4 h-4"/>
// // //                             </Button>
// // //                           </div>
// // //                         </div>
// // //                       </Card>
// // //                     );
// // //                   })}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* ── ANALYTICS ── */}
// // //           {view==="analytics"&&(
// // //             <div className="space-y-6">
// // //               {analyticsLoading?(
// // //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// // //               ):(
// // //                 <>
// // //                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// // //                     {[
// // //                       {label:"Total Reach",  value:analytics?.reach??       "—", icon:Eye,        color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30"},
// // //                       {label:"Impressions",  value:analytics?.impressions?? "—", icon:TrendingUp,  color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30"},
// // //                       {label:"Engagement",   value:analytics?.engagement??  "—", icon:Heart,       color:"text-pink-600",   bg:"bg-pink-50 dark:bg-pink-900/30"},
// // //                       {label:"Followers",    value:analytics?.followers??   "—", icon:Users,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30"},
// // //                     ].map(s=>(
// // //                       <Card key={s.label} className="smm-card p-5">
// // //                         <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
// // //                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// // //                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// // //                       </Card>
// // //                     ))}
// // //                   </div>
// // //                   <Card className="smm-card p-6">
// // //                     <h3 className="font-semibold smm-text-primary mb-4">Weekly Reach & Engagement</h3>
// // //                     {analytics?.weeklyData?.length?(
// // //                       <div className="h-64">
// // //                         <ResponsiveContainer width="100%" height="100%">
// // //                           <LineChart data={weeklyData}>
// // //                             <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"}/>
// // //                             <XAxis dataKey="day" stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
// // //                             <YAxis stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
// // //                             <Tooltip contentStyle={{background:dark?"#1e293b":"#fff",border:"1px solid #334155",borderRadius:8}}/>
// // //                             <Line type="monotone" dataKey="reach" stroke="#22c55e" strokeWidth={2.5} name="Reach"/>
// // //                             <Line type="monotone" dataKey="engagement" stroke="#818cf8" strokeWidth={2.5} name="Engagement"/>
// // //                           </LineChart>
// // //                         </ResponsiveContainer>
// // //                       </div>
// // //                     ):(
// // //                       <div className="h-32 flex items-center justify-center smm-text-muted text-sm">
// // //                         No analytics data available. Connect social accounts first.
// // //                       </div>
// // //                     )}
// // //                   </Card>
// // //                 </>
// // //               )}
// // //             </div>
// // //           )}

// // //         </div>
// // //       </main>

// // //       {/* ── Add Design Project Modal ── */}
// // //       {showAddDesign&&(
// // //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// // //           <Card className="smm-modal w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
// // //             <div className="flex items-center justify-between mb-5">
// // //               <h2 className="text-lg font-bold smm-text-primary">New Design Project</h2>
// // //               <button onClick={()=>setShowAddDesign(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
// // //             </div>
// // //             <form onSubmit={handleCreateDP} className="space-y-4">
// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <Label className="smm-text-primary">Client *</Label>
// // //                   <select value={newDP.clientId} onChange={e=>setNewDP(n=>({...n,clientId:e.target.value}))}
// // //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// // //                     <option value="">-- Select Client --</option>
// // //                     {clientList.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
// // //                   </select>
// // //                 </div>
// // //                 <div>
// // //                   <Label className="smm-text-primary">Graphic Designer *</Label>
// // //                   <select value={newDP.designerId} onChange={e=>setNewDP(n=>({...n,designerId:e.target.value}))}
// // //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// // //                     <option value="">-- Select Designer --</option>
// // //                     {gdList.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
// // //                   </select>
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <Label className="smm-text-primary">Project Title *</Label>
// // //                 <Input value={newDP.title} onChange={e=>setNewDP(n=>({...n,title:e.target.value}))}
// // //                   placeholder="e.g. Logo Design for Sharma Enterprises" required className="smm-input mt-1"/>
// // //               </div>
// // //               <div className="grid grid-cols-3 gap-3">
// // //                 <div>
// // //                   <Label className="smm-text-primary">Design Type</Label>
// // //                   <select value={newDP.designType} onChange={e=>setNewDP(n=>({...n,designType:e.target.value}))}
// // //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// // //                     {["Social Post","Logo","Banner","Brochure","Video Thumbnail","Story","Reel Cover","Other"].map(t=>(
// // //                       <option key={t} value={t}>{t}</option>
// // //                     ))}
// // //                   </select>
// // //                 </div>
// // //                 <div>
// // //                   <Label className="smm-text-primary">Deadline *</Label>
// // //                   <Input type="date" value={newDP.deadline} onChange={e=>setNewDP(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
// // //                 </div>
// // //                 <div>
// // //                   <Label className="smm-text-primary">Priority</Label>
// // //                   <select value={newDP.priority} onChange={e=>setNewDP(n=>({...n,priority:e.target.value}))}
// // //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// // //                     {["Low","Medium","High","Urgent"].map(p=><option key={p} value={p}>{p}</option>)}
// // //                   </select>
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <Label className="smm-text-primary">Description</Label>
// // //                 <textarea value={newDP.description} onChange={e=>setNewDP(n=>({...n,description:e.target.value}))} rows={3}
// // //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <Label className="smm-text-primary">Target Audience</Label>
// // //                   <Input value={newDP.targetAudience} onChange={e=>setNewDP(n=>({...n,targetAudience:e.target.value}))} placeholder="e.g. 25-45 professionals" className="smm-input mt-1"/>
// // //                 </div>
// // //                 <div>
// // //                   <Label className="smm-text-primary">Revision Limit</Label>
// // //                   <Input type="number" min={1} max={10} value={newDP.revisionLimit} onChange={e=>setNewDP(n=>({...n,revisionLimit:Number(e.target.value)}))} className="smm-input mt-1"/>
// // //                 </div>
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <Label className="smm-text-primary">Brand Colors</Label>
// // //                   <Input value={newDP.brandColors} onChange={e=>setNewDP(n=>({...n,brandColors:e.target.value}))} placeholder="#0044CC, #FFFFFF" className="smm-input mt-1"/>
// // //                 </div>
// // //                 <div>
// // //                   <Label className="smm-text-primary">Font Preferences</Label>
// // //                   <Input value={newDP.fontPreferences} onChange={e=>setNewDP(n=>({...n,fontPreferences:e.target.value}))} placeholder="Montserrat Bold" className="smm-input mt-1"/>
// // //                 </div>
// // //               </div>
// // //               <div className="flex gap-3 pt-2">
// // //                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddDesign(false)}>Cancel</Button>
// // //                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={dpSaving}>
// // //                   {dpSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}<Send className="w-4 h-4 mr-2"/>Create & Assign
// // //                 </Button>
// // //               </div>
// // //             </form>
// // //           </Card>
// // //         </div>
// // //       )}

// // //       {/* ── Comments Modal ── */}
// // //       {selProject&&(
// // //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// // //           <Card className="smm-modal w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
// // //             <div className="flex items-center justify-between mb-4">
// // //               <h2 className="text-lg font-bold smm-text-primary truncate">{selProject.title}</h2>
// // //               <button onClick={()=>{setSelProject(null);setProjComments([]);setNewComment("");}} className="smm-text-muted hover:smm-text-primary shrink-0">
// // //                 <X className="w-5 h-5"/>
// // //               </button>
// // //             </div>
// // //             <h3 className="text-sm font-semibold smm-text-primary mb-2">Comments</h3>
// // //             <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
// // //               {projComments.length===0?(
// // //                 <p className="text-sm smm-text-muted">No comments yet</p>
// // //               ):projComments.map((c:any,i:number)=>(
// // //                 <div key={c._id??i} className="text-sm smm-comment px-3 py-2 rounded-lg border smm-border">
// // //                   <span className="font-medium smm-text-primary">{c.senderName??c.sender?.name??"User"}: </span>
// // //                   <span className="smm-text-secondary">{c.message??c.text}</span>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //             <div className="flex gap-2">
// // //               <Input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Write a comment..." className="smm-input"
// // //                 onKeyDown={e=>{if(e.key==="Enter")handleSendComment();}}/>
// // //               <Button onClick={handleSendComment} disabled={commentSending||!newComment.trim()} className="bg-green-600 hover:bg-green-700 shrink-0">
// // //                 {commentSending?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}
// // //               </Button>
// // //             </div>
// // //           </Card>
// // //         </div>
// // //       )}

// // //       {/* ── Assign GD Task Modal ── */}
// // //       {showAddTask&&(
// // //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// // //           <Card className="smm-modal w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
// // //             <div className="flex items-center justify-between mb-5">
// // //               <h2 className="text-lg font-bold smm-text-primary">Assign Task to Graphic Designer</h2>
// // //               <button onClick={()=>setShowAddTask(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
// // //             </div>
// // //             <form onSubmit={handleAssignTask} className="space-y-4">
// // //               <div>
// // //                 <Label className="smm-text-primary">Task Title *</Label>
// // //                 <Input value={newTask.title} onChange={e=>setNewTask(n=>({...n,title:e.target.value}))} placeholder="e.g. Instagram Story — Summer Sale" required className="smm-input mt-1"/>
// // //               </div>
// // //               <div>
// // //                 <Label className="smm-text-primary">Description</Label>
// // //                 <textarea value={newTask.description} onChange={e=>setNewTask(n=>({...n,description:e.target.value}))} rows={3}
// // //                   placeholder="What should the designer create..."
// // //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <Label className="smm-text-primary">Client *</Label>
// // //                   {clientList.length>0?(
// // //                     <select value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))}
// // //                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// // //                       <option value="">-- Select Client --</option>
// // //                       {clientList.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
// // //                     </select>
// // //                   ):(
// // //                     <Input value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))} placeholder="Client name" required className="smm-input mt-1"/>
// // //                   )}
// // //                 </div>
// // //                 <div>
// // //                   <Label className="smm-text-primary">Graphic Designer</Label>
// // //                   {gdList.length>0?(
// // //                     <select value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))}
// // //                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// // //                       <option value="">-- Select Designer --</option>
// // //                       {gdList.map(g=><option key={g.id} value={g.name}>{g.name}</option>)}
// // //                     </select>
// // //                   ):(
// // //                     <Input value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))} placeholder="Designer name" className="smm-input mt-1"/>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <Label className="smm-text-primary">Platform</Label>
// // //                   <select value={newTask.platform} onChange={e=>setNewTask(n=>({...n,platform:e.target.value}))}
// // //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// // //                     {["Instagram","Facebook","LinkedIn","Twitter/X","YouTube","Pinterest"].map(p=>(
// // //                       <option key={p} value={p}>{p}</option>
// // //                     ))}
// // //                   </select>
// // //                 </div>
// // //                 <div>
// // //                   <Label className="smm-text-primary">Priority</Label>
// // //                   <select value={newTask.priority} onChange={e=>setNewTask(n=>({...n,priority:e.target.value as Priority}))}
// // //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// // //                     <option value="high">High</option>
// // //                     <option value="medium">Medium</option>
// // //                     <option value="low">Low</option>
// // //                   </select>
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <Label className="smm-text-primary">Deadline *</Label>
// // //                 <Input type="date" value={newTask.deadline} onChange={e=>setNewTask(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
// // //               </div>
// // //               <div>
// // //                 <Label className="smm-text-primary">Notes for Designer</Label>
// // //                 <textarea value={newTask.notes} onChange={e=>setNewTask(n=>({...n,notes:e.target.value}))} rows={2}
// // //                   placeholder="Brand guidelines, colour codes, style references..."
// // //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// // //               </div>
// // //               <div className="flex gap-3 pt-2">
// // //                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddTask(false)}>Cancel</Button>
// // //                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700"><Send className="w-4 h-4 mr-2"/>Assign Task</Button>
// // //               </div>
// // //             </form>
// // //           </Card>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default SMMDashboard;

// // import { useState, useEffect, useRef, useCallback } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import "./SMMDashboard.css";
// // import { Logo } from "@/components/Logo";
// // import { Button } from "@/components/ui/button";
// // import { Card } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { toast } from "sonner";
// // import {
// //   Megaphone, LogOut, LayoutDashboard, Calendar,
// //   PenSquare, BarChart3, FileImage, Plus, X,
// //   CheckCircle2, Send, Loader2, AlertCircle,
// //   Eye, Heart, TrendingUp, Users, Clock, Inbox,
// //   FileText, Globe, Trash2, Edit2, RefreshCw,
// //   LinkIcon, Palette, MessageSquare,
// //   Bell, BellOff, Moon, Sun,
// // } from "lucide-react";
// // import {
// //   clearSession, getSession,
// //   BASE_URL,
// //   apiGetPosts, apiCreatePost, apiSaveDraft, apiGetAnalytics,
// //   apiGetQueuedPosts, apiGetDrafts, apiUpdateDraft, apiDeleteDraft,
// //   apiPublishPost, apiGetOverview, apiGetSocialAccounts,
// //   apiGetOAuthUrl, apiDisconnectSocialAccount,
// //   apiSMMDashboard, apiSMMGetDesignProjects, apiSMMCreateDesignProject,
// //   apiSMMDeleteDesignProject,
// //   apiSMMApproveRejectProject, apiSMMRequestRevision,
// //   apiSMMGetComments, apiSMMAddComment,
// //   apiSMMGetClients, apiSMMGetGraphicDesigners,
// //   type Post, type OverviewRes,
// // } from "@/lib/api";
// // import {
// //   LineChart, Line, ResponsiveContainer, Tooltip,
// //   XAxis, YAxis, CartesianGrid,
// // } from "recharts";

// // // ─── Keys ─────────────────────────────────────────────────────────────────────
// // const GD_TASKS_KEY  = "socialflow_gd_tasks";
// // const DARK_MODE_KEY = "socialflow_dark_mode";
// // const NOTIF_KEY     = "socialflow_notifications";

// // // ─── Types ────────────────────────────────────────────────────────────────────
// // type TaskStatus = "pending" | "in_progress" | "revision" | "completed";
// // type Priority   = "high" | "medium" | "low";
// // type NotifType  = "success" | "warning" | "error" | "info";
// // type SMMView    = "overview"|"compose"|"queue"|"drafts"|"published"|"calendar"|"gd_tasks"|"design_projects"|"analytics"|"channels"|"clients_gd";

// // interface GDTask {
// //   id: string; title: string; description: string; clientName: string;
// //   gdName: string;
// //   platform: string; deadline: string; priority: Priority; status: TaskStatus;
// //   assignedBy: string; assignedAt: string; notes?: string; revisionComment?: string;
// // }

// // interface DesignProject {
// //   _id?: string; id?: string;
// //   title: string; designType: string; priority: string; status: string;
// //   deadline: string; description?: string;
// //   clientId?: { _id?: string; name?: string } | string;
// //   designerId?: { _id?: string; name?: string } | string;
// //   revisionInfo?: { used: number; limit: number; remaining: number };
// // }

// // interface AppNotif {
// //   id: string; type: NotifType; title: string; message: string;
// //   timestamp: string; read: boolean; action?: { label: string; view: SMMView };
// // }

// // // Client with their connected social channels
// // interface ClientWithChannels {
// //   id: string;
// //   name: string;
// //   email: string;
// //   channels: ConnectedChannel[];
// //   loadingChannels?: boolean;
// // }

// // interface ConnectedChannel {
// //   _id?: string;
// //   id?: string;
// //   platform: string;
// //   username?: string;
// //   name?: string;
// //   status?: string;
// // }

// // // ─── Constants ────────────────────────────────────────────────────────────────
// // const PLATFORMS = [
// //   { id: "instagram",  label: "Instagram"  },
// //   { id: "facebook",   label: "Facebook"   },
// //   { id: "twitter",    label: "Twitter/X"  },
// //   { id: "linkedin",   label: "LinkedIn"   },
// //   { id: "youtube",    label: "YouTube"    },
// //   { id: "pinterest",  label: "Pinterest"  },
// // ];

// // const CONNECTABLE_PLATFORMS = [
// //   { id: "instagram", label: "Instagram", color: "from-pink-500 to-orange-400", icon: "📸" },
// //   { id: "facebook",  label: "Facebook",  color: "from-blue-600 to-blue-700",   icon: "👍" },
// //   { id: "twitter",   label: "Twitter/X", color: "from-sky-400 to-sky-500",     icon: "🐦" },
// //   { id: "linkedin",  label: "LinkedIn",  color: "from-blue-700 to-blue-800",   icon: "💼" },
// //   { id: "youtube",   label: "YouTube",   color: "from-red-500 to-red-600",     icon: "▶️" },
// //   { id: "pinterest", label: "Pinterest", color: "from-red-600 to-pink-600",    icon: "📌" },
// // ];

// // // Queue auto-remove after 5 minutes (in ms)
// // const QUEUE_DISPLAY_MS = 5 * 60 * 1000;

// // // ─── Notif helper ─────────────────────────────────────────────────────────────
// // const mkNotif = (type: NotifType, title: string, message: string, action?: AppNotif["action"]): AppNotif => ({
// //   id: `n_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
// //   type, title, message, timestamp: new Date().toISOString(), read: false, action,
// // });

// // // ─── Component ────────────────────────────────────────────────────────────────
// // const SMMDashboard = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const session  = getSession();
// //   const token    = session?.token ?? "";

// //   const [view, setView] = useState<SMMView>("overview");

// //   useEffect(() => {
// //     const locState = location.state as { view?: string } | null;
// //     if (locState?.view === "channels") {
// //       setView("channels");
// //       window.history.replaceState({}, "");
// //     }
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const [userName, setUserName] = useState("SMM Executive");

// //   // ── Dark Mode ──────────────────────────────────────────────────────────────
// //   const [dark, setDark] = useState<boolean>(() => localStorage.getItem(DARK_MODE_KEY) === "true");
// //   useEffect(() => {
// //     localStorage.setItem(DARK_MODE_KEY, String(dark));
// //     document.documentElement.classList.toggle("smm-dark", dark);
// //   }, [dark]);

// //   // ── Notifications ──────────────────────────────────────────────────────────
// //   const [notifs, setNotifs]       = useState<AppNotif[]>(() => {
// //     try { return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "[]"); } catch { return []; }
// //   });
// //   const [notifOpen, setNotifOpen] = useState(false);
// //   const [notifTab, setNotifTab]   = useState<0|1>(0);
// //   const notifRef                  = useRef<HTMLDivElement>(null);

// //   const saveNotifs = useCallback((arr: AppNotif[]) => {
// //     const t = arr.slice(0, 50);
// //     localStorage.setItem(NOTIF_KEY, JSON.stringify(t));
// //     return t;
// //   }, []);

// //   const pushNotif = useCallback((n: AppNotif) => {
// //     setNotifs(prev => saveNotifs([n, ...prev]));
// //   }, [saveNotifs]);

// //   const markAllRead = () => setNotifs(prev => saveNotifs(prev.map(n => ({ ...n, read: true }))));
// //   const clearNotifs = () => { setNotifs([]); localStorage.removeItem(NOTIF_KEY); };
// //   const deleteNotif = (id: string) => setNotifs(prev => saveNotifs(prev.filter(n => n.id !== id)));
// //   const unreadCount = notifs.filter(n => !n.read).length;

// //   useEffect(() => {
// //     if (!notifOpen) return;
// //     const h = (e: MouseEvent) => {
// //       if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
// //     };
// //     document.addEventListener("mousedown", h);
// //     return () => document.removeEventListener("mousedown", h);
// //   }, [notifOpen]);

// //   // ── API state ──────────────────────────────────────────────────────────────
// //   const [overview, setOverview]         = useState<OverviewRes | null>(null);
// //   const [overviewLoading, setOvLoading] = useState(false);
// //   const [smmDashData, setSmmDashData]   = useState<any>(null);

// //   // clientList and gdList — extracted from design projects API
// //   const [clientList, setClientList]     = useState<{ id:string; name:string; email:string }[]>([]);
// //   const [gdList, setGdList]             = useState<{ id:string; name:string; email:string }[]>([]);

// //   // Clients with their channels (for Channels view)
// //   const [clientsWithChannels, setClientsWithChannels]   = useState<ClientWithChannels[]>([]);
// //   const [clientChannelsLoading, setClientChannelsLoading] = useState(false);

// //   const [designProjects, setDesignProjects]   = useState<DesignProject[]>([]);
// //   const [designLoading,  setDesignLoading]    = useState(false);
// //   const [showAddDesign,  setShowAddDesign]    = useState(false);
// //   const [designFilter,   setDesignFilter]    = useState("");
// //   const [newDP, setNewDP] = useState({
// //     clientId:"", designerId:"", title:"", designType:"Social Post",
// //     deadline:"", priority:"Medium", description:"",
// //     targetAudience:"", brandColors:"", fontPreferences:"", revisionLimit:3,
// //   });
// //   const [dpSaving, setDpSaving]               = useState(false);
// //   const [selProject, setSelProject]           = useState<DesignProject | null>(null);
// //   const [projComments, setProjComments]       = useState<any[]>([]);
// //   const [newComment, setNewComment]           = useState("");
// //   const [commentSending, setCommentSending]   = useState(false);

// //   const [posts, setPosts]               = useState<Post[]>([]);
// //   const [postsLoading, setPostsLoading] = useState(false);
// //   const [postsError, setPostsError]     = useState<string | null>(null);

// //   // Queue: track publishedAt for instant posts, auto-remove after 5 min
// //   const [queuedPosts, setQueuedPosts]   = useState<(Post & { queuedAt?: number })[]>([]);
// //   const [queueLoading, setQueueLoading] = useState(false);
// //   const [publishingId, setPublishingId] = useState<string | null>(null);

// //   const [drafts, setDrafts]             = useState<Post[]>([]);
// //   const [draftsLoading, setDraftsLoading] = useState(false);
// //   const [deletingDid, setDeletingDid]   = useState<string | null>(null);

// //   const [pubPosts, setPubPosts]         = useState<Post[]>([]);
// //   const [pubLoading, setPubLoading]     = useState(false);

// //   // My agency's own channels
// //   const [channels, setChannels]               = useState<any[]>([]);
// //   const [channelsLoading, setChanLoading]     = useState(false);
// //   const [disconnectingId, setDiscId]          = useState<string | null>(null);
// //   const [connectingPlatform, setConnPlat]     = useState<string | null>(null);

// //   const [analytics, setAnalytics]             = useState<any>(null);
// //   const [analyticsLoading, setAnaLoading]     = useState(false);

// //   // ── Compose state ──────────────────────────────────────────────────────────
// //   const [composeContent, setComposeContent]   = useState("");
// //   // Selected client for this post
// //   const [composeClientId, setComposeClientId] = useState("");
// //   // Channels of the selected client
// //   const [clientConnectedChannels, setClientConnectedChannels] = useState<ConnectedChannel[]>([]);
// //   const [clientChannelsFetching, setClientChannelsFetching]   = useState(false);
// //   const [composePlatforms, setComposePlatforms] = useState<string[]>([]);
// //   const [composeScheduleDate, setComposeScheduleDate] = useState("");
// //   const [composeScheduleTime, setComposeScheduleTime] = useState("");
// //   const [composeSaving, setComposeSaving]     = useState(false);
// //   const [composeMedia, setComposeMedia]       = useState<File | null>(null);
// //   const [composePreview, setComposePreview]   = useState<string | null>(null);
// //   const [composeTags, setComposeTags]         = useState<string[]>([]);
// //   const [composeTagInput, setComposeTagInput] = useState("");
// //   const [editingDraft, setEditingDraft]       = useState<Post | null>(null);

// //   // YouTube specific state
// //   const [youtubeTitle,   setYoutubeTitle]   = useState("");
// //   const [youtubePrivacy, setYoutubePrivacy] = useState<"public"|"private"|"unlisted">("public");
// //   const [isVideoFile,    setIsVideoFile]    = useState(false);

// //   // GD Tasks (local storage based)
// //   const [gdTasks, setGdTasks]           = useState<GDTask[]>([]);
// //   const completedGDCount = gdTasks.filter(t => t.status === "completed").length;
// //   const totalBadgeCount = (notifs.filter(n => !n.read).length) + completedGDCount;
// //   const [showAddTask, setShowAddTask]   = useState(false);
// //   const [newTask, setNewTask] = useState({
// //     title:"", description:"", clientName:"", gdName:"",
// //     platform:"Instagram", deadline:"", priority:"medium" as Priority, notes:"",
// //   });

// //   const [calMonth, setCalMonth] = useState(new Date());
// //   const prevGDTasksRef = useRef<GDTask[]>([]);

// //   // Connecting channel state per client
// //   const [connectingForClient, setConnectingForClient] = useState<string|null>(null);

// //   // ── Auto-remove instant posts from queue after 5 min ──────────────────────
// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       const now = Date.now();
// //       setQueuedPosts(prev => {
// //         const filtered = prev.filter(p => {
// //           // If post has no scheduleAt, it's an instant post — remove after QUEUE_DISPLAY_MS
// //           const isInstant = !p.scheduleAt && !p.scheduled_at;
// //           if (isInstant && p.queuedAt && (now - p.queuedAt) >= QUEUE_DISPLAY_MS) {
// //             return false;
// //           }
// //           return true;
// //         });
// //         return filtered;
// //       });
// //     }, 10_000); // check every 10s
// //     return () => clearInterval(interval);
// //   }, []);

// //   // Watch for GD tasks becoming completed → push notification
// //   useEffect(() => {
// //     const prev = prevGDTasksRef.current;
// //     if (prev.length > 0) {
// //       gdTasks.forEach(task => {
// //         const prevTask = prev.find(t => t.id === task.id);
// //         if (prevTask && prevTask.status !== "completed" && task.status === "completed") {
// //           pushNotif(mkNotif("info", "GD Task Completed! 🎨",
// //             `"${task.title}" by ${task.gdName} is ready for review`,
// //             { label: "Review Now", view: "gd_tasks" }));
// //         }
// //       });
// //     }
// //     prevGDTasksRef.current = gdTasks;
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [gdTasks]);

// //   // ── Init ────────────────────────────────────────────────────────────────────
// //   useEffect(() => {
// //     const name = localStorage.getItem("socialflow_user_name") || "SMM Executive";
// //     setUserName(name);
// //     const stored = localStorage.getItem(GD_TASKS_KEY);
// //     if (stored) setGdTasks(JSON.parse(stored));
// //     if (token) {
// //       loadOverview();
// //       loadPosts();
// //       loadSMMDashboard();
// //       loadUsersForDropdowns();
// //     }
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [token]);

// //   useEffect(() => {
// //     if (!token) return;
// //     if (view === "overview")        { loadOverview(); loadPosts(); }
// //     if (view === "queue")           loadQueued();
// //     if (view === "drafts")          loadDrafts();
// //     if (view === "published")       loadPublished();
// //     if (view === "analytics")       loadAnalytics();
// //     if (view === "calendar")        loadPosts();
// //     if (view === "channels")        { loadChannels(); loadClientsWithChannels(); }
// //     if (view === "design_projects") loadDesignProjects();
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [view]);

// //   // When client changes in compose, fetch their channels
// //   useEffect(() => {
// //     if (composeClientId) fetchClientChannels(composeClientId);
   
// //     else { setClientConnectedChannels([]); setComposePlatforms([]); }
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [composeClientId]);
// //    console.log("jheta",composeClientId);

// //   // ── Loaders ─────────────────────────────────────────────────────────────────
// //   const loadOverview = async () => {
// //     setOvLoading(true);
// //     try { const { data } = await apiGetOverview(token); if (data) setOverview(data); } catch {}
// //     setOvLoading(false);
// //   };

// //   const loadSMMDashboard = async () => {
// //     const { data } = await apiSMMDashboard(token);
// //     if (data) {
// //       const d = (data as any)?.data ?? data;
// //       setSmmDashData(d);
// //       extractUsers((d as any)?.recentProjects ?? []);
// //     }
// //   };

// //   const extractUsers = (projects: any[]) => {
// //     if (!Array.isArray(projects) || !projects.length) return;
// //     const cm = new Map<string,{id:string;name:string;email:string}>();
// //     const gm = new Map<string,{id:string;name:string;email:string}>();
// //     projects.forEach((p:any) => {
// //       const c = p.clientId;
// //       if (c && typeof c==="object" && c._id)
// //         cm.set(c._id, {id:c._id, name:c.name||"Client", email:c.email||""});
// //       const g = p.designerId;
// //       if (g && typeof g==="object" && g._id)
// //         gm.set(g._id, {id:g._id, name:g.name||"Designer", email:g.email||""});
// //     });
// //     if (cm.size) setClientList(prev => {
// //       const m=new Map(prev.map(x=>[x.id,x])); cm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
// //     });
// //     if (gm.size) setGdList(prev => {
// //       const m=new Map(prev.map(x=>[x.id,x])); gm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
// //     });
// //   };

// //   const loadUsersForDropdowns = async () => {
// //     // FIXED: pehle ye function localStorage (per-device, stale) aur design
// //     // projects (jo tab tak khaali rehta hai jab tak koi design project na
// //     // bana ho) se client/GD list nikaalta tha. Ab seedha backend ke
// //     // dedicated SMM endpoints se agency ke saare Client/GD milte hain —
// //     // in dono me se koi bhi active ho, list turant dikhegi.
// //     try {
// //       const { data: clientsRes, error: clientsErr } = await apiSMMGetClients(token);
// //       if (clientsErr) {
// //         console.warn("SMM clients fetch failed:", clientsErr);
// //       } else {
// //         const clients = (clientsRes as any)?.data?.clients ?? [];
// //         setClientList(
// //           clients.map((c: any) => ({ id: c._id, name: c.name, email: c.email || "" }))
// //         );
// //       }
// //     } catch (e) {
// //       console.warn("SMM clients fetch error:", e);
// //     }

// //     try {
// //       const { data: gdRes, error: gdErr } = await apiSMMGetGraphicDesigners(token);
// //       if (gdErr) {
// //         console.warn("SMM graphic designers fetch failed:", gdErr);
// //       } else {
// //         const designers = (gdRes as any)?.data?.designers ?? [];
// //         setGdList(
// //           designers.map((g: any) => ({ id: g._id, name: g.name, email: g.email || "" }))
// //         );
// //       }
// //     } catch (e) {
// //       console.warn("SMM graphic designers fetch error:", e);
// //     }
// //   };

// //   // Fetch channels for a specific client (by clientId)
// // //  const fetchClientChannels = async (clientId: string) => {
// // //   if (!clientId) return;
// // //   setClientChannelsFetching(true);
// // //   try {
// // //     const endpoints = [
// // //       `${BASE_URL}/api/social-accounts?userId=${clientId}`,
// // //       `${BASE_URL}/api/social-accounts?clientId=${clientId}`,
// // //       `${BASE_URL}/api/clients/${clientId}/social-accounts`,
// // //       `${BASE_URL}/api/clients/${clientId}/channels`,
// // //     ];
// // //     let found: ConnectedChannel[] = [];
// // //     for (const url of endpoints) {
// // //       try {
// // //         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// // //         if (res.ok) {
// // //           const json = await res.json();
// // //           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// // //           const arr = Array.isArray(raw) ? raw : [];
// // //           if (arr.length > 0) { found = arr; break; }
// // //         }
// // //       } catch { /* try next */ }
// // //     }
// // //     setClientConnectedChannels(found);
// // //     setComposePlatforms([]);
// // //   } catch {
// // //     setClientConnectedChannels([]);
// // //   }
// // //   setClientChannelsFetching(false);
// // // };

// // // ✅ NAYA (replace karo)
// // const fetchClientChannels = async (clientId: string) => {
// //   if (!clientId) return;
// //   setClientChannelsFetching(true);
// //   try {
// //     const res = await fetch(
// //       `${BASE_URL}/api/social/accounts?clientId=${clientId}`,
// //       // { headers: { Authorization: `Bearer ${token}` } }
// //       { headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } }

// //     );
// //     if (res.ok) {
// //       const json = await res.json();
// //       const raw = json?.data ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// //       setClientConnectedChannels(Array.isArray(raw) ? raw : []);
// //     } else {
// //       setClientConnectedChannels([]);
// //     }
// //   } catch {
// //     setClientConnectedChannels([]);
// //   }
// //   setComposePlatforms([]);
// //   setClientChannelsFetching(false);
// // };

// //   // Load all clients and their channels for Channels view
// // // const loadClientsWithChannels = async () => {
// // //   setClientChannelsLoading(true);

// // //   // FIX: don't rely on stale clientList state — fetch fresh
// // //   let clients = clientList;
// // //   if (clients.length === 0) {
// // //     const { data } = await apiSMMGetDesignProjects(token, { limit: 100 });
// // //     const raw = data as any;
// // //     const projects = raw?.data?.projects ?? raw?.projects ?? raw?.data ?? [];
// // //     const cm = new Map<string, { id: string; name: string; email: string }>();
// // //     if (Array.isArray(projects)) {
// // //       projects.forEach((p: any) => {
// // //         const c = p.clientId;
// // //         if (c && typeof c === "object" && c._id)
// // //           cm.set(c._id, { id: c._id, name: c.name || "Client", email: c.email || "" });
// // //       });
// // //     }
// // //     clients = Array.from(cm.values());
// // //     if (clients.length > 0) setClientList(clients); // update state too
// // //   }

// // //   if (clients.length === 0) { setClientChannelsLoading(false); return; }

// // //   const updated: ClientWithChannels[] = [];
// // //   for (const client of clients) {
// // //     // FIX: try multiple endpoint patterns
// // //     const endpoints = [
// // //       `${BASE_URL}/api/social-accounts?userId=${client.id}`,
// // //       `${BASE_URL}/api/social-accounts?clientId=${client.id}`,
// // //       `${BASE_URL}/api/clients/${client.id}/social-accounts`,
// // //       `${BASE_URL}/api/clients/${client.id}/channels`,
// // //     ];
// // //     let channels: ConnectedChannel[] = [];
// // //     for (const url of endpoints) {
// // //       try {
// // //         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// // //         if (res.ok) {
// // //           const json = await res.json();
// // //           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// // //           const arr = Array.isArray(raw) ? raw : [];
// // //           if (arr.length > 0) { channels = arr; break; }
// // //         }
// // //       } catch { /* try next */ }
// // //     }
// // //     updated.push({ ...client, channels });
// // //   }
// // //   setClientsWithChannels(updated);
// // //   setClientChannelsLoading(false);
// // // };
// // const loadClientsWithChannels = async () => {
// //   setClientChannelsLoading(true);

// //   // FIXED: ab stale/design-projects-derived list pe depend nahi karte —
// //   // seedha backend se fresh client list mangte hain.
// //   let clients = clientList;
// //   if (clients.length === 0) {
// //     const { data } = await apiSMMGetClients(token);
// //     const fetched = (data as any)?.data?.clients ?? [];
// //     clients = fetched.map((c: any) => ({ id: c._id, name: c.name, email: c.email || "" }));
// //     if (clients.length > 0) setClientList(clients);
// //   }

// //   if (clients.length === 0) { setClientChannelsLoading(false); return; }

// //   const updated: ClientWithChannels[] = [];
// //   for (const client of clients) {
// //     // ✅ FIXED: single correct endpoint
// //     let channels: ConnectedChannel[] = [];
// //     try {
// //       const res = await fetch(
// //         `${BASE_URL}/api/social/accounts?clientId=${client.id}`,
// //         // { headers: { Authorization: `Bearer ${token}` } }
// //         { headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } }

// //       );
// //       if (res.ok) {
// //         const json = await res.json();
// //         const raw = json?.data ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// //         channels = Array.isArray(raw) ? raw : [];
// //       }
// //     } catch { /* ignore */ }
// //     updated.push({ ...client, channels });
// //   }
// //   setClientsWithChannels(updated);
// //   setClientChannelsLoading(false);
// // };

// //   const loadDesignProjects = async () => {
// //     setDesignLoading(true);
// //     const { data, error } = await apiSMMGetDesignProjects(token, designFilter ? {status:designFilter} : undefined);
// //     if (error) { toast.error("Load failed: "+error); pushNotif(mkNotif("error","Projects Load Failed",error)); }
// //     else {
// //       const raw=data as any;
// //       const list=raw?.data?.projects??raw?.projects??raw?.data??(Array.isArray(raw)?raw:[]);
// //       const arr=Array.isArray(list)?list:[];
// //       setDesignProjects(arr); extractUsers(arr);
// //     }
// //     setDesignLoading(false);
// //   };

// //   const loadPosts = async () => {
// //     setPostsLoading(true); setPostsError(null);
// //     const { data, error } = await apiGetPosts(token);
// //     if (error) { if(!error.includes("404")&&!error.includes("not found")) setPostsError(error); }
// //     else {
// //       const raw=data as any;
// //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       setPosts(Array.isArray(list)?list:[]);
// //     }
// //     setPostsLoading(false);
// //   };

// //   const loadQueued = async () => {
// //     setQueueLoading(true);
// //     const { data, error } = await apiGetQueuedPosts(token);
// //     if (error) toast.error("Queue load failed: "+error);
// //     else {
// //       const raw=data as any;
// //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       const arr: (Post & { queuedAt?: number })[] = Array.isArray(list) ? list : [];
// //       // Preserve existing queuedAt timestamps for posts already in state
// //       const merged = arr.map(p => {
// //         const existing = queuedPosts.find(q => (q._id??q.id) === (p._id??p.id));
// //         return existing ? { ...p, queuedAt: existing.queuedAt } : { ...p, queuedAt: Date.now() };
// //       });
// //       if (merged.length > queuedPosts.length && queuedPosts.length > 0)
// //         pushNotif(mkNotif("info","Queue Updated",`${merged.length-queuedPosts.length} new post(s) added to queue`,{label:"View Queue",view:"queue"}));
// //       setQueuedPosts(merged);
// //     }
// //     setQueueLoading(false);
// //   };

// //   const loadDrafts = async () => {
// //     setDraftsLoading(true);
// //     const { data, error } = await apiGetDrafts(token);
// //     if (error) toast.error("Drafts load failed: "+error);
// //     else {
// //       const raw=data as any;
// //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       setDrafts(Array.isArray(list)?list:[]);
// //     }
// //     setDraftsLoading(false);
// //   };

// //   const loadPublished = async () => {
// //     setPubLoading(true);
// //     const { data, error } = await apiGetPosts(token, "published");
// //     if (error) toast.error("Published load failed: "+error);
// //     else {
// //       const raw=data as any;
// //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       setPubPosts(Array.isArray(list)?list:[]);
// //     }
// //     setPubLoading(false);
// //   };

// //   const loadAnalytics = async () => {
// //     setAnaLoading(true);
// //     const { data } = await apiGetAnalytics(token,"7d");
// //     if (data?.data) setAnalytics(data.data);
// //     setAnaLoading(false);
// //   };

// //   const loadChannels = async () => {
// //     setChanLoading(true);
// //     const { data, error } = await apiGetSocialAccounts(token);
// //     if (error) toast.error("Channels load failed: "+error);
// //     else {
// //       const raw=data as any;
// //       const list=raw?.channels??raw?.accounts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       setChannels(Array.isArray(list)?list:[]);
// //     }
// //     setChanLoading(false);
// //   };

// //   // ── Actions ─────────────────────────────────────────────────────────────────
// //   const handleLogout = () => {
// //     clearSession(); localStorage.removeItem("socialflow_role"); navigate("/"); toast.success("Logged out successfully");
// //   };

// //   const togglePlat = (id:string) => setComposePlatforms(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);

// //   const handleCompose = async (action:"draft"|"queue"|"schedule") => {
// //     if (!composeContent.trim()) { toast.error("Please add some content"); return; }
// //     if (action!=="draft"&&composePlatforms.length===0) { toast.error("Please select at least one platform"); return; }
// //     if (action!=="draft"&&!composeClientId) { toast.error("Please select a client"); return; }
// //     if (action!=="draft" && composePlatforms.includes("youtube") && !isVideoFile) {
// //       toast.error("YouTube ke liye video file select karo (MP4)"); return;
// //     }
// //     setComposeSaving(true);
// //     try {
// //       if (action==="draft") {
// //         if (editingDraft) {
// //           const id=editingDraft._id??editingDraft.id??"";
// //           const {error}=await apiUpdateDraft(token,id,composeContent,composePlatforms,composeMedia?[composeMedia]:[]);
// //           if(error){toast.error("Update failed: "+error);return;}
// //           toast.success("Draft updated!");
// //           pushNotif(mkNotif("success","Draft Updated","Draft saved successfully",{label:"View Drafts",view:"drafts"}));
// //         } else {
// //           const {error}=await apiSaveDraft(token,composeContent,composePlatforms,composeTags,composeMedia?[composeMedia]:[]);
// //           if(error){toast.error("Save failed: "+error);return;}
// //           toast.success("Draft saved!");
// //           pushNotif(mkNotif("success","Draft Saved","New draft saved",{label:"View Drafts",view:"drafts"}));
// //         }
// //         resetCompose(); setView("drafts");
// //       } else {
// //         let schedAt: string | null = null;
// //         if (composeScheduleDate && composeScheduleTime) {
// //           schedAt = new Date(`${composeScheduleDate}T${composeScheduleTime}`).toISOString();
// //         } else if (composeScheduleDate) {
// //           schedAt = new Date(`${composeScheduleDate}T00:00`).toISOString();
// //         }
// //         // const {error}=await apiCreatePost(
// //         //   token, composeContent, composePlatforms, composeTags,
// //         //   composeMedia?[composeMedia]:[], schedAt??null,
// //         //   youtubeTitle || undefined,
// //         //   youtubePrivacy || undefined
// //         // );
// //         // ✅ NAYA — clientId add karo end mein
// // const {error} = await apiCreatePost(
// //   token, composeContent, composePlatforms, composeTags,
// //   composeMedia?[composeMedia]:[], schedAt??null,
// //   youtubeTitle || undefined,
// //   youtubePrivacy || undefined,
// //   composeClientId || undefined   // ✅ ADD
// // );
// //         if(error){toast.error("Post failed: "+error);return;}
// //         const isScheduled = !!schedAt;
// //         toast.success(isScheduled?"Post scheduled!":"Post added to queue!");
// //         pushNotif(mkNotif("success",isScheduled?"Post Scheduled":"Post Queued",
// //           isScheduled?`Will publish on ${new Date(schedAt!).toLocaleString("en-IN")}`:"Instant post added to queue — will publish in ~5 minutes",
// //           {label:"View Queue",view:"queue"}));
// //         resetCompose(); setView("queue");
// //         // Refresh queue immediately
// //         setTimeout(() => loadQueued(), 500);
// //       }
// //     } catch { toast.error("Network error"); }
// //     finally { setComposeSaving(false); }
// //   };

// //   const resetCompose = () => {
// //     setComposeContent(""); setComposePlatforms([]);
// //     setComposeScheduleDate(""); setComposeScheduleTime("");
// //     setComposeMedia(null); setComposePreview(null);
// //     setEditingDraft(null); setComposeTags([]); setComposeTagInput("");
// //     setComposeClientId(""); setClientConnectedChannels([]);
// //     setYoutubeTitle(""); setYoutubePrivacy("public"); setIsVideoFile(false);
// //   };

// //   const handleTagKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key==="Enter"||e.key===","||e.key===" ") {
// //       e.preventDefault();
// //       const t=composeTagInput.trim().replace(/^#/,"");
// //       if(t&&!composeTags.includes(t)) setComposeTags(p=>[...p,t]);
// //       setComposeTagInput("");
// //     }
// //   };

// //   const handlePublishNow = async (pid:string) => {
// //     setPublishingId(pid);
// //     const {error}=await apiPublishPost(token,pid);
// //     if(error){
// //       toast.error("Publish failed: "+error);
// //       pushNotif(mkNotif("error","Publish Failed",error));
// //     } else {
// //       toast.success("Post published!");
// //       pushNotif(mkNotif("success","Published! 🎉","Post published successfully",{label:"View Published",view:"published"}));
// //       // Remove from queue immediately
// //       setQueuedPosts(prev => prev.filter(p => (p._id??p.id) !== pid));
// //       loadOverview();
// //     }
// //     setPublishingId(null);
// //   };

// //   const handleDeleteDraft = async (id:string) => {
// //     if(!confirm("Are you sure you want to delete this draft?")) return;
// //     setDeletingDid(id);
// //     const {error}=await apiDeleteDraft(token,id);
// //     if(error) toast.error("Delete failed: "+error);
// //     else{toast.success("Draft deleted!");pushNotif(mkNotif("warning","Draft Deleted","A draft was deleted"));loadDrafts();}
// //     setDeletingDid(null);
// //   };

// //   const handleEditDraft = (d:Post) => {
// //     setEditingDraft(d); setComposeContent(d.content); setComposePlatforms(d.platforms??[]);
// //     setView("compose");
// //   };

// //   // Connect a channel for a specific client
// // const handleConnectForClient = async (platId: string, clientId: string) => {
// //   const key = `${clientId}_${platId}`;
// //   setConnectingForClient(key);
// //   // ✅ FIX: clientId pass karo — backend pe SMM ke liye MANDATORY hai
// //   const { data, error } = await apiGetOAuthUrl(token, platId, clientId);
// //   if (error) { toast.error("OAuth failed: " + error); setConnectingForClient(null); return; }
// //   const url = (data as any)?.authUrl ?? (data as any)?.url ?? (data as any)?.redirectUrl;
// //   const oauthState = (data as any)?.state ?? (data as any)?.oauthState ?? null;
// //   if (url) {
// //     localStorage.setItem("oauth_platform", platId);
// //     localStorage.setItem("oauth_client_id", clientId);
// //     if (oauthState) localStorage.setItem("oauth_state", oauthState);
// //     // window.open(url, "_blank");
// //     window.location.href = url;
// //     pushNotif(mkNotif("info", "Platform Connect", `Connecting ${platId} for client...`, { label: "View Channels", view: "channels" }));

// //     // ✅ FIX: Refresh channels when user comes back after OAuth
// //     const refreshOnFocus = () => {
// //       window.removeEventListener("focus", refreshOnFocus);
// //       setTimeout(() => {
// //         loadClientsWithChannels();
// //         if (composeClientId === clientId) fetchClientChannels(clientId);
// //       }, 1500);
// //     };
// //     window.addEventListener("focus", refreshOnFocus);
// //   } else toast.error("No OAuth URL returned");
// //   setConnectingForClient(null);
// // };

// //   // Disconnect a channel for a client
// //   const handleDisconnectClientChannel = async (channelId:string, clientId:string) => {
// //     if(!confirm("Are you sure you want to disconnect this account?")) return;
// //     const {error}=await apiDisconnectSocialAccount(token,channelId);
// //     if(error) toast.error("Disconnect failed: "+error);
// //     else{
// //       toast.success("Disconnected!");
// //       pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));
// //       // Update local state
// //       setClientsWithChannels(prev => prev.map(c =>
// //         c.id === clientId
// //           ? { ...c, channels: c.channels.filter(ch => (ch._id??ch.id) !== channelId) }
// //           : c
// //       ));
// //       // Also refresh compose client channels if needed
// //       if(composeClientId === clientId) fetchClientChannels(clientId);
// //     }
// //   };

// //   const handleConnect = async (platId:string) => {
// //     setConnPlat(platId);
// //     const {data,error}=await apiGetOAuthUrl(token,platId);
// //     if(error){toast.error("OAuth failed: "+error);setConnPlat(null);return;}
// //     const url=(data as any)?.authUrl??(data as any)?.url??(data as any)?.redirectUrl;
// //     const oauthState=(data as any)?.state??(data as any)?.oauthState??null;
// //     if(url){
// //       localStorage.setItem("oauth_platform", platId);
// //       if(oauthState) localStorage.setItem("oauth_state", oauthState);
// //       // window.open(url,"_blank");
// //       window.location.href = url;
// //       pushNotif(mkNotif("info","Platform Connect",`Connecting ${platId}...`,{label:"View Channels",view:"channels"}));
// //     } else toast.error("No OAuth URL returned");
// //     setConnPlat(null);
// //   };

// //   const handleDisconnect = async (cid:string) => {
// //     if(!confirm("Are you sure you want to disconnect this account?")) return;
// //     setDiscId(cid);
// //     const {error}=await apiDisconnectSocialAccount(token,cid);
// //     if(error) toast.error("Disconnect failed: "+error);
// //     else{toast.success("Disconnected!");pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));loadChannels();}
// //     setDiscId(null);
// //   };

// //   const handleCreateDP = async (e:React.FormEvent) => {
// //     e.preventDefault();
// //     if(!newDP.clientId||!newDP.designerId||!newDP.title||!newDP.deadline){toast.error("Please fill all required fields");return;}
// //     setDpSaving(true);
// //     const {error}=await apiSMMCreateDesignProject(token,{...newDP});
// //     if(error) toast.error("Create failed: "+error);
// //     else{
// //       toast.success("Project created!");
// //       pushNotif(mkNotif("success","Project Created",`"${newDP.title}" assigned to designer`,{label:"View Projects",view:"design_projects"}));
// //       setShowAddDesign(false);
// //       setNewDP({clientId:"",designerId:"",title:"",designType:"Social Post",deadline:"",priority:"Medium",description:"",targetAudience:"",brandColors:"",fontPreferences:"",revisionLimit:3});
// //       loadDesignProjects();
// //     }
// //     setDpSaving(false);
// //   };

// //   const handleDeleteDP = async (id:string) => {
// //     if(!confirm("Are you sure you want to delete this project?")) return;
// //     const {error}=await apiSMMDeleteDesignProject(token,id);
// //     if(error) toast.error("Delete failed: "+error);
// //     else{toast.success("Deleted!");pushNotif(mkNotif("warning","Project Deleted","Design project deleted"));loadDesignProjects();}
// //   };

// //   const handleApproveReject = async (id:string, act:"approve"|"reject") => {
// //     const note=prompt(act==="approve"?"Approval note (optional):":"Rejection reason:");
// //     if(act==="reject"&&!note) return;
// //     const {error}=await apiSMMApproveRejectProject(token,id,act,note??"");
// //     if(error) toast.error("Action failed: "+error);
// //     else{
// //       toast.success(act==="approve"?"Approved!":"Rejected!");
// //       pushNotif(mkNotif(act==="approve"?"success":"warning",act==="approve"?"Project Approved":"Project Rejected","Design project "+act+"ed",{label:"View Projects",view:"design_projects"}));
// //       loadDesignProjects();
// //     }
// //   };

// //   const handleRevisionReq = async (id:string) => {
// //     const msg=prompt("Please enter revision details:");
// //     if(!msg) return;
// //     const {error}=await apiSMMRequestRevision(token,id,msg);
// //     if(error) toast.error("Revision failed: "+error);
// //     else{toast.success("Revision request sent!");pushNotif(mkNotif("info","Revision Requested","Revision request sent to designer",{label:"View Projects",view:"design_projects"}));loadDesignProjects();}
// //   };

// //   const openProjectDetail = async (project:DesignProject) => {
// //     setSelProject(project);
// //     const pid=project._id??project.id??"";
// //     const {data}=await apiSMMGetComments(token,pid);
// //     const raw=data as any;
// //     const list=raw?.data??raw?.comments??[];
// //     setProjComments(Array.isArray(list)?list:[]);
// //   };

// //   const handleSendComment = async () => {
// //     if(!newComment.trim()||!selProject) return;
// //     setCommentSending(true);
// //     const pid=selProject._id??selProject.id??"";
// //     const {error}=await apiSMMAddComment(token,pid,newComment);
// //     if(error) toast.error("Comment failed: "+error);
// //     else{toast.success("Comment sent!");setNewComment("");openProjectDetail(selProject);}
// //     setCommentSending(false);
// //   };

// //   const handleAssignTask = (e:React.FormEvent) => {
// //     e.preventDefault();
// //     if(!newTask.title||!newTask.clientName||!newTask.deadline){toast.error("Please fill all required fields");return;}
// //     const task:GDTask={
// //       id:"T"+Date.now().toString().slice(-6), ...newTask,
// //       status:"pending", assignedBy:`${userName} (SMM)`,
// //       assignedAt:new Date().toISOString().split("T")[0],
// //     };
// //     const upd=[task,...gdTasks];
// //     setGdTasks(upd);
// //     localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
// //     setShowAddTask(false);
// //     setNewTask({title:"",description:"",clientName:"",gdName:"",platform:"Instagram",deadline:"",priority:"medium",notes:""});
// //     toast.success("Task assigned!");
// //     pushNotif(mkNotif("success","Task Assigned",`"${task.title}" assigned to designer`,{label:"GD Tasks",view:"gd_tasks"}));
// //   };

// //   const handleRevision = (tid:string, comment:string) => {
// //     const upd=gdTasks.map(t=>t.id===tid?{...t,status:"revision" as TaskStatus,revisionComment:comment}:t);
// //     setGdTasks(upd); localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
// //     toast.success("Revision request sent");
// //     pushNotif(mkNotif("info","Revision Requested","Revision requested for GD task",{label:"GD Tasks",view:"gd_tasks"}));
// //   };

// //   const handleGDTaskApproveReject = (taskId: string, action: "approve"|"reject") => {
// //     const upd = gdTasks.map(t =>
// //       t.id === taskId
// //         ? { ...t, status: (action === "approve" ? "completed" : "revision") as TaskStatus }
// //         : t
// //     );
// //     setGdTasks(upd);
// //     localStorage.setItem(GD_TASKS_KEY, JSON.stringify(upd));
// //     toast.success(action === "approve" ? "Task approved!" : "Task sent for revision!");
// //     pushNotif(mkNotif(
// //       action === "approve" ? "success" : "warning",
// //       action === "approve" ? "Task Approved ✅" : "Task Rejected",
// //       action === "approve" ? "GD task approved and marked complete" : "GD task sent back for revision",
// //       { label: "GD Tasks", view: "gd_tasks" }
// //     ));
// //     setNotifOpen(false);
// //   };

// //   // ── Computed ─────────────────────────────────────────────────────────────────
// //   const taskCounts = {
// //     pending:     gdTasks.filter(t=>t.status==="pending").length,
// //     in_progress: gdTasks.filter(t=>t.status==="in_progress").length,
// //     revision:    gdTasks.filter(t=>t.status==="revision").length,
// //     completed:   gdTasks.filter(t=>t.status==="completed").length,
// //   };

// //   const calDays = (() => {
// //     const y=calMonth.getFullYear(), m=calMonth.getMonth();
// //     const off=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
// //     const cells:(Date|null)[]= [];
// //     for(let i=0;i<off;i++) cells.push(null);
// //     for(let d=1;d<=dim;d++) cells.push(new Date(y,m,d));
// //     while(cells.length%7!==0) cells.push(null);
// //     return cells;
// //   })();

// //   const postsForDay=(d:Date)=>posts.filter(p=>{
// //     const ds=p.scheduleAt??p.scheduled_at??p.createdAt;
// //     if(!ds)return false;
// //     const pd=new Date(ds);
// //     return pd.getFullYear()===d.getFullYear()&&pd.getMonth()===d.getMonth()&&pd.getDate()===d.getDate();
// //   });

// //   const weeklyData = analytics?.weeklyData?.length
// //     ? analytics.weeklyData
// //     : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>({day,reach:0,engagement:0}));

// //   const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];

// //   const ovTotal     = overview?.total     ?? (overview?.data as any)?.total     ?? posts.length;
// //   const ovPublished = overview?.published ?? (overview?.data as any)?.published ?? posts.filter(p=>p.status==="published").length;
// //   const ovScheduled = overview?.scheduled ?? (overview?.data as any)?.scheduled ?? posts.filter(p=>p.status==="scheduled").length;
// //   const ovFailed    = overview?.failed    ?? (overview?.data as any)?.failed    ?? posts.filter(p=>p.status==="failed").length;

// //   // Queue time remaining helper
// //   const queueTimeLeft = (p: Post & { queuedAt?: number }): string | null => {
// //     if (p.scheduleAt || p.scheduled_at) return null; // scheduled post — show schedule time
// //     if (!p.queuedAt) return null;
// //     const remaining = QUEUE_DISPLAY_MS - (Date.now() - p.queuedAt);
// //     if (remaining <= 0) return "Publishing soon...";
// //     const mins = Math.floor(remaining / 60000);
// //     const secs = Math.floor((remaining % 60000) / 1000);
// //     return `Publishing in ${mins}m ${secs}s`;
// //   };

// //   const navItems:{key:SMMView;icon:React.ElementType;label:string}[] = [
// //     {key:"overview",        icon:LayoutDashboard, label:"Overview"},
// //     {key:"compose",         icon:PenSquare,       label:"Create Post"},
// //     {key:"queue",           icon:Inbox,           label:"Queue"},
// //     {key:"drafts",          icon:FileText,        label:"Drafts"},
// //     {key:"published",       icon:Globe,           label:"Published"},
// //     {key:"calendar",        icon:Calendar,        label:"Calendar"},
// //     {key:"design_projects", icon:Palette,         label:"Design Projects"},
// //     {key:"gd_tasks",        icon:FileImage,       label:"GD Tasks"},
// //     {key:"analytics",       icon:BarChart3,       label:"Analytics"},
// //     {key:"channels",        icon:LinkIcon,        label:"Channels"},
// //     {key:"clients_gd",      icon:Users,           label:"Clients & GD"},
// //   ];

// //   const viewTitle:Record<SMMView,string>={
// //     overview:"SMM Dashboard", compose:editingDraft?"Edit Draft":"Create Post",
// //     queue:"Queue", drafts:"Drafts", published:"Published",
// //     calendar:"Content Calendar", gd_tasks:"GD Tasks",
// //     design_projects:"Design Projects", analytics:"Analytics", channels:"Channels",
// //     clients_gd:"Clients & Graphic Designers",
// //   };

// //   const statusBadge=(s:string)=>{
// //     const m:Record<string,string>={
// //       draft:"bg-yellow-100 text-yellow-700",
// //       scheduled:"bg-blue-100 text-blue-700",
// //       published:"bg-green-100 text-green-700",
// //       failed:"bg-red-100 text-red-700",
// //       queued:"bg-purple-100 text-purple-700",
// //     };
// //     return m[s]??"bg-slate-100 text-slate-600";
// //   };
// //   const notifIcon=(t:NotifType)=>({success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"}[t]);

// //   // ── RENDER ───────────────────────────────────────────────────────────────────
// //   return (
// //     <div className={`smm-root min-h-screen flex ${dark?"smm-dark":""}`}>

// //       {/* ── Sidebar ── */}
// //       <aside className="smm-sidebar hidden md:flex w-64 flex-col shrink-0">
// //         <div className="p-5 border-b smm-border"><Logo /></div>
// //         <div className="p-4 flex-1">
// //           <div className="smm-profile-card flex items-center gap-3 p-3 rounded-xl mb-4 border">
// //             <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
// //               <Megaphone className="w-5 h-5 text-white" />
// //             </div>
// //             <div className="min-w-0">
// //               <div className="text-sm font-semibold smm-text-primary truncate">{userName}</div>
// //               <div className="text-xs text-green-600 font-medium">SMM Executive</div>
// //             </div>
// //           </div>
// //           <nav className="space-y-0.5">
// //             {navItems.map(n=>(
// //               <button key={n.key} onClick={()=>{resetCompose();setView(n.key);}}
// //                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${view===n.key?"smm-nav-active":"smm-nav-idle"}`}>
// //                 <n.icon className="w-4 h-4 shrink-0" />
// //                 {n.label}
// //                 {n.key==="queue"&&queuedPosts.length>0&&(
// //                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-green-100 text-green-700"}`}>
// //                     {queuedPosts.length}
// //                   </span>
// //                 )}
// //                 {n.key==="drafts"&&drafts.length>0&&(
// //                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-yellow-100 text-yellow-700"}`}>
// //                     {drafts.length}
// //                   </span>
// //                 )}
// //               </button>
// //             ))}
// //           </nav>
// //         </div>
// //         <div className="p-4 border-t smm-border">
// //           <Button variant="ghost" className="w-full justify-start smm-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
// //             <LogOut className="w-4 h-4 mr-2" /> Logout
// //           </Button>
// //         </div>
// //       </aside>

// //       {/* ── Main ── */}
// //       <main className="smm-main flex-1 min-w-0 overflow-y-auto">

// //         {/* Header */}
// //         <header className="smm-header px-6 py-4 flex items-center justify-between sticky top-0 z-20">
// //           <div>
// //             <h1 className="text-xl font-bold smm-text-primary">{viewTitle[view]}</h1>
// //             <p className="text-sm smm-text-muted">Welcome back, {userName}</p>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             {view==="gd_tasks"&&(
// //               <Button onClick={()=>setShowAddTask(true)} className="bg-green-600 hover:bg-green-700">
// //                 <Plus className="w-4 h-4 mr-2"/>Assign Task to GD
// //               </Button>
// //             )}
// //             {view==="design_projects"&&(
// //               <Button onClick={()=>setShowAddDesign(true)} className="bg-green-600 hover:bg-green-700">
// //                 <Plus className="w-4 h-4 mr-2"/>New Design Project
// //               </Button>
// //             )}
// //             {view==="queue"&&(
// //               <Button variant="outline" size="sm" onClick={loadQueued} disabled={queueLoading} className="smm-btn-outline">
// //                 <RefreshCw className={`w-4 h-4 mr-1 ${queueLoading?"animate-spin":""}`}/>Refresh
// //               </Button>
// //             )}
// //             {view==="drafts"&&(
// //               <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{resetCompose();setView("compose");}}>
// //                 <Plus className="w-4 h-4 mr-1"/>New Post
// //               </Button>
// //             )}
// //             {view==="published"&&(
// //               <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
// //                 <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
// //               </Button>
// //             )}
// //             {view==="compose"&&(
// //               <Button variant="outline" size="sm" onClick={()=>{resetCompose();setView("overview");}} className="smm-btn-outline">
// //                 ← Back
// //               </Button>
// //             )}
// //             {view==="channels"&&(
// //               <Button variant="outline" size="sm" onClick={()=>{loadChannels();loadClientsWithChannels();}} className="smm-btn-outline">
// //                 <RefreshCw className="w-4 h-4 mr-1"/>Refresh
// //               </Button>
// //             )}

// //             {/* Dark Mode */}
// //             <button onClick={()=>setDark(d=>!d)} className="smm-icon-btn p-2 rounded-lg transition" title={dark?"Light mode":"Dark mode"}>
// //               {dark?<Sun className="w-5 h-5 text-yellow-400"/>:<Moon className="w-5 h-5 smm-text-secondary"/>}
// //             </button>

// //             {/* Notifications */}
// //             <div className="relative" ref={notifRef}>
// //               <button onClick={()=>setNotifOpen(o=>!o)} className="smm-icon-btn relative p-2 rounded-lg transition">
// //                 <Bell className="w-5 h-5 smm-text-secondary"/>
// //                 {totalBadgeCount>0&&(
// //                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
// //                     {totalBadgeCount>9?"9+":totalBadgeCount}
// //                   </span>
// //                 )}
// //               </button>

// //               {notifOpen&&(
// //                 <div className="smm-notif-panel absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border overflow-hidden z-50">
// //                   <div className="flex items-center justify-between px-4 py-3 border-b smm-border smm-notif-header">
// //                     <span className="font-semibold text-sm smm-text-primary flex items-center gap-2">
// //                       <Bell className="w-4 h-4"/>Notifications
// //                       {unreadCount>0&&<span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
// //                     </span>
// //                     <div className="flex gap-2">
// //                       {notifs.length>0&&(
// //                         <>
// //                           <button onClick={markAllRead} className="text-xs text-green-600 hover:underline">Mark all read</button>
// //                           <button onClick={clearNotifs} className="text-xs text-red-500 hover:underline">Clear</button>
// //                         </>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <div className="flex border-b smm-border">
// //                       <button
// //                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===0?"border-b-2 border-green-500 text-green-600":"smm-text-muted hover:smm-text-primary"}`}
// //                         onClick={()=>setNotifTab(0)}
// //                       >
// //                         All Notifications {unreadCount>0&&<span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">{unreadCount}</span>}
// //                       </button>
// //                       <button
// //                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===1?"border-b-2 border-orange-500 text-orange-600":"smm-text-muted hover:smm-text-primary"}`}
// //                         onClick={()=>setNotifTab(1)}
// //                       >
// //                         GD Tasks Done {completedGDCount>0&&<span className="ml-1 bg-orange-500 text-white text-[9px] px-1 py-0.5 rounded-full">{completedGDCount}</span>}
// //                       </button>
// //                     </div>
// //                     <div className="max-h-[400px] overflow-y-auto">
// //                       {notifTab===0?(
// //                         notifs.length===0?(
// //                           <div className="px-4 py-8 text-center smm-text-muted">
// //                             <BellOff className="w-8 h-8 mx-auto mb-2 opacity-30"/>
// //                             <p className="text-sm">No notifications</p>
// //                           </div>
// //                         ):notifs.map(n=>(
// //                           <div key={n.id} className={`smm-notif-item flex items-start gap-3 px-4 py-3 border-b last:border-b-0 smm-border transition ${!n.read?"smm-notif-unread":""}`}>
// //                             <span className="text-base shrink-0 mt-0.5">{notifIcon(n.type)}</span>
// //                             <div className="flex-1 min-w-0">
// //                               <div className="flex items-start justify-between gap-1">
// //                                 <p className="text-xs font-semibold smm-text-primary leading-tight">{n.title}</p>
// //                                 <button onClick={()=>deleteNotif(n.id)} className="text-slate-300 hover:text-red-400 shrink-0"><X className="w-3 h-3"/></button>
// //                               </div>
// //                               <p className="text-xs smm-text-muted mt-0.5 leading-snug">{n.message}</p>
// //                               <div className="flex items-center justify-between mt-1.5">
// //                                 <span className="text-[10px] smm-text-muted">{new Date(n.timestamp).toLocaleString("en-IN",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</span>
// //                                 {n.action&&(
// //                                   <button onClick={()=>{setView(n.action!.view);setNotifOpen(false);}} className="text-[10px] text-green-600 font-medium hover:underline">
// //                                     {n.action.label} →
// //                                   </button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))
// //                       ):(
// //                         completedGDCount===0?(
// //                           <div className="px-4 py-8 text-center smm-text-muted">
// //                             <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30"/>
// //                             <p className="text-sm">No completed GD tasks pending review</p>
// //                           </div>
// //                         ):gdTasks.filter(t=>t.status==="completed").map(task=>(
// //                           <div key={task.id} className="px-4 py-4 border-b last:border-b-0 smm-border bg-orange-50/50 dark:bg-orange-900/10">
// //                             <div className="flex items-start justify-between gap-2 mb-2">
// //                               <div className="flex-1 min-w-0">
// //                                 <p className="text-xs font-bold smm-text-primary leading-tight flex items-center gap-1">
// //                                   <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0"/>
// //                                   {task.title}
// //                                 </p>
// //                                 <p className="text-[11px] smm-text-muted mt-0.5">Designer: <strong>{task.gdName}</strong></p>
// //                                 <p className="text-[11px] smm-text-muted">Client: <strong>{task.clientName}</strong></p>
// //                                 <p className="text-[11px] smm-text-muted">Platform: {task.platform} · Due: {task.deadline}</p>
// //                                 {task.description&&<p className="text-[11px] smm-text-muted mt-1 line-clamp-2 italic">{task.description}</p>}
// //                               </div>
// //                               <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium shrink-0">Done</span>
// //                             </div>
// //                             <div className="flex gap-2 mt-2">
// //                               <button
// //                                 onClick={()=>handleGDTaskApproveReject(task.id,"approve")}
// //                                 className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition"
// //                               ><CheckCircle2 className="w-3 h-3"/>Approve</button>
// //                               <button
// //                                 onClick={()=>handleGDTaskApproveReject(task.id,"reject")}
// //                                 className="flex-1 flex items-center justify-center gap-1 text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md font-medium transition"
// //                               ><X className="w-3 h-3"/>Reject</button>
// //                             </div>
// //                           </div>
// //                         ))
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </header>

// //         <div className="p-6">

// //           {/* ── OVERVIEW ── */}
// //           {view==="overview"&&(
// //             <div className="space-y-6">
// //               {postsError&&(
// //                 <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200">
// //                   <AlertCircle className="w-4 h-4 shrink-0"/>{postsError}
// //                 </div>
// //               )}

// //               {smmDashData?.designStats&&(
// //                 <div>
// //                   <h3 className="font-semibold smm-text-muted mb-3 text-sm uppercase tracking-wide">Design Projects</h3>
// //                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //                     {[
// //                       {label:"Total",        value:smmDashData.designStats.totalProjects??0,       border:"border-l-slate-400"},
// //                       {label:"Pending",      value:smmDashData.designStats.pendingProjects??0,     border:"border-l-yellow-400"},
// //                       {label:"In Progress",  value:smmDashData.designStats.inProgressProjects??0,  border:"border-l-blue-400"},
// //                       {label:"Under Review", value:smmDashData.designStats.underReviewProjects??0, border:"border-l-purple-400"},
// //                       {label:"Revision",     value:smmDashData.designStats.revisionProjects??0,    border:"border-l-orange-400"},
// //                       {label:"Completed",    value:smmDashData.designStats.completedProjects??0,   border:"border-l-green-400"},
// //                       {label:"Overdue",      value:smmDashData.designStats.overdueProjects??0,     border:"border-l-red-400"},
// //                       {label:"Due Today",    value:smmDashData.designStats.dueTodayProjects??0,    border:"border-l-pink-400"},
// //                     ].map(s=>(
// //                       <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.border} cursor-pointer hover:shadow-md transition`} onClick={()=>setView("design_projects")}>
// //                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// //                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //                 {[
// //                   {label:"Total Posts",        value:overviewLoading?"…":ovTotal,     icon:PenSquare,   color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30",    onClick:()=>setView("queue")},
// //                   {label:"Published",          value:overviewLoading?"…":ovPublished, icon:Globe,       color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30",  onClick:()=>setView("published")},
// //                   {label:"Scheduled / Queued", value:overviewLoading?"…":ovScheduled, icon:Clock,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30",onClick:()=>setView("queue")},
// //                   {label:"Failed",             value:overviewLoading?"…":ovFailed,    icon:AlertCircle, color:"text-red-500",    bg:"bg-red-50 dark:bg-red-900/30",      onClick:()=>setView("published")},
// //                 ].map(s=>(
// //                   <Card key={s.label} className="smm-card p-5 cursor-pointer hover:shadow-md transition" onClick={s.onClick}>
// //                     <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
// //                     <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// //                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// //                   </Card>
// //                 ))}
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <Card className="smm-card p-5 border-l-4 border-l-purple-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("queue")}>
// //                   <div className="flex items-center justify-between">
// //                     <div><div className="text-sm font-semibold smm-text-primary">Queue</div><div className="text-xs smm-text-muted mt-0.5">Posts waiting to publish</div></div>
// //                     <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"><Inbox className="w-5 h-5 text-purple-600"/></div>
// //                   </div>
// //                   <div className="text-2xl font-bold smm-text-primary mt-3">{queuedPosts.length}</div>
// //                 </Card>
// //                 <Card className="smm-card p-5 border-l-4 border-l-yellow-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("drafts")}>
// //                   <div className="flex items-center justify-between">
// //                     <div><div className="text-sm font-semibold smm-text-primary">Drafts</div><div className="text-xs smm-text-muted mt-0.5">Saved, not published yet</div></div>
// //                     <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-yellow-600"/></div>
// //                   </div>
// //                   <div className="text-2xl font-bold smm-text-primary mt-3">{drafts.length}</div>
// //                 </Card>
// //                 <Card className="smm-card p-5 border-l-4 border-l-green-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("compose")}>
// //                   <div className="flex items-center justify-between">
// //                     <div><div className="text-sm font-semibold smm-text-primary">Create Post</div><div className="text-xs smm-text-muted mt-0.5">New post, schedule or draft</div></div>
// //                     <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><PenSquare className="w-5 h-5 text-green-600"/></div>
// //                   </div>
// //                   <div className="text-sm text-green-600 font-medium mt-3">→ Create now</div>
// //                 </Card>
// //               </div>

// //               <Card className="smm-card p-6">
// //                 <h3 className="font-semibold smm-text-primary mb-3">Recent Posts</h3>
// //                 {postsLoading?(
// //                   <div className="flex items-center gap-2 smm-text-muted py-4"><Loader2 className="w-4 h-4 animate-spin"/>Loading...</div>
// //                 ):posts.length===0?(
// //                   <p className="text-sm smm-text-muted">No posts yet. <button onClick={()=>setView("compose")} className="text-green-600 hover:underline">Create your first post →</button></p>
// //                 ):(
// //                   <div className="space-y-2">
// //                     {posts.slice(0,6).map(p=>(
// //                       <div key={p._id??p.id} className="flex items-center gap-3 p-3 rounded-lg border smm-border hover:smm-bg-hover">
// //                         <div className="flex-1 min-w-0">
// //                           <p className="text-sm smm-text-primary truncate">{p.content}</p>
// //                           <div className="flex gap-2 mt-1 flex-wrap">
// //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// //                             {p.platforms?.slice(0,2).map(pl=><span key={pl} className="text-xs smm-text-muted capitalize">{pl}</span>)}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Card>
// //             </div>
// //           )}

// //           {/* ── COMPOSE ── */}
// //           {view==="compose"&&(
// //             <div className="max-w-2xl space-y-5">
// //               {editingDraft&&(
// //                 <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 px-4 py-2.5 rounded-lg border border-yellow-200 dark:border-yellow-700">
// //                   <Edit2 className="w-4 h-4"/>Editing a draft
// //                 </div>
// //               )}
// //               <Card className="smm-card p-6 space-y-5">

// //                 {/* ── Step 1: Select Client ── */}
// //                 <div>
// //                   <Label className="smm-text-primary font-semibold">Step 1 — Select Client *</Label>
// //                   <select
// //                     value={composeClientId}
// //                     onChange={e => setComposeClientId(e.target.value)}
// //                     className="smm-select mt-2 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //                   >
// //                     <option value="">— Select Client —</option>
// //                     {clientList.map(c => (
// //                       <option key={c.id} value={c.id}>{c.name}{c.email?` (${c.email})`:""}</option>
// //                     ))}
// //                   </select>
// //                   {composeClientId&&(
// //                     <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
// //                       ✓ Post will be created for: <strong>{clientList.find(c=>c.id===composeClientId)?.name}</strong>
// //                     </p>
// //                   )}
// //                 </div>

// //                 {/* ── Step 2: Select Platform (from client's connected channels) ── */}
// //                 <div>
// //                   <Label className="smm-text-primary font-semibold">
// //                     Step 2 — Select Platform *
// //                     {composeClientId&&<span className="ml-2 text-xs font-normal smm-text-muted">(client's connected channels)</span>}
// //                   </Label>
// //                   {!composeClientId?(
// //                     <p className="text-xs smm-text-muted mt-2 italic">Please select a client first to see their connected channels.</p>
// //                   ):clientChannelsFetching?(
// //                     <div className="flex items-center gap-2 smm-text-muted mt-2 text-sm"><Loader2 className="w-4 h-4 animate-spin"/>Loading channels...</div>
// //                   ):clientConnectedChannels.length===0?(
// //                     <div className="mt-2 space-y-2">
// //                       <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
// //                         ⚠️ This client has no connected channels yet.{" "}
// //                         <button onClick={()=>setView("channels")} className="font-semibold underline">
// //                           Go to Channels to connect
// //                         </button>
// //                       </p>
// //                       {/* Fallback: allow manual platform selection */}
// //                       <p className="text-xs smm-text-muted">Or select platform manually:</p>
// //                       <div className="flex flex-wrap gap-2">
// //                         {PLATFORMS.map(p=>(
// //                           <button key={p.id} type="button" onClick={()=>togglePlat(p.id)}
// //                             className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${composePlatforms.includes(p.id)?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
// //                             {p.label}
// //                           </button>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   ):(
// //                     <div className="mt-2 space-y-2">
// //                       <div className="flex flex-wrap gap-2">
// //                         {clientConnectedChannels.map(ch=>{
// //                           const platId = ch.platform?.toLowerCase();
// //                           const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===platId);
// //                           const channelId = ch._id??ch.id??platId;
// //                           const isSelected = composePlatforms.includes(platId);
// //                           return(
// //                             <button key={channelId} type="button"
// //                               onClick={()=>togglePlat(platId)}
// //                               className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${isSelected?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
// //                               <span>{platInfo?.icon??"🔗"}</span>
// //                               <span className="capitalize">{platInfo?.label??ch.platform}</span>
// //                               {(ch.username||ch.name)&&(
// //                                 <span className={`text-xs ${isSelected?"text-white/80":"smm-text-muted"}`}>
// //                                   @{ch.username??ch.name}
// //                                 </span>
// //                               )}
// //                             </button>
// //                           );
// //                         })}
// //                       </div>
// //                       <p className="text-xs smm-text-muted">
// //                         {composePlatforms.length} platform{composePlatforms.length!==1?"s":""} selected
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* ── Step 3: Content ── */}
// //                 <div>
// //                   <Label className="smm-text-primary font-semibold">Step 3 — Content *</Label>
// //                   <textarea value={composeContent} onChange={e=>setComposeContent(e.target.value)}
// //                     placeholder="Write your post here..." rows={6} maxLength={2000}
// //                     className="smm-textarea mt-2 w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// //                   <div className="text-xs smm-text-muted text-right mt-1">{composeContent.length}/2000</div>
// //                 </div>

// //                 {/* ── Step 4: Schedule (optional) ── */}
// //                 <div>
// //                   <Label className="smm-text-primary font-semibold">Step 4 — Schedule Date (optional)</Label>
// //                   <p className="text-xs smm-text-muted mb-2">Leave empty for instant post (will show in queue for 5 minutes)</p>
// //                   <Input type="date" value={composeScheduleDate} onChange={e=>setComposeScheduleDate(e.target.value)}
// //                     min={new Date().toISOString().slice(0,10)} className="smm-input"/>
// //                 </div>
// //                 {composeScheduleDate&&(
// //                   <div>
// //                     <Label className="smm-text-primary">Schedule Time</Label>
// //                     <Input type="time" value={composeScheduleTime} onChange={e=>setComposeScheduleTime(e.target.value)} className="smm-input mt-2"/>
// //                     <p className="text-xs smm-text-muted mt-1">
// //                       {composeScheduleTime
// //                         ? `✅ Will publish on ${composeScheduleDate} at ${composeScheduleTime}`
// //                         : "Leave time empty to schedule at midnight"}
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* YouTube Settings */}
// //                 {composePlatforms.includes("youtube") && (
// //                   <div className="border rounded-xl p-4 space-y-4 bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800">
// //                     <div className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
// //                       ▶️ YouTube Settings
// //                     </div>
// //                     {/* Video Title */}
// //                     <div>
// //                       <Label className="smm-text-primary">Video Title *</Label>
// //                       <input
// //                         value={youtubeTitle}
// //                         onChange={e => setYoutubeTitle(e.target.value)}
// //                         placeholder="e.g. My Awesome Video - June 2025"
// //                         maxLength={100}
// //                         className="smm-input mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
// //                       />
// //                       <p className="text-xs smm-text-muted mt-1">
// //                         Khali chodoge toh description ka pehla hissa use hoga
// //                       </p>
// //                     </div>
// //                     {/* Privacy */}
// //                     <div>
// //                       <Label className="smm-text-primary">Privacy</Label>
// //                       <div className="flex gap-2 mt-1 flex-wrap">
// //                         {(["public", "unlisted", "private"] as const).map(opt => (
// //                           <button key={opt} type="button"
// //                             onClick={() => setYoutubePrivacy(opt)}
// //                             className={`px-3 py-1.5 rounded-lg border text-sm capitalize font-medium transition ${
// //                               youtubePrivacy === opt
// //                                 ? "bg-red-600 text-white border-red-600"
// //                                 : "smm-btn-outline"
// //                             }`}>
// //                             {opt}
// //                           </button>
// //                         ))}
// //                       </div>
// //                     </div>
// //                     {/* Video file status */}
// //                     {isVideoFile ? (
// //                       <p className="text-xs text-green-600 font-medium flex items-center gap-1">
// //                         ✅ Video file selected — ready to upload
// //                       </p>
// //                     ) : (
// //                       <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
// //                         ⚠️ Neeche "Image / Video" section se MP4 video file select karo
// //                       </p>
// //                     )}
// //                   </div>
// //                 )}

// //                 {/* Tags */}
// //                 <div>
// //                   <Label className="smm-text-primary">Tags (optional)</Label>
// //                   <div className="mt-2">
// //                     <div className="flex flex-wrap gap-1.5 mb-2">
// //                       {composeTags.map(tag=>(
// //                         <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
// //                           #{tag}
// //                           <button type="button" onClick={()=>setComposeTags(p=>p.filter(t=>t!==tag))} className="hover:text-red-500">
// //                             <X className="w-3 h-3"/>
// //                           </button>
// //                         </span>
// //                       ))}
// //                     </div>
// //                     <Input value={composeTagInput} onChange={e=>setComposeTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
// //                       placeholder="Type a tag and press Enter" className="smm-input text-sm"/>
// //                   </div>
// //                 </div>

// //                 {/* Media */}
// //                 <div>
// //                   <Label className="smm-text-primary">Image / Video (optional)</Label>
// //                   {composePreview?(
// //                     <div className="relative mt-2 inline-block">
// //                       <img src={composePreview} alt="preview" className="max-h-40 rounded-lg border smm-border"/>
// //                       <button type="button" onClick={()=>{setComposePreview(null);setComposeMedia(null);}}
// //                         className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
// //                     </div>
// //                   ):(
// //                     <label className="smm-upload-area mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer text-sm smm-text-muted">
// //                       🖼 Upload image or video
// //                       <input type="file" accept="image/*,video/*" className="hidden" onChange={e=>{
// //                       const f=e.target.files?.[0];
// //                       if(f){
// //                         setComposeMedia(f);
// //                         setIsVideoFile(f.type.startsWith("video/"));
// //                         setComposePreview(f.type.startsWith("video/") ? null : URL.createObjectURL(f));
// //                       }
// //                     }}/>
// //                     </label>
// //                   )}
// //                 </div>

// //                 {/* Actions */}
// //                 <div className="flex gap-3 flex-wrap pt-2 border-t smm-border">
// //                   <Button variant="outline" onClick={()=>handleCompose("draft")} disabled={composeSaving} className="smm-btn-outline">
// //                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
// //                     <FileText className="w-4 h-4 mr-2"/>{editingDraft?"Update Draft":"Save as Draft"}
// //                   </Button>
// //                   <Button className="bg-purple-600 hover:bg-purple-700" onClick={()=>handleCompose("queue")} disabled={composeSaving}>
// //                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
// //                     <Inbox className="w-4 h-4 mr-2"/>
// //                     {composeScheduleDate?"Schedule Post":"Add to Queue (Instant)"}
// //                   </Button>
// //                 </div>
// //               </Card>
// //             </div>
// //           )}

// //           {/* ── QUEUE ── */}
// //           {view==="queue"&&(
// //             <div className="space-y-4">
// //               <div className="flex items-center justify-between">
// //                 <p className="text-sm smm-text-muted">Posts in queue — instant posts auto-publish in 5 minutes</p>
// //                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// //                   <Plus className="w-4 h-4 mr-1"/>New Post
// //                 </Button>
// //               </div>
// //               {queueLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):queuedPosts.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary font-medium">Queue is empty</p>
// //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// //                     <Plus className="w-4 h-4 mr-2"/>Create Post
// //                   </Button>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {queuedPosts.map(p=>{
// //                     const pid=p._id??p.id??"";
// //                     const timeLeft = queueTimeLeft(p);
// //                     const isScheduled = !!(p.scheduleAt??p.scheduled_at);
// //                     return(
// //                       <Card key={pid} className="smm-card p-5">
// //                         <div className="flex items-start justify-between gap-4 flex-wrap">
// //                           <div className="flex-1 min-w-0">
// //                             <div className="flex items-center gap-2 mb-2 flex-wrap">
// //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// //                               {isScheduled?(
// //                                 <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
// //                                   📅 Scheduled
// //                                 </span>
// //                               ):(
// //                                 <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium animate-pulse">
// //                                   ⚡ Instant
// //                                 </span>
// //                               )}
// //                               {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// //                             </div>
// //                             <p className="text-sm smm-text-primary">{p.content}</p>
// //                             {isScheduled?(
// //                               <p className="text-xs smm-text-muted mt-2 flex items-center gap-1">
// //                                 <Clock className="w-3 h-3"/>
// //                                 Scheduled: {new Date(p.scheduleAt??p.scheduled_at??"").toLocaleString("en-IN")}
// //                               </p>
// //                             ):timeLeft?(
// //                               <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
// //                                 <Clock className="w-3 h-3"/>{timeLeft}
// //                               </p>
// //                             ):null}
// //                           </div>
// //                           <Button size="sm" className="bg-green-600 hover:bg-green-700 shrink-0" onClick={()=>handlePublishNow(pid)} disabled={publishingId===pid}>
// //                             {publishingId===pid?<Loader2 className="w-4 h-4 animate-spin"/>:<><CheckCircle2 className="w-4 h-4 mr-1"/>Publish Now</>}
// //                           </Button>
// //                         </div>
// //                       </Card>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── DRAFTS ── */}
// //           {view==="drafts"&&(
// //             <div className="space-y-4">
// //               <p className="text-sm smm-text-muted">Saved drafts — edit or add to queue</p>
// //               {draftsLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):drafts.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary font-medium">No drafts found</p>
// //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// //                     <Plus className="w-4 h-4 mr-2"/>Create Post
// //                   </Button>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {drafts.map(d=>{const did=d._id??d.id??"";return(
// //                     <Card key={did} className="smm-card p-5">
// //                       <div className="flex items-start justify-between gap-4 flex-wrap">
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-center gap-2 mb-2 flex-wrap">
// //                             <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">Draft</span>
// //                             {d.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// //                           </div>
// //                           <p className="text-sm smm-text-primary line-clamp-3">{d.content}</p>
// //                           {d.createdAt&&<p className="text-xs smm-text-muted mt-2">Saved: {new Date(d.createdAt).toLocaleString("en-IN")}</p>}
// //                         </div>
// //                         <div className="flex gap-2 shrink-0">
// //                           <Button size="sm" variant="outline" onClick={()=>handleEditDraft(d)} className="smm-btn-outline">
// //                             <Edit2 className="w-4 h-4 mr-1"/>Edit
// //                           </Button>
// //                           <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDraft(did)} disabled={deletingDid===did}>
// //                             {deletingDid===did?<Loader2 className="w-4 h-4 animate-spin"/>:<Trash2 className="w-4 h-4"/>}
// //                           </Button>
// //                         </div>
// //                       </div>
// //                     </Card>
// //                   );})}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── PUBLISHED ── */}
// //           {view==="published"&&(
// //             <div className="space-y-4">
// //               <div className="flex items-center justify-between">
// //                 <p className="text-sm smm-text-muted">Record of all published posts</p>
// //                 <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
// //                   <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
// //                 </Button>
// //               </div>
// //               {pubLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):pubPosts.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary font-medium">No published posts yet</p>
// //                   <p className="text-xs smm-text-muted mt-1">Posts published from the queue will appear here</p>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {pubPosts.map(p=>{const pid=p._id??p.id??"";return(
// //                     <Card key={pid} className="smm-card p-5">
// //                       <div className="flex items-start gap-4">
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-center gap-2 mb-2 flex-wrap">
// //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// //                             {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// //                           </div>
// //                           <p className="text-sm smm-text-primary">{p.content}</p>
// //                           {p.createdAt&&<p className="text-xs smm-text-muted mt-2 flex items-center gap-1"><Globe className="w-3 h-3"/>Published: {new Date(p.createdAt).toLocaleString("en-IN")}</p>}
// //                         </div>
// //                       </div>
// //                     </Card>
// //                   );})}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── CHANNELS ── */}
// //           {view==="channels"&&(
// //             <div className="space-y-8">

// //               {/* ── My Agency Channels ── */}
// //               <div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
// //                     <LinkIcon className="w-4 h-4 text-green-600"/>
// //                   </div>
// //                   <div>
// //                     <h2 className="text-base font-bold smm-text-primary">My Agency Channels</h2>
// //                     <p className="text-xs smm-text-muted">Your own connected social accounts</p>
// //                   </div>
// //                 </div>
// //                 {channelsLoading?(
// //                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //                 ):(
// //                   <>
// //                     {channels.length>0&&(
// //                       <div className="space-y-3 mb-4">
// //                         {channels.map(ch=>{
// //                           const cid=ch._id??ch.id??"";
// //                           const platInfo=CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
// //                           return(
// //                             <Card key={cid} className="smm-card p-4 flex items-center justify-between gap-4">
// //                               <div className="flex items-center gap-3">
// //                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>{platInfo?.icon??"🔗"}</div>
// //                                 <div>
// //                                   <div className="text-sm font-semibold smm-text-primary capitalize">{ch.platform}</div>
// //                                   <div className="text-xs smm-text-muted">{ch.username??ch.name??"Connected"}</div>
// //                                 </div>
// //                               </div>
// //                               <div className="flex items-center gap-2">
// //                                 <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">Connected</span>
// //                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDisconnect(cid)} disabled={disconnectingId===cid}>
// //                                   {disconnectingId===cid?<Loader2 className="w-4 h-4 animate-spin"/>:"Disconnect"}
// //                                 </Button>
// //                               </div>
// //                             </Card>
// //                           );
// //                         })}
// //                       </div>
// //                     )}
// //                     <div>
// //                       <h4 className="text-sm font-semibold smm-text-primary mb-3">Connect a New Account</h4>
// //                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                         {CONNECTABLE_PLATFORMS.map(p=>{
// //                           const isConnected=channels.some(ch=>ch.platform?.toLowerCase()===p.id);
// //                           return(
// //                             <Card key={p.id} className={`smm-card p-4 flex items-center justify-between gap-3 ${isConnected?"opacity-60":""}`}>
// //                               <div className="flex items-center gap-2">
// //                                 <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base bg-gradient-to-br ${p.color}`}>{p.icon}</span>
// //                                 <div className="text-sm font-medium smm-text-primary">{p.label}</div>
// //                               </div>
// //                               <Button size="sm"
// //                                 className={isConnected?"bg-slate-400 cursor-not-allowed":"bg-green-600 hover:bg-green-700"}
// //                                 onClick={()=>!isConnected&&handleConnect(p.id)}
// //                                 disabled={connectingPlatform===p.id||isConnected}>
// //                                 {connectingPlatform===p.id?<Loader2 className="w-4 h-4 animate-spin"/>:isConnected?"✓ Connected":"Connect"}
// //                               </Button>
// //                             </Card>
// //                           );
// //                         })}
// //                       </div>
// //                     </div>
// //                   </>
// //                 )}
// //               </div>

// //               {/* ── Client Channels ── */}
// //               <div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
// //                     <Users className="w-4 h-4 text-blue-600"/>
// //                   </div>
// //                   <div>
// //                     <h2 className="text-base font-bold smm-text-primary">Client Channels</h2>
// //                     <p className="text-xs smm-text-muted">Manage social accounts for each client — connect platforms on their behalf</p>
// //                   </div>
// //                 </div>
// //                 {clientChannelsLoading?(
// //                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading client channels...</div>
// //                 ):clientList.length===0?(
// //                   <Card className="smm-card p-8 text-center">
// //                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// //                     <p className="text-sm smm-text-muted">No clients found. Clients appear once design projects are loaded.</p>
// //                     <Button variant="outline" size="sm" className="mt-3 smm-btn-outline" onClick={()=>{loadUsersForDropdowns().then(()=>loadClientsWithChannels());}}>
// //                       <RefreshCw className="w-4 h-4 mr-1"/>Load Clients
// //                     </Button>
// //                   </Card>
// //                 ):(
// //                   <div className="space-y-4">
// //                     {(clientsWithChannels.length > 0 ? clientsWithChannels : clientList.map(c=>({...c,channels:[]}))).map(client=>(
// //                       <Card key={client.id} className="smm-card p-5">
// //                         {/* Client header */}
// //                         <div className="flex items-center gap-3 mb-4">
// //                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
// //                             <span className="text-sm font-bold text-blue-600">{client.name.charAt(0).toUpperCase()}</span>
// //                           </div>
// //                           <div>
// //                             <div className="font-semibold smm-text-primary text-sm">{client.name}</div>
// //                             {client.email&&<div className="text-xs smm-text-muted">{client.email}</div>}
// //                           </div>
// //                           <div className="ml-auto">
// //                             {(client as ClientWithChannels).channels?.length > 0 ? (
// //                               <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
// //                                 {(client as ClientWithChannels).channels.length} connected
// //                               </span>
// //                             ):(
// //                               <span className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full">
// //                                 No channels
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>

// //                         {/* Connected channels for this client */}
// //                         {(client as ClientWithChannels).channels?.length > 0 && (
// //                           <div className="mb-4">
// //                             <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connected Accounts</p>
// //                             <div className="space-y-2">
// //                               {(client as ClientWithChannels).channels.map(ch=>{
// //                                 const chId = ch._id??ch.id??"";
// //                                 const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
// //                                 return(
// //                                   <div key={chId} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border smm-border bg-slate-50/50 dark:bg-slate-800/30">
// //                                     <div className="flex items-center gap-2">
// //                                       <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>
// //                                         {platInfo?.icon??"🔗"}
// //                                       </span>
// //                                       <div>
// //                                         <div className="text-xs font-medium smm-text-primary capitalize">{platInfo?.label??ch.platform}</div>
// //                                         {(ch.username||ch.name)&&<div className="text-[10px] smm-text-muted">@{ch.username??ch.name}</div>}
// //                                       </div>
// //                                     </div>
// //                                     <div className="flex items-center gap-2">
// //                                       <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium">✓ Connected</span>
// //                                       <button
// //                                         onClick={()=>handleDisconnectClientChannel(chId, client.id)}
// //                                         className="text-[10px] text-red-500 hover:underline px-1"
// //                                       >Disconnect</button>
// //                                     </div>
// //                                   </div>
// //                                 );
// //                               })}
// //                             </div>
// //                           </div>
// //                         )}

// //                         {/* Connect new platform for this client */}
// //                         <div>
// //                           <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connect Platform</p>
// //                           <div className="flex flex-wrap gap-2">
// //                             {CONNECTABLE_PLATFORMS.map(plat=>{
// //                               const key=`${client.id}_${plat.id}`;
// //                               const isLoading=connectingForClient===key;
// //                               const isAlreadyConnected=(client as ClientWithChannels).channels?.some(ch=>ch.platform?.toLowerCase()===plat.id);
// //                               return(
// //                                 <Button key={plat.id} size="sm" variant="outline"
// //                                   className={`text-xs gap-1.5 ${isAlreadyConnected?"opacity-50 cursor-not-allowed smm-btn-outline":"smm-btn-outline hover:border-blue-500 hover:text-blue-600"}`}
// //                                   onClick={()=>!isAlreadyConnected&&handleConnectForClient(plat.id, client.id)}
// //                                   disabled={isLoading||isAlreadyConnected}>
// //                                   {isLoading?<Loader2 className="w-3 h-3 animate-spin"/>:<span>{plat.icon}</span>}
// //                                   {isAlreadyConnected?"✓ "+plat.label:plat.label}
// //                                 </Button>
// //                               );
// //                             })}
// //                           </div>
// //                         </div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* ── CLIENTS & GD ── */}
// //           {view==="clients_gd"&&(
// //             <div className="space-y-8">
// //               {/* Clients Section */}
// //               <div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
// //                     <Users className="w-4 h-4 text-blue-600"/>
// //                   </div>
// //                   <div>
// //                     <h2 className="text-base font-bold smm-text-primary">Clients</h2>
// //                     <p className="text-xs smm-text-muted">{clientList.length} client(s)</p>
// //                   </div>
// //                 </div>
// //                 {clientList.length===0?(
// //                   <Card className="smm-card p-8 text-center">
// //                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// //                     <p className="text-sm smm-text-muted">No clients found. They will appear once design projects are loaded.</p>
// //                   </Card>
// //                 ):(
// //                   <div className="space-y-2">
// //                     {clientList.map(c=>(
// //                       <Card key={c.id} className="smm-card p-4 flex items-center gap-3">
// //                         <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
// //                           <span className="text-sm font-bold text-blue-600">{c.name.charAt(0).toUpperCase()}</span>
// //                         </div>
// //                         <div>
// //                           <div className="font-semibold smm-text-primary text-sm">{c.name}</div>
// //                           {c.email&&<div className="text-xs smm-text-muted">{c.email}</div>}
// //                         </div>
// //                         <Button size="sm" variant="outline" className="ml-auto smm-btn-outline text-xs" onClick={()=>setView("channels")}>
// //                           <LinkIcon className="w-3 h-3 mr-1"/>Manage Channels
// //                         </Button>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Graphic Designers Section */}
// //               <div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
// //                     <Palette className="w-4 h-4 text-purple-600"/>
// //                   </div>
// //                   <div>
// //                     <h2 className="text-base font-bold smm-text-primary">Graphic Designers</h2>
// //                     <p className="text-xs smm-text-muted">{gdList.length} designer(s)</p>
// //                   </div>
// //                 </div>
// //                 {gdList.length===0?(
// //                   <Card className="smm-card p-8 text-center">
// //                     <Palette className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// //                     <p className="text-sm smm-text-muted">No graphic designers found. They appear once design projects are loaded.</p>
// //                   </Card>
// //                 ):(
// //                   <div className="space-y-2">
// //                     {gdList.map(g=>(
// //                       <Card key={g.id} className="smm-card p-4 flex items-center gap-3">
// //                         <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center shrink-0">
// //                           <span className="text-sm font-bold text-purple-600">{g.name.charAt(0).toUpperCase()}</span>
// //                         </div>
// //                         <div>
// //                           <div className="font-semibold smm-text-primary text-sm">{g.name}</div>
// //                           {g.email&&<div className="text-xs smm-text-muted">{g.email}</div>}
// //                         </div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* ── CALENDAR ── */}
// //           {view==="calendar"&&(
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-2">
// //                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()-1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">←</button>
// //                 <span className="font-semibold smm-text-primary min-w-[160px] text-center">{monthNames[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
// //                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()+1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">→</button>
// //                 <Button size="sm" variant="outline" onClick={()=>setCalMonth(new Date())} className="smm-btn-outline">Today</Button>
// //                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}><Plus className="w-3 h-3 mr-1"/>New Post</Button>
// //               </div>
// //               <Card className="smm-card overflow-hidden">
// //                 <div className="grid grid-cols-7 border-b smm-border smm-cal-header">
// //                   {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
// //                     <div key={d} className="p-3 text-xs font-semibold smm-text-muted text-center uppercase tracking-wide">{d}</div>
// //                   ))}
// //                 </div>
// //                 <div className="grid grid-cols-7">
// //                   {calDays.map((d,i)=>{
// //                     const dp=d?postsForDay(d):[];
// //                     const today=d?d.toDateString()===new Date().toDateString():false;
// //                     return(
// //                       <div key={i} className="min-h-[100px] border-r border-b smm-border p-2 last:border-r-0">
// //                         {d&&(
// //                           <>
// //                             <div className={`text-xs font-medium mb-1 inline-flex items-center justify-center w-6 h-6 rounded-full ${today?"bg-green-600 text-white":"smm-text-muted"}`}>{d.getDate()}</div>
// //                             <div className="space-y-1">
// //                               {dp.slice(0,2).map(p=>(
// //                                 <div key={p._id??p.id} className={`text-xs px-2 py-1 rounded truncate ${statusBadge(p.status)}`}>{p.content.slice(0,20)}…</div>
// //                               ))}
// //                               {dp.length>2&&<div className="text-xs smm-text-muted px-1">+{dp.length-2} more</div>}
// //                             </div>
// //                           </>
// //                         )}
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </Card>
// //             </div>
// //           )}

// //           {/* ── GD TASKS ── */}
// //           {view==="gd_tasks"&&(
// //             <div className="space-y-4">
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //                 {[
// //                   {label:"Pending",        count:taskCounts.pending,     color:"border-l-slate-400"},
// //                   {label:"In Progress",    count:taskCounts.in_progress, color:"border-l-blue-400"},
// //                   {label:"Needs Revision", count:taskCounts.revision,    color:"border-l-orange-400"},
// //                   {label:"Completed",      count:taskCounts.completed,   color:"border-l-green-400"},
// //                 ].map(s=>(
// //                   <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.color}`}>
// //                     <div className="text-2xl font-bold smm-text-primary">{s.count}</div>
// //                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// //                   </Card>
// //                 ))}
// //               </div>
// //               {gdTasks.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <FileImage className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary">No tasks yet. Click "Assign Task to GD" to get started.</p>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {gdTasks.map(task=>(
// //                     <Card key={task.id} className="smm-card p-5">
// //                       <div className="flex items-start justify-between gap-4 flex-wrap">
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-center gap-2 flex-wrap mb-1">
// //                             <h3 className="font-semibold smm-text-primary">{task.title}</h3>
// //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status==="completed"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":task.status==="revision"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":task.status==="in_progress"?"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300":"bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}>
// //                               {task.status.replace("_"," ")}
// //                             </span>
// //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.priority==="high"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":task.priority==="medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
// //                               {task.priority}
// //                             </span>
// //                           </div>
// //                           <p className="text-sm smm-text-muted mb-2">{task.description}</p>
// //                           <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap">
// //                             <span>Client: <strong className="smm-text-secondary">{task.clientName}</strong></span>
// //                             {task.gdName&&<span>Designer: <strong className="smm-text-secondary">{task.gdName}</strong></span>}
// //                             <span>Platform: <strong className="smm-text-secondary">{task.platform}</strong></span>
// //                             <span>Due: <strong className="smm-text-secondary">{task.deadline}</strong></span>
// //                           </div>
// //                           {task.status==="revision"&&task.revisionComment&&(
// //                             <div className="mt-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-800">
// //                               Revision note: {task.revisionComment}
// //                             </div>
// //                           )}
// //                         </div>
// //                         {task.status==="completed"&&(
// //                           <div className="flex flex-col gap-2">
// //                             <Button size="sm" variant="outline" className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
// //                               onClick={()=>{const c=prompt("Revision comment:");if(c)handleRevision(task.id,c);}}>
// //                               Request Revision
// //                             </Button>
// //                             <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={()=>handleGDTaskApproveReject(task.id,"approve")}>
// //                               <CheckCircle2 className="w-3 h-3 mr-1"/>Approve
// //                             </Button>
// //                             <Button size="sm" variant="outline" className="text-xs text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
// //                               onClick={()=>handleGDTaskApproveReject(task.id,"reject")}>
// //                               Reject
// //                             </Button>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </Card>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── DESIGN PROJECTS ── */}
// //           {view==="design_projects"&&(
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-3 flex-wrap">
// //                 <select value={designFilter} onChange={e=>{setDesignFilter(e.target.value);setTimeout(()=>loadDesignProjects(),0);}}
// //                   className="smm-select px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                   <option value="">All Status</option>
// //                   {["Pending","In Progress","Under Review","Revision","Completed","Cancelled"].map(s=>(
// //                     <option key={s} value={s}>{s}</option>
// //                   ))}
// //                 </select>
// //                 <Button size="sm" variant="outline" onClick={loadDesignProjects} disabled={designLoading} className="smm-btn-outline">
// //                   <RefreshCw className={`w-4 h-4 mr-1 ${designLoading?"animate-spin":""}`}/>Refresh
// //                 </Button>
// //               </div>
// //               {designLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):designProjects.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary font-medium">No design projects found</p>
// //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setShowAddDesign(true)}>
// //                     <Plus className="w-4 h-4 mr-2"/>New Design Project
// //                   </Button>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {designProjects.map(p=>{
// //                     const pid=p._id??p.id??"";
// //                     const clientName=typeof p.clientId==="object"?p.clientId?.name:clientList.find(c=>c.id===p.clientId)?.name??"—";
// //                     const designerName=typeof p.designerId==="object"?p.designerId?.name:gdList.find(g=>g.id===p.designerId)?.name??"—";
// //                     const sc:Record<string,string>={
// //                       "Pending":"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
// //                       "In Progress":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
// //                       "Under Review":"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
// //                       "Revision":"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
// //                       "Completed":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
// //                       "Cancelled":"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
// //                     };
// //                     return(
// //                       <Card key={pid} className="smm-card p-5">
// //                         <div className="flex items-start justify-between gap-4 flex-wrap">
// //                           <div className="flex-1 min-w-0">
// //                             <div className="flex items-center gap-2 flex-wrap mb-1">
// //                               <h3 className="font-semibold smm-text-primary">{p.title}</h3>
// //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc[p.status]??"bg-slate-100 text-slate-600"}`}>{p.status}</span>
// //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.priority==="Urgent"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":p.priority==="High"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":p.priority==="Medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
// //                                 {p.priority}
// //                               </span>
// //                             </div>
// //                             <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap mt-1">
// //                               <span>Type: <strong className="smm-text-secondary">{p.designType}</strong></span>
// //                               <span>Client: <strong className="smm-text-secondary">{clientName}</strong></span>
// //                               <span>Designer: <strong className="smm-text-secondary">{designerName}</strong></span>
// //                               <span>Deadline: <strong className="smm-text-secondary">{p.deadline?.slice(0,10)}</strong></span>
// //                             </div>
// //                             {p.description&&<p className="text-sm smm-text-muted mt-1 truncate">{p.description}</p>}
// //                           </div>
// //                           <div className="flex gap-2 flex-wrap shrink-0">
// //                             <Button size="sm" variant="outline" onClick={()=>openProjectDetail(p)} className="smm-btn-outline">
// //                               <MessageSquare className="w-4 h-4 mr-1"/>Comments
// //                             </Button>
// //                             {p.status==="Under Review"&&(
// //                               <>
// //                                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>handleApproveReject(pid,"approve")}>
// //                                   <CheckCircle2 className="w-4 h-4 mr-1"/>Approve
// //                                 </Button>
// //                                 <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={()=>handleRevisionReq(pid)}>
// //                                   Revision
// //                                 </Button>
// //                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleApproveReject(pid,"reject")}>
// //                                   Reject
// //                                 </Button>
// //                               </>
// //                             )}
// //                             <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDP(pid)}>
// //                               <Trash2 className="w-4 h-4"/>
// //                             </Button>
// //                           </div>
// //                         </div>
// //                       </Card>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── ANALYTICS ── */}
// //           {view==="analytics"&&(
// //             <div className="space-y-6">
// //               {analyticsLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):(
// //                 <>
// //                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //                     {[
// //                       {label:"Total Reach",  value:analytics?.reach??       "—", icon:Eye,        color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30"},
// //                       {label:"Impressions",  value:analytics?.impressions?? "—", icon:TrendingUp,  color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30"},
// //                       {label:"Engagement",   value:analytics?.engagement??  "—", icon:Heart,       color:"text-pink-600",   bg:"bg-pink-50 dark:bg-pink-900/30"},
// //                       {label:"Followers",    value:analytics?.followers??   "—", icon:Users,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30"},
// //                     ].map(s=>(
// //                       <Card key={s.label} className="smm-card p-5">
// //                         <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
// //                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// //                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                   <Card className="smm-card p-6">
// //                     <h3 className="font-semibold smm-text-primary mb-4">Weekly Reach & Engagement</h3>
// //                     {analytics?.weeklyData?.length?(
// //                       <div className="h-64">
// //                         <ResponsiveContainer width="100%" height="100%">
// //                           <LineChart data={weeklyData}>
// //                             <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"}/>
// //                             <XAxis dataKey="day" stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
// //                             <YAxis stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
// //                             <Tooltip contentStyle={{background:dark?"#1e293b":"#fff",border:"1px solid #334155",borderRadius:8}}/>
// //                             <Line type="monotone" dataKey="reach" stroke="#22c55e" strokeWidth={2.5} name="Reach"/>
// //                             <Line type="monotone" dataKey="engagement" stroke="#818cf8" strokeWidth={2.5} name="Engagement"/>
// //                           </LineChart>
// //                         </ResponsiveContainer>
// //                       </div>
// //                     ):(
// //                       <div className="h-32 flex items-center justify-center smm-text-muted text-sm">
// //                         No analytics data available. Connect social accounts first.
// //                       </div>
// //                     )}
// //                   </Card>
// //                 </>
// //               )}
// //             </div>
// //           )}

// //         </div>
// //       </main>

// //       {/* ── Add Design Project Modal ── */}
// //       {showAddDesign&&(
// //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// //           <Card className="smm-modal w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-5">
// //               <h2 className="text-lg font-bold smm-text-primary">New Design Project</h2>
// //               <button onClick={()=>setShowAddDesign(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
// //             </div>
// //             <form onSubmit={handleCreateDP} className="space-y-4">
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Client *</Label>
// //                   <select value={newDP.clientId} onChange={e=>setNewDP(n=>({...n,clientId:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// //                     <option value="">-- Select Client --</option>
// //                     {clientList.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Graphic Designer *</Label>
// //                   <select value={newDP.designerId} onChange={e=>setNewDP(n=>({...n,designerId:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// //                     <option value="">-- Select Designer --</option>
// //                     {gdList.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
// //                   </select>
// //                 </div>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Project Title *</Label>
// //                 <Input value={newDP.title} onChange={e=>setNewDP(n=>({...n,title:e.target.value}))}
// //                   placeholder="e.g. Logo Design for Sharma Enterprises" required className="smm-input mt-1"/>
// //               </div>
// //               <div className="grid grid-cols-3 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Design Type</Label>
// //                   <select value={newDP.designType} onChange={e=>setNewDP(n=>({...n,designType:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                     {["Social Post","Logo","Banner","Brochure","Video Thumbnail","Story","Reel Cover","Other"].map(t=>(
// //                       <option key={t} value={t}>{t}</option>
// //                     ))}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Deadline *</Label>
// //                   <Input type="date" value={newDP.deadline} onChange={e=>setNewDP(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Priority</Label>
// //                   <select value={newDP.priority} onChange={e=>setNewDP(n=>({...n,priority:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                     {["Low","Medium","High","Urgent"].map(p=><option key={p} value={p}>{p}</option>)}
// //                   </select>
// //                 </div>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Description</Label>
// //                 <textarea value={newDP.description} onChange={e=>setNewDP(n=>({...n,description:e.target.value}))} rows={3}
// //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Target Audience</Label>
// //                   <Input value={newDP.targetAudience} onChange={e=>setNewDP(n=>({...n,targetAudience:e.target.value}))} placeholder="e.g. 25-45 professionals" className="smm-input mt-1"/>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Revision Limit</Label>
// //                   <Input type="number" min={1} max={10} value={newDP.revisionLimit} onChange={e=>setNewDP(n=>({...n,revisionLimit:Number(e.target.value)}))} className="smm-input mt-1"/>
// //                 </div>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Brand Colors</Label>
// //                   <Input value={newDP.brandColors} onChange={e=>setNewDP(n=>({...n,brandColors:e.target.value}))} placeholder="#0044CC, #FFFFFF" className="smm-input mt-1"/>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Font Preferences</Label>
// //                   <Input value={newDP.fontPreferences} onChange={e=>setNewDP(n=>({...n,fontPreferences:e.target.value}))} placeholder="Montserrat Bold" className="smm-input mt-1"/>
// //                 </div>
// //               </div>
// //               <div className="flex gap-3 pt-2">
// //                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddDesign(false)}>Cancel</Button>
// //                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={dpSaving}>
// //                   {dpSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}<Send className="w-4 h-4 mr-2"/>Create & Assign
// //                 </Button>
// //               </div>
// //             </form>
// //           </Card>
// //         </div>
// //       )}

// //       {/* ── Comments Modal ── */}
// //       {selProject&&(
// //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// //           <Card className="smm-modal w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-4">
// //               <h2 className="text-lg font-bold smm-text-primary truncate">{selProject.title}</h2>
// //               <button onClick={()=>{setSelProject(null);setProjComments([]);setNewComment("");}} className="smm-text-muted hover:smm-text-primary shrink-0">
// //                 <X className="w-5 h-5"/>
// //               </button>
// //             </div>
// //             <h3 className="text-sm font-semibold smm-text-primary mb-2">Comments</h3>
// //             <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
// //               {projComments.length===0?(
// //                 <p className="text-sm smm-text-muted">No comments yet</p>
// //               ):projComments.map((c:any,i:number)=>(
// //                 <div key={c._id??i} className="text-sm smm-comment px-3 py-2 rounded-lg border smm-border">
// //                   <span className="font-medium smm-text-primary">{c.senderName??c.sender?.name??"User"}: </span>
// //                   <span className="smm-text-secondary">{c.message??c.text}</span>
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="flex gap-2">
// //               <Input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Write a comment..." className="smm-input"
// //                 onKeyDown={e=>{if(e.key==="Enter")handleSendComment();}}/>
// //               <Button onClick={handleSendComment} disabled={commentSending||!newComment.trim()} className="bg-green-600 hover:bg-green-700 shrink-0">
// //                 {commentSending?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}
// //               </Button>
// //             </div>
// //           </Card>
// //         </div>
// //       )}

// //       {/* ── Assign GD Task Modal ── */}
// //       {showAddTask&&(
// //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// //           <Card className="smm-modal w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-5">
// //               <h2 className="text-lg font-bold smm-text-primary">Assign Task to Graphic Designer</h2>
// //               <button onClick={()=>setShowAddTask(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
// //             </div>
// //             <form onSubmit={handleAssignTask} className="space-y-4">
// //               <div>
// //                 <Label className="smm-text-primary">Task Title *</Label>
// //                 <Input value={newTask.title} onChange={e=>setNewTask(n=>({...n,title:e.target.value}))} placeholder="e.g. Instagram Story — Summer Sale" required className="smm-input mt-1"/>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Description</Label>
// //                 <textarea value={newTask.description} onChange={e=>setNewTask(n=>({...n,description:e.target.value}))} rows={3}
// //                   placeholder="What should the designer create..."
// //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Client *</Label>
// //                   {clientList.length>0?(
// //                     <select value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))}
// //                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// //                       <option value="">-- Select Client --</option>
// //                       {clientList.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
// //                     </select>
// //                   ):(
// //                     <Input value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))} placeholder="Client name" required className="smm-input mt-1"/>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Graphic Designer</Label>
// //                   {gdList.length>0?(
// //                     <select value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))}
// //                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                       <option value="">-- Select Designer --</option>
// //                       {gdList.map(g=><option key={g.id} value={g.name}>{g.name}</option>)}
// //                     </select>
// //                   ):(
// //                     <Input value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))} placeholder="Designer name" className="smm-input mt-1"/>
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Platform</Label>
// //                   <select value={newTask.platform} onChange={e=>setNewTask(n=>({...n,platform:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                     {["Instagram","Facebook","LinkedIn","Twitter/X","YouTube","Pinterest"].map(p=>(
// //                       <option key={p} value={p}>{p}</option>
// //                     ))}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Priority</Label>
// //                   <select value={newTask.priority} onChange={e=>setNewTask(n=>({...n,priority:e.target.value as Priority}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                     <option value="high">High</option>
// //                     <option value="medium">Medium</option>
// //                     <option value="low">Low</option>
// //                   </select>
// //                 </div>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Deadline *</Label>
// //                 <Input type="date" value={newTask.deadline} onChange={e=>setNewTask(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Notes for Designer</Label>
// //                 <textarea value={newTask.notes} onChange={e=>setNewTask(n=>({...n,notes:e.target.value}))} rows={2}
// //                   placeholder="Brand guidelines, colour codes, style references..."
// //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// //               </div>
// //               <div className="flex gap-3 pt-2">
// //                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddTask(false)}>Cancel</Button>
// //                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700"><Send className="w-4 h-4 mr-2"/>Assign Task</Button>
// //               </div>
// //             </form>
// //           </Card>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default SMMDashboard;


// // import { useState, useEffect, useRef, useCallback } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import "./SMMDashboard.css";
// // import { Logo } from "@/components/Logo";
// // import { Button } from "@/components/ui/button";
// // import { Card } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { toast } from "sonner";
// // import {
// //   Megaphone, LogOut, LayoutDashboard, Calendar,
// //   PenSquare, BarChart3, FileImage, Plus, X,
// //   CheckCircle2, Send, Loader2, AlertCircle,
// //   Eye, Heart, TrendingUp, Users, Clock, Inbox,
// //   FileText, Globe, Trash2, Edit2, RefreshCw,
// //   LinkIcon, Palette, MessageSquare,
// //   Bell, BellOff, Moon, Sun,
// // } from "lucide-react";
// // import {
// //   clearSession, getSession,
// //   BASE_URL,
// //   apiGetPosts, apiCreatePost, apiSaveDraft, apiGetAnalytics,
// //   apiGetQueuedPosts, apiGetDrafts, apiUpdateDraft, apiDeleteDraft,
// //   apiPublishPost, apiGetOverview, apiGetSocialAccounts,
// //   apiGetOAuthUrl, apiDisconnectSocialAccount,
// //   apiSMMDashboard, apiSMMGetDesignProjects, apiSMMCreateDesignProject,
// //   apiSMMDeleteDesignProject,
// //   apiSMMApproveRejectProject, apiSMMRequestRevision,
// //   apiSMMGetComments, apiSMMAddComment,
// //   type Post, type OverviewRes,
// // } from "@/lib/api";
// // import {
// //   LineChart, Line, ResponsiveContainer, Tooltip,
// //   XAxis, YAxis, CartesianGrid,
// // } from "recharts";

// // // ─── Keys ─────────────────────────────────────────────────────────────────────
// // const GD_TASKS_KEY  = "socialflow_gd_tasks";
// // const DARK_MODE_KEY = "socialflow_dark_mode";
// // const NOTIF_KEY     = "socialflow_notifications";

// // // ─── Types ────────────────────────────────────────────────────────────────────
// // type TaskStatus = "pending" | "in_progress" | "revision" | "completed";
// // type Priority   = "high" | "medium" | "low";
// // type NotifType  = "success" | "warning" | "error" | "info";
// // type SMMView    = "overview"|"compose"|"queue"|"drafts"|"published"|"calendar"|"gd_tasks"|"design_projects"|"analytics"|"channels"|"clients_gd";

// // interface GDTask {
// //   id: string; title: string; description: string; clientName: string;
// //   gdName: string;
// //   platform: string; deadline: string; priority: Priority; status: TaskStatus;
// //   assignedBy: string; assignedAt: string; notes?: string; revisionComment?: string;
// // }

// // interface DesignProject {
// //   _id?: string; id?: string;
// //   title: string; designType: string; priority: string; status: string;
// //   deadline: string; description?: string;
// //   clientId?: { _id?: string; name?: string } | string;
// //   designerId?: { _id?: string; name?: string } | string;
// //   revisionInfo?: { used: number; limit: number; remaining: number };
// // }

// // interface AppNotif {
// //   id: string; type: NotifType; title: string; message: string;
// //   timestamp: string; read: boolean; action?: { label: string; view: SMMView };
// // }

// // // Client with their connected social channels
// // interface ClientWithChannels {
// //   id: string;
// //   name: string;
// //   email: string;
// //   channels: ConnectedChannel[];
// //   loadingChannels?: boolean;
// // }

// // interface ConnectedChannel {
// //   _id?: string;
// //   id?: string;
// //   platform: string;
// //   username?: string;
// //   name?: string;
// //   status?: string;
// // }

// // // ─── Constants ────────────────────────────────────────────────────────────────
// // const PLATFORMS = [
// //   { id: "instagram",  label: "Instagram"  },
// //   { id: "facebook",   label: "Facebook"   },
// //   { id: "twitter",    label: "Twitter/X"  },
// //   { id: "linkedin",   label: "LinkedIn"   },
// //   { id: "youtube",    label: "YouTube"    },
// //   { id: "pinterest",  label: "Pinterest"  },
// // ];

// // const CONNECTABLE_PLATFORMS = [
// //   { id: "instagram", label: "Instagram", color: "from-pink-500 to-orange-400", icon: "📸" },
// //   { id: "facebook",  label: "Facebook",  color: "from-blue-600 to-blue-700",   icon: "👍" },
// //   { id: "twitter",   label: "Twitter/X", color: "from-sky-400 to-sky-500",     icon: "🐦" },
// //   { id: "linkedin",  label: "LinkedIn",  color: "from-blue-700 to-blue-800",   icon: "💼" },
// //   { id: "youtube",   label: "YouTube",   color: "from-red-500 to-red-600",     icon: "▶️" },
// //   { id: "pinterest", label: "Pinterest", color: "from-red-600 to-pink-600",    icon: "📌" },
// // ];

// // // Queue auto-remove after 5 minutes (in ms)
// // const QUEUE_DISPLAY_MS = 5 * 60 * 1000;

// // // ─── Notif helper ─────────────────────────────────────────────────────────────
// // const mkNotif = (type: NotifType, title: string, message: string, action?: AppNotif["action"]): AppNotif => ({
// //   id: `n_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
// //   type, title, message, timestamp: new Date().toISOString(), read: false, action,
// // });

// // // ─── Component ────────────────────────────────────────────────────────────────
// // const SMMDashboard = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const session  = getSession();
// //   const token    = session?.token ?? "";

// //   const [view, setView] = useState<SMMView>("overview");

// //   useEffect(() => {
// //     const locState = location.state as { view?: string } | null;
// //     if (locState?.view === "channels") {
// //       setView("channels");
// //       window.history.replaceState({}, "");
// //     }
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const [userName, setUserName] = useState("SMM Executive");

// //   // ── Dark Mode ──────────────────────────────────────────────────────────────
// //   const [dark, setDark] = useState<boolean>(() => localStorage.getItem(DARK_MODE_KEY) === "true");
// //   useEffect(() => {
// //     localStorage.setItem(DARK_MODE_KEY, String(dark));
// //     document.documentElement.classList.toggle("smm-dark", dark);
// //   }, [dark]);

// //   // ── Notifications ──────────────────────────────────────────────────────────
// //   const [notifs, setNotifs]       = useState<AppNotif[]>(() => {
// //     try { return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "[]"); } catch { return []; }
// //   });
// //   const [notifOpen, setNotifOpen] = useState(false);
// //   const [notifTab, setNotifTab]   = useState<0|1>(0);
// //   const notifRef                  = useRef<HTMLDivElement>(null);

// //   const saveNotifs = useCallback((arr: AppNotif[]) => {
// //     const t = arr.slice(0, 50);
// //     localStorage.setItem(NOTIF_KEY, JSON.stringify(t));
// //     return t;
// //   }, []);

// //   const pushNotif = useCallback((n: AppNotif) => {
// //     setNotifs(prev => saveNotifs([n, ...prev]));
// //   }, [saveNotifs]);

// //   const markAllRead = () => setNotifs(prev => saveNotifs(prev.map(n => ({ ...n, read: true }))));
// //   const clearNotifs = () => { setNotifs([]); localStorage.removeItem(NOTIF_KEY); };
// //   const deleteNotif = (id: string) => setNotifs(prev => saveNotifs(prev.filter(n => n.id !== id)));
// //   const unreadCount = notifs.filter(n => !n.read).length;

// //   useEffect(() => {
// //     if (!notifOpen) return;
// //     const h = (e: MouseEvent) => {
// //       if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
// //     };
// //     document.addEventListener("mousedown", h);
// //     return () => document.removeEventListener("mousedown", h);
// //   }, [notifOpen]);

// //   // ── API state ──────────────────────────────────────────────────────────────
// //   const [overview, setOverview]         = useState<OverviewRes | null>(null);
// //   const [overviewLoading, setOvLoading] = useState(false);
// //   const [smmDashData, setSmmDashData]   = useState<any>(null);

// //   // clientList and gdList — extracted from design projects API
// //   const [clientList, setClientList]     = useState<{ id:string; name:string; email:string }[]>([]);
// //   const [gdList, setGdList]             = useState<{ id:string; name:string; email:string }[]>([]);

// //   // Clients with their channels (for Channels view)
// //   const [clientsWithChannels, setClientsWithChannels]   = useState<ClientWithChannels[]>([]);
// //   const [clientChannelsLoading, setClientChannelsLoading] = useState(false);

// //   const [designProjects, setDesignProjects]   = useState<DesignProject[]>([]);
// //   const [designLoading,  setDesignLoading]    = useState(false);
// //   const [showAddDesign,  setShowAddDesign]    = useState(false);
// //   const [designFilter,   setDesignFilter]    = useState("");
// //   const [newDP, setNewDP] = useState({
// //     clientId:"", designerId:"", title:"", designType:"Social Post",
// //     deadline:"", priority:"Medium", description:"",
// //     targetAudience:"", brandColors:"", fontPreferences:"", revisionLimit:3,
// //   });
// //   const [dpSaving, setDpSaving]               = useState(false);
// //   const [selProject, setSelProject]           = useState<DesignProject | null>(null);
// //   const [projComments, setProjComments]       = useState<any[]>([]);
// //   const [newComment, setNewComment]           = useState("");
// //   const [commentSending, setCommentSending]   = useState(false);

// //   const [posts, setPosts]               = useState<Post[]>([]);
// //   const [postsLoading, setPostsLoading] = useState(false);
// //   const [postsError, setPostsError]     = useState<string | null>(null);

// //   // Queue: track publishedAt for instant posts, auto-remove after 5 min
// //   const [queuedPosts, setQueuedPosts]   = useState<(Post & { queuedAt?: number })[]>([]);
// //   const [queueLoading, setQueueLoading] = useState(false);
// //   const [publishingId, setPublishingId] = useState<string | null>(null);

// //   const [drafts, setDrafts]             = useState<Post[]>([]);
// //   const [draftsLoading, setDraftsLoading] = useState(false);
// //   const [deletingDid, setDeletingDid]   = useState<string | null>(null);

// //   const [pubPosts, setPubPosts]         = useState<Post[]>([]);
// //   const [pubLoading, setPubLoading]     = useState(false);

// //   // My agency's own channels
// //   const [channels, setChannels]               = useState<any[]>([]);
// //   const [channelsLoading, setChanLoading]     = useState(false);
// //   const [disconnectingId, setDiscId]          = useState<string | null>(null);
// //   const [connectingPlatform, setConnPlat]     = useState<string | null>(null);

// //   const [analytics, setAnalytics]             = useState<any>(null);
// //   const [analyticsLoading, setAnaLoading]     = useState(false);

// //   // ── Compose state ──────────────────────────────────────────────────────────
// //   const [composeContent, setComposeContent]   = useState("");
// //   // Selected client for this post
// //   const [composeClientId, setComposeClientId] = useState("");
// //   // Channels of the selected client
// //   const [clientConnectedChannels, setClientConnectedChannels] = useState<ConnectedChannel[]>([]);
// //   const [clientChannelsFetching, setClientChannelsFetching]   = useState(false);
// //   const [composePlatforms, setComposePlatforms] = useState<string[]>([]);
// //   const [composeScheduleDate, setComposeScheduleDate] = useState("");
// //   const [composeScheduleTime, setComposeScheduleTime] = useState("");
// //   const [composeSaving, setComposeSaving]     = useState(false);
// //   const [composeMedia, setComposeMedia]       = useState<File | null>(null);
// //   const [composePreview, setComposePreview]   = useState<string | null>(null);
// //   const [composeTags, setComposeTags]         = useState<string[]>([]);
// //   const [composeTagInput, setComposeTagInput] = useState("");
// //   const [editingDraft, setEditingDraft]       = useState<Post | null>(null);

// //   // GD Tasks (local storage based)
// //   const [gdTasks, setGdTasks]           = useState<GDTask[]>([]);
// //   const completedGDCount = gdTasks.filter(t => t.status === "completed").length;
// //   const totalBadgeCount = (notifs.filter(n => !n.read).length) + completedGDCount;
// //   const [showAddTask, setShowAddTask]   = useState(false);
// //   const [newTask, setNewTask] = useState({
// //     title:"", description:"", clientName:"", gdName:"",
// //     platform:"Instagram", deadline:"", priority:"medium" as Priority, notes:"",
// //   });

// //   const [calMonth, setCalMonth] = useState(new Date());
// //   const prevGDTasksRef = useRef<GDTask[]>([]);

// //   // Connecting channel state per client
// //   const [connectingForClient, setConnectingForClient] = useState<string|null>(null);

// //   // ── Auto-remove instant posts from queue after 5 min ──────────────────────
// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       const now = Date.now();
// //       setQueuedPosts(prev => {
// //         const filtered = prev.filter(p => {
// //           // If post has no scheduleAt, it's an instant post — remove after QUEUE_DISPLAY_MS
// //           const isInstant = !p.scheduleAt && !p.scheduled_at;
// //           if (isInstant && p.queuedAt && (now - p.queuedAt) >= QUEUE_DISPLAY_MS) {
// //             return false;
// //           }
// //           return true;
// //         });
// //         return filtered;
// //       });
// //     }, 10_000); // check every 10s
// //     return () => clearInterval(interval);
// //   }, []);

// //   // Watch for GD tasks becoming completed → push notification
// //   useEffect(() => {
// //     const prev = prevGDTasksRef.current;
// //     if (prev.length > 0) {
// //       gdTasks.forEach(task => {
// //         const prevTask = prev.find(t => t.id === task.id);
// //         if (prevTask && prevTask.status !== "completed" && task.status === "completed") {
// //           pushNotif(mkNotif("info", "GD Task Completed! 🎨",
// //             `"${task.title}" by ${task.gdName} is ready for review`,
// //             { label: "Review Now", view: "gd_tasks" }));
// //         }
// //       });
// //     }
// //     prevGDTasksRef.current = gdTasks;
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [gdTasks]);

// //   // ── Init ────────────────────────────────────────────────────────────────────
// //   useEffect(() => {
// //     const name = localStorage.getItem("socialflow_user_name") || "SMM Executive";
// //     setUserName(name);
// //     const stored = localStorage.getItem(GD_TASKS_KEY);
// //     if (stored) setGdTasks(JSON.parse(stored));
// //     if (token) {
// //       loadOverview();
// //       loadPosts();
// //       loadSMMDashboard();
// //       loadUsersForDropdowns();
// //     }
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [token]);

// //   useEffect(() => {
// //     if (!token) return;
// //     if (view === "overview")        { loadOverview(); loadPosts(); }
// //     if (view === "queue")           loadQueued();
// //     if (view === "drafts")          loadDrafts();
// //     if (view === "published")       loadPublished();
// //     if (view === "analytics")       loadAnalytics();
// //     if (view === "calendar")        loadPosts();
// //     if (view === "channels")        { loadChannels(); loadClientsWithChannels(); }
// //     if (view === "design_projects") loadDesignProjects();
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [view]);

// //   // When client changes in compose, fetch their channels
// //   useEffect(() => {
// //     if (composeClientId) fetchClientChannels(composeClientId);
// //     else { setClientConnectedChannels([]); setComposePlatforms([]); }
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [composeClientId]);

// //   // ── Loaders ─────────────────────────────────────────────────────────────────
// //   const loadOverview = async () => {
// //     setOvLoading(true);
// //     try { const { data } = await apiGetOverview(token); if (data) setOverview(data); } catch {}
// //     setOvLoading(false);
// //   };

// //   const loadSMMDashboard = async () => {
// //     const { data } = await apiSMMDashboard(token);
// //     if (data) {
// //       const d = (data as any)?.data ?? data;
// //       setSmmDashData(d);
// //       extractUsers((d as any)?.recentProjects ?? []);
// //     }
// //   };

// //   const extractUsers = (projects: any[]) => {
// //     if (!Array.isArray(projects) || !projects.length) return;
// //     const cm = new Map<string,{id:string;name:string;email:string}>();
// //     const gm = new Map<string,{id:string;name:string;email:string}>();
// //     projects.forEach((p:any) => {
// //       const c = p.clientId;
// //       if (c && typeof c==="object" && c._id)
// //         cm.set(c._id, {id:c._id, name:c.name||"Client", email:c.email||""});
// //       const g = p.designerId;
// //       if (g && typeof g==="object" && g._id)
// //         gm.set(g._id, {id:g._id, name:g.name||"Designer", email:g.email||""});
// //     });
// //     if (cm.size) setClientList(prev => {
// //       const m=new Map(prev.map(x=>[x.id,x])); cm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
// //     });
// //     if (gm.size) setGdList(prev => {
// //       const m=new Map(prev.map(x=>[x.id,x])); gm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
// //     });
// //   };

// //   const loadUsersForDropdowns = async () => {
// //     const sc = localStorage.getItem("socialflow_clients");
// //     const st = localStorage.getItem("socialflow_team_members");
// //     if (sc) { try { const p:any[]=JSON.parse(sc); if(p.length) setClientList(p.map(c=>({id:c.id||c._id,name:c.name,email:c.email||""}))); } catch {} }
// //     if (st) { try { const p:any[]=JSON.parse(st); const gds=p.filter(m=>m.role==="graphic_designer"||m.role==="GD"); if(gds.length) setGdList(gds.map(g=>({id:g.id||g._id,name:g.name,email:g.email||""}))); } catch {} }
// //     const { data } = await apiSMMGetDesignProjects(token,{limit:100});
// //     const raw=data as any;
// //     const projects=raw?.data?.projects??raw?.projects??raw?.data??[];
// //     if(Array.isArray(projects)&&projects.length) extractUsers(projects);
// //   };

// //   // Fetch channels for a specific client (by clientId)
// //  const fetchClientChannels = async (clientId: string) => {
// //   if (!clientId) return;
// //   setClientChannelsFetching(true);
// //   try {
// //     const endpoints = [
// //       `${BASE_URL}/api/social-accounts?userId=${clientId}`,
// //       `${BASE_URL}/api/social-accounts?clientId=${clientId}`,
// //       `${BASE_URL}/api/clients/${clientId}/social-accounts`,
// //       `${BASE_URL}/api/clients/${clientId}/channels`,
// //     ];
// //     let found: ConnectedChannel[] = [];
// //     for (const url of endpoints) {
// //       try {
// //         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// //         if (res.ok) {
// //           const json = await res.json();
// //           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// //           const arr = Array.isArray(raw) ? raw : [];
// //           if (arr.length > 0) { found = arr; break; }
// //         }
// //       } catch { /* try next */ }
// //     }
// //     setClientConnectedChannels(found);
// //     setComposePlatforms([]);
// //   } catch {
// //     setClientConnectedChannels([]);
// //   }
// //   setClientChannelsFetching(false);
// // };

// //   // Load all clients and their channels for Channels view
// // const loadClientsWithChannels = async () => {
// //   setClientChannelsLoading(true);

// //   // FIX: don't rely on stale clientList state — fetch fresh
// //   let clients = clientList;
// //   if (clients.length === 0) {
// //     const { data } = await apiSMMGetDesignProjects(token, { limit: 100 });
// //     const raw = data as any;
// //     const projects = raw?.data?.projects ?? raw?.projects ?? raw?.data ?? [];
// //     const cm = new Map<string, { id: string; name: string; email: string }>();
// //     if (Array.isArray(projects)) {
// //       projects.forEach((p: any) => {
// //         const c = p.clientId;
// //         if (c && typeof c === "object" && c._id)
// //           cm.set(c._id, { id: c._id, name: c.name || "Client", email: c.email || "" });
// //       });
// //     }
// //     clients = Array.from(cm.values());
// //     if (clients.length > 0) setClientList(clients); // update state too
// //   }

// //   if (clients.length === 0) { setClientChannelsLoading(false); return; }

// //   const updated: ClientWithChannels[] = [];
// //   for (const client of clients) {
// //     // FIX: try multiple endpoint patterns
// //     const endpoints = [
// //       `${BASE_URL}/api/social-accounts?userId=${client.id}`,
// //       `${BASE_URL}/api/social-accounts?clientId=${client.id}`,
// //       `${BASE_URL}/api/clients/${client.id}/social-accounts`,
// //       `${BASE_URL}/api/clients/${client.id}/channels`,
// //     ];
// //     let channels: ConnectedChannel[] = [];
// //     for (const url of endpoints) {
// //       try {
// //         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// //         if (res.ok) {
// //           const json = await res.json();
// //           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// //           const arr = Array.isArray(raw) ? raw : [];
// //           if (arr.length > 0) { channels = arr; break; }
// //         }
// //       } catch { /* try next */ }
// //     }
// //     updated.push({ ...client, channels });
// //   }
// //   setClientsWithChannels(updated);
// //   setClientChannelsLoading(false);
// // };

// //   const loadDesignProjects = async () => {
// //     setDesignLoading(true);
// //     const { data, error } = await apiSMMGetDesignProjects(token, designFilter ? {status:designFilter} : undefined);
// //     if (error) { toast.error("Load failed: "+error); pushNotif(mkNotif("error","Projects Load Failed",error)); }
// //     else {
// //       const raw=data as any;
// //       const list=raw?.data?.projects??raw?.projects??raw?.data??(Array.isArray(raw)?raw:[]);
// //       const arr=Array.isArray(list)?list:[];
// //       setDesignProjects(arr); extractUsers(arr);
// //     }
// //     setDesignLoading(false);
// //   };

// //   const loadPosts = async () => {
// //     setPostsLoading(true); setPostsError(null);
// //     const { data, error } = await apiGetPosts(token);
// //     if (error) { if(!error.includes("404")&&!error.includes("not found")) setPostsError(error); }
// //     else {
// //       const raw=data as any;
// //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       setPosts(Array.isArray(list)?list:[]);
// //     }
// //     setPostsLoading(false);
// //   };

// //   const loadQueued = async () => {
// //     setQueueLoading(true);
// //     const { data, error } = await apiGetQueuedPosts(token);
// //     if (error) toast.error("Queue load failed: "+error);
// //     else {
// //       const raw=data as any;
// //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       const arr: (Post & { queuedAt?: number })[] = Array.isArray(list) ? list : [];
// //       // Preserve existing queuedAt timestamps for posts already in state
// //       const merged = arr.map(p => {
// //         const existing = queuedPosts.find(q => (q._id??q.id) === (p._id??p.id));
// //         return existing ? { ...p, queuedAt: existing.queuedAt } : { ...p, queuedAt: Date.now() };
// //       });
// //       if (merged.length > queuedPosts.length && queuedPosts.length > 0)
// //         pushNotif(mkNotif("info","Queue Updated",`${merged.length-queuedPosts.length} new post(s) added to queue`,{label:"View Queue",view:"queue"}));
// //       setQueuedPosts(merged);
// //     }
// //     setQueueLoading(false);
// //   };

// //   const loadDrafts = async () => {
// //     setDraftsLoading(true);
// //     const { data, error } = await apiGetDrafts(token);
// //     if (error) toast.error("Drafts load failed: "+error);
// //     else {
// //       const raw=data as any;
// //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       setDrafts(Array.isArray(list)?list:[]);
// //     }
// //     setDraftsLoading(false);
// //   };

// //   const loadPublished = async () => {
// //     setPubLoading(true);
// //     const { data, error } = await apiGetPosts(token, "published");
// //     if (error) toast.error("Published load failed: "+error);
// //     else {
// //       const raw=data as any;
// //       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       setPubPosts(Array.isArray(list)?list:[]);
// //     }
// //     setPubLoading(false);
// //   };

// //   const loadAnalytics = async () => {
// //     setAnaLoading(true);
// //     const { data } = await apiGetAnalytics(token,"7d");
// //     if (data?.data) setAnalytics(data.data);
// //     setAnaLoading(false);
// //   };

// //   const loadChannels = async () => {
// //     setChanLoading(true);
// //     const { data, error } = await apiGetSocialAccounts(token);
// //     if (error) toast.error("Channels load failed: "+error);
// //     else {
// //       const raw=data as any;
// //       const list=raw?.channels??raw?.accounts??raw?.data??(Array.isArray(raw)?raw:[]);
// //       setChannels(Array.isArray(list)?list:[]);
// //     }
// //     setChanLoading(false);
// //   };

// //   // ── Actions ─────────────────────────────────────────────────────────────────
// //   const handleLogout = () => {
// //     clearSession(); localStorage.removeItem("socialflow_role"); navigate("/"); toast.success("Logged out successfully");
// //   };

// //   const togglePlat = (id:string) => setComposePlatforms(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);

// //   const handleCompose = async (action:"draft"|"queue"|"schedule") => {
// //     if (!composeContent.trim()) { toast.error("Please add some content"); return; }
// //     if (action!=="draft"&&composePlatforms.length===0) { toast.error("Please select at least one platform"); return; }
// //     if (action!=="draft"&&!composeClientId) { toast.error("Please select a client"); return; }
// //     setComposeSaving(true);
// //     try {
// //       if (action==="draft") {
// //         if (editingDraft) {
// //           const id=editingDraft._id??editingDraft.id??"";
// //           const {error}=await apiUpdateDraft(token,id,composeContent,composePlatforms,composeMedia?[composeMedia]:[]);
// //           if(error){toast.error("Update failed: "+error);return;}
// //           toast.success("Draft updated!");
// //           pushNotif(mkNotif("success","Draft Updated","Draft saved successfully",{label:"View Drafts",view:"drafts"}));
// //         } else {
// //           const {error}=await apiSaveDraft(token,composeContent,composePlatforms,composeTags,composeMedia?[composeMedia]:[]);
// //           if(error){toast.error("Save failed: "+error);return;}
// //           toast.success("Draft saved!");
// //           pushNotif(mkNotif("success","Draft Saved","New draft saved",{label:"View Drafts",view:"drafts"}));
// //         }
// //         resetCompose(); setView("drafts");
// //       } else {
// //         let schedAt: string | null = null;
// //         if (composeScheduleDate && composeScheduleTime) {
// //           schedAt = new Date(`${composeScheduleDate}T${composeScheduleTime}`).toISOString();
// //         } else if (composeScheduleDate) {
// //           schedAt = new Date(`${composeScheduleDate}T00:00`).toISOString();
// //         }
// //         const {error}=await apiCreatePost(
// //           token, composeContent, composePlatforms, composeTags,
// //           composeMedia?[composeMedia]:[], schedAt??"",
// //           // pass clientId so the backend publishes on client's channels
// //           { clientId: composeClientId }
// //         );
// //         if(error){toast.error("Post failed: "+error);return;}
// //         const isScheduled = !!schedAt;
// //         toast.success(isScheduled?"Post scheduled!":"Post added to queue!");
// //         pushNotif(mkNotif("success",isScheduled?"Post Scheduled":"Post Queued",
// //           isScheduled?`Will publish on ${new Date(schedAt!).toLocaleString("en-IN")}`:"Instant post added to queue — will publish in ~5 minutes",
// //           {label:"View Queue",view:"queue"}));
// //         resetCompose(); setView("queue");
// //         // Refresh queue immediately
// //         setTimeout(() => loadQueued(), 500);
// //       }
// //     } catch { toast.error("Network error"); }
// //     finally { setComposeSaving(false); }
// //   };

// //   const resetCompose = () => {
// //     setComposeContent(""); setComposePlatforms([]);
// //     setComposeScheduleDate(""); setComposeScheduleTime("");
// //     setComposeMedia(null); setComposePreview(null);
// //     setEditingDraft(null); setComposeTags([]); setComposeTagInput("");
// //     setComposeClientId(""); setClientConnectedChannels([]);
// //   };

// //   const handleTagKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key==="Enter"||e.key===","||e.key===" ") {
// //       e.preventDefault();
// //       const t=composeTagInput.trim().replace(/^#/,"");
// //       if(t&&!composeTags.includes(t)) setComposeTags(p=>[...p,t]);
// //       setComposeTagInput("");
// //     }
// //   };

// //   const handlePublishNow = async (pid:string) => {
// //     setPublishingId(pid);
// //     const {error}=await apiPublishPost(token,pid);
// //     if(error){
// //       toast.error("Publish failed: "+error);
// //       pushNotif(mkNotif("error","Publish Failed",error));
// //     } else {
// //       toast.success("Post published!");
// //       pushNotif(mkNotif("success","Published! 🎉","Post published successfully",{label:"View Published",view:"published"}));
// //       // Remove from queue immediately
// //       setQueuedPosts(prev => prev.filter(p => (p._id??p.id) !== pid));
// //       loadOverview();
// //     }
// //     setPublishingId(null);
// //   };

// //   const handleDeleteDraft = async (id:string) => {
// //     if(!confirm("Are you sure you want to delete this draft?")) return;
// //     setDeletingDid(id);
// //     const {error}=await apiDeleteDraft(token,id);
// //     if(error) toast.error("Delete failed: "+error);
// //     else{toast.success("Draft deleted!");pushNotif(mkNotif("warning","Draft Deleted","A draft was deleted"));loadDrafts();}
// //     setDeletingDid(null);
// //   };

// //   const handleEditDraft = (d:Post) => {
// //     setEditingDraft(d); setComposeContent(d.content); setComposePlatforms(d.platforms??[]);
// //     setView("compose");
// //   };

// //   // Connect a channel for a specific client
// // const handleConnectForClient = async (platId: string, clientId: string) => {
// //   const key = `${clientId}_${platId}`;
// //   setConnectingForClient(key);
// //   const { data, error } = await apiGetOAuthUrl(token, platId);
// //   if (error) { toast.error("OAuth failed: " + error); setConnectingForClient(null); return; }
// //   const url = (data as any)?.authUrl ?? (data as any)?.url ?? (data as any)?.redirectUrl;
// //   const oauthState = (data as any)?.state ?? (data as any)?.oauthState ?? null;
// //   if (url) {
// //     localStorage.setItem("oauth_platform", platId);
// //     localStorage.setItem("oauth_client_id", clientId);
// //     if (oauthState) localStorage.setItem("oauth_state", oauthState);
// //     // window.open(url, "_blank");
// //     window.location.href = url;
// //     pushNotif(mkNotif("info", "Platform Connect", `Connecting ${platId} for client...`, { label: "View Channels", view: "channels" }));

// //     // ✅ FIX: Refresh channels when user comes back after OAuth
// //     const refreshOnFocus = () => {
// //       window.removeEventListener("focus", refreshOnFocus);
// //       setTimeout(() => {
// //         loadClientsWithChannels();
// //         if (composeClientId === clientId) fetchClientChannels(clientId);
// //       }, 1500);
// //     };
// //     window.addEventListener("focus", refreshOnFocus);
// //   } else toast.error("No OAuth URL returned");
// //   setConnectingForClient(null);
// // };

// //   // Disconnect a channel for a client
// //   const handleDisconnectClientChannel = async (channelId:string, clientId:string) => {
// //     if(!confirm("Are you sure you want to disconnect this account?")) return;
// //     const {error}=await apiDisconnectSocialAccount(token,channelId);
// //     if(error) toast.error("Disconnect failed: "+error);
// //     else{
// //       toast.success("Disconnected!");
// //       pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));
// //       // Update local state
// //       setClientsWithChannels(prev => prev.map(c =>
// //         c.id === clientId
// //           ? { ...c, channels: c.channels.filter(ch => (ch._id??ch.id) !== channelId) }
// //           : c
// //       ));
// //       // Also refresh compose client channels if needed
// //       if(composeClientId === clientId) fetchClientChannels(clientId);
// //     }
// //   };

// //   const handleConnect = async (platId:string) => {
// //     setConnPlat(platId);
// //     const {data,error}=await apiGetOAuthUrl(token,platId);
// //     if(error){toast.error("OAuth failed: "+error);setConnPlat(null);return;}
// //     const url=(data as any)?.authUrl??(data as any)?.url??(data as any)?.redirectUrl;
// //     const oauthState=(data as any)?.state??(data as any)?.oauthState??null;
// //     if(url){
// //       localStorage.setItem("oauth_platform", platId);
// //       if(oauthState) localStorage.setItem("oauth_state", oauthState);
// //       // window.open(url,"_blank");
// //       window.location.href = url;
// //       pushNotif(mkNotif("info","Platform Connect",`Connecting ${platId}...`,{label:"View Channels",view:"channels"}));
// //     } else toast.error("No OAuth URL returned");
// //     setConnPlat(null);
// //   };

// //   const handleDisconnect = async (cid:string) => {
// //     if(!confirm("Are you sure you want to disconnect this account?")) return;
// //     setDiscId(cid);
// //     const {error}=await apiDisconnectSocialAccount(token,cid);
// //     if(error) toast.error("Disconnect failed: "+error);
// //     else{toast.success("Disconnected!");pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));loadChannels();}
// //     setDiscId(null);
// //   };

// //   const handleCreateDP = async (e:React.FormEvent) => {
// //     e.preventDefault();
// //     if(!newDP.clientId||!newDP.designerId||!newDP.title||!newDP.deadline){toast.error("Please fill all required fields");return;}
// //     setDpSaving(true);
// //     const {error}=await apiSMMCreateDesignProject(token,{...newDP});
// //     if(error) toast.error("Create failed: "+error);
// //     else{
// //       toast.success("Project created!");
// //       pushNotif(mkNotif("success","Project Created",`"${newDP.title}" assigned to designer`,{label:"View Projects",view:"design_projects"}));
// //       setShowAddDesign(false);
// //       setNewDP({clientId:"",designerId:"",title:"",designType:"Social Post",deadline:"",priority:"Medium",description:"",targetAudience:"",brandColors:"",fontPreferences:"",revisionLimit:3});
// //       loadDesignProjects();
// //     }
// //     setDpSaving(false);
// //   };

// //   const handleDeleteDP = async (id:string) => {
// //     if(!confirm("Are you sure you want to delete this project?")) return;
// //     const {error}=await apiSMMDeleteDesignProject(token,id);
// //     if(error) toast.error("Delete failed: "+error);
// //     else{toast.success("Deleted!");pushNotif(mkNotif("warning","Project Deleted","Design project deleted"));loadDesignProjects();}
// //   };

// //   const handleApproveReject = async (id:string, act:"approve"|"reject") => {
// //     const note=prompt(act==="approve"?"Approval note (optional):":"Rejection reason:");
// //     if(act==="reject"&&!note) return;
// //     const {error}=await apiSMMApproveRejectProject(token,id,act,note??"");
// //     if(error) toast.error("Action failed: "+error);
// //     else{
// //       toast.success(act==="approve"?"Approved!":"Rejected!");
// //       pushNotif(mkNotif(act==="approve"?"success":"warning",act==="approve"?"Project Approved":"Project Rejected","Design project "+act+"ed",{label:"View Projects",view:"design_projects"}));
// //       loadDesignProjects();
// //     }
// //   };

// //   const handleRevisionReq = async (id:string) => {
// //     const msg=prompt("Please enter revision details:");
// //     if(!msg) return;
// //     const {error}=await apiSMMRequestRevision(token,id,msg);
// //     if(error) toast.error("Revision failed: "+error);
// //     else{toast.success("Revision request sent!");pushNotif(mkNotif("info","Revision Requested","Revision request sent to designer",{label:"View Projects",view:"design_projects"}));loadDesignProjects();}
// //   };

// //   const openProjectDetail = async (project:DesignProject) => {
// //     setSelProject(project);
// //     const pid=project._id??project.id??"";
// //     const {data}=await apiSMMGetComments(token,pid);
// //     const raw=data as any;
// //     const list=raw?.data??raw?.comments??[];
// //     setProjComments(Array.isArray(list)?list:[]);
// //   };

// //   const handleSendComment = async () => {
// //     if(!newComment.trim()||!selProject) return;
// //     setCommentSending(true);
// //     const pid=selProject._id??selProject.id??"";
// //     const {error}=await apiSMMAddComment(token,pid,newComment);
// //     if(error) toast.error("Comment failed: "+error);
// //     else{toast.success("Comment sent!");setNewComment("");openProjectDetail(selProject);}
// //     setCommentSending(false);
// //   };

// //   const handleAssignTask = (e:React.FormEvent) => {
// //     e.preventDefault();
// //     if(!newTask.title||!newTask.clientName||!newTask.deadline){toast.error("Please fill all required fields");return;}
// //     const task:GDTask={
// //       id:"T"+Date.now().toString().slice(-6), ...newTask,
// //       status:"pending", assignedBy:`${userName} (SMM)`,
// //       assignedAt:new Date().toISOString().split("T")[0],
// //     };
// //     const upd=[task,...gdTasks];
// //     setGdTasks(upd);
// //     localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
// //     setShowAddTask(false);
// //     setNewTask({title:"",description:"",clientName:"",gdName:"",platform:"Instagram",deadline:"",priority:"medium",notes:""});
// //     toast.success("Task assigned!");
// //     pushNotif(mkNotif("success","Task Assigned",`"${task.title}" assigned to designer`,{label:"GD Tasks",view:"gd_tasks"}));
// //   };

// //   const handleRevision = (tid:string, comment:string) => {
// //     const upd=gdTasks.map(t=>t.id===tid?{...t,status:"revision" as TaskStatus,revisionComment:comment}:t);
// //     setGdTasks(upd); localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
// //     toast.success("Revision request sent");
// //     pushNotif(mkNotif("info","Revision Requested","Revision requested for GD task",{label:"GD Tasks",view:"gd_tasks"}));
// //   };

// //   const handleGDTaskApproveReject = (taskId: string, action: "approve"|"reject") => {
// //     const upd = gdTasks.map(t =>
// //       t.id === taskId
// //         ? { ...t, status: (action === "approve" ? "completed" : "revision") as TaskStatus }
// //         : t
// //     );
// //     setGdTasks(upd);
// //     localStorage.setItem(GD_TASKS_KEY, JSON.stringify(upd));
// //     toast.success(action === "approve" ? "Task approved!" : "Task sent for revision!");
// //     pushNotif(mkNotif(
// //       action === "approve" ? "success" : "warning",
// //       action === "approve" ? "Task Approved ✅" : "Task Rejected",
// //       action === "approve" ? "GD task approved and marked complete" : "GD task sent back for revision",
// //       { label: "GD Tasks", view: "gd_tasks" }
// //     ));
// //     setNotifOpen(false);
// //   };

// //   // ── Computed ─────────────────────────────────────────────────────────────────
// //   const taskCounts = {
// //     pending:     gdTasks.filter(t=>t.status==="pending").length,
// //     in_progress: gdTasks.filter(t=>t.status==="in_progress").length,
// //     revision:    gdTasks.filter(t=>t.status==="revision").length,
// //     completed:   gdTasks.filter(t=>t.status==="completed").length,
// //   };

// //   const calDays = (() => {
// //     const y=calMonth.getFullYear(), m=calMonth.getMonth();
// //     const off=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
// //     const cells:(Date|null)[]= [];
// //     for(let i=0;i<off;i++) cells.push(null);
// //     for(let d=1;d<=dim;d++) cells.push(new Date(y,m,d));
// //     while(cells.length%7!==0) cells.push(null);
// //     return cells;
// //   })();

// //   const postsForDay=(d:Date)=>posts.filter(p=>{
// //     const ds=p.scheduleAt??p.scheduled_at??p.createdAt;
// //     if(!ds)return false;
// //     const pd=new Date(ds);
// //     return pd.getFullYear()===d.getFullYear()&&pd.getMonth()===d.getMonth()&&pd.getDate()===d.getDate();
// //   });

// //   const weeklyData = analytics?.weeklyData?.length
// //     ? analytics.weeklyData
// //     : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>({day,reach:0,engagement:0}));

// //   const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];

// //   const ovTotal     = overview?.total     ?? (overview?.data as any)?.total     ?? posts.length;
// //   const ovPublished = overview?.published ?? (overview?.data as any)?.published ?? posts.filter(p=>p.status==="published").length;
// //   const ovScheduled = overview?.scheduled ?? (overview?.data as any)?.scheduled ?? posts.filter(p=>p.status==="scheduled").length;
// //   const ovFailed    = overview?.failed    ?? (overview?.data as any)?.failed    ?? posts.filter(p=>p.status==="failed").length;

// //   // Queue time remaining helper
// //   const queueTimeLeft = (p: Post & { queuedAt?: number }): string | null => {
// //     if (p.scheduleAt || p.scheduled_at) return null; // scheduled post — show schedule time
// //     if (!p.queuedAt) return null;
// //     const remaining = QUEUE_DISPLAY_MS - (Date.now() - p.queuedAt);
// //     if (remaining <= 0) return "Publishing soon...";
// //     const mins = Math.floor(remaining / 60000);
// //     const secs = Math.floor((remaining % 60000) / 1000);
// //     return `Publishing in ${mins}m ${secs}s`;
// //   };

// //   const navItems:{key:SMMView;icon:React.ElementType;label:string}[] = [
// //     {key:"overview",        icon:LayoutDashboard, label:"Overview"},
// //     {key:"compose",         icon:PenSquare,       label:"Create Post"},
// //     {key:"queue",           icon:Inbox,           label:"Queue"},
// //     {key:"drafts",          icon:FileText,        label:"Drafts"},
// //     {key:"published",       icon:Globe,           label:"Published"},
// //     {key:"calendar",        icon:Calendar,        label:"Calendar"},
// //     {key:"design_projects", icon:Palette,         label:"Design Projects"},
// //     {key:"gd_tasks",        icon:FileImage,       label:"GD Tasks"},
// //     {key:"analytics",       icon:BarChart3,       label:"Analytics"},
// //     {key:"channels",        icon:LinkIcon,        label:"Channels"},
// //     {key:"clients_gd",      icon:Users,           label:"Clients & GD"},
// //   ];

// //   const viewTitle:Record<SMMView,string>={
// //     overview:"SMM Dashboard", compose:editingDraft?"Edit Draft":"Create Post",
// //     queue:"Queue", drafts:"Drafts", published:"Published",
// //     calendar:"Content Calendar", gd_tasks:"GD Tasks",
// //     design_projects:"Design Projects", analytics:"Analytics", channels:"Channels",
// //     clients_gd:"Clients & Graphic Designers",
// //   };

// //   const statusBadge=(s:string)=>{
// //     const m:Record<string,string>={
// //       draft:"bg-yellow-100 text-yellow-700",
// //       scheduled:"bg-blue-100 text-blue-700",
// //       published:"bg-green-100 text-green-700",
// //       failed:"bg-red-100 text-red-700",
// //       queued:"bg-purple-100 text-purple-700",
// //     };
// //     return m[s]??"bg-slate-100 text-slate-600";
// //   };
// //   const notifIcon=(t:NotifType)=>({success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"}[t]);

// //   // ── RENDER ───────────────────────────────────────────────────────────────────
// //   return (
// //     <div className={`smm-root min-h-screen flex ${dark?"smm-dark":""}`}>

// //       {/* ── Sidebar ── */}
// //       <aside className="smm-sidebar hidden md:flex w-64 flex-col shrink-0">
// //         <div className="p-5 border-b smm-border"><Logo /></div>
// //         <div className="p-4 flex-1">
// //           <div className="smm-profile-card flex items-center gap-3 p-3 rounded-xl mb-4 border">
// //             <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
// //               <Megaphone className="w-5 h-5 text-white" />
// //             </div>
// //             <div className="min-w-0">
// //               <div className="text-sm font-semibold smm-text-primary truncate">{userName}</div>
// //               <div className="text-xs text-green-600 font-medium">SMM Executive</div>
// //             </div>
// //           </div>
// //           <nav className="space-y-0.5">
// //             {navItems.map(n=>(
// //               <button key={n.key} onClick={()=>{resetCompose();setView(n.key);}}
// //                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${view===n.key?"smm-nav-active":"smm-nav-idle"}`}>
// //                 <n.icon className="w-4 h-4 shrink-0" />
// //                 {n.label}
// //                 {n.key==="queue"&&queuedPosts.length>0&&(
// //                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-green-100 text-green-700"}`}>
// //                     {queuedPosts.length}
// //                   </span>
// //                 )}
// //                 {n.key==="drafts"&&drafts.length>0&&(
// //                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-yellow-100 text-yellow-700"}`}>
// //                     {drafts.length}
// //                   </span>
// //                 )}
// //               </button>
// //             ))}
// //           </nav>
// //         </div>
// //         <div className="p-4 border-t smm-border">
// //           <Button variant="ghost" className="w-full justify-start smm-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
// //             <LogOut className="w-4 h-4 mr-2" /> Logout
// //           </Button>
// //         </div>
// //       </aside>

// //       {/* ── Main ── */}
// //       <main className="smm-main flex-1 min-w-0 overflow-y-auto">

// //         {/* Header */}
// //         <header className="smm-header px-6 py-4 flex items-center justify-between sticky top-0 z-20">
// //           <div>
// //             <h1 className="text-xl font-bold smm-text-primary">{viewTitle[view]}</h1>
// //             <p className="text-sm smm-text-muted">Welcome back, {userName}</p>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             {view==="gd_tasks"&&(
// //               <Button onClick={()=>setShowAddTask(true)} className="bg-green-600 hover:bg-green-700">
// //                 <Plus className="w-4 h-4 mr-2"/>Assign Task to GD
// //               </Button>
// //             )}
// //             {view==="design_projects"&&(
// //               <Button onClick={()=>setShowAddDesign(true)} className="bg-green-600 hover:bg-green-700">
// //                 <Plus className="w-4 h-4 mr-2"/>New Design Project
// //               </Button>
// //             )}
// //             {view==="queue"&&(
// //               <Button variant="outline" size="sm" onClick={loadQueued} disabled={queueLoading} className="smm-btn-outline">
// //                 <RefreshCw className={`w-4 h-4 mr-1 ${queueLoading?"animate-spin":""}`}/>Refresh
// //               </Button>
// //             )}
// //             {view==="drafts"&&(
// //               <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{resetCompose();setView("compose");}}>
// //                 <Plus className="w-4 h-4 mr-1"/>New Post
// //               </Button>
// //             )}
// //             {view==="published"&&(
// //               <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
// //                 <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
// //               </Button>
// //             )}
// //             {view==="compose"&&(
// //               <Button variant="outline" size="sm" onClick={()=>{resetCompose();setView("overview");}} className="smm-btn-outline">
// //                 ← Back
// //               </Button>
// //             )}
// //             {view==="channels"&&(
// //               <Button variant="outline" size="sm" onClick={()=>{loadChannels();loadClientsWithChannels();}} className="smm-btn-outline">
// //                 <RefreshCw className="w-4 h-4 mr-1"/>Refresh
// //               </Button>
// //             )}

// //             {/* Dark Mode */}
// //             <button onClick={()=>setDark(d=>!d)} className="smm-icon-btn p-2 rounded-lg transition" title={dark?"Light mode":"Dark mode"}>
// //               {dark?<Sun className="w-5 h-5 text-yellow-400"/>:<Moon className="w-5 h-5 smm-text-secondary"/>}
// //             </button>

// //             {/* Notifications */}
// //             <div className="relative" ref={notifRef}>
// //               <button onClick={()=>setNotifOpen(o=>!o)} className="smm-icon-btn relative p-2 rounded-lg transition">
// //                 <Bell className="w-5 h-5 smm-text-secondary"/>
// //                 {totalBadgeCount>0&&(
// //                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
// //                     {totalBadgeCount>9?"9+":totalBadgeCount}
// //                   </span>
// //                 )}
// //               </button>

// //               {notifOpen&&(
// //                 <div className="smm-notif-panel absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border overflow-hidden z-50">
// //                   <div className="flex items-center justify-between px-4 py-3 border-b smm-border smm-notif-header">
// //                     <span className="font-semibold text-sm smm-text-primary flex items-center gap-2">
// //                       <Bell className="w-4 h-4"/>Notifications
// //                       {unreadCount>0&&<span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
// //                     </span>
// //                     <div className="flex gap-2">
// //                       {notifs.length>0&&(
// //                         <>
// //                           <button onClick={markAllRead} className="text-xs text-green-600 hover:underline">Mark all read</button>
// //                           <button onClick={clearNotifs} className="text-xs text-red-500 hover:underline">Clear</button>
// //                         </>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <div className="flex border-b smm-border">
// //                       <button
// //                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===0?"border-b-2 border-green-500 text-green-600":"smm-text-muted hover:smm-text-primary"}`}
// //                         onClick={()=>setNotifTab(0)}
// //                       >
// //                         All Notifications {unreadCount>0&&<span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">{unreadCount}</span>}
// //                       </button>
// //                       <button
// //                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===1?"border-b-2 border-orange-500 text-orange-600":"smm-text-muted hover:smm-text-primary"}`}
// //                         onClick={()=>setNotifTab(1)}
// //                       >
// //                         GD Tasks Done {completedGDCount>0&&<span className="ml-1 bg-orange-500 text-white text-[9px] px-1 py-0.5 rounded-full">{completedGDCount}</span>}
// //                       </button>
// //                     </div>
// //                     <div className="max-h-[400px] overflow-y-auto">
// //                       {notifTab===0?(
// //                         notifs.length===0?(
// //                           <div className="px-4 py-8 text-center smm-text-muted">
// //                             <BellOff className="w-8 h-8 mx-auto mb-2 opacity-30"/>
// //                             <p className="text-sm">No notifications</p>
// //                           </div>
// //                         ):notifs.map(n=>(
// //                           <div key={n.id} className={`smm-notif-item flex items-start gap-3 px-4 py-3 border-b last:border-b-0 smm-border transition ${!n.read?"smm-notif-unread":""}`}>
// //                             <span className="text-base shrink-0 mt-0.5">{notifIcon(n.type)}</span>
// //                             <div className="flex-1 min-w-0">
// //                               <div className="flex items-start justify-between gap-1">
// //                                 <p className="text-xs font-semibold smm-text-primary leading-tight">{n.title}</p>
// //                                 <button onClick={()=>deleteNotif(n.id)} className="text-slate-300 hover:text-red-400 shrink-0"><X className="w-3 h-3"/></button>
// //                               </div>
// //                               <p className="text-xs smm-text-muted mt-0.5 leading-snug">{n.message}</p>
// //                               <div className="flex items-center justify-between mt-1.5">
// //                                 <span className="text-[10px] smm-text-muted">{new Date(n.timestamp).toLocaleString("en-IN",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</span>
// //                                 {n.action&&(
// //                                   <button onClick={()=>{setView(n.action!.view);setNotifOpen(false);}} className="text-[10px] text-green-600 font-medium hover:underline">
// //                                     {n.action.label} →
// //                                   </button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))
// //                       ):(
// //                         completedGDCount===0?(
// //                           <div className="px-4 py-8 text-center smm-text-muted">
// //                             <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30"/>
// //                             <p className="text-sm">No completed GD tasks pending review</p>
// //                           </div>
// //                         ):gdTasks.filter(t=>t.status==="completed").map(task=>(
// //                           <div key={task.id} className="px-4 py-4 border-b last:border-b-0 smm-border bg-orange-50/50 dark:bg-orange-900/10">
// //                             <div className="flex items-start justify-between gap-2 mb-2">
// //                               <div className="flex-1 min-w-0">
// //                                 <p className="text-xs font-bold smm-text-primary leading-tight flex items-center gap-1">
// //                                   <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0"/>
// //                                   {task.title}
// //                                 </p>
// //                                 <p className="text-[11px] smm-text-muted mt-0.5">Designer: <strong>{task.gdName}</strong></p>
// //                                 <p className="text-[11px] smm-text-muted">Client: <strong>{task.clientName}</strong></p>
// //                                 <p className="text-[11px] smm-text-muted">Platform: {task.platform} · Due: {task.deadline}</p>
// //                                 {task.description&&<p className="text-[11px] smm-text-muted mt-1 line-clamp-2 italic">{task.description}</p>}
// //                               </div>
// //                               <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium shrink-0">Done</span>
// //                             </div>
// //                             <div className="flex gap-2 mt-2">
// //                               <button
// //                                 onClick={()=>handleGDTaskApproveReject(task.id,"approve")}
// //                                 className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition"
// //                               ><CheckCircle2 className="w-3 h-3"/>Approve</button>
// //                               <button
// //                                 onClick={()=>handleGDTaskApproveReject(task.id,"reject")}
// //                                 className="flex-1 flex items-center justify-center gap-1 text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md font-medium transition"
// //                               ><X className="w-3 h-3"/>Reject</button>
// //                             </div>
// //                           </div>
// //                         ))
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </header>

// //         <div className="p-6">

// //           {/* ── OVERVIEW ── */}
// //           {view==="overview"&&(
// //             <div className="space-y-6">
// //               {postsError&&(
// //                 <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200">
// //                   <AlertCircle className="w-4 h-4 shrink-0"/>{postsError}
// //                 </div>
// //               )}

// //               {smmDashData?.designStats&&(
// //                 <div>
// //                   <h3 className="font-semibold smm-text-muted mb-3 text-sm uppercase tracking-wide">Design Projects</h3>
// //                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //                     {[
// //                       {label:"Total",        value:smmDashData.designStats.totalProjects??0,       border:"border-l-slate-400"},
// //                       {label:"Pending",      value:smmDashData.designStats.pendingProjects??0,     border:"border-l-yellow-400"},
// //                       {label:"In Progress",  value:smmDashData.designStats.inProgressProjects??0,  border:"border-l-blue-400"},
// //                       {label:"Under Review", value:smmDashData.designStats.underReviewProjects??0, border:"border-l-purple-400"},
// //                       {label:"Revision",     value:smmDashData.designStats.revisionProjects??0,    border:"border-l-orange-400"},
// //                       {label:"Completed",    value:smmDashData.designStats.completedProjects??0,   border:"border-l-green-400"},
// //                       {label:"Overdue",      value:smmDashData.designStats.overdueProjects??0,     border:"border-l-red-400"},
// //                       {label:"Due Today",    value:smmDashData.designStats.dueTodayProjects??0,    border:"border-l-pink-400"},
// //                     ].map(s=>(
// //                       <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.border} cursor-pointer hover:shadow-md transition`} onClick={()=>setView("design_projects")}>
// //                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// //                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //                 {[
// //                   {label:"Total Posts",        value:overviewLoading?"…":ovTotal,     icon:PenSquare,   color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30",    onClick:()=>setView("queue")},
// //                   {label:"Published",          value:overviewLoading?"…":ovPublished, icon:Globe,       color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30",  onClick:()=>setView("published")},
// //                   {label:"Scheduled / Queued", value:overviewLoading?"…":ovScheduled, icon:Clock,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30",onClick:()=>setView("queue")},
// //                   {label:"Failed",             value:overviewLoading?"…":ovFailed,    icon:AlertCircle, color:"text-red-500",    bg:"bg-red-50 dark:bg-red-900/30",      onClick:()=>setView("published")},
// //                 ].map(s=>(
// //                   <Card key={s.label} className="smm-card p-5 cursor-pointer hover:shadow-md transition" onClick={s.onClick}>
// //                     <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
// //                     <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// //                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// //                   </Card>
// //                 ))}
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <Card className="smm-card p-5 border-l-4 border-l-purple-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("queue")}>
// //                   <div className="flex items-center justify-between">
// //                     <div><div className="text-sm font-semibold smm-text-primary">Queue</div><div className="text-xs smm-text-muted mt-0.5">Posts waiting to publish</div></div>
// //                     <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"><Inbox className="w-5 h-5 text-purple-600"/></div>
// //                   </div>
// //                   <div className="text-2xl font-bold smm-text-primary mt-3">{queuedPosts.length}</div>
// //                 </Card>
// //                 <Card className="smm-card p-5 border-l-4 border-l-yellow-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("drafts")}>
// //                   <div className="flex items-center justify-between">
// //                     <div><div className="text-sm font-semibold smm-text-primary">Drafts</div><div className="text-xs smm-text-muted mt-0.5">Saved, not published yet</div></div>
// //                     <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-yellow-600"/></div>
// //                   </div>
// //                   <div className="text-2xl font-bold smm-text-primary mt-3">{drafts.length}</div>
// //                 </Card>
// //                 <Card className="smm-card p-5 border-l-4 border-l-green-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("compose")}>
// //                   <div className="flex items-center justify-between">
// //                     <div><div className="text-sm font-semibold smm-text-primary">Create Post</div><div className="text-xs smm-text-muted mt-0.5">New post, schedule or draft</div></div>
// //                     <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><PenSquare className="w-5 h-5 text-green-600"/></div>
// //                   </div>
// //                   <div className="text-sm text-green-600 font-medium mt-3">→ Create now</div>
// //                 </Card>
// //               </div>

// //               <Card className="smm-card p-6">
// //                 <h3 className="font-semibold smm-text-primary mb-3">Recent Posts</h3>
// //                 {postsLoading?(
// //                   <div className="flex items-center gap-2 smm-text-muted py-4"><Loader2 className="w-4 h-4 animate-spin"/>Loading...</div>
// //                 ):posts.length===0?(
// //                   <p className="text-sm smm-text-muted">No posts yet. <button onClick={()=>setView("compose")} className="text-green-600 hover:underline">Create your first post →</button></p>
// //                 ):(
// //                   <div className="space-y-2">
// //                     {posts.slice(0,6).map(p=>(
// //                       <div key={p._id??p.id} className="flex items-center gap-3 p-3 rounded-lg border smm-border hover:smm-bg-hover">
// //                         <div className="flex-1 min-w-0">
// //                           <p className="text-sm smm-text-primary truncate">{p.content}</p>
// //                           <div className="flex gap-2 mt-1 flex-wrap">
// //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// //                             {p.platforms?.slice(0,2).map(pl=><span key={pl} className="text-xs smm-text-muted capitalize">{pl}</span>)}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Card>
// //             </div>
// //           )}

// //           {/* ── COMPOSE ── */}
// //           {view==="compose"&&(
// //             <div className="max-w-2xl space-y-5">
// //               {editingDraft&&(
// //                 <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 px-4 py-2.5 rounded-lg border border-yellow-200 dark:border-yellow-700">
// //                   <Edit2 className="w-4 h-4"/>Editing a draft
// //                 </div>
// //               )}
// //               <Card className="smm-card p-6 space-y-5">

// //                 {/* ── Step 1: Select Client ── */}
// //                 <div>
// //                   <Label className="smm-text-primary font-semibold">Step 1 — Select Client *</Label>
// //                   <select
// //                     value={composeClientId}
// //                     onChange={e => setComposeClientId(e.target.value)}
// //                     className="smm-select mt-2 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //                   >
// //                     <option value="">— Select Client —</option>
// //                     {clientList.map(c => (
// //                       <option key={c.id} value={c.id}>{c.name}{c.email?` (${c.email})`:""}</option>
// //                     ))}
// //                   </select>
// //                   {composeClientId&&(
// //                     <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
// //                       ✓ Post will be created for: <strong>{clientList.find(c=>c.id===composeClientId)?.name}</strong>
// //                     </p>
// //                   )}
// //                 </div>

// //                 {/* ── Step 2: Select Platform (from client's connected channels) ── */}
// //                 <div>
// //                   <Label className="smm-text-primary font-semibold">
// //                     Step 2 — Select Platform *
// //                     {composeClientId&&<span className="ml-2 text-xs font-normal smm-text-muted">(client's connected channels)</span>}
// //                   </Label>
// //                   {!composeClientId?(
// //                     <p className="text-xs smm-text-muted mt-2 italic">Please select a client first to see their connected channels.</p>
// //                   ):clientChannelsFetching?(
// //                     <div className="flex items-center gap-2 smm-text-muted mt-2 text-sm"><Loader2 className="w-4 h-4 animate-spin"/>Loading channels...</div>
// //                   ):clientConnectedChannels.length===0?(
// //                     <div className="mt-2 space-y-2">
// //                       <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
// //                         ⚠️ This client has no connected channels yet.{" "}
// //                         <button onClick={()=>setView("channels")} className="font-semibold underline">
// //                           Go to Channels to connect
// //                         </button>
// //                       </p>
// //                       {/* Fallback: allow manual platform selection */}
// //                       <p className="text-xs smm-text-muted">Or select platform manually:</p>
// //                       <div className="flex flex-wrap gap-2">
// //                         {PLATFORMS.map(p=>(
// //                           <button key={p.id} type="button" onClick={()=>togglePlat(p.id)}
// //                             className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${composePlatforms.includes(p.id)?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
// //                             {p.label}
// //                           </button>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   ):(
// //                     <div className="mt-2 space-y-2">
// //                       <div className="flex flex-wrap gap-2">
// //                         {clientConnectedChannels.map(ch=>{
// //                           const platId = ch.platform?.toLowerCase();
// //                           const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===platId);
// //                           const channelId = ch._id??ch.id??platId;
// //                           const isSelected = composePlatforms.includes(platId);
// //                           return(
// //                             <button key={channelId} type="button"
// //                               onClick={()=>togglePlat(platId)}
// //                               className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${isSelected?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
// //                               <span>{platInfo?.icon??"🔗"}</span>
// //                               <span className="capitalize">{platInfo?.label??ch.platform}</span>
// //                               {(ch.username||ch.name)&&(
// //                                 <span className={`text-xs ${isSelected?"text-white/80":"smm-text-muted"}`}>
// //                                   @{ch.username??ch.name}
// //                                 </span>
// //                               )}
// //                             </button>
// //                           );
// //                         })}
// //                       </div>
// //                       <p className="text-xs smm-text-muted">
// //                         {composePlatforms.length} platform{composePlatforms.length!==1?"s":""} selected
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* ── Step 3: Content ── */}
// //                 <div>
// //                   <Label className="smm-text-primary font-semibold">Step 3 — Content *</Label>
// //                   <textarea value={composeContent} onChange={e=>setComposeContent(e.target.value)}
// //                     placeholder="Write your post here..." rows={6} maxLength={2000}
// //                     className="smm-textarea mt-2 w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// //                   <div className="text-xs smm-text-muted text-right mt-1">{composeContent.length}/2000</div>
// //                 </div>

// //                 {/* ── Step 4: Schedule (optional) ── */}
// //                 <div>
// //                   <Label className="smm-text-primary font-semibold">Step 4 — Schedule Date (optional)</Label>
// //                   <p className="text-xs smm-text-muted mb-2">Leave empty for instant post (will show in queue for 5 minutes)</p>
// //                   <Input type="date" value={composeScheduleDate} onChange={e=>setComposeScheduleDate(e.target.value)}
// //                     min={new Date().toISOString().slice(0,10)} className="smm-input"/>
// //                 </div>
// //                 {composeScheduleDate&&(
// //                   <div>
// //                     <Label className="smm-text-primary">Schedule Time</Label>
// //                     <Input type="time" value={composeScheduleTime} onChange={e=>setComposeScheduleTime(e.target.value)} className="smm-input mt-2"/>
// //                     <p className="text-xs smm-text-muted mt-1">
// //                       {composeScheduleTime
// //                         ? `✅ Will publish on ${composeScheduleDate} at ${composeScheduleTime}`
// //                         : "Leave time empty to schedule at midnight"}
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* Tags */}
// //                 <div>
// //                   <Label className="smm-text-primary">Tags (optional)</Label>
// //                   <div className="mt-2">
// //                     <div className="flex flex-wrap gap-1.5 mb-2">
// //                       {composeTags.map(tag=>(
// //                         <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
// //                           #{tag}
// //                           <button type="button" onClick={()=>setComposeTags(p=>p.filter(t=>t!==tag))} className="hover:text-red-500">
// //                             <X className="w-3 h-3"/>
// //                           </button>
// //                         </span>
// //                       ))}
// //                     </div>
// //                     <Input value={composeTagInput} onChange={e=>setComposeTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
// //                       placeholder="Type a tag and press Enter" className="smm-input text-sm"/>
// //                   </div>
// //                 </div>

// //                 {/* Media */}
// //                 <div>
// //                   <Label className="smm-text-primary">Image / Video (optional)</Label>
// //                   {composePreview?(
// //                     <div className="relative mt-2 inline-block">
// //                       <img src={composePreview} alt="preview" className="max-h-40 rounded-lg border smm-border"/>
// //                       <button type="button" onClick={()=>{setComposePreview(null);setComposeMedia(null);}}
// //                         className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
// //                     </div>
// //                   ):(
// //                     <label className="smm-upload-area mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer text-sm smm-text-muted">
// //                       🖼 Upload image or video
// //                       <input type="file" accept="image/*,video/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f){setComposeMedia(f);setComposePreview(URL.createObjectURL(f));}}}/>
// //                     </label>
// //                   )}
// //                 </div>

// //                 {/* Actions */}
// //                 <div className="flex gap-3 flex-wrap pt-2 border-t smm-border">
// //                   <Button variant="outline" onClick={()=>handleCompose("draft")} disabled={composeSaving} className="smm-btn-outline">
// //                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
// //                     <FileText className="w-4 h-4 mr-2"/>{editingDraft?"Update Draft":"Save as Draft"}
// //                   </Button>
// //                   <Button className="bg-purple-600 hover:bg-purple-700" onClick={()=>handleCompose("queue")} disabled={composeSaving}>
// //                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
// //                     <Inbox className="w-4 h-4 mr-2"/>
// //                     {composeScheduleDate?"Schedule Post":"Add to Queue (Instant)"}
// //                   </Button>
// //                 </div>
// //               </Card>
// //             </div>
// //           )}

// //           {/* ── QUEUE ── */}
// //           {view==="queue"&&(
// //             <div className="space-y-4">
// //               <div className="flex items-center justify-between">
// //                 <p className="text-sm smm-text-muted">Posts in queue — instant posts auto-publish in 5 minutes</p>
// //                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// //                   <Plus className="w-4 h-4 mr-1"/>New Post
// //                 </Button>
// //               </div>
// //               {queueLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):queuedPosts.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary font-medium">Queue is empty</p>
// //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// //                     <Plus className="w-4 h-4 mr-2"/>Create Post
// //                   </Button>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {queuedPosts.map(p=>{
// //                     const pid=p._id??p.id??"";
// //                     const timeLeft = queueTimeLeft(p);
// //                     const isScheduled = !!(p.scheduleAt??p.scheduled_at);
// //                     return(
// //                       <Card key={pid} className="smm-card p-5">
// //                         <div className="flex items-start justify-between gap-4 flex-wrap">
// //                           <div className="flex-1 min-w-0">
// //                             <div className="flex items-center gap-2 mb-2 flex-wrap">
// //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// //                               {isScheduled?(
// //                                 <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
// //                                   📅 Scheduled
// //                                 </span>
// //                               ):(
// //                                 <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium animate-pulse">
// //                                   ⚡ Instant
// //                                 </span>
// //                               )}
// //                               {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// //                             </div>
// //                             <p className="text-sm smm-text-primary">{p.content}</p>
// //                             {isScheduled?(
// //                               <p className="text-xs smm-text-muted mt-2 flex items-center gap-1">
// //                                 <Clock className="w-3 h-3"/>
// //                                 Scheduled: {new Date(p.scheduleAt??p.scheduled_at??"").toLocaleString("en-IN")}
// //                               </p>
// //                             ):timeLeft?(
// //                               <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
// //                                 <Clock className="w-3 h-3"/>{timeLeft}
// //                               </p>
// //                             ):null}
// //                           </div>
// //                           <Button size="sm" className="bg-green-600 hover:bg-green-700 shrink-0" onClick={()=>handlePublishNow(pid)} disabled={publishingId===pid}>
// //                             {publishingId===pid?<Loader2 className="w-4 h-4 animate-spin"/>:<><CheckCircle2 className="w-4 h-4 mr-1"/>Publish Now</>}
// //                           </Button>
// //                         </div>
// //                       </Card>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── DRAFTS ── */}
// //           {view==="drafts"&&(
// //             <div className="space-y-4">
// //               <p className="text-sm smm-text-muted">Saved drafts — edit or add to queue</p>
// //               {draftsLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):drafts.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary font-medium">No drafts found</p>
// //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
// //                     <Plus className="w-4 h-4 mr-2"/>Create Post
// //                   </Button>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {drafts.map(d=>{const did=d._id??d.id??"";return(
// //                     <Card key={did} className="smm-card p-5">
// //                       <div className="flex items-start justify-between gap-4 flex-wrap">
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-center gap-2 mb-2 flex-wrap">
// //                             <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">Draft</span>
// //                             {d.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// //                           </div>
// //                           <p className="text-sm smm-text-primary line-clamp-3">{d.content}</p>
// //                           {d.createdAt&&<p className="text-xs smm-text-muted mt-2">Saved: {new Date(d.createdAt).toLocaleString("en-IN")}</p>}
// //                         </div>
// //                         <div className="flex gap-2 shrink-0">
// //                           <Button size="sm" variant="outline" onClick={()=>handleEditDraft(d)} className="smm-btn-outline">
// //                             <Edit2 className="w-4 h-4 mr-1"/>Edit
// //                           </Button>
// //                           <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDraft(did)} disabled={deletingDid===did}>
// //                             {deletingDid===did?<Loader2 className="w-4 h-4 animate-spin"/>:<Trash2 className="w-4 h-4"/>}
// //                           </Button>
// //                         </div>
// //                       </div>
// //                     </Card>
// //                   );})}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── PUBLISHED ── */}
// //           {view==="published"&&(
// //             <div className="space-y-4">
// //               <div className="flex items-center justify-between">
// //                 <p className="text-sm smm-text-muted">Record of all published posts</p>
// //                 <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
// //                   <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
// //                 </Button>
// //               </div>
// //               {pubLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):pubPosts.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary font-medium">No published posts yet</p>
// //                   <p className="text-xs smm-text-muted mt-1">Posts published from the queue will appear here</p>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {pubPosts.map(p=>{const pid=p._id??p.id??"";return(
// //                     <Card key={pid} className="smm-card p-5">
// //                       <div className="flex items-start gap-4">
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-center gap-2 mb-2 flex-wrap">
// //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
// //                             {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
// //                           </div>
// //                           <p className="text-sm smm-text-primary">{p.content}</p>
// //                           {p.createdAt&&<p className="text-xs smm-text-muted mt-2 flex items-center gap-1"><Globe className="w-3 h-3"/>Published: {new Date(p.createdAt).toLocaleString("en-IN")}</p>}
// //                         </div>
// //                       </div>
// //                     </Card>
// //                   );})}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── CHANNELS ── */}
// //           {view==="channels"&&(
// //             <div className="space-y-8">

// //               {/* ── My Agency Channels ── */}
// //               <div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
// //                     <LinkIcon className="w-4 h-4 text-green-600"/>
// //                   </div>
// //                   <div>
// //                     <h2 className="text-base font-bold smm-text-primary">My Agency Channels</h2>
// //                     <p className="text-xs smm-text-muted">Your own connected social accounts</p>
// //                   </div>
// //                 </div>
// //                 {channelsLoading?(
// //                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //                 ):(
// //                   <>
// //                     {channels.length>0&&(
// //                       <div className="space-y-3 mb-4">
// //                         {channels.map(ch=>{
// //                           const cid=ch._id??ch.id??"";
// //                           const platInfo=CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
// //                           return(
// //                             <Card key={cid} className="smm-card p-4 flex items-center justify-between gap-4">
// //                               <div className="flex items-center gap-3">
// //                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>{platInfo?.icon??"🔗"}</div>
// //                                 <div>
// //                                   <div className="text-sm font-semibold smm-text-primary capitalize">{ch.platform}</div>
// //                                   <div className="text-xs smm-text-muted">{ch.username??ch.name??"Connected"}</div>
// //                                 </div>
// //                               </div>
// //                               <div className="flex items-center gap-2">
// //                                 <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">Connected</span>
// //                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDisconnect(cid)} disabled={disconnectingId===cid}>
// //                                   {disconnectingId===cid?<Loader2 className="w-4 h-4 animate-spin"/>:"Disconnect"}
// //                                 </Button>
// //                               </div>
// //                             </Card>
// //                           );
// //                         })}
// //                       </div>
// //                     )}
// //                     <div>
// //                       <h4 className="text-sm font-semibold smm-text-primary mb-3">Connect a New Account</h4>
// //                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                         {CONNECTABLE_PLATFORMS.map(p=>{
// //                           const isConnected=channels.some(ch=>ch.platform?.toLowerCase()===p.id);
// //                           return(
// //                             <Card key={p.id} className={`smm-card p-4 flex items-center justify-between gap-3 ${isConnected?"opacity-60":""}`}>
// //                               <div className="flex items-center gap-2">
// //                                 <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base bg-gradient-to-br ${p.color}`}>{p.icon}</span>
// //                                 <div className="text-sm font-medium smm-text-primary">{p.label}</div>
// //                               </div>
// //                               <Button size="sm"
// //                                 className={isConnected?"bg-slate-400 cursor-not-allowed":"bg-green-600 hover:bg-green-700"}
// //                                 onClick={()=>!isConnected&&handleConnect(p.id)}
// //                                 disabled={connectingPlatform===p.id||isConnected}>
// //                                 {connectingPlatform===p.id?<Loader2 className="w-4 h-4 animate-spin"/>:isConnected?"✓ Connected":"Connect"}
// //                               </Button>
// //                             </Card>
// //                           );
// //                         })}
// //                       </div>
// //                     </div>
// //                   </>
// //                 )}
// //               </div>

// //               {/* ── Client Channels ── */}
// //               <div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
// //                     <Users className="w-4 h-4 text-blue-600"/>
// //                   </div>
// //                   <div>
// //                     <h2 className="text-base font-bold smm-text-primary">Client Channels</h2>
// //                     <p className="text-xs smm-text-muted">Manage social accounts for each client — connect platforms on their behalf</p>
// //                   </div>
// //                 </div>
// //                 {clientChannelsLoading?(
// //                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading client channels...</div>
// //                 ):clientList.length===0?(
// //                   <Card className="smm-card p-8 text-center">
// //                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// //                     <p className="text-sm smm-text-muted">No clients found. Clients appear once design projects are loaded.</p>
// //                     <Button variant="outline" size="sm" className="mt-3 smm-btn-outline" onClick={()=>{loadUsersForDropdowns().then(()=>loadClientsWithChannels());}}>
// //                       <RefreshCw className="w-4 h-4 mr-1"/>Load Clients
// //                     </Button>
// //                   </Card>
// //                 ):(
// //                   <div className="space-y-4">
// //                     {(clientsWithChannels.length > 0 ? clientsWithChannels : clientList.map(c=>({...c,channels:[]}))).map(client=>(
// //                       <Card key={client.id} className="smm-card p-5">
// //                         {/* Client header */}
// //                         <div className="flex items-center gap-3 mb-4">
// //                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
// //                             <span className="text-sm font-bold text-blue-600">{client.name.charAt(0).toUpperCase()}</span>
// //                           </div>
// //                           <div>
// //                             <div className="font-semibold smm-text-primary text-sm">{client.name}</div>
// //                             {client.email&&<div className="text-xs smm-text-muted">{client.email}</div>}
// //                           </div>
// //                           <div className="ml-auto">
// //                             {(client as ClientWithChannels).channels?.length > 0 ? (
// //                               <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
// //                                 {(client as ClientWithChannels).channels.length} connected
// //                               </span>
// //                             ):(
// //                               <span className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full">
// //                                 No channels
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>

// //                         {/* Connected channels for this client */}
// //                         {(client as ClientWithChannels).channels?.length > 0 && (
// //                           <div className="mb-4">
// //                             <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connected Accounts</p>
// //                             <div className="space-y-2">
// //                               {(client as ClientWithChannels).channels.map(ch=>{
// //                                 const chId = ch._id??ch.id??"";
// //                                 const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
// //                                 return(
// //                                   <div key={chId} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border smm-border bg-slate-50/50 dark:bg-slate-800/30">
// //                                     <div className="flex items-center gap-2">
// //                                       <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>
// //                                         {platInfo?.icon??"🔗"}
// //                                       </span>
// //                                       <div>
// //                                         <div className="text-xs font-medium smm-text-primary capitalize">{platInfo?.label??ch.platform}</div>
// //                                         {(ch.username||ch.name)&&<div className="text-[10px] smm-text-muted">@{ch.username??ch.name}</div>}
// //                                       </div>
// //                                     </div>
// //                                     <div className="flex items-center gap-2">
// //                                       <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium">✓ Connected</span>
// //                                       <button
// //                                         onClick={()=>handleDisconnectClientChannel(chId, client.id)}
// //                                         className="text-[10px] text-red-500 hover:underline px-1"
// //                                       >Disconnect</button>
// //                                     </div>
// //                                   </div>
// //                                 );
// //                               })}
// //                             </div>
// //                           </div>
// //                         )}

// //                         {/* Connect new platform for this client */}
// //                         <div>
// //                           <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connect Platform</p>
// //                           <div className="flex flex-wrap gap-2">
// //                             {CONNECTABLE_PLATFORMS.map(plat=>{
// //                               const key=`${client.id}_${plat.id}`;
// //                               const isLoading=connectingForClient===key;
// //                               const isAlreadyConnected=(client as ClientWithChannels).channels?.some(ch=>ch.platform?.toLowerCase()===plat.id);
// //                               return(
// //                                 <Button key={plat.id} size="sm" variant="outline"
// //                                   className={`text-xs gap-1.5 ${isAlreadyConnected?"opacity-50 cursor-not-allowed smm-btn-outline":"smm-btn-outline hover:border-blue-500 hover:text-blue-600"}`}
// //                                   onClick={()=>!isAlreadyConnected&&handleConnectForClient(plat.id, client.id)}
// //                                   disabled={isLoading||isAlreadyConnected}>
// //                                   {isLoading?<Loader2 className="w-3 h-3 animate-spin"/>:<span>{plat.icon}</span>}
// //                                   {isAlreadyConnected?"✓ "+plat.label:plat.label}
// //                                 </Button>
// //                               );
// //                             })}
// //                           </div>
// //                         </div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* ── CLIENTS & GD ── */}
// //           {view==="clients_gd"&&(
// //             <div className="space-y-8">
// //               {/* Clients Section */}
// //               <div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
// //                     <Users className="w-4 h-4 text-blue-600"/>
// //                   </div>
// //                   <div>
// //                     <h2 className="text-base font-bold smm-text-primary">Clients</h2>
// //                     <p className="text-xs smm-text-muted">{clientList.length} client(s)</p>
// //                   </div>
// //                 </div>
// //                 {clientList.length===0?(
// //                   <Card className="smm-card p-8 text-center">
// //                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// //                     <p className="text-sm smm-text-muted">No clients found. They will appear once design projects are loaded.</p>
// //                   </Card>
// //                 ):(
// //                   <div className="space-y-2">
// //                     {clientList.map(c=>(
// //                       <Card key={c.id} className="smm-card p-4 flex items-center gap-3">
// //                         <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
// //                           <span className="text-sm font-bold text-blue-600">{c.name.charAt(0).toUpperCase()}</span>
// //                         </div>
// //                         <div>
// //                           <div className="font-semibold smm-text-primary text-sm">{c.name}</div>
// //                           {c.email&&<div className="text-xs smm-text-muted">{c.email}</div>}
// //                         </div>
// //                         <Button size="sm" variant="outline" className="ml-auto smm-btn-outline text-xs" onClick={()=>setView("channels")}>
// //                           <LinkIcon className="w-3 h-3 mr-1"/>Manage Channels
// //                         </Button>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Graphic Designers Section */}
// //               <div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
// //                     <Palette className="w-4 h-4 text-purple-600"/>
// //                   </div>
// //                   <div>
// //                     <h2 className="text-base font-bold smm-text-primary">Graphic Designers</h2>
// //                     <p className="text-xs smm-text-muted">{gdList.length} designer(s)</p>
// //                   </div>
// //                 </div>
// //                 {gdList.length===0?(
// //                   <Card className="smm-card p-8 text-center">
// //                     <Palette className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
// //                     <p className="text-sm smm-text-muted">No graphic designers found. They appear once design projects are loaded.</p>
// //                   </Card>
// //                 ):(
// //                   <div className="space-y-2">
// //                     {gdList.map(g=>(
// //                       <Card key={g.id} className="smm-card p-4 flex items-center gap-3">
// //                         <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center shrink-0">
// //                           <span className="text-sm font-bold text-purple-600">{g.name.charAt(0).toUpperCase()}</span>
// //                         </div>
// //                         <div>
// //                           <div className="font-semibold smm-text-primary text-sm">{g.name}</div>
// //                           {g.email&&<div className="text-xs smm-text-muted">{g.email}</div>}
// //                         </div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* ── CALENDAR ── */}
// //           {view==="calendar"&&(
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-2">
// //                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()-1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">←</button>
// //                 <span className="font-semibold smm-text-primary min-w-[160px] text-center">{monthNames[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
// //                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()+1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">→</button>
// //                 <Button size="sm" variant="outline" onClick={()=>setCalMonth(new Date())} className="smm-btn-outline">Today</Button>
// //                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}><Plus className="w-3 h-3 mr-1"/>New Post</Button>
// //               </div>
// //               <Card className="smm-card overflow-hidden">
// //                 <div className="grid grid-cols-7 border-b smm-border smm-cal-header">
// //                   {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
// //                     <div key={d} className="p-3 text-xs font-semibold smm-text-muted text-center uppercase tracking-wide">{d}</div>
// //                   ))}
// //                 </div>
// //                 <div className="grid grid-cols-7">
// //                   {calDays.map((d,i)=>{
// //                     const dp=d?postsForDay(d):[];
// //                     const today=d?d.toDateString()===new Date().toDateString():false;
// //                     return(
// //                       <div key={i} className="min-h-[100px] border-r border-b smm-border p-2 last:border-r-0">
// //                         {d&&(
// //                           <>
// //                             <div className={`text-xs font-medium mb-1 inline-flex items-center justify-center w-6 h-6 rounded-full ${today?"bg-green-600 text-white":"smm-text-muted"}`}>{d.getDate()}</div>
// //                             <div className="space-y-1">
// //                               {dp.slice(0,2).map(p=>(
// //                                 <div key={p._id??p.id} className={`text-xs px-2 py-1 rounded truncate ${statusBadge(p.status)}`}>{p.content.slice(0,20)}…</div>
// //                               ))}
// //                               {dp.length>2&&<div className="text-xs smm-text-muted px-1">+{dp.length-2} more</div>}
// //                             </div>
// //                           </>
// //                         )}
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </Card>
// //             </div>
// //           )}

// //           {/* ── GD TASKS ── */}
// //           {view==="gd_tasks"&&(
// //             <div className="space-y-4">
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //                 {[
// //                   {label:"Pending",        count:taskCounts.pending,     color:"border-l-slate-400"},
// //                   {label:"In Progress",    count:taskCounts.in_progress, color:"border-l-blue-400"},
// //                   {label:"Needs Revision", count:taskCounts.revision,    color:"border-l-orange-400"},
// //                   {label:"Completed",      count:taskCounts.completed,   color:"border-l-green-400"},
// //                 ].map(s=>(
// //                   <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.color}`}>
// //                     <div className="text-2xl font-bold smm-text-primary">{s.count}</div>
// //                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// //                   </Card>
// //                 ))}
// //               </div>
// //               {gdTasks.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <FileImage className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary">No tasks yet. Click "Assign Task to GD" to get started.</p>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {gdTasks.map(task=>(
// //                     <Card key={task.id} className="smm-card p-5">
// //                       <div className="flex items-start justify-between gap-4 flex-wrap">
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-center gap-2 flex-wrap mb-1">
// //                             <h3 className="font-semibold smm-text-primary">{task.title}</h3>
// //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status==="completed"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":task.status==="revision"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":task.status==="in_progress"?"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300":"bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}>
// //                               {task.status.replace("_"," ")}
// //                             </span>
// //                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.priority==="high"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":task.priority==="medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
// //                               {task.priority}
// //                             </span>
// //                           </div>
// //                           <p className="text-sm smm-text-muted mb-2">{task.description}</p>
// //                           <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap">
// //                             <span>Client: <strong className="smm-text-secondary">{task.clientName}</strong></span>
// //                             {task.gdName&&<span>Designer: <strong className="smm-text-secondary">{task.gdName}</strong></span>}
// //                             <span>Platform: <strong className="smm-text-secondary">{task.platform}</strong></span>
// //                             <span>Due: <strong className="smm-text-secondary">{task.deadline}</strong></span>
// //                           </div>
// //                           {task.status==="revision"&&task.revisionComment&&(
// //                             <div className="mt-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-800">
// //                               Revision note: {task.revisionComment}
// //                             </div>
// //                           )}
// //                         </div>
// //                         {task.status==="completed"&&(
// //                           <div className="flex flex-col gap-2">
// //                             <Button size="sm" variant="outline" className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
// //                               onClick={()=>{const c=prompt("Revision comment:");if(c)handleRevision(task.id,c);}}>
// //                               Request Revision
// //                             </Button>
// //                             <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={()=>handleGDTaskApproveReject(task.id,"approve")}>
// //                               <CheckCircle2 className="w-3 h-3 mr-1"/>Approve
// //                             </Button>
// //                             <Button size="sm" variant="outline" className="text-xs text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
// //                               onClick={()=>handleGDTaskApproveReject(task.id,"reject")}>
// //                               Reject
// //                             </Button>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </Card>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── DESIGN PROJECTS ── */}
// //           {view==="design_projects"&&(
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-3 flex-wrap">
// //                 <select value={designFilter} onChange={e=>{setDesignFilter(e.target.value);setTimeout(()=>loadDesignProjects(),0);}}
// //                   className="smm-select px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                   <option value="">All Status</option>
// //                   {["Pending","In Progress","Under Review","Revision","Completed","Cancelled"].map(s=>(
// //                     <option key={s} value={s}>{s}</option>
// //                   ))}
// //                 </select>
// //                 <Button size="sm" variant="outline" onClick={loadDesignProjects} disabled={designLoading} className="smm-btn-outline">
// //                   <RefreshCw className={`w-4 h-4 mr-1 ${designLoading?"animate-spin":""}`}/>Refresh
// //                 </Button>
// //               </div>
// //               {designLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):designProjects.length===0?(
// //                 <Card className="smm-card p-12 text-center">
// //                   <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
// //                   <p className="smm-text-secondary font-medium">No design projects found</p>
// //                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setShowAddDesign(true)}>
// //                     <Plus className="w-4 h-4 mr-2"/>New Design Project
// //                   </Button>
// //                 </Card>
// //               ):(
// //                 <div className="space-y-3">
// //                   {designProjects.map(p=>{
// //                     const pid=p._id??p.id??"";
// //                     const clientName=typeof p.clientId==="object"?p.clientId?.name:clientList.find(c=>c.id===p.clientId)?.name??"—";
// //                     const designerName=typeof p.designerId==="object"?p.designerId?.name:gdList.find(g=>g.id===p.designerId)?.name??"—";
// //                     const sc:Record<string,string>={
// //                       "Pending":"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
// //                       "In Progress":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
// //                       "Under Review":"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
// //                       "Revision":"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
// //                       "Completed":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
// //                       "Cancelled":"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
// //                     };
// //                     return(
// //                       <Card key={pid} className="smm-card p-5">
// //                         <div className="flex items-start justify-between gap-4 flex-wrap">
// //                           <div className="flex-1 min-w-0">
// //                             <div className="flex items-center gap-2 flex-wrap mb-1">
// //                               <h3 className="font-semibold smm-text-primary">{p.title}</h3>
// //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc[p.status]??"bg-slate-100 text-slate-600"}`}>{p.status}</span>
// //                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.priority==="Urgent"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":p.priority==="High"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":p.priority==="Medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
// //                                 {p.priority}
// //                               </span>
// //                             </div>
// //                             <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap mt-1">
// //                               <span>Type: <strong className="smm-text-secondary">{p.designType}</strong></span>
// //                               <span>Client: <strong className="smm-text-secondary">{clientName}</strong></span>
// //                               <span>Designer: <strong className="smm-text-secondary">{designerName}</strong></span>
// //                               <span>Deadline: <strong className="smm-text-secondary">{p.deadline?.slice(0,10)}</strong></span>
// //                             </div>
// //                             {p.description&&<p className="text-sm smm-text-muted mt-1 truncate">{p.description}</p>}
// //                           </div>
// //                           <div className="flex gap-2 flex-wrap shrink-0">
// //                             <Button size="sm" variant="outline" onClick={()=>openProjectDetail(p)} className="smm-btn-outline">
// //                               <MessageSquare className="w-4 h-4 mr-1"/>Comments
// //                             </Button>
// //                             {p.status==="Under Review"&&(
// //                               <>
// //                                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>handleApproveReject(pid,"approve")}>
// //                                   <CheckCircle2 className="w-4 h-4 mr-1"/>Approve
// //                                 </Button>
// //                                 <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={()=>handleRevisionReq(pid)}>
// //                                   Revision
// //                                 </Button>
// //                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleApproveReject(pid,"reject")}>
// //                                   Reject
// //                                 </Button>
// //                               </>
// //                             )}
// //                             <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDP(pid)}>
// //                               <Trash2 className="w-4 h-4"/>
// //                             </Button>
// //                           </div>
// //                         </div>
// //                       </Card>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ── ANALYTICS ── */}
// //           {view==="analytics"&&(
// //             <div className="space-y-6">
// //               {analyticsLoading?(
// //                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
// //               ):(
// //                 <>
// //                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //                     {[
// //                       {label:"Total Reach",  value:analytics?.reach??       "—", icon:Eye,        color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30"},
// //                       {label:"Impressions",  value:analytics?.impressions?? "—", icon:TrendingUp,  color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30"},
// //                       {label:"Engagement",   value:analytics?.engagement??  "—", icon:Heart,       color:"text-pink-600",   bg:"bg-pink-50 dark:bg-pink-900/30"},
// //                       {label:"Followers",    value:analytics?.followers??   "—", icon:Users,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30"},
// //                     ].map(s=>(
// //                       <Card key={s.label} className="smm-card p-5">
// //                         <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
// //                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
// //                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                   <Card className="smm-card p-6">
// //                     <h3 className="font-semibold smm-text-primary mb-4">Weekly Reach & Engagement</h3>
// //                     {analytics?.weeklyData?.length?(
// //                       <div className="h-64">
// //                         <ResponsiveContainer width="100%" height="100%">
// //                           <LineChart data={weeklyData}>
// //                             <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"}/>
// //                             <XAxis dataKey="day" stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
// //                             <YAxis stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
// //                             <Tooltip contentStyle={{background:dark?"#1e293b":"#fff",border:"1px solid #334155",borderRadius:8}}/>
// //                             <Line type="monotone" dataKey="reach" stroke="#22c55e" strokeWidth={2.5} name="Reach"/>
// //                             <Line type="monotone" dataKey="engagement" stroke="#818cf8" strokeWidth={2.5} name="Engagement"/>
// //                           </LineChart>
// //                         </ResponsiveContainer>
// //                       </div>
// //                     ):(
// //                       <div className="h-32 flex items-center justify-center smm-text-muted text-sm">
// //                         No analytics data available. Connect social accounts first.
// //                       </div>
// //                     )}
// //                   </Card>
// //                 </>
// //               )}
// //             </div>
// //           )}

// //         </div>
// //       </main>

// //       {/* ── Add Design Project Modal ── */}
// //       {showAddDesign&&(
// //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// //           <Card className="smm-modal w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-5">
// //               <h2 className="text-lg font-bold smm-text-primary">New Design Project</h2>
// //               <button onClick={()=>setShowAddDesign(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
// //             </div>
// //             <form onSubmit={handleCreateDP} className="space-y-4">
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Client *</Label>
// //                   <select value={newDP.clientId} onChange={e=>setNewDP(n=>({...n,clientId:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// //                     <option value="">-- Select Client --</option>
// //                     {clientList.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Graphic Designer *</Label>
// //                   <select value={newDP.designerId} onChange={e=>setNewDP(n=>({...n,designerId:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// //                     <option value="">-- Select Designer --</option>
// //                     {gdList.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
// //                   </select>
// //                 </div>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Project Title *</Label>
// //                 <Input value={newDP.title} onChange={e=>setNewDP(n=>({...n,title:e.target.value}))}
// //                   placeholder="e.g. Logo Design for Sharma Enterprises" required className="smm-input mt-1"/>
// //               </div>
// //               <div className="grid grid-cols-3 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Design Type</Label>
// //                   <select value={newDP.designType} onChange={e=>setNewDP(n=>({...n,designType:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                     {["Social Post","Logo","Banner","Brochure","Video Thumbnail","Story","Reel Cover","Other"].map(t=>(
// //                       <option key={t} value={t}>{t}</option>
// //                     ))}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Deadline *</Label>
// //                   <Input type="date" value={newDP.deadline} onChange={e=>setNewDP(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Priority</Label>
// //                   <select value={newDP.priority} onChange={e=>setNewDP(n=>({...n,priority:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                     {["Low","Medium","High","Urgent"].map(p=><option key={p} value={p}>{p}</option>)}
// //                   </select>
// //                 </div>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Description</Label>
// //                 <textarea value={newDP.description} onChange={e=>setNewDP(n=>({...n,description:e.target.value}))} rows={3}
// //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Target Audience</Label>
// //                   <Input value={newDP.targetAudience} onChange={e=>setNewDP(n=>({...n,targetAudience:e.target.value}))} placeholder="e.g. 25-45 professionals" className="smm-input mt-1"/>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Revision Limit</Label>
// //                   <Input type="number" min={1} max={10} value={newDP.revisionLimit} onChange={e=>setNewDP(n=>({...n,revisionLimit:Number(e.target.value)}))} className="smm-input mt-1"/>
// //                 </div>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Brand Colors</Label>
// //                   <Input value={newDP.brandColors} onChange={e=>setNewDP(n=>({...n,brandColors:e.target.value}))} placeholder="#0044CC, #FFFFFF" className="smm-input mt-1"/>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Font Preferences</Label>
// //                   <Input value={newDP.fontPreferences} onChange={e=>setNewDP(n=>({...n,fontPreferences:e.target.value}))} placeholder="Montserrat Bold" className="smm-input mt-1"/>
// //                 </div>
// //               </div>
// //               <div className="flex gap-3 pt-2">
// //                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddDesign(false)}>Cancel</Button>
// //                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={dpSaving}>
// //                   {dpSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}<Send className="w-4 h-4 mr-2"/>Create & Assign
// //                 </Button>
// //               </div>
// //             </form>
// //           </Card>
// //         </div>
// //       )}

// //       {/* ── Comments Modal ── */}
// //       {selProject&&(
// //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// //           <Card className="smm-modal w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-4">
// //               <h2 className="text-lg font-bold smm-text-primary truncate">{selProject.title}</h2>
// //               <button onClick={()=>{setSelProject(null);setProjComments([]);setNewComment("");}} className="smm-text-muted hover:smm-text-primary shrink-0">
// //                 <X className="w-5 h-5"/>
// //               </button>
// //             </div>
// //             <h3 className="text-sm font-semibold smm-text-primary mb-2">Comments</h3>
// //             <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
// //               {projComments.length===0?(
// //                 <p className="text-sm smm-text-muted">No comments yet</p>
// //               ):projComments.map((c:any,i:number)=>(
// //                 <div key={c._id??i} className="text-sm smm-comment px-3 py-2 rounded-lg border smm-border">
// //                   <span className="font-medium smm-text-primary">{c.senderName??c.sender?.name??"User"}: </span>
// //                   <span className="smm-text-secondary">{c.message??c.text}</span>
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="flex gap-2">
// //               <Input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Write a comment..." className="smm-input"
// //                 onKeyDown={e=>{if(e.key==="Enter")handleSendComment();}}/>
// //               <Button onClick={handleSendComment} disabled={commentSending||!newComment.trim()} className="bg-green-600 hover:bg-green-700 shrink-0">
// //                 {commentSending?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}
// //               </Button>
// //             </div>
// //           </Card>
// //         </div>
// //       )}

// //       {/* ── Assign GD Task Modal ── */}
// //       {showAddTask&&(
// //         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
// //           <Card className="smm-modal w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-5">
// //               <h2 className="text-lg font-bold smm-text-primary">Assign Task to Graphic Designer</h2>
// //               <button onClick={()=>setShowAddTask(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
// //             </div>
// //             <form onSubmit={handleAssignTask} className="space-y-4">
// //               <div>
// //                 <Label className="smm-text-primary">Task Title *</Label>
// //                 <Input value={newTask.title} onChange={e=>setNewTask(n=>({...n,title:e.target.value}))} placeholder="e.g. Instagram Story — Summer Sale" required className="smm-input mt-1"/>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Description</Label>
// //                 <textarea value={newTask.description} onChange={e=>setNewTask(n=>({...n,description:e.target.value}))} rows={3}
// //                   placeholder="What should the designer create..."
// //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Client *</Label>
// //                   {clientList.length>0?(
// //                     <select value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))}
// //                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
// //                       <option value="">-- Select Client --</option>
// //                       {clientList.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
// //                     </select>
// //                   ):(
// //                     <Input value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))} placeholder="Client name" required className="smm-input mt-1"/>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Graphic Designer</Label>
// //                   {gdList.length>0?(
// //                     <select value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))}
// //                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                       <option value="">-- Select Designer --</option>
// //                       {gdList.map(g=><option key={g.id} value={g.name}>{g.name}</option>)}
// //                     </select>
// //                   ):(
// //                     <Input value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))} placeholder="Designer name" className="smm-input mt-1"/>
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <Label className="smm-text-primary">Platform</Label>
// //                   <select value={newTask.platform} onChange={e=>setNewTask(n=>({...n,platform:e.target.value}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                     {["Instagram","Facebook","LinkedIn","Twitter/X","YouTube","Pinterest"].map(p=>(
// //                       <option key={p} value={p}>{p}</option>
// //                     ))}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <Label className="smm-text-primary">Priority</Label>
// //                   <select value={newTask.priority} onChange={e=>setNewTask(n=>({...n,priority:e.target.value as Priority}))}
// //                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
// //                     <option value="high">High</option>
// //                     <option value="medium">Medium</option>
// //                     <option value="low">Low</option>
// //                   </select>
// //                 </div>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Deadline *</Label>
// //                 <Input type="date" value={newTask.deadline} onChange={e=>setNewTask(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
// //               </div>
// //               <div>
// //                 <Label className="smm-text-primary">Notes for Designer</Label>
// //                 <textarea value={newTask.notes} onChange={e=>setNewTask(n=>({...n,notes:e.target.value}))} rows={2}
// //                   placeholder="Brand guidelines, colour codes, style references..."
// //                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
// //               </div>
// //               <div className="flex gap-3 pt-2">
// //                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddTask(false)}>Cancel</Button>
// //                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700"><Send className="w-4 h-4 mr-2"/>Assign Task</Button>
// //               </div>
// //             </form>
// //           </Card>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default SMMDashboard;

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./SMMDashboard.css";
// import { Logo } from "@/components/Logo";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import {
//   Megaphone, LogOut, LayoutDashboard, Calendar,
//   PenSquare, BarChart3, FileImage, Plus, X,
//   CheckCircle2, Send, Loader2, AlertCircle,
//   Eye, Heart, TrendingUp, Users, Clock, Inbox,
//   FileText, Globe, Trash2, Edit2, RefreshCw,
//   LinkIcon, Palette, MessageSquare,
//   Bell, BellOff, Moon, Sun,
// } from "lucide-react";
// import {
//   clearSession, getSession,
//   BASE_URL,
//   apiGetPosts, apiCreatePost, apiSaveDraft, apiGetAnalytics,
//   apiGetQueuedPosts, apiGetDrafts, apiUpdateDraft, apiDeleteDraft,
//   apiPublishPost, apiGetOverview, apiGetSocialAccounts,
//   apiGetOAuthUrl, apiDisconnectSocialAccount,
//   apiSMMDashboard, apiSMMGetDesignProjects, apiSMMCreateDesignProject,
//   apiSMMDeleteDesignProject,
//   apiSMMApproveRejectProject, apiSMMRequestRevision,
//   apiSMMGetComments, apiSMMAddComment,
//   apiSMMGetClients, apiSMMGetGraphicDesigners,
//   type Post, type OverviewRes,
// } from "@/lib/api";
// import {
//   LineChart, Line, ResponsiveContainer, Tooltip,
//   XAxis, YAxis, CartesianGrid,
// } from "recharts";

// // ─── Keys ─────────────────────────────────────────────────────────────────────
// const GD_TASKS_KEY  = "socialflow_gd_tasks";
// const DARK_MODE_KEY = "socialflow_dark_mode";
// const NOTIF_KEY     = "socialflow_notifications";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type TaskStatus = "pending" | "in_progress" | "revision" | "completed";
// type Priority   = "high" | "medium" | "low";
// type NotifType  = "success" | "warning" | "error" | "info";
// type SMMView    = "overview"|"compose"|"queue"|"drafts"|"published"|"calendar"|"gd_tasks"|"design_projects"|"analytics"|"channels"|"clients_gd";

// interface GDTask {
//   id: string; title: string; description: string; clientName: string;
//   gdName: string;
//   platform: string; deadline: string; priority: Priority; status: TaskStatus;
//   assignedBy: string; assignedAt: string; notes?: string; revisionComment?: string;
// }

// interface DesignProject {
//   _id?: string; id?: string;
//   title: string; designType: string; priority: string; status: string;
//   deadline: string; description?: string;
//   clientId?: { _id?: string; name?: string } | string;
//   designerId?: { _id?: string; name?: string } | string;
//   revisionInfo?: { used: number; limit: number; remaining: number };
// }

// interface AppNotif {
//   id: string; type: NotifType; title: string; message: string;
//   timestamp: string; read: boolean; action?: { label: string; view: SMMView };
// }

// // Client with their connected social channels
// interface ClientWithChannels {
//   id: string;
//   name: string;
//   email: string;
//   channels: ConnectedChannel[];
//   loadingChannels?: boolean;
// }

// interface ConnectedChannel {
//   _id?: string;
//   id?: string;
//   platform: string;
//   username?: string;
//   name?: string;
//   status?: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────
// const PLATFORMS = [
//   { id: "instagram",  label: "Instagram"  },
//   { id: "facebook",   label: "Facebook"   },
//   { id: "twitter",    label: "Twitter/X"  },
//   { id: "linkedin",   label: "LinkedIn"   },
//   { id: "youtube",    label: "YouTube"    },
//   { id: "pinterest",  label: "Pinterest"  },
// ];

// const CONNECTABLE_PLATFORMS = [
//   { id: "instagram", label: "Instagram", color: "from-pink-500 to-orange-400", icon: "📸" },
//   { id: "facebook",  label: "Facebook",  color: "from-blue-600 to-blue-700",   icon: "👍" },
//   { id: "twitter",   label: "Twitter/X", color: "from-sky-400 to-sky-500",     icon: "🐦" },
//   { id: "linkedin",  label: "LinkedIn",  color: "from-blue-700 to-blue-800",   icon: "💼" },
//   { id: "youtube",   label: "YouTube",   color: "from-red-500 to-red-600",     icon: "▶️" },
//   { id: "pinterest", label: "Pinterest", color: "from-red-600 to-pink-600",    icon: "📌" },
// ];

// // Queue auto-remove after 5 minutes (in ms)
// const QUEUE_DISPLAY_MS = 5 * 60 * 1000;

// // ─── Notif helper ─────────────────────────────────────────────────────────────
// const mkNotif = (type: NotifType, title: string, message: string, action?: AppNotif["action"]): AppNotif => ({
//   id: `n_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
//   type, title, message, timestamp: new Date().toISOString(), read: false, action,
// });

// // ─── Component ────────────────────────────────────────────────────────────────
// const SMMDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const session  = getSession();
//   const token    = session?.token ?? "";

//   const [view, setView] = useState<SMMView>("overview");

//   useEffect(() => {
//     const locState = location.state as { view?: string } | null;
//     if (locState?.view === "channels") {
//       setView("channels");
//       window.history.replaceState({}, "");
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const [userName, setUserName] = useState("SMM Executive");

//   // ── Dark Mode ──────────────────────────────────────────────────────────────
//   const [dark, setDark] = useState<boolean>(() => localStorage.getItem(DARK_MODE_KEY) === "true");
//   useEffect(() => {
//     localStorage.setItem(DARK_MODE_KEY, String(dark));
//     document.documentElement.classList.toggle("smm-dark", dark);
//   }, [dark]);

//   // ── Notifications ──────────────────────────────────────────────────────────
//   const [notifs, setNotifs]       = useState<AppNotif[]>(() => {
//     try { return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "[]"); } catch { return []; }
//   });
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifTab, setNotifTab]   = useState<0|1>(0);
//   const notifRef                  = useRef<HTMLDivElement>(null);

//   const saveNotifs = useCallback((arr: AppNotif[]) => {
//     const t = arr.slice(0, 50);
//     localStorage.setItem(NOTIF_KEY, JSON.stringify(t));
//     return t;
//   }, []);

//   const pushNotif = useCallback((n: AppNotif) => {
//     setNotifs(prev => saveNotifs([n, ...prev]));
//   }, [saveNotifs]);

//   const markAllRead = () => setNotifs(prev => saveNotifs(prev.map(n => ({ ...n, read: true }))));
//   const clearNotifs = () => { setNotifs([]); localStorage.removeItem(NOTIF_KEY); };
//   const deleteNotif = (id: string) => setNotifs(prev => saveNotifs(prev.filter(n => n.id !== id)));
//   const unreadCount = notifs.filter(n => !n.read).length;

//   useEffect(() => {
//     if (!notifOpen) return;
//     const h = (e: MouseEvent) => {
//       if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
//     };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, [notifOpen]);

//   // ── API state ──────────────────────────────────────────────────────────────
//   const [overview, setOverview]         = useState<OverviewRes | null>(null);
//   const [overviewLoading, setOvLoading] = useState(false);
//   const [smmDashData, setSmmDashData]   = useState<any>(null);

//   // clientList and gdList — extracted from design projects API
//   const [clientList, setClientList]     = useState<{ id:string; name:string; email:string }[]>([]);
//   const [gdList, setGdList]             = useState<{ id:string; name:string; email:string }[]>([]);

//   // Clients with their channels (for Channels view)
//   const [clientsWithChannels, setClientsWithChannels]   = useState<ClientWithChannels[]>([]);
//   const [clientChannelsLoading, setClientChannelsLoading] = useState(false);

//   const [designProjects, setDesignProjects]   = useState<DesignProject[]>([]);
//   const [designLoading,  setDesignLoading]    = useState(false);
//   const [showAddDesign,  setShowAddDesign]    = useState(false);
//   const [designFilter,   setDesignFilter]    = useState("");
//   const [newDP, setNewDP] = useState({
//     clientId:"", designerId:"", title:"", designType:"Social Post",
//     deadline:"", priority:"Medium", description:"",
//     targetAudience:"", brandColors:"", fontPreferences:"", revisionLimit:3,
//   });
//   const [dpSaving, setDpSaving]               = useState(false);
//   const [selProject, setSelProject]           = useState<DesignProject | null>(null);
//   const [projComments, setProjComments]       = useState<any[]>([]);
//   const [newComment, setNewComment]           = useState("");
//   const [commentSending, setCommentSending]   = useState(false);

//   const [posts, setPosts]               = useState<Post[]>([]);
//   const [postsLoading, setPostsLoading] = useState(false);
//   const [postsError, setPostsError]     = useState<string | null>(null);

//   // Queue: track publishedAt for instant posts, auto-remove after 5 min
//   const [queuedPosts, setQueuedPosts]   = useState<(Post & { queuedAt?: number })[]>([]);
//   const [queueLoading, setQueueLoading] = useState(false);
//   const [publishingId, setPublishingId] = useState<string | null>(null);

//   const [drafts, setDrafts]             = useState<Post[]>([]);
//   const [draftsLoading, setDraftsLoading] = useState(false);
//   const [deletingDid, setDeletingDid]   = useState<string | null>(null);

//   const [pubPosts, setPubPosts]         = useState<Post[]>([]);
//   const [pubLoading, setPubLoading]     = useState(false);

//   // My agency's own channels
//   const [channels, setChannels]               = useState<any[]>([]);
//   const [channelsLoading, setChanLoading]     = useState(false);
//   const [disconnectingId, setDiscId]          = useState<string | null>(null);
//   const [connectingPlatform, setConnPlat]     = useState<string | null>(null);

//   const [analytics, setAnalytics]             = useState<any>(null);
//   const [analyticsLoading, setAnaLoading]     = useState(false);

//   // ── Compose state ──────────────────────────────────────────────────────────
//   const [composeContent, setComposeContent]   = useState("");
//   // Selected client for this post
//   const [composeClientId, setComposeClientId] = useState("");
//   // Channels of the selected client
//   const [clientConnectedChannels, setClientConnectedChannels] = useState<ConnectedChannel[]>([]);
//   const [clientChannelsFetching, setClientChannelsFetching]   = useState(false);
//   const [composePlatforms, setComposePlatforms] = useState<string[]>([]);
//   const [composeScheduleDate, setComposeScheduleDate] = useState("");
//   const [composeScheduleTime, setComposeScheduleTime] = useState("");
//   const [composeSaving, setComposeSaving]     = useState(false);
//   const [composeMedia, setComposeMedia]       = useState<File | null>(null);
//   const [composePreview, setComposePreview]   = useState<string | null>(null);
//   const [composeTags, setComposeTags]         = useState<string[]>([]);
//   const [composeTagInput, setComposeTagInput] = useState("");
//   const [editingDraft, setEditingDraft]       = useState<Post | null>(null);

//   // YouTube specific state
//   const [youtubeTitle,   setYoutubeTitle]   = useState("");
//   const [youtubePrivacy, setYoutubePrivacy] = useState<"public"|"private"|"unlisted">("public");
//   const [isVideoFile,    setIsVideoFile]    = useState(false);

//   // GD Tasks (local storage based)
//   const [gdTasks, setGdTasks]           = useState<GDTask[]>([]);
//   const completedGDCount = gdTasks.filter(t => t.status === "completed").length;
//   const totalBadgeCount = (notifs.filter(n => !n.read).length) + completedGDCount;
//   const [showAddTask, setShowAddTask]   = useState(false);
//   const [newTask, setNewTask] = useState({
//     title:"", description:"", clientName:"", gdName:"",
//     platform:"Instagram", deadline:"", priority:"medium" as Priority, notes:"",
//   });

//   const [calMonth, setCalMonth] = useState(new Date());
//   const prevGDTasksRef = useRef<GDTask[]>([]);

//   // Connecting channel state per client
//   const [connectingForClient, setConnectingForClient] = useState<string|null>(null);

//   // ── Auto-remove instant posts from queue after 5 min ──────────────────────
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       setQueuedPosts(prev => {
//         const filtered = prev.filter(p => {
//           // If post has no scheduleAt, it's an instant post — remove after QUEUE_DISPLAY_MS
//           const isInstant = !p.scheduleAt && !p.scheduled_at;
//           if (isInstant && p.queuedAt && (now - p.queuedAt) >= QUEUE_DISPLAY_MS) {
//             return false;
//           }
//           return true;
//         });
//         return filtered;
//       });
//     }, 10_000); // check every 10s
//     return () => clearInterval(interval);
//   }, []);

//   // Watch for GD tasks becoming completed → push notification
//   useEffect(() => {
//     const prev = prevGDTasksRef.current;
//     if (prev.length > 0) {
//       gdTasks.forEach(task => {
//         const prevTask = prev.find(t => t.id === task.id);
//         if (prevTask && prevTask.status !== "completed" && task.status === "completed") {
//           pushNotif(mkNotif("info", "GD Task Completed! 🎨",
//             `"${task.title}" by ${task.gdName} is ready for review`,
//             { label: "Review Now", view: "gd_tasks" }));
//         }
//       });
//     }
//     prevGDTasksRef.current = gdTasks;
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [gdTasks]);

//   // ── Init ────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const name = localStorage.getItem("socialflow_user_name") || "SMM Executive";
//     setUserName(name);
//     const stored = localStorage.getItem(GD_TASKS_KEY);
//     if (stored) setGdTasks(JSON.parse(stored));
//     if (token) {
//       loadOverview();
//       loadPosts();
//       loadSMMDashboard();
//       loadUsersForDropdowns();
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   useEffect(() => {
//     if (!token) return;
//     if (view === "overview")        { loadOverview(); loadPosts(); }
//     if (view === "queue")           loadQueued();
//     if (view === "drafts")          loadDrafts();
//     if (view === "published")       loadPublished();
//     if (view === "analytics")       loadAnalytics();
//     if (view === "calendar")        loadPosts();
//     if (view === "channels")        { loadChannels(); loadClientsWithChannels(); }
//     if (view === "design_projects") loadDesignProjects();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [view]);

//   // When client changes in compose, fetch their channels
//   useEffect(() => {
//     if (composeClientId) fetchClientChannels(composeClientId);
   
//     else { setClientConnectedChannels([]); setComposePlatforms([]); }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [composeClientId]);
//    console.log("jheta",composeClientId);

//   // ── Loaders ─────────────────────────────────────────────────────────────────
//   const loadOverview = async () => {
//     setOvLoading(true);
//     try { const { data } = await apiGetOverview(token); if (data) setOverview(data); } catch {}
//     setOvLoading(false);
//   };

//   const loadSMMDashboard = async () => {
//     const { data } = await apiSMMDashboard(token);
//     if (data) {
//       const d = (data as any)?.data ?? data;
//       setSmmDashData(d);
//       extractUsers((d as any)?.recentProjects ?? []);
//     }
//   };

//   const extractUsers = (projects: any[]) => {
//     if (!Array.isArray(projects) || !projects.length) return;
//     const cm = new Map<string,{id:string;name:string;email:string}>();
//     const gm = new Map<string,{id:string;name:string;email:string}>();
//     projects.forEach((p:any) => {
//       const c = p.clientId;
//       if (c && typeof c==="object" && c._id)
//         cm.set(c._id, {id:c._id, name:c.name||"Client", email:c.email||""});
//       const g = p.designerId;
//       if (g && typeof g==="object" && g._id)
//         gm.set(g._id, {id:g._id, name:g.name||"Designer", email:g.email||""});
//     });
//     if (cm.size) setClientList(prev => {
//       const m=new Map(prev.map(x=>[x.id,x])); cm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
//     });
//     if (gm.size) setGdList(prev => {
//       const m=new Map(prev.map(x=>[x.id,x])); gm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
//     });
//   };

//   const loadUsersForDropdowns = async () => {
//     // FIXED: pehle ye function localStorage (per-device, stale) aur design
//     // projects (jo tab tak khaali rehta hai jab tak koi design project na
//     // bana ho) se client/GD list nikaalta tha. Ab seedha backend ke
//     // dedicated SMM endpoints se agency ke saare Client/GD milte hain —
//     // in dono me se koi bhi active ho, list turant dikhegi.
//     try {
//       const { data: clientsRes, error: clientsErr } = await apiSMMGetClients(token);
//       if (clientsErr) {
//         console.warn("SMM clients fetch failed:", clientsErr);
//       } else {
//         const clients = (clientsRes as any)?.data?.clients ?? [];
//         setClientList(
//           clients.map((c: any) => ({ id: c._id, name: c.name, email: c.email || "" }))
//         );
//       }
//     } catch (e) {
//       console.warn("SMM clients fetch error:", e);
//     }

//     try {
//       const { data: gdRes, error: gdErr } = await apiSMMGetGraphicDesigners(token);
//       if (gdErr) {
//         console.warn("SMM graphic designers fetch failed:", gdErr);
//       } else {
//         const designers = (gdRes as any)?.data?.designers ?? [];
//         setGdList(
//           designers.map((g: any) => ({ id: g._id, name: g.name, email: g.email || "" }))
//         );
//       }
//     } catch (e) {
//       console.warn("SMM graphic designers fetch error:", e);
//     }
//   };

//   // Fetch channels for a specific client (by clientId)
// //  const fetchClientChannels = async (clientId: string) => {
// //   if (!clientId) return;
// //   setClientChannelsFetching(true);
// //   try {
// //     const endpoints = [
// //       `${BASE_URL}/api/social-accounts?userId=${clientId}`,
// //       `${BASE_URL}/api/social-accounts?clientId=${clientId}`,
// //       `${BASE_URL}/api/clients/${clientId}/social-accounts`,
// //       `${BASE_URL}/api/clients/${clientId}/channels`,
// //     ];
// //     let found: ConnectedChannel[] = [];
// //     for (const url of endpoints) {
// //       try {
// //         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// //         if (res.ok) {
// //           const json = await res.json();
// //           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// //           const arr = Array.isArray(raw) ? raw : [];
// //           if (arr.length > 0) { found = arr; break; }
// //         }
// //       } catch { /* try next */ }
// //     }
// //     setClientConnectedChannels(found);
// //     setComposePlatforms([]);
// //   } catch {
// //     setClientConnectedChannels([]);
// //   }
// //   setClientChannelsFetching(false);
// // };

// // ✅ NAYA (replace karo)
// const fetchClientChannels = async (clientId: string) => {
//   if (!clientId) return;
//   setClientChannelsFetching(true);
//   try {
//     const res = await fetch(
//       `${BASE_URL}/api/social/accounts?clientId=${clientId}`,
//       // { headers: { Authorization: `Bearer ${token}` } }
//       { headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } }

//     );
//     if (res.ok) {
//       const json = await res.json();
//       const raw = json?.data ?? json?.accounts ?? (Array.isArray(json) ? json : []);
//       setClientConnectedChannels(Array.isArray(raw) ? raw : []);
//     } else {
//       setClientConnectedChannels([]);
//     }
//   } catch {
//     setClientConnectedChannels([]);
//   }
//   setComposePlatforms([]);
//   setClientChannelsFetching(false);
// };

//   // Load all clients and their channels for Channels view
// // const loadClientsWithChannels = async () => {
// //   setClientChannelsLoading(true);

// //   // FIX: don't rely on stale clientList state — fetch fresh
// //   let clients = clientList;
// //   if (clients.length === 0) {
// //     const { data } = await apiSMMGetDesignProjects(token, { limit: 100 });
// //     const raw = data as any;
// //     const projects = raw?.data?.projects ?? raw?.projects ?? raw?.data ?? [];
// //     const cm = new Map<string, { id: string; name: string; email: string }>();
// //     if (Array.isArray(projects)) {
// //       projects.forEach((p: any) => {
// //         const c = p.clientId;
// //         if (c && typeof c === "object" && c._id)
// //           cm.set(c._id, { id: c._id, name: c.name || "Client", email: c.email || "" });
// //       });
// //     }
// //     clients = Array.from(cm.values());
// //     if (clients.length > 0) setClientList(clients); // update state too
// //   }

// //   if (clients.length === 0) { setClientChannelsLoading(false); return; }

// //   const updated: ClientWithChannels[] = [];
// //   for (const client of clients) {
// //     // FIX: try multiple endpoint patterns
// //     const endpoints = [
// //       `${BASE_URL}/api/social-accounts?userId=${client.id}`,
// //       `${BASE_URL}/api/social-accounts?clientId=${client.id}`,
// //       `${BASE_URL}/api/clients/${client.id}/social-accounts`,
// //       `${BASE_URL}/api/clients/${client.id}/channels`,
// //     ];
// //     let channels: ConnectedChannel[] = [];
// //     for (const url of endpoints) {
// //       try {
// //         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// //         if (res.ok) {
// //           const json = await res.json();
// //           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
// //           const arr = Array.isArray(raw) ? raw : [];
// //           if (arr.length > 0) { channels = arr; break; }
// //         }
// //       } catch { /* try next */ }
// //     }
// //     updated.push({ ...client, channels });
// //   }
// //   setClientsWithChannels(updated);
// //   setClientChannelsLoading(false);
// // };
// const loadClientsWithChannels = async () => {
//   setClientChannelsLoading(true);

//   // FIXED: ab stale/design-projects-derived list pe depend nahi karte —
//   // seedha backend se fresh client list mangte hain.
//   let clients = clientList;
//   if (clients.length === 0) {
//     const { data } = await apiSMMGetClients(token);
//     const fetched = (data as any)?.data?.clients ?? [];
//     clients = fetched.map((c: any) => ({ id: c._id, name: c.name, email: c.email || "" }));
//     if (clients.length > 0) setClientList(clients);
//   }

//   if (clients.length === 0) { setClientChannelsLoading(false); return; }

//   const updated: ClientWithChannels[] = [];
//   for (const client of clients) {
//     // ✅ FIXED: single correct endpoint
//     let channels: ConnectedChannel[] = [];
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/social/accounts?clientId=${client.id}`,
//         // { headers: { Authorization: `Bearer ${token}` } }
//         { headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } }

//       );
//       if (res.ok) {
//         const json = await res.json();
//         const raw = json?.data ?? json?.accounts ?? (Array.isArray(json) ? json : []);
//         channels = Array.isArray(raw) ? raw : [];
//       }
//     } catch { /* ignore */ }
//     updated.push({ ...client, channels });
//   }
//   setClientsWithChannels(updated);
//   setClientChannelsLoading(false);
// };

//   const loadDesignProjects = async () => {
//     setDesignLoading(true);
//     const { data, error } = await apiSMMGetDesignProjects(token, designFilter ? {status:designFilter} : undefined);
//     if (error) { toast.error("Load failed: "+error); pushNotif(mkNotif("error","Projects Load Failed",error)); }
//     else {
//       const raw=data as any;
//       const list=raw?.data?.projects??raw?.projects??raw?.data??(Array.isArray(raw)?raw:[]);
//       const arr=Array.isArray(list)?list:[];
//       setDesignProjects(arr); extractUsers(arr);
//     }
//     setDesignLoading(false);
//   };

//   const loadPosts = async () => {
//     setPostsLoading(true); setPostsError(null);
//     const { data, error } = await apiGetPosts(token);
//     if (error) { if(!error.includes("404")&&!error.includes("not found")) setPostsError(error); }
//     else {
//       const raw=data as any;
//       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
//       setPosts(Array.isArray(list)?list:[]);
//     }
//     setPostsLoading(false);
//   };

//   const loadQueued = async () => {
//     setQueueLoading(true);
//     const { data, error } = await apiGetQueuedPosts(token);
//     if (error) toast.error("Queue load failed: "+error);
//     else {
//       const raw=data as any;
//       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
//       const arr: (Post & { queuedAt?: number })[] = Array.isArray(list) ? list : [];
//       // Preserve existing queuedAt timestamps for posts already in state
//       const merged = arr.map(p => {
//         const existing = queuedPosts.find(q => (q._id??q.id) === (p._id??p.id));
//         return existing ? { ...p, queuedAt: existing.queuedAt } : { ...p, queuedAt: Date.now() };
//       });
//       if (merged.length > queuedPosts.length && queuedPosts.length > 0)
//         pushNotif(mkNotif("info","Queue Updated",`${merged.length-queuedPosts.length} new post(s) added to queue`,{label:"View Queue",view:"queue"}));
//       setQueuedPosts(merged);
//     }
//     setQueueLoading(false);
//   };

//   const loadDrafts = async () => {
//     setDraftsLoading(true);
//     const { data, error } = await apiGetDrafts(token);
//     if (error) toast.error("Drafts load failed: "+error);
//     else {
//       const raw=data as any;
//       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
//       setDrafts(Array.isArray(list)?list:[]);
//     }
//     setDraftsLoading(false);
//   };

//   const loadPublished = async () => {
//     setPubLoading(true);
//     const { data, error } = await apiGetPosts(token, "published");
//     if (error) toast.error("Published load failed: "+error);
//     else {
//       const raw=data as any;
//       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
//       setPubPosts(Array.isArray(list)?list:[]);
//     }
//     setPubLoading(false);
//   };

//   const loadAnalytics = async () => {
//     setAnaLoading(true);
//     const { data } = await apiGetAnalytics(token,"7d");
//     if (data?.data) setAnalytics(data.data);
//     setAnaLoading(false);
//   };

//   const loadChannels = async () => {
//     setChanLoading(true);
//     const { data, error } = await apiGetSocialAccounts(token);
//     if (error) toast.error("Channels load failed: "+error);
//     else {
//       const raw=data as any;
//       const list=raw?.channels??raw?.accounts??raw?.data??(Array.isArray(raw)?raw:[]);
//       setChannels(Array.isArray(list)?list:[]);
//     }
//     setChanLoading(false);
//   };

//   // ── Actions ─────────────────────────────────────────────────────────────────
//   const handleLogout = () => {
//     clearSession(); localStorage.removeItem("socialflow_role"); navigate("/"); toast.success("Logged out successfully");
//   };

//   const togglePlat = (id:string) => setComposePlatforms(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);

//   const handleCompose = async (action:"draft"|"queue"|"schedule") => {
//     if (!composeContent.trim()) { toast.error("Please add some content"); return; }
//     if (action!=="draft"&&composePlatforms.length===0) { toast.error("Please select at least one platform"); return; }
//     if (action!=="draft"&&!composeClientId) { toast.error("Please select a client"); return; }
//     if (action!=="draft" && composePlatforms.includes("youtube") && !isVideoFile) {
//       toast.error("YouTube ke liye video file select karo (MP4)"); return;
//     }
//     setComposeSaving(true);
//     try {
//       if (action==="draft") {
//         if (editingDraft) {
//           const id=editingDraft._id??editingDraft.id??"";
//           const {error}=await apiUpdateDraft(token,id,composeContent,composePlatforms,composeMedia?[composeMedia]:[]);
//           if(error){toast.error("Update failed: "+error);return;}
//           toast.success("Draft updated!");
//           pushNotif(mkNotif("success","Draft Updated","Draft saved successfully",{label:"View Drafts",view:"drafts"}));
//         } else {
//           const {error}=await apiSaveDraft(token,composeContent,composePlatforms,composeTags,composeMedia?[composeMedia]:[]);
//           if(error){toast.error("Save failed: "+error);return;}
//           toast.success("Draft saved!");
//           pushNotif(mkNotif("success","Draft Saved","New draft saved",{label:"View Drafts",view:"drafts"}));
//         }
//         resetCompose(); setView("drafts");
//       } else {
//         let schedAt: string | null = null;
//         if (composeScheduleDate && composeScheduleTime) {
//           schedAt = new Date(`${composeScheduleDate}T${composeScheduleTime}`).toISOString();
//         } else if (composeScheduleDate) {
//           schedAt = new Date(`${composeScheduleDate}T00:00`).toISOString();
//         }
//         // const {error}=await apiCreatePost(
//         //   token, composeContent, composePlatforms, composeTags,
//         //   composeMedia?[composeMedia]:[], schedAt??null,
//         //   youtubeTitle || undefined,
//         //   youtubePrivacy || undefined
//         // );
//         // ✅ NAYA — clientId add karo end mein
// const {error} = await apiCreatePost(
//   token, composeContent, composePlatforms, composeTags,
//   composeMedia?[composeMedia]:[], schedAt??null,
//   youtubeTitle || undefined,
//   youtubePrivacy || undefined,
//   composeClientId || undefined   // ✅ ADD
// );
//         if(error){toast.error("Post failed: "+error);return;}
//         const isScheduled = !!schedAt;
//         toast.success(isScheduled?"Post scheduled!":"Post added to queue!");
//         pushNotif(mkNotif("success",isScheduled?"Post Scheduled":"Post Queued",
//           isScheduled?`Will publish on ${new Date(schedAt!).toLocaleString("en-IN")}`:"Instant post added to queue — will publish in ~5 minutes",
//           {label:"View Queue",view:"queue"}));
//         resetCompose(); setView("queue");
//         // Refresh queue immediately
//         setTimeout(() => loadQueued(), 500);
//       }
//     } catch { toast.error("Network error"); }
//     finally { setComposeSaving(false); }
//   };

//   const resetCompose = () => {
//     setComposeContent(""); setComposePlatforms([]);
//     setComposeScheduleDate(""); setComposeScheduleTime("");
//     setComposeMedia(null); setComposePreview(null);
//     setEditingDraft(null); setComposeTags([]); setComposeTagInput("");
//     setComposeClientId(""); setClientConnectedChannels([]);
//     setYoutubeTitle(""); setYoutubePrivacy("public"); setIsVideoFile(false);
//   };

//   const handleTagKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key==="Enter"||e.key===","||e.key===" ") {
//       e.preventDefault();
//       const t=composeTagInput.trim().replace(/^#/,"");
//       if(t&&!composeTags.includes(t)) setComposeTags(p=>[...p,t]);
//       setComposeTagInput("");
//     }
//   };

//   const handlePublishNow = async (pid:string) => {
//     setPublishingId(pid);
//     const {error}=await apiPublishPost(token,pid);
//     if(error){
//       toast.error("Publish failed: "+error);
//       pushNotif(mkNotif("error","Publish Failed",error));
//     } else {
//       toast.success("Post published!");
//       pushNotif(mkNotif("success","Published! 🎉","Post published successfully",{label:"View Published",view:"published"}));
//       // Remove from queue immediately
//       setQueuedPosts(prev => prev.filter(p => (p._id??p.id) !== pid));
//       loadOverview();
//     }
//     setPublishingId(null);
//   };

//   const handleDeleteDraft = async (id:string) => {
//     if(!confirm("Are you sure you want to delete this draft?")) return;
//     setDeletingDid(id);
//     const {error}=await apiDeleteDraft(token,id);
//     if(error) toast.error("Delete failed: "+error);
//     else{toast.success("Draft deleted!");pushNotif(mkNotif("warning","Draft Deleted","A draft was deleted"));loadDrafts();}
//     setDeletingDid(null);
//   };

//   const handleEditDraft = (d:Post) => {
//     setEditingDraft(d); setComposeContent(d.content); setComposePlatforms(d.platforms??[]);
//     setView("compose");
//   };

//   // Connect a channel for a specific client
// const handleConnectForClient = async (platId: string, clientId: string) => {
//   const key = `${clientId}_${platId}`;
//   setConnectingForClient(key);
//   // ✅ FIX: clientId pass karo — backend pe SMM ke liye MANDATORY hai
//   const { data, error } = await apiGetOAuthUrl(token, platId, clientId);
//   if (error) { toast.error("OAuth failed: " + error); setConnectingForClient(null); return; }
//   const url = (data as any)?.authUrl ?? (data as any)?.url ?? (data as any)?.redirectUrl;
//   const oauthState = (data as any)?.state ?? (data as any)?.oauthState ?? null;
//   if (url) {
//     localStorage.setItem("oauth_platform", platId);
//     localStorage.setItem("oauth_client_id", clientId);
//     if (oauthState) localStorage.setItem("oauth_state", oauthState);
//     // window.open(url, "_blank");
//     window.location.href = url;
//     pushNotif(mkNotif("info", "Platform Connect", `Connecting ${platId} for client...`, { label: "View Channels", view: "channels" }));

//     // ✅ FIX: Refresh channels when user comes back after OAuth
//     const refreshOnFocus = () => {
//       window.removeEventListener("focus", refreshOnFocus);
//       setTimeout(() => {
//         loadClientsWithChannels();
//         if (composeClientId === clientId) fetchClientChannels(clientId);
//       }, 1500);
//     };
//     window.addEventListener("focus", refreshOnFocus);
//   } else toast.error("No OAuth URL returned");
//   setConnectingForClient(null);
// };

//   // Disconnect a channel for a client
//   const handleDisconnectClientChannel = async (channelId:string, clientId:string) => {
//     if(!confirm("Are you sure you want to disconnect this account?")) return;
//     const {error}=await apiDisconnectSocialAccount(token,channelId);
//     if(error) toast.error("Disconnect failed: "+error);
//     else{
//       toast.success("Disconnected!");
//       pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));
//       // Update local state
//       setClientsWithChannels(prev => prev.map(c =>
//         c.id === clientId
//           ? { ...c, channels: c.channels.filter(ch => (ch._id??ch.id) !== channelId) }
//           : c
//       ));
//       // Also refresh compose client channels if needed
//       if(composeClientId === clientId) fetchClientChannels(clientId);
//     }
//   };

//   const handleConnect = async (platId:string) => {
//     setConnPlat(platId);
//     const {data,error}=await apiGetOAuthUrl(token,platId);
//     if(error){toast.error("OAuth failed: "+error);setConnPlat(null);return;}
//     const url=(data as any)?.authUrl??(data as any)?.url??(data as any)?.redirectUrl;
//     const oauthState=(data as any)?.state??(data as any)?.oauthState??null;
//     if(url){
//       localStorage.setItem("oauth_platform", platId);
//       if(oauthState) localStorage.setItem("oauth_state", oauthState);
//       // window.open(url,"_blank");
//       window.location.href = url;
//       pushNotif(mkNotif("info","Platform Connect",`Connecting ${platId}...`,{label:"View Channels",view:"channels"}));
//     } else toast.error("No OAuth URL returned");
//     setConnPlat(null);
//   };

//   const handleDisconnect = async (cid:string) => {
//     if(!confirm("Are you sure you want to disconnect this account?")) return;
//     setDiscId(cid);
//     const {error}=await apiDisconnectSocialAccount(token,cid);
//     if(error) toast.error("Disconnect failed: "+error);
//     else{toast.success("Disconnected!");pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));loadChannels();}
//     setDiscId(null);
//   };

//   const handleCreateDP = async (e:React.FormEvent) => {
//     e.preventDefault();
//     if(!newDP.clientId||!newDP.designerId||!newDP.title||!newDP.deadline){toast.error("Please fill all required fields");return;}
//     setDpSaving(true);
//     const {error}=await apiSMMCreateDesignProject(token,{...newDP});
//     if(error) toast.error("Create failed: "+error);
//     else{
//       toast.success("Project created!");
//       pushNotif(mkNotif("success","Project Created",`"${newDP.title}" assigned to designer`,{label:"View Projects",view:"design_projects"}));
//       setShowAddDesign(false);
//       setNewDP({clientId:"",designerId:"",title:"",designType:"Social Post",deadline:"",priority:"Medium",description:"",targetAudience:"",brandColors:"",fontPreferences:"",revisionLimit:3});
//       loadDesignProjects();
//     }
//     setDpSaving(false);
//   };

//   const handleDeleteDP = async (id:string) => {
//     if(!confirm("Are you sure you want to delete this project?")) return;
//     const {error}=await apiSMMDeleteDesignProject(token,id);
//     if(error) toast.error("Delete failed: "+error);
//     else{toast.success("Deleted!");pushNotif(mkNotif("warning","Project Deleted","Design project deleted"));loadDesignProjects();}
//   };

//   const handleApproveReject = async (id:string, act:"approve"|"reject") => {
//     const note=prompt(act==="approve"?"Approval note (optional):":"Rejection reason:");
//     if(act==="reject"&&!note) return;
//     const {error}=await apiSMMApproveRejectProject(token,id,act,note??"");
//     if(error) toast.error("Action failed: "+error);
//     else{
//       toast.success(act==="approve"?"Approved!":"Rejected!");
//       pushNotif(mkNotif(act==="approve"?"success":"warning",act==="approve"?"Project Approved":"Project Rejected","Design project "+act+"ed",{label:"View Projects",view:"design_projects"}));
//       loadDesignProjects();
//     }
//   };

//   const handleRevisionReq = async (id:string) => {
//     const msg=prompt("Please enter revision details:");
//     if(!msg) return;
//     const {error}=await apiSMMRequestRevision(token,id,msg);
//     if(error) toast.error("Revision failed: "+error);
//     else{toast.success("Revision request sent!");pushNotif(mkNotif("info","Revision Requested","Revision request sent to designer",{label:"View Projects",view:"design_projects"}));loadDesignProjects();}
//   };

//   const openProjectDetail = async (project:DesignProject) => {
//     setSelProject(project);
//     const pid=project._id??project.id??"";
//     const {data}=await apiSMMGetComments(token,pid);
//     const raw=data as any;
//     const list=raw?.data??raw?.comments??[];
//     setProjComments(Array.isArray(list)?list:[]);
//   };

//   const handleSendComment = async () => {
//     if(!newComment.trim()||!selProject) return;
//     setCommentSending(true);
//     const pid=selProject._id??selProject.id??"";
//     const {error}=await apiSMMAddComment(token,pid,newComment);
//     if(error) toast.error("Comment failed: "+error);
//     else{toast.success("Comment sent!");setNewComment("");openProjectDetail(selProject);}
//     setCommentSending(false);
//   };

//   const handleAssignTask = (e:React.FormEvent) => {
//     e.preventDefault();
//     if(!newTask.title||!newTask.clientName||!newTask.deadline){toast.error("Please fill all required fields");return;}
//     const task:GDTask={
//       id:"T"+Date.now().toString().slice(-6), ...newTask,
//       status:"pending", assignedBy:`${userName} (SMM)`,
//       assignedAt:new Date().toISOString().split("T")[0],
//     };
//     const upd=[task,...gdTasks];
//     setGdTasks(upd);
//     localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
//     setShowAddTask(false);
//     setNewTask({title:"",description:"",clientName:"",gdName:"",platform:"Instagram",deadline:"",priority:"medium",notes:""});
//     toast.success("Task assigned!");
//     pushNotif(mkNotif("success","Task Assigned",`"${task.title}" assigned to designer`,{label:"GD Tasks",view:"gd_tasks"}));
//   };

//   const handleRevision = (tid:string, comment:string) => {
//     const upd=gdTasks.map(t=>t.id===tid?{...t,status:"revision" as TaskStatus,revisionComment:comment}:t);
//     setGdTasks(upd); localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
//     toast.success("Revision request sent");
//     pushNotif(mkNotif("info","Revision Requested","Revision requested for GD task",{label:"GD Tasks",view:"gd_tasks"}));
//   };

//   const handleGDTaskApproveReject = (taskId: string, action: "approve"|"reject") => {
//     const upd = gdTasks.map(t =>
//       t.id === taskId
//         ? { ...t, status: (action === "approve" ? "completed" : "revision") as TaskStatus }
//         : t
//     );
//     setGdTasks(upd);
//     localStorage.setItem(GD_TASKS_KEY, JSON.stringify(upd));
//     toast.success(action === "approve" ? "Task approved!" : "Task sent for revision!");
//     pushNotif(mkNotif(
//       action === "approve" ? "success" : "warning",
//       action === "approve" ? "Task Approved ✅" : "Task Rejected",
//       action === "approve" ? "GD task approved and marked complete" : "GD task sent back for revision",
//       { label: "GD Tasks", view: "gd_tasks" }
//     ));
//     setNotifOpen(false);
//   };

//   // ── Computed ─────────────────────────────────────────────────────────────────
//   const taskCounts = {
//     pending:     gdTasks.filter(t=>t.status==="pending").length,
//     in_progress: gdTasks.filter(t=>t.status==="in_progress").length,
//     revision:    gdTasks.filter(t=>t.status==="revision").length,
//     completed:   gdTasks.filter(t=>t.status==="completed").length,
//   };

//   const calDays = (() => {
//     const y=calMonth.getFullYear(), m=calMonth.getMonth();
//     const off=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
//     const cells:(Date|null)[]= [];
//     for(let i=0;i<off;i++) cells.push(null);
//     for(let d=1;d<=dim;d++) cells.push(new Date(y,m,d));
//     while(cells.length%7!==0) cells.push(null);
//     return cells;
//   })();

//   const postsForDay=(d:Date)=>posts.filter(p=>{
//     const ds=p.scheduleAt??p.scheduled_at??p.createdAt;
//     if(!ds)return false;
//     const pd=new Date(ds);
//     return pd.getFullYear()===d.getFullYear()&&pd.getMonth()===d.getMonth()&&pd.getDate()===d.getDate();
//   });

//   const weeklyData = analytics?.weeklyData?.length
//     ? analytics.weeklyData
//     : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>({day,reach:0,engagement:0}));

//   const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];

//   const ovTotal     = overview?.total     ?? (overview?.data as any)?.total     ?? posts.length;
//   const ovPublished = overview?.published ?? (overview?.data as any)?.published ?? posts.filter(p=>p.status==="published").length;
//   const ovScheduled = overview?.scheduled ?? (overview?.data as any)?.scheduled ?? posts.filter(p=>p.status==="scheduled").length;
//   const ovFailed    = overview?.failed    ?? (overview?.data as any)?.failed    ?? posts.filter(p=>p.status==="failed").length;

//   // Queue time remaining helper
//   const queueTimeLeft = (p: Post & { queuedAt?: number }): string | null => {
//     if (p.scheduleAt || p.scheduled_at) return null; // scheduled post — show schedule time
//     if (!p.queuedAt) return null;
//     const remaining = QUEUE_DISPLAY_MS - (Date.now() - p.queuedAt);
//     if (remaining <= 0) return "Publishing soon...";
//     const mins = Math.floor(remaining / 60000);
//     const secs = Math.floor((remaining % 60000) / 1000);
//     return `Publishing in ${mins}m ${secs}s`;
//   };

//   const navItems:{key:SMMView;icon:React.ElementType;label:string}[] = [
//     {key:"overview",        icon:LayoutDashboard, label:"Overview"},
//     {key:"compose",         icon:PenSquare,       label:"Create Post"},
//     {key:"queue",           icon:Inbox,           label:"Queue"},
//     {key:"drafts",          icon:FileText,        label:"Drafts"},
//     {key:"published",       icon:Globe,           label:"Published"},
//     {key:"calendar",        icon:Calendar,        label:"Calendar"},
//     {key:"design_projects", icon:Palette,         label:"Design Projects"},
//     {key:"gd_tasks",        icon:FileImage,       label:"GD Tasks"},
//     {key:"analytics",       icon:BarChart3,       label:"Analytics"},
//     {key:"channels",        icon:LinkIcon,        label:"Channels"},
//     {key:"clients_gd",      icon:Users,           label:"Clients & GD"},
//   ];

//   const viewTitle:Record<SMMView,string>={
//     overview:"SMM Dashboard", compose:editingDraft?"Edit Draft":"Create Post",
//     queue:"Queue", drafts:"Drafts", published:"Published",
//     calendar:"Content Calendar", gd_tasks:"GD Tasks",
//     design_projects:"Design Projects", analytics:"Analytics", channels:"Channels",
//     clients_gd:"Clients & Graphic Designers",
//   };

//   const statusBadge=(s:string)=>{
//     const m:Record<string,string>={
//       draft:"bg-yellow-100 text-yellow-700",
//       scheduled:"bg-blue-100 text-blue-700",
//       published:"bg-green-100 text-green-700",
//       failed:"bg-red-100 text-red-700",
//       queued:"bg-purple-100 text-purple-700",
//     };
//     return m[s]??"bg-slate-100 text-slate-600";
//   };
//   const notifIcon=(t:NotifType)=>({success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"}[t]);

//   // ── RENDER ───────────────────────────────────────────────────────────────────
//   return (
//     <div className={`smm-root min-h-screen flex ${dark?"smm-dark":""}`}>

//       {/* ── Sidebar ── */}
//       <aside className="smm-sidebar hidden md:flex w-64 flex-col shrink-0">
//         <div className="p-5 border-b smm-border"><Logo /></div>
//         <div className="p-4 flex-1">
//           <div className="smm-profile-card flex items-center gap-3 p-3 rounded-xl mb-4 border">
//             <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
//               <Megaphone className="w-5 h-5 text-white" />
//             </div>
//             <div className="min-w-0">
//               <div className="text-sm font-semibold smm-text-primary truncate">{userName}</div>
//               <div className="text-xs text-green-600 font-medium">SMM Executive</div>
//             </div>
//           </div>
//           <nav className="space-y-0.5">
//             {navItems.map(n=>(
//               <button key={n.key} onClick={()=>{resetCompose();setView(n.key);}}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${view===n.key?"smm-nav-active":"smm-nav-idle"}`}>
//                 <n.icon className="w-4 h-4 shrink-0" />
//                 {n.label}
//                 {n.key==="queue"&&queuedPosts.length>0&&(
//                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-green-100 text-green-700"}`}>
//                     {queuedPosts.length}
//                   </span>
//                 )}
//                 {n.key==="drafts"&&drafts.length>0&&(
//                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-yellow-100 text-yellow-700"}`}>
//                     {drafts.length}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t smm-border">
//           <Button variant="ghost" className="w-full justify-start smm-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
//             <LogOut className="w-4 h-4 mr-2" /> Logout
//           </Button>
//         </div>
//       </aside>

//       {/* ── Main ── */}
//       <main className="smm-main flex-1 min-w-0 overflow-y-auto">

//         {/* Header */}
//         <header className="smm-header px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//           <div>
//             <h1 className="text-xl font-bold smm-text-primary">{viewTitle[view]}</h1>
//             <p className="text-sm smm-text-muted">Welcome back, {userName}</p>
//           </div>
//           <div className="flex items-center gap-2">
//             {view==="gd_tasks"&&(
//               <Button onClick={()=>setShowAddTask(true)} className="bg-green-600 hover:bg-green-700">
//                 <Plus className="w-4 h-4 mr-2"/>Assign Task to GD
//               </Button>
//             )}
//             {view==="design_projects"&&(
//               <Button onClick={()=>setShowAddDesign(true)} className="bg-green-600 hover:bg-green-700">
//                 <Plus className="w-4 h-4 mr-2"/>New Design Project
//               </Button>
//             )}
//             {view==="queue"&&(
//               <Button variant="outline" size="sm" onClick={loadQueued} disabled={queueLoading} className="smm-btn-outline">
//                 <RefreshCw className={`w-4 h-4 mr-1 ${queueLoading?"animate-spin":""}`}/>Refresh
//               </Button>
//             )}
//             {view==="drafts"&&(
//               <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{resetCompose();setView("compose");}}>
//                 <Plus className="w-4 h-4 mr-1"/>New Post
//               </Button>
//             )}
//             {view==="published"&&(
//               <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
//                 <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
//               </Button>
//             )}
//             {view==="compose"&&(
//               <Button variant="outline" size="sm" onClick={()=>{resetCompose();setView("overview");}} className="smm-btn-outline">
//                 ← Back
//               </Button>
//             )}
//             {view==="channels"&&(
//               <Button variant="outline" size="sm" onClick={()=>{loadChannels();loadClientsWithChannels();}} className="smm-btn-outline">
//                 <RefreshCw className="w-4 h-4 mr-1"/>Refresh
//               </Button>
//             )}

//             {/* Dark Mode */}
//             <button onClick={()=>setDark(d=>!d)} className="smm-icon-btn p-2 rounded-lg transition" title={dark?"Light mode":"Dark mode"}>
//               {dark?<Sun className="w-5 h-5 text-yellow-400"/>:<Moon className="w-5 h-5 smm-text-secondary"/>}
//             </button>

//             {/* Notifications */}
//             <div className="relative" ref={notifRef}>
//               <button onClick={()=>setNotifOpen(o=>!o)} className="smm-icon-btn relative p-2 rounded-lg transition">
//                 <Bell className="w-5 h-5 smm-text-secondary"/>
//                 {totalBadgeCount>0&&(
//                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
//                     {totalBadgeCount>9?"9+":totalBadgeCount}
//                   </span>
//                 )}
//               </button>

//               {notifOpen&&(
//                 <div className="smm-notif-panel absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border overflow-hidden z-50">
//                   <div className="flex items-center justify-between px-4 py-3 border-b smm-border smm-notif-header">
//                     <span className="font-semibold text-sm smm-text-primary flex items-center gap-2">
//                       <Bell className="w-4 h-4"/>Notifications
//                       {unreadCount>0&&<span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
//                     </span>
//                     <div className="flex gap-2">
//                       {notifs.length>0&&(
//                         <>
//                           <button onClick={markAllRead} className="text-xs text-green-600 hover:underline">Mark all read</button>
//                           <button onClick={clearNotifs} className="text-xs text-red-500 hover:underline">Clear</button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex border-b smm-border">
//                       <button
//                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===0?"border-b-2 border-green-500 text-green-600":"smm-text-muted hover:smm-text-primary"}`}
//                         onClick={()=>setNotifTab(0)}
//                       >
//                         All Notifications {unreadCount>0&&<span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">{unreadCount}</span>}
//                       </button>
//                       <button
//                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===1?"border-b-2 border-orange-500 text-orange-600":"smm-text-muted hover:smm-text-primary"}`}
//                         onClick={()=>setNotifTab(1)}
//                       >
//                         GD Tasks Done {completedGDCount>0&&<span className="ml-1 bg-orange-500 text-white text-[9px] px-1 py-0.5 rounded-full">{completedGDCount}</span>}
//                       </button>
//                     </div>
//                     <div className="max-h-[400px] overflow-y-auto">
//                       {notifTab===0?(
//                         notifs.length===0?(
//                           <div className="px-4 py-8 text-center smm-text-muted">
//                             <BellOff className="w-8 h-8 mx-auto mb-2 opacity-30"/>
//                             <p className="text-sm">No notifications</p>
//                           </div>
//                         ):notifs.map(n=>(
//                           <div key={n.id} className={`smm-notif-item flex items-start gap-3 px-4 py-3 border-b last:border-b-0 smm-border transition ${!n.read?"smm-notif-unread":""}`}>
//                             <span className="text-base shrink-0 mt-0.5">{notifIcon(n.type)}</span>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between gap-1">
//                                 <p className="text-xs font-semibold smm-text-primary leading-tight">{n.title}</p>
//                                 <button onClick={()=>deleteNotif(n.id)} className="text-slate-300 hover:text-red-400 shrink-0"><X className="w-3 h-3"/></button>
//                               </div>
//                               <p className="text-xs smm-text-muted mt-0.5 leading-snug">{n.message}</p>
//                               <div className="flex items-center justify-between mt-1.5">
//                                 <span className="text-[10px] smm-text-muted">{new Date(n.timestamp).toLocaleString("en-IN",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</span>
//                                 {n.action&&(
//                                   <button onClick={()=>{setView(n.action!.view);setNotifOpen(false);}} className="text-[10px] text-green-600 font-medium hover:underline">
//                                     {n.action.label} →
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ):(
//                         completedGDCount===0?(
//                           <div className="px-4 py-8 text-center smm-text-muted">
//                             <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30"/>
//                             <p className="text-sm">No completed GD tasks pending review</p>
//                           </div>
//                         ):gdTasks.filter(t=>t.status==="completed").map(task=>(
//                           <div key={task.id} className="px-4 py-4 border-b last:border-b-0 smm-border bg-orange-50/50 dark:bg-orange-900/10">
//                             <div className="flex items-start justify-between gap-2 mb-2">
//                               <div className="flex-1 min-w-0">
//                                 <p className="text-xs font-bold smm-text-primary leading-tight flex items-center gap-1">
//                                   <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0"/>
//                                   {task.title}
//                                 </p>
//                                 <p className="text-[11px] smm-text-muted mt-0.5">Designer: <strong>{task.gdName}</strong></p>
//                                 <p className="text-[11px] smm-text-muted">Client: <strong>{task.clientName}</strong></p>
//                                 <p className="text-[11px] smm-text-muted">Platform: {task.platform} · Due: {task.deadline}</p>
//                                 {task.description&&<p className="text-[11px] smm-text-muted mt-1 line-clamp-2 italic">{task.description}</p>}
//                               </div>
//                               <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium shrink-0">Done</span>
//                             </div>
//                             <div className="flex gap-2 mt-2">
//                               <button
//                                 onClick={()=>handleGDTaskApproveReject(task.id,"approve")}
//                                 className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition"
//                               ><CheckCircle2 className="w-3 h-3"/>Approve</button>
//                               <button
//                                 onClick={()=>handleGDTaskApproveReject(task.id,"reject")}
//                                 className="flex-1 flex items-center justify-center gap-1 text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md font-medium transition"
//                               ><X className="w-3 h-3"/>Reject</button>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <div className="p-6">

//           {/* ── OVERVIEW ── */}
//           {view==="overview"&&(
//             <div className="space-y-6">
//               {postsError&&(
//                 <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200">
//                   <AlertCircle className="w-4 h-4 shrink-0"/>{postsError}
//                 </div>
//               )}

//               {smmDashData?.designStats&&(
//                 <div>
//                   <h3 className="font-semibold smm-text-muted mb-3 text-sm uppercase tracking-wide">Design Projects</h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {[
//                       {label:"Total",        value:smmDashData.designStats.totalProjects??0,       border:"border-l-slate-400"},
//                       {label:"Pending",      value:smmDashData.designStats.pendingProjects??0,     border:"border-l-yellow-400"},
//                       {label:"In Progress",  value:smmDashData.designStats.inProgressProjects??0,  border:"border-l-blue-400"},
//                       {label:"Under Review", value:smmDashData.designStats.underReviewProjects??0, border:"border-l-purple-400"},
//                       {label:"Revision",     value:smmDashData.designStats.revisionProjects??0,    border:"border-l-orange-400"},
//                       {label:"Completed",    value:smmDashData.designStats.completedProjects??0,   border:"border-l-green-400"},
//                       {label:"Overdue",      value:smmDashData.designStats.overdueProjects??0,     border:"border-l-red-400"},
//                       {label:"Due Today",    value:smmDashData.designStats.dueTodayProjects??0,    border:"border-l-pink-400"},
//                     ].map(s=>(
//                       <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.border} cursor-pointer hover:shadow-md transition`} onClick={()=>setView("design_projects")}>
//                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
//                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   {label:"Total Posts",        value:overviewLoading?"…":ovTotal,     icon:PenSquare,   color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30",    onClick:()=>setView("queue")},
//                   {label:"Published",          value:overviewLoading?"…":ovPublished, icon:Globe,       color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30",  onClick:()=>setView("published")},
//                   {label:"Scheduled / Queued", value:overviewLoading?"…":ovScheduled, icon:Clock,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30",onClick:()=>setView("queue")},
//                   {label:"Failed",             value:overviewLoading?"…":ovFailed,    icon:AlertCircle, color:"text-red-500",    bg:"bg-red-50 dark:bg-red-900/30",      onClick:()=>setView("published")},
//                 ].map(s=>(
//                   <Card key={s.label} className="smm-card p-5 cursor-pointer hover:shadow-md transition" onClick={s.onClick}>
//                     <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
//                     <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
//                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
//                   </Card>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Card className="smm-card p-5 border-l-4 border-l-purple-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("queue")}>
//                   <div className="flex items-center justify-between">
//                     <div><div className="text-sm font-semibold smm-text-primary">Queue</div><div className="text-xs smm-text-muted mt-0.5">Posts waiting to publish</div></div>
//                     <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"><Inbox className="w-5 h-5 text-purple-600"/></div>
//                   </div>
//                   <div className="text-2xl font-bold smm-text-primary mt-3">{queuedPosts.length}</div>
//                 </Card>
//                 <Card className="smm-card p-5 border-l-4 border-l-yellow-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("drafts")}>
//                   <div className="flex items-center justify-between">
//                     <div><div className="text-sm font-semibold smm-text-primary">Drafts</div><div className="text-xs smm-text-muted mt-0.5">Saved, not published yet</div></div>
//                     <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-yellow-600"/></div>
//                   </div>
//                   <div className="text-2xl font-bold smm-text-primary mt-3">{drafts.length}</div>
//                 </Card>
//                 <Card className="smm-card p-5 border-l-4 border-l-green-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("compose")}>
//                   <div className="flex items-center justify-between">
//                     <div><div className="text-sm font-semibold smm-text-primary">Create Post</div><div className="text-xs smm-text-muted mt-0.5">New post, schedule or draft</div></div>
//                     <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><PenSquare className="w-5 h-5 text-green-600"/></div>
//                   </div>
//                   <div className="text-sm text-green-600 font-medium mt-3">→ Create now</div>
//                 </Card>
//               </div>

//               <Card className="smm-card p-6">
//                 <h3 className="font-semibold smm-text-primary mb-3">Recent Posts</h3>
//                 {postsLoading?(
//                   <div className="flex items-center gap-2 smm-text-muted py-4"><Loader2 className="w-4 h-4 animate-spin"/>Loading...</div>
//                 ):posts.length===0?(
//                   <p className="text-sm smm-text-muted">No posts yet. <button onClick={()=>setView("compose")} className="text-green-600 hover:underline">Create your first post →</button></p>
//                 ):(
//                   <div className="space-y-2">
//                     {posts.slice(0,6).map(p=>(
//                       <div key={p._id??p.id} className="flex items-center gap-3 p-3 rounded-lg border smm-border hover:smm-bg-hover">
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm smm-text-primary truncate">{p.content}</p>
//                           <div className="flex gap-2 mt-1 flex-wrap">
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
//                             {p.platforms?.slice(0,2).map(pl=><span key={pl} className="text-xs smm-text-muted capitalize">{pl}</span>)}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Card>
//             </div>
//           )}

//           {/* ── COMPOSE ── */}
//           {view==="compose"&&(
//             <div className="max-w-2xl space-y-5">
//               {editingDraft&&(
//                 <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 px-4 py-2.5 rounded-lg border border-yellow-200 dark:border-yellow-700">
//                   <Edit2 className="w-4 h-4"/>Editing a draft
//                 </div>
//               )}
//               <Card className="smm-card p-6 space-y-5">

//                 {/* ── Step 1: Select Client ── */}
//                 <div>
//                   <Label className="smm-text-primary font-semibold">Step 1 — Select Client *</Label>
//                   <select
//                     value={composeClientId}
//                     onChange={e => setComposeClientId(e.target.value)}
//                     className="smm-select mt-2 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">— Select Client —</option>
//                     {clientList.map(c => (
//                       <option key={c.id} value={c.id}>{c.name}{c.email?` (${c.email})`:""}</option>
//                     ))}
//                   </select>
//                   {composeClientId&&(
//                     <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
//                       ✓ Post will be created for: <strong>{clientList.find(c=>c.id===composeClientId)?.name}</strong>
//                     </p>
//                   )}
//                 </div>

//                 {/* ── Step 2: Select Platform (from client's connected channels) ── */}
//                 <div>
//                   <Label className="smm-text-primary font-semibold">
//                     Step 2 — Select Platform *
//                     {composeClientId&&<span className="ml-2 text-xs font-normal smm-text-muted">(client's connected channels)</span>}
//                   </Label>
//                   {!composeClientId?(
//                     <p className="text-xs smm-text-muted mt-2 italic">Please select a client first to see their connected channels.</p>
//                   ):clientChannelsFetching?(
//                     <div className="flex items-center gap-2 smm-text-muted mt-2 text-sm"><Loader2 className="w-4 h-4 animate-spin"/>Loading channels...</div>
//                   ):clientConnectedChannels.length===0?(
//                     <div className="mt-2 space-y-2">
//                       <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
//                         ⚠️ This client has no connected channels yet.{" "}
//                         <button onClick={()=>setView("channels")} className="font-semibold underline">
//                           Go to Channels to connect
//                         </button>
//                       </p>
//                       {/* Fallback: allow manual platform selection */}
//                       <p className="text-xs smm-text-muted">Or select platform manually:</p>
//                       <div className="flex flex-wrap gap-2">
//                         {PLATFORMS.map(p=>(
//                           <button key={p.id} type="button" onClick={()=>togglePlat(p.id)}
//                             className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${composePlatforms.includes(p.id)?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
//                             {p.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ):(
//                     <div className="mt-2 space-y-2">
//                       <div className="flex flex-wrap gap-2">
//                         {clientConnectedChannels.map(ch=>{
//                           const platId = ch.platform?.toLowerCase();
//                           const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===platId);
//                           const channelId = ch._id??ch.id??platId;
//                           const isSelected = composePlatforms.includes(platId);
//                           return(
//                             <button key={channelId} type="button"
//                               onClick={()=>togglePlat(platId)}
//                               className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${isSelected?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
//                               <span>{platInfo?.icon??"🔗"}</span>
//                               <span className="capitalize">{platInfo?.label??ch.platform}</span>
//                               {(ch.username||ch.name)&&(
//                                 <span className={`text-xs ${isSelected?"text-white/80":"smm-text-muted"}`}>
//                                   @{ch.username??ch.name}
//                                 </span>
//                               )}
//                             </button>
//                           );
//                         })}
//                       </div>
//                       <p className="text-xs smm-text-muted">
//                         {composePlatforms.length} platform{composePlatforms.length!==1?"s":""} selected
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* ── Step 3: Content ── */}
//                 <div>
//                   <Label className="smm-text-primary font-semibold">Step 3 — Content *</Label>
//                   <textarea value={composeContent} onChange={e=>setComposeContent(e.target.value)}
//                     placeholder="Write your post here..." rows={6} maxLength={2000}
//                     className="smm-textarea mt-2 w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
//                   <div className="text-xs smm-text-muted text-right mt-1">{composeContent.length}/2000</div>
//                 </div>

//                 {/* ── Step 4: Schedule (optional) ── */}
//                 <div>
//                   <Label className="smm-text-primary font-semibold">Step 4 — Schedule Date (optional)</Label>
//                   <p className="text-xs smm-text-muted mb-2">Leave empty for instant post (will show in queue for 5 minutes)</p>
//                   <Input type="date" value={composeScheduleDate} onChange={e=>setComposeScheduleDate(e.target.value)}
//                     min={new Date().toISOString().slice(0,10)} className="smm-input"/>
//                 </div>
//                 {composeScheduleDate&&(
//                   <div>
//                     <Label className="smm-text-primary">Schedule Time</Label>
//                     <Input type="time" value={composeScheduleTime} onChange={e=>setComposeScheduleTime(e.target.value)} className="smm-input mt-2"/>
//                     <p className="text-xs smm-text-muted mt-1">
//                       {composeScheduleTime
//                         ? `✅ Will publish on ${composeScheduleDate} at ${composeScheduleTime}`
//                         : "Leave time empty to schedule at midnight"}
//                     </p>
//                   </div>
//                 )}

//                 {/* YouTube Settings */}
//                 {composePlatforms.includes("youtube") && (
//                   <div className="border rounded-xl p-4 space-y-4 bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800">
//                     <div className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
//                       ▶️ YouTube Settings
//                     </div>
//                     {/* Video Title */}
//                     <div>
//                       <Label className="smm-text-primary">Video Title *</Label>
//                       <input
//                         value={youtubeTitle}
//                         onChange={e => setYoutubeTitle(e.target.value)}
//                         placeholder="e.g. My Awesome Video - June 2025"
//                         maxLength={100}
//                         className="smm-input mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                       />
//                       <p className="text-xs smm-text-muted mt-1">
//                         Khali chodoge toh description ka pehla hissa use hoga
//                       </p>
//                     </div>
//                     {/* Privacy */}
//                     <div>
//                       <Label className="smm-text-primary">Privacy</Label>
//                       <div className="flex gap-2 mt-1 flex-wrap">
//                         {(["public", "unlisted", "private"] as const).map(opt => (
//                           <button key={opt} type="button"
//                             onClick={() => setYoutubePrivacy(opt)}
//                             className={`px-3 py-1.5 rounded-lg border text-sm capitalize font-medium transition ${
//                               youtubePrivacy === opt
//                                 ? "bg-red-600 text-white border-red-600"
//                                 : "smm-btn-outline"
//                             }`}>
//                             {opt}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     {/* Video file status */}
//                     {isVideoFile ? (
//                       <p className="text-xs text-green-600 font-medium flex items-center gap-1">
//                         ✅ Video file selected — ready to upload
//                       </p>
//                     ) : (
//                       <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
//                         ⚠️ Neeche "Image / Video" section se MP4 video file select karo
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Tags */}
//                 <div>
//                   <Label className="smm-text-primary">Tags (optional)</Label>
//                   <div className="mt-2">
//                     <div className="flex flex-wrap gap-1.5 mb-2">
//                       {composeTags.map(tag=>(
//                         <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
//                           #{tag}
//                           <button type="button" onClick={()=>setComposeTags(p=>p.filter(t=>t!==tag))} className="hover:text-red-500">
//                             <X className="w-3 h-3"/>
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                     <Input value={composeTagInput} onChange={e=>setComposeTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
//                       placeholder="Type a tag and press Enter" className="smm-input text-sm"/>
//                   </div>
//                 </div>

//                 {/* Media */}
//                 <div>
//                   <Label className="smm-text-primary">Image / Video (optional)</Label>
//                   {/* FIXED: pehle video select karne par preview blank dikhta
//                       tha (sirf <img> tag tha, jo video render nahi kar
//                       sakta) — YouTube tab ke andar hi ek alag "selected"
//                       message tha, baaki platforms (Facebook, Instagram,
//                       etc.) ke liye koi confirmation nahi tha. Ab video ke
//                       liye <video> preview dikhta hai, jo har platform ke
//                       liye kaam karta hai. */}
//                   {composeMedia ? (
//                     <div className="relative mt-2 inline-block">
//                       {isVideoFile ? (
//                         <video
//                           src={URL.createObjectURL(composeMedia)}
//                           controls
//                           className="max-h-40 rounded-lg border smm-border"
//                         />
//                       ) : (
//                         <img src={composePreview ?? undefined} alt="preview" className="max-h-40 rounded-lg border smm-border"/>
//                       )}
//                       <button type="button" onClick={()=>{setComposePreview(null);setComposeMedia(null);setIsVideoFile(false);}}
//                         className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
//                       <p className="text-xs text-green-600 font-medium mt-1">
//                         ✅ {isVideoFile ? "Video" : "Image"} selected: {composeMedia.name}
//                       </p>
//                     </div>
//                   ):(
//                     <label className="smm-upload-area mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer text-sm smm-text-muted">
//                       🖼 Upload image or video
//                       <input type="file" accept="image/*,video/*" className="hidden" onChange={e=>{
//                       const f=e.target.files?.[0];
//                       if(f){
//                         setComposeMedia(f);
//                         setIsVideoFile(f.type.startsWith("video/"));
//                         setComposePreview(f.type.startsWith("video/") ? null : URL.createObjectURL(f));
//                       }
//                     }}/>
//                     </label>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3 flex-wrap pt-2 border-t smm-border">
//                   <Button variant="outline" onClick={()=>handleCompose("draft")} disabled={composeSaving} className="smm-btn-outline">
//                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
//                     <FileText className="w-4 h-4 mr-2"/>{editingDraft?"Update Draft":"Save as Draft"}
//                   </Button>
//                   <Button className="bg-purple-600 hover:bg-purple-700" onClick={()=>handleCompose("queue")} disabled={composeSaving}>
//                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
//                     <Inbox className="w-4 h-4 mr-2"/>
//                     {composeScheduleDate?"Schedule Post":"Add to Queue (Instant)"}
//                   </Button>
//                 </div>
//               </Card>
//             </div>
//           )}

//           {/* ── QUEUE ── */}
//           {view==="queue"&&(
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm smm-text-muted">Posts in queue — instant posts auto-publish in 5 minutes</p>
//                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
//                   <Plus className="w-4 h-4 mr-1"/>New Post
//                 </Button>
//               </div>
//               {queueLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):queuedPosts.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary font-medium">Queue is empty</p>
//                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
//                     <Plus className="w-4 h-4 mr-2"/>Create Post
//                   </Button>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {queuedPosts.map(p=>{
//                     const pid=p._id??p.id??"";
//                     const timeLeft = queueTimeLeft(p);
//                     const isScheduled = !!(p.scheduleAt??p.scheduled_at);
//                     return(
//                       <Card key={pid} className="smm-card p-5">
//                         <div className="flex items-start justify-between gap-4 flex-wrap">
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 mb-2 flex-wrap">
//                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
//                               {isScheduled?(
//                                 <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
//                                   📅 Scheduled
//                                 </span>
//                               ):(
//                                 <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium animate-pulse">
//                                   ⚡ Instant
//                                 </span>
//                               )}
//                               {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
//                             </div>
//                             <p className="text-sm smm-text-primary">{p.content}</p>
//                             {isScheduled?(
//                               <p className="text-xs smm-text-muted mt-2 flex items-center gap-1">
//                                 <Clock className="w-3 h-3"/>
//                                 Scheduled: {new Date(p.scheduleAt??p.scheduled_at??"").toLocaleString("en-IN")}
//                               </p>
//                             ):timeLeft?(
//                               <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
//                                 <Clock className="w-3 h-3"/>{timeLeft}
//                               </p>
//                             ):null}
//                           </div>
//                           <Button size="sm" className="bg-green-600 hover:bg-green-700 shrink-0" onClick={()=>handlePublishNow(pid)} disabled={publishingId===pid}>
//                             {publishingId===pid?<Loader2 className="w-4 h-4 animate-spin"/>:<><CheckCircle2 className="w-4 h-4 mr-1"/>Publish Now</>}
//                           </Button>
//                         </div>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── DRAFTS ── */}
//           {view==="drafts"&&(
//             <div className="space-y-4">
//               <p className="text-sm smm-text-muted">Saved drafts — edit or add to queue</p>
//               {draftsLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):drafts.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary font-medium">No drafts found</p>
//                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
//                     <Plus className="w-4 h-4 mr-2"/>Create Post
//                   </Button>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {drafts.map(d=>{const did=d._id??d.id??"";return(
//                     <Card key={did} className="smm-card p-5">
//                       <div className="flex items-start justify-between gap-4 flex-wrap">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2 flex-wrap">
//                             <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">Draft</span>
//                             {d.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
//                           </div>
//                           <p className="text-sm smm-text-primary line-clamp-3">{d.content}</p>
//                           {d.createdAt&&<p className="text-xs smm-text-muted mt-2">Saved: {new Date(d.createdAt).toLocaleString("en-IN")}</p>}
//                         </div>
//                         <div className="flex gap-2 shrink-0">
//                           <Button size="sm" variant="outline" onClick={()=>handleEditDraft(d)} className="smm-btn-outline">
//                             <Edit2 className="w-4 h-4 mr-1"/>Edit
//                           </Button>
//                           <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDraft(did)} disabled={deletingDid===did}>
//                             {deletingDid===did?<Loader2 className="w-4 h-4 animate-spin"/>:<Trash2 className="w-4 h-4"/>}
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   );})}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── PUBLISHED ── */}
//           {view==="published"&&(
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm smm-text-muted">Record of all published posts</p>
//                 <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
//                   <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
//                 </Button>
//               </div>
//               {pubLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):pubPosts.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary font-medium">No published posts yet</p>
//                   <p className="text-xs smm-text-muted mt-1">Posts published from the queue will appear here</p>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {pubPosts.map(p=>{const pid=p._id??p.id??"";return(
//                     <Card key={pid} className="smm-card p-5">
//                       <div className="flex items-start gap-4">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2 flex-wrap">
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
//                             {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
//                           </div>
//                           <p className="text-sm smm-text-primary">{p.content}</p>
//                           {p.createdAt&&<p className="text-xs smm-text-muted mt-2 flex items-center gap-1"><Globe className="w-3 h-3"/>Published: {new Date(p.createdAt).toLocaleString("en-IN")}</p>}
//                         </div>
//                       </div>
//                     </Card>
//                   );})}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── CHANNELS ── */}
//           {view==="channels"&&(
//             <div className="space-y-8">

//               {/* ── My Agency Channels ── */}
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
//                     <LinkIcon className="w-4 h-4 text-green-600"/>
//                   </div>
//                   <div>
//                     <h2 className="text-base font-bold smm-text-primary">My Agency Channels</h2>
//                     <p className="text-xs smm-text-muted">Your own connected social accounts</p>
//                   </div>
//                 </div>
//                 {channelsLoading?(
//                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//                 ):(
//                   <>
//                     {channels.length>0&&(
//                       <div className="space-y-3 mb-4">
//                         {channels.map(ch=>{
//                           const cid=ch._id??ch.id??"";
//                           const platInfo=CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
//                           return(
//                             <Card key={cid} className="smm-card p-4 flex items-center justify-between gap-4">
//                               <div className="flex items-center gap-3">
//                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>{platInfo?.icon??"🔗"}</div>
//                                 <div>
//                                   <div className="text-sm font-semibold smm-text-primary capitalize">{ch.platform}</div>
//                                   <div className="text-xs smm-text-muted">{ch.username??ch.name??"Connected"}</div>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">Connected</span>
//                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDisconnect(cid)} disabled={disconnectingId===cid}>
//                                   {disconnectingId===cid?<Loader2 className="w-4 h-4 animate-spin"/>:"Disconnect"}
//                                 </Button>
//                               </div>
//                             </Card>
//                           );
//                         })}
//                       </div>
//                     )}
//                     <div>
//                       <h4 className="text-sm font-semibold smm-text-primary mb-3">Connect a New Account</h4>
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                         {CONNECTABLE_PLATFORMS.map(p=>{
//                           const isConnected=channels.some(ch=>ch.platform?.toLowerCase()===p.id);
//                           return(
//                             <Card key={p.id} className={`smm-card p-4 flex items-center justify-between gap-3 ${isConnected?"opacity-60":""}`}>
//                               <div className="flex items-center gap-2">
//                                 <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base bg-gradient-to-br ${p.color}`}>{p.icon}</span>
//                                 <div className="text-sm font-medium smm-text-primary">{p.label}</div>
//                               </div>
//                               <Button size="sm"
//                                 className={isConnected?"bg-slate-400 cursor-not-allowed":"bg-green-600 hover:bg-green-700"}
//                                 onClick={()=>!isConnected&&handleConnect(p.id)}
//                                 disabled={connectingPlatform===p.id||isConnected}>
//                                 {connectingPlatform===p.id?<Loader2 className="w-4 h-4 animate-spin"/>:isConnected?"✓ Connected":"Connect"}
//                               </Button>
//                             </Card>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* ── Client Channels ── */}
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
//                     <Users className="w-4 h-4 text-blue-600"/>
//                   </div>
//                   <div>
//                     <h2 className="text-base font-bold smm-text-primary">Client Channels</h2>
//                     <p className="text-xs smm-text-muted">Manage social accounts for each client — connect platforms on their behalf</p>
//                   </div>
//                 </div>
//                 {clientChannelsLoading?(
//                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading client channels...</div>
//                 ):clientList.length===0?(
//                   <Card className="smm-card p-8 text-center">
//                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
//                     <p className="text-sm smm-text-muted">No clients found. Clients appear once design projects are loaded.</p>
//                     <Button variant="outline" size="sm" className="mt-3 smm-btn-outline" onClick={()=>{loadUsersForDropdowns().then(()=>loadClientsWithChannels());}}>
//                       <RefreshCw className="w-4 h-4 mr-1"/>Load Clients
//                     </Button>
//                   </Card>
//                 ):(
//                   <div className="space-y-4">
//                     {(clientsWithChannels.length > 0 ? clientsWithChannels : clientList.map(c=>({...c,channels:[]}))).map(client=>(
//                       <Card key={client.id} className="smm-card p-5">
//                         {/* Client header */}
//                         <div className="flex items-center gap-3 mb-4">
//                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
//                             <span className="text-sm font-bold text-blue-600">{client.name.charAt(0).toUpperCase()}</span>
//                           </div>
//                           <div>
//                             <div className="font-semibold smm-text-primary text-sm">{client.name}</div>
//                             {client.email&&<div className="text-xs smm-text-muted">{client.email}</div>}
//                           </div>
//                           <div className="ml-auto">
//                             {(client as ClientWithChannels).channels?.length > 0 ? (
//                               <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
//                                 {(client as ClientWithChannels).channels.length} connected
//                               </span>
//                             ):(
//                               <span className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full">
//                                 No channels
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Connected channels for this client */}
//                         {(client as ClientWithChannels).channels?.length > 0 && (
//                           <div className="mb-4">
//                             <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connected Accounts</p>
//                             <div className="space-y-2">
//                               {(client as ClientWithChannels).channels.map(ch=>{
//                                 const chId = ch._id??ch.id??"";
//                                 const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
//                                 return(
//                                   <div key={chId} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border smm-border bg-slate-50/50 dark:bg-slate-800/30">
//                                     <div className="flex items-center gap-2">
//                                       <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>
//                                         {platInfo?.icon??"🔗"}
//                                       </span>
//                                       <div>
//                                         <div className="text-xs font-medium smm-text-primary capitalize">{platInfo?.label??ch.platform}</div>
//                                         {(ch.username||ch.name)&&<div className="text-[10px] smm-text-muted">@{ch.username??ch.name}</div>}
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                       <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium">✓ Connected</span>
//                                       <button
//                                         onClick={()=>handleDisconnectClientChannel(chId, client.id)}
//                                         className="text-[10px] text-red-500 hover:underline px-1"
//                                       >Disconnect</button>
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         )}

//                         {/* Connect new platform for this client */}
//                         <div>
//                           <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connect Platform</p>
//                           <div className="flex flex-wrap gap-2">
//                             {CONNECTABLE_PLATFORMS.map(plat=>{
//                               const key=`${client.id}_${plat.id}`;
//                               const isLoading=connectingForClient===key;
//                               const isAlreadyConnected=(client as ClientWithChannels).channels?.some(ch=>ch.platform?.toLowerCase()===plat.id);
//                               return(
//                                 <Button key={plat.id} size="sm" variant="outline"
//                                   className={`text-xs gap-1.5 ${isAlreadyConnected?"opacity-50 cursor-not-allowed smm-btn-outline":"smm-btn-outline hover:border-blue-500 hover:text-blue-600"}`}
//                                   onClick={()=>!isAlreadyConnected&&handleConnectForClient(plat.id, client.id)}
//                                   disabled={isLoading||isAlreadyConnected}>
//                                   {isLoading?<Loader2 className="w-3 h-3 animate-spin"/>:<span>{plat.icon}</span>}
//                                   {isAlreadyConnected?"✓ "+plat.label:plat.label}
//                                 </Button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ── CLIENTS & GD ── */}
//           {view==="clients_gd"&&(
//             <div className="space-y-8">
//               {/* Clients Section */}
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
//                     <Users className="w-4 h-4 text-blue-600"/>
//                   </div>
//                   <div>
//                     <h2 className="text-base font-bold smm-text-primary">Clients</h2>
//                     <p className="text-xs smm-text-muted">{clientList.length} client(s)</p>
//                   </div>
//                 </div>
//                 {clientList.length===0?(
//                   <Card className="smm-card p-8 text-center">
//                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
//                     <p className="text-sm smm-text-muted">No clients found. They will appear once design projects are loaded.</p>
//                   </Card>
//                 ):(
//                   <div className="space-y-2">
//                     {clientList.map(c=>(
//                       <Card key={c.id} className="smm-card p-4 flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
//                           <span className="text-sm font-bold text-blue-600">{c.name.charAt(0).toUpperCase()}</span>
//                         </div>
//                         <div>
//                           <div className="font-semibold smm-text-primary text-sm">{c.name}</div>
//                           {c.email&&<div className="text-xs smm-text-muted">{c.email}</div>}
//                         </div>
//                         <Button size="sm" variant="outline" className="ml-auto smm-btn-outline text-xs" onClick={()=>setView("channels")}>
//                           <LinkIcon className="w-3 h-3 mr-1"/>Manage Channels
//                         </Button>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Graphic Designers Section */}
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
//                     <Palette className="w-4 h-4 text-purple-600"/>
//                   </div>
//                   <div>
//                     <h2 className="text-base font-bold smm-text-primary">Graphic Designers</h2>
//                     <p className="text-xs smm-text-muted">{gdList.length} designer(s)</p>
//                   </div>
//                 </div>
//                 {gdList.length===0?(
//                   <Card className="smm-card p-8 text-center">
//                     <Palette className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
//                     <p className="text-sm smm-text-muted">No graphic designers found. They appear once design projects are loaded.</p>
//                   </Card>
//                 ):(
//                   <div className="space-y-2">
//                     {gdList.map(g=>(
//                       <Card key={g.id} className="smm-card p-4 flex items-center gap-3">
//                         <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center shrink-0">
//                           <span className="text-sm font-bold text-purple-600">{g.name.charAt(0).toUpperCase()}</span>
//                         </div>
//                         <div>
//                           <div className="font-semibold smm-text-primary text-sm">{g.name}</div>
//                           {g.email&&<div className="text-xs smm-text-muted">{g.email}</div>}
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ── CALENDAR ── */}
//           {view==="calendar"&&(
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()-1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">←</button>
//                 <span className="font-semibold smm-text-primary min-w-[160px] text-center">{monthNames[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
//                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()+1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">→</button>
//                 <Button size="sm" variant="outline" onClick={()=>setCalMonth(new Date())} className="smm-btn-outline">Today</Button>
//                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}><Plus className="w-3 h-3 mr-1"/>New Post</Button>
//               </div>
//               <Card className="smm-card overflow-hidden">
//                 <div className="grid grid-cols-7 border-b smm-border smm-cal-header">
//                   {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
//                     <div key={d} className="p-3 text-xs font-semibold smm-text-muted text-center uppercase tracking-wide">{d}</div>
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-7">
//                   {calDays.map((d,i)=>{
//                     const dp=d?postsForDay(d):[];
//                     const today=d?d.toDateString()===new Date().toDateString():false;
//                     return(
//                       <div key={i} className="min-h-[100px] border-r border-b smm-border p-2 last:border-r-0">
//                         {d&&(
//                           <>
//                             <div className={`text-xs font-medium mb-1 inline-flex items-center justify-center w-6 h-6 rounded-full ${today?"bg-green-600 text-white":"smm-text-muted"}`}>{d.getDate()}</div>
//                             <div className="space-y-1">
//                               {dp.slice(0,2).map(p=>(
//                                 <div key={p._id??p.id} className={`text-xs px-2 py-1 rounded truncate ${statusBadge(p.status)}`}>{p.content.slice(0,20)}…</div>
//                               ))}
//                               {dp.length>2&&<div className="text-xs smm-text-muted px-1">+{dp.length-2} more</div>}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </Card>
//             </div>
//           )}

//           {/* ── GD TASKS ── */}
//           {view==="gd_tasks"&&(
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {[
//                   {label:"Pending",        count:taskCounts.pending,     color:"border-l-slate-400"},
//                   {label:"In Progress",    count:taskCounts.in_progress, color:"border-l-blue-400"},
//                   {label:"Needs Revision", count:taskCounts.revision,    color:"border-l-orange-400"},
//                   {label:"Completed",      count:taskCounts.completed,   color:"border-l-green-400"},
//                 ].map(s=>(
//                   <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.color}`}>
//                     <div className="text-2xl font-bold smm-text-primary">{s.count}</div>
//                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
//                   </Card>
//                 ))}
//               </div>
//               {gdTasks.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <FileImage className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary">No tasks yet. Click "Assign Task to GD" to get started.</p>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {gdTasks.map(task=>(
//                     <Card key={task.id} className="smm-card p-5">
//                       <div className="flex items-start justify-between gap-4 flex-wrap">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 flex-wrap mb-1">
//                             <h3 className="font-semibold smm-text-primary">{task.title}</h3>
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status==="completed"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":task.status==="revision"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":task.status==="in_progress"?"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300":"bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}>
//                               {task.status.replace("_"," ")}
//                             </span>
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.priority==="high"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":task.priority==="medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
//                               {task.priority}
//                             </span>
//                           </div>
//                           <p className="text-sm smm-text-muted mb-2">{task.description}</p>
//                           <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap">
//                             <span>Client: <strong className="smm-text-secondary">{task.clientName}</strong></span>
//                             {task.gdName&&<span>Designer: <strong className="smm-text-secondary">{task.gdName}</strong></span>}
//                             <span>Platform: <strong className="smm-text-secondary">{task.platform}</strong></span>
//                             <span>Due: <strong className="smm-text-secondary">{task.deadline}</strong></span>
//                           </div>
//                           {task.status==="revision"&&task.revisionComment&&(
//                             <div className="mt-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-800">
//                               Revision note: {task.revisionComment}
//                             </div>
//                           )}
//                         </div>
//                         {task.status==="completed"&&(
//                           <div className="flex flex-col gap-2">
//                             <Button size="sm" variant="outline" className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
//                               onClick={()=>{const c=prompt("Revision comment:");if(c)handleRevision(task.id,c);}}>
//                               Request Revision
//                             </Button>
//                             <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={()=>handleGDTaskApproveReject(task.id,"approve")}>
//                               <CheckCircle2 className="w-3 h-3 mr-1"/>Approve
//                             </Button>
//                             <Button size="sm" variant="outline" className="text-xs text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
//                               onClick={()=>handleGDTaskApproveReject(task.id,"reject")}>
//                               Reject
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── DESIGN PROJECTS ── */}
//           {view==="design_projects"&&(
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 flex-wrap">
//                 <select value={designFilter} onChange={e=>{setDesignFilter(e.target.value);setTimeout(()=>loadDesignProjects(),0);}}
//                   className="smm-select px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                   <option value="">All Status</option>
//                   {["Pending","In Progress","Under Review","Revision","Completed","Cancelled"].map(s=>(
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>
//                 <Button size="sm" variant="outline" onClick={loadDesignProjects} disabled={designLoading} className="smm-btn-outline">
//                   <RefreshCw className={`w-4 h-4 mr-1 ${designLoading?"animate-spin":""}`}/>Refresh
//                 </Button>
//               </div>
//               {designLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):designProjects.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary font-medium">No design projects found</p>
//                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setShowAddDesign(true)}>
//                     <Plus className="w-4 h-4 mr-2"/>New Design Project
//                   </Button>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {designProjects.map(p=>{
//                     const pid=p._id??p.id??"";
//                     const clientName=typeof p.clientId==="object"?p.clientId?.name:clientList.find(c=>c.id===p.clientId)?.name??"—";
//                     const designerName=typeof p.designerId==="object"?p.designerId?.name:gdList.find(g=>g.id===p.designerId)?.name??"—";
//                     const sc:Record<string,string>={
//                       "Pending":"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
//                       "In Progress":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
//                       "Under Review":"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
//                       "Revision":"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
//                       "Completed":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
//                       "Cancelled":"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
//                     };
//                     return(
//                       <Card key={pid} className="smm-card p-5">
//                         <div className="flex items-start justify-between gap-4 flex-wrap">
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 flex-wrap mb-1">
//                               <h3 className="font-semibold smm-text-primary">{p.title}</h3>
//                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc[p.status]??"bg-slate-100 text-slate-600"}`}>{p.status}</span>
//                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.priority==="Urgent"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":p.priority==="High"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":p.priority==="Medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
//                                 {p.priority}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap mt-1">
//                               <span>Type: <strong className="smm-text-secondary">{p.designType}</strong></span>
//                               <span>Client: <strong className="smm-text-secondary">{clientName}</strong></span>
//                               <span>Designer: <strong className="smm-text-secondary">{designerName}</strong></span>
//                               <span>Deadline: <strong className="smm-text-secondary">{p.deadline?.slice(0,10)}</strong></span>
//                             </div>
//                             {p.description&&<p className="text-sm smm-text-muted mt-1 truncate">{p.description}</p>}
//                           </div>
//                           <div className="flex gap-2 flex-wrap shrink-0">
//                             <Button size="sm" variant="outline" onClick={()=>openProjectDetail(p)} className="smm-btn-outline">
//                               <MessageSquare className="w-4 h-4 mr-1"/>Comments
//                             </Button>
//                             {p.status==="Under Review"&&(
//                               <>
//                                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>handleApproveReject(pid,"approve")}>
//                                   <CheckCircle2 className="w-4 h-4 mr-1"/>Approve
//                                 </Button>
//                                 <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={()=>handleRevisionReq(pid)}>
//                                   Revision
//                                 </Button>
//                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleApproveReject(pid,"reject")}>
//                                   Reject
//                                 </Button>
//                               </>
//                             )}
//                             <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDP(pid)}>
//                               <Trash2 className="w-4 h-4"/>
//                             </Button>
//                           </div>
//                         </div>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── ANALYTICS ── */}
//           {view==="analytics"&&(
//             <div className="space-y-6">
//               {analyticsLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):(
//                 <>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {[
//                       {label:"Total Reach",  value:analytics?.reach??       "—", icon:Eye,        color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30"},
//                       {label:"Impressions",  value:analytics?.impressions?? "—", icon:TrendingUp,  color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30"},
//                       {label:"Engagement",   value:analytics?.engagement??  "—", icon:Heart,       color:"text-pink-600",   bg:"bg-pink-50 dark:bg-pink-900/30"},
//                       {label:"Followers",    value:analytics?.followers??   "—", icon:Users,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30"},
//                     ].map(s=>(
//                       <Card key={s.label} className="smm-card p-5">
//                         <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
//                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
//                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
//                       </Card>
//                     ))}
//                   </div>
//                   <Card className="smm-card p-6">
//                     <h3 className="font-semibold smm-text-primary mb-4">Weekly Reach & Engagement</h3>
//                     {analytics?.weeklyData?.length?(
//                       <div className="h-64">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <LineChart data={weeklyData}>
//                             <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"}/>
//                             <XAxis dataKey="day" stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
//                             <YAxis stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
//                             <Tooltip contentStyle={{background:dark?"#1e293b":"#fff",border:"1px solid #334155",borderRadius:8}}/>
//                             <Line type="monotone" dataKey="reach" stroke="#22c55e" strokeWidth={2.5} name="Reach"/>
//                             <Line type="monotone" dataKey="engagement" stroke="#818cf8" strokeWidth={2.5} name="Engagement"/>
//                           </LineChart>
//                         </ResponsiveContainer>
//                       </div>
//                     ):(
//                       <div className="h-32 flex items-center justify-center smm-text-muted text-sm">
//                         No analytics data available. Connect social accounts first.
//                       </div>
//                     )}
//                   </Card>
//                 </>
//               )}
//             </div>
//           )}

//         </div>
//       </main>

//       {/* ── Add Design Project Modal ── */}
//       {showAddDesign&&(
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <Card className="smm-modal w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-lg font-bold smm-text-primary">New Design Project</h2>
//               <button onClick={()=>setShowAddDesign(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
//             </div>
//             <form onSubmit={handleCreateDP} className="space-y-4">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Client *</Label>
//                   <select value={newDP.clientId} onChange={e=>setNewDP(n=>({...n,clientId:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
//                     <option value="">-- Select Client --</option>
//                     {clientList.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Graphic Designer *</Label>
//                   <select value={newDP.designerId} onChange={e=>setNewDP(n=>({...n,designerId:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
//                     <option value="">-- Select Designer --</option>
//                     {gdList.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Project Title *</Label>
//                 <Input value={newDP.title} onChange={e=>setNewDP(n=>({...n,title:e.target.value}))}
//                   placeholder="e.g. Logo Design for Sharma Enterprises" required className="smm-input mt-1"/>
//               </div>
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Design Type</Label>
//                   <select value={newDP.designType} onChange={e=>setNewDP(n=>({...n,designType:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                     {["Social Post","Logo","Banner","Brochure","Video Thumbnail","Story","Reel Cover","Other"].map(t=>(
//                       <option key={t} value={t}>{t}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Deadline *</Label>
//                   <Input type="date" value={newDP.deadline} onChange={e=>setNewDP(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Priority</Label>
//                   <select value={newDP.priority} onChange={e=>setNewDP(n=>({...n,priority:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                     {["Low","Medium","High","Urgent"].map(p=><option key={p} value={p}>{p}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Description</Label>
//                 <textarea value={newDP.description} onChange={e=>setNewDP(n=>({...n,description:e.target.value}))} rows={3}
//                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Target Audience</Label>
//                   <Input value={newDP.targetAudience} onChange={e=>setNewDP(n=>({...n,targetAudience:e.target.value}))} placeholder="e.g. 25-45 professionals" className="smm-input mt-1"/>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Revision Limit</Label>
//                   <Input type="number" min={1} max={10} value={newDP.revisionLimit} onChange={e=>setNewDP(n=>({...n,revisionLimit:Number(e.target.value)}))} className="smm-input mt-1"/>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Brand Colors</Label>
//                   <Input value={newDP.brandColors} onChange={e=>setNewDP(n=>({...n,brandColors:e.target.value}))} placeholder="#0044CC, #FFFFFF" className="smm-input mt-1"/>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Font Preferences</Label>
//                   <Input value={newDP.fontPreferences} onChange={e=>setNewDP(n=>({...n,fontPreferences:e.target.value}))} placeholder="Montserrat Bold" className="smm-input mt-1"/>
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddDesign(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={dpSaving}>
//                   {dpSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}<Send className="w-4 h-4 mr-2"/>Create & Assign
//                 </Button>
//               </div>
//             </form>
//           </Card>
//         </div>
//       )}

//       {/* ── Comments Modal ── */}
//       {selProject&&(
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <Card className="smm-modal w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-bold smm-text-primary truncate">{selProject.title}</h2>
//               <button onClick={()=>{setSelProject(null);setProjComments([]);setNewComment("");}} className="smm-text-muted hover:smm-text-primary shrink-0">
//                 <X className="w-5 h-5"/>
//               </button>
//             </div>
//             <h3 className="text-sm font-semibold smm-text-primary mb-2">Comments</h3>
//             <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
//               {projComments.length===0?(
//                 <p className="text-sm smm-text-muted">No comments yet</p>
//               ):projComments.map((c:any,i:number)=>(
//                 <div key={c._id??i} className="text-sm smm-comment px-3 py-2 rounded-lg border smm-border">
//                   <span className="font-medium smm-text-primary">{c.senderName??c.sender?.name??"User"}: </span>
//                   <span className="smm-text-secondary">{c.message??c.text}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <Input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Write a comment..." className="smm-input"
//                 onKeyDown={e=>{if(e.key==="Enter")handleSendComment();}}/>
//               <Button onClick={handleSendComment} disabled={commentSending||!newComment.trim()} className="bg-green-600 hover:bg-green-700 shrink-0">
//                 {commentSending?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}
//               </Button>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* ── Assign GD Task Modal ── */}
//       {showAddTask&&(
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <Card className="smm-modal w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-lg font-bold smm-text-primary">Assign Task to Graphic Designer</h2>
//               <button onClick={()=>setShowAddTask(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
//             </div>
//             <form onSubmit={handleAssignTask} className="space-y-4">
//               <div>
//                 <Label className="smm-text-primary">Task Title *</Label>
//                 <Input value={newTask.title} onChange={e=>setNewTask(n=>({...n,title:e.target.value}))} placeholder="e.g. Instagram Story — Summer Sale" required className="smm-input mt-1"/>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Description</Label>
//                 <textarea value={newTask.description} onChange={e=>setNewTask(n=>({...n,description:e.target.value}))} rows={3}
//                   placeholder="What should the designer create..."
//                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Client *</Label>
//                   {clientList.length>0?(
//                     <select value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))}
//                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
//                       <option value="">-- Select Client --</option>
//                       {clientList.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
//                     </select>
//                   ):(
//                     <Input value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))} placeholder="Client name" required className="smm-input mt-1"/>
//                   )}
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Graphic Designer</Label>
//                   {gdList.length>0?(
//                     <select value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))}
//                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                       <option value="">-- Select Designer --</option>
//                       {gdList.map(g=><option key={g.id} value={g.name}>{g.name}</option>)}
//                     </select>
//                   ):(
//                     <Input value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))} placeholder="Designer name" className="smm-input mt-1"/>
//                   )}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Platform</Label>
//                   <select value={newTask.platform} onChange={e=>setNewTask(n=>({...n,platform:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                     {["Instagram","Facebook","LinkedIn","Twitter/X","YouTube","Pinterest"].map(p=>(
//                       <option key={p} value={p}>{p}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Priority</Label>
//                   <select value={newTask.priority} onChange={e=>setNewTask(n=>({...n,priority:e.target.value as Priority}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                     <option value="high">High</option>
//                     <option value="medium">Medium</option>
//                     <option value="low">Low</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Deadline *</Label>
//                 <Input type="date" value={newTask.deadline} onChange={e=>setNewTask(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Notes for Designer</Label>
//                 <textarea value={newTask.notes} onChange={e=>setNewTask(n=>({...n,notes:e.target.value}))} rows={2}
//                   placeholder="Brand guidelines, colour codes, style references..."
//                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddTask(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700"><Send className="w-4 h-4 mr-2"/>Assign Task</Button>
//               </div>
//             </form>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SMMDashboard;

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./SMMDashboard.css";
// import { Logo } from "@/components/Logo";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import {
//   Megaphone, LogOut, LayoutDashboard, Calendar,
//   PenSquare, BarChart3, FileImage, Plus, X,
//   CheckCircle2, Send, Loader2, AlertCircle,
//   Eye, Heart, TrendingUp, Users, Clock, Inbox,
//   FileText, Globe, Trash2, Edit2, RefreshCw,
//   LinkIcon, Palette, MessageSquare,
//   Bell, BellOff, Moon, Sun,
// } from "lucide-react";
// import {
//   clearSession, getSession,
//   BASE_URL,
//   apiGetPosts, apiCreatePost, apiSaveDraft, apiGetAnalytics,
//   apiGetQueuedPosts, apiGetDrafts, apiUpdateDraft, apiDeleteDraft,
//   apiPublishPost, apiGetOverview, apiGetSocialAccounts,
//   apiGetOAuthUrl, apiDisconnectSocialAccount,
//   apiSMMDashboard, apiSMMGetDesignProjects, apiSMMCreateDesignProject,
//   apiSMMDeleteDesignProject,
//   apiSMMApproveRejectProject, apiSMMRequestRevision,
//   apiSMMGetComments, apiSMMAddComment,
//   type Post, type OverviewRes,
// } from "@/lib/api";
// import {
//   LineChart, Line, ResponsiveContainer, Tooltip,
//   XAxis, YAxis, CartesianGrid,
// } from "recharts";

// // ─── Keys ─────────────────────────────────────────────────────────────────────
// const GD_TASKS_KEY  = "socialflow_gd_tasks";
// const DARK_MODE_KEY = "socialflow_dark_mode";
// const NOTIF_KEY     = "socialflow_notifications";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type TaskStatus = "pending" | "in_progress" | "revision" | "completed";
// type Priority   = "high" | "medium" | "low";
// type NotifType  = "success" | "warning" | "error" | "info";
// type SMMView    = "overview"|"compose"|"queue"|"drafts"|"published"|"calendar"|"gd_tasks"|"design_projects"|"analytics"|"channels"|"clients_gd";

// interface GDTask {
//   id: string; title: string; description: string; clientName: string;
//   gdName: string;
//   platform: string; deadline: string; priority: Priority; status: TaskStatus;
//   assignedBy: string; assignedAt: string; notes?: string; revisionComment?: string;
// }

// interface DesignProject {
//   _id?: string; id?: string;
//   title: string; designType: string; priority: string; status: string;
//   deadline: string; description?: string;
//   clientId?: { _id?: string; name?: string } | string;
//   designerId?: { _id?: string; name?: string } | string;
//   revisionInfo?: { used: number; limit: number; remaining: number };
// }

// interface AppNotif {
//   id: string; type: NotifType; title: string; message: string;
//   timestamp: string; read: boolean; action?: { label: string; view: SMMView };
// }

// // Client with their connected social channels
// interface ClientWithChannels {
//   id: string;
//   name: string;
//   email: string;
//   channels: ConnectedChannel[];
//   loadingChannels?: boolean;
// }

// interface ConnectedChannel {
//   _id?: string;
//   id?: string;
//   platform: string;
//   username?: string;
//   name?: string;
//   status?: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────
// const PLATFORMS = [
//   { id: "instagram",  label: "Instagram"  },
//   { id: "facebook",   label: "Facebook"   },
//   { id: "twitter",    label: "Twitter/X"  },
//   { id: "linkedin",   label: "LinkedIn"   },
//   { id: "youtube",    label: "YouTube"    },
//   { id: "pinterest",  label: "Pinterest"  },
// ];

// const CONNECTABLE_PLATFORMS = [
//   { id: "instagram", label: "Instagram", color: "from-pink-500 to-orange-400", icon: "📸" },
//   { id: "facebook",  label: "Facebook",  color: "from-blue-600 to-blue-700",   icon: "👍" },
//   { id: "twitter",   label: "Twitter/X", color: "from-sky-400 to-sky-500",     icon: "🐦" },
//   { id: "linkedin",  label: "LinkedIn",  color: "from-blue-700 to-blue-800",   icon: "💼" },
//   { id: "youtube",   label: "YouTube",   color: "from-red-500 to-red-600",     icon: "▶️" },
//   { id: "pinterest", label: "Pinterest", color: "from-red-600 to-pink-600",    icon: "📌" },
// ];

// // Queue auto-remove after 5 minutes (in ms)
// const QUEUE_DISPLAY_MS = 5 * 60 * 1000;

// // ─── Notif helper ─────────────────────────────────────────────────────────────
// const mkNotif = (type: NotifType, title: string, message: string, action?: AppNotif["action"]): AppNotif => ({
//   id: `n_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
//   type, title, message, timestamp: new Date().toISOString(), read: false, action,
// });

// // ─── Component ────────────────────────────────────────────────────────────────
// const SMMDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const session  = getSession();
//   const token    = session?.token ?? "";

//   const [view, setView] = useState<SMMView>("overview");

//   useEffect(() => {
//     const locState = location.state as { view?: string } | null;
//     if (locState?.view === "channels") {
//       setView("channels");
//       window.history.replaceState({}, "");
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const [userName, setUserName] = useState("SMM Executive");

//   // ── Dark Mode ──────────────────────────────────────────────────────────────
//   const [dark, setDark] = useState<boolean>(() => localStorage.getItem(DARK_MODE_KEY) === "true");
//   useEffect(() => {
//     localStorage.setItem(DARK_MODE_KEY, String(dark));
//     document.documentElement.classList.toggle("smm-dark", dark);
//   }, [dark]);

//   // ── Notifications ──────────────────────────────────────────────────────────
//   const [notifs, setNotifs]       = useState<AppNotif[]>(() => {
//     try { return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "[]"); } catch { return []; }
//   });
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifTab, setNotifTab]   = useState<0|1>(0);
//   const notifRef                  = useRef<HTMLDivElement>(null);

//   const saveNotifs = useCallback((arr: AppNotif[]) => {
//     const t = arr.slice(0, 50);
//     localStorage.setItem(NOTIF_KEY, JSON.stringify(t));
//     return t;
//   }, []);

//   const pushNotif = useCallback((n: AppNotif) => {
//     setNotifs(prev => saveNotifs([n, ...prev]));
//   }, [saveNotifs]);

//   const markAllRead = () => setNotifs(prev => saveNotifs(prev.map(n => ({ ...n, read: true }))));
//   const clearNotifs = () => { setNotifs([]); localStorage.removeItem(NOTIF_KEY); };
//   const deleteNotif = (id: string) => setNotifs(prev => saveNotifs(prev.filter(n => n.id !== id)));
//   const unreadCount = notifs.filter(n => !n.read).length;

//   useEffect(() => {
//     if (!notifOpen) return;
//     const h = (e: MouseEvent) => {
//       if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
//     };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, [notifOpen]);

//   // ── API state ──────────────────────────────────────────────────────────────
//   const [overview, setOverview]         = useState<OverviewRes | null>(null);
//   const [overviewLoading, setOvLoading] = useState(false);
//   const [smmDashData, setSmmDashData]   = useState<any>(null);

//   // clientList and gdList — extracted from design projects API
//   const [clientList, setClientList]     = useState<{ id:string; name:string; email:string }[]>([]);
//   const [gdList, setGdList]             = useState<{ id:string; name:string; email:string }[]>([]);

//   // Clients with their channels (for Channels view)
//   const [clientsWithChannels, setClientsWithChannels]   = useState<ClientWithChannels[]>([]);
//   const [clientChannelsLoading, setClientChannelsLoading] = useState(false);

//   const [designProjects, setDesignProjects]   = useState<DesignProject[]>([]);
//   const [designLoading,  setDesignLoading]    = useState(false);
//   const [showAddDesign,  setShowAddDesign]    = useState(false);
//   const [designFilter,   setDesignFilter]    = useState("");
//   const [newDP, setNewDP] = useState({
//     clientId:"", designerId:"", title:"", designType:"Social Post",
//     deadline:"", priority:"Medium", description:"",
//     targetAudience:"", brandColors:"", fontPreferences:"", revisionLimit:3,
//   });
//   const [dpSaving, setDpSaving]               = useState(false);
//   const [selProject, setSelProject]           = useState<DesignProject | null>(null);
//   const [projComments, setProjComments]       = useState<any[]>([]);
//   const [newComment, setNewComment]           = useState("");
//   const [commentSending, setCommentSending]   = useState(false);

//   const [posts, setPosts]               = useState<Post[]>([]);
//   const [postsLoading, setPostsLoading] = useState(false);
//   const [postsError, setPostsError]     = useState<string | null>(null);

//   // Queue: track publishedAt for instant posts, auto-remove after 5 min
//   const [queuedPosts, setQueuedPosts]   = useState<(Post & { queuedAt?: number })[]>([]);
//   const [queueLoading, setQueueLoading] = useState(false);
//   const [publishingId, setPublishingId] = useState<string | null>(null);

//   const [drafts, setDrafts]             = useState<Post[]>([]);
//   const [draftsLoading, setDraftsLoading] = useState(false);
//   const [deletingDid, setDeletingDid]   = useState<string | null>(null);

//   const [pubPosts, setPubPosts]         = useState<Post[]>([]);
//   const [pubLoading, setPubLoading]     = useState(false);

//   // My agency's own channels
//   const [channels, setChannels]               = useState<any[]>([]);
//   const [channelsLoading, setChanLoading]     = useState(false);
//   const [disconnectingId, setDiscId]          = useState<string | null>(null);
//   const [connectingPlatform, setConnPlat]     = useState<string | null>(null);

//   const [analytics, setAnalytics]             = useState<any>(null);
//   const [analyticsLoading, setAnaLoading]     = useState(false);

//   // ── Compose state ──────────────────────────────────────────────────────────
//   const [composeContent, setComposeContent]   = useState("");
//   // Selected client for this post
//   const [composeClientId, setComposeClientId] = useState("");
//   // Channels of the selected client
//   const [clientConnectedChannels, setClientConnectedChannels] = useState<ConnectedChannel[]>([]);
//   const [clientChannelsFetching, setClientChannelsFetching]   = useState(false);
//   const [composePlatforms, setComposePlatforms] = useState<string[]>([]);
//   const [composeScheduleDate, setComposeScheduleDate] = useState("");
//   const [composeScheduleTime, setComposeScheduleTime] = useState("");
//   const [composeSaving, setComposeSaving]     = useState(false);
//   const [composeMedia, setComposeMedia]       = useState<File | null>(null);
//   const [composePreview, setComposePreview]   = useState<string | null>(null);
//   const [composeTags, setComposeTags]         = useState<string[]>([]);
//   const [composeTagInput, setComposeTagInput] = useState("");
//   const [editingDraft, setEditingDraft]       = useState<Post | null>(null);

//   // GD Tasks (local storage based)
//   const [gdTasks, setGdTasks]           = useState<GDTask[]>([]);
//   const completedGDCount = gdTasks.filter(t => t.status === "completed").length;
//   const totalBadgeCount = (notifs.filter(n => !n.read).length) + completedGDCount;
//   const [showAddTask, setShowAddTask]   = useState(false);
//   const [newTask, setNewTask] = useState({
//     title:"", description:"", clientName:"", gdName:"",
//     platform:"Instagram", deadline:"", priority:"medium" as Priority, notes:"",
//   });

//   const [calMonth, setCalMonth] = useState(new Date());
//   const prevGDTasksRef = useRef<GDTask[]>([]);

//   // Connecting channel state per client
//   const [connectingForClient, setConnectingForClient] = useState<string|null>(null);

//   // ── Auto-remove instant posts from queue after 5 min ──────────────────────
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       setQueuedPosts(prev => {
//         const filtered = prev.filter(p => {
//           // If post has no scheduleAt, it's an instant post — remove after QUEUE_DISPLAY_MS
//           const isInstant = !p.scheduleAt && !p.scheduled_at;
//           if (isInstant && p.queuedAt && (now - p.queuedAt) >= QUEUE_DISPLAY_MS) {
//             return false;
//           }
//           return true;
//         });
//         return filtered;
//       });
//     }, 10_000); // check every 10s
//     return () => clearInterval(interval);
//   }, []);

//   // Watch for GD tasks becoming completed → push notification
//   useEffect(() => {
//     const prev = prevGDTasksRef.current;
//     if (prev.length > 0) {
//       gdTasks.forEach(task => {
//         const prevTask = prev.find(t => t.id === task.id);
//         if (prevTask && prevTask.status !== "completed" && task.status === "completed") {
//           pushNotif(mkNotif("info", "GD Task Completed! 🎨",
//             `"${task.title}" by ${task.gdName} is ready for review`,
//             { label: "Review Now", view: "gd_tasks" }));
//         }
//       });
//     }
//     prevGDTasksRef.current = gdTasks;
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [gdTasks]);

//   // ── Init ────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const name = localStorage.getItem("socialflow_user_name") || "SMM Executive";
//     setUserName(name);
//     const stored = localStorage.getItem(GD_TASKS_KEY);
//     if (stored) setGdTasks(JSON.parse(stored));
//     if (token) {
//       loadOverview();
//       loadPosts();
//       loadSMMDashboard();
//       loadUsersForDropdowns();
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   useEffect(() => {
//     if (!token) return;
//     if (view === "overview")        { loadOverview(); loadPosts(); }
//     if (view === "queue")           loadQueued();
//     if (view === "drafts")          loadDrafts();
//     if (view === "published")       loadPublished();
//     if (view === "analytics")       loadAnalytics();
//     if (view === "calendar")        loadPosts();
//     if (view === "channels")        { loadChannels(); loadClientsWithChannels(); }
//     if (view === "design_projects") loadDesignProjects();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [view]);

//   // When client changes in compose, fetch their channels
//   useEffect(() => {
//     if (composeClientId) fetchClientChannels(composeClientId);
//     else { setClientConnectedChannels([]); setComposePlatforms([]); }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [composeClientId]);

//   // ── Loaders ─────────────────────────────────────────────────────────────────
//   const loadOverview = async () => {
//     setOvLoading(true);
//     try { const { data } = await apiGetOverview(token); if (data) setOverview(data); } catch {}
//     setOvLoading(false);
//   };

//   const loadSMMDashboard = async () => {
//     const { data } = await apiSMMDashboard(token);
//     if (data) {
//       const d = (data as any)?.data ?? data;
//       setSmmDashData(d);
//       extractUsers((d as any)?.recentProjects ?? []);
//     }
//   };

//   const extractUsers = (projects: any[]) => {
//     if (!Array.isArray(projects) || !projects.length) return;
//     const cm = new Map<string,{id:string;name:string;email:string}>();
//     const gm = new Map<string,{id:string;name:string;email:string}>();
//     projects.forEach((p:any) => {
//       const c = p.clientId;
//       if (c && typeof c==="object" && c._id)
//         cm.set(c._id, {id:c._id, name:c.name||"Client", email:c.email||""});
//       const g = p.designerId;
//       if (g && typeof g==="object" && g._id)
//         gm.set(g._id, {id:g._id, name:g.name||"Designer", email:g.email||""});
//     });
//     if (cm.size) setClientList(prev => {
//       const m=new Map(prev.map(x=>[x.id,x])); cm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
//     });
//     if (gm.size) setGdList(prev => {
//       const m=new Map(prev.map(x=>[x.id,x])); gm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
//     });
//   };

//   const loadUsersForDropdowns = async () => {
//     const sc = localStorage.getItem("socialflow_clients");
//     const st = localStorage.getItem("socialflow_team_members");
//     if (sc) { try { const p:any[]=JSON.parse(sc); if(p.length) setClientList(p.map(c=>({id:c.id||c._id,name:c.name,email:c.email||""}))); } catch {} }
//     if (st) { try { const p:any[]=JSON.parse(st); const gds=p.filter(m=>m.role==="graphic_designer"||m.role==="GD"); if(gds.length) setGdList(gds.map(g=>({id:g.id||g._id,name:g.name,email:g.email||""}))); } catch {} }
//     const { data } = await apiSMMGetDesignProjects(token,{limit:100});
//     const raw=data as any;
//     const projects=raw?.data?.projects??raw?.projects??raw?.data??[];
//     if(Array.isArray(projects)&&projects.length) extractUsers(projects);
//   };

//   // Fetch channels for a specific client (by clientId)
//  const fetchClientChannels = async (clientId: string) => {
//   if (!clientId) return;
//   setClientChannelsFetching(true);
//   try {
//     const endpoints = [
//       `${BASE_URL}/api/social-accounts?userId=${clientId}`,
//       `${BASE_URL}/api/social-accounts?clientId=${clientId}`,
//       `${BASE_URL}/api/clients/${clientId}/social-accounts`,
//       `${BASE_URL}/api/clients/${clientId}/channels`,
//     ];
//     let found: ConnectedChannel[] = [];
//     for (const url of endpoints) {
//       try {
//         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.ok) {
//           const json = await res.json();
//           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
//           const arr = Array.isArray(raw) ? raw : [];
//           if (arr.length > 0) { found = arr; break; }
//         }
//       } catch { /* try next */ }
//     }
//     setClientConnectedChannels(found);
//     setComposePlatforms([]);
//   } catch {
//     setClientConnectedChannels([]);
//   }
//   setClientChannelsFetching(false);
// };

//   // Load all clients and their channels for Channels view
// const loadClientsWithChannels = async () => {
//   setClientChannelsLoading(true);

//   // FIX: don't rely on stale clientList state — fetch fresh
//   let clients = clientList;
//   if (clients.length === 0) {
//     const { data } = await apiSMMGetDesignProjects(token, { limit: 100 });
//     const raw = data as any;
//     const projects = raw?.data?.projects ?? raw?.projects ?? raw?.data ?? [];
//     const cm = new Map<string, { id: string; name: string; email: string }>();
//     if (Array.isArray(projects)) {
//       projects.forEach((p: any) => {
//         const c = p.clientId;
//         if (c && typeof c === "object" && c._id)
//           cm.set(c._id, { id: c._id, name: c.name || "Client", email: c.email || "" });
//       });
//     }
//     clients = Array.from(cm.values());
//     if (clients.length > 0) setClientList(clients); // update state too
//   }

//   if (clients.length === 0) { setClientChannelsLoading(false); return; }

//   const updated: ClientWithChannels[] = [];
//   for (const client of clients) {
//     // FIX: try multiple endpoint patterns
//     const endpoints = [
//       `${BASE_URL}/api/social-accounts?userId=${client.id}`,
//       `${BASE_URL}/api/social-accounts?clientId=${client.id}`,
//       `${BASE_URL}/api/clients/${client.id}/social-accounts`,
//       `${BASE_URL}/api/clients/${client.id}/channels`,
//     ];
//     let channels: ConnectedChannel[] = [];
//     for (const url of endpoints) {
//       try {
//         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.ok) {
//           const json = await res.json();
//           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
//           const arr = Array.isArray(raw) ? raw : [];
//           if (arr.length > 0) { channels = arr; break; }
//         }
//       } catch { /* try next */ }
//     }
//     updated.push({ ...client, channels });
//   }
//   setClientsWithChannels(updated);
//   setClientChannelsLoading(false);
// };

//   const loadDesignProjects = async () => {
//     setDesignLoading(true);
//     const { data, error } = await apiSMMGetDesignProjects(token, designFilter ? {status:designFilter} : undefined);
//     if (error) { toast.error("Load failed: "+error); pushNotif(mkNotif("error","Projects Load Failed",error)); }
//     else {
//       const raw=data as any;
//       const list=raw?.data?.projects??raw?.projects??raw?.data??(Array.isArray(raw)?raw:[]);
//       const arr=Array.isArray(list)?list:[];
//       setDesignProjects(arr); extractUsers(arr);
//     }
//     setDesignLoading(false);
//   };

//   const loadPosts = async () => {
//     setPostsLoading(true); setPostsError(null);
//     const { data, error } = await apiGetPosts(token);
//     if (error) { if(!error.includes("404")&&!error.includes("not found")) setPostsError(error); }
//     else {
//       const raw=data as any;
//       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
//       setPosts(Array.isArray(list)?list:[]);
//     }
//     setPostsLoading(false);
//   };

//   const loadQueued = async () => {
//     setQueueLoading(true);
//     const { data, error } = await apiGetQueuedPosts(token);
//     if (error) toast.error("Queue load failed: "+error);
//     else {
//       const raw=data as any;
//       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
//       const arr: (Post & { queuedAt?: number })[] = Array.isArray(list) ? list : [];
//       // Preserve existing queuedAt timestamps for posts already in state
//       const merged = arr.map(p => {
//         const existing = queuedPosts.find(q => (q._id??q.id) === (p._id??p.id));
//         return existing ? { ...p, queuedAt: existing.queuedAt } : { ...p, queuedAt: Date.now() };
//       });
//       if (merged.length > queuedPosts.length && queuedPosts.length > 0)
//         pushNotif(mkNotif("info","Queue Updated",`${merged.length-queuedPosts.length} new post(s) added to queue`,{label:"View Queue",view:"queue"}));
//       setQueuedPosts(merged);
//     }
//     setQueueLoading(false);
//   };

//   const loadDrafts = async () => {
//     setDraftsLoading(true);
//     const { data, error } = await apiGetDrafts(token);
//     if (error) toast.error("Drafts load failed: "+error);
//     else {
//       const raw=data as any;
//       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
//       setDrafts(Array.isArray(list)?list:[]);
//     }
//     setDraftsLoading(false);
//   };

//   const loadPublished = async () => {
//     setPubLoading(true);
//     const { data, error } = await apiGetPosts(token, "published");
//     if (error) toast.error("Published load failed: "+error);
//     else {
//       const raw=data as any;
//       const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
//       setPubPosts(Array.isArray(list)?list:[]);
//     }
//     setPubLoading(false);
//   };

//   const loadAnalytics = async () => {
//     setAnaLoading(true);
//     const { data } = await apiGetAnalytics(token,"7d");
//     if (data?.data) setAnalytics(data.data);
//     setAnaLoading(false);
//   };

//   const loadChannels = async () => {
//     setChanLoading(true);
//     const { data, error } = await apiGetSocialAccounts(token);
//     if (error) toast.error("Channels load failed: "+error);
//     else {
//       const raw=data as any;
//       const list=raw?.channels??raw?.accounts??raw?.data??(Array.isArray(raw)?raw:[]);
//       setChannels(Array.isArray(list)?list:[]);
//     }
//     setChanLoading(false);
//   };

//   // ── Actions ─────────────────────────────────────────────────────────────────
//   const handleLogout = () => {
//     clearSession(); localStorage.removeItem("socialflow_role"); navigate("/"); toast.success("Logged out successfully");
//   };

//   const togglePlat = (id:string) => setComposePlatforms(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);

//   const handleCompose = async (action:"draft"|"queue"|"schedule") => {
//     if (!composeContent.trim()) { toast.error("Please add some content"); return; }
//     if (action!=="draft"&&composePlatforms.length===0) { toast.error("Please select at least one platform"); return; }
//     if (action!=="draft"&&!composeClientId) { toast.error("Please select a client"); return; }
//     setComposeSaving(true);
//     try {
//       if (action==="draft") {
//         if (editingDraft) {
//           const id=editingDraft._id??editingDraft.id??"";
//           const {error}=await apiUpdateDraft(token,id,composeContent,composePlatforms,composeMedia?[composeMedia]:[]);
//           if(error){toast.error("Update failed: "+error);return;}
//           toast.success("Draft updated!");
//           pushNotif(mkNotif("success","Draft Updated","Draft saved successfully",{label:"View Drafts",view:"drafts"}));
//         } else {
//           const {error}=await apiSaveDraft(token,composeContent,composePlatforms,composeTags,composeMedia?[composeMedia]:[]);
//           if(error){toast.error("Save failed: "+error);return;}
//           toast.success("Draft saved!");
//           pushNotif(mkNotif("success","Draft Saved","New draft saved",{label:"View Drafts",view:"drafts"}));
//         }
//         resetCompose(); setView("drafts");
//       } else {
//         let schedAt: string | null = null;
//         if (composeScheduleDate && composeScheduleTime) {
//           schedAt = new Date(`${composeScheduleDate}T${composeScheduleTime}`).toISOString();
//         } else if (composeScheduleDate) {
//           schedAt = new Date(`${composeScheduleDate}T00:00`).toISOString();
//         }
//         const {error}=await apiCreatePost(
//           token, composeContent, composePlatforms, composeTags,
//           composeMedia?[composeMedia]:[], schedAt??"",
//           // pass clientId so the backend publishes on client's channels
//           { clientId: composeClientId }
//         );
//         if(error){toast.error("Post failed: "+error);return;}
//         const isScheduled = !!schedAt;
//         toast.success(isScheduled?"Post scheduled!":"Post added to queue!");
//         pushNotif(mkNotif("success",isScheduled?"Post Scheduled":"Post Queued",
//           isScheduled?`Will publish on ${new Date(schedAt!).toLocaleString("en-IN")}`:"Instant post added to queue — will publish in ~5 minutes",
//           {label:"View Queue",view:"queue"}));
//         resetCompose(); setView("queue");
//         // Refresh queue immediately
//         setTimeout(() => loadQueued(), 500);
//       }
//     } catch { toast.error("Network error"); }
//     finally { setComposeSaving(false); }
//   };

//   const resetCompose = () => {
//     setComposeContent(""); setComposePlatforms([]);
//     setComposeScheduleDate(""); setComposeScheduleTime("");
//     setComposeMedia(null); setComposePreview(null);
//     setEditingDraft(null); setComposeTags([]); setComposeTagInput("");
//     setComposeClientId(""); setClientConnectedChannels([]);
//   };

//   const handleTagKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key==="Enter"||e.key===","||e.key===" ") {
//       e.preventDefault();
//       const t=composeTagInput.trim().replace(/^#/,"");
//       if(t&&!composeTags.includes(t)) setComposeTags(p=>[...p,t]);
//       setComposeTagInput("");
//     }
//   };

//   const handlePublishNow = async (pid:string) => {
//     setPublishingId(pid);
//     const {error}=await apiPublishPost(token,pid);
//     if(error){
//       toast.error("Publish failed: "+error);
//       pushNotif(mkNotif("error","Publish Failed",error));
//     } else {
//       toast.success("Post published!");
//       pushNotif(mkNotif("success","Published! 🎉","Post published successfully",{label:"View Published",view:"published"}));
//       // Remove from queue immediately
//       setQueuedPosts(prev => prev.filter(p => (p._id??p.id) !== pid));
//       loadOverview();
//     }
//     setPublishingId(null);
//   };

//   const handleDeleteDraft = async (id:string) => {
//     if(!confirm("Are you sure you want to delete this draft?")) return;
//     setDeletingDid(id);
//     const {error}=await apiDeleteDraft(token,id);
//     if(error) toast.error("Delete failed: "+error);
//     else{toast.success("Draft deleted!");pushNotif(mkNotif("warning","Draft Deleted","A draft was deleted"));loadDrafts();}
//     setDeletingDid(null);
//   };

//   const handleEditDraft = (d:Post) => {
//     setEditingDraft(d); setComposeContent(d.content); setComposePlatforms(d.platforms??[]);
//     setView("compose");
//   };

//   // Connect a channel for a specific client
// const handleConnectForClient = async (platId: string, clientId: string) => {
//   const key = `${clientId}_${platId}`;
//   setConnectingForClient(key);
//   const { data, error } = await apiGetOAuthUrl(token, platId);
//   if (error) { toast.error("OAuth failed: " + error); setConnectingForClient(null); return; }
//   const url = (data as any)?.authUrl ?? (data as any)?.url ?? (data as any)?.redirectUrl;
//   const oauthState = (data as any)?.state ?? (data as any)?.oauthState ?? null;
//   if (url) {
//     localStorage.setItem("oauth_platform", platId);
//     localStorage.setItem("oauth_client_id", clientId);
//     if (oauthState) localStorage.setItem("oauth_state", oauthState);
//     // window.open(url, "_blank");
//     window.location.href = url;
//     pushNotif(mkNotif("info", "Platform Connect", `Connecting ${platId} for client...`, { label: "View Channels", view: "channels" }));

//     // ✅ FIX: Refresh channels when user comes back after OAuth
//     const refreshOnFocus = () => {
//       window.removeEventListener("focus", refreshOnFocus);
//       setTimeout(() => {
//         loadClientsWithChannels();
//         if (composeClientId === clientId) fetchClientChannels(clientId);
//       }, 1500);
//     };
//     window.addEventListener("focus", refreshOnFocus);
//   } else toast.error("No OAuth URL returned");
//   setConnectingForClient(null);
// };

//   // Disconnect a channel for a client
//   const handleDisconnectClientChannel = async (channelId:string, clientId:string) => {
//     if(!confirm("Are you sure you want to disconnect this account?")) return;
//     const {error}=await apiDisconnectSocialAccount(token,channelId);
//     if(error) toast.error("Disconnect failed: "+error);
//     else{
//       toast.success("Disconnected!");
//       pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));
//       // Update local state
//       setClientsWithChannels(prev => prev.map(c =>
//         c.id === clientId
//           ? { ...c, channels: c.channels.filter(ch => (ch._id??ch.id) !== channelId) }
//           : c
//       ));
//       // Also refresh compose client channels if needed
//       if(composeClientId === clientId) fetchClientChannels(clientId);
//     }
//   };

//   const handleConnect = async (platId:string) => {
//     setConnPlat(platId);
//     const {data,error}=await apiGetOAuthUrl(token,platId);
//     if(error){toast.error("OAuth failed: "+error);setConnPlat(null);return;}
//     const url=(data as any)?.authUrl??(data as any)?.url??(data as any)?.redirectUrl;
//     const oauthState=(data as any)?.state??(data as any)?.oauthState??null;
//     if(url){
//       localStorage.setItem("oauth_platform", platId);
//       if(oauthState) localStorage.setItem("oauth_state", oauthState);
//       // window.open(url,"_blank");
//       window.location.href = url;
//       pushNotif(mkNotif("info","Platform Connect",`Connecting ${platId}...`,{label:"View Channels",view:"channels"}));
//     } else toast.error("No OAuth URL returned");
//     setConnPlat(null);
//   };

//   const handleDisconnect = async (cid:string) => {
//     if(!confirm("Are you sure you want to disconnect this account?")) return;
//     setDiscId(cid);
//     const {error}=await apiDisconnectSocialAccount(token,cid);
//     if(error) toast.error("Disconnect failed: "+error);
//     else{toast.success("Disconnected!");pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));loadChannels();}
//     setDiscId(null);
//   };

//   const handleCreateDP = async (e:React.FormEvent) => {
//     e.preventDefault();
//     if(!newDP.clientId||!newDP.designerId||!newDP.title||!newDP.deadline){toast.error("Please fill all required fields");return;}
//     setDpSaving(true);
//     const {error}=await apiSMMCreateDesignProject(token,{...newDP});
//     if(error) toast.error("Create failed: "+error);
//     else{
//       toast.success("Project created!");
//       pushNotif(mkNotif("success","Project Created",`"${newDP.title}" assigned to designer`,{label:"View Projects",view:"design_projects"}));
//       setShowAddDesign(false);
//       setNewDP({clientId:"",designerId:"",title:"",designType:"Social Post",deadline:"",priority:"Medium",description:"",targetAudience:"",brandColors:"",fontPreferences:"",revisionLimit:3});
//       loadDesignProjects();
//     }
//     setDpSaving(false);
//   };

//   const handleDeleteDP = async (id:string) => {
//     if(!confirm("Are you sure you want to delete this project?")) return;
//     const {error}=await apiSMMDeleteDesignProject(token,id);
//     if(error) toast.error("Delete failed: "+error);
//     else{toast.success("Deleted!");pushNotif(mkNotif("warning","Project Deleted","Design project deleted"));loadDesignProjects();}
//   };

//   const handleApproveReject = async (id:string, act:"approve"|"reject") => {
//     const note=prompt(act==="approve"?"Approval note (optional):":"Rejection reason:");
//     if(act==="reject"&&!note) return;
//     const {error}=await apiSMMApproveRejectProject(token,id,act,note??"");
//     if(error) toast.error("Action failed: "+error);
//     else{
//       toast.success(act==="approve"?"Approved!":"Rejected!");
//       pushNotif(mkNotif(act==="approve"?"success":"warning",act==="approve"?"Project Approved":"Project Rejected","Design project "+act+"ed",{label:"View Projects",view:"design_projects"}));
//       loadDesignProjects();
//     }
//   };

//   const handleRevisionReq = async (id:string) => {
//     const msg=prompt("Please enter revision details:");
//     if(!msg) return;
//     const {error}=await apiSMMRequestRevision(token,id,msg);
//     if(error) toast.error("Revision failed: "+error);
//     else{toast.success("Revision request sent!");pushNotif(mkNotif("info","Revision Requested","Revision request sent to designer",{label:"View Projects",view:"design_projects"}));loadDesignProjects();}
//   };

//   const openProjectDetail = async (project:DesignProject) => {
//     setSelProject(project);
//     const pid=project._id??project.id??"";
//     const {data}=await apiSMMGetComments(token,pid);
//     const raw=data as any;
//     const list=raw?.data??raw?.comments??[];
//     setProjComments(Array.isArray(list)?list:[]);
//   };

//   const handleSendComment = async () => {
//     if(!newComment.trim()||!selProject) return;
//     setCommentSending(true);
//     const pid=selProject._id??selProject.id??"";
//     const {error}=await apiSMMAddComment(token,pid,newComment);
//     if(error) toast.error("Comment failed: "+error);
//     else{toast.success("Comment sent!");setNewComment("");openProjectDetail(selProject);}
//     setCommentSending(false);
//   };

//   const handleAssignTask = (e:React.FormEvent) => {
//     e.preventDefault();
//     if(!newTask.title||!newTask.clientName||!newTask.deadline){toast.error("Please fill all required fields");return;}
//     const task:GDTask={
//       id:"T"+Date.now().toString().slice(-6), ...newTask,
//       status:"pending", assignedBy:`${userName} (SMM)`,
//       assignedAt:new Date().toISOString().split("T")[0],
//     };
//     const upd=[task,...gdTasks];
//     setGdTasks(upd);
//     localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
//     setShowAddTask(false);
//     setNewTask({title:"",description:"",clientName:"",gdName:"",platform:"Instagram",deadline:"",priority:"medium",notes:""});
//     toast.success("Task assigned!");
//     pushNotif(mkNotif("success","Task Assigned",`"${task.title}" assigned to designer`,{label:"GD Tasks",view:"gd_tasks"}));
//   };

//   const handleRevision = (tid:string, comment:string) => {
//     const upd=gdTasks.map(t=>t.id===tid?{...t,status:"revision" as TaskStatus,revisionComment:comment}:t);
//     setGdTasks(upd); localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
//     toast.success("Revision request sent");
//     pushNotif(mkNotif("info","Revision Requested","Revision requested for GD task",{label:"GD Tasks",view:"gd_tasks"}));
//   };

//   const handleGDTaskApproveReject = (taskId: string, action: "approve"|"reject") => {
//     const upd = gdTasks.map(t =>
//       t.id === taskId
//         ? { ...t, status: (action === "approve" ? "completed" : "revision") as TaskStatus }
//         : t
//     );
//     setGdTasks(upd);
//     localStorage.setItem(GD_TASKS_KEY, JSON.stringify(upd));
//     toast.success(action === "approve" ? "Task approved!" : "Task sent for revision!");
//     pushNotif(mkNotif(
//       action === "approve" ? "success" : "warning",
//       action === "approve" ? "Task Approved ✅" : "Task Rejected",
//       action === "approve" ? "GD task approved and marked complete" : "GD task sent back for revision",
//       { label: "GD Tasks", view: "gd_tasks" }
//     ));
//     setNotifOpen(false);
//   };

//   // ── Computed ─────────────────────────────────────────────────────────────────
//   const taskCounts = {
//     pending:     gdTasks.filter(t=>t.status==="pending").length,
//     in_progress: gdTasks.filter(t=>t.status==="in_progress").length,
//     revision:    gdTasks.filter(t=>t.status==="revision").length,
//     completed:   gdTasks.filter(t=>t.status==="completed").length,
//   };

//   const calDays = (() => {
//     const y=calMonth.getFullYear(), m=calMonth.getMonth();
//     const off=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
//     const cells:(Date|null)[]= [];
//     for(let i=0;i<off;i++) cells.push(null);
//     for(let d=1;d<=dim;d++) cells.push(new Date(y,m,d));
//     while(cells.length%7!==0) cells.push(null);
//     return cells;
//   })();

//   const postsForDay=(d:Date)=>posts.filter(p=>{
//     const ds=p.scheduleAt??p.scheduled_at??p.createdAt;
//     if(!ds)return false;
//     const pd=new Date(ds);
//     return pd.getFullYear()===d.getFullYear()&&pd.getMonth()===d.getMonth()&&pd.getDate()===d.getDate();
//   });

//   const weeklyData = analytics?.weeklyData?.length
//     ? analytics.weeklyData
//     : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>({day,reach:0,engagement:0}));

//   const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];

//   const ovTotal     = overview?.total     ?? (overview?.data as any)?.total     ?? posts.length;
//   const ovPublished = overview?.published ?? (overview?.data as any)?.published ?? posts.filter(p=>p.status==="published").length;
//   const ovScheduled = overview?.scheduled ?? (overview?.data as any)?.scheduled ?? posts.filter(p=>p.status==="scheduled").length;
//   const ovFailed    = overview?.failed    ?? (overview?.data as any)?.failed    ?? posts.filter(p=>p.status==="failed").length;

//   // Queue time remaining helper
//   const queueTimeLeft = (p: Post & { queuedAt?: number }): string | null => {
//     if (p.scheduleAt || p.scheduled_at) return null; // scheduled post — show schedule time
//     if (!p.queuedAt) return null;
//     const remaining = QUEUE_DISPLAY_MS - (Date.now() - p.queuedAt);
//     if (remaining <= 0) return "Publishing soon...";
//     const mins = Math.floor(remaining / 60000);
//     const secs = Math.floor((remaining % 60000) / 1000);
//     return `Publishing in ${mins}m ${secs}s`;
//   };

//   const navItems:{key:SMMView;icon:React.ElementType;label:string}[] = [
//     {key:"overview",        icon:LayoutDashboard, label:"Overview"},
//     {key:"compose",         icon:PenSquare,       label:"Create Post"},
//     {key:"queue",           icon:Inbox,           label:"Queue"},
//     {key:"drafts",          icon:FileText,        label:"Drafts"},
//     {key:"published",       icon:Globe,           label:"Published"},
//     {key:"calendar",        icon:Calendar,        label:"Calendar"},
//     {key:"design_projects", icon:Palette,         label:"Design Projects"},
//     {key:"gd_tasks",        icon:FileImage,       label:"GD Tasks"},
//     {key:"analytics",       icon:BarChart3,       label:"Analytics"},
//     {key:"channels",        icon:LinkIcon,        label:"Channels"},
//     {key:"clients_gd",      icon:Users,           label:"Clients & GD"},
//   ];

//   const viewTitle:Record<SMMView,string>={
//     overview:"SMM Dashboard", compose:editingDraft?"Edit Draft":"Create Post",
//     queue:"Queue", drafts:"Drafts", published:"Published",
//     calendar:"Content Calendar", gd_tasks:"GD Tasks",
//     design_projects:"Design Projects", analytics:"Analytics", channels:"Channels",
//     clients_gd:"Clients & Graphic Designers",
//   };

//   const statusBadge=(s:string)=>{
//     const m:Record<string,string>={
//       draft:"bg-yellow-100 text-yellow-700",
//       scheduled:"bg-blue-100 text-blue-700",
//       published:"bg-green-100 text-green-700",
//       failed:"bg-red-100 text-red-700",
//       queued:"bg-purple-100 text-purple-700",
//     };
//     return m[s]??"bg-slate-100 text-slate-600";
//   };
//   const notifIcon=(t:NotifType)=>({success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"}[t]);

//   // ── RENDER ───────────────────────────────────────────────────────────────────
//   return (
//     <div className={`smm-root min-h-screen flex ${dark?"smm-dark":""}`}>

//       {/* ── Sidebar ── */}
//       <aside className="smm-sidebar hidden md:flex w-64 flex-col shrink-0">
//         <div className="p-5 border-b smm-border"><Logo /></div>
//         <div className="p-4 flex-1">
//           <div className="smm-profile-card flex items-center gap-3 p-3 rounded-xl mb-4 border">
//             <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
//               <Megaphone className="w-5 h-5 text-white" />
//             </div>
//             <div className="min-w-0">
//               <div className="text-sm font-semibold smm-text-primary truncate">{userName}</div>
//               <div className="text-xs text-green-600 font-medium">SMM Executive</div>
//             </div>
//           </div>
//           <nav className="space-y-0.5">
//             {navItems.map(n=>(
//               <button key={n.key} onClick={()=>{resetCompose();setView(n.key);}}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${view===n.key?"smm-nav-active":"smm-nav-idle"}`}>
//                 <n.icon className="w-4 h-4 shrink-0" />
//                 {n.label}
//                 {n.key==="queue"&&queuedPosts.length>0&&(
//                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-green-100 text-green-700"}`}>
//                     {queuedPosts.length}
//                   </span>
//                 )}
//                 {n.key==="drafts"&&drafts.length>0&&(
//                   <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-yellow-100 text-yellow-700"}`}>
//                     {drafts.length}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t smm-border">
//           <Button variant="ghost" className="w-full justify-start smm-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
//             <LogOut className="w-4 h-4 mr-2" /> Logout
//           </Button>
//         </div>
//       </aside>

//       {/* ── Main ── */}
//       <main className="smm-main flex-1 min-w-0 overflow-y-auto">

//         {/* Header */}
//         <header className="smm-header px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//           <div>
//             <h1 className="text-xl font-bold smm-text-primary">{viewTitle[view]}</h1>
//             <p className="text-sm smm-text-muted">Welcome back, {userName}</p>
//           </div>
//           <div className="flex items-center gap-2">
//             {view==="gd_tasks"&&(
//               <Button onClick={()=>setShowAddTask(true)} className="bg-green-600 hover:bg-green-700">
//                 <Plus className="w-4 h-4 mr-2"/>Assign Task to GD
//               </Button>
//             )}
//             {view==="design_projects"&&(
//               <Button onClick={()=>setShowAddDesign(true)} className="bg-green-600 hover:bg-green-700">
//                 <Plus className="w-4 h-4 mr-2"/>New Design Project
//               </Button>
//             )}
//             {view==="queue"&&(
//               <Button variant="outline" size="sm" onClick={loadQueued} disabled={queueLoading} className="smm-btn-outline">
//                 <RefreshCw className={`w-4 h-4 mr-1 ${queueLoading?"animate-spin":""}`}/>Refresh
//               </Button>
//             )}
//             {view==="drafts"&&(
//               <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{resetCompose();setView("compose");}}>
//                 <Plus className="w-4 h-4 mr-1"/>New Post
//               </Button>
//             )}
//             {view==="published"&&(
//               <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
//                 <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
//               </Button>
//             )}
//             {view==="compose"&&(
//               <Button variant="outline" size="sm" onClick={()=>{resetCompose();setView("overview");}} className="smm-btn-outline">
//                 ← Back
//               </Button>
//             )}
//             {view==="channels"&&(
//               <Button variant="outline" size="sm" onClick={()=>{loadChannels();loadClientsWithChannels();}} className="smm-btn-outline">
//                 <RefreshCw className="w-4 h-4 mr-1"/>Refresh
//               </Button>
//             )}

//             {/* Dark Mode */}
//             <button onClick={()=>setDark(d=>!d)} className="smm-icon-btn p-2 rounded-lg transition" title={dark?"Light mode":"Dark mode"}>
//               {dark?<Sun className="w-5 h-5 text-yellow-400"/>:<Moon className="w-5 h-5 smm-text-secondary"/>}
//             </button>

//             {/* Notifications */}
//             <div className="relative" ref={notifRef}>
//               <button onClick={()=>setNotifOpen(o=>!o)} className="smm-icon-btn relative p-2 rounded-lg transition">
//                 <Bell className="w-5 h-5 smm-text-secondary"/>
//                 {totalBadgeCount>0&&(
//                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
//                     {totalBadgeCount>9?"9+":totalBadgeCount}
//                   </span>
//                 )}
//               </button>

//               {notifOpen&&(
//                 <div className="smm-notif-panel absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border overflow-hidden z-50">
//                   <div className="flex items-center justify-between px-4 py-3 border-b smm-border smm-notif-header">
//                     <span className="font-semibold text-sm smm-text-primary flex items-center gap-2">
//                       <Bell className="w-4 h-4"/>Notifications
//                       {unreadCount>0&&<span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
//                     </span>
//                     <div className="flex gap-2">
//                       {notifs.length>0&&(
//                         <>
//                           <button onClick={markAllRead} className="text-xs text-green-600 hover:underline">Mark all read</button>
//                           <button onClick={clearNotifs} className="text-xs text-red-500 hover:underline">Clear</button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex border-b smm-border">
//                       <button
//                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===0?"border-b-2 border-green-500 text-green-600":"smm-text-muted hover:smm-text-primary"}`}
//                         onClick={()=>setNotifTab(0)}
//                       >
//                         All Notifications {unreadCount>0&&<span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">{unreadCount}</span>}
//                       </button>
//                       <button
//                         className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===1?"border-b-2 border-orange-500 text-orange-600":"smm-text-muted hover:smm-text-primary"}`}
//                         onClick={()=>setNotifTab(1)}
//                       >
//                         GD Tasks Done {completedGDCount>0&&<span className="ml-1 bg-orange-500 text-white text-[9px] px-1 py-0.5 rounded-full">{completedGDCount}</span>}
//                       </button>
//                     </div>
//                     <div className="max-h-[400px] overflow-y-auto">
//                       {notifTab===0?(
//                         notifs.length===0?(
//                           <div className="px-4 py-8 text-center smm-text-muted">
//                             <BellOff className="w-8 h-8 mx-auto mb-2 opacity-30"/>
//                             <p className="text-sm">No notifications</p>
//                           </div>
//                         ):notifs.map(n=>(
//                           <div key={n.id} className={`smm-notif-item flex items-start gap-3 px-4 py-3 border-b last:border-b-0 smm-border transition ${!n.read?"smm-notif-unread":""}`}>
//                             <span className="text-base shrink-0 mt-0.5">{notifIcon(n.type)}</span>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between gap-1">
//                                 <p className="text-xs font-semibold smm-text-primary leading-tight">{n.title}</p>
//                                 <button onClick={()=>deleteNotif(n.id)} className="text-slate-300 hover:text-red-400 shrink-0"><X className="w-3 h-3"/></button>
//                               </div>
//                               <p className="text-xs smm-text-muted mt-0.5 leading-snug">{n.message}</p>
//                               <div className="flex items-center justify-between mt-1.5">
//                                 <span className="text-[10px] smm-text-muted">{new Date(n.timestamp).toLocaleString("en-IN",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</span>
//                                 {n.action&&(
//                                   <button onClick={()=>{setView(n.action!.view);setNotifOpen(false);}} className="text-[10px] text-green-600 font-medium hover:underline">
//                                     {n.action.label} →
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ):(
//                         completedGDCount===0?(
//                           <div className="px-4 py-8 text-center smm-text-muted">
//                             <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30"/>
//                             <p className="text-sm">No completed GD tasks pending review</p>
//                           </div>
//                         ):gdTasks.filter(t=>t.status==="completed").map(task=>(
//                           <div key={task.id} className="px-4 py-4 border-b last:border-b-0 smm-border bg-orange-50/50 dark:bg-orange-900/10">
//                             <div className="flex items-start justify-between gap-2 mb-2">
//                               <div className="flex-1 min-w-0">
//                                 <p className="text-xs font-bold smm-text-primary leading-tight flex items-center gap-1">
//                                   <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0"/>
//                                   {task.title}
//                                 </p>
//                                 <p className="text-[11px] smm-text-muted mt-0.5">Designer: <strong>{task.gdName}</strong></p>
//                                 <p className="text-[11px] smm-text-muted">Client: <strong>{task.clientName}</strong></p>
//                                 <p className="text-[11px] smm-text-muted">Platform: {task.platform} · Due: {task.deadline}</p>
//                                 {task.description&&<p className="text-[11px] smm-text-muted mt-1 line-clamp-2 italic">{task.description}</p>}
//                               </div>
//                               <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium shrink-0">Done</span>
//                             </div>
//                             <div className="flex gap-2 mt-2">
//                               <button
//                                 onClick={()=>handleGDTaskApproveReject(task.id,"approve")}
//                                 className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition"
//                               ><CheckCircle2 className="w-3 h-3"/>Approve</button>
//                               <button
//                                 onClick={()=>handleGDTaskApproveReject(task.id,"reject")}
//                                 className="flex-1 flex items-center justify-center gap-1 text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md font-medium transition"
//                               ><X className="w-3 h-3"/>Reject</button>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <div className="p-6">

//           {/* ── OVERVIEW ── */}
//           {view==="overview"&&(
//             <div className="space-y-6">
//               {postsError&&(
//                 <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200">
//                   <AlertCircle className="w-4 h-4 shrink-0"/>{postsError}
//                 </div>
//               )}

//               {smmDashData?.designStats&&(
//                 <div>
//                   <h3 className="font-semibold smm-text-muted mb-3 text-sm uppercase tracking-wide">Design Projects</h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {[
//                       {label:"Total",        value:smmDashData.designStats.totalProjects??0,       border:"border-l-slate-400"},
//                       {label:"Pending",      value:smmDashData.designStats.pendingProjects??0,     border:"border-l-yellow-400"},
//                       {label:"In Progress",  value:smmDashData.designStats.inProgressProjects??0,  border:"border-l-blue-400"},
//                       {label:"Under Review", value:smmDashData.designStats.underReviewProjects??0, border:"border-l-purple-400"},
//                       {label:"Revision",     value:smmDashData.designStats.revisionProjects??0,    border:"border-l-orange-400"},
//                       {label:"Completed",    value:smmDashData.designStats.completedProjects??0,   border:"border-l-green-400"},
//                       {label:"Overdue",      value:smmDashData.designStats.overdueProjects??0,     border:"border-l-red-400"},
//                       {label:"Due Today",    value:smmDashData.designStats.dueTodayProjects??0,    border:"border-l-pink-400"},
//                     ].map(s=>(
//                       <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.border} cursor-pointer hover:shadow-md transition`} onClick={()=>setView("design_projects")}>
//                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
//                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   {label:"Total Posts",        value:overviewLoading?"…":ovTotal,     icon:PenSquare,   color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30",    onClick:()=>setView("queue")},
//                   {label:"Published",          value:overviewLoading?"…":ovPublished, icon:Globe,       color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30",  onClick:()=>setView("published")},
//                   {label:"Scheduled / Queued", value:overviewLoading?"…":ovScheduled, icon:Clock,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30",onClick:()=>setView("queue")},
//                   {label:"Failed",             value:overviewLoading?"…":ovFailed,    icon:AlertCircle, color:"text-red-500",    bg:"bg-red-50 dark:bg-red-900/30",      onClick:()=>setView("published")},
//                 ].map(s=>(
//                   <Card key={s.label} className="smm-card p-5 cursor-pointer hover:shadow-md transition" onClick={s.onClick}>
//                     <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
//                     <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
//                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
//                   </Card>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Card className="smm-card p-5 border-l-4 border-l-purple-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("queue")}>
//                   <div className="flex items-center justify-between">
//                     <div><div className="text-sm font-semibold smm-text-primary">Queue</div><div className="text-xs smm-text-muted mt-0.5">Posts waiting to publish</div></div>
//                     <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"><Inbox className="w-5 h-5 text-purple-600"/></div>
//                   </div>
//                   <div className="text-2xl font-bold smm-text-primary mt-3">{queuedPosts.length}</div>
//                 </Card>
//                 <Card className="smm-card p-5 border-l-4 border-l-yellow-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("drafts")}>
//                   <div className="flex items-center justify-between">
//                     <div><div className="text-sm font-semibold smm-text-primary">Drafts</div><div className="text-xs smm-text-muted mt-0.5">Saved, not published yet</div></div>
//                     <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-yellow-600"/></div>
//                   </div>
//                   <div className="text-2xl font-bold smm-text-primary mt-3">{drafts.length}</div>
//                 </Card>
//                 <Card className="smm-card p-5 border-l-4 border-l-green-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("compose")}>
//                   <div className="flex items-center justify-between">
//                     <div><div className="text-sm font-semibold smm-text-primary">Create Post</div><div className="text-xs smm-text-muted mt-0.5">New post, schedule or draft</div></div>
//                     <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><PenSquare className="w-5 h-5 text-green-600"/></div>
//                   </div>
//                   <div className="text-sm text-green-600 font-medium mt-3">→ Create now</div>
//                 </Card>
//               </div>

//               <Card className="smm-card p-6">
//                 <h3 className="font-semibold smm-text-primary mb-3">Recent Posts</h3>
//                 {postsLoading?(
//                   <div className="flex items-center gap-2 smm-text-muted py-4"><Loader2 className="w-4 h-4 animate-spin"/>Loading...</div>
//                 ):posts.length===0?(
//                   <p className="text-sm smm-text-muted">No posts yet. <button onClick={()=>setView("compose")} className="text-green-600 hover:underline">Create your first post →</button></p>
//                 ):(
//                   <div className="space-y-2">
//                     {posts.slice(0,6).map(p=>(
//                       <div key={p._id??p.id} className="flex items-center gap-3 p-3 rounded-lg border smm-border hover:smm-bg-hover">
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm smm-text-primary truncate">{p.content}</p>
//                           <div className="flex gap-2 mt-1 flex-wrap">
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
//                             {p.platforms?.slice(0,2).map(pl=><span key={pl} className="text-xs smm-text-muted capitalize">{pl}</span>)}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Card>
//             </div>
//           )}

//           {/* ── COMPOSE ── */}
//           {view==="compose"&&(
//             <div className="max-w-2xl space-y-5">
//               {editingDraft&&(
//                 <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 px-4 py-2.5 rounded-lg border border-yellow-200 dark:border-yellow-700">
//                   <Edit2 className="w-4 h-4"/>Editing a draft
//                 </div>
//               )}
//               <Card className="smm-card p-6 space-y-5">

//                 {/* ── Step 1: Select Client ── */}
//                 <div>
//                   <Label className="smm-text-primary font-semibold">Step 1 — Select Client *</Label>
//                   <select
//                     value={composeClientId}
//                     onChange={e => setComposeClientId(e.target.value)}
//                     className="smm-select mt-2 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">— Select Client —</option>
//                     {clientList.map(c => (
//                       <option key={c.id} value={c.id}>{c.name}{c.email?` (${c.email})`:""}</option>
//                     ))}
//                   </select>
//                   {composeClientId&&(
//                     <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
//                       ✓ Post will be created for: <strong>{clientList.find(c=>c.id===composeClientId)?.name}</strong>
//                     </p>
//                   )}
//                 </div>

//                 {/* ── Step 2: Select Platform (from client's connected channels) ── */}
//                 <div>
//                   <Label className="smm-text-primary font-semibold">
//                     Step 2 — Select Platform *
//                     {composeClientId&&<span className="ml-2 text-xs font-normal smm-text-muted">(client's connected channels)</span>}
//                   </Label>
//                   {!composeClientId?(
//                     <p className="text-xs smm-text-muted mt-2 italic">Please select a client first to see their connected channels.</p>
//                   ):clientChannelsFetching?(
//                     <div className="flex items-center gap-2 smm-text-muted mt-2 text-sm"><Loader2 className="w-4 h-4 animate-spin"/>Loading channels...</div>
//                   ):clientConnectedChannels.length===0?(
//                     <div className="mt-2 space-y-2">
//                       <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
//                         ⚠️ This client has no connected channels yet.{" "}
//                         <button onClick={()=>setView("channels")} className="font-semibold underline">
//                           Go to Channels to connect
//                         </button>
//                       </p>
//                       {/* Fallback: allow manual platform selection */}
//                       <p className="text-xs smm-text-muted">Or select platform manually:</p>
//                       <div className="flex flex-wrap gap-2">
//                         {PLATFORMS.map(p=>(
//                           <button key={p.id} type="button" onClick={()=>togglePlat(p.id)}
//                             className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${composePlatforms.includes(p.id)?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
//                             {p.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ):(
//                     <div className="mt-2 space-y-2">
//                       <div className="flex flex-wrap gap-2">
//                         {clientConnectedChannels.map(ch=>{
//                           const platId = ch.platform?.toLowerCase();
//                           const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===platId);
//                           const channelId = ch._id??ch.id??platId;
//                           const isSelected = composePlatforms.includes(platId);
//                           return(
//                             <button key={channelId} type="button"
//                               onClick={()=>togglePlat(platId)}
//                               className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${isSelected?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
//                               <span>{platInfo?.icon??"🔗"}</span>
//                               <span className="capitalize">{platInfo?.label??ch.platform}</span>
//                               {(ch.username||ch.name)&&(
//                                 <span className={`text-xs ${isSelected?"text-white/80":"smm-text-muted"}`}>
//                                   @{ch.username??ch.name}
//                                 </span>
//                               )}
//                             </button>
//                           );
//                         })}
//                       </div>
//                       <p className="text-xs smm-text-muted">
//                         {composePlatforms.length} platform{composePlatforms.length!==1?"s":""} selected
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* ── Step 3: Content ── */}
//                 <div>
//                   <Label className="smm-text-primary font-semibold">Step 3 — Content *</Label>
//                   <textarea value={composeContent} onChange={e=>setComposeContent(e.target.value)}
//                     placeholder="Write your post here..." rows={6} maxLength={2000}
//                     className="smm-textarea mt-2 w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
//                   <div className="text-xs smm-text-muted text-right mt-1">{composeContent.length}/2000</div>
//                 </div>

//                 {/* ── Step 4: Schedule (optional) ── */}
//                 <div>
//                   <Label className="smm-text-primary font-semibold">Step 4 — Schedule Date (optional)</Label>
//                   <p className="text-xs smm-text-muted mb-2">Leave empty for instant post (will show in queue for 5 minutes)</p>
//                   <Input type="date" value={composeScheduleDate} onChange={e=>setComposeScheduleDate(e.target.value)}
//                     min={new Date().toISOString().slice(0,10)} className="smm-input"/>
//                 </div>
//                 {composeScheduleDate&&(
//                   <div>
//                     <Label className="smm-text-primary">Schedule Time</Label>
//                     <Input type="time" value={composeScheduleTime} onChange={e=>setComposeScheduleTime(e.target.value)} className="smm-input mt-2"/>
//                     <p className="text-xs smm-text-muted mt-1">
//                       {composeScheduleTime
//                         ? `✅ Will publish on ${composeScheduleDate} at ${composeScheduleTime}`
//                         : "Leave time empty to schedule at midnight"}
//                     </p>
//                   </div>
//                 )}

//                 {/* Tags */}
//                 <div>
//                   <Label className="smm-text-primary">Tags (optional)</Label>
//                   <div className="mt-2">
//                     <div className="flex flex-wrap gap-1.5 mb-2">
//                       {composeTags.map(tag=>(
//                         <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
//                           #{tag}
//                           <button type="button" onClick={()=>setComposeTags(p=>p.filter(t=>t!==tag))} className="hover:text-red-500">
//                             <X className="w-3 h-3"/>
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                     <Input value={composeTagInput} onChange={e=>setComposeTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
//                       placeholder="Type a tag and press Enter" className="smm-input text-sm"/>
//                   </div>
//                 </div>

//                 {/* Media */}
//                 <div>
//                   <Label className="smm-text-primary">Image / Video (optional)</Label>
//                   {composePreview?(
//                     <div className="relative mt-2 inline-block">
//                       <img src={composePreview} alt="preview" className="max-h-40 rounded-lg border smm-border"/>
//                       <button type="button" onClick={()=>{setComposePreview(null);setComposeMedia(null);}}
//                         className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
//                     </div>
//                   ):(
//                     <label className="smm-upload-area mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer text-sm smm-text-muted">
//                       🖼 Upload image or video
//                       <input type="file" accept="image/*,video/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f){setComposeMedia(f);setComposePreview(URL.createObjectURL(f));}}}/>
//                     </label>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3 flex-wrap pt-2 border-t smm-border">
//                   <Button variant="outline" onClick={()=>handleCompose("draft")} disabled={composeSaving} className="smm-btn-outline">
//                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
//                     <FileText className="w-4 h-4 mr-2"/>{editingDraft?"Update Draft":"Save as Draft"}
//                   </Button>
//                   <Button className="bg-purple-600 hover:bg-purple-700" onClick={()=>handleCompose("queue")} disabled={composeSaving}>
//                     {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
//                     <Inbox className="w-4 h-4 mr-2"/>
//                     {composeScheduleDate?"Schedule Post":"Add to Queue (Instant)"}
//                   </Button>
//                 </div>
//               </Card>
//             </div>
//           )}

//           {/* ── QUEUE ── */}
//           {view==="queue"&&(
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm smm-text-muted">Posts in queue — instant posts auto-publish in 5 minutes</p>
//                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
//                   <Plus className="w-4 h-4 mr-1"/>New Post
//                 </Button>
//               </div>
//               {queueLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):queuedPosts.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary font-medium">Queue is empty</p>
//                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
//                     <Plus className="w-4 h-4 mr-2"/>Create Post
//                   </Button>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {queuedPosts.map(p=>{
//                     const pid=p._id??p.id??"";
//                     const timeLeft = queueTimeLeft(p);
//                     const isScheduled = !!(p.scheduleAt??p.scheduled_at);
//                     return(
//                       <Card key={pid} className="smm-card p-5">
//                         <div className="flex items-start justify-between gap-4 flex-wrap">
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 mb-2 flex-wrap">
//                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
//                               {isScheduled?(
//                                 <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
//                                   📅 Scheduled
//                                 </span>
//                               ):(
//                                 <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium animate-pulse">
//                                   ⚡ Instant
//                                 </span>
//                               )}
//                               {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
//                             </div>
//                             <p className="text-sm smm-text-primary">{p.content}</p>
//                             {isScheduled?(
//                               <p className="text-xs smm-text-muted mt-2 flex items-center gap-1">
//                                 <Clock className="w-3 h-3"/>
//                                 Scheduled: {new Date(p.scheduleAt??p.scheduled_at??"").toLocaleString("en-IN")}
//                               </p>
//                             ):timeLeft?(
//                               <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
//                                 <Clock className="w-3 h-3"/>{timeLeft}
//                               </p>
//                             ):null}
//                           </div>
//                           <Button size="sm" className="bg-green-600 hover:bg-green-700 shrink-0" onClick={()=>handlePublishNow(pid)} disabled={publishingId===pid}>
//                             {publishingId===pid?<Loader2 className="w-4 h-4 animate-spin"/>:<><CheckCircle2 className="w-4 h-4 mr-1"/>Publish Now</>}
//                           </Button>
//                         </div>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── DRAFTS ── */}
//           {view==="drafts"&&(
//             <div className="space-y-4">
//               <p className="text-sm smm-text-muted">Saved drafts — edit or add to queue</p>
//               {draftsLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):drafts.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary font-medium">No drafts found</p>
//                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
//                     <Plus className="w-4 h-4 mr-2"/>Create Post
//                   </Button>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {drafts.map(d=>{const did=d._id??d.id??"";return(
//                     <Card key={did} className="smm-card p-5">
//                       <div className="flex items-start justify-between gap-4 flex-wrap">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2 flex-wrap">
//                             <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">Draft</span>
//                             {d.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
//                           </div>
//                           <p className="text-sm smm-text-primary line-clamp-3">{d.content}</p>
//                           {d.createdAt&&<p className="text-xs smm-text-muted mt-2">Saved: {new Date(d.createdAt).toLocaleString("en-IN")}</p>}
//                         </div>
//                         <div className="flex gap-2 shrink-0">
//                           <Button size="sm" variant="outline" onClick={()=>handleEditDraft(d)} className="smm-btn-outline">
//                             <Edit2 className="w-4 h-4 mr-1"/>Edit
//                           </Button>
//                           <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDraft(did)} disabled={deletingDid===did}>
//                             {deletingDid===did?<Loader2 className="w-4 h-4 animate-spin"/>:<Trash2 className="w-4 h-4"/>}
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   );})}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── PUBLISHED ── */}
//           {view==="published"&&(
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm smm-text-muted">Record of all published posts</p>
//                 <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
//                   <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
//                 </Button>
//               </div>
//               {pubLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):pubPosts.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary font-medium">No published posts yet</p>
//                   <p className="text-xs smm-text-muted mt-1">Posts published from the queue will appear here</p>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {pubPosts.map(p=>{const pid=p._id??p.id??"";return(
//                     <Card key={pid} className="smm-card p-5">
//                       <div className="flex items-start gap-4">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2 flex-wrap">
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
//                             {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
//                           </div>
//                           <p className="text-sm smm-text-primary">{p.content}</p>
//                           {p.createdAt&&<p className="text-xs smm-text-muted mt-2 flex items-center gap-1"><Globe className="w-3 h-3"/>Published: {new Date(p.createdAt).toLocaleString("en-IN")}</p>}
//                         </div>
//                       </div>
//                     </Card>
//                   );})}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── CHANNELS ── */}
//           {view==="channels"&&(
//             <div className="space-y-8">

//               {/* ── My Agency Channels ── */}
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
//                     <LinkIcon className="w-4 h-4 text-green-600"/>
//                   </div>
//                   <div>
//                     <h2 className="text-base font-bold smm-text-primary">My Agency Channels</h2>
//                     <p className="text-xs smm-text-muted">Your own connected social accounts</p>
//                   </div>
//                 </div>
//                 {channelsLoading?(
//                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//                 ):(
//                   <>
//                     {channels.length>0&&(
//                       <div className="space-y-3 mb-4">
//                         {channels.map(ch=>{
//                           const cid=ch._id??ch.id??"";
//                           const platInfo=CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
//                           return(
//                             <Card key={cid} className="smm-card p-4 flex items-center justify-between gap-4">
//                               <div className="flex items-center gap-3">
//                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>{platInfo?.icon??"🔗"}</div>
//                                 <div>
//                                   <div className="text-sm font-semibold smm-text-primary capitalize">{ch.platform}</div>
//                                   <div className="text-xs smm-text-muted">{ch.username??ch.name??"Connected"}</div>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">Connected</span>
//                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDisconnect(cid)} disabled={disconnectingId===cid}>
//                                   {disconnectingId===cid?<Loader2 className="w-4 h-4 animate-spin"/>:"Disconnect"}
//                                 </Button>
//                               </div>
//                             </Card>
//                           );
//                         })}
//                       </div>
//                     )}
//                     <div>
//                       <h4 className="text-sm font-semibold smm-text-primary mb-3">Connect a New Account</h4>
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                         {CONNECTABLE_PLATFORMS.map(p=>{
//                           const isConnected=channels.some(ch=>ch.platform?.toLowerCase()===p.id);
//                           return(
//                             <Card key={p.id} className={`smm-card p-4 flex items-center justify-between gap-3 ${isConnected?"opacity-60":""}`}>
//                               <div className="flex items-center gap-2">
//                                 <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base bg-gradient-to-br ${p.color}`}>{p.icon}</span>
//                                 <div className="text-sm font-medium smm-text-primary">{p.label}</div>
//                               </div>
//                               <Button size="sm"
//                                 className={isConnected?"bg-slate-400 cursor-not-allowed":"bg-green-600 hover:bg-green-700"}
//                                 onClick={()=>!isConnected&&handleConnect(p.id)}
//                                 disabled={connectingPlatform===p.id||isConnected}>
//                                 {connectingPlatform===p.id?<Loader2 className="w-4 h-4 animate-spin"/>:isConnected?"✓ Connected":"Connect"}
//                               </Button>
//                             </Card>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* ── Client Channels ── */}
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
//                     <Users className="w-4 h-4 text-blue-600"/>
//                   </div>
//                   <div>
//                     <h2 className="text-base font-bold smm-text-primary">Client Channels</h2>
//                     <p className="text-xs smm-text-muted">Manage social accounts for each client — connect platforms on their behalf</p>
//                   </div>
//                 </div>
//                 {clientChannelsLoading?(
//                   <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading client channels...</div>
//                 ):clientList.length===0?(
//                   <Card className="smm-card p-8 text-center">
//                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
//                     <p className="text-sm smm-text-muted">No clients found. Clients appear once design projects are loaded.</p>
//                     <Button variant="outline" size="sm" className="mt-3 smm-btn-outline" onClick={()=>{loadUsersForDropdowns().then(()=>loadClientsWithChannels());}}>
//                       <RefreshCw className="w-4 h-4 mr-1"/>Load Clients
//                     </Button>
//                   </Card>
//                 ):(
//                   <div className="space-y-4">
//                     {(clientsWithChannels.length > 0 ? clientsWithChannels : clientList.map(c=>({...c,channels:[]}))).map(client=>(
//                       <Card key={client.id} className="smm-card p-5">
//                         {/* Client header */}
//                         <div className="flex items-center gap-3 mb-4">
//                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
//                             <span className="text-sm font-bold text-blue-600">{client.name.charAt(0).toUpperCase()}</span>
//                           </div>
//                           <div>
//                             <div className="font-semibold smm-text-primary text-sm">{client.name}</div>
//                             {client.email&&<div className="text-xs smm-text-muted">{client.email}</div>}
//                           </div>
//                           <div className="ml-auto">
//                             {(client as ClientWithChannels).channels?.length > 0 ? (
//                               <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
//                                 {(client as ClientWithChannels).channels.length} connected
//                               </span>
//                             ):(
//                               <span className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full">
//                                 No channels
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Connected channels for this client */}
//                         {(client as ClientWithChannels).channels?.length > 0 && (
//                           <div className="mb-4">
//                             <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connected Accounts</p>
//                             <div className="space-y-2">
//                               {(client as ClientWithChannels).channels.map(ch=>{
//                                 const chId = ch._id??ch.id??"";
//                                 const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
//                                 return(
//                                   <div key={chId} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border smm-border bg-slate-50/50 dark:bg-slate-800/30">
//                                     <div className="flex items-center gap-2">
//                                       <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>
//                                         {platInfo?.icon??"🔗"}
//                                       </span>
//                                       <div>
//                                         <div className="text-xs font-medium smm-text-primary capitalize">{platInfo?.label??ch.platform}</div>
//                                         {(ch.username||ch.name)&&<div className="text-[10px] smm-text-muted">@{ch.username??ch.name}</div>}
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                       <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium">✓ Connected</span>
//                                       <button
//                                         onClick={()=>handleDisconnectClientChannel(chId, client.id)}
//                                         className="text-[10px] text-red-500 hover:underline px-1"
//                                       >Disconnect</button>
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         )}

//                         {/* Connect new platform for this client */}
//                         <div>
//                           <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connect Platform</p>
//                           <div className="flex flex-wrap gap-2">
//                             {CONNECTABLE_PLATFORMS.map(plat=>{
//                               const key=`${client.id}_${plat.id}`;
//                               const isLoading=connectingForClient===key;
//                               const isAlreadyConnected=(client as ClientWithChannels).channels?.some(ch=>ch.platform?.toLowerCase()===plat.id);
//                               return(
//                                 <Button key={plat.id} size="sm" variant="outline"
//                                   className={`text-xs gap-1.5 ${isAlreadyConnected?"opacity-50 cursor-not-allowed smm-btn-outline":"smm-btn-outline hover:border-blue-500 hover:text-blue-600"}`}
//                                   onClick={()=>!isAlreadyConnected&&handleConnectForClient(plat.id, client.id)}
//                                   disabled={isLoading||isAlreadyConnected}>
//                                   {isLoading?<Loader2 className="w-3 h-3 animate-spin"/>:<span>{plat.icon}</span>}
//                                   {isAlreadyConnected?"✓ "+plat.label:plat.label}
//                                 </Button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ── CLIENTS & GD ── */}
//           {view==="clients_gd"&&(
//             <div className="space-y-8">
//               {/* Clients Section */}
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
//                     <Users className="w-4 h-4 text-blue-600"/>
//                   </div>
//                   <div>
//                     <h2 className="text-base font-bold smm-text-primary">Clients</h2>
//                     <p className="text-xs smm-text-muted">{clientList.length} client(s)</p>
//                   </div>
//                 </div>
//                 {clientList.length===0?(
//                   <Card className="smm-card p-8 text-center">
//                     <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
//                     <p className="text-sm smm-text-muted">No clients found. They will appear once design projects are loaded.</p>
//                   </Card>
//                 ):(
//                   <div className="space-y-2">
//                     {clientList.map(c=>(
//                       <Card key={c.id} className="smm-card p-4 flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
//                           <span className="text-sm font-bold text-blue-600">{c.name.charAt(0).toUpperCase()}</span>
//                         </div>
//                         <div>
//                           <div className="font-semibold smm-text-primary text-sm">{c.name}</div>
//                           {c.email&&<div className="text-xs smm-text-muted">{c.email}</div>}
//                         </div>
//                         <Button size="sm" variant="outline" className="ml-auto smm-btn-outline text-xs" onClick={()=>setView("channels")}>
//                           <LinkIcon className="w-3 h-3 mr-1"/>Manage Channels
//                         </Button>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Graphic Designers Section */}
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
//                     <Palette className="w-4 h-4 text-purple-600"/>
//                   </div>
//                   <div>
//                     <h2 className="text-base font-bold smm-text-primary">Graphic Designers</h2>
//                     <p className="text-xs smm-text-muted">{gdList.length} designer(s)</p>
//                   </div>
//                 </div>
//                 {gdList.length===0?(
//                   <Card className="smm-card p-8 text-center">
//                     <Palette className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
//                     <p className="text-sm smm-text-muted">No graphic designers found. They appear once design projects are loaded.</p>
//                   </Card>
//                 ):(
//                   <div className="space-y-2">
//                     {gdList.map(g=>(
//                       <Card key={g.id} className="smm-card p-4 flex items-center gap-3">
//                         <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center shrink-0">
//                           <span className="text-sm font-bold text-purple-600">{g.name.charAt(0).toUpperCase()}</span>
//                         </div>
//                         <div>
//                           <div className="font-semibold smm-text-primary text-sm">{g.name}</div>
//                           {g.email&&<div className="text-xs smm-text-muted">{g.email}</div>}
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ── CALENDAR ── */}
//           {view==="calendar"&&(
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()-1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">←</button>
//                 <span className="font-semibold smm-text-primary min-w-[160px] text-center">{monthNames[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
//                 <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()+1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">→</button>
//                 <Button size="sm" variant="outline" onClick={()=>setCalMonth(new Date())} className="smm-btn-outline">Today</Button>
//                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}><Plus className="w-3 h-3 mr-1"/>New Post</Button>
//               </div>
//               <Card className="smm-card overflow-hidden">
//                 <div className="grid grid-cols-7 border-b smm-border smm-cal-header">
//                   {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
//                     <div key={d} className="p-3 text-xs font-semibold smm-text-muted text-center uppercase tracking-wide">{d}</div>
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-7">
//                   {calDays.map((d,i)=>{
//                     const dp=d?postsForDay(d):[];
//                     const today=d?d.toDateString()===new Date().toDateString():false;
//                     return(
//                       <div key={i} className="min-h-[100px] border-r border-b smm-border p-2 last:border-r-0">
//                         {d&&(
//                           <>
//                             <div className={`text-xs font-medium mb-1 inline-flex items-center justify-center w-6 h-6 rounded-full ${today?"bg-green-600 text-white":"smm-text-muted"}`}>{d.getDate()}</div>
//                             <div className="space-y-1">
//                               {dp.slice(0,2).map(p=>(
//                                 <div key={p._id??p.id} className={`text-xs px-2 py-1 rounded truncate ${statusBadge(p.status)}`}>{p.content.slice(0,20)}…</div>
//                               ))}
//                               {dp.length>2&&<div className="text-xs smm-text-muted px-1">+{dp.length-2} more</div>}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </Card>
//             </div>
//           )}

//           {/* ── GD TASKS ── */}
//           {view==="gd_tasks"&&(
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {[
//                   {label:"Pending",        count:taskCounts.pending,     color:"border-l-slate-400"},
//                   {label:"In Progress",    count:taskCounts.in_progress, color:"border-l-blue-400"},
//                   {label:"Needs Revision", count:taskCounts.revision,    color:"border-l-orange-400"},
//                   {label:"Completed",      count:taskCounts.completed,   color:"border-l-green-400"},
//                 ].map(s=>(
//                   <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.color}`}>
//                     <div className="text-2xl font-bold smm-text-primary">{s.count}</div>
//                     <div className="text-xs smm-text-muted mt-1">{s.label}</div>
//                   </Card>
//                 ))}
//               </div>
//               {gdTasks.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <FileImage className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary">No tasks yet. Click "Assign Task to GD" to get started.</p>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {gdTasks.map(task=>(
//                     <Card key={task.id} className="smm-card p-5">
//                       <div className="flex items-start justify-between gap-4 flex-wrap">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 flex-wrap mb-1">
//                             <h3 className="font-semibold smm-text-primary">{task.title}</h3>
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status==="completed"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":task.status==="revision"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":task.status==="in_progress"?"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300":"bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}>
//                               {task.status.replace("_"," ")}
//                             </span>
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.priority==="high"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":task.priority==="medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
//                               {task.priority}
//                             </span>
//                           </div>
//                           <p className="text-sm smm-text-muted mb-2">{task.description}</p>
//                           <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap">
//                             <span>Client: <strong className="smm-text-secondary">{task.clientName}</strong></span>
//                             {task.gdName&&<span>Designer: <strong className="smm-text-secondary">{task.gdName}</strong></span>}
//                             <span>Platform: <strong className="smm-text-secondary">{task.platform}</strong></span>
//                             <span>Due: <strong className="smm-text-secondary">{task.deadline}</strong></span>
//                           </div>
//                           {task.status==="revision"&&task.revisionComment&&(
//                             <div className="mt-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-800">
//                               Revision note: {task.revisionComment}
//                             </div>
//                           )}
//                         </div>
//                         {task.status==="completed"&&(
//                           <div className="flex flex-col gap-2">
//                             <Button size="sm" variant="outline" className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
//                               onClick={()=>{const c=prompt("Revision comment:");if(c)handleRevision(task.id,c);}}>
//                               Request Revision
//                             </Button>
//                             <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={()=>handleGDTaskApproveReject(task.id,"approve")}>
//                               <CheckCircle2 className="w-3 h-3 mr-1"/>Approve
//                             </Button>
//                             <Button size="sm" variant="outline" className="text-xs text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
//                               onClick={()=>handleGDTaskApproveReject(task.id,"reject")}>
//                               Reject
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── DESIGN PROJECTS ── */}
//           {view==="design_projects"&&(
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 flex-wrap">
//                 <select value={designFilter} onChange={e=>{setDesignFilter(e.target.value);setTimeout(()=>loadDesignProjects(),0);}}
//                   className="smm-select px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                   <option value="">All Status</option>
//                   {["Pending","In Progress","Under Review","Revision","Completed","Cancelled"].map(s=>(
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>
//                 <Button size="sm" variant="outline" onClick={loadDesignProjects} disabled={designLoading} className="smm-btn-outline">
//                   <RefreshCw className={`w-4 h-4 mr-1 ${designLoading?"animate-spin":""}`}/>Refresh
//                 </Button>
//               </div>
//               {designLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):designProjects.length===0?(
//                 <Card className="smm-card p-12 text-center">
//                   <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
//                   <p className="smm-text-secondary font-medium">No design projects found</p>
//                   <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setShowAddDesign(true)}>
//                     <Plus className="w-4 h-4 mr-2"/>New Design Project
//                   </Button>
//                 </Card>
//               ):(
//                 <div className="space-y-3">
//                   {designProjects.map(p=>{
//                     const pid=p._id??p.id??"";
//                     const clientName=typeof p.clientId==="object"?p.clientId?.name:clientList.find(c=>c.id===p.clientId)?.name??"—";
//                     const designerName=typeof p.designerId==="object"?p.designerId?.name:gdList.find(g=>g.id===p.designerId)?.name??"—";
//                     const sc:Record<string,string>={
//                       "Pending":"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
//                       "In Progress":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
//                       "Under Review":"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
//                       "Revision":"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
//                       "Completed":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
//                       "Cancelled":"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
//                     };
//                     return(
//                       <Card key={pid} className="smm-card p-5">
//                         <div className="flex items-start justify-between gap-4 flex-wrap">
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 flex-wrap mb-1">
//                               <h3 className="font-semibold smm-text-primary">{p.title}</h3>
//                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc[p.status]??"bg-slate-100 text-slate-600"}`}>{p.status}</span>
//                               <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.priority==="Urgent"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":p.priority==="High"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":p.priority==="Medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
//                                 {p.priority}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap mt-1">
//                               <span>Type: <strong className="smm-text-secondary">{p.designType}</strong></span>
//                               <span>Client: <strong className="smm-text-secondary">{clientName}</strong></span>
//                               <span>Designer: <strong className="smm-text-secondary">{designerName}</strong></span>
//                               <span>Deadline: <strong className="smm-text-secondary">{p.deadline?.slice(0,10)}</strong></span>
//                             </div>
//                             {p.description&&<p className="text-sm smm-text-muted mt-1 truncate">{p.description}</p>}
//                           </div>
//                           <div className="flex gap-2 flex-wrap shrink-0">
//                             <Button size="sm" variant="outline" onClick={()=>openProjectDetail(p)} className="smm-btn-outline">
//                               <MessageSquare className="w-4 h-4 mr-1"/>Comments
//                             </Button>
//                             {p.status==="Under Review"&&(
//                               <>
//                                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>handleApproveReject(pid,"approve")}>
//                                   <CheckCircle2 className="w-4 h-4 mr-1"/>Approve
//                                 </Button>
//                                 <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={()=>handleRevisionReq(pid)}>
//                                   Revision
//                                 </Button>
//                                 <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleApproveReject(pid,"reject")}>
//                                   Reject
//                                 </Button>
//                               </>
//                             )}
//                             <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDP(pid)}>
//                               <Trash2 className="w-4 h-4"/>
//                             </Button>
//                           </div>
//                         </div>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── ANALYTICS ── */}
//           {view==="analytics"&&(
//             <div className="space-y-6">
//               {analyticsLoading?(
//                 <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
//               ):(
//                 <>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {[
//                       {label:"Total Reach",  value:analytics?.reach??       "—", icon:Eye,        color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30"},
//                       {label:"Impressions",  value:analytics?.impressions?? "—", icon:TrendingUp,  color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30"},
//                       {label:"Engagement",   value:analytics?.engagement??  "—", icon:Heart,       color:"text-pink-600",   bg:"bg-pink-50 dark:bg-pink-900/30"},
//                       {label:"Followers",    value:analytics?.followers??   "—", icon:Users,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30"},
//                     ].map(s=>(
//                       <Card key={s.label} className="smm-card p-5">
//                         <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
//                         <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
//                         <div className="text-xs smm-text-muted mt-1">{s.label}</div>
//                       </Card>
//                     ))}
//                   </div>
//                   <Card className="smm-card p-6">
//                     <h3 className="font-semibold smm-text-primary mb-4">Weekly Reach & Engagement</h3>
//                     {analytics?.weeklyData?.length?(
//                       <div className="h-64">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <LineChart data={weeklyData}>
//                             <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"}/>
//                             <XAxis dataKey="day" stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
//                             <YAxis stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
//                             <Tooltip contentStyle={{background:dark?"#1e293b":"#fff",border:"1px solid #334155",borderRadius:8}}/>
//                             <Line type="monotone" dataKey="reach" stroke="#22c55e" strokeWidth={2.5} name="Reach"/>
//                             <Line type="monotone" dataKey="engagement" stroke="#818cf8" strokeWidth={2.5} name="Engagement"/>
//                           </LineChart>
//                         </ResponsiveContainer>
//                       </div>
//                     ):(
//                       <div className="h-32 flex items-center justify-center smm-text-muted text-sm">
//                         No analytics data available. Connect social accounts first.
//                       </div>
//                     )}
//                   </Card>
//                 </>
//               )}
//             </div>
//           )}

//         </div>
//       </main>

//       {/* ── Add Design Project Modal ── */}
//       {showAddDesign&&(
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <Card className="smm-modal w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-lg font-bold smm-text-primary">New Design Project</h2>
//               <button onClick={()=>setShowAddDesign(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
//             </div>
//             <form onSubmit={handleCreateDP} className="space-y-4">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Client *</Label>
//                   <select value={newDP.clientId} onChange={e=>setNewDP(n=>({...n,clientId:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
//                     <option value="">-- Select Client --</option>
//                     {clientList.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Graphic Designer *</Label>
//                   <select value={newDP.designerId} onChange={e=>setNewDP(n=>({...n,designerId:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
//                     <option value="">-- Select Designer --</option>
//                     {gdList.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Project Title *</Label>
//                 <Input value={newDP.title} onChange={e=>setNewDP(n=>({...n,title:e.target.value}))}
//                   placeholder="e.g. Logo Design for Sharma Enterprises" required className="smm-input mt-1"/>
//               </div>
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Design Type</Label>
//                   <select value={newDP.designType} onChange={e=>setNewDP(n=>({...n,designType:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                     {["Social Post","Logo","Banner","Brochure","Video Thumbnail","Story","Reel Cover","Other"].map(t=>(
//                       <option key={t} value={t}>{t}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Deadline *</Label>
//                   <Input type="date" value={newDP.deadline} onChange={e=>setNewDP(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Priority</Label>
//                   <select value={newDP.priority} onChange={e=>setNewDP(n=>({...n,priority:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                     {["Low","Medium","High","Urgent"].map(p=><option key={p} value={p}>{p}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Description</Label>
//                 <textarea value={newDP.description} onChange={e=>setNewDP(n=>({...n,description:e.target.value}))} rows={3}
//                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Target Audience</Label>
//                   <Input value={newDP.targetAudience} onChange={e=>setNewDP(n=>({...n,targetAudience:e.target.value}))} placeholder="e.g. 25-45 professionals" className="smm-input mt-1"/>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Revision Limit</Label>
//                   <Input type="number" min={1} max={10} value={newDP.revisionLimit} onChange={e=>setNewDP(n=>({...n,revisionLimit:Number(e.target.value)}))} className="smm-input mt-1"/>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Brand Colors</Label>
//                   <Input value={newDP.brandColors} onChange={e=>setNewDP(n=>({...n,brandColors:e.target.value}))} placeholder="#0044CC, #FFFFFF" className="smm-input mt-1"/>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Font Preferences</Label>
//                   <Input value={newDP.fontPreferences} onChange={e=>setNewDP(n=>({...n,fontPreferences:e.target.value}))} placeholder="Montserrat Bold" className="smm-input mt-1"/>
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddDesign(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={dpSaving}>
//                   {dpSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}<Send className="w-4 h-4 mr-2"/>Create & Assign
//                 </Button>
//               </div>
//             </form>
//           </Card>
//         </div>
//       )}

//       {/* ── Comments Modal ── */}
//       {selProject&&(
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <Card className="smm-modal w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-bold smm-text-primary truncate">{selProject.title}</h2>
//               <button onClick={()=>{setSelProject(null);setProjComments([]);setNewComment("");}} className="smm-text-muted hover:smm-text-primary shrink-0">
//                 <X className="w-5 h-5"/>
//               </button>
//             </div>
//             <h3 className="text-sm font-semibold smm-text-primary mb-2">Comments</h3>
//             <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
//               {projComments.length===0?(
//                 <p className="text-sm smm-text-muted">No comments yet</p>
//               ):projComments.map((c:any,i:number)=>(
//                 <div key={c._id??i} className="text-sm smm-comment px-3 py-2 rounded-lg border smm-border">
//                   <span className="font-medium smm-text-primary">{c.senderName??c.sender?.name??"User"}: </span>
//                   <span className="smm-text-secondary">{c.message??c.text}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <Input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Write a comment..." className="smm-input"
//                 onKeyDown={e=>{if(e.key==="Enter")handleSendComment();}}/>
//               <Button onClick={handleSendComment} disabled={commentSending||!newComment.trim()} className="bg-green-600 hover:bg-green-700 shrink-0">
//                 {commentSending?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}
//               </Button>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* ── Assign GD Task Modal ── */}
//       {showAddTask&&(
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <Card className="smm-modal w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-lg font-bold smm-text-primary">Assign Task to Graphic Designer</h2>
//               <button onClick={()=>setShowAddTask(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
//             </div>
//             <form onSubmit={handleAssignTask} className="space-y-4">
//               <div>
//                 <Label className="smm-text-primary">Task Title *</Label>
//                 <Input value={newTask.title} onChange={e=>setNewTask(n=>({...n,title:e.target.value}))} placeholder="e.g. Instagram Story — Summer Sale" required className="smm-input mt-1"/>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Description</Label>
//                 <textarea value={newTask.description} onChange={e=>setNewTask(n=>({...n,description:e.target.value}))} rows={3}
//                   placeholder="What should the designer create..."
//                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Client *</Label>
//                   {clientList.length>0?(
//                     <select value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))}
//                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
//                       <option value="">-- Select Client --</option>
//                       {clientList.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
//                     </select>
//                   ):(
//                     <Input value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))} placeholder="Client name" required className="smm-input mt-1"/>
//                   )}
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Graphic Designer</Label>
//                   {gdList.length>0?(
//                     <select value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))}
//                       className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                       <option value="">-- Select Designer --</option>
//                       {gdList.map(g=><option key={g.id} value={g.name}>{g.name}</option>)}
//                     </select>
//                   ):(
//                     <Input value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))} placeholder="Designer name" className="smm-input mt-1"/>
//                   )}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <Label className="smm-text-primary">Platform</Label>
//                   <select value={newTask.platform} onChange={e=>setNewTask(n=>({...n,platform:e.target.value}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                     {["Instagram","Facebook","LinkedIn","Twitter/X","YouTube","Pinterest"].map(p=>(
//                       <option key={p} value={p}>{p}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <Label className="smm-text-primary">Priority</Label>
//                   <select value={newTask.priority} onChange={e=>setNewTask(n=>({...n,priority:e.target.value as Priority}))}
//                     className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
//                     <option value="high">High</option>
//                     <option value="medium">Medium</option>
//                     <option value="low">Low</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Deadline *</Label>
//                 <Input type="date" value={newTask.deadline} onChange={e=>setNewTask(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
//               </div>
//               <div>
//                 <Label className="smm-text-primary">Notes for Designer</Label>
//                 <textarea value={newTask.notes} onChange={e=>setNewTask(n=>({...n,notes:e.target.value}))} rows={2}
//                   placeholder="Brand guidelines, colour codes, style references..."
//                   className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddTask(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700"><Send className="w-4 h-4 mr-2"/>Assign Task</Button>
//               </div>
//             </form>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SMMDashboard;

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SMMDashboard.css";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Megaphone, LogOut, LayoutDashboard, Calendar,
  PenSquare, BarChart3, FileImage, Plus, X,
  CheckCircle2, Send, Loader2, AlertCircle,
  Eye, Heart, TrendingUp, Users, Clock, Inbox,
  FileText, Globe, Trash2, Edit2, RefreshCw,
  LinkIcon, Palette, MessageSquare,
  Bell, BellOff, Moon, Sun, ChevronDown,
} from "lucide-react";
import {
  clearSession, getSession,
  BASE_URL,
  apiGetPosts, apiCreatePost, apiSaveDraft, apiGetAnalytics,
  apiGetQueuedPosts, apiGetDrafts, apiUpdateDraft, apiDeleteDraft,
  apiPublishPost, apiGetOverview, apiGetSocialAccounts,
  apiGetOAuthUrl, apiDisconnectSocialAccount,
  apiSMMDashboard, apiSMMGetDesignProjects, apiSMMCreateDesignProject,
  apiSMMDeleteDesignProject,
  apiSMMApproveRejectProject, apiSMMRequestRevision,
  apiSMMGetComments, apiSMMAddComment,
  apiSMMGetClients, apiSMMGetGraphicDesigners,
  type Post, type OverviewRes,
} from "@/lib/api";
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid,
} from "recharts";

// ─── Keys ─────────────────────────────────────────────────────────────────────
const GD_TASKS_KEY  = "socialflow_gd_tasks";
const DARK_MODE_KEY = "socialflow_dark_mode";
const NOTIF_KEY     = "socialflow_notifications";

// ─── Types ────────────────────────────────────────────────────────────────────
type TaskStatus = "pending" | "in_progress" | "revision" | "completed";
type Priority   = "high" | "medium" | "low";
type NotifType  = "success" | "warning" | "error" | "info";
type SMMView    = "overview"|"compose"|"queue"|"drafts"|"published"|"calendar"|"gd_tasks"|"design_projects"|"analytics"|"channels"|"clients_gd";

interface GDTask {
  id: string; title: string; description: string; clientName: string;
  gdName: string;
  platform: string; deadline: string; priority: Priority; status: TaskStatus;
  assignedBy: string; assignedAt: string; notes?: string; revisionComment?: string;
}

interface DesignProject {
  _id?: string; id?: string;
  title: string; designType: string; priority: string; status: string;
  deadline: string; description?: string;
  clientId?: { _id?: string; name?: string } | string;
  designerId?: { _id?: string; name?: string } | string;
  revisionInfo?: { used: number; limit: number; remaining: number };
}

interface AppNotif {
  id: string; type: NotifType; title: string; message: string;
  timestamp: string; read: boolean; action?: { label: string; view: SMMView };
}

// Client with their connected social channels
interface ClientWithChannels {
  id: string;
  name: string;
  email: string;
  channels: ConnectedChannel[];
  loadingChannels?: boolean;
  platforms?: string[]; // admin ne is client ke liye jo platforms select kiye the
}

interface ConnectedChannel {
  _id?: string;
  id?: string;
  platform: string;
  username?: string;
  name?: string;
  status?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "instagram",  label: "Instagram"  },
  { id: "facebook",   label: "Facebook"   },
  { id: "twitter",    label: "Twitter/X"  },
  { id: "linkedin",   label: "LinkedIn"   },
  { id: "youtube",    label: "YouTube"    },
  { id: "pinterest",  label: "Pinterest"  },
  { id: "threads",    label: "Threads"    },
];

const CONNECTABLE_PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "from-pink-500 to-orange-400", icon: "📸" },
  { id: "facebook",  label: "Facebook",  color: "from-blue-600 to-blue-700",   icon: "👍" },
  { id: "twitter",   label: "Twitter/X", color: "from-sky-400 to-sky-500",     icon: "🐦" },
  { id: "linkedin",  label: "LinkedIn",  color: "from-blue-700 to-blue-800",   icon: "💼" },
  { id: "youtube",   label: "YouTube",   color: "from-red-500 to-red-600",     icon: "▶️" },
  { id: "pinterest", label: "Pinterest", color: "from-red-600 to-pink-600",    icon: "📌" },
  { id: "threads",   label: "Threads",   color: "from-neutral-800 to-black",   icon: "🧵" },
];

// Queue auto-remove after 5 minutes (in ms)
const QUEUE_DISPLAY_MS = 5 * 60 * 1000;

// ─── Notif helper ─────────────────────────────────────────────────────────────
const mkNotif = (type: NotifType, title: string, message: string, action?: AppNotif["action"]): AppNotif => ({
  id: `n_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
  type, title, message, timestamp: new Date().toISOString(), read: false, action,
});

// ─── Component ────────────────────────────────────────────────────────────────
const SMMDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session  = getSession();
  const token    = session?.token ?? "";

  const [view, setView] = useState<SMMView>("overview");

  useEffect(() => {
    const locState = location.state as { view?: string } | null;
    if (locState?.view === "channels") {
      setView("channels");
      window.history.replaceState({}, "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [userName, setUserName] = useState("SMM Executive");

  // ── Dark Mode ──────────────────────────────────────────────────────────────
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem(DARK_MODE_KEY) === "true");
  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, String(dark));
    document.documentElement.classList.toggle("smm-dark", dark);
  }, [dark]);

  // ── Notifications ──────────────────────────────────────────────────────────
  const [notifs, setNotifs]       = useState<AppNotif[]>(() => {
    try { return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "[]"); } catch { return []; }
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab]   = useState<0|1>(0);
  const notifRef                  = useRef<HTMLDivElement>(null);

  const saveNotifs = useCallback((arr: AppNotif[]) => {
    const t = arr.slice(0, 50);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(t));
    return t;
  }, []);

  const pushNotif = useCallback((n: AppNotif) => {
    setNotifs(prev => saveNotifs([n, ...prev]));
  }, [saveNotifs]);

  const markAllRead = () => setNotifs(prev => saveNotifs(prev.map(n => ({ ...n, read: true }))));
  const clearNotifs = () => { setNotifs([]); localStorage.removeItem(NOTIF_KEY); };
  const deleteNotif = (id: string) => setNotifs(prev => saveNotifs(prev.filter(n => n.id !== id)));
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    if (!notifOpen) return;
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [notifOpen]);

  // ── API state ──────────────────────────────────────────────────────────────
  const [overview, setOverview]         = useState<OverviewRes | null>(null);
  const [overviewLoading, setOvLoading] = useState(false);
  const [smmDashData, setSmmDashData]   = useState<any>(null);

  // clientList and gdList — extracted from design projects API
  const [clientList, setClientList]     = useState<{ id:string; name:string; email:string; platforms?: string[] }[]>([]);
  const [gdList, setGdList]             = useState<{ id:string; name:string; email:string }[]>([]);

  // Clients with their channels (for Channels view)
  const [clientsWithChannels, setClientsWithChannels]   = useState<ClientWithChannels[]>([]);
  const [clientChannelsLoading, setClientChannelsLoading] = useState(false);

  const [designProjects, setDesignProjects]   = useState<DesignProject[]>([]);
  const [designLoading,  setDesignLoading]    = useState(false);
  const [showAddDesign,  setShowAddDesign]    = useState(false);
  const [designFilter,   setDesignFilter]    = useState("");
  const [newDP, setNewDP] = useState({
    clientId:"", designerId:"", title:"", designType:"Social Post",
    deadline:"", priority:"Medium", description:"",
    targetAudience:"", brandColors:"", fontPreferences:"", revisionLimit:3,
  });
  const [dpSaving, setDpSaving]               = useState(false);
  const [selProject, setSelProject]           = useState<DesignProject | null>(null);
  const [projComments, setProjComments]       = useState<any[]>([]);
  const [newComment, setNewComment]           = useState("");
  const [commentSending, setCommentSending]   = useState(false);

  const [posts, setPosts]               = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError]     = useState<string | null>(null);

  // Queue: track publishedAt for instant posts, auto-remove after 5 min
  const [queuedPosts, setQueuedPosts]   = useState<(Post & { queuedAt?: number })[]>([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [drafts, setDrafts]             = useState<Post[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [deletingDid, setDeletingDid]   = useState<string | null>(null);

  const [pubPosts, setPubPosts]         = useState<Post[]>([]);
  const [pubLoading, setPubLoading]     = useState(false);

  // My agency's own channels
  const [channels, setChannels]               = useState<any[]>([]);
  const [channelsLoading, setChanLoading]     = useState(false);
  const [disconnectingId, setDiscId]          = useState<string | null>(null);
  const [connectingPlatform, setConnPlat]     = useState<string | null>(null);

  const [analytics, setAnalytics]             = useState<any>(null);
  const [analyticsLoading, setAnaLoading]     = useState(false);

  // ── Compose state ──────────────────────────────────────────────────────────
  const [composeContent, setComposeContent]   = useState("");
  // Selected client for this post
  const [composeClientId, setComposeClientId] = useState("");
  // Channels of the selected client
  const [clientConnectedChannels, setClientConnectedChannels] = useState<ConnectedChannel[]>([]);
  const [clientChannelsFetching, setClientChannelsFetching]   = useState(false);
  const [composePlatforms, setComposePlatforms] = useState<string[]>([]);
  // Kis platform pe kaunsa specific account/page select kiya gaya hai
  // (e.g. Facebook ke case mein multiple Pages ho sakti hain, ye batayega
  // konsi Page pe post jaani hai). Key = platform id, Value = channel/account id.
  const [composeChannelIds, setComposeChannelIds] = useState<Record<string, string>>({});
  // Jab kisi platform (e.g. Facebook) ke multiple connected Pages/accounts
  // hon, to sirf ek button dikhta hai jispe click karne pe dropdown khulta
  // hai jisme saari Pages ki list hoti hai. Ye state batata hai konsa
  // platform ka dropdown abhi open hai.
  const [openPlatformDropdown, setOpenPlatformDropdown] = useState<string | null>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);

  // Platform/Page picker dropdown ko bahar click karne par band karna
  useEffect(() => {
    if (!openPlatformDropdown) return;
    const h = (e: MouseEvent) => {
      if (platformDropdownRef.current && !platformDropdownRef.current.contains(e.target as Node)) {
        setOpenPlatformDropdown(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [openPlatformDropdown]);
  const [composeScheduleDate, setComposeScheduleDate] = useState("");
  const [composeScheduleTime, setComposeScheduleTime] = useState("");
  const [composeSaving, setComposeSaving]     = useState(false);
  const [composeMedia, setComposeMedia]       = useState<File | null>(null);
  const [composePreview, setComposePreview]   = useState<string | null>(null);
  const [composeTags, setComposeTags]         = useState<string[]>([]);
  const [composeTagInput, setComposeTagInput] = useState("");
  const [editingDraft, setEditingDraft]       = useState<Post | null>(null);

  // YouTube specific state
  const [youtubeTitle,   setYoutubeTitle]   = useState("");
  const [youtubePrivacy, setYoutubePrivacy] = useState<"public"|"private"|"unlisted">("public");
  const [isVideoFile,    setIsVideoFile]    = useState(false);

  // GD Tasks (local storage based)
  const [gdTasks, setGdTasks]           = useState<GDTask[]>([]);
  const completedGDCount = gdTasks.filter(t => t.status === "completed").length;
  const totalBadgeCount = (notifs.filter(n => !n.read).length) + completedGDCount;
  const [showAddTask, setShowAddTask]   = useState(false);
  const [newTask, setNewTask] = useState({
    title:"", description:"", clientName:"", gdName:"",
    platform:"Instagram", deadline:"", priority:"medium" as Priority, notes:"",
  });

  const [calMonth, setCalMonth] = useState(new Date());
  const prevGDTasksRef = useRef<GDTask[]>([]);

  // Connecting channel state per client
  const [connectingForClient, setConnectingForClient] = useState<string|null>(null);

  // ── Auto-remove instant posts from queue after 5 min ──────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setQueuedPosts(prev => {
        const filtered = prev.filter(p => {
          // If post has no scheduleAt, it's an instant post — remove after QUEUE_DISPLAY_MS
          const isInstant = !p.scheduleAt && !p.scheduled_at;
          if (isInstant && p.queuedAt && (now - p.queuedAt) >= QUEUE_DISPLAY_MS) {
            return false;
          }
          return true;
        });
        return filtered;
      });
    }, 10_000); // check every 10s
    return () => clearInterval(interval);
  }, []);

  // Watch for GD tasks becoming completed → push notification
  useEffect(() => {
    const prev = prevGDTasksRef.current;
    if (prev.length > 0) {
      gdTasks.forEach(task => {
        const prevTask = prev.find(t => t.id === task.id);
        if (prevTask && prevTask.status !== "completed" && task.status === "completed") {
          pushNotif(mkNotif("info", "GD Task Completed! 🎨",
            `"${task.title}" by ${task.gdName} is ready for review`,
            { label: "Review Now", view: "gd_tasks" }));
        }
      });
    }
    prevGDTasksRef.current = gdTasks;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gdTasks]);

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const name = localStorage.getItem("socialflow_user_name") || "SMM Executive";
    setUserName(name);
    const stored = localStorage.getItem(GD_TASKS_KEY);
    if (stored) setGdTasks(JSON.parse(stored));
    if (token) {
      loadOverview();
      loadPosts();
      loadSMMDashboard();
      loadUsersForDropdowns();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (view === "overview")        { loadOverview(); loadPosts(); }
    if (view === "queue")           loadQueued();
    if (view === "drafts")          loadDrafts();
    if (view === "published")       loadPublished();
    if (view === "analytics")       loadAnalytics();
    if (view === "calendar")        loadPosts();
    if (view === "channels")        { loadChannels(); loadClientsWithChannels(); }
    if (view === "design_projects") loadDesignProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // When client changes in compose, fetch their channels
  useEffect(() => {
    if (composeClientId) fetchClientChannels(composeClientId);
   
    else { setClientConnectedChannels([]); setComposePlatforms([]); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composeClientId]);
   console.log("jheta",composeClientId);

  // ── Loaders ─────────────────────────────────────────────────────────────────
  const loadOverview = async () => {
    setOvLoading(true);
    try { const { data } = await apiGetOverview(token); if (data) setOverview(data); } catch {}
    setOvLoading(false);
  };

  const loadSMMDashboard = async () => {
    const { data } = await apiSMMDashboard(token);
    if (data) {
      const d = (data as any)?.data ?? data;
      setSmmDashData(d);
      extractUsers((d as any)?.recentProjects ?? []);
    }
  };

  const extractUsers = (projects: any[]) => {
    if (!Array.isArray(projects) || !projects.length) return;
    const cm = new Map<string,{id:string;name:string;email:string}>();
    const gm = new Map<string,{id:string;name:string;email:string}>();
    projects.forEach((p:any) => {
      const c = p.clientId;
      if (c && typeof c==="object" && c._id)
        cm.set(c._id, {id:c._id, name:c.name||"Client", email:c.email||""});
      const g = p.designerId;
      if (g && typeof g==="object" && g._id)
        gm.set(g._id, {id:g._id, name:g.name||"Designer", email:g.email||""});
    });
    if (cm.size) setClientList(prev => {
      const m=new Map(prev.map(x=>[x.id,x])); cm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
    });
    if (gm.size) setGdList(prev => {
      const m=new Map(prev.map(x=>[x.id,x])); gm.forEach((v,k)=>m.set(k,v)); return Array.from(m.values());
    });
  };

  const loadUsersForDropdowns = async () => {
    // FIXED: pehle ye function localStorage (per-device, stale) aur design
    // projects (jo tab tak khaali rehta hai jab tak koi design project na
    // bana ho) se client/GD list nikaalta tha. Ab seedha backend ke
    // dedicated SMM endpoints se agency ke saare Client/GD milte hain —
    // in dono me se koi bhi active ho, list turant dikhegi.
    try {
      const { data: clientsRes, error: clientsErr } = await apiSMMGetClients(token);
      if (clientsErr) {
        console.warn("SMM clients fetch failed:", clientsErr);
      } else {
        const clients = (clientsRes as any)?.data?.clients ?? [];
        setClientList(
          clients.map((c: any) => ({ id: c._id, name: c.name, email: c.email || "", platforms: c.platforms || [] }))
        );
      }
    } catch (e) {
      console.warn("SMM clients fetch error:", e);
    }

    try {
      const { data: gdRes, error: gdErr } = await apiSMMGetGraphicDesigners(token);
      if (gdErr) {
        console.warn("SMM graphic designers fetch failed:", gdErr);
      } else {
        const designers = (gdRes as any)?.data?.designers ?? [];
        setGdList(
          designers.map((g: any) => ({ id: g._id, name: g.name, email: g.email || "" }))
        );
      }
    } catch (e) {
      console.warn("SMM graphic designers fetch error:", e);
    }
  };

  // Fetch channels for a specific client (by clientId)
//  const fetchClientChannels = async (clientId: string) => {
//   if (!clientId) return;
//   setClientChannelsFetching(true);
//   try {
//     const endpoints = [
//       `${BASE_URL}/api/social-accounts?userId=${clientId}`,
//       `${BASE_URL}/api/social-accounts?clientId=${clientId}`,
//       `${BASE_URL}/api/clients/${clientId}/social-accounts`,
//       `${BASE_URL}/api/clients/${clientId}/channels`,
//     ];
//     let found: ConnectedChannel[] = [];
//     for (const url of endpoints) {
//       try {
//         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.ok) {
//           const json = await res.json();
//           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
//           const arr = Array.isArray(raw) ? raw : [];
//           if (arr.length > 0) { found = arr; break; }
//         }
//       } catch { /* try next */ }
//     }
//     setClientConnectedChannels(found);
//     setComposePlatforms([]);
//   } catch {
//     setClientConnectedChannels([]);
//   }
//   setClientChannelsFetching(false);
// };

// ✅ NAYA (replace karo)
const fetchClientChannels = async (clientId: string) => {
  if (!clientId) return;
  setClientChannelsFetching(true);
  try {
    const res = await fetch(
      `${BASE_URL}/api/social/accounts?clientId=${clientId}`,
      // { headers: { Authorization: `Bearer ${token}` } }
      { headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } }

    );
    if (res.ok) {
      const json = await res.json();
      const raw = json?.data ?? json?.accounts ?? (Array.isArray(json) ? json : []);
      setClientConnectedChannels(Array.isArray(raw) ? raw : []);
    } else {
      setClientConnectedChannels([]);
    }
  } catch {
    setClientConnectedChannels([]);
  }
  setComposePlatforms([]);
  setComposeChannelIds({});
  setClientChannelsFetching(false);
};

  // Load all clients and their channels for Channels view
// const loadClientsWithChannels = async () => {
//   setClientChannelsLoading(true);

//   // FIX: don't rely on stale clientList state — fetch fresh
//   let clients = clientList;
//   if (clients.length === 0) {
//     const { data } = await apiSMMGetDesignProjects(token, { limit: 100 });
//     const raw = data as any;
//     const projects = raw?.data?.projects ?? raw?.projects ?? raw?.data ?? [];
//     const cm = new Map<string, { id: string; name: string; email: string }>();
//     if (Array.isArray(projects)) {
//       projects.forEach((p: any) => {
//         const c = p.clientId;
//         if (c && typeof c === "object" && c._id)
//           cm.set(c._id, { id: c._id, name: c.name || "Client", email: c.email || "" });
//       });
//     }
//     clients = Array.from(cm.values());
//     if (clients.length > 0) setClientList(clients); // update state too
//   }

//   if (clients.length === 0) { setClientChannelsLoading(false); return; }

//   const updated: ClientWithChannels[] = [];
//   for (const client of clients) {
//     // FIX: try multiple endpoint patterns
//     const endpoints = [
//       `${BASE_URL}/api/social-accounts?userId=${client.id}`,
//       `${BASE_URL}/api/social-accounts?clientId=${client.id}`,
//       `${BASE_URL}/api/clients/${client.id}/social-accounts`,
//       `${BASE_URL}/api/clients/${client.id}/channels`,
//     ];
//     let channels: ConnectedChannel[] = [];
//     for (const url of endpoints) {
//       try {
//         const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.ok) {
//           const json = await res.json();
//           const raw = json?.data ?? json?.channels ?? json?.accounts ?? (Array.isArray(json) ? json : []);
//           const arr = Array.isArray(raw) ? raw : [];
//           if (arr.length > 0) { channels = arr; break; }
//         }
//       } catch { /* try next */ }
//     }
//     updated.push({ ...client, channels });
//   }
//   setClientsWithChannels(updated);
//   setClientChannelsLoading(false);
// };
const loadClientsWithChannels = async () => {
  setClientChannelsLoading(true);

  // FIXED: ab stale/design-projects-derived list pe depend nahi karte —
  // seedha backend se fresh client list mangte hain.
  let clients = clientList;
  if (clients.length === 0) {
    const { data } = await apiSMMGetClients(token);
    const fetched = (data as any)?.data?.clients ?? [];
    clients = fetched.map((c: any) => ({ id: c._id, name: c.name, email: c.email || "", platforms: c.platforms || [] }));
    if (clients.length > 0) setClientList(clients);
  }

  if (clients.length === 0) { setClientChannelsLoading(false); return; }

  const updated: ClientWithChannels[] = [];
  for (const client of clients) {
    // ✅ FIXED: single correct endpoint
    let channels: ConnectedChannel[] = [];
    try {
      const res = await fetch(
        `${BASE_URL}/api/social/accounts?clientId=${client.id}`,
        // { headers: { Authorization: `Bearer ${token}` } }
        { headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } }

      );
      if (res.ok) {
        const json = await res.json();
        const raw = json?.data ?? json?.accounts ?? (Array.isArray(json) ? json : []);
        channels = Array.isArray(raw) ? raw : [];
      }
    } catch { /* ignore */ }
    updated.push({ ...client, channels });
  }
  setClientsWithChannels(updated);
  setClientChannelsLoading(false);
};

  const loadDesignProjects = async () => {
    setDesignLoading(true);
    const { data, error } = await apiSMMGetDesignProjects(token, designFilter ? {status:designFilter} : undefined);
    if (error) { toast.error("Load failed: "+error); pushNotif(mkNotif("error","Projects Load Failed",error)); }
    else {
      const raw=data as any;
      const list=raw?.data?.projects??raw?.projects??raw?.data??(Array.isArray(raw)?raw:[]);
      const arr=Array.isArray(list)?list:[];
      setDesignProjects(arr); extractUsers(arr);
    }
    setDesignLoading(false);
  };

  const loadPosts = async () => {
    setPostsLoading(true); setPostsError(null);
    const { data, error } = await apiGetPosts(token);
    if (error) { if(!error.includes("404")&&!error.includes("not found")) setPostsError(error); }
    else {
      const raw=data as any;
      const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
      setPosts(Array.isArray(list)?list:[]);
    }
    setPostsLoading(false);
  };

  const loadQueued = async () => {
    setQueueLoading(true);
    const { data, error } = await apiGetQueuedPosts(token);
    if (error) toast.error("Queue load failed: "+error);
    else {
      const raw=data as any;
      const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
      const arr: (Post & { queuedAt?: number })[] = Array.isArray(list) ? list : [];
      // Preserve existing queuedAt timestamps for posts already in state
      const merged = arr.map(p => {
        const existing = queuedPosts.find(q => (q._id??q.id) === (p._id??p.id));
        return existing ? { ...p, queuedAt: existing.queuedAt } : { ...p, queuedAt: Date.now() };
      });
      if (merged.length > queuedPosts.length && queuedPosts.length > 0)
        pushNotif(mkNotif("info","Queue Updated",`${merged.length-queuedPosts.length} new post(s) added to queue`,{label:"View Queue",view:"queue"}));
      setQueuedPosts(merged);
    }
    setQueueLoading(false);
  };

  const loadDrafts = async () => {
    setDraftsLoading(true);
    const { data, error } = await apiGetDrafts(token);
    if (error) toast.error("Drafts load failed: "+error);
    else {
      const raw=data as any;
      const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
      setDrafts(Array.isArray(list)?list:[]);
    }
    setDraftsLoading(false);
  };

  const loadPublished = async () => {
    setPubLoading(true);
    const { data, error } = await apiGetPosts(token, "published");
    if (error) toast.error("Published load failed: "+error);
    else {
      const raw=data as any;
      const list=raw?.posts??raw?.data?.posts??raw?.data??(Array.isArray(raw)?raw:[]);
      setPubPosts(Array.isArray(list)?list:[]);
    }
    setPubLoading(false);
  };

  const loadAnalytics = async () => {
    setAnaLoading(true);
    const { data } = await apiGetAnalytics(token,"7d");
    if (data?.data) setAnalytics(data.data);
    setAnaLoading(false);
  };

  const loadChannels = async () => {
    setChanLoading(true);
    const { data, error } = await apiGetSocialAccounts(token);
    if (error) toast.error("Channels load failed: "+error);
    else {
      const raw=data as any;
      const list=raw?.channels??raw?.accounts??raw?.data??(Array.isArray(raw)?raw:[]);
      setChannels(Array.isArray(list)?list:[]);
    }
    setChanLoading(false);
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    clearSession(); localStorage.removeItem("socialflow_role"); navigate("/"); toast.success("Logged out successfully");
  };

  const togglePlat = (id:string) => setComposePlatforms(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  // Jab client ke paas ek platform ki multiple connected accounts/Pages hon
  // (e.g. 2 Facebook Pages), is function se specific account select hota hai.
  // Dobara usi account pe click karne se deselect ho jaata hai; kisi doosre
  // account pe click karne se selection replace ho jaati hai (platform tab
  // bhi selected hi rehta hai, sirf account badalta hai).
  const selectChannel = (platId: string, channelId: string) => {
    const isSameChannelSelected =
      composePlatforms.includes(platId) && composeChannelIds[platId] === channelId;

    if (isSameChannelSelected) {
      setComposePlatforms(p => p.filter(x => x !== platId));
      setComposeChannelIds(prev => {
        const next = { ...prev };
        delete next[platId];
        return next;
      });
    } else {
      setComposePlatforms(p => (p.includes(platId) ? p : [...p, platId]));
      setComposeChannelIds(prev => ({ ...prev, [platId]: channelId }));
    }
  };

  const handleCompose = async (action:"draft"|"queue"|"schedule") => {
    if (!composeContent.trim()) { toast.error("Please add some content"); return; }
    if (action!=="draft"&&composePlatforms.length===0) { toast.error("Please select at least one platform"); return; }
    if (action!=="draft"&&!composeClientId) { toast.error("Please select a client"); return; }
    if (action!=="draft" && composePlatforms.includes("youtube") && !isVideoFile) {
      toast.error("YouTube ke liye video file select karo (MP4)"); return;
    }
    setComposeSaving(true);
    try {
      if (action==="draft") {
        if (editingDraft) {
          const id=editingDraft._id??editingDraft.id??"";
          const {error}=await apiUpdateDraft(token,id,composeContent,composePlatforms,composeMedia?[composeMedia]:[]);
          if(error){toast.error("Update failed: "+error);return;}
          toast.success("Draft updated!");
          pushNotif(mkNotif("success","Draft Updated","Draft saved successfully",{label:"View Drafts",view:"drafts"}));
        } else {
          const {error}=await apiSaveDraft(token,composeContent,composePlatforms,composeTags,composeMedia?[composeMedia]:[]);
          if(error){toast.error("Save failed: "+error);return;}
          toast.success("Draft saved!");
          pushNotif(mkNotif("success","Draft Saved","New draft saved",{label:"View Drafts",view:"drafts"}));
        }
        resetCompose(); setView("drafts");
      } else {
        let schedAt: string | null = null;
        if (composeScheduleDate && composeScheduleTime) {
          schedAt = new Date(`${composeScheduleDate}T${composeScheduleTime}`).toISOString();
        } else if (composeScheduleDate) {
          schedAt = new Date(`${composeScheduleDate}T00:00`).toISOString();
        }
        // const {error}=await apiCreatePost(
        //   token, composeContent, composePlatforms, composeTags,
        //   composeMedia?[composeMedia]:[], schedAt??null,
        //   youtubeTitle || undefined,
        //   youtubePrivacy || undefined
        // );
        // ✅ NAYA — clientId add karo end mein
        // ✅ NAYA — platformAccounts: backend ko batao kis platform ke kis
        // specific account/Page pe post jaani hai (e.g. Facebook Page).
        // composeChannelIds mein sirf wahi platforms honge jinke liye user
        // ne explicitly ek account/channel select kiya ho.
        const platformAccounts = composePlatforms
          .filter(p => composeChannelIds[p])
          .map(p => ({ platform: p, accountId: composeChannelIds[p] }));
const {error} = await apiCreatePost(
  token, composeContent, composePlatforms, composeTags,
  composeMedia?[composeMedia]:[], schedAt??null,
  youtubeTitle || undefined,
  youtubePrivacy || undefined,
  composeClientId || undefined,   // ✅ ADD
  platformAccounts.length > 0 ? platformAccounts : undefined  // ✅ ADD
);
        if(error){toast.error("Post failed: "+error);return;}
        const isScheduled = !!schedAt;
        toast.success(isScheduled?"Post scheduled!":"Post added to queue!");
        pushNotif(mkNotif("success",isScheduled?"Post Scheduled":"Post Queued",
          isScheduled?`Will publish on ${new Date(schedAt!).toLocaleString("en-IN")}`:"Instant post added to queue — will publish in ~5 minutes",
          {label:"View Queue",view:"queue"}));
        resetCompose(); setView("queue");
        // Refresh queue immediately
        setTimeout(() => loadQueued(), 500);
      }
    } catch { toast.error("Network error"); }
    finally { setComposeSaving(false); }
  };

  const resetCompose = () => {
    setComposeContent(""); setComposePlatforms([]);
    setComposeScheduleDate(""); setComposeScheduleTime("");
    setComposeMedia(null); setComposePreview(null);
    setEditingDraft(null); setComposeTags([]); setComposeTagInput("");
    setComposeClientId(""); setClientConnectedChannels([]);
    setComposeChannelIds({});
    setYoutubeTitle(""); setYoutubePrivacy("public"); setIsVideoFile(false);
  };

  const handleTagKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key==="Enter"||e.key===","||e.key===" ") {
      e.preventDefault();
      const t=composeTagInput.trim().replace(/^#/,"");
      if(t&&!composeTags.includes(t)) setComposeTags(p=>[...p,t]);
      setComposeTagInput("");
    }
  };

  const handlePublishNow = async (pid:string) => {
    setPublishingId(pid);
    const {error}=await apiPublishPost(token,pid);
    if(error){
      toast.error("Publish failed: "+error);
      pushNotif(mkNotif("error","Publish Failed",error));
    } else {
      toast.success("Post published!");
      pushNotif(mkNotif("success","Published! 🎉","Post published successfully",{label:"View Published",view:"published"}));
      // Remove from queue immediately
      setQueuedPosts(prev => prev.filter(p => (p._id??p.id) !== pid));
      loadOverview();
    }
    setPublishingId(null);
  };

  const handleDeleteDraft = async (id:string) => {
    if(!confirm("Are you sure you want to delete this draft?")) return;
    setDeletingDid(id);
    const {error}=await apiDeleteDraft(token,id);
    if(error) toast.error("Delete failed: "+error);
    else{toast.success("Draft deleted!");pushNotif(mkNotif("warning","Draft Deleted","A draft was deleted"));loadDrafts();}
    setDeletingDid(null);
  };

  const handleEditDraft = (d:Post) => {
    setEditingDraft(d); setComposeContent(d.content); setComposePlatforms(d.platforms??[]);
    setView("compose");
  };

  // Connect a channel for a specific client
const handleConnectForClient = async (platId: string, clientId: string) => {
  const key = `${clientId}_${platId}`;
  setConnectingForClient(key);
  // ✅ FIX: clientId pass karo — backend pe SMM ke liye MANDATORY hai
  // ⚠️ Backend ki API se hi authUrl lo — kabhi khud se kisi platform ka
  // OAuth URL (facebook.com/dialog/oauth?... jaisa) construct mat karna.
  const { data, error } = await apiGetOAuthUrl(token, platId, clientId);
  if (error) { toast.error("OAuth failed: " + error); setConnectingForClient(null); return; }
  const url = (data as any)?.authUrl ?? (data as any)?.url ?? (data as any)?.redirectUrl;
  const oauthState = (data as any)?.state ?? (data as any)?.oauthState ?? null;
  if (url) {
    localStorage.setItem("oauth_platform", platId);
    localStorage.setItem("oauth_client_id", clientId);
    if (oauthState) localStorage.setItem("oauth_state", oauthState);
    // window.open(url, "_blank");
    window.location.href = url;
    pushNotif(mkNotif("info", "Platform Connect", `Connecting ${platId} for client...`, { label: "View Channels", view: "channels" }));

    // ✅ FIX: Refresh channels when user comes back after OAuth
    const refreshOnFocus = () => {
      window.removeEventListener("focus", refreshOnFocus);
      setTimeout(() => {
        loadClientsWithChannels();
        if (composeClientId === clientId) fetchClientChannels(clientId);
      }, 1500);
    };
    window.addEventListener("focus", refreshOnFocus);
  } else toast.error("No OAuth URL returned");
  setConnectingForClient(null);
};

  // Disconnect a channel for a client
  const handleDisconnectClientChannel = async (channelId:string, clientId:string) => {
    if(!confirm("Are you sure you want to disconnect this account?")) return;
    const {error}=await apiDisconnectSocialAccount(token,channelId);
    if(error) toast.error("Disconnect failed: "+error);
    else{
      toast.success("Disconnected!");
      pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));
      // Update local state
      setClientsWithChannels(prev => prev.map(c =>
        c.id === clientId
          ? { ...c, channels: c.channels.filter(ch => (ch._id??ch.id) !== channelId) }
          : c
      ));
      // Also refresh compose client channels if needed
      if(composeClientId === clientId) fetchClientChannels(clientId);
    }
  };

  const handleConnect = async (platId:string) => {
    setConnPlat(platId);
    const {data,error}=await apiGetOAuthUrl(token,platId);
    if(error){toast.error("OAuth failed: "+error);setConnPlat(null);return;}
    const url=(data as any)?.authUrl??(data as any)?.url??(data as any)?.redirectUrl;
    const oauthState=(data as any)?.state??(data as any)?.oauthState??null;
    if(url){
      localStorage.setItem("oauth_platform", platId);
      if(oauthState) localStorage.setItem("oauth_state", oauthState);
      // window.open(url,"_blank");
      window.location.href = url;
      pushNotif(mkNotif("info","Platform Connect",`Connecting ${platId}...`,{label:"View Channels",view:"channels"}));
    } else toast.error("No OAuth URL returned");
    setConnPlat(null);
  };

  const handleDisconnect = async (cid:string) => {
    if(!confirm("Are you sure you want to disconnect this account?")) return;
    setDiscId(cid);
    const {error}=await apiDisconnectSocialAccount(token,cid);
    if(error) toast.error("Disconnect failed: "+error);
    else{toast.success("Disconnected!");pushNotif(mkNotif("warning","Channel Disconnected","Social account disconnected"));loadChannels();}
    setDiscId(null);
  };

  const handleCreateDP = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!newDP.clientId||!newDP.designerId||!newDP.title||!newDP.deadline){toast.error("Please fill all required fields");return;}
    setDpSaving(true);
    const {error}=await apiSMMCreateDesignProject(token,{...newDP});
    if(error) toast.error("Create failed: "+error);
    else{
      toast.success("Project created!");
      pushNotif(mkNotif("success","Project Created",`"${newDP.title}" assigned to designer`,{label:"View Projects",view:"design_projects"}));
      setShowAddDesign(false);
      setNewDP({clientId:"",designerId:"",title:"",designType:"Social Post",deadline:"",priority:"Medium",description:"",targetAudience:"",brandColors:"",fontPreferences:"",revisionLimit:3});
      loadDesignProjects();
    }
    setDpSaving(false);
  };

  const handleDeleteDP = async (id:string) => {
    if(!confirm("Are you sure you want to delete this project?")) return;
    const {error}=await apiSMMDeleteDesignProject(token,id);
    if(error) toast.error("Delete failed: "+error);
    else{toast.success("Deleted!");pushNotif(mkNotif("warning","Project Deleted","Design project deleted"));loadDesignProjects();}
  };

  const handleApproveReject = async (id:string, act:"approve"|"reject") => {
    const note=prompt(act==="approve"?"Approval note (optional):":"Rejection reason:");
    if(act==="reject"&&!note) return;
    const {error}=await apiSMMApproveRejectProject(token,id,act,note??"");
    if(error) toast.error("Action failed: "+error);
    else{
      toast.success(act==="approve"?"Approved!":"Rejected!");
      pushNotif(mkNotif(act==="approve"?"success":"warning",act==="approve"?"Project Approved":"Project Rejected","Design project "+act+"ed",{label:"View Projects",view:"design_projects"}));
      loadDesignProjects();
    }
  };

  const handleRevisionReq = async (id:string) => {
    const msg=prompt("Please enter revision details:");
    if(!msg) return;
    const {error}=await apiSMMRequestRevision(token,id,msg);
    if(error) toast.error("Revision failed: "+error);
    else{toast.success("Revision request sent!");pushNotif(mkNotif("info","Revision Requested","Revision request sent to designer",{label:"View Projects",view:"design_projects"}));loadDesignProjects();}
  };

  const openProjectDetail = async (project:DesignProject) => {
    setSelProject(project);
    const pid=project._id??project.id??"";
    const {data}=await apiSMMGetComments(token,pid);
    const raw=data as any;
    const list=raw?.data??raw?.comments??[];
    setProjComments(Array.isArray(list)?list:[]);
  };

  const handleSendComment = async () => {
    if(!newComment.trim()||!selProject) return;
    setCommentSending(true);
    const pid=selProject._id??selProject.id??"";
    const {error}=await apiSMMAddComment(token,pid,newComment);
    if(error) toast.error("Comment failed: "+error);
    else{toast.success("Comment sent!");setNewComment("");openProjectDetail(selProject);}
    setCommentSending(false);
  };

  const handleAssignTask = (e:React.FormEvent) => {
    e.preventDefault();
    if(!newTask.title||!newTask.clientName||!newTask.deadline){toast.error("Please fill all required fields");return;}
    const task:GDTask={
      id:"T"+Date.now().toString().slice(-6), ...newTask,
      status:"pending", assignedBy:`${userName} (SMM)`,
      assignedAt:new Date().toISOString().split("T")[0],
    };
    const upd=[task,...gdTasks];
    setGdTasks(upd);
    localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
    setShowAddTask(false);
    setNewTask({title:"",description:"",clientName:"",gdName:"",platform:"Instagram",deadline:"",priority:"medium",notes:""});
    toast.success("Task assigned!");
    pushNotif(mkNotif("success","Task Assigned",`"${task.title}" assigned to designer`,{label:"GD Tasks",view:"gd_tasks"}));
  };

  const handleRevision = (tid:string, comment:string) => {
    const upd=gdTasks.map(t=>t.id===tid?{...t,status:"revision" as TaskStatus,revisionComment:comment}:t);
    setGdTasks(upd); localStorage.setItem(GD_TASKS_KEY,JSON.stringify(upd));
    toast.success("Revision request sent");
    pushNotif(mkNotif("info","Revision Requested","Revision requested for GD task",{label:"GD Tasks",view:"gd_tasks"}));
  };

  const handleGDTaskApproveReject = (taskId: string, action: "approve"|"reject") => {
    const upd = gdTasks.map(t =>
      t.id === taskId
        ? { ...t, status: (action === "approve" ? "completed" : "revision") as TaskStatus }
        : t
    );
    setGdTasks(upd);
    localStorage.setItem(GD_TASKS_KEY, JSON.stringify(upd));
    toast.success(action === "approve" ? "Task approved!" : "Task sent for revision!");
    pushNotif(mkNotif(
      action === "approve" ? "success" : "warning",
      action === "approve" ? "Task Approved ✅" : "Task Rejected",
      action === "approve" ? "GD task approved and marked complete" : "GD task sent back for revision",
      { label: "GD Tasks", view: "gd_tasks" }
    ));
    setNotifOpen(false);
  };

  // ── Computed ─────────────────────────────────────────────────────────────────
  const taskCounts = {
    pending:     gdTasks.filter(t=>t.status==="pending").length,
    in_progress: gdTasks.filter(t=>t.status==="in_progress").length,
    revision:    gdTasks.filter(t=>t.status==="revision").length,
    completed:   gdTasks.filter(t=>t.status==="completed").length,
  };

  const calDays = (() => {
    const y=calMonth.getFullYear(), m=calMonth.getMonth();
    const off=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
    const cells:(Date|null)[]= [];
    for(let i=0;i<off;i++) cells.push(null);
    for(let d=1;d<=dim;d++) cells.push(new Date(y,m,d));
    while(cells.length%7!==0) cells.push(null);
    return cells;
  })();

  const postsForDay=(d:Date)=>posts.filter(p=>{
    const ds=p.scheduleAt??p.scheduled_at??p.createdAt;
    if(!ds)return false;
    const pd=new Date(ds);
    return pd.getFullYear()===d.getFullYear()&&pd.getMonth()===d.getMonth()&&pd.getDate()===d.getDate();
  });

  const weeklyData = analytics?.weeklyData?.length
    ? analytics.weeklyData
    : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>({day,reach:0,engagement:0}));

  const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];

  const ovTotal     = overview?.total     ?? (overview?.data as any)?.total     ?? posts.length;
  const ovPublished = overview?.published ?? (overview?.data as any)?.published ?? posts.filter(p=>p.status==="published").length;
  const ovScheduled = overview?.scheduled ?? (overview?.data as any)?.scheduled ?? posts.filter(p=>p.status==="scheduled").length;
  const ovFailed    = overview?.failed    ?? (overview?.data as any)?.failed    ?? posts.filter(p=>p.status==="failed").length;

  // Queue time remaining helper
  const queueTimeLeft = (p: Post & { queuedAt?: number }): string | null => {
    if (p.scheduleAt || p.scheduled_at) return null; // scheduled post — show schedule time
    if (!p.queuedAt) return null;
    const remaining = QUEUE_DISPLAY_MS - (Date.now() - p.queuedAt);
    if (remaining <= 0) return "Publishing soon...";
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `Publishing in ${mins}m ${secs}s`;
  };

  const navItems:{key:SMMView;icon:React.ElementType;label:string}[] = [
    {key:"overview",        icon:LayoutDashboard, label:"Overview"},
    {key:"compose",         icon:PenSquare,       label:"Create Post"},
    {key:"queue",           icon:Inbox,           label:"Queue"},
    {key:"drafts",          icon:FileText,        label:"Drafts"},
    {key:"published",       icon:Globe,           label:"Published"},
    {key:"calendar",        icon:Calendar,        label:"Calendar"},
    {key:"design_projects", icon:Palette,         label:"Design Projects"},
    {key:"gd_tasks",        icon:FileImage,       label:"GD Tasks"},
    {key:"analytics",       icon:BarChart3,       label:"Analytics"},
    {key:"channels",        icon:LinkIcon,        label:"Channels"},
    {key:"clients_gd",      icon:Users,           label:"Clients & GD"},
  ];

  const viewTitle:Record<SMMView,string>={
    overview:"SMM Dashboard", compose:editingDraft?"Edit Draft":"Create Post",
    queue:"Queue", drafts:"Drafts", published:"Published",
    calendar:"Content Calendar", gd_tasks:"GD Tasks",
    design_projects:"Design Projects", analytics:"Analytics", channels:"Channels",
    clients_gd:"Clients & Graphic Designers",
  };

  const statusBadge=(s:string)=>{
    const m:Record<string,string>={
      draft:"bg-yellow-100 text-yellow-700",
      scheduled:"bg-blue-100 text-blue-700",
      published:"bg-green-100 text-green-700",
      failed:"bg-red-100 text-red-700",
      queued:"bg-purple-100 text-purple-700",
    };
    return m[s]??"bg-slate-100 text-slate-600";
  };
  const notifIcon=(t:NotifType)=>({success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"}[t]);

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className={`smm-root min-h-screen flex ${dark?"smm-dark":""}`}>

      {/* ── Sidebar ── */}
      <aside className="smm-sidebar hidden md:flex w-64 flex-col shrink-0">
        <div className="p-5 border-b smm-border"><Logo /></div>
        <div className="p-4 flex-1">
          <div className="smm-profile-card flex items-center gap-3 p-3 rounded-xl mb-4 border">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold smm-text-primary truncate">{userName}</div>
              <div className="text-xs text-green-600 font-medium">SMM Executive</div>
            </div>
          </div>
          <nav className="space-y-0.5">
            {navItems.map(n=>(
              <button key={n.key} onClick={()=>{resetCompose();setView(n.key);}}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${view===n.key?"smm-nav-active":"smm-nav-idle"}`}>
                <n.icon className="w-4 h-4 shrink-0" />
                {n.label}
                {n.key==="queue"&&queuedPosts.length>0&&(
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-green-100 text-green-700"}`}>
                    {queuedPosts.length}
                  </span>
                )}
                {n.key==="drafts"&&drafts.length>0&&(
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${view===n.key?"bg-white/20 text-white":"bg-yellow-100 text-yellow-700"}`}>
                    {drafts.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t smm-border">
          <Button variant="ghost" className="w-full justify-start smm-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="smm-main flex-1 min-w-0 overflow-y-auto">

        {/* Header */}
        <header className="smm-header px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold smm-text-primary">{viewTitle[view]}</h1>
            <p className="text-sm smm-text-muted">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-2">
            {view==="gd_tasks"&&(
              <Button onClick={()=>setShowAddTask(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2"/>Assign Task to GD
              </Button>
            )}
            {view==="design_projects"&&(
              <Button onClick={()=>setShowAddDesign(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2"/>New Design Project
              </Button>
            )}
            {view==="queue"&&(
              <Button variant="outline" size="sm" onClick={loadQueued} disabled={queueLoading} className="smm-btn-outline">
                <RefreshCw className={`w-4 h-4 mr-1 ${queueLoading?"animate-spin":""}`}/>Refresh
              </Button>
            )}
            {view==="drafts"&&(
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{resetCompose();setView("compose");}}>
                <Plus className="w-4 h-4 mr-1"/>New Post
              </Button>
            )}
            {view==="published"&&(
              <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
                <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
              </Button>
            )}
            {view==="compose"&&(
              <Button variant="outline" size="sm" onClick={()=>{resetCompose();setView("overview");}} className="smm-btn-outline">
                ← Back
              </Button>
            )}
            {view==="channels"&&(
              <Button variant="outline" size="sm" onClick={()=>{loadChannels();loadClientsWithChannels();}} className="smm-btn-outline">
                <RefreshCw className="w-4 h-4 mr-1"/>Refresh
              </Button>
            )}

            {/* Dark Mode */}
            <button onClick={()=>setDark(d=>!d)} className="smm-icon-btn p-2 rounded-lg transition" title={dark?"Light mode":"Dark mode"}>
              {dark?<Sun className="w-5 h-5 text-yellow-400"/>:<Moon className="w-5 h-5 smm-text-secondary"/>}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={()=>setNotifOpen(o=>!o)} className="smm-icon-btn relative p-2 rounded-lg transition">
                <Bell className="w-5 h-5 smm-text-secondary"/>
                {totalBadgeCount>0&&(
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
                    {totalBadgeCount>9?"9+":totalBadgeCount}
                  </span>
                )}
              </button>

              {notifOpen&&(
                <div className="smm-notif-panel absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b smm-border smm-notif-header">
                    <span className="font-semibold text-sm smm-text-primary flex items-center gap-2">
                      <Bell className="w-4 h-4"/>Notifications
                      {unreadCount>0&&<span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                    </span>
                    <div className="flex gap-2">
                      {notifs.length>0&&(
                        <>
                          <button onClick={markAllRead} className="text-xs text-green-600 hover:underline">Mark all read</button>
                          <button onClick={clearNotifs} className="text-xs text-red-500 hover:underline">Clear</button>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex border-b smm-border">
                      <button
                        className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===0?"border-b-2 border-green-500 text-green-600":"smm-text-muted hover:smm-text-primary"}`}
                        onClick={()=>setNotifTab(0)}
                      >
                        All Notifications {unreadCount>0&&<span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">{unreadCount}</span>}
                      </button>
                      <button
                        className={`flex-1 px-3 py-2 text-xs font-medium transition ${notifTab===1?"border-b-2 border-orange-500 text-orange-600":"smm-text-muted hover:smm-text-primary"}`}
                        onClick={()=>setNotifTab(1)}
                      >
                        GD Tasks Done {completedGDCount>0&&<span className="ml-1 bg-orange-500 text-white text-[9px] px-1 py-0.5 rounded-full">{completedGDCount}</span>}
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifTab===0?(
                        notifs.length===0?(
                          <div className="px-4 py-8 text-center smm-text-muted">
                            <BellOff className="w-8 h-8 mx-auto mb-2 opacity-30"/>
                            <p className="text-sm">No notifications</p>
                          </div>
                        ):notifs.map(n=>(
                          <div key={n.id} className={`smm-notif-item flex items-start gap-3 px-4 py-3 border-b last:border-b-0 smm-border transition ${!n.read?"smm-notif-unread":""}`}>
                            <span className="text-base shrink-0 mt-0.5">{notifIcon(n.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <p className="text-xs font-semibold smm-text-primary leading-tight">{n.title}</p>
                                <button onClick={()=>deleteNotif(n.id)} className="text-slate-300 hover:text-red-400 shrink-0"><X className="w-3 h-3"/></button>
                              </div>
                              <p className="text-xs smm-text-muted mt-0.5 leading-snug">{n.message}</p>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[10px] smm-text-muted">{new Date(n.timestamp).toLocaleString("en-IN",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</span>
                                {n.action&&(
                                  <button onClick={()=>{setView(n.action!.view);setNotifOpen(false);}} className="text-[10px] text-green-600 font-medium hover:underline">
                                    {n.action.label} →
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ):(
                        completedGDCount===0?(
                          <div className="px-4 py-8 text-center smm-text-muted">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30"/>
                            <p className="text-sm">No completed GD tasks pending review</p>
                          </div>
                        ):gdTasks.filter(t=>t.status==="completed").map(task=>(
                          <div key={task.id} className="px-4 py-4 border-b last:border-b-0 smm-border bg-orange-50/50 dark:bg-orange-900/10">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold smm-text-primary leading-tight flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0"/>
                                  {task.title}
                                </p>
                                <p className="text-[11px] smm-text-muted mt-0.5">Designer: <strong>{task.gdName}</strong></p>
                                <p className="text-[11px] smm-text-muted">Client: <strong>{task.clientName}</strong></p>
                                <p className="text-[11px] smm-text-muted">Platform: {task.platform} · Due: {task.deadline}</p>
                                {task.description&&<p className="text-[11px] smm-text-muted mt-1 line-clamp-2 italic">{task.description}</p>}
                              </div>
                              <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium shrink-0">Done</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={()=>handleGDTaskApproveReject(task.id,"approve")}
                                className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition"
                              ><CheckCircle2 className="w-3 h-3"/>Approve</button>
                              <button
                                onClick={()=>handleGDTaskApproveReject(task.id,"reject")}
                                className="flex-1 flex items-center justify-center gap-1 text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md font-medium transition"
                              ><X className="w-3 h-3"/>Reject</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">

          {/* ── OVERVIEW ── */}
          {view==="overview"&&(
            <div className="space-y-6">
              {postsError&&(
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0"/>{postsError}
                </div>
              )}

              {smmDashData?.designStats&&(
                <div>
                  <h3 className="font-semibold smm-text-muted mb-3 text-sm uppercase tracking-wide">Design Projects</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {label:"Total",        value:smmDashData.designStats.totalProjects??0,       border:"border-l-slate-400"},
                      {label:"Pending",      value:smmDashData.designStats.pendingProjects??0,     border:"border-l-yellow-400"},
                      {label:"In Progress",  value:smmDashData.designStats.inProgressProjects??0,  border:"border-l-blue-400"},
                      {label:"Under Review", value:smmDashData.designStats.underReviewProjects??0, border:"border-l-purple-400"},
                      {label:"Revision",     value:smmDashData.designStats.revisionProjects??0,    border:"border-l-orange-400"},
                      {label:"Completed",    value:smmDashData.designStats.completedProjects??0,   border:"border-l-green-400"},
                      {label:"Overdue",      value:smmDashData.designStats.overdueProjects??0,     border:"border-l-red-400"},
                      {label:"Due Today",    value:smmDashData.designStats.dueTodayProjects??0,    border:"border-l-pink-400"},
                    ].map(s=>(
                      <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.border} cursor-pointer hover:shadow-md transition`} onClick={()=>setView("design_projects")}>
                        <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
                        <div className="text-xs smm-text-muted mt-1">{s.label}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {label:"Total Posts",        value:overviewLoading?"…":ovTotal,     icon:PenSquare,   color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30",    onClick:()=>setView("queue")},
                  {label:"Published",          value:overviewLoading?"…":ovPublished, icon:Globe,       color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30",  onClick:()=>setView("published")},
                  {label:"Scheduled / Queued", value:overviewLoading?"…":ovScheduled, icon:Clock,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30",onClick:()=>setView("queue")},
                  {label:"Failed",             value:overviewLoading?"…":ovFailed,    icon:AlertCircle, color:"text-red-500",    bg:"bg-red-50 dark:bg-red-900/30",      onClick:()=>setView("published")},
                ].map(s=>(
                  <Card key={s.label} className="smm-card p-5 cursor-pointer hover:shadow-md transition" onClick={s.onClick}>
                    <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
                    <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
                    <div className="text-xs smm-text-muted mt-1">{s.label}</div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="smm-card p-5 border-l-4 border-l-purple-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("queue")}>
                  <div className="flex items-center justify-between">
                    <div><div className="text-sm font-semibold smm-text-primary">Queue</div><div className="text-xs smm-text-muted mt-0.5">Posts waiting to publish</div></div>
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"><Inbox className="w-5 h-5 text-purple-600"/></div>
                  </div>
                  <div className="text-2xl font-bold smm-text-primary mt-3">{queuedPosts.length}</div>
                </Card>
                <Card className="smm-card p-5 border-l-4 border-l-yellow-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("drafts")}>
                  <div className="flex items-center justify-between">
                    <div><div className="text-sm font-semibold smm-text-primary">Drafts</div><div className="text-xs smm-text-muted mt-0.5">Saved, not published yet</div></div>
                    <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-yellow-600"/></div>
                  </div>
                  <div className="text-2xl font-bold smm-text-primary mt-3">{drafts.length}</div>
                </Card>
                <Card className="smm-card p-5 border-l-4 border-l-green-400 cursor-pointer hover:shadow-md transition" onClick={()=>setView("compose")}>
                  <div className="flex items-center justify-between">
                    <div><div className="text-sm font-semibold smm-text-primary">Create Post</div><div className="text-xs smm-text-muted mt-0.5">New post, schedule or draft</div></div>
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><PenSquare className="w-5 h-5 text-green-600"/></div>
                  </div>
                  <div className="text-sm text-green-600 font-medium mt-3">→ Create now</div>
                </Card>
              </div>

              <Card className="smm-card p-6">
                <h3 className="font-semibold smm-text-primary mb-3">Recent Posts</h3>
                {postsLoading?(
                  <div className="flex items-center gap-2 smm-text-muted py-4"><Loader2 className="w-4 h-4 animate-spin"/>Loading...</div>
                ):posts.length===0?(
                  <p className="text-sm smm-text-muted">No posts yet. <button onClick={()=>setView("compose")} className="text-green-600 hover:underline">Create your first post →</button></p>
                ):(
                  <div className="space-y-2">
                    {posts.slice(0,6).map(p=>(
                      <div key={p._id??p.id} className="flex items-center gap-3 p-3 rounded-lg border smm-border hover:smm-bg-hover">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm smm-text-primary truncate">{p.content}</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
                            {p.platforms?.slice(0,2).map(pl=><span key={pl} className="text-xs smm-text-muted capitalize">{pl}</span>)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ── COMPOSE ── */}
          {view==="compose"&&(
            <div className="max-w-2xl space-y-5">
              {editingDraft&&(
                <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 px-4 py-2.5 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <Edit2 className="w-4 h-4"/>Editing a draft
                </div>
              )}
              <Card className="smm-card p-6 space-y-5">

                {/* ── Step 1: Select Client ── */}
                <div>
                  <Label className="smm-text-primary font-semibold">Step 1 — Select Client *</Label>
                  <select
                    value={composeClientId}
                    onChange={e => setComposeClientId(e.target.value)}
                    className="smm-select mt-2 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">— Select Client —</option>
                    {clientList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}{c.email?` (${c.email})`:""}</option>
                    ))}
                  </select>
                  {composeClientId&&(
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      ✓ Post will be created for: <strong>{clientList.find(c=>c.id===composeClientId)?.name}</strong>
                    </p>
                  )}
                </div>

                {/* ── Step 2: Select Platform (from client's connected channels) ── */}
                <div>
                  <Label className="smm-text-primary font-semibold">
                    Step 2 — Select Platform *
                    {composeClientId&&<span className="ml-2 text-xs font-normal smm-text-muted">(client's connected channels)</span>}
                  </Label>
                  {!composeClientId?(
                    <p className="text-xs smm-text-muted mt-2 italic">Please select a client first to see their connected channels.</p>
                  ):clientChannelsFetching?(
                    <div className="flex items-center gap-2 smm-text-muted mt-2 text-sm"><Loader2 className="w-4 h-4 animate-spin"/>Loading channels...</div>
                  ):clientConnectedChannels.length===0?(
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
                        ⚠️ This client has no connected channels yet.{" "}
                        <button onClick={()=>setView("channels")} className="font-semibold underline">
                          Go to Channels to connect
                        </button>
                      </p>
                      {/* FIXED: pehle yahan PLATFORMS ki poori static list
                          (saare 6 platforms) dikhti thi, chahe admin ne is
                          client ke liye Add Client form me sirf kuch hi
                          platforms select kiye ho. Ab sirf wahi platforms
                          dikhte hain jo admin ne select kiye the. Agar admin
                          ne kuch select hi nahi kiya (purane clients), toh
                          fallback me sab dikhte hain taaki client "locked
                          out" na ho jaye. */}
                      <p className="text-xs smm-text-muted">Or select platform manually:</p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          (clientList.find(c => c.id === composeClientId)?.platforms?.length ?? 0) > 0
                            ? PLATFORMS.filter(p =>
                                clientList
                                  .find(c => c.id === composeClientId)!
                                  .platforms!.some(cp => cp.toLowerCase() === p.id.toLowerCase())
                              )
                            : PLATFORMS
                        ).map(p=>(
                          <button key={p.id} type="button" onClick={()=>togglePlat(p.id)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${composePlatforms.includes(p.id)?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ):(
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-2" ref={platformDropdownRef}>
                        {(() => {
                          // Same platform ke saare connected channels (e.g. multiple
                          // Facebook Pages) ko ek group me le aate hain taaki UI me
                          // us platform ka sirf EK button dikhe — YouTube jaisa.
                          const grouped: Record<string, ConnectedChannel[]> = {};
                          clientConnectedChannels.forEach(ch => {
                            const p = ch.platform?.toLowerCase() ?? "unknown";
                            (grouped[p] ??= []).push(ch);
                          });

                          return Object.entries(grouped).map(([platId, chs]) => {
                            const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===platId);
                            const isPlatformSelected = composePlatforms.includes(platId);

                            // ── Single account for this platform: ek simple toggle button ──
                            if (chs.length === 1) {
                              const ch = chs[0];
                              const channelId = String(ch._id??ch.id??platId);
                              const isSelected = isPlatformSelected && composeChannelIds[platId] === channelId;
                              return (
                                <button key={platId} type="button"
                                  onClick={()=>selectChannel(platId, channelId)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${isSelected?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
                                  <span>{platInfo?.icon??"🔗"}</span>
                                  <span className="capitalize">{platInfo?.label??ch.platform}</span>
                                  {(ch.username||ch.name)&&(
                                    <span className={`text-xs ${isSelected?"text-white/80":"smm-text-muted"}`}>
                                      @{ch.username??ch.name}
                                    </span>
                                  )}
                                </button>
                              );
                            }

                            // ── Multiple accounts (e.g. Facebook Pages): ek button jispe
                            //    click karne se saari Pages ki dropdown list khulti hai ──
                            const selectedChannelId = composeChannelIds[platId];
                            const selectedChannel = chs.find(
                              ch => String(ch._id??ch.id??platId) === selectedChannelId
                            );
                            const isOpen = openPlatformDropdown === platId;
                            return (
                              <div key={platId} className="relative">
                                <button type="button"
                                  onClick={()=>setOpenPlatformDropdown(isOpen?null:platId)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${isPlatformSelected?"bg-green-600 text-white border-green-600":"smm-btn-outline"}`}>
                                  <span>{platInfo?.icon??"🔗"}</span>
                                  <span className="capitalize">{platInfo?.label??platId}</span>
                                  {selectedChannel&&(
                                    <span className={`text-xs ${isPlatformSelected?"text-white/80":"smm-text-muted"}`}>
                                      @{selectedChannel.username??selectedChannel.name}
                                    </span>
                                  )}
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen?"rotate-180":""}`}/>
                                </button>
                                {isOpen && (
                                  <div className="absolute z-20 mt-1 min-w-[14rem] rounded-lg border smm-card shadow-lg py-1 max-h-64 overflow-y-auto">
                                    <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide smm-text-muted">
                                      Select {platInfo?.label??platId} Page
                                    </p>
                                    {chs.map(ch=>{
                                      const channelId = String(ch._id??ch.id??platId);
                                      const isSel = isPlatformSelected && composeChannelIds[platId] === channelId;
                                      return (
                                        <button key={channelId} type="button"
                                          onClick={()=>{ selectChannel(platId, channelId); setOpenPlatformDropdown(null); }}
                                          className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition hover:bg-green-50 dark:hover:bg-green-900/20 ${isSel?"bg-green-50 dark:bg-green-900/20 font-semibold text-green-700 dark:text-green-400":"smm-text-primary"}`}>
                                          <span className="truncate">{ch.name??ch.username??"Page"}</span>
                                          {isSel && <CheckCircle2 className="w-4 h-4 shrink-0"/>}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                      <p className="text-xs smm-text-muted">
                        {composePlatforms.length} platform{composePlatforms.length!==1?"s":""} selected
                      </p>
                      {(() => {
                        const platformCounts: Record<string, number> = {};
                        clientConnectedChannels.forEach(ch => {
                          const p = ch.platform?.toLowerCase();
                          platformCounts[p] = (platformCounts[p] ?? 0) + 1;
                        });
                        const multi = Object.entries(platformCounts).filter(([, n]) => n > 1);
                        if (multi.length === 0) return null;
                        return (
                          <p className="text-xs text-blue-600">
                            ℹ️ {multi.map(([p]) => p).join(", ")} ke liye multiple accounts connected
                            hain — button pe click karke dropdown se jo Page select karoge sirf usi Page/account pe post jaayegi.
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* ── Step 3: Content ── */}
                <div>
                  <Label className="smm-text-primary font-semibold">Step 3 — Content *</Label>
                  <textarea value={composeContent} onChange={e=>setComposeContent(e.target.value)}
                    placeholder="Write your post here..." rows={6} maxLength={2000}
                    className="smm-textarea mt-2 w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
                  <div className="text-xs smm-text-muted text-right mt-1">{composeContent.length}/2000</div>
                </div>

                {/* ── Step 4: Schedule (optional) ── */}
                <div>
                  <Label className="smm-text-primary font-semibold">Step 4 — Schedule Date (optional)</Label>
                  <p className="text-xs smm-text-muted mb-2">Leave empty for instant post (will show in queue for 5 minutes)</p>
                  <Input type="date" value={composeScheduleDate} onChange={e=>setComposeScheduleDate(e.target.value)}
                    min={new Date().toISOString().slice(0,10)} className="smm-input"/>
                </div>
                {composeScheduleDate&&(
                  <div>
                    <Label className="smm-text-primary">Schedule Time</Label>
                    <Input type="time" value={composeScheduleTime} onChange={e=>setComposeScheduleTime(e.target.value)} className="smm-input mt-2"/>
                    <p className="text-xs smm-text-muted mt-1">
                      {composeScheduleTime
                        ? `✅ Will publish on ${composeScheduleDate} at ${composeScheduleTime}`
                        : "Leave time empty to schedule at midnight"}
                    </p>
                  </div>
                )}

                {/* YouTube Settings */}
                {composePlatforms.includes("youtube") && (
                  <div className="border rounded-xl p-4 space-y-4 bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800">
                    <div className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                      ▶️ YouTube Settings
                    </div>
                    {/* Video Title */}
                    <div>
                      <Label className="smm-text-primary">Video Title *</Label>
                      <input
                        value={youtubeTitle}
                        onChange={e => setYoutubeTitle(e.target.value)}
                        placeholder="e.g. My Awesome Video - June 2025"
                        maxLength={100}
                        className="smm-input mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <p className="text-xs smm-text-muted mt-1">
                        Khali chodoge toh description ka pehla hissa use hoga
                      </p>
                    </div>
                    {/* Privacy */}
                    <div>
                      <Label className="smm-text-primary">Privacy</Label>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {(["public", "unlisted", "private"] as const).map(opt => (
                          <button key={opt} type="button"
                            onClick={() => setYoutubePrivacy(opt)}
                            className={`px-3 py-1.5 rounded-lg border text-sm capitalize font-medium transition ${
                              youtubePrivacy === opt
                                ? "bg-red-600 text-white border-red-600"
                                : "smm-btn-outline"
                            }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Video file status */}
                    {isVideoFile ? (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        ✅ Video file selected — ready to upload
                      </p>
                    ) : (
                      <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700">
                        ⚠️ Neeche "Image / Video" section se MP4 video file select karo
                      </p>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div>
                  <Label className="smm-text-primary">Tags (optional)</Label>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {composeTags.map(tag=>(
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                          #{tag}
                          <button type="button" onClick={()=>setComposeTags(p=>p.filter(t=>t!==tag))} className="hover:text-red-500">
                            <X className="w-3 h-3"/>
                          </button>
                        </span>
                      ))}
                    </div>
                    <Input value={composeTagInput} onChange={e=>setComposeTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                      placeholder="Type a tag and press Enter" className="smm-input text-sm"/>
                  </div>
                </div>

                {/* Media */}
                <div>
                  <Label className="smm-text-primary">Image / Video (optional)</Label>
                  {/* FIXED: pehle video select karne par preview blank dikhta
                      tha (sirf <img> tag tha, jo video render nahi kar
                      sakta) — YouTube tab ke andar hi ek alag "selected"
                      message tha, baaki platforms (Facebook, Instagram,
                      etc.) ke liye koi confirmation nahi tha. Ab video ke
                      liye <video> preview dikhta hai, jo har platform ke
                      liye kaam karta hai. */}
                  {composeMedia ? (
                    <div className="relative mt-2 inline-block">
                      {isVideoFile ? (
                        <video
                          src={URL.createObjectURL(composeMedia)}
                          controls
                          className="max-h-40 rounded-lg border smm-border"
                        />
                      ) : (
                        <img src={composePreview ?? undefined} alt="preview" className="max-h-40 rounded-lg border smm-border"/>
                      )}
                      <button type="button" onClick={()=>{setComposePreview(null);setComposeMedia(null);setIsVideoFile(false);}}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ✅ {isVideoFile ? "Video" : "Image"} selected: {composeMedia.name}
                      </p>
                    </div>
                  ):(
                    <label className="smm-upload-area mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer text-sm smm-text-muted">
                      🖼 Upload image or video
                      <input type="file" accept="image/*,video/*" className="hidden" onChange={e=>{
                      const f=e.target.files?.[0];
                      if(f){
                        setComposeMedia(f);
                        setIsVideoFile(f.type.startsWith("video/"));
                        setComposePreview(f.type.startsWith("video/") ? null : URL.createObjectURL(f));
                      }
                    }}/>
                    </label>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap pt-2 border-t smm-border">
                  <Button variant="outline" onClick={()=>handleCompose("draft")} disabled={composeSaving} className="smm-btn-outline">
                    {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                    <FileText className="w-4 h-4 mr-2"/>{editingDraft?"Update Draft":"Save as Draft"}
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={()=>handleCompose("queue")} disabled={composeSaving}>
                    {composeSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                    <Inbox className="w-4 h-4 mr-2"/>
                    {composeScheduleDate?"Schedule Post":"Add to Queue (Instant)"}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* ── QUEUE ── */}
          {view==="queue"&&(
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm smm-text-muted">Posts in queue — instant posts auto-publish in 5 minutes</p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
                  <Plus className="w-4 h-4 mr-1"/>New Post
                </Button>
              </div>
              {queueLoading?(
                <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
              ):queuedPosts.length===0?(
                <Card className="smm-card p-12 text-center">
                  <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                  <p className="smm-text-secondary font-medium">Queue is empty</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
                    <Plus className="w-4 h-4 mr-2"/>Create Post
                  </Button>
                </Card>
              ):(
                <div className="space-y-3">
                  {queuedPosts.map(p=>{
                    const pid=p._id??p.id??"";
                    const timeLeft = queueTimeLeft(p);
                    const isScheduled = !!(p.scheduleAt??p.scheduled_at);
                    return(
                      <Card key={pid} className="smm-card p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
                              {isScheduled?(
                                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                                  📅 Scheduled
                                </span>
                              ):(
                                <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium animate-pulse">
                                  ⚡ Instant
                                </span>
                              )}
                              {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
                            </div>
                            <p className="text-sm smm-text-primary">{p.content}</p>
                            {isScheduled?(
                              <p className="text-xs smm-text-muted mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3"/>
                                Scheduled: {new Date(p.scheduleAt??p.scheduled_at??"").toLocaleString("en-IN")}
                              </p>
                            ):timeLeft?(
                              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3"/>{timeLeft}
                              </p>
                            ):null}
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 shrink-0" onClick={()=>handlePublishNow(pid)} disabled={publishingId===pid}>
                            {publishingId===pid?<Loader2 className="w-4 h-4 animate-spin"/>:<><CheckCircle2 className="w-4 h-4 mr-1"/>Publish Now</>}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── DRAFTS ── */}
          {view==="drafts"&&(
            <div className="space-y-4">
              <p className="text-sm smm-text-muted">Saved drafts — edit or add to queue</p>
              {draftsLoading?(
                <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
              ):drafts.length===0?(
                <Card className="smm-card p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                  <p className="smm-text-secondary font-medium">No drafts found</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}>
                    <Plus className="w-4 h-4 mr-2"/>Create Post
                  </Button>
                </Card>
              ):(
                <div className="space-y-3">
                  {drafts.map(d=>{const did=d._id??d.id??"";return(
                    <Card key={did} className="smm-card p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">Draft</span>
                            {d.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
                          </div>
                          <p className="text-sm smm-text-primary line-clamp-3">{d.content}</p>
                          {d.createdAt&&<p className="text-xs smm-text-muted mt-2">Saved: {new Date(d.createdAt).toLocaleString("en-IN")}</p>}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" onClick={()=>handleEditDraft(d)} className="smm-btn-outline">
                            <Edit2 className="w-4 h-4 mr-1"/>Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDraft(did)} disabled={deletingDid===did}>
                            {deletingDid===did?<Loader2 className="w-4 h-4 animate-spin"/>:<Trash2 className="w-4 h-4"/>}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );})}
                </div>
              )}
            </div>
          )}

          {/* ── PUBLISHED ── */}
          {view==="published"&&(
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm smm-text-muted">Record of all published posts</p>
                <Button variant="outline" size="sm" onClick={loadPublished} disabled={pubLoading} className="smm-btn-outline">
                  <RefreshCw className={`w-4 h-4 mr-1 ${pubLoading?"animate-spin":""}`}/>Refresh
                </Button>
              </div>
              {pubLoading?(
                <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
              ):pubPosts.length===0?(
                <Card className="smm-card p-12 text-center">
                  <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                  <p className="smm-text-secondary font-medium">No published posts yet</p>
                  <p className="text-xs smm-text-muted mt-1">Posts published from the queue will appear here</p>
                </Card>
              ):(
                <div className="space-y-3">
                  {pubPosts.map(p=>{const pid=p._id??p.id??"";return(
                    <Card key={pid} className="smm-card p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>{p.status}</span>
                            {p.platforms?.map(pl=><span key={pl} className="text-xs smm-platform-badge px-2 py-0.5 rounded-full capitalize">{pl}</span>)}
                          </div>
                          <p className="text-sm smm-text-primary">{p.content}</p>
                          {p.createdAt&&<p className="text-xs smm-text-muted mt-2 flex items-center gap-1"><Globe className="w-3 h-3"/>Published: {new Date(p.createdAt).toLocaleString("en-IN")}</p>}
                        </div>
                      </div>
                    </Card>
                  );})}
                </div>
              )}
            </div>
          )}

          {/* ── CHANNELS ── */}
          {view==="channels"&&(
            <div className="space-y-8">

              {/* ── Client Channels ── */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600"/>
                  </div>
                  <div>
                    <h2 className="text-base font-bold smm-text-primary">Client Channels</h2>
                    <p className="text-xs smm-text-muted">Manage social accounts for each client — connect platforms on their behalf</p>
                  </div>
                </div>
                {clientChannelsLoading?(
                  <div className="flex items-center gap-2 smm-text-muted py-4 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading client channels...</div>
                ):clientList.length===0?(
                  <Card className="smm-card p-8 text-center">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
                    <p className="text-sm smm-text-muted">No clients found. Clients appear once design projects are loaded.</p>
                    <Button variant="outline" size="sm" className="mt-3 smm-btn-outline" onClick={()=>{loadUsersForDropdowns().then(()=>loadClientsWithChannels());}}>
                      <RefreshCw className="w-4 h-4 mr-1"/>Load Clients
                    </Button>
                  </Card>
                ):(
                  <div className="space-y-4">
                    {(clientsWithChannels.length > 0 ? clientsWithChannels : clientList.map(c=>({...c,channels:[]}))).map(client=>(
                      <Card key={client.id} className="smm-card p-5">
                        {/* Client header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-blue-600">{client.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="font-semibold smm-text-primary text-sm">{client.name}</div>
                            {client.email&&<div className="text-xs smm-text-muted">{client.email}</div>}
                          </div>
                          <div className="ml-auto">
                            {(client as ClientWithChannels).channels?.length > 0 ? (
                              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                                {(client as ClientWithChannels).channels.length} connected
                              </span>
                            ):(
                              <span className="text-xs bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full">
                                No channels
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Connected channels for this client */}
                        {(client as ClientWithChannels).channels?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connected Accounts</p>
                            <div className="space-y-2">
                              {(client as ClientWithChannels).channels.map(ch=>{
                                const chId = ch._id??ch.id??"";
                                const platInfo = CONNECTABLE_PLATFORMS.find(p=>p.id===ch.platform?.toLowerCase());
                                return(
                                  <div key={chId} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border smm-border bg-slate-50/50 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm bg-gradient-to-br ${platInfo?.color??"from-slate-400 to-slate-500"}`}>
                                        {platInfo?.icon??"🔗"}
                                      </span>
                                      <div>
                                        <div className="text-xs font-medium smm-text-primary capitalize">{platInfo?.label??ch.platform}</div>
                                        {(ch.username||ch.name)&&<div className="text-[10px] smm-text-muted">@{ch.username??ch.name}</div>}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium">✓ Connected</span>
                                      <button
                                        onClick={()=>handleDisconnectClientChannel(chId, client.id)}
                                        className="text-[10px] text-red-500 hover:underline px-1"
                                      >Disconnect</button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Connect new platform for this client */}
                        <div>
                          <p className="text-xs font-semibold smm-text-muted mb-2 uppercase tracking-wide">Connect Platform</p>
                          <div className="flex flex-wrap gap-2">
                            {/* FIXED: pehle yahan CONNECTABLE_PLATFORMS ki
                                POORI static list (saare 6 platforms) har
                                client ke liye dikhti thi, chahe admin ne
                                us client ke liye sirf kuch hi platforms
                                select kiye ho. Ab sirf wahi platforms
                                dikhte hain jo admin ne is client ke liye
                                Add Client form me select kiye the. Agar
                                admin ne kuch select hi nahi kiya (purane
                                clients jinke liye ye feature nahi tha),
                                toh fallback me sab dikhte hain taaki wo
                                clients "locked out" na ho jayein. */}
                            {(((client as ClientWithChannels).platforms?.length ?? 0) > 0
                              ? CONNECTABLE_PLATFORMS.filter(p =>
                                  (client as ClientWithChannels).platforms!.some(
                                    cp => cp.toLowerCase() === p.id.toLowerCase()
                                  )
                                )
                              : CONNECTABLE_PLATFORMS
                            ).map(plat=>{
                              const key=`${client.id}_${plat.id}`;
                              const isLoading=connectingForClient===key;
                              const isAlreadyConnected=(client as ClientWithChannels).channels?.some(ch=>ch.platform?.toLowerCase()===plat.id);
                              return(
                                <Button key={plat.id} size="sm" variant="outline"
                                  className={`text-xs gap-1.5 ${isAlreadyConnected?"opacity-50 cursor-not-allowed smm-btn-outline":"smm-btn-outline hover:border-blue-500 hover:text-blue-600"}`}
                                  onClick={()=>!isAlreadyConnected&&handleConnectForClient(plat.id, client.id)}
                                  disabled={isLoading||isAlreadyConnected}>
                                  {isLoading?<Loader2 className="w-3 h-3 animate-spin"/>:<span>{plat.icon}</span>}
                                  {isAlreadyConnected?"✓ "+plat.label:plat.label}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── CLIENTS & GD ── */}
          {view==="clients_gd"&&(
            <div className="space-y-8">
              {/* Clients Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600"/>
                  </div>
                  <div>
                    <h2 className="text-base font-bold smm-text-primary">Clients</h2>
                    <p className="text-xs smm-text-muted">{clientList.length} client(s)</p>
                  </div>
                </div>
                {clientList.length===0?(
                  <Card className="smm-card p-8 text-center">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
                    <p className="text-sm smm-text-muted">No clients found. They will appear once design projects are loaded.</p>
                  </Card>
                ):(
                  <div className="space-y-2">
                    {clientList.map(c=>(
                      <Card key={c.id} className="smm-card p-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-blue-600">{c.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-semibold smm-text-primary text-sm">{c.name}</div>
                          {c.email&&<div className="text-xs smm-text-muted">{c.email}</div>}
                        </div>
                        <Button size="sm" variant="outline" className="ml-auto smm-btn-outline text-xs" onClick={()=>setView("channels")}>
                          <LinkIcon className="w-3 h-3 mr-1"/>Manage Channels
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Graphic Designers Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-purple-600"/>
                  </div>
                  <div>
                    <h2 className="text-base font-bold smm-text-primary">Graphic Designers</h2>
                    <p className="text-xs smm-text-muted">{gdList.length} designer(s)</p>
                  </div>
                </div>
                {gdList.length===0?(
                  <Card className="smm-card p-8 text-center">
                    <Palette className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
                    <p className="text-sm smm-text-muted">No graphic designers found. They appear once design projects are loaded.</p>
                  </Card>
                ):(
                  <div className="space-y-2">
                    {gdList.map(g=>(
                      <Card key={g.id} className="smm-card p-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-purple-600">{g.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-semibold smm-text-primary text-sm">{g.name}</div>
                          {g.email&&<div className="text-xs smm-text-muted">{g.email}</div>}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── CALENDAR ── */}
          {view==="calendar"&&(
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()-1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">←</button>
                <span className="font-semibold smm-text-primary min-w-[160px] text-center">{monthNames[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
                <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()+1,1))} className="smm-cal-nav-btn px-3 py-1 border smm-border rounded text-sm smm-text-primary hover:smm-bg-hover">→</button>
                <Button size="sm" variant="outline" onClick={()=>setCalMonth(new Date())} className="smm-btn-outline">Today</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setView("compose")}><Plus className="w-3 h-3 mr-1"/>New Post</Button>
              </div>
              <Card className="smm-card overflow-hidden">
                <div className="grid grid-cols-7 border-b smm-border smm-cal-header">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
                    <div key={d} className="p-3 text-xs font-semibold smm-text-muted text-center uppercase tracking-wide">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calDays.map((d,i)=>{
                    const dp=d?postsForDay(d):[];
                    const today=d?d.toDateString()===new Date().toDateString():false;
                    return(
                      <div key={i} className="min-h-[100px] border-r border-b smm-border p-2 last:border-r-0">
                        {d&&(
                          <>
                            <div className={`text-xs font-medium mb-1 inline-flex items-center justify-center w-6 h-6 rounded-full ${today?"bg-green-600 text-white":"smm-text-muted"}`}>{d.getDate()}</div>
                            <div className="space-y-1">
                              {dp.slice(0,2).map(p=>(
                                <div key={p._id??p.id} className={`text-xs px-2 py-1 rounded truncate ${statusBadge(p.status)}`}>{p.content.slice(0,20)}…</div>
                              ))}
                              {dp.length>2&&<div className="text-xs smm-text-muted px-1">+{dp.length-2} more</div>}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* ── GD TASKS ── */}
          {view==="gd_tasks"&&(
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {label:"Pending",        count:taskCounts.pending,     color:"border-l-slate-400"},
                  {label:"In Progress",    count:taskCounts.in_progress, color:"border-l-blue-400"},
                  {label:"Needs Revision", count:taskCounts.revision,    color:"border-l-orange-400"},
                  {label:"Completed",      count:taskCounts.completed,   color:"border-l-green-400"},
                ].map(s=>(
                  <Card key={s.label} className={`smm-card p-4 border-l-4 ${s.color}`}>
                    <div className="text-2xl font-bold smm-text-primary">{s.count}</div>
                    <div className="text-xs smm-text-muted mt-1">{s.label}</div>
                  </Card>
                ))}
              </div>
              {gdTasks.length===0?(
                <Card className="smm-card p-12 text-center">
                  <FileImage className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                  <p className="smm-text-secondary">No tasks yet. Click "Assign Task to GD" to get started.</p>
                </Card>
              ):(
                <div className="space-y-3">
                  {gdTasks.map(task=>(
                    <Card key={task.id} className="smm-card p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold smm-text-primary">{task.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status==="completed"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":task.status==="revision"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":task.status==="in_progress"?"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300":"bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}>
                              {task.status.replace("_"," ")}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.priority==="high"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":task.priority==="medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm smm-text-muted mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap">
                            <span>Client: <strong className="smm-text-secondary">{task.clientName}</strong></span>
                            {task.gdName&&<span>Designer: <strong className="smm-text-secondary">{task.gdName}</strong></span>}
                            <span>Platform: <strong className="smm-text-secondary">{task.platform}</strong></span>
                            <span>Due: <strong className="smm-text-secondary">{task.deadline}</strong></span>
                          </div>
                          {task.status==="revision"&&task.revisionComment&&(
                            <div className="mt-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-800">
                              Revision note: {task.revisionComment}
                            </div>
                          )}
                        </div>
                        {task.status==="completed"&&(
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline" className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              onClick={()=>{const c=prompt("Revision comment:");if(c)handleRevision(task.id,c);}}>
                              Request Revision
                            </Button>
                            <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={()=>handleGDTaskApproveReject(task.id,"approve")}>
                              <CheckCircle2 className="w-3 h-3 mr-1"/>Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={()=>handleGDTaskApproveReject(task.id,"reject")}>
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DESIGN PROJECTS ── */}
          {view==="design_projects"&&(
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <select value={designFilter} onChange={e=>{setDesignFilter(e.target.value);setTimeout(()=>loadDesignProjects(),0);}}
                  className="smm-select px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">All Status</option>
                  {["Pending","In Progress","Under Review","Revision","Completed","Cancelled"].map(s=>(
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <Button size="sm" variant="outline" onClick={loadDesignProjects} disabled={designLoading} className="smm-btn-outline">
                  <RefreshCw className={`w-4 h-4 mr-1 ${designLoading?"animate-spin":""}`}/>Refresh
                </Button>
              </div>
              {designLoading?(
                <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
              ):designProjects.length===0?(
                <Card className="smm-card p-12 text-center">
                  <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                  <p className="smm-text-secondary font-medium">No design projects found</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={()=>setShowAddDesign(true)}>
                    <Plus className="w-4 h-4 mr-2"/>New Design Project
                  </Button>
                </Card>
              ):(
                <div className="space-y-3">
                  {designProjects.map(p=>{
                    const pid=p._id??p.id??"";
                    const clientName=typeof p.clientId==="object"?p.clientId?.name:clientList.find(c=>c.id===p.clientId)?.name??"—";
                    const designerName=typeof p.designerId==="object"?p.designerId?.name:gdList.find(g=>g.id===p.designerId)?.name??"—";
                    const sc:Record<string,string>={
                      "Pending":"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
                      "In Progress":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
                      "Under Review":"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
                      "Revision":"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
                      "Completed":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
                      "Cancelled":"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                    };
                    return(
                      <Card key={pid} className="smm-card p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold smm-text-primary">{p.title}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc[p.status]??"bg-slate-100 text-slate-600"}`}>{p.status}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.priority==="Urgent"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":p.priority==="High"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":p.priority==="Medium"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
                                {p.priority}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs smm-text-muted flex-wrap mt-1">
                              <span>Type: <strong className="smm-text-secondary">{p.designType}</strong></span>
                              <span>Client: <strong className="smm-text-secondary">{clientName}</strong></span>
                              <span>Designer: <strong className="smm-text-secondary">{designerName}</strong></span>
                              <span>Deadline: <strong className="smm-text-secondary">{p.deadline?.slice(0,10)}</strong></span>
                            </div>
                            {p.description&&<p className="text-sm smm-text-muted mt-1 truncate">{p.description}</p>}
                          </div>
                          <div className="flex gap-2 flex-wrap shrink-0">
                            <Button size="sm" variant="outline" onClick={()=>openProjectDetail(p)} className="smm-btn-outline">
                              <MessageSquare className="w-4 h-4 mr-1"/>Comments
                            </Button>
                            {p.status==="Under Review"&&(
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>handleApproveReject(pid,"approve")}>
                                  <CheckCircle2 className="w-4 h-4 mr-1"/>Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={()=>handleRevisionReq(pid)}>
                                  Revision
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleApproveReject(pid,"reject")}>
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={()=>handleDeleteDP(pid)}>
                              <Trash2 className="w-4 h-4"/>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {view==="analytics"&&(
            <div className="space-y-6">
              {analyticsLoading?(
                <div className="flex items-center gap-2 smm-text-muted py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin"/>Loading...</div>
              ):(
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {label:"Total Reach",  value:analytics?.reach??       "—", icon:Eye,        color:"text-blue-600",   bg:"bg-blue-50 dark:bg-blue-900/30"},
                      {label:"Impressions",  value:analytics?.impressions?? "—", icon:TrendingUp,  color:"text-green-600",  bg:"bg-green-50 dark:bg-green-900/30"},
                      {label:"Engagement",   value:analytics?.engagement??  "—", icon:Heart,       color:"text-pink-600",   bg:"bg-pink-50 dark:bg-pink-900/30"},
                      {label:"Followers",    value:analytics?.followers??   "—", icon:Users,       color:"text-purple-600", bg:"bg-purple-50 dark:bg-purple-900/30"},
                    ].map(s=>(
                      <Card key={s.label} className="smm-card p-5">
                        <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-4 h-4 ${s.color}`}/></div>
                        <div className="text-2xl font-bold smm-text-primary">{s.value}</div>
                        <div className="text-xs smm-text-muted mt-1">{s.label}</div>
                      </Card>
                    ))}
                  </div>
                  <Card className="smm-card p-6">
                    <h3 className="font-semibold smm-text-primary mb-4">Weekly Reach & Engagement</h3>
                    {analytics?.weeklyData?.length?(
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"}/>
                            <XAxis dataKey="day" stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
                            <YAxis stroke={dark?"#64748b":"#94a3b8"} fontSize={12}/>
                            <Tooltip contentStyle={{background:dark?"#1e293b":"#fff",border:"1px solid #334155",borderRadius:8}}/>
                            <Line type="monotone" dataKey="reach" stroke="#22c55e" strokeWidth={2.5} name="Reach"/>
                            <Line type="monotone" dataKey="engagement" stroke="#818cf8" strokeWidth={2.5} name="Engagement"/>
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ):(
                      <div className="h-32 flex items-center justify-center smm-text-muted text-sm">
                        No analytics data available. Connect social accounts first.
                      </div>
                    )}
                  </Card>
                </>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── Add Design Project Modal ── */}
      {showAddDesign&&(
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="smm-modal w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold smm-text-primary">New Design Project</h2>
              <button onClick={()=>setShowAddDesign(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateDP} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="smm-text-primary">Client *</Label>
                  <select value={newDP.clientId} onChange={e=>setNewDP(n=>({...n,clientId:e.target.value}))}
                    className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    <option value="">-- Select Client --</option>
                    {clientList.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="smm-text-primary">Graphic Designer *</Label>
                  <select value={newDP.designerId} onChange={e=>setNewDP(n=>({...n,designerId:e.target.value}))}
                    className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    <option value="">-- Select Designer --</option>
                    {gdList.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label className="smm-text-primary">Project Title *</Label>
                <Input value={newDP.title} onChange={e=>setNewDP(n=>({...n,title:e.target.value}))}
                  placeholder="e.g. Logo Design for Sharma Enterprises" required className="smm-input mt-1"/>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="smm-text-primary">Design Type</Label>
                  <select value={newDP.designType} onChange={e=>setNewDP(n=>({...n,designType:e.target.value}))}
                    className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    {["Social Post","Logo","Banner","Brochure","Video Thumbnail","Story","Reel Cover","Other"].map(t=>(
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="smm-text-primary">Deadline *</Label>
                  <Input type="date" value={newDP.deadline} onChange={e=>setNewDP(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
                </div>
                <div>
                  <Label className="smm-text-primary">Priority</Label>
                  <select value={newDP.priority} onChange={e=>setNewDP(n=>({...n,priority:e.target.value}))}
                    className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    {["Low","Medium","High","Urgent"].map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label className="smm-text-primary">Description</Label>
                <textarea value={newDP.description} onChange={e=>setNewDP(n=>({...n,description:e.target.value}))} rows={3}
                  className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="smm-text-primary">Target Audience</Label>
                  <Input value={newDP.targetAudience} onChange={e=>setNewDP(n=>({...n,targetAudience:e.target.value}))} placeholder="e.g. 25-45 professionals" className="smm-input mt-1"/>
                </div>
                <div>
                  <Label className="smm-text-primary">Revision Limit</Label>
                  <Input type="number" min={1} max={10} value={newDP.revisionLimit} onChange={e=>setNewDP(n=>({...n,revisionLimit:Number(e.target.value)}))} className="smm-input mt-1"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="smm-text-primary">Brand Colors</Label>
                  <Input value={newDP.brandColors} onChange={e=>setNewDP(n=>({...n,brandColors:e.target.value}))} placeholder="#0044CC, #FFFFFF" className="smm-input mt-1"/>
                </div>
                <div>
                  <Label className="smm-text-primary">Font Preferences</Label>
                  <Input value={newDP.fontPreferences} onChange={e=>setNewDP(n=>({...n,fontPreferences:e.target.value}))} placeholder="Montserrat Bold" className="smm-input mt-1"/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddDesign(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={dpSaving}>
                  {dpSaving&&<Loader2 className="w-4 h-4 mr-2 animate-spin"/>}<Send className="w-4 h-4 mr-2"/>Create & Assign
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── Comments Modal ── */}
      {selProject&&(
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="smm-modal w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold smm-text-primary truncate">{selProject.title}</h2>
              <button onClick={()=>{setSelProject(null);setProjComments([]);setNewComment("");}} className="smm-text-muted hover:smm-text-primary shrink-0">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <h3 className="text-sm font-semibold smm-text-primary mb-2">Comments</h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {projComments.length===0?(
                <p className="text-sm smm-text-muted">No comments yet</p>
              ):projComments.map((c:any,i:number)=>(
                <div key={c._id??i} className="text-sm smm-comment px-3 py-2 rounded-lg border smm-border">
                  <span className="font-medium smm-text-primary">{c.senderName??c.sender?.name??"User"}: </span>
                  <span className="smm-text-secondary">{c.message??c.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Write a comment..." className="smm-input"
                onKeyDown={e=>{if(e.key==="Enter")handleSendComment();}}/>
              <Button onClick={handleSendComment} disabled={commentSending||!newComment.trim()} className="bg-green-600 hover:bg-green-700 shrink-0">
                {commentSending?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Assign GD Task Modal ── */}
      {showAddTask&&(
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="smm-modal w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold smm-text-primary">Assign Task to Graphic Designer</h2>
              <button onClick={()=>setShowAddTask(false)} className="smm-text-muted hover:smm-text-primary"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <Label className="smm-text-primary">Task Title *</Label>
                <Input value={newTask.title} onChange={e=>setNewTask(n=>({...n,title:e.target.value}))} placeholder="e.g. Instagram Story — Summer Sale" required className="smm-input mt-1"/>
              </div>
              <div>
                <Label className="smm-text-primary">Description</Label>
                <textarea value={newTask.description} onChange={e=>setNewTask(n=>({...n,description:e.target.value}))} rows={3}
                  placeholder="What should the designer create..."
                  className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="smm-text-primary">Client *</Label>
                  {clientList.length>0?(
                    <select value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))}
                      className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                      <option value="">-- Select Client --</option>
                      {clientList.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  ):(
                    <Input value={newTask.clientName} onChange={e=>setNewTask(n=>({...n,clientName:e.target.value}))} placeholder="Client name" required className="smm-input mt-1"/>
                  )}
                </div>
                <div>
                  <Label className="smm-text-primary">Graphic Designer</Label>
                  {gdList.length>0?(
                    <select value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))}
                      className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">-- Select Designer --</option>
                      {gdList.map(g=><option key={g.id} value={g.name}>{g.name}</option>)}
                    </select>
                  ):(
                    <Input value={newTask.gdName} onChange={e=>setNewTask(n=>({...n,gdName:e.target.value}))} placeholder="Designer name" className="smm-input mt-1"/>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="smm-text-primary">Platform</Label>
                  <select value={newTask.platform} onChange={e=>setNewTask(n=>({...n,platform:e.target.value}))}
                    className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    {["Instagram","Facebook","LinkedIn","Twitter/X","YouTube","Pinterest"].map(p=>(
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="smm-text-primary">Priority</Label>
                  <select value={newTask.priority} onChange={e=>setNewTask(n=>({...n,priority:e.target.value as Priority}))}
                    className="smm-select mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="smm-text-primary">Deadline *</Label>
                <Input type="date" value={newTask.deadline} onChange={e=>setNewTask(n=>({...n,deadline:e.target.value}))} required className="smm-input mt-1"/>
              </div>
              <div>
                <Label className="smm-text-primary">Notes for Designer</Label>
                <textarea value={newTask.notes} onChange={e=>setNewTask(n=>({...n,notes:e.target.value}))} rows={2}
                  placeholder="Brand guidelines, colour codes, style references..."
                  className="smm-textarea mt-1 w-full px-3 py-2 text-sm border smm-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 smm-btn-outline" onClick={()=>setShowAddTask(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700"><Send className="w-4 h-4 mr-2"/>Assign Task</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SMMDashboard;


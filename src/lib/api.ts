// ─── Central API client ───────────────────────────────────────────────────────

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  // "https://whacking-dispute-agility.ngrok-free.dev";
  "https://smm-backend1-stkn.onrender.com";
  

export const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI ||
  `${window.location.origin}/auth/callback`;

// ─── OAuth Platforms ─────────────────────────────────────────────────────────

export const PLATFORMS = [
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtube",
  "pinterest"
] as const;

export type PlatformId = (typeof PLATFORMS)[number];

export const OAUTH_ROUTES: Record<PlatformId, string> = {
  facebook: "/api/social/auth/facebook",
  instagram: "/api/social/auth/instagram",
  twitter: "/api/social/auth/twitter",
  linkedin: "/api/social/auth/linkedin",
  youtube: "/api/social/auth/google",
  pinterest: "/api/social/auth/pinterest",
};

// ─── Backend Platform Key Mapping ───────────────────────────────────────────
// Backend dev ka naya rule: Instagram ab purane Facebook-linked Instagram
// OAuth flow se connect nahi hota — ab ek naya, alag platform key
// "instagramLogin" use hota hai jo seedha Instagram ka apna login page
// dikhata hai (Facebook nahi). Ye sirf BACKEND ko bheji jaane wali request
// (auth URL fetch + connect confirm) ke liye hai — UI mein (buttons, channel
// list, localStorage, saare pages) hamesha "instagram" hi use/store/dikhaya
// jayega. Success ke baad backend khud account ko "instagram" platform ke
// roop mein hi return karega, isliye channel list mein bhi kuch alag nahi
// dikhega.
const BACKEND_PLATFORM_KEY: Partial<Record<string, string>> = {
  instagram: "instagramLogin",
};

const toBackendPlatform = (platform: string): string =>
  BACKEND_PLATFORM_KEY[platform.toLowerCase().trim()] ?? platform;

const API_KEY =
  import.meta.env.VITE_API_KEY ||
  "sf_live_a7k92mXpQ3nR8vTz5wYdJ6bLcU1eHi4o";

// ─── Generic POST Request ─────────────────────────────────────────────────────

async function request<T = unknown>(
  path: string,
  body: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    const errMsg =
      json?.message || json?.msg || json?.error || `Request failed (${res.status})`;

    if (!res.ok) return { data: null, error: errMsg };
    if (json?.success === false) return { data: null, error: errMsg };

    return { data: json as T, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

// ─── Authenticated Request (JSON) ────────────────────────────────────────────

async function authRequest<T = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  token: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  // Guard: token khali ho to early return
  if (!token || token.trim() === "") {
    return { data: null, error: "Session expired. Please login again." };
  }
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
      "x-api-key": API_KEY,
      // FIXED: GET requests (e.g. client/SMM/GD list) ko browser ya
      // ngrok jaisa proxy kabhi-kabhi cache kar leta tha, isliye kabhi
      // list blank (purani "khaali" cached response) ya kabhi delete
      // ho chuka purana data dikhta tha. Ab explicitly no-cache force.
      "Cache-Control": "no-cache",
    };

    if (method !== "GET") {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      cache: "no-store",
      headers,
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        data: null,
        error:
          json?.message ||
          json?.msg ||
          json?.error ||
          `Request failed (${res.status})`,
      };
    }

    if (json?.success === false) {
      return {
        data: null,
        error: json?.message || json?.msg || json?.error || "Request failed",
      };
    }

    return { data: json as T, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

// ─── Authenticated Request (FormData) ────────────────────────────────────────
// Use this for endpoints that require multipart/form-data (e.g. file uploads)

async function authRequestFormData<T = unknown>(
  path: string,
  token: string,
  formData: FormData
): Promise<{ data: T | null; error: string | null }> {
  try {
    // NOTE: Do NOT set Content-Type manually — browser sets it with boundary automatically
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "x-api-key": API_KEY,
      },
      body: formData,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        data: null,
        error:
          json?.message ||
          json?.msg ||
          json?.error ||
          `Request failed (${res.status})`,
      };
    }

    if (json?.success === false) {
      return {
        data: null,
        error: json?.message || json?.msg || json?.error || "Request failed",
      };
    }

    return { data: json as T, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

// ─── SESSION ──────────────────────────────────────────────────────────────────

const SESSION_KEY = "sf_session";

export interface AppSession {
  token: string;
  email: string;
  userId?: string;
}

export function saveSession(s: AppSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export function getSession(): AppSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── PROFILE API ──────────────────────────────────────────────────────────────

export interface ProfileUser {
  name: string;
  email: string;
  mobileNumber: string;
}

export interface ProfileRes {
  success: boolean;
  user?: ProfileUser;
  message?: string;
}

export const apiGetProfile = (token: string) =>
  authRequest<ProfileRes>("/api/user/profile", "GET", token);

export const apiUpdateProfile = (
  token: string,
  name: string,
  mobileNumber: string
) =>
  authRequest<ProfileRes>("/api/user/profile", "PUT", token, {
    name,
    mobileNumber,
  });

export const apiDeleteProfile = (token: string, password: string) =>
  authRequest<{ success: boolean; message?: string }>(
    "/api/user/profile",
    "DELETE",
    token,
    { password }
  );

// ─── SOCIAL CONNECT ───────────────────────────────────────────────────────────

export interface SocialConnectRes {
  success?: boolean;
  message?: string;
  authUrl?: string;
  url?: string;
  redirectUrl?: string;
  [key: string]: unknown;
}
export const apiSocialConnect = (
  token: string,
  platform: string,
  code: string,
  state: string,
  codeVerifier?: string,
  clientId?: string
) => {
  // Backend ko hamesha mapped key bhejo (e.g. instagram -> instagramLogin);
  // caller (UI) apna original "platform" hi use karta rehta hai.
  const backendPlatform = toBackendPlatform(platform);

  console.log("JWT Token:", token);
  console.log("Platform:", backendPlatform);
  console.log("Code:", code);
  console.log("ClientId:", clientId);

  return authRequest<SocialConnectRes>(
    "/api/social/connect",
    "POST",
    token,
    {
      platform: backendPlatform,
      code,
      state,
      codeVerifier,
      redirectUri: REDIRECT_URI,
      ...(clientId ? { clientId } : {}),
    }
  );
};



// ✅ FIX: clientId ab query param mein pass hota hai
// Backend pe SMM ke liye clientId MANDATORY hai — bina iske 400 error aata tha
// ⚠️ RULE (backend ke kehne pe): kisi bhi platform (Facebook/Instagram/
// Pinterest/LinkedIn/Threads/YouTube) ka OAuth URL KABHI khud se
// construct mat karo (jaise "facebook.com/dialog/oauth?client_id=...").
// Hamesha yahi function call karo — jo backend se already-correct
// redirect_uri ke saath bana hua authUrl leke aata hai. Response ke
// `authUrl` (ya `url`/`redirectUrl`) ko seedha window.location.href
// mein daalo, usme kuch add/edit mat karo.
export const apiGetOAuthUrl = (token: string, platform: string, clientId?: string) => {
  // e.g. "instagram" -> "instagramLogin" (naya direct-Instagram-login flow)
  const backendPlatform = toBackendPlatform(platform);
  return authRequest<{ authUrl?: string; url?: string; redirectUrl?: string }>(
    `/api/social/auth/${backendPlatform}${clientId ? `?clientId=${clientId}` : ""}`,
    "GET",
    token
  );
};

// ─── CHANNELS ────────────────────────────────────────────────────────────────

export interface SocialChannel {
  id?: string;
  _id?: string;
  platform: string;
  username?: string;
  name?: string;
  avatar?: string;
  connected?: boolean;
  [key: string]: unknown;
}

export interface ChannelsRes {
  success?: boolean;
  channels?: SocialChannel[];
  data?: SocialChannel[];
  accounts?: SocialChannel[];
  [key: string]: unknown;
}

export const apiGetChannels = (
  token: string,
  opts?: { clientId?: string; platform?: string }
) => {
  const params = new URLSearchParams();
  if (opts?.clientId) params.set("clientId", opts.clientId);
  if (opts?.platform) params.set("platform", opts.platform);
  const qs = params.toString();
  return authRequest<ChannelsRes>(
    `/api/social/accounts${qs ? `?${qs}` : ""}`,
    "GET",
    token
  );
};

export const apiDisconnectChannel = (token: string, channelId: string) =>
  authRequest<{ success?: boolean; message?: string }>(
    `/api/social/disconnect/${channelId}`,
    "DELETE",
    token
  );

// ─── POSTS API ────────────────────────────────────────────────────────────────

export interface Post {
  id?: string;
  _id?: string;
  content: string;
  platforms: string[];
  tags?: string[];
  media?: (string | File)[];   // URLs from API, or File objects during upload
  status: "draft" | "scheduled" | "published" | "failed";
  scheduleAt?: string;
  scheduled_at?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface PostsRes {
  success?: boolean;
  posts?: Post[];
  data?: Post[];
  [key: string]: unknown;
}

export interface CreatePostRes {
  success?: boolean;
  message?: string;
  post?: Post;
  data?: Post;
  [key: string]: unknown;
}

// GET all posts (with optional status filter)
// export const apiGetPosts = (token: string, status?: string) => {
//   const qs = status ? `?status=${status}` : "";
//   return authRequest<PostsRes>(`/api/posts${qs}`, "GET", token);
// };
// ✅ NAYA
export const apiGetPosts = (token: string, status?: string) => {
  if (status === "published") {
    return authRequest<PostsRes>("/api/posts/published", "GET", token);
  }
  const qs = status ? `?status=${status}` : "";
  return authRequest<PostsRes>(`/api/posts${qs}`, "GET", token);
};

// Create / Schedule post — sends as FormData (backend expects multipart)
// export const apiCreatePost = (
//   token: string,
//   content: string,
//   platforms: string[],
//   tags: string[],
//   mediaFiles: (File | string)[],   // File objects OR existing URLs
//   scheduleAt: string
// ) => {
//   const fd = new FormData();
//   fd.append("content", content);

//   // Arrays must be appended individually — FormData doesn't support JSON arrays
// platforms.forEach((p) => fd.append("platforms", p));
// tags.forEach((t) => fd.append("tags", t));

//   // Attach actual File objects if present
//   mediaFiles.forEach((m) => {
//     if (m instanceof File) {
//       fd.append("media", m);
//     } else if (typeof m === "string" && m) {
//       fd.append("mediaUrls[]", m);
//     }
//   });

//   if (scheduleAt) fd.append("scheduleAt", scheduleAt);

//   return authRequestFormData<CreatePostRes>("/api/posts/create", token, fd);
// };

// ── ONLY apiCreatePost function replace karo in api.ts ──────────────
// Baki sab same rehega

// Create / Schedule post — sends as FormData (backend expects multipart)
// export const apiCreatePost = (
//   token: string,
//   content: string,
//   platforms: string[],
//   tags: string[],
//   mediaFiles: (File | string)[],
//   scheduleAt: string | null,
//   youtubeTitle?:   string,   // YouTube ke liye video title
//   youtubePrivacy?: string    // "public" | "private" | "unlisted"
// ) => {
//   const fd = new FormData();
//   fd.append("content", content);

//   platforms.forEach((p) => fd.append("platforms", p));
//   tags.forEach((t) => fd.append("tags", t));

//   mediaFiles.forEach((m) => {
//     if (m instanceof File) {
//       fd.append("media", m);
//     } else if (typeof m === "string" && m) {
//       fd.append("mediaUrls[]", m);
//     }
//   });

//   if (scheduleAt)     fd.append("scheduleAt",     scheduleAt);
//   if (youtubeTitle)   fd.append("youtubeTitle",   youtubeTitle);
//   if (youtubePrivacy) fd.append("youtubePrivacy", youtubePrivacy);

//   return authRequestFormData<CreatePostRes>("/api/posts/create", token, fd);
// };

export interface PlatformAccount {
  platform: string;
  accountId: string;
}

export const apiCreatePost = (
  token: string,
  content: string,
  platforms: string[],
  tags: string[],
  mediaFiles: (File | string)[],
  scheduleAt: string | null,
  youtubeTitle?:   string,
  youtubePrivacy?: string,
  clientId?: string,                    // ✅ SMM ke liye mandatory
  platformAccounts?: PlatformAccount[]   // ✅ ADD: backend-confirmed field —
                                          // batata hai kis platform ke kis
                                          // specific account/page pe post
                                          // jaani hai, e.g. Facebook Page.
) => {
  const fd = new FormData();
  fd.append("content", content);

  platforms.forEach((p) => fd.append("platforms", p));
  tags.forEach((t) => fd.append("tags", t));

  mediaFiles.forEach((m) => {
    if (m instanceof File) {
      fd.append("media", m);
    } else if (typeof m === "string" && m) {
      fd.append("mediaUrls[]", m);
    }
  });

  if (scheduleAt)     fd.append("scheduleAt",     scheduleAt);
  if (youtubeTitle)   fd.append("youtubeTitle",   youtubeTitle);
  if (youtubePrivacy) fd.append("youtubePrivacy", youtubePrivacy);
  if (clientId)       fd.append("clientId",       clientId);
  if (platformAccounts && platformAccounts.length > 0) {
    // multipart/form-data mein array/object seedha nahi jaata — backend ke
    // kehne pe JSON.stringify() karke string ke roop mein bhej rahe hain.
    fd.append("platformAccounts", JSON.stringify(platformAccounts));
  }

  return authRequestFormData<CreatePostRes>("/api/posts/create", token, fd);
};

// Save as draft — sends as FormData (backend expects multipart)
export const apiSaveDraft = (
  token: string,
  content: string,
  platforms: string[],
  tags: string[],
  mediaFiles: (File | string)[],
  platformAccounts?: PlatformAccount[]   // ✅ ADD: draft ke liye bhi same field
) => {
  const fd = new FormData();
  fd.append("content", content);

  platforms.forEach((p) => fd.append("platforms", p));
  tags.forEach((t) => fd.append("tags", t));

  mediaFiles.forEach((m) => {
    if (m instanceof File) {
      fd.append("media", m);
    } else if (typeof m === "string" && m) {
      fd.append("mediaUrls[]", m);
    }
  });

  if (platformAccounts && platformAccounts.length > 0) {
    fd.append("platformAccounts", JSON.stringify(platformAccounts));
  }

  return authRequestFormData<CreatePostRes>("/api/posts/draft", token, fd);
};

// Publish immediately (PUT /api/posts/published/:id)
// export const apiPublishPost = (token: string, postId: string) =>
//   authRequest<CreatePostRes>(`/api/posts/published/`, "GET", token);
export const apiPublishPost = (token: string) =>
  authRequest<CreatePostRes>(
    "/api/posts/published",
    "GET",
    token
  );
// Delete post
export const apiDeletePost = (token: string, postId: string) =>
  authRequest<{ success?: boolean; message?: string }>(
    `/api/posts/${postId}`,
    "DELETE",
    token
  );

// Get queued posts (GET /api/posts/queued)
export const apiGetQueuedPosts = (token: string) =>
  authRequest<PostsRes>("/api/posts/queued", "GET", token);

// Get all drafts (GET /api/posts/drafts)
export const apiGetDrafts = (token: string) =>
  authRequest<PostsRes>("/api/posts/drafts", "GET", token);

// Update draft (PUT /api/posts/draft/:id) — sends as FormData
export const apiUpdateDraft = (
  token: string,
  draftId: string,
  content: string,
  platforms: string[],
  mediaFiles: (File | string)[]
) => {
  const fd = new FormData();
  fd.append("content", content);
  platforms.forEach((p) => fd.append("platforms", p));
  mediaFiles.forEach((m) => {
    if (m instanceof File) {
      fd.append("media", m);
    } else if (typeof m === "string" && m) {
      fd.append("mediaUrls[]", m);
    }
  });
  // PUT with FormData — use manual fetch (authRequestFormData only supports POST)
  return (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/draft/${draftId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "x-api-key": API_KEY,
        },
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok)
        return {
          data: null,
          error: json?.message || json?.msg || json?.error || `Request failed (${res.status})`,
        };
      return { data: json as CreatePostRes, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err.message : "Network error" };
    }
  })();
};

// Delete draft (DELETE /api/posts/draft/:id)
export const apiDeleteDraft = (token: string, draftId: string) =>
  authRequest<{ success?: boolean; message?: string }>(
    `/api/posts/draft/${draftId}`,
    "DELETE",
    token
  );

// Analytics overview (GET /api/posts/overview)
export interface OverviewRes {
  success?: boolean;
  total?: number;
  published?: number;
  scheduled?: number;
  failed?: number;
  data?: {
    total?: number;
    published?: number;
    scheduled?: number;
    failed?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const apiGetOverview = (token: string) =>
  authRequest<OverviewRes>("/api/posts/overview", "GET", token);

// Get connected social accounts (GET /api/social/accounts)
export const apiGetSocialAccounts = (token: string) =>
  authRequest<ChannelsRes>("/api/social/accounts", "GET", token);

// Disconnect social account (DELETE /api/social/disconnect/:id)
export const apiDisconnectSocialAccount = (token: string, id: string) =>
  authRequest<{ success?: boolean; message?: string }>(
    `/api/social/disconnect/${id}`,
    "DELETE",
    token
  );

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

export interface AnalyticsRes {
  success?: boolean;
  data?: {
    reach?: number;
    impressions?: number;
    engagement?: number;
    followers?: number;
    clicks?: number;
    profileVisits?: number;
    weeklyData?: { day: string; reach: number; engagement: number }[];
    platformData?: { platform: string; posts: number }[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const apiGetAnalytics = (token: string, period = "7d") =>
  authRequest<AnalyticsRes>(
    `/api/analytics?period=${period}`,
    "GET",
    token
  );

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export type NotificationType = "SUCCESS" | "ERROR" | "INFO" | "WARNING";

export interface NotificationItem {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsRes {
  notifications?: NotificationItem[];
  data?: NotificationItem[];
  total?: number;
  page?: number;
}

export const apiGetNotifications = (token: string, page = 1, limit = 10) =>
  authRequest<NotificationsRes>(
    `/api/notifications?page=${page}&limit=${limit}`,
    "GET",
    token
  );

export const apiMarkNotificationRead = (token: string, id: string) =>
  authRequest<{ success?: boolean; message?: string }>(
    `/api/notifications/${id}/read`,
    "PATCH",
    token
  );

export const apiCreateNotification = (
  token: string,
  userId: string,
  type: NotificationType,
  title: string,
  message: string
) =>
  authRequest("/api/notifications/create", "POST", token, {
    userId,
    type,
    title,
    message,
  });

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export interface RegisterRes {
  message?: string;
  userId?: string;
  [key: string]: unknown;
}

export interface LoginRes {
  message?: string;
  userId?: string;
  _id?: string;
  id?: string;
  token?: string;
  loginToken?: string;
  email?: string;
  [key: string]: unknown;
}

export interface OtpRes {
  message?: string;
  token?: string;
  accessToken?: string;
  access_token?: string;
  user?: { id?: string; email?: string; [key: string]: unknown };
  [key: string]: unknown;
}

const OTP_META_KEY = "sf_otp_meta";

interface OtpMeta {
  userId?: string;
  loginToken?: string;
  email?: string;
}

function getPendingOtpMeta(): OtpMeta {
  try {
    const raw = sessionStorage.getItem(OTP_META_KEY);
    return raw ? (JSON.parse(raw) as OtpMeta) : {};
  } catch {
    return {};
  }
}

export function savePendingOtpMeta(meta: OtpMeta) {
  const existing = getPendingOtpMeta();
  sessionStorage.setItem(OTP_META_KEY, JSON.stringify({ ...existing, ...meta }));
}

export function clearPendingOtpMeta() {
  sessionStorage.removeItem(OTP_META_KEY);
}

export const apiRegister = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  mobileNumber: string
) =>
  request<RegisterRes>("/api/auth/register", {
    name,
    email,
    password,
    confirmPassword,
    mobileNumber,
  });

export const apiLogin = async (
  email: string,
  password: string
): Promise<{ data: LoginRes | null; error: string | null }> => {
  const result = await request<LoginRes>("/api/auth/login", { email, password });
  if (result.data) {
    const d = result.data;
    savePendingOtpMeta({
      email,
      userId: d.userId ?? d._id ?? d.id ?? undefined,
      loginToken: d.loginToken ?? d.token ?? undefined,
    });
  }
  return result;
};

export const apiVerifyOtp = (email: string, otp: string) => {
  const meta = getPendingOtpMeta();
  const payload: Record<string, unknown> = { email, otp };
  if (meta.userId) payload["userId"] = meta.userId;
  if (meta.loginToken) payload["loginToken"] = meta.loginToken;
  return request<OtpRes>("/api/auth/verify-otp", payload);
};

export const apiResendOtp = (email: string) =>
  request<{ message?: string }>("/api/auth/resend-otp", { email });

export const apiForgotPassword = (email: string) =>
  request<{ message?: string }>("/api/auth/forgot-password", { email });

export const apiVerifyResetOtp = (email: string, otp: string) =>
  request<OtpRes>("/api/auth/verify-reset-otp", { email, otp });

export const apiResendResetOtp = (email: string) =>
  request<{ message?: string }>("/api/auth/resend-reset-otp", { email });

export const apiResetPassword = (
  email: string,
  password: string,
  confirmPassword: string
) =>
  request<{ message?: string }>("/api/auth/reset-password", {
    email,
    newPassword: password,
    confirmPassword,
  });

// ─── ADMIN SESSION ────────────────────────────────────────────────────────────

const ADMIN_SESSION_KEY = "sf_admin_session";

export interface AdminSession {
  token: string;
  email: string;
  name: string;
  adminId?: string;
}

export function saveAdminSession(s: AdminSession) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(s));
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// ─── ADMIN API ────────────────────────────────────────────────────────────────

export const apiAdminRegister = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) =>
  request<{ message?: string; adminId?: string; [key: string]: unknown }>(
    "/api/admin/register",
    { name, email, password, confirmPassword }
  );

export const apiAdminLogin = (email: string, password: string) =>
  request<{
    message?: string;
    token?: string;
    admin?: { name?: string; email?: string; _id?: string };
    [key: string]: unknown;
  }>("/api/agency/login", { email, password });

export const apiAdminSendResetOtp = (email: string) =>
  request<{ message?: string }>("/api/admin/send-reset-otp", { email });

export const apiAdminVerifyResetOtp = (email: string, otp: string) =>
  request<{ message?: string }>("/api/admin/verify-reset-otp", { email, otp });

export const apiAdminResendResetOtp = (email: string) =>
  request<{ message?: string }>("/api/admin/resend-reset-otp", { email });

export const apiAdminResetPassword = (
  email: string,
  newPassword: string,
  confirmPassword: string
) =>
  request<{ message?: string }>("/api/admin/reset-password", {
    email,
    newPassword,
    confirmPassword,
  });

export const apiAdminChangePassword = (
  token: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) =>
  authRequest<{ message?: string }>("/api/admin/change-password", "PUT", token, {
    oldPassword,
    newPassword,
    confirmPassword,
  });

export const apiAdminDashboard = (token: string) =>
  authRequest<{
    users?: number;
    projects?: number;
    [key: string]: unknown;
  }>("/api/admin/dashboard", "GET", token);

export const apiAdminGetUsers = (
  token: string,
  params?: { role?: string; search?: string; page?: number; limit?: number }
) => {
  const q = new URLSearchParams();
  if (params?.role) q.set("role", params.role);
  if (params?.search) q.set("search", params.search);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return authRequest<{ data?: any[]; users?: any[]; [key: string]: unknown }>(
    `/api/admin/users${qs ? "?" + qs : ""}`,
    "GET",
    token
  );
};

export const apiAdminCreateUser = (
  token: string,
  body: Record<string, unknown>
) =>
  authRequest<{
    message?: string;
    msg?: string;
    data?: { user?: { _id?: string } };
    [key: string]: unknown;
  }>("/api/user/create", "POST", token, body);

export const apiAdminToggleStatus = (token: string, userId: string) =>
  authRequest<{ message?: string; msg?: string; [key: string]: unknown }>(
    `/api/admin/users/${userId}/toggle-status`,
    "PATCH",
    token
  );

export const apiAdminUpdateUser = (
  token: string,
  userId: string,
  body: Record<string, unknown>
) =>
  authRequest<{ message?: string; msg?: string; data?: unknown; [key: string]: unknown }>(
    `/api/admin/users/${userId}`,
    "PATCH",
    token,
    body
  );

export const apiAdminChangeUserPassword = (
  token: string,
  userId: string,
  newPassword: string,
  confirmPassword: string
) =>
  authRequest<{ message?: string; msg?: string; [key: string]: unknown }>(
    `/api/admin/users/${userId}/change-password`,
    "PUT",
    token,
    { newPassword, confirmPassword }
  );

export const apiAdminProfile = (token: string) =>
  authRequest<{ [key: string]: unknown }>("/api/admin/profile", "GET", token);

export const apiAdminUploadProfileImage = (token: string, file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  return authRequestFormData<{ message?: string; imageUrl?: string; profileImage?: string; [key: string]: unknown }>(
    "/api/admin/profile/image",
    token,
    formData
  );
};

export const apiAdminRemoveProfileImage = (token: string) =>
  authRequest<{ message?: string; [key: string]: unknown }>(
    "/api/admin/profile/image",
    "DELETE",
    token
  );

export const apiAdminWorkspaceUpdate = (
  token: string,
  body: { agencyName: string; description: string; address: string }
) =>
  authRequest<{ message?: string; msg?: string; [key: string]: unknown }>(
    "/api/admin/workspace",
    "PUT",
    token,
    body
  );

export const apiAdminDesignProjects = (token: string) =>
  authRequest<{ data?: any[]; projects?: any[]; [key: string]: unknown }>(
    "/api/admin/design-projects",
    "GET",
    token
  );

// ─── SMM DASHBOARD ────────────────────────────────────────────────────────────

export const apiSMMDashboard = (token: string) =>
  authRequest<{ data?: any; [key: string]: unknown }>(
    "/api/smm/dashboard",
    "GET",
    token
  );

// ─── SMM CLIENTS / GRAPHIC DESIGNERS (direct list, not derived from projects) ──
// NEW: pehle SMM ki client/GD list design-projects se (ya localStorage se)
// nikaali jaati thi — isliye jab tak koi design project na banaya ho, list
// hamesha khaali dikhti thi. Ab seedha backend ke dedicated endpoints hit
// karte hain jo SMM ki apni agency ke saare Client/GD deta hai — inhi se
// aage YouTube/social connect ke liye clientId milega.

export interface SmmClientLite {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
  [key: string]: unknown;
}

export interface SmmGdLite {
  _id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

export const apiSMMGetClients = (token: string) =>
  authRequest<{ data?: { clients?: SmmClientLite[] }; [key: string]: unknown }>(
    "/api/smm/clients?limit=100",
    "GET",
    token
  );

export const apiSMMGetGraphicDesigners = (token: string) =>
  authRequest<{ data?: { designers?: SmmGdLite[] }; [key: string]: unknown }>(
    "/api/smm/graphic-designers?limit=100",
    "GET",
    token
  );

// ─── SMM DESIGN PROJECTS ──────────────────────────────────────────────────────

export const apiSMMGetDesignProjects = (
  token: string,
  params?: {
    status?: string;
    search?: string;
    clientId?: string;
    designerId?: string;
    page?: number;
    limit?: number;
  }
) => {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.search) q.set("search", params.search);
  if (params?.clientId) q.set("clientId", params.clientId);
  if (params?.designerId) q.set("designerId", params.designerId);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return authRequest<{ data?: any[]; projects?: any[]; [key: string]: unknown }>(
    `/api/smm/design-projects${qs ? "?" + qs : ""}`,
    "GET",
    token
  );
};

export const apiSMMGetDesignProject = (token: string, id: string) =>
  authRequest<{ project?: any; files?: any[]; revisions?: any[]; revisionInfo?: any; [key: string]: unknown }>(
    `/api/smm/design-projects/${id}`,
    "GET",
    token
  );

export const apiSMMCreateDesignProject = (
  token: string,
  fields: {
    clientId: string;
    designerId: string;
    title: string;
    designType: string;
    deadline: string;
    priority: string;
    description?: string;
    targetAudience?: string;
    brandColors?: string;
    fontPreferences?: string;
    revisionLimit?: number;
  },
  assets?: File[]
) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== "") fd.append(k, String(v));
  });
  assets?.forEach((f) => fd.append("assets", f));
  return authRequestFormData<{ message?: string; data?: any; [key: string]: unknown }>(
    "/api/smm/design-projects",
    token,
    fd
  );
};

export const apiSMMUpdateDesignProject = (
  token: string,
  id: string,
  body: { deadline?: string; priority?: string; description?: string; [key: string]: unknown }
) =>
  authRequest<{ message?: string; data?: any; [key: string]: unknown }>(
    `/api/smm/design-projects/${id}`,
    "PUT",
    token,
    body
  );

export const apiSMMDeleteDesignProject = (token: string, id: string) =>
  authRequest<{ message?: string; [key: string]: unknown }>(
    `/api/smm/design-projects/${id}`,
    "DELETE",
    token
  );

export const apiSMMApproveRejectProject = (
  token: string,
  id: string,
  action: "approve" | "reject",
  note?: string
) =>
  authRequest<{ message?: string; [key: string]: unknown }>(
    `/api/smm/design-projects/${id}/approve`,
    "PATCH",
    token,
    { action, note }
  );

export const apiSMMRequestRevision = (
  token: string,
  id: string,
  revisionMessage: string
) =>
  authRequest<{ message?: string; [key: string]: unknown }>(
    `/api/smm/design-projects/${id}/revisions`,
    "POST",
    token,
    { revisionMessage }
  );

export const apiSMMGetComments = (token: string, id: string) =>
  authRequest<{ data?: any[]; comments?: any[]; [key: string]: unknown }>(
    `/api/smm/design-projects/${id}/comments`,
    "GET",
    token
  );

export const apiSMMAddComment = (token: string, id: string, message: string) =>
  authRequest<{ message?: string; data?: any; [key: string]: unknown }>(
    `/api/smm/design-projects/${id}/comments`,
    "POST",
    token,
    { message }
  );

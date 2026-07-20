import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme, type ThemeMode } from "@/lib/theme";
// import {
//   apiGetProfile, apiUpdateProfile, apiDeleteProfile,
//   apiGetChannels, BASE_URL, OAUTH_ROUTES, type PlatformId, type SocialChannel,
//   apiGetNotifications, apiMarkNotificationRead,
//   type NotificationItem,
// } from "@/lib/api";

import {
  apiGetProfile, apiUpdateProfile, apiDeleteProfile,
  apiGetChannels, BASE_URL, OAUTH_ROUTES, type PlatformId, type SocialChannel,
  apiGetNotifications, apiMarkNotificationRead, apiCreateNotification,  // 👈 ye add karo
  type NotificationItem,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, User, CreditCard, Bell, Trash2, Share2, Plus, CheckCircle2, Settings2, Globe, BellOff, Check, AlertTriangle, Info, XCircle, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "channels", label: "Channels", icon: Share2 },
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "billing", label: "Plans and Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

// ─── Platform config ───────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    desc: "Connect your Instagram Business or Creator account",
    gradient: "from-purple-500 via-pink-500 to-orange-400",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    desc: "Connect your YouTube channel to schedule videos",
    gradient: "from-red-500 to-red-600",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    desc: "Connect your LinkedIn profile or company page",
    gradient: "from-blue-600 to-blue-700",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    desc: "Connect your X / Twitter account",
    gradient: "from-gray-800 to-black",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    desc: "Connect your Facebook Page or profile",
    gradient: "from-blue-500 to-blue-600",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

// Platform icon by id (for connected channels list)
const getPlatformIcon = (platform: string) => {
  const found = PLATFORMS.find(p => p.id === platform.toLowerCase());
  if (!found) return <Share2 className="w-5 h-5 text-white" />;
  return found.icon;
};

const getPlatformGradient = (platform: string) => {
  const found = PLATFORMS.find(p => p.id === platform.toLowerCase());
  return found?.gradient ?? "from-gray-400 to-gray-500";
};

// ─── Preferences Tab ──────────────────────────────────────────────────────────
const PREF_KEY = "sf_preferences";

interface UserPrefs {
  timezone: string;
  timeFormat: "12-hour" | "24-hour";
  weekStart: "Sunday" | "Monday";
  defaultPostingAction: "Next Available" | "Schedule" | "Now";
}

const DEFAULT_PREFS: UserPrefs = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timeFormat: "12-hour",
  weekStart: "Sunday",
  defaultPostingAction: "Next Available",
};

const TIMEZONES = [
  "Pacific/Midway", "Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles",
  "America/Denver", "America/Chicago", "America/New_York", "America/Caracas",
  "America/Halifax", "America/Sao_Paulo", "Atlantic/Azores", "Europe/London",
  "Europe/Paris", "Europe/Helsinki", "Europe/Moscow", "Asia/Dubai", "Asia/Karachi",
  "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok", "Asia/Singapore", "Asia/Tokyo",
  "Australia/Sydney", "Pacific/Auckland",
];

// Preset color swatches
const COLOR_SWATCHES = [
  { label: "Blue", hex: "#3b82f6" },
  { label: "Violet", hex: "#7c3aed" },
  { label: "Rose", hex: "#e11d48" },
  { label: "Orange", hex: "#ea580c" },
  { label: "Green", hex: "#16a34a" },
  { label: "Teal", hex: "#0d9488" },
  { label: "Pink", hex: "#db2777" },
  { label: "Amber", hex: "#d97706" },
];

const PrefRow = ({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) => (
  <>
    <div className="flex items-center justify-between py-5 gap-6">
      <div className="min-w-0">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-sm text-muted-foreground mt-0.5 max-w-sm">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
    <Separator />
  </>
);

const PreferencesTab = () => {
  const { theme, setTheme } = useTheme();

  // Appearance state — synced with ThemeProvider
  const appearanceValue: "light" | "dark" | "system" | "custom" =
    theme.useCustomColor ? "custom" : theme.mode;
  const [customColor, setCustomColor] = useState(theme.customColor);

  // Other prefs from localStorage
  const [prefs, setPrefs] = useState<UserPrefs>(() => {
    try {
      const raw = localStorage.getItem(PREF_KEY);
      return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
    } catch { return DEFAULT_PREFS; }
  });

  const updatePref = <K extends keyof UserPrefs>(key: K, value: UserPrefs[K]) =>
    setPrefs(p => ({ ...p, [key]: value }));

  const handleAppearanceChange = (val: string) => {
    if (val === "custom") {
      setTheme({ mode: theme.mode, customColor, useCustomColor: true });
    } else {
      setTheme({ mode: val as ThemeMode, customColor, useCustomColor: false });
    }
  };

  const handleColorChange = (hex: string) => {
    setCustomColor(hex);
    if (theme.useCustomColor) {
      setTheme({ ...theme, customColor: hex });
    }
  };

  const handleSave = () => {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    // Also persist current color if custom
    if (theme.useCustomColor) {
      setTheme({ ...theme, customColor });
    }
    toast.success("Preferences saved!");
  };

  return (
    <div className="space-y-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Preferences</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the look and feel of your account on this device.
        </p>
      </div>

      <Separator />

      {/* ── Appearance ── */}
      <PrefRow label="Appearance" desc="Customize the look and feel on this device.">
        <Select value={appearanceValue} onValueChange={handleAppearanceChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System default</SelectItem>
            <SelectItem value="light">☀️ Light</SelectItem>
            <SelectItem value="dark">🌙 Dark</SelectItem>
            <SelectItem value="custom">🎨 Color Palette</SelectItem>
          </SelectContent>
        </Select>
      </PrefRow>

      {/* ── Color Palette picker — shown only when custom is selected ── */}
      {appearanceValue === "custom" && (
        <>
          <div className="py-5 space-y-4">
            <div>
              <p className="font-semibold text-sm mb-1">Theme Color</p>
              <p className="text-sm text-muted-foreground mb-4">
                Pick a color — it will be applied as the primary/accent color throughout the app.
              </p>

              {/* Preset swatches */}
              <div className="flex flex-wrap gap-3 mb-4">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    title={swatch.label}
                    onClick={() => handleColorChange(swatch.hex)}
                    className="relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: swatch.hex,
                      borderColor: customColor === swatch.hex ? swatch.hex : "transparent",
                      outline: customColor === swatch.hex ? `3px solid ${swatch.hex}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>

              {/* Custom color input */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border p-0.5 bg-background"
                    title="Custom color"
                  />
                </div>
                <Input
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#3b82f6"
                  className="w-32 font-mono text-sm"
                  maxLength={7}
                />
                <div
                  className="w-10 h-10 rounded-lg border border-border shrink-0"
                  style={{ backgroundColor: customColor }}
                />
                <span className="text-xs text-muted-foreground">Preview</span>
              </div>
            </div>

            {/* Background mode when using custom color */}
            <div className="flex items-center gap-3 pt-1">
              <p className="text-sm font-medium">Background:</p>
              <Select
                value={theme.mode}
                onValueChange={(v) => setTheme({ ...theme, mode: v as ThemeMode, customColor, useCustomColor: true })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Timezone */}
      <PrefRow label="Timezone" desc="Used as the default timezone for new connected channels and sending notifications.">
        <Select value={prefs.timezone} onValueChange={v => updatePref("timezone", v)}>
          <SelectTrigger className="w-44">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {TIMEZONES.map(tz => (
              <SelectItem key={tz} value={tz}>{tz.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PrefRow>

      {/* Time Format */}
      <PrefRow label="Time Format" desc="Set the time format for the Calendar and Queue.">
        <Select value={prefs.timeFormat} onValueChange={v => updatePref("timeFormat", v as UserPrefs["timeFormat"])}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="12-hour">12-hour</SelectItem>
            <SelectItem value="24-hour">24-hour</SelectItem>
          </SelectContent>
        </Select>
      </PrefRow>

      {/* Start of Week */}
      <PrefRow label="Start of Week" desc="Set the first day of the week for the Calendar and date pickers.">
        <Select value={prefs.weekStart} onValueChange={v => updatePref("weekStart", v as UserPrefs["weekStart"])}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Sunday">Sunday</SelectItem>
            <SelectItem value="Monday">Monday</SelectItem>
          </SelectContent>
        </Select>
      </PrefRow>

      {/* Default Posting Action */}
      <PrefRow label="Default Posting Action" desc="Set a default time to post for the composer.">
        <Select value={prefs.defaultPostingAction} onValueChange={v => updatePref("defaultPostingAction", v as UserPrefs["defaultPostingAction"])}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Next Available">Next Available</SelectItem>
            <SelectItem value="Schedule">Schedule</SelectItem>
            <SelectItem value="Now">Now</SelectItem>
          </SelectContent>
        </Select>
      </PrefRow>

      <div className="pt-4">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
};

// ─── Channels Tab ─────────────────────────────────────────────────────────────
const ChannelsTab = ({ token }: { token: string }) => {
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [showPlatformModal, setShowPlatformModal] = useState(false);

  const refreshChannels = async () => {
    const { data } = await apiGetChannels(token);
    if (data) setChannels(data.channels ?? data.data ?? []);
  };

  useEffect(() => {
    (async () => {
      setLoadingChannels(true);
      await refreshChannels();
      setLoadingChannels(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSelectPlatform = async (platform: string) => {
    setShowPlatformModal(false);
    const route = OAUTH_ROUTES[platform as PlatformId];
    if (!route) { toast.error(`Unsupported platform: ${platform}`); return; }
    toast.info(`Redirecting to ${platform} authorization…`);

    try {
      await fetch(`${BASE_URL}`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
    } catch (_) { /* ignore */ }

    window.location.href = `${BASE_URL}${route}?token=${encodeURIComponent(token)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Channels</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your social media accounts to start publishing.
          </p>
        </div>
        <Button onClick={() => setShowPlatformModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Connect Channel
        </Button>
      </div>

      {/* Free plan notice */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="flex items-center gap-3 py-4">
          <Share2 className="w-5 h-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium">You are on the Free plan</p>
            <p className="text-xs text-muted-foreground">You can connect up to 3 channels.</p>
          </div>
        </CardContent>
      </Card>

      {/* Channels list */}
      {loadingChannels ? (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading channels...
        </div>
      ) : channels.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-base">Connect a channel to get started</p>
              <p className="text-sm text-muted-foreground mt-1">
                Once connected, you will see your channels listed here.
              </p>
            </div>
            <Button onClick={() => setShowPlatformModal(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Connect Channel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {channels.map((ch, i) => (
            <Card key={ch.id ?? i}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getPlatformGradient(ch.platform)} flex items-center justify-center shrink-0`}>
                  {getPlatformIcon(ch.platform)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{ch.name ?? ch.username ?? ch.platform}</p>
                  <p className="text-xs text-muted-foreground capitalize">{ch.platform}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Platform picker modal */}
      <Dialog open={showPlatformModal} onOpenChange={setShowPlatformModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect a Channel</DialogTitle>
            <DialogDescription>
              Choose a platform to connect to your SocialFlow account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleSelectPlatform(platform.id)}
                className="flex items-center gap-4 p-4 rounded-xl border hover:bg-accent transition text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center shrink-0`}>
                  {platform.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{platform.label}</p>
                  <p className="text-xs text-muted-foreground">{platform.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
// ─── Notifications Tab ────────────────────────────────────────────────────────
const NOTIF_PREF_KEY = "sf_notif_prefs";

interface NotifGroup {
  group: string;
  items: { id: string; label: string; desc: string }[];
}

const NOTIF_GROUPS: NotifGroup[] = [
  {
    group: "Activity & Alerts",
    items: [
      { id: "post_failures",       label: "Post Failures",              desc: "Get notified when a scheduled post fails to publish." },
      { id: "channel_updates",     label: "Channel Connection Updates", desc: "Alerts when a social channel gets disconnected or reconnected." },
      { id: "collaboration",       label: "Collaboration",              desc: "Notify when a teammate comments, approves, or edits your posts." },
      { id: "published_confirm",   label: "Published Post Confirmations", desc: "Confirmation alert each time a post goes live successfully." },
      { id: "empty_queue",         label: "Empty Queue Alerts",         desc: "Remind me when my posting queue is running empty." },
    ],
  },
  {
    group: "Insights & Performance",
    items: [
      { id: "daily_recap",         label: "Daily Post Recap",           desc: "A summary of all posts published and their early performance." },
      { id: "weekly_report",       label: "Weekly Report Card",         desc: "Your weekly engagement stats, top posts, and growth overview." },
      { id: "reminders",           label: "Reminders & Habits",         desc: "Gentle nudges to keep your posting schedule consistent." },
    ],
  },
  {
    group: "Tips & Product Education",
    items: [
      { id: "product_updates",     label: "GrowthCraft360 Product Updates and News", desc: "Be the first to know about new features and improvements." },
      { id: "newsletters",         label: "Newsletters",                desc: "Curated marketing insights and social media best practices." },
      { id: "social_weekly",       label: "GrowthCraft360 Social Media Weekly Newsletter", desc: "Weekly roundup of trending content strategies and platform updates." },
      { id: "blog_newsletter",     label: "Open Blog Newsletter",       desc: "Thought leadership, case studies and team stories from our blog." },
      { id: "feedback_research",   label: "User Feedback and Research", desc: "Occasional surveys and early access to beta features." },
    ],
  },
];

type NotifPrefs = Record<string, boolean>;

const defaultPrefs = (): NotifPrefs => {
  const all: NotifPrefs = {};
  NOTIF_GROUPS.forEach(g => g.items.forEach(i => { all[i.id] = true; }));
  return all;
};

const notifTypeStyle = (type: string) => {
  switch (type) {
    case "SUCCESS": return { cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400", icon: <CheckCircle className="w-3.5 h-3.5" /> };
    case "ERROR":   return { cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",   icon: <XCircle className="w-3.5 h-3.5" /> };
    case "WARNING": return { cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", icon: <AlertTriangle className="w-3.5 h-3.5" /> };
    default:        return { cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", icon: <Info className="w-3.5 h-3.5" /> };
  }
};

const NotificationsTab = ({ token, userId }: { token: string; userId: string }) => {
  const [prefs, setPrefs] = useState<NotifPrefs>(() => {
    try {
      const raw = localStorage.getItem(NOTIF_PREF_KEY);
      return raw ? { ...defaultPrefs(), ...JSON.parse(raw) } : defaultPrefs();
    } catch { return defaultPrefs(); }
  });
  const [testLoading, setTestLoading] = useState(false);
  const [notifications, setNotifications]   = useState<NotificationItem[]>([]);
  const [notifsLoading, setNotifsLoading]   = useState(true);
  const [markingId, setMarkingId]           = useState<string | null>(null);
  const [page, setPage]                     = useState(1);
  const [hasMore, setHasMore]               = useState(false);
  const LIMIT = 8;

  const fetchNotifications = async (p = 1) => {
    if (!token) return;
    setNotifsLoading(true);
    const { data, error } = await apiGetNotifications(token, p, LIMIT);
    setNotifsLoading(false);
    if (error) { toast.error("Could not load notifications: " + error); return; }
    const list: NotificationItem[] = data?.notifications ?? data?.data ?? [];
    setNotifications(prev => p === 1 ? list : [...prev, ...list]);
    setHasMore(list.length === LIMIT);
    setPage(p);
  };

  useEffect(() => { fetchNotifications(1); }, [token]); // eslint-disable-line
  const sendTestNotification = async () => {
  if (!token || !userId) { toast.error("User not found"); return; }
  setTestLoading(true);
  const { data, error } = await apiCreateNotification(
    token,
    userId,
    "INFO",
    "Test Notification",
    "Hello! Notification system is working ✅"
  );
  setTestLoading(false);
  if (error) { toast.error("Failed: " + error); return; }
  toast.success("Notification created!");
  await fetchNotifications(1); // turant list refresh ho jayegi
};

  const togglePref = (id: string) => {
    setPrefs(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(NOTIF_PREF_KEY, JSON.stringify(next));
      return next;
    });
  };

  const markRead = async (notifId: string) => {
    setMarkingId(notifId);
    const { error } = await apiMarkNotificationRead(token, notifId);
    setMarkingId(null);
    if (error) { toast.error("Failed to mark as read"); return; }
    setNotifications(prev =>
      prev.map(n => n._id === notifId ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8">
      {/* Header */}
     <div className="flex items-start justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold">Notifications</h1>
    <p className="text-sm text-muted-foreground mt-1">
      Choose what updates you want to receive and how.
    </p>
  </div>
  <Button
    variant="outline"
    size="sm"
    onClick={sendTestNotification}
    disabled={testLoading}
    className="shrink-0 gap-2"
  >
    {testLoading
      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
      : <Bell className="w-3.5 h-3.5" />
    }
    Send Test
  </Button>
</div>

      {/* ── Preference toggles ── */}
      {NOTIF_GROUPS.map((group) => (
        <div key={group.group}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {group.group}
          </h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <Switch
                    checked={!!prefs[item.id]}
                    onCheckedChange={() => togglePref(item.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}

      {/* ── Recent Notifications feed ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Recent Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </h2>
          <button
            onClick={() => fetchNotifications(1)}
            className="text-xs text-primary hover:underline"
          >
            Refresh
          </button>
        </div>

        <Card>
          <CardContent className="p-0">
            {notifsLoading && notifications.length === 0 ? (
              <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading notifications…
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <BellOff className="w-8 h-8 opacity-30" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((n) => {
                  const style = notifTypeStyle(n.type);
                  return (
                    <div
                      key={n._id}
                      className={`flex items-start gap-3 px-5 py-4 transition ${!n.read ? "bg-primary/5" : ""}`}
                    >
                      {/* Type badge */}
                      <span className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${style.cls}`}>
                        {style.icon}
                        {n.type}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-[11px] text-muted-foreground/60 mt-1">
                          {new Date(n.createdAt).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Mark as read */}
                      {!n.read && (
                        <button
                          onClick={() => markRead(n._id)}
                          disabled={markingId === n._id}
                          title="Mark as read"
                          className="shrink-0 mt-0.5 text-muted-foreground hover:text-primary transition"
                        >
                          {markingId === n._id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Check className="w-4 h-4" />
                          }
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Load more */}
                {hasMore && (
                  <div className="flex justify-center py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchNotifications(page + 1)}
                      disabled={notifsLoading}
                    >
                      {notifsLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Load more
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
// ─── Main Settings Component ──────────────────────────────────────────────────
const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const token = user?.token;
    if (!token) return;
    let cancelled = false;
    (async () => {
      setFetchLoading(true);
      const { data, error } = await apiGetProfile(token);
      if (cancelled) return;
      if (!error && data?.user) {
        setName(data.user.name ?? "");
        setEmail(data.user.email ?? "");
        setMobileNumber(data.user.mobileNumber ?? "");
      } else {
        setEmail(user?.email ?? "");
        if (error) toast.error("Profile load failed: " + error);
      }
      setFetchLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    setProfileLoading(true);
    const { data, error } = await apiUpdateProfile(user.token, name, mobileNumber);
    if (error) {
      toast.error(error);
    } else {
      toast.success(data?.message || "Profile updated!");
      if (data?.user) {
        setName(data.user.name ?? "");
        setEmail(data.user.email ?? "");
        setMobileNumber(data.user.mobileNumber ?? "");
      }
    }
    setProfileLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!user?.token || !deletePassword) return;
    setDeleteLoading(true);
    const { data, error } = await apiDeleteProfile(user.token, deletePassword);
    if (error) {
      toast.error(error);
      setDeleteLoading(false);
      return;
    }
    toast.success(data?.message || "Account deleted.");
    signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-56 shrink-0 border-r bg-background p-4 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-3">Account</p>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ tab: tab.id })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition text-left ${activeTab === tab.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60"
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </aside>

      <div className="flex-1 p-8 max-w-2xl">
        {activeTab === "channels" && user?.token && <ChannelsTab token={user.token} />}

        {activeTab === "preferences" && <PreferencesTab />}

        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
            </div>
            {fetchLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading profile...
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Personal Information</CardTitle>
                    <CardDescription>Update your name and mobile number.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label>Email</Label>
                        <Input value={email} disabled className="opacity-60 cursor-not-allowed" />
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="+91 9876543210" />
                      </div>
                      <Button type="submit" disabled={profileLoading}>
                        {profileLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                <Separator />
                <Card className="border-destructive/40">
                  <CardHeader>
                    <CardTitle className="text-base text-destructive">Delete Account</CardTitle>
                    <CardDescription>Permanently delete your account and all data. Cannot be undone.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <Trash2 className="w-4 h-4" /> Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently remove all your data. Enter your password to confirm.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-2 space-y-1.5">
                          <Label htmlFor="confirm-password">Password</Label>
                          <Input id="confirm-password" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter your password" />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeletePassword("")}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={deleteLoading || !deletePassword}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Yes, Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Plans and Billing</h1>
            <Card className="p-6">
              <p className="text-muted-foreground text-sm">You are on the <strong>Free plan</strong>.</p>
              <Button className="mt-4">Upgrade Plan</Button>
            </Card>
          </div>
        )}

  {activeTab === "notifications" && (
          <NotificationsTab token={user?.token ?? ""} userId={user?.id ?? ""} />
        )}  
      </div>
    </div>
  );
};

export default Settings;

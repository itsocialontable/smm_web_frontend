// import { useState } from "react";
// import { useAuth } from "@/lib/auth";
// import { apiCreatePost, apiSaveDraft } from "@/lib/api";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import {
//   Image as ImageIcon, Loader2, X, Facebook, Instagram, Twitter, Linkedin,
//   Youtube, AlertCircle
// } from "lucide-react";

// const PLATFORMS = [
//   { id: "facebook", label: "Facebook", icon: Facebook },
//   { id: "instagram", label: "Instagram", icon: Instagram },
//   { id: "twitter", label: "Twitter / X", icon: Twitter },
//   { id: "linkedin", label: "LinkedIn", icon: Linkedin },
//   { id: "youtube", label: "YouTube", icon: Youtube },
//   //  { id: "pinterest", label: "YouTube", icon: pinterest },
// ];

// const Compose = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [content, setContent] = useState("");
//   const [platforms, setPlatforms] = useState<string[]>([]);
//   const [scheduledAt, setScheduledAt] = useState("");
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [mediaFile, setMediaFile] = useState<File | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [tags, setTags] = useState<string[]>([]);
//   const [tagInput, setTagInput] = useState("");
//   const [apiError, setApiError] = useState<string | null>(null);

//   const togglePlatform = (id: string) =>
//     setPlatforms((p) =>
//       p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
//     );

//   const onFile = (f: File) => {
//     setPreviewUrl(URL.createObjectURL(f));
//     setMediaFile(f);
//   };

//   const addTag = () => {
//     const t = tagInput.trim().replace(/^#/, "");
//     if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
//     setTagInput("");
//   };

//   const submit = async (status: "draft" | "scheduled") => {
//     if (!user) {
//       toast.error("Session expired. Please login again.");
//       return;
//     }
//     if (!content.trim()) {
//       toast.error("Content empty hai — kuch likhna padega");
//       return;
//     }
//     if (status === "scheduled" && platforms.length === 0) {
//       toast.error("Kam se kam ek platform select karo");
//       return;
//     }

//     setSaving(true);
//     setApiError(null);

//     try {
//       if (status === "draft") {
//         const { error } = await apiSaveDraft(
//           user.token,
//           content,
//           platforms,
//           tags,
//           mediaFile ? [mediaFile] : []
//         );
//         if (error) {
//           setApiError("Draft failed: " + error);
//           toast.error("Draft save nahi hua: " + error);
//           return;
//         }
//         toast.success("Draft save ho gaya!");
//       } else {
//         const { error } = await apiCreatePost(
//           user.token,
//           content,
//           platforms,
//           tags,
//           mediaFile ? [mediaFile] : [],
//           scheduledAt ? new Date(scheduledAt).toISOString() : null
//         );
//         if (error) {
//           setApiError("Post failed: " + error);
//           toast.error("Post create nahi hua: " + error);
//           return;
//         }
//         toast.success(scheduledAt ? "Post scheduled!" : "Post create ho gaya!");
//       }
//       navigate("/dashboard/calendar");
//     } catch {
//       const msg = "Network error — backend check karo";
//       setApiError(msg);
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="p-6 md:p-8 max-w-6xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">Create a post</h1>
//         <p className="text-sm text-muted-foreground">
//           Compose, choose channels, and schedule when it goes live.
//         </p>
//       </div>

//       {apiError && (
//         <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20 mb-4">
//           <AlertCircle className="w-4 h-4 shrink-0" />
//           {apiError}
//         </div>
//       )}

//       <div className="grid lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2 p-6 space-y-5">
//           {/* Channels */}
//           <div>
//             <Label>Channels *</Label>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {PLATFORMS.map((p) => (
//                 <button
//                   key={p.id}
//                   type="button"
//                   onClick={() => togglePlatform(p.id)}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
//                     platforms.includes(p.id)
//                       ? "bg-primary text-primary-foreground border-primary"
//                       : "hover:bg-accent"
//                   }`}
//                 >
//                   <p.icon className="w-4 h-4" /> {p.label}
//                 </button>
//               ))}
//             </div>
//             {platforms.length === 0 && (
//               <p className="text-xs text-muted-foreground mt-1">
//                 Schedule ke liye kam se kam ek platform select karo
//               </p>
//             )}
//           </div>

//           {/* Content */}
//           <div>
//             <Label htmlFor="content">Content *</Label>
//             <Textarea
//               id="content"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="What's on your mind?"
//               rows={6}
//               maxLength={2000}
//               className="mt-2 resize-none"
//             />
//             <div className="text-xs text-muted-foreground mt-1 text-right">
//               {content.length}/2000
//             </div>
//           </div>

//           {/* Tags */}
//           <div>
//             <Label>Hashtags</Label>
//             <div className="flex gap-2 mt-2">
//               <Input
//                 value={tagInput}
//                 onChange={(e) => setTagInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" || e.key === ",") {
//                     e.preventDefault();
//                     addTag();
//                   }
//                 }}
//                 placeholder="#hashtag"
//                 className="flex-1"
//               />
//               <Button type="button" variant="outline" onClick={addTag}>
//                 Add
//               </Button>
//             </div>
//             {tags.length > 0 && (
//               <div className="flex flex-wrap gap-1 mt-2">
//                 {tags.map((t) => (
//                   <Badge
//                     key={t}
//                     variant="secondary"
//                     className="cursor-pointer"
//                     onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
//                   >
//                     #{t} <X className="w-3 h-3 ml-1" />
//                   </Badge>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Image */}
//           <div>
//             <Label>Image (optional)</Label>
//             {previewUrl ? (
//               <div className="relative mt-2 inline-block">
//                 <img
//                   src={previewUrl}
//                   alt="preview"
//                   className="max-h-48 rounded-lg border"
//                 />
//                 <Button
//                   size="icon"
//                   variant="secondary"
//                   className="absolute top-2 right-2 h-7 w-7"
//                   onClick={() => { setPreviewUrl(null); setMediaFile(null); }}
//                 >
//                   <X className="w-3 h-3" />
//                 </Button>
//               </div>
//             ) : (
//               <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition text-sm text-muted-foreground">
//                 <ImageIcon className="w-4 h-4" /> Upload image
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) =>
//                     e.target.files?.[0] && onFile(e.target.files[0])
//                   }
//                 />
//               </label>
//             )}
//           </div>

//           {/* Schedule */}
//           <div>
//             <Label htmlFor="schedule">Schedule for (optional)</Label>
//             <Input
//               id="schedule"
//               type="datetime-local"
//               value={scheduledAt}
//               onChange={(e) => setScheduledAt(e.target.value)}
//               className="mt-2"
//               min={new Date().toISOString().slice(0, 16)}
//             />
//             <p className="text-xs text-muted-foreground mt-1">
//               Khali chodoge toh abhi publish hoga
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-2 flex-wrap">
//             <Button
//               variant="outline"
//               onClick={() => submit("draft")}
//               disabled={saving}
//             >
//               {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//               Save draft
//             </Button>
//             <Button onClick={() => submit("scheduled")} disabled={saving}>
//               {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//               {scheduledAt ? "Schedule post" : "Publish now"}
//             </Button>
//           </div>
//         </Card>

//         {/* Preview */}
//         <Card className="p-6 h-fit sticky top-6">
//           <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-medium">
//             Preview
//           </div>
//           <div className="border rounded-xl p-4 bg-card">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60" />
//               <div>
//                 <div className="text-sm font-semibold">Your Brand</div>
//                 <div className="text-xs text-muted-foreground">Just now</div>
//               </div>
//             </div>
//             <p className="text-sm whitespace-pre-wrap mb-3">
//               {content || (
//                 <span className="text-muted-foreground">
//                   Your post will appear here…
//                 </span>
//               )}
//             </p>
//             {tags.length > 0 && (
//               <div className="flex flex-wrap gap-1 mb-3">
//                 {tags.map((t) => (
//                   <span key={t} className="text-xs text-primary">
//                     #{t}
//                   </span>
//                 ))}
//               </div>
//             )}
//             {previewUrl && (
//               <img
//                 src={previewUrl}
//                 alt=""
//                 className="rounded-lg border w-full"
//               />
//             )}
//           </div>
//           {platforms.length > 0 && (
//             <div className="mt-4 flex flex-wrap gap-1">
//               {platforms.map((p) => (
//                 <Badge key={p} variant="secondary" className="capitalize">
//                   {p}
//                 </Badge>
//               ))}
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Compose;


// src/pages/dashboard/Compose.tsx
// UPDATED v17: YouTube video upload + title + privacy support

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import {
  apiCreatePost,
  apiSaveDraft,
  apiGetChannels,
  type SocialChannel,
} from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Video,
  Loader2,
  X,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const PLATFORMS = [
  { id: "facebook",  label: "Facebook",    icon: Facebook  },
  { id: "instagram", label: "Instagram",   icon: Instagram },
  { id: "twitter",   label: "Twitter / X", icon: Twitter   },
  { id: "linkedin",  label: "LinkedIn",    icon: Linkedin  },
  { id: "youtube",   label: "YouTube",     icon: Youtube   },
];

const Compose = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [content,         setContent]         = useState("");
  const [platforms,       setPlatforms]       = useState<string[]>([]);
  const [scheduledAt,     setScheduledAt]     = useState("");
  const [saving,          setSaving]          = useState(false);
  const [tags,            setTags]            = useState<string[]>([]);
  const [tagInput,        setTagInput]        = useState("");
  const [apiError,        setApiError]        = useState<string | null>(null);

  // ── Image state ──────────────────────────────────────────────────
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ── YouTube-specific state ────────────────────────────────────────
  const [videoFile,      setVideoFile]      = useState<File | null>(null);
  const [videoPreview,   setVideoPreview]   = useState<string | null>(null);
  const [youtubeTitle,   setYoutubeTitle]   = useState("");
  const [youtubePrivacy, setYoutubePrivacy] = useState<"public" | "private" | "unlisted">("public");

  const youtubeSelected = platforms.includes("youtube");
  // Agar sirf YouTube select hai toh image mat dikhao
  const onlyYoutube = youtubeSelected && platforms.length === 1;

  // ── Facebook Pages state ────────────────────────────────────────
  // Jab account connect hota hai, backend usually har Facebook Page ko
  // alag "channel" ke roop mein save karta hai (platform === "facebook").
  // Yahan wahi list /api/social/accounts se fetch karke dikha rahe hain
  // taaki post karte waqt user chun sake kaunsi Page pe post jaani hai.
  const [facebookPages, setFacebookPages] = useState<SocialChannel[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [facebookPageId, setFacebookPageId] = useState<string>("");
  const facebookSelected = platforms.includes("facebook");

  useEffect(() => {
    if (!facebookSelected || !user?.token) return;
    if (facebookPages.length > 0) return; // already loaded once

    (async () => {
      setLoadingPages(true);
      const { data } = await apiGetChannels(user.token);
      const all =
        data?.channels ?? (data as { data?: SocialChannel[] })?.data ?? [];
      const pages = all.filter(
        (ch) => (ch.platform || "").toLowerCase() === "facebook"
      );
      setFacebookPages(pages);
      // Agar sirf ek hi Page connected hai to usko auto-select kar do
      if (pages.length === 1) {
        setFacebookPageId(String(pages[0].id ?? pages[0]._id ?? ""));
      }
      setLoadingPages(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facebookSelected, user?.token]);

  const togglePlatform = (id: string) => {
    setPlatforms((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
    if (id === "facebook") setFacebookPageId(""); // toggle on/off, reselect
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  // ── Collect all media files ────────────────────────────────────
  const collectMediaFiles = (): File[] => {
    const files: File[] = [];
    if (videoFile)  files.push(videoFile);
    if (imageFile && !onlyYoutube)  files.push(imageFile);
    return files;
  };

  const submit = async (status: "draft" | "scheduled") => {
    if (!user) {
      toast.error("Session expired. Please login again.");
      return;
    }
    if (!content.trim()) {
      toast.error("Content likhna padega");
      return;
    }
    if (status === "scheduled" && platforms.length === 0) {
      toast.error("Kam se kam ek platform select karo");
      return;
    }
    // YouTube validation
    if (youtubeSelected && !videoFile) {
      toast.error("YouTube ke liye video file select karo");
      return;
    }
    // Facebook validation — konsi Page pe post karni hai wo pata hona chahiye
    if (facebookSelected && facebookPages.length > 0 && !facebookPageId) {
      toast.error("Facebook ke liye ek Page select karo");
      return;
    }

    setSaving(true);
    setApiError(null);

    try {
      const mediaFiles = collectMediaFiles();

      if (status === "draft") {
        const { error } = await apiSaveDraft(
          user.token,
          content,
          platforms,
          tags,
          mediaFiles,
          facebookSelected ? facebookPageId || undefined : undefined
        );
        if (error) {
          setApiError("Draft failed: " + error);
          toast.error("Draft save nahi hua: " + error);
          return;
        }
        toast.success("Draft save ho gaya!");
      } else {
        const { error } = await apiCreatePost(
          user.token,
          content,
          platforms,
          tags,
          mediaFiles,
          scheduledAt ? new Date(scheduledAt).toISOString() : null,
          // YouTube extra fields
          youtubeTitle   || undefined,
          youtubePrivacy || undefined,
          undefined, // clientId — SMM-specific, ChannelsPage jaisi jagah se aata hai
          facebookSelected ? facebookPageId || undefined : undefined
        );
        if (error) {
          setApiError("Post failed: " + error);
          toast.error("Post create nahi hua: " + error);
          return;
        }
        toast.success(scheduledAt ? "Post scheduled!" : "Post create ho gaya!");
      }
      navigate("/dashboard/calendar");
    } catch {
      const msg = "Network error — backend check karo";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create a post</h1>
        <p className="text-sm text-muted-foreground">
          Compose, choose channels, and schedule when it goes live.
        </p>
      </div>

      {apiError && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {apiError}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-5">

          {/* Channels */}
          <div>
            <Label>Channels *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    platforms.includes(p.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  <p.icon className="w-4 h-4" /> {p.label}
                </button>
              ))}
            </div>
            {platforms.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Schedule ke liye kam se kam ek platform select karo
              </p>
            )}
          </div>

          {/* ── Facebook Page picker ── */}
          {facebookSelected && (
            <div className="border rounded-xl p-4 space-y-3 bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                <Facebook className="w-4 h-4" />
                Choose Facebook Page
              </div>

              {loadingPages ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Pages load ho rahi hain...
                </div>
              ) : facebookPages.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Koi Facebook Page connected nahi mili. Channels page se pehle
                  apna Facebook account/Page connect karo.
                </p>
              ) : (
                <div className="grid gap-2">
                  {facebookPages.map((page) => {
                    const id = String(page.id ?? page._id ?? "");
                    const selected = facebookPageId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFacebookPageId(id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                          <Facebook className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {page.name ?? page.username ?? "Facebook Page"}
                          </p>
                        </div>
                        {selected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
              {facebookPages.length > 0 && !facebookPageId && (
                <p className="text-xs text-muted-foreground">
                  Post karne se pehle ek Page select karo.
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div>
            <Label htmlFor="content">
              {youtubeSelected ? "Video Description *" : "Content *"}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                youtubeSelected
                  ? "YouTube video ki description likhao..."
                  : "What's on your mind?"
              }
              rows={6}
              maxLength={2000}
              className="mt-2 resize-none"
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {content.length}/2000
            </div>
          </div>

          {/* ── YouTube extra fields ── */}
          {youtubeSelected && (
            <div className="border rounded-xl p-4 space-y-4 bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
                <Youtube className="w-4 h-4" />
                YouTube Settings
              </div>

              {/* YouTube Title */}
              <div>
                <Label htmlFor="ytTitle">Video Title *</Label>
                <Input
                  id="ytTitle"
                  value={youtubeTitle}
                  onChange={(e) => setYoutubeTitle(e.target.value)}
                  placeholder="e.g. My Awesome Video - July 2025"
                  maxLength={100}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Khali chodoge toh description ka pehla hissa use hoga
                </p>
              </div>

              {/* Privacy */}
              <div>
                <Label>Privacy</Label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {(["public", "unlisted", "private"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setYoutubePrivacy(opt)}
                      className={`px-3 py-1.5 rounded-lg border text-sm capitalize font-medium transition ${
                        youtubePrivacy === opt
                          ? "bg-red-600 text-white border-red-600"
                          : "hover:bg-accent"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <Label>Video File *</Label>
                {videoFile ? (
                  <div className="mt-2 relative inline-block">
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="max-h-40 rounded-lg border"
                      />
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      📹 {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-red-300 rounded-lg p-6 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition text-sm text-muted-foreground">
                    <Video className="w-5 h-5 text-red-400" />
                    Upload video (MP4, MOV — max 100MB)
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/avi"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setVideoFile(f);
                          setVideoPreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <Label>Hashtags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="#hashtag"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                  >
                    #{t} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Image (sirf tab dikhao jab YouTube-only select nahi hai) */}
          {!onlyYoutube && (
            <div>
              <Label>Image (optional)</Label>
              {imagePreview ? (
                <div className="relative mt-2 inline-block">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="max-h-48 rounded-lg border"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition text-sm text-muted-foreground">
                  <ImageIcon className="w-4 h-4" /> Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setImageFile(f);
                        setImagePreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                </label>
              )}
            </div>
          )}

          {/* Schedule */}
          <div>
            <Label htmlFor="schedule">Schedule for (optional)</Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="mt-2"
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Khali chodoge toh abhi publish hoga
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => submit("draft")}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save draft
            </Button>
            <Button onClick={() => submit("scheduled")} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {scheduledAt ? "Schedule post" : "Publish now"}
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 h-fit sticky top-6">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-medium">
            Preview
          </div>
          <div className="border rounded-xl p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60" />
              <div>
                <div className="text-sm font-semibold">Your Brand</div>
                <div className="text-xs text-muted-foreground">Just now</div>
              </div>
            </div>
            {youtubeSelected && youtubeTitle && (
              <p className="text-sm font-semibold mb-1">{youtubeTitle}</p>
            )}
            <p className="text-sm whitespace-pre-wrap mb-3">
              {content || (
                <span className="text-muted-foreground">
                  Your post will appear here…
                </span>
              )}
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {tags.map((t) => (
                  <span key={t} className="text-xs text-primary">
                    #{t}
                  </span>
                ))}
              </div>
            )}
            {videoPreview && (
              <video
                src={videoPreview}
                className="rounded-lg border w-full max-h-36 object-cover"
              />
            )}
            {imagePreview && !onlyYoutube && (
              <img
                src={imagePreview}
                alt=""
                className="rounded-lg border w-full"
              />
            )}
          </div>
          {platforms.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {platforms.map((p) => (
                <Badge key={p} variant="secondary" className="capitalize">
                  {p}
                </Badge>
              ))}
            </div>
          )}
          {youtubeSelected && (
            <p className="text-xs text-muted-foreground mt-2">
              Privacy: <span className="font-medium capitalize">{youtubePrivacy}</span>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Compose;

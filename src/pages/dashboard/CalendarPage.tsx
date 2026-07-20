import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiGetPosts, type Post } from "@/lib/api";
import { Link } from "react-router-dom";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-100 text-pink-700",
  facebook: "bg-blue-100 text-blue-700",
  twitter: "bg-sky-100 text-sky-700",
  linkedin: "bg-blue-200 text-blue-800",
  youtube: "bg-red-100 text-red-700",
};

const CalendarPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Post[] | null>(null);

  useEffect(() => {
    if (!user?.token) return;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await apiGetPosts(user.token);
      if (err) {
        setError("Posts load nahi hue: " + err);
      } else {
        const all: Post[] =
          data?.posts ?? (data as any)?.data ?? [];
        // Show scheduled + published both on calendar
        setPosts(all.filter((p) => p.status === "scheduled" || p.status === "published"));
      }
      setLoading(false);
    })();
  }, [user?.token]);

  const days = useMemo(() => {
    const y = cursor.getFullYear(), m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const postsForDay = (d: Date) =>
    posts.filter((p) => {
      const dateStr = p.scheduleAt ?? p.scheduled_at ?? p.createdAt;
      if (!dateStr) return false;
      const pd = new Date(dateStr);
      return (
        pd.getFullYear() === d.getFullYear() &&
        pd.getMonth() === d.getMonth() &&
        pd.getDate() === d.getDate()
      );
    });

  const today = new Date();
  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Content calendar</h1>
          <p className="text-sm text-muted-foreground">
            All your scheduled posts in one view.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="icon"
            variant="outline"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="font-semibold min-w-[140px] text-center">
            {monthNames[cursor.getMonth()]} {cursor.getFullYear()}
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
            Today
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard/compose">+ New Post</Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading calendar...
        </div>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {dayNames.map((d) => (
                <div
                  key={d}
                  className="p-3 text-xs font-semibold text-muted-foreground text-center uppercase tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((d, i) => {
                const dayPosts = d ? postsForDay(d) : [];
                return (
                  <div
                    key={i}
                    className={`min-h-[110px] border-r border-b p-2 last:border-r-0 ${
                      d && dayPosts.length > 0 ? "cursor-pointer hover:bg-accent/30 transition" : ""
                    }`}
                    onClick={() => d && dayPosts.length > 0 && setSelected(dayPosts)}
                  >
                    {d && (
                      <>
                        <div
                          className={`text-xs font-medium mb-1 inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            isToday(d)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {d.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayPosts.slice(0, 2).map((p) => (
                            <div
                              key={p._id ?? p.id}
                              className={`text-xs px-2 py-1 rounded truncate ${
                                PLATFORM_COLORS[p.platforms?.[0]?.toLowerCase() ?? ""] ??
                                "bg-accent text-accent-foreground"
                              }`}
                            >
                              {p.content.slice(0, 30)}
                              {p.content.length > 30 ? "…" : ""}
                            </div>
                          ))}
                          {dayPosts.length > 2 && (
                            <div className="text-xs text-muted-foreground px-2">
                              +{dayPosts.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex gap-4 mt-3 text-xs flex-wrap">
            {Object.entries(PLATFORM_COLORS).map(([p, cls]) => (
              <div key={p} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${cls}`} />
                <span className="capitalize text-muted-foreground">{p}</span>
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground mt-6 text-center">
              No scheduled posts yet.{" "}
              <Link to="/dashboard/compose" className="text-primary hover:underline">
                Create one →
              </Link>
            </p>
          )}
        </>
      )}

      {/* Day detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <Card
            className="w-full max-w-sm p-5 space-y-3 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-slate-800">Posts on this day</h3>
            {selected.map((p) => (
              <div key={p._id ?? p.id} className="border rounded-lg p-3 space-y-1">
                <p className="text-sm text-slate-700">{p.content}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {p.status}
                  </Badge>
                  {p.platforms?.map((pl) => (
                    <span key={pl} className="text-xs text-muted-foreground capitalize">
                      {pl}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

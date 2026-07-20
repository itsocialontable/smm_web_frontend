import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, FileText, TrendingUp, Users, PenSquare, Loader2, AlertCircle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useAuth } from "@/lib/auth";
import { apiGetPosts, apiGetAnalytics, type Post } from "@/lib/api";

const fallbackChart = [
  { d: "Mon", v: 0 }, { d: "Tue", v: 0 }, { d: "Wed", v: 0 },
  { d: "Thu", v: 0 }, { d: "Fri", v: 0 }, { d: "Sat", v: 0 }, { d: "Sun", v: 0 },
];

const Overview = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<{ engagement?: number; followers?: number; weeklyData?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [postsRes, analyticsRes] = await Promise.all([
          apiGetPosts(user.token),
          apiGetAnalytics(user.token, "7d"),
        ]);

        if (postsRes.error) {
          setError("Posts load nahi hue: " + postsRes.error);
        } else {
          const allPosts =
            postsRes.data?.posts ??
            postsRes.data?.data ??
            [];
          setPosts(allPosts);
        }

        if (!analyticsRes.error && analyticsRes.data?.data) {
          setAnalytics(analyticsRes.data.data as any);
        }
      } catch {
        setError("Network error — backend check karo");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.token]);

  const counts = {
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    drafts: posts.filter((p) => p.status === "draft").length,
    published: posts.filter((p) => p.status === "published").length,
  };

  const chartData =
    analytics?.weeklyData?.map((d: any) => ({ d: d.day ?? d.d, v: d.engagement ?? d.reach ?? d.v ?? 0 })) ??
    fallbackChart;

  const stats = [
    { label: "Scheduled", value: counts.scheduled, icon: Calendar, change: "" },
    { label: "Drafts", value: counts.drafts, icon: FileText, change: "" },
    { label: "Engagement", value: analytics?.engagement ? `${analytics.engagement.toLocaleString()}` : "—", icon: TrendingUp, change: "" },
    { label: "Followers", value: analytics?.followers ? `${analytics.followers.toLocaleString()}` : "—", icon: Users, change: "" },
  ];

  const recentPosts = posts.slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back 👋</h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening across your channels.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/compose">
            <PenSquare className="w-4 h-4 mr-2" /> Create post
          </Link>
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  {s.change && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> {s.change}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <div className="mb-4">
                <h3 className="font-semibold">Audience growth</h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Recent posts</h3>
              <div className="space-y-3">
                {recentPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No posts yet. Create your first post!
                  </p>
                ) : (
                  recentPosts.map((p) => (
                    <div key={p._id ?? p.id} className="border rounded-lg p-3">
                      <p className="text-sm truncate text-slate-700">{p.content}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge
                          variant={p.status === "published" ? "default" : "secondary"}
                          className="text-xs capitalize"
                        >
                          {p.status}
                        </Badge>
                        {p.platforms?.slice(0, 2).map((pl) => (
                          <span key={pl} className="text-xs text-muted-foreground capitalize">
                            {pl}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {posts.length > 5 && (
                <Link
                  to="/dashboard/calendar"
                  className="mt-4 block text-xs text-primary hover:underline font-medium"
                >
                  View all posts →
                </Link>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Overview;

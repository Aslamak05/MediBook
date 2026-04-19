import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut, Stethoscope, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function AppHeader({ brand }: { brand: string }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<Awaited<ReturnType<typeof api.listNotifications>>>([]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const tick = async () => {
      const list = await api.listNotifications(user.id);
      if (!mounted) return;
      setItems(list);
      setUnread(list.filter((x) => !x.read).length);
    };
    tick();
    const t = setInterval(tick, 4000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [user]);

  const initials = user?.name?.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  const dashHref =
    user?.role === "admin" ? "/admin" : user?.role === "doctor" ? "/doctor" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg gradient-hero text-primary-foreground">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{brand}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {user && (
            <NavLink
              to={dashHref}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              Dashboard
            </NavLink>
          )}
          {user?.role === "user" && (
            <NavLink to="/doctors" className={({ isActive }) => `rounded-md px-3 py-2 text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Find a doctor
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unread > 0 && (
                      <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                        {unread}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Badge variant="secondary">{items.length}</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-72">
                    {items.length === 0 && (
                      <div className="p-6 text-center text-sm text-muted-foreground">You're all caught up.</div>
                    )}
                    {items.map((n) => (
                      <button
                        key={n.id}
                        onClick={async () => {
                          await api.markNotificationRead(n.id);
                          setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                          setUnread((u) => Math.max(0, u - (n.read ? 0 : 1)));
                        }}
                        className={`block w-full border-b px-3 py-3 text-left text-sm last:border-b-0 hover:bg-muted/60 ${n.read ? "opacity-70" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{n.title}</p>
                          {!n.read && <span className="ml-2 h-2 w-2 rounded-full bg-accent" />}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav(dashHref)}>
                    {user.role === "admin" ? <ShieldCheck className="mr-2 h-4 w-4" /> : user.role === "doctor" ? <Stethoscope className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                      nav("/");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
              <Button asChild><Link to="/register">Get started</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import Icons from "@/utils/Icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/AuthSlice";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { persistor } from "../store";

const Navbar = () => {
  const { mutate } = useMutation();
  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector(
    (state) => state.notification.notifications,
  );
  const Dispatch = useDispatch();
  const navigate = useNavigate();

  // Dark mode state — actually wires up to the document
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const unReadCount = (notifications || []).filter(
    (notification) => notification?.isRead === false,
  ).length;

  const userPicFallBack = user?.name
    ?.split(" ")
    .map((name) => name[0]?.toUpperCase())
    .join("");

  const handleLogOut = async () => {
    try {
      const res = await mutate({
        url: `user/logout`,
        method: "post",
      });
      persistor.purge();
      toast.success(res?.message || "Logged Out Successfully");
      Dispatch(logout());
      navigate("/auth");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error.message || "Error while Logging Out");
    }
  };

  const handleLoginRegisterAction = () => {
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">

        {/* ── Brand ── */}
        <button
          className="flex items-center gap-2 font-bold text-xl shrink-0"
          onClick={() => navigate("/")}
        >
          <Icons.School size={26} className="text-primary" />
          <span className="hidden sm:inline">E-Learning</span>
        </button>

        {/* ── Desktop Right Controls ── */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Notifications bell */}
          {user && (
            <Link
              className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors"
              to={`/${user?.role}/notifications`}
              aria-label="Notifications"
            >
              <Icons.Bell size={20} className="text-muted-foreground" />
              {unReadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {unReadCount}
                </span>
              )}
            </Link>
          )}

          {/* User menu or Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0 h-9 w-9">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoUrl} alt={user?.name} />
                    <AvatarFallback className="text-xs font-semibold">
                      {userPicFallBack}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="font-semibold capitalize truncate">{user?.name}</div>
                  <div className="text-xs text-muted-foreground font-normal truncate">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to={`/${user?.role}/dashboard`}>
                      <Icons.LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "student" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to={"/student/my-learning"}>
                          <Icons.BookOpen className="mr-2 h-4 w-4" />
                          My Learning
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={"/student/profile"}>
                          <Icons.UserRound className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <button
                      className="flex w-full items-center gap-2 text-destructive"
                      onClick={handleLogOut}
                    >
                      <Icons.LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={handleLoginRegisterAction}
              className="px-4 py-1.5 rounded-lg border border-border bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all duration-200 cursor-pointer"
            >
              Login / Register
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Icons.SunMedium size={18} className="text-muted-foreground" />
            ) : (
              <Icons.Moon size={18} className="text-muted-foreground" />
            )}
          </button>
        </div>

        {/* ── Mobile Right Controls ── */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Notifications bell (mobile) */}
          {user && (
            <Link
              className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors"
              to={`/${user?.role}/notifications`}
            >
              <Icons.Bell size={18} className="text-muted-foreground" />
              {unReadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {unReadCount}
                </span>
              )}
            </Link>
          )}

          {/* Dark mode toggle (mobile) */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <Icons.SunMedium size={18} className="text-muted-foreground" />
            ) : (
              <Icons.Moon size={18} className="text-muted-foreground" />
            )}
          </button>

          {/* Hamburger */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <Icons.XIcon size={20} />
            ) : (
              <Icons.Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileOpen && (
        <div className="sm:hidden border-t bg-background px-4 py-3 flex flex-col gap-2 shadow-md">
          {user ? (
            <>
              <div className="flex items-center gap-3 py-2 border-b mb-1">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photoUrl} alt={user?.name} />
                  <AvatarFallback className="text-xs font-semibold">
                    {userPicFallBack}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold capitalize text-sm">{user?.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-48">{user?.email}</div>
                </div>
              </div>
              <Link
                to={`/${user?.role}/dashboard`}
                className="flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Icons.LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              {user?.role === "student" && (
                <>
                  <Link
                    to="/student/my-learning"
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icons.BookOpen className="h-4 w-4" />
                    My Learning
                  </Link>
                  <Link
                    to="/student/profile"
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icons.UserRound className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </>
              )}
              <button
                className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                onClick={() => { handleLogOut(); setMobileOpen(false); }}
              >
                <Icons.LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={() => { handleLoginRegisterAction(); setMobileOpen(false); }}
              className="w-full px-4 py-2 rounded-lg border border-border bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all duration-200 cursor-pointer"
            >
              Login / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

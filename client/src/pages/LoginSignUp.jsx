import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import Icons from "@/utils/Icons";
import { Link } from "react-router-dom";

export function TabsDemo() {
  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Login />
      </TabsContent>
      <TabsContent value="signup">
        <SignUp />
      </TabsContent>
    </Tabs>
  );
}

const LoginSignUp = () => {
  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel – Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center gap-8 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white px-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm">
          <Link className="flex items-center gap-3" to="/">
            <Icons.School size={40} className="text-blue-300 cursor-pointer"  />
            <span className="text-3xl font-extrabold tracking-tight">E-Learning</span>
          </Link>

          <h2 className="text-2xl font-bold leading-snug">
            Start Learning Today
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Join thousands of students and instructors on India's trusted
            learning platform. Access expert-led courses, earn certificates, and
            level up your skills.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-2">
            {[
              { icon: Icons.BookMarked, text: "100+ Courses" },
              { icon: Icons.Users, text: "5,000+ Students" },
              { icon: Icons.Trophy, text: "Certificates" },
              { icon: Icons.MessageCircle, text: "Live Discussions" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm backdrop-blur-sm"
              >
                <Icon size={16} className="text-blue-300 shrink-0" />
                <span className="text-slate-200">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel – Form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-10 bg-background">
        {/* Mobile brand */}
        <Link className="flex lg:hidden items-center gap-2 mb-8 cursor-pointer" to="/">
          <Icons.School size={28} className="text-primary" />
          <span className="text-2xl font-extrabold">E-Learning</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your account or create a new one
            </p>
          </div>
          <TabsDemo />
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;

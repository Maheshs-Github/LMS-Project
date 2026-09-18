import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "@/utils/Icons";

const Hero = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/courses", { state: { searchValue: search } });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleExplore();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-screen-xl px-4 py-16 md:py-24 lg:py-28">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Icons.Trophy size={14} className="text-yellow-400" />
            India's Trusted Learning Platform
          </span>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
            Find the Best{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              Courses
            </span>{" "}
            for You
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Discover, learn, and upskill with our wide range of expert-led
            courses — at your own pace, on any device.
          </p>

          {/* Search bar */}
          <div className="flex w-full max-w-xl">
            <div className="relative flex-1">
              <Icons.Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="search"
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                value={search}
                placeholder="Search for courses, topics, skills…"
                className="w-full rounded-l-full border-0 bg-white/10 py-3 pl-10 pr-4 text-white placeholder:text-slate-400 backdrop-blur-sm outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm sm:text-base"
              />
            </div>
            <button
              className="rounded-r-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-400 active:scale-95 cursor-pointer whitespace-nowrap"
              onClick={handleExplore}
            >
              Search
            </button>
          </div>

          {/* CTA Button */}
          <button
            className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-slate-900 active:scale-95 cursor-pointer"
            onClick={handleExplore}
          >
            Explore All Courses →
          </button>
        </div>

        {/* ── Stats Bar ── */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { icon: Icons.BookMarked, label: "Courses", value: "100+" },
            { icon: Icons.Users, label: "Students", value: "5,000+" },
            { icon: Icons.UserRoundCog, label: "Instructors", value: "50+" },
            { icon: Icons.Trophy, label: "Certificates", value: "2,000+" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm"
            >
              <Icon size={22} className="text-blue-300" />
              <span className="text-xl font-bold">{value}</span>
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

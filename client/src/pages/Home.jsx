import Navbar from "@/components/Navbar";
import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/student/Hero";
import Courses from "@/components/student/Courses";
import Icons from "@/utils/Icons";
import { courseCategories } from "@/resources/Data";

// ── Category icons mapping ──────────────────────────────────
const categoryIcons = {
  "web-development": "🌐",
  "mobile-development": "📱",
  programming: "💻",
  "data-structures-algorithms": "🔧",
  database: "🗄️",
  devops: "⚙️",
  "cloud-computing": "☁️",
  "cyber-security": "🔒",
  "artificial-intelligence": "🤖",
  "machine-learning": "🧠",
  "data-science": "📊",
  "ui-ux-design": "🎨",
  "software-testing": "✅",
  "computer-science": "🖥️",
  "personality-development": "🌟",
  "communication-skills": "💬",
  "career-development": "🚀",
  "history-culture": "📜",
  "general-knowledge": "📚",
};

// ── Why Choose Us features ─────────────────────────────────
const features = [
  {
    icon: Icons.BookMarked,
    title: "Expert-Led Courses",
    desc: "Learn from verified instructors with real-world expertise across 19+ categories.",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Icons.Trophy,
    title: "Certificates on Completion",
    desc: "Earn downloadable certificates once you complete a course — recognized by employers.",
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    icon: Icons.MessageCircle,
    title: "Live Course Discussions",
    desc: "Chat with fellow students and instructors in real-time using our built-in course chat.",
    color: "text-green-600 bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: Icons.Clock,
    title: "Learn at Your Own Pace",
    desc: "Progress tracking and resumable video lectures let you learn on your own schedule.",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryValue) => {
    navigate("/courses", { state: { searchValue: "" } });
  };

  return (
    <div className="min-h-screen">
      <Hero />

      {/* ── Featured Courses Section ── */}
      <section className="py-10 md:py-14 px-4 md:px-8 max-w-screen-xl mx-auto">
        <Courses isShow={false} />
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-muted/40 border-y py-14 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose E-Learning?
            </h2>
            <p className="mt-2 text-muted-foreground text-base max-w-xl mx-auto">
              Everything you need to grow your skills — in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl border bg-background p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-base">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="py-14 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Browse by Category
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Find exactly what you want to learn
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline cursor-pointer"
            >
              View all courses →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {courseCategories.slice(0, 10).map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-4 text-center text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {categoryIcons[cat.value] || "📖"}
                </span>
                <span className="leading-tight text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-6 sm:hidden">
            <button
              onClick={() => navigate("/courses")}
              className="text-sm font-medium text-primary hover:underline cursor-pointer"
            >
              View all courses →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Icons.School size={18} />
            <span>E-Learning</span>
          </div>
          <span>© {new Date().getFullYear()} E-Learning. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;

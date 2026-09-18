import React, { useEffect, useState } from "react";
import CoursePerformance from "./CoursePerformance";
import { useGet } from "@/hooks/useGet";
import Icons from "@/utils/Icons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const { data } = useGet("dashboard/instructor");
  const navigate = useNavigate();

  const [totalStudent, setTotalStudent] = useState(0);
  const [totalLecture, setTotalLecture] = useState(0);
  const [totalCourse, setTotalCourse] = useState(0);

  useEffect(() => {
    const instructorData = data?.data;
    setTotalStudent(instructorData?.studentCount || 0);
    setTotalLecture(instructorData?.lectureCount || 0);
    setTotalCourse(instructorData?.courseCount || 0);
  }, [data]);

  const courses = data?.data?.coursesData || [];
  const completionRate = data?.data?.totalCourseCompletionRate ?? 0;

  const statCards = [
    {
      title: "Total Courses",
      value: totalCourse,
      icon: Icons.BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Total Students",
      value: totalStudent,
      icon: Icons.Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Total Lectures",
      value: totalLecture,
      icon: Icons.Video,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Avg Completion Rate",
      value: `${completionRate}%`,
      icon: Icons.Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Instructor Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your courses, active students, and overall completion performance
          </p>
        </div>
        <Button
          onClick={() => navigate("/instructor/new-course")}
          className="cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Icons.Plus className="w-4 h-4 mr-1.5" />
          Create New Course
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border ${stat.border} bg-card hover:shadow-md transition-shadow duration-200 flex items-center justify-between`}
            >
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-2xl font-extrabold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Performance Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Icons.TrendingUp className="w-5 h-5 text-primary" />
            Course Performance
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/instructor/my-courses")}
            className="text-xs text-primary font-medium cursor-pointer"
          >
            Manage Courses
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
        <CoursePerformance courses={courses} />
      </div>
    </div>
  );
};

export default InstructorDashboard;

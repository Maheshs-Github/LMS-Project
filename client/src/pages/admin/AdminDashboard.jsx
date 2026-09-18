import RecentPayments from "@/components/admin/RecentPayments";
import RecentPublishedCourses from "@/components/admin/RecentPublishedCourses";
import RecentUsers from "@/components/admin/RecentUsers";
import TopInstructors from "@/components/admin/TopInstructors";
import TopSellingCourses from "@/components/admin/TopSellingCourses";
import LineChart from "@/components/common/Charts";
import { useGet } from "@/hooks/useGet";
import { MONTHS } from "@/resources/Data";
import React, { useMemo } from "react";
import Icons from "@/utils/Icons";

const AdminDashboard = () => {
  const { data } = useGet("admin/dashboard");
  const { data: dataActivity } = useGet("admin/dashboard/recent-activity");

  const KPIData = [
    {
      label: "Total Students",
      value: data?.data?.totalStudents ?? 0,
      icon: Icons.Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Total Instructors",
      value: data?.data?.totalInstructors ?? 0,
      icon: Icons.UserRoundCog,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      label: "Total Courses",
      value: data?.data?.totalCourses ?? 0,
      icon: Icons.BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Published Courses",
      value: data?.data?.totalPublishedCourses ?? 0,
      icon: Icons.CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Total Enrollments",
      value: data?.data?.totalEnrolledStudents ?? 0,
      icon: Icons.GraduationCap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Total Revenue",
      value: `₹${data?.data?.totalRevenue ?? 0}`,
      icon: Icons.Rupee,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  const today = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const analytics = useMemo(() => {
    const cdata = data?.data?.revenueAndEnrollment ?? [];

    const categories = cdata.map(
      ({ _id }) => `${MONTHS[_id.month - 1]} ${_id.year}`
    );

    return {
      categories,
      revenueSeries: [
        {
          name: "Revenue",
          data: cdata.map((item) => item.revenue),
        },
      ],
      enrollmentSeries: [
        {
          name: "Enrollments",
          data: cdata.map((item) => item.enrollments),
        },
      ],
    };
  }, [data]);

  return (
    <div className="w-full flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            👋 Welcome back, <span className="capitalize text-primary">Admin</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Platform performance overview, metrics, and activity streams
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-card text-xs font-semibold text-muted-foreground self-start sm:self-auto">
          <Icons.CalendarDays className="w-4 h-4 text-primary" />
          {today}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPIData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${stat.border} bg-card hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-extrabold text-foreground tracking-tight">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TopSellingCourses courses={data?.data?.topSellingCourses} />
        <TopInstructors instructors={data?.data?.topInsructors} />
      </div>

      {/* Recent Activity Streams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecentPayments payments={dataActivity?.data?.recentPayments} />
        <RecentUsers users={dataActivity?.data?.recentUsers} />
        <RecentPublishedCourses courses={dataActivity?.data?.recentCoursePublished} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0 overflow-hidden">
        <LineChart
          title="Enrollments Overview"
          categories={analytics?.categories}
          series={analytics?.enrollmentSeries}
        />
        <LineChart
          title="Revenue Overview"
          categories={analytics?.categories}
          series={analytics?.revenueSeries}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

import RecentPayments from "@/components/admin/RecentPayments";
import RecentPublishedCourses from "@/components/admin/RecentPublishedCourses";
import RecentUsers from "@/components/admin/RecentUsers";
import TopInstructors from "@/components/admin/TopInstructors";
import TopSellingCourses from "@/components/admin/TopSellingCourses";
import LineChart from "@/components/common/Charts";
import Charts from "@/components/common/Charts";
import { useGet } from "@/hooks/useGet";
import { MONTHS, revenueAnalytics, studentAnalytics } from "@/resources/Data";
import React, { useEffect, useMemo } from "react";

const AdminDashboard = () => {
  const { data } = useGet("admin/dashboard");
  const { data:dataActivity } = useGet("admin/dashboard/recent-activity");


  const KPIData = [
    {
      label: "Total Students",
      value: data?.data?.totalStudents,
    },
    {
      label: "Total Instructors",
      value: data?.data?.totalInstructors,
    },
    {
      label: "Total Courses",
      value: data?.data?.totalCourses,
    },
    {
      label: "Total Published Courses",
      value: data?.data?.totalPublishedCourses,
    },
    {
      label: "Total Enrolled Students",
      value: data?.data?.totalEnrolledStudents,
    },
    {
      label: "Total Reviews",
      value: data?.data?.totalRevenue,
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
      ({ _id }) => `${MONTHS[_id.month - 1]} ${_id.year}`,
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
    <div className="w-full flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-4">
          👋 Welcome back, <span className="capitalize">Admin</span>
        </h2>
        <h3 className="text-xl font-semibold mb-4">{today}</h3>
      </div>
      <div className="grid lg:grid-cols-5 w-full gap-5">
        {(KPIData || []).map((data) => (
          <div className="p-5 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
            <div className="text-lg">{data?.label}</div>
            <div className="font-semibold text-blue-600 text-lg">
              {data?.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TopSellingCourses courses={data?.data?.topSellingCourses} />

        <TopInstructors instructors={data?.data?.topInsructors} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 my-4">
        <RecentPayments payments={dataActivity?.data?.recentPayments} />

        <RecentUsers users={dataActivity?.data?.recentUsers} />

        <RecentPublishedCourses
          courses={dataActivity?.data?.recentCoursePublished}
        />
      </div>

      <div className="grid gap-6 w-full min-w-0 overflow-hidden ">
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

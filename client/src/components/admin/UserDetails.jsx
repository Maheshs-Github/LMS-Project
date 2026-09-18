import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Wallet,
  Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGet } from "@/hooks/useGet";
import { formatCurrency, formatDate } from "@/utils/formatters";

const UserDetails = () => {
  const location = useLocation();
  const userId = location?.state?.id;
  const navigate = useNavigate();

  const { data, loading } = useGet(`admin/users/${userId}`);
  const user = data?.data?.[0];

  if (loading) {
    return (
      <div className="w-full p-6 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center text-muted-foreground text-sm">
          Loading user details...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full p-6 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center space-y-4">
          <p className="text-base font-semibold text-foreground">User not found</p>
          <Button onClick={() => navigate(-1)} className="cursor-pointer">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Users
          </Button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground capitalize">
              {user.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>

        <StatusBadge isBlocked={user.isBlocked} />
      </div>

      {/* Basic Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard
          icon={<UserRound />}
          label="Role"
          value={user.role}
          capitalize
        />

        <InfoCard
          icon={<CalendarDays />}
          label="Joined"
          value={formatDate(user.createdAt)}
        />

        <InfoCard
          icon={user.isBlocked ? <ShieldAlert /> : <ShieldCheck />}
          label="Account Status"
          value={user.isBlocked ? "Blocked" : "Active"}
        />
      </div>

      {/* Student View */}
      {user.role === "student" && <StudentDetails user={user} />}

      {/* Instructor View */}
      {user.role === "instructor" && <InstructorDetails user={user} />}

      {/* Block Information */}
      {user.isBlocked && <BlockedInformation user={user} />}

      {/* Account Action */}
      <AccountAction user={user} />
    </div>
  );
};

/* Student Details Section */
const StudentDetails = ({ user }) => {
  const statistics = useMemo(() => {
    const payments = user.payment ?? [];
    const progress = user.progress ?? [];

    return {
      courses: progress.length,
      payments: payments.length,
      completedCourses: progress.filter(
        (course) => course.completionPerc === 100
      ).length,
      certificates: progress.filter((course) => course.certificateAvailable).length,
      totalPaid: payments
        .filter((payment) => payment.status === "paid")
        .reduce((total, payment) => total + Number(payment.amount || 0), 0),
    };
  }, [user]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<BookOpen />} label="Courses" value={statistics.courses} />
        <StatCard icon={<CreditCard />} label="Payments" value={statistics.payments} />
        <StatCard icon={<CheckCircle2 />} label="Completed" value={statistics.completedCourses} />
        <StatCard icon={<Award />} label="Certificates" value={statistics.certificates} />
        <StatCard icon={<Wallet />} label="Total Paid" value={formatCurrency(statistics.totalPaid)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <StudentProgress user={user} />
        <PaymentHistory user={user} />
      </div>
    </>
  );
};

/* Instructor Details Section */
const InstructorDetails = ({ user }) => {
  const statistics = useMemo(() => {
    const courses = user.courses ?? [];
    const courseRevenue = user.courseRevenue ?? [];

    return {
      courses: courses.length,
      publishedCourses: courses.filter((c) => c.isPublished).length,
      totalRevenue: courseRevenue.reduce(
        (sum, item) => sum + Number(item.revenue || 0),
        0
      ),
    };
  }, [user]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<BookOpen />} label="Total Courses" value={statistics.courses} />
        <StatCard icon={<CheckCircle2 />} label="Published" value={statistics.publishedCourses} />
        <StatCard icon={<Wallet />} label="Total Revenue" value={formatCurrency(statistics.totalRevenue)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <InstructorCourses user={user} />
        <CourseRevenue user={user} />
      </div>
    </>
  );
};

/* Student Progress Section */
const StudentProgress = ({ user }) => {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <BookOpen className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">Course Progress</h2>
      </div>

      <div className="flex flex-col gap-3">
        {user.progress?.length > 0 ? (
          user.progress.map((course, index) => (
            <div
              key={`${course.courseName}-${index}`}
              className="border border-border/50 bg-muted/20 rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-semibold text-sm text-foreground">{course.courseName}</h3>
                <span className="font-bold text-xs text-foreground">
                  {Math.round(course.completionPerc)}%
                </span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${course.completionPerc}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs text-muted-foreground pt-1">
                <span>
                  {course.completedLectureCount} / {course.courseLectureCount} lectures
                </span>
                {course.certificateAvailable && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    🏆 Certificate Earned
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="No enrolled course progress recorded." />
        )}
      </div>
    </section>
  );
};

/* Payment History Section */
const PaymentHistory = ({ user }) => {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <CreditCard className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">Payment History</h2>
      </div>

      <div className="flex flex-col divide-y divide-border/40">
        {user.payment?.length > 0 ? (
          user.payment.map((payment, index) => (
            <div
              key={`${payment.orderId || index}`}
              className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {payment.courseName || "Course Payment"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(payment.createdAt)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency(payment.amount)}
                </p>
                <PaymentStatus status={payment.status} />
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="No payment transactions found." />
        )}
      </div>
    </section>
  );
};

/* Instructor Courses Section */
const InstructorCourses = ({ user }) => {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <BookOpen className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">Created Courses</h2>
      </div>

      <div className="flex flex-col divide-y divide-border/40">
        {user.courses?.length > 0 ? (
          user.courses.map((course, index) => (
            <div
              key={`${course._id || index}`}
              className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {course.title}
                </p>
                <p className="text-xs text-muted-foreground">{course.level}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-foreground">₹{course.price}</p>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    course.isPublished
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="No courses created by this instructor." />
        )}
      </div>
    </section>
  );
};

/* Course Revenue Section */
const CourseRevenue = ({ user }) => {
  const sortedRevenue = [...(user.courseRevenue ?? [])].sort(
    (a, b) => b.revenue - a.revenue
  );

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <Wallet className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">Revenue by Course</h2>
      </div>

      <div className="flex flex-col divide-y divide-border/40">
        {sortedRevenue.length > 0 ? (
          sortedRevenue.map((item, index) => (
            <div
              key={`${item.courseName}-${index}`}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <p className="text-sm font-medium text-foreground">{item.courseName}</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(item.revenue)}
              </p>
            </div>
          ))
        ) : (
          <EmptyState text="No revenue recorded." />
        )}
      </div>
    </section>
  );
};

/* Blocked Information Section */
const BlockedInformation = ({ user }) => {
  return (
    <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 space-y-2">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
        <h2 className="font-bold text-sm text-rose-600 dark:text-rose-400">
          Account Blocked
        </h2>
      </div>

      <div className="text-xs space-y-1 text-foreground">
        <p>
          <span className="text-muted-foreground font-medium">Reason:</span>{" "}
          {user.blockReason || "No reason provided"}
        </p>
        {user.blockedAt && (
          <p>
            <span className="text-muted-foreground font-medium">Blocked On:</span>{" "}
            {formatDate(user.blockedAt)}
          </p>
        )}
      </div>
    </section>
  );
};

/* Account Action */
const AccountAction = ({ user }) => {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground">Account Access Control</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage account status, suspension, or restrictions for this user.
          </p>
        </div>

        <Badge
          variant="secondary"
          className="self-start sm:self-auto text-xs px-3 py-1 font-semibold"
        >
          {user.isBlocked ? "Account is Suspended" : "Account is Active"}
        </Badge>
      </div>
    </section>
  );
};

/* Reusable Components */
const InfoCard = ({ icon, label, value, capitalize = false }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
        {React.cloneElement(icon, { className: "w-4 h-4 text-primary" })}
        <span>{label}</span>
      </div>
      <p className={`mt-2 text-lg font-bold text-foreground ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
        {React.cloneElement(icon, { className: "w-4 h-4 text-primary" })}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-lg font-extrabold text-foreground">{value}</p>
    </div>
  );
};

const StatusBadge = ({ isBlocked }) => {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold px-3 py-1 ${
        isBlocked
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isBlocked ? "bg-rose-500" : "bg-emerald-500"
        }`}
      />
      {isBlocked ? "Blocked" : "Active"}
    </Badge>
  );
};

const PaymentStatus = ({ status }) => {
  const isPaid = status === "paid";
  return (
    <span
      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
        isPaid
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
      }`}
    >
      {status}
    </span>
  );
};

const EmptyState = ({ text }) => {
  return (
    <div className="py-8 text-center text-xs text-muted-foreground">
      {text}
    </div>
  );
};

export default UserDetails;
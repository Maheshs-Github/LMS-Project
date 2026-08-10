
import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  Users,
  Wallet,
  Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGet } from "@/hooks/useGet";
import { formatCurrency, formatDate } from "@/utils/formatters";

const UserDetails = () => {
  const location=useLocation()
  // console.log(location?.state?.id)
  const userId=location?.state?.id;
  const navigate = useNavigate();

  const { data, loading } = useGet(`admin/users/${userId}`);

  const user = data?.data?.[0];

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="rounded-xl border bg-white p-10 text-center">
          Loading user details...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full p-6">
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-lg font-semibold">User not found</p>

          <Button
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 flex flex-col gap-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div className="flex items-center gap-4">

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold capitalize">
              {user.name}
            </h1>

            <p className="text-muted-foreground">
              {user.email}
            </p>
          </div>

        </div>

        <StatusBadge isBlocked={user.isBlocked} />

      </div>

      {/* ================= BASIC INFORMATION ================= */}

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
          icon={
            user.isBlocked
              ? <ShieldAlert />
              : <ShieldCheck />
          }
          label="Account Status"
          value={user.isBlocked ? "Blocked" : "Active"}
        />

      </div>

      {/* ================= STUDENT ================= */}

      {user.role === "student" && (
        <StudentDetails user={user} />
      )}

      {/* ================= INSTRUCTOR ================= */}

      {user.role === "instructor" && (
        <InstructorDetails user={user} />
      )}

      {/* ================= BLOCK INFORMATION ================= */}

      {user.isBlocked && (
        <BlockedInformation user={user} />
      )}

      {/* ================= ACCOUNT ACTION ================= */}

      <AccountAction user={user} />

    </div>
  );
};

/* ============================================================
   STUDENT DETAILS
============================================================ */

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

      certificates: progress.filter(
        (course) => course.certificateAvailable
      ).length,

      totalPaid: payments
        .filter((payment) => payment.status === "paid")
        .reduce(
          (total, payment) =>
            total + Number(payment.amount || 0),
          0
        ),
    };

  }, [user]);

  return (
    <>
      {/* Statistics */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <StatCard
          icon={<BookOpen />}
          label="Courses"
          value={statistics.courses}
        />

        <StatCard
          icon={<CreditCard />}
          label="Payments"
          value={statistics.payments}
        />

        <StatCard
          icon={<CheckCircle2 />}
          label="Completed"
          value={statistics.completedCourses}
        />

        <StatCard
          icon={<Award />}
          label="Certificates"
          value={statistics.certificates}
        />

        <StatCard
          icon={<Wallet />}
          label="Total Paid"
          value={formatCurrency(statistics.totalPaid)}
        />

      </div>

      {/* Student Main Content */}

      <div className="grid lg:grid-cols-2 gap-6">

        <StudentProgress user={user} />

        <PaymentHistory user={user} />

      </div>
    </>
  );
};

/* ============================================================
   STUDENT PROGRESS
============================================================ */

const StudentProgress = ({ user }) => {
  return (
    <section className="rounded-xl border bg-white p-5">

      <div className="flex items-center gap-2 mb-5">

        <BookOpen className="w-5 h-5" />

        <h2 className="text-xl font-semibold">
          Course Progress
        </h2>

      </div>

      <div className="flex flex-col gap-5">

        {user.progress?.length > 0 ? (

          user.progress.map((course, index) => (

            <div
              key={`${course.courseName}-${index}`}
              className="border rounded-lg p-4"
            >

              <div className="flex justify-between gap-4 mb-2">

                <h3 className="font-medium">
                  {course.courseName}
                </h3>

                <span className="font-semibold">
                  {Math.round(course.completionPerc)}%
                </span>

              </div>

              {/* Progress */}

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{
                    width: `${course.completionPerc}%`,
                  }}
                />

              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3 text-sm text-muted-foreground">

                <span>
                  {course.completedLectureCount} /{" "}
                  {course.courseLectureCount} lectures
                </span>

                <span
                  className={
                    course.certificateAvailable
                      ? "text-green-600 font-medium"
                      : ""
                  }
                >
                  {course.certificateAvailable
                    ? "🏆 Certificate Available"
                    : "No Certificate"}
                </span>

              </div>

            </div>

          ))

        ) : (

          <EmptyState text="No course progress available." />

        )}

      </div>

    </section>
  );
};

/* ============================================================
   PAYMENT HISTORY
============================================================ */

const PaymentHistory = ({ user }) => {
  return (
    <section className="rounded-xl border bg-white p-5">

      <div className="flex items-center gap-2 mb-5">

        <CreditCard className="w-5 h-5" />

        <h2 className="text-xl font-semibold">
          Payment History
        </h2>

      </div>

      <div className="flex flex-col">

        {user.payment?.length > 0 ? (

          user.payment.map((payment, index) => (

            <div
              key={`${payment.courseName}-${index}`}
              className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0"
            >

              <div className="min-w-0">

                <p className="font-medium truncate">
                  {payment.courseName}
                </p>

                <p className="text-sm text-muted-foreground">
                  {formatDate(payment.createdAt)}
                </p>

              </div>

              <div className="text-right shrink-0">

                <p className="font-semibold">
                  {formatCurrency(payment.amount)}
                </p>

                <PaymentStatus status={payment.status} />

              </div>

            </div>

          ))

        ) : (

          <EmptyState text="No payments found." />

        )}

      </div>

    </section>
  );
};

/* ============================================================
   INSTRUCTOR DETAILS
============================================================ */

const InstructorDetails = ({ user }) => {
  return (
    <>
      {/* Statistics */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard
          icon={<BookOpen />}
          label="Courses"
          value={user.coursesCount ?? 0}
        />

        <StatCard
          icon={<Users />}
          label="Students"
          value={user.studentsCount ?? 0}
        />

        <StatCard
          icon={<Wallet />}
          label="Revenue"
          value={formatCurrency(user.revenue ?? 0)}
        />

        <StatCard
          icon={<GraduationCap />}
          label="Published"
          value={user.published ?? 0}
        />

      </div>

      {/* Courses + Revenue */}

      <div className="grid lg:grid-cols-2 gap-6">

        <InstructorCourses user={user} />

        <CourseRevenue user={user} />

      </div>
    </>
  );
};

/* ============================================================
   INSTRUCTOR COURSES
============================================================ */

const InstructorCourses = ({ user }) => {
  return (
    <section className="rounded-xl border bg-white p-5">

      <div className="flex items-center gap-2 mb-5">

        <BookOpen className="w-5 h-5" />

        <h2 className="text-xl font-semibold">
          Courses
        </h2>

      </div>

      <div className="flex flex-col">

        {user.course?.length > 0 ? (

          user.course.map((course) => (

            <div
              key={course._id}
              className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0"
            >

              <div className="min-w-0">

                <p className="font-medium">
                  {course.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {course.students ?? 0} students
                </p>

              </div>

              <div className="text-right shrink-0">

                <p className="font-semibold">
                  {formatCurrency(course.price)}
                </p>

                <span
                  className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                    course.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {course.isPublished
                    ? "Published"
                    : "Unpublished"}
                </span>

              </div>

            </div>

          ))

        ) : (

          <EmptyState text="No courses created." />

        )}

      </div>

    </section>
  );
};

/* ============================================================
   COURSE REVENUE
============================================================ */

const CourseRevenue = ({ user }) => {

  const sortedRevenue = [...(user.courseRevenue ?? [])]
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <section className="rounded-xl border bg-white p-5">

      <div className="flex items-center gap-2 mb-5">

        <Wallet className="w-5 h-5" />

        <h2 className="text-xl font-semibold">
          Course Revenue
        </h2>

      </div>

      <div className="flex flex-col">

        {sortedRevenue.length > 0 ? (

          sortedRevenue.map((item, index) => (

            <div
              key={`${item.courseName}-${index}`}
              className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0"
            >

              <p className="font-medium">
                {item.courseName}
              </p>

              <p className="font-semibold">
                {formatCurrency(item.revenue)}
              </p>

            </div>

          ))

        ) : (

          <EmptyState text="No revenue generated." />

        )}

      </div>

    </section>
  );
};

/* ============================================================
   BLOCKED INFORMATION
============================================================ */

const BlockedInformation = ({ user }) => {
  return (
    <section className="rounded-xl border border-red-200 bg-red-50 p-5">

      <div className="flex items-start gap-3">

        <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />

        <div>

          <h2 className="font-semibold text-red-700">
            Account Blocked
          </h2>

          <p className="text-sm text-red-600 mt-1">
            This account is currently blocked.
          </p>

          <div className="mt-4 text-sm space-y-1">

            <p>
              <strong>Reason:</strong>{" "}
              {user.blockReason || "No reason provided"}
            </p>

            {user.blockedAt && (
              <p>
                <strong>Blocked On:</strong>{" "}
                {formatDate(user.blockedAt)}
              </p>
            )}

            {user.blockedBy && (
              <p>
                <strong>Blocked By:</strong>{" "}
                {user.blockedBy}
              </p>
            )}

          </div>

        </div>

      </div>

    </section>
  );
};

/* ============================================================
   ACCOUNT ACTION
============================================================ */

const AccountAction = ({ user }) => {
  const handleBlock = () => {
    // Open your block confirmation/reason modal here
    console.log("Block user:", user._id);
  };

  const handleUnblock = () => {
    // Call your unblock API here
    console.log("Unblock user:", user._id);
  };

  return (
    <section className="rounded-xl border bg-white p-5">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 className="font-semibold">
            Account Actions
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Manage this user's account access.
          </p>

        </div>

        {user.isBlocked ? (

          <Button
            onClick={handleUnblock}
            className="cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Unblock User
          </Button>

        ) : (

          <Button
            variant="destructive"
            onClick={handleBlock}
            className="cursor-pointer"
          >
            <Ban className="w-4 h-4 mr-2" />
            Block User
          </Button>

        )}

      </div>

    </section>
  );
};

/* ============================================================
   REUSABLE COMPONENTS
============================================================ */

const InfoCard = ({
  icon,
  label,
  value,
  capitalize = false,
}) => {
  return (
    <div className="rounded-xl border bg-white p-5">

      <div className="flex items-center gap-3 text-muted-foreground">

        {React.cloneElement(icon, {
          className: "w-5 h-5",
        })}

        <span className="text-sm">
          {label}
        </span>

      </div>

      <p
        className={`mt-3 text-xl font-semibold ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
};

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border bg-white p-4">

      <div className="flex items-center gap-2 text-muted-foreground">

        {React.cloneElement(icon, {
          className: "w-5 h-5",
        })}

        <span className="text-sm">
          {label}
        </span>

      </div>

      <p className="mt-3 text-xl font-bold">
        {value}
      </p>

    </div>
  );
};

const StatusBadge = ({ isBlocked }) => {
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
        isBlocked
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isBlocked ? "bg-red-500" : "bg-green-500"
        }`}
      />

      {isBlocked ? "Blocked" : "Active"}
    </span>
  );
};

const PaymentStatus = ({ status }) => {
  const isPaid = status === "paid";

  return (
    <span
      className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
        isPaid
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
};

const EmptyState = ({ text }) => {
  return (
    <div className="py-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
};

export default UserDetails;
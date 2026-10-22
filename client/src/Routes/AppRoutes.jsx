import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import PublicLayout from "@/Latyout/PublicLayout";
import InstructorLayout from "@/Latyout/InstructorLayout";
import StudentLayout from "@/Latyout/StudentLayout";
import AdminLayout from "@/Latyout/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";

const Home = lazy(() => import("@/pages/Home"));
const LoginSignUp = lazy(() => import("@/pages/LoginSignUp"));
const InstructorDashboard = lazy(() => import("@/pages/instructor/InstructorDashboard"));
const StudentDashBoard = lazy(() => import("@/pages/student/StudentDashBoard"));
const Profile = lazy(() => import("@/components/student/Profile"));
const AddCourse = lazy(() => import("@/pages/admin/course/AddCourse"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const MyCourses = lazy(() => import("@/pages/instructor/MyCourses"));
const NewCourse = lazy(() => import("@/pages/instructor/NewCourse"));
const CourseDetails = lazy(() => import("@/pages/course/CourseDetails"));
const BrowseCourses = lazy(() => import("@/pages/course/BrowseCourses"));
const MyLearning = lazy(() => import("@/components/student/MyLearning"));
const LearningPlayer = lazy(() => import("@/components/student/LearningPlayer"));
const NotFound = lazy(() => import("@/components/common/NotFound"));
const UserDetails = lazy(() => import("@/components/admin/UserDetails"));
const CourseManagement = lazy(() => import("@/pages/admin/CourseManagement"));
const AdminCourseDetails = lazy(() => import("@/components/admin/AdminCourseDetails"));
const Notifications = lazy(() => import("@/components/common/Notifications"));
const CourseChat = lazy(() => import("@/pages/course/CourseChat"));
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));

const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div
      className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
      role="status"
      aria-label="Loading page"
    />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/courses" element={<BrowseCourses />} />
          <Route element={<AuthRoute />}>
            <Route path="/auth" element={<LoginSignUp />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRole="instructor" />}>
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="new-course" element={<NewCourse />} />
            <Route path="edit-course/:id" element={<NewCourse />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="discuss/:courseId" element={<CourseChat />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashBoard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="courses" element={<BrowseCourses />} />
            <Route path="my-learning" element={<MyLearning />} />
            <Route path="learn/:courseId" element={<LearningPlayer />} />
            <Route path="discuss/:courseId" element={<CourseChat />} />
            <Route path="course/:id" element={<CourseDetails />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="user-management/user-details" element={<UserDetails />} />
            <Route path="course-management" element={<CourseManagement />} />
            <Route
              path="course-management/course-details"
              element={<AdminCourseDetails />}
            />
            <Route path="course/add" element={<AddCourse />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
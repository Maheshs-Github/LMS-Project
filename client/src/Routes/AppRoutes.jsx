import React from "react";
import PublicLayout from "@/Latyout/PublicLayout";
import Home from "@/pages/Home";
import LoginSignUp from "@/pages/LoginSignUp";
import InstructorLayout from "@/Latyout/InstructorLayout";
import InstructorDashboard from "@/pages/instructor/InstructorDashboard";
import StudentLayout from "@/Latyout/StudentLayout";
import StudentDashBoard from "@/pages/student/StudentDashBoard";
import Profile from "@/components/student/Profile";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/Latyout/AdminLayout";
import AddCourse from "@/pages/admin/course/AddCourse";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import MyCourses from "@/pages/instructor/MyCourses";
import NewCourse from "@/pages/instructor/NewCourse";
import CourseDetails from "@/pages/course/CourseDetails";
import BrowseCourses from "@/pages/course/BrowseCourses";
import MyLearning from "@/components/student/MyLearning";
import LearningPlayer from "@/components/student/LearningPlayer";
import PublicRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/components/common/NotFound";
import AuthRoute from "./AuthRoute";
import Courses from "@/components/student/Courses";
import UserManagement from "@/pages/admin/UserManagement";
import UserDetails from "@/components/admin/UserDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/courses" element={<Courses />} />
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
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashBoard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<BrowseCourses />} />
          <Route path="my-learning" element={<MyLearning />} />
          <Route path="learn/:courseId" element={<LearningPlayer />} />
          <Route path="course/:id" element={<CourseDetails />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="user-management/user-details" element={<UserDetails />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

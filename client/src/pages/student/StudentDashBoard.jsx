import { useGet } from "@/hooks/useGet";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icons from "@/utils/Icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const StudentDashBoard = () => {
  const { data, loading } = useGet("dashboard/student");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [continueLearningData, setContinueLearningData] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setContinueLearningData(data.data.courseProgress || []);
      setRecommendedCourses(data.data.recommendedCourses || []);
    }
  }, [data]);

  const enrolledCourse = data?.data?.enrolledCourses ?? 0;
  const notStartedCourses = data?.data?.notStartedCourses ?? 0;
  const inProgessCourses = data?.data?.inProgessCourses ?? 0;
  const completedCourses = data?.data?.completedCourses ?? 0;

  const handleContinueLearning = (courseId) => {
    if (courseId) {
      navigate(`/student/learn/${courseId}`);
    }
  };

  const handleViewCourse = (courseId) => {
    if (courseId) {
      navigate(`/courses`);
    }
  };

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourse,
      icon: Icons.BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "In Progress",
      value: inProgessCourses,
      icon: Icons.TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Not Started",
      value: notStartedCourses,
      icon: Icons.Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Completed",
      value: completedCourses,
      icon: Icons.Award,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Icons.Sparkles className="w-3.5 h-3.5" />
              Student Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, <span className="capitalize text-primary">{user?.name || "Student"}</span> 👋
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 max-w-xl">
              Track your learning progress, pick up right where you left off, and discover new skills.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/courses")}
              className="cursor-pointer shadow-sm"
            >
              <Icons.Compass className="w-4 h-4 mr-2" />
              Explore Courses
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground mb-4 flex items-center gap-2">
          <Icons.BarChart3 className="w-5 h-5 text-primary" />
          Overview & Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
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
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Icons.PlayCircle className="w-5 h-5 text-primary" />
            Continue Learning
          </h2>
          {continueLearningData?.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/student/mylearning")}
              className="text-xs text-primary font-medium cursor-pointer"
            >
              View All Enrolled
              <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>

        {continueLearningData && continueLearningData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {continueLearningData.map((item, index) => {
              const progress = Math.min(Math.max(item?.progressPercentage || 0, 0), 100);
              return (
                <Card
                  key={index}
                  className="group overflow-hidden rounded-xl border border-border/60 bg-card hover:shadow-lg transition-all duration-300 flex flex-col pt-0"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {item?.courseThumbnail ? (
                      <img
                        src={item.courseThumbnail}
                        alt={item?.courseName || "Course"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-muted-foreground">
                        <Icons.BookOpen className="w-10 h-10 mb-1 opacity-60" />
                        <span className="text-xs">No Thumbnail</span>
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5">
                      <Badge className="bg-black/75 backdrop-blur text-white text-xs font-semibold px-2 py-0.5">
                        {progress}% done
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <CardTitle
                        className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => handleContinueLearning(item?.courseId)}
                      >
                        {item?.courseName || "Untitled Course"}
                      </CardTitle>
                      {item?.courseSubName && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {item?.courseSubName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full cursor-pointer shadow-sm text-xs"
                      size="sm"
                      onClick={() => handleContinueLearning(item?.courseId)}
                    >
                      <Icons.Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                      Continue Course
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border bg-card/40">
            <Icons.BookOpen className="w-10 h-10 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-foreground">No active courses in progress</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">
              Start learning a new topic or resume an enrolled course
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/courses")}
              className="cursor-pointer"
            >
              Browse Catalog
            </Button>
          </div>
        )}
      </div>

      {/* Recommended Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Icons.Sparkles className="w-5 h-5 text-amber-500" />
            Recommended For You
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/courses")}
            className="text-xs text-primary font-medium cursor-pointer"
          >
            See All Courses
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {recommendedCourses && recommendedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recommendedCourses.map((course, index) => (
              <Card
                key={course?._id || index}
                className="group overflow-hidden rounded-xl border border-border/60 bg-card hover:shadow-lg transition-all duration-300 flex flex-col pt-0"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {course?.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course?.title || "Course"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-muted-foreground">
                      <Icons.BookOpen className="w-10 h-10 mb-1 opacity-60" />
                      <span className="text-xs">No Thumbnail</span>
                    </div>
                  )}
                  {course?.courseLevel && (
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur text-xs font-medium">
                        {course?.courseLevel}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {course?.title || "Untitled Course"}
                    </CardTitle>
                    {course?.subTitle && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {course.subTitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-0.5 font-bold text-base text-foreground">
                      <Icons.Rupee className="w-4 h-4" />
                      {course?.price || 0}
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <Icons.Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground">
                        {course?.averageRating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-muted-foreground">
                        ({course?.reviewCount || 0})
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full cursor-pointer shadow-sm text-xs"
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewCourse(course?.courseId || course?._id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-10 text-muted-foreground text-sm italic rounded-xl border border-border/40 bg-card/30">
            No course recommendations right now. Explore our catalog!
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashBoard;

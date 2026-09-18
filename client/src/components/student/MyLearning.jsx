import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGet } from "@/hooks/useGet";
import { useSelector } from "react-redux";
import Icons from "@/utils/Icons";
import CourseSkeleton from "./CourseSkeleton";
import { useNavigate } from "react-router-dom";

const MyLearning = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const { data, loading } = useGet(`user/${user?._id}/enrolledCourse`);

  useEffect(() => {
    const formattedData = (data?.data || [])?.map((item) => ({
      _id: item?._id,
      img: item?.thumbnail,
      name: item?.title,
      price: item?.price,
      instructorName: item?.instructor?.name,
      instructorImg: item?.instructor?.photoUrl,
      enrolledStudents: item?.enrolledStudents,
    }));
    setCourses(formattedData);
  }, [data]);

  const initials = (name) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "U";
  };

  const handleContinueLearning = (courseId) => {
    navigate(`/student/learn/${courseId}`);
  };

  const handleCourseDiscussion = (courseId, name, students) => {
    navigate(`/student/discuss/${courseId}`, {
      state: {
        courseName: name,
        coureStudetsCount: students?.length,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Learning</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Continue where you left off and keep building your skills
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/courses")}
          className="self-start sm:self-auto cursor-pointer"
        >
          <Icons.BookOpen className="w-4 h-4 mr-1.5" />
          Explore More Courses
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : courses?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card
              key={course?._id}
              className="group overflow-hidden rounded-xl border border-border/60 bg-card hover:shadow-lg transition-all duration-300 flex flex-col pt-0"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {course?.img ? (
                  <img
                    src={course.img}
                    alt={course.name || "Course thumbnail"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-muted-foreground">
                    <Icons.BookOpen className="w-10 h-10 mb-1 opacity-60" />
                    <span className="text-xs">No Thumbnail</span>
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5">
                  <Badge className="bg-primary/90 text-primary-foreground backdrop-blur text-xs font-semibold px-2.5 py-0.5 shadow-sm">
                    Enrolled
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-4 flex-1 flex flex-col justify-between gap-3">
                <CardTitle
                  className="text-base font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors cursor-pointer"
                  onClick={() => handleContinueLearning(course?._id)}
                  title={course?.name}
                >
                  {course?.name || "Untitled Course"}
                </CardTitle>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 min-w-0">
                    {course?.instructorImg ? (
                      <img
                        src={course.instructorImg}
                        className="rounded-full w-7 h-7 object-cover border border-border shrink-0"
                        alt={course?.instructorName || "Instructor"}
                      />
                    ) : (
                      <div className="rounded-full w-7 h-7 flex items-center justify-center bg-primary/20 text-primary font-bold text-xs shrink-0">
                        {initials(course?.instructorName)}
                      </div>
                    )}
                    <span className="text-xs font-medium text-muted-foreground truncate capitalize">
                      {course?.instructorName || "Instructor"}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                    onClick={() =>
                      handleCourseDiscussion(
                        course?._id,
                        course?.name,
                        course?.enrolledStudents
                      )
                    }
                    title="Open Discussion"
                  >
                    <Icons.MessageSquare className="w-3.5 h-3.5 mr-1" />
                    Discuss
                  </Button>
                </div>
              </CardHeader>

              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full cursor-pointer shadow-sm"
                  onClick={() => handleContinueLearning(course?._id)}
                >
                  Continue Learning
                  <Icons.ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-border bg-card/50">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Icons.BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No enrolled courses yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            You haven't enrolled in any courses yet. Explore our catalog and start learning today!
          </p>
          <Button onClick={() => navigate("/courses")} className="cursor-pointer">
            <Icons.Compass className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyLearning;

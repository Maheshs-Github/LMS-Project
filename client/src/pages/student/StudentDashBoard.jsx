import { useGet } from "@/hooks/useGet";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardDescription,
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
  const { data } = useGet("dashboard/student");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [continueLearningData, setContinueLearningData] = useState([]);
  const [recommededCourses, setRecommendedCourses] = useState([]);
  useEffect(() => {
    setContinueLearningData(data?.data?.courseProgress);
    setRecommendedCourses(data?.data?.recommendedCourses);
  }, [data]);

  useEffect(() => console.log("user: ", user), [user]);

  const enrolledCourse = data?.data?.enrolledCourses;
  const notStartedCourses = data?.data?.notStartedCourses;
  const inProgessCourses = data?.data?.inProgessCourses;
  const completedCourses = data?.data?.completedCourses;
  const handleContinueLearning = (courseId) => {
    console.log("courseId in My Learn: ", courseId);
    navigate(`/student/learn/${courseId}`);
  };
  return (
    <div>
      <section className="flex flex-col gap-8 p-6">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            👋 Welcome back, <span className="capitalize">{user?.name}</span>
          </h2>
          {console.log("name: ", user?.name)}

          <p className="text-muted-foreground text-lg italic mt-2">
            Continue where you left off
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(continueLearningData || [])?.map((data, index) => {
            return (
              <Card className="relative mx-auto w-full max-w-sm pt-0 col-span-1">
                {/* {console.log("course: ",course)} */}
                <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                <img
                  src={
                    data?.courseThumbnail ? data?.courseThumbnail : undefined
                  }
                  alt="Event cover"
                  className="relative z-20 aspect-video w-full object-cover  dark:brightness-40"
                />
                <CardHeader className={"flex flex-col gap-2"}>
                  <CardTitle
                    className={"text-lg truncate font-semibold w-[96%]"}
                  >
                    {data?.courseName}
                  </CardTitle>
                  <CardTitle
                    className={"text-md truncate font-semibold w-[96%]"}
                  >
                    {data?.courseSubName}
                  </CardTitle>
                  {console.log(
                    "data?.progressPercentage: ",
                    data?.progressPercentage,
                  )}
                  <div className="flex gap-1 w-full items-center">
                    <div className="w-full bg-gray-200 h-4">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${data?.progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="font-semibold">
                      {" "}
                      {data?.progressPercentage}%
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button
                    className="w-full cursor-pointer"
                    onClick={() => handleContinueLearning(data?.courseId)}
                  >
                    {"Continue Learning"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-2">Quick Stats</h2>
          <div className="grid lg:grid-cols-4 w-full gap-5">
            <div className="p-5 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
              <div className="text-lg">Enrolled</div>
              <div className="font-semibold text-blue-600 text-lg">
                {enrolledCourse}
              </div>
            </div>
            <div className="p-3 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
              <div className="text-lg">Not Started</div>
              <div className="font-semibold text-blue-600 text-lg">
                {notStartedCourses}
              </div>
            </div>
            <div className="p-3 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
              <div className="text-lg">In Progress</div>
              <div className="font-semibold text-blue-600 text-lg">
                {inProgessCourses}
              </div>
            </div>
            <div className="p-3 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
              <div className="text-lg">Completed </div>
              <div className="font-semibold text-blue-600 text-lg">
                {completedCourses}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Recommended Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(recommededCourses || [])?.map((data, index) => {
              return (
                <Card
                  className="relative mx-auto w-full max-w-sm pt-0 col-span-1"
                  key={index}
                >
                  {/* {console.log("course: ",course)} */}
                  <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                  <img
                    src={data?.thumbnail ? data?.thumbnail : undefined}
                    alt="Event cover"
                    className="relative z-20 aspect-video w-full object-cover  dark:brightness-40"
                  />
                  <CardHeader className={"flex flex-col gap-2"}>
                    <CardTitle
                      className={"text-lg truncate font-semibold w-[96%]"}
                    >
                      {data?.title}
                    </CardTitle>
                    <CardTitle
                      className={"text-md truncate font-semibold w-[96%]"}
                    >
                      {data?.subTitle}
                    </CardTitle>
                    <div className="flex items-center gap-4 font-semibold">
                      <div className="flex items-center gap-1 text-lg">
                        <Icons.Rupee size={18} />
                        {data?.price}
                      </div>

                      <div className="flex items-center gap-1">
                        <Icons.Star
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span>{data?.averageRating?.toFixed(1) || "0.0"}</span>

                        <span className="text-muted-foreground text-sm">
                          ({data?.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() => handleContinueLearning(data?.courseId)}
                    >
                      {"Continue Learning"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashBoard;

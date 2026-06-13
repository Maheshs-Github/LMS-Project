import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
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
  const navigate=useNavigate();
  const [courses, setCourses] = useState([
    {
      _id: "",
      img: "",
      name: "",
      price: "",
    },
  ]);
  const user = useSelector((state) => state.auth.user);
  console.log("user: ", user);
  // const navigate=useNavigate()
  const { data, loading } = useGet(`user/${user?._id}/enrolledCourse`);
  useEffect(() => {
    console.log("Data: ", data);
    const formattedData = (data?.data || [])?.map((data) => ({
      _id: data?._id,
      img: data?.thumbnail,
      name: data?.title,
      price: data?.price,
      instructorName: data?.instructor?.name,
      instructorImg: data?.instructor?.photoUrl,
    }));
    setCourses(formattedData);
  }, [data]);
  useEffect(() => {
    console.log("courses: ", courses);
  }, [courses]);

  const initials = (Name) => {
    return Name?.split(" ")
      ?.map((name) => name[0])
      ?.join("")
      ?.toUpperCase();
  };

  const handleContinueLearning=(courseId )=>{
    console.log("courseId in My Learn: ",courseId);
    navigate(`/student/learn/${courseId }`)
  }

  return (
    <div>
      <h1 className="font-semibold text-xl">My Learning</h1>
      <h2 className="font-semibold text-lg">Continue where you left off</h2>

      <div className="grid grid-cols-4 gap-10">
        {!loading
          ? courses?.slice(0, 4)?.map((course, index) => {
              return (
                <Card
                  className="relative mx-auto w-full max-w-sm pt-0 col-span-1"
                  key={course?._id}
                >
                  <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                  <img
                    src={course?.img}
                    alt="Event cover"
                    className="relative z-20 aspect-video w-full object-cover  dark:brightness-40"
                  />
                  <CardHeader className={"flex flex-col gap-2"}>
                    <CardTitle
                      className={"text-lg truncate font-semibold w-[96%]"}
                    >
                      {course?.name}
                    </CardTitle>
                    <div className="flex gap-0.5 justify-between w-full items-center">
                      <div className="flex gap-2 items-center">
                        {course?.instructorImg ? (
                          <img
                            src={course?.instructorImg ?? ""}
                            className="rounded-full w-8 h-8 "
                            alt=""
                          />
                        ) : (
                          <div className="rounded-full w-8 h-8 flex justify-center gap-1 items-center bg-amber-600 text-white font-semibold">
                            {initials(course?.instructorName)}
                          </div>
                        )}
                        <h4 className="font-medium text-base capitalize">
                          {course?.instructorName}
                        </h4>
                      </div>
                      <Badge
                        variant="secondary"
                        className={"bg-blue-600 text-white p-3 text-sm "}
                      >
                        Advance
                      </Badge>
                    </div>
                    <div className="flex items-center font-bold text-lg gap-2">
                      <Icons.Rupee size={18} />
                      {course?.price}
                    </div>
                  </CardHeader>
                  <CardFooter>
                    {console.log("id: ", course?._id)}
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() => handleContinueLearning(course?._id)}
                    >
                      Continue Learning
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          : Array.from({ length: 4 }).map((_, i) => <CourseSkeleton key={i} />)}
      </div>
    </div>
  );
};

export default MyLearning;

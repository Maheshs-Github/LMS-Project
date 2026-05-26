import React from "react";
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
import Friern from "../../assets/FrierenSama.jpg";
import Icons from "@/utils/Icons";
import CourseSkeleton from "./courseSkeleton";

const CourseData = [
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
];

const Courses = () => {
  return (
    <div className="p-8">
      <h3 className="w-full text-center font-bold text-3xl mb-6">Our Courses</h3>
      <div className="grid grid-cols-4 gap-10">
      {CourseData?.slice(0, 4)?.map((course, index) => {
        return (
          <Card className="relative mx-auto w-full max-w-sm pt-0 col-span-1" key={index}>
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
              src={course.coverImg}
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover  dark:brightness-40"
            />
            <CardHeader className={"flex flex-col gap-2"}>
              <CardTitle className={"text-lg truncate font-semibold w-[96%]"}>
                {course.courseTitle}
              </CardTitle>
              <div className="flex gap-0.5 justify-between w-full items-center">
                <div className="flex gap-2 items-center">
                  <img
                    src={course.courseProviderImg}
                    className="rounded-full w-12"
                    alt=""
                  />
                  <h4 className="font-medium text-base">
                    {course.courseProviderName}
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
                {course.coursePrize}
              </div>
            </CardHeader>
            <CardFooter>
              <Button className="w-full cursor-pointer">Enroll Now</Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
    <CourseSkeleton />
    </div>
  );
};

export default Courses;

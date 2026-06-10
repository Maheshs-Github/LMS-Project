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

const CourseSkeleton = () => {
  return (
    <div>
      <Card className="relative mx-auto w-full max-w-sm pt-0   animate-pulse">
        <div className="absolute inset-0 z-30 aspect-video " />
        <div className="relative z-20 aspect-video w-full object-cover  dark:brightness-40 h-48 bg-gray-300 dark:bg-gray-700"></div>
        <CardHeader className={"flex flex-col gap-2"}>
          <CardTitle
            className={
              " rounded-md  w-[96%] h-7 bg-gray-300 dark:bg-gray-700 "
            }
          ></CardTitle>
          <div className="flex gap-0.5 rounded-md  justify-between w-full items-center h-12 bg-gray-300 dark:bg-gray-700">
            <div className="flex gap-2 items-center">
              <div className="rounded-full w-12" />
              <h4 className="font-medium text-base"></h4>
            </div>
            <Badge
              className={" p-3 text-sm bg-transparent"}
            ></Badge>
          </div>
          <div className="w-20 flex items-center font-bold text-lg gap-2 h-7 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        </CardHeader>
        <CardFooter>
          <Button className="w-full cursor-pointer h-6 bg-gray-300 dark:bg-gray-700">
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseSkeleton;

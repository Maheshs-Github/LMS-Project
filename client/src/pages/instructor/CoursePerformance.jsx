import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Icons from "@/utils/Icons";

const CoursePerformance = ({ courses }) => {
  return (
    <div>
      <div className="rounded-xl border bg-white overflow-x-auto">
        <Table className={"text-lg"}>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>

              <TableHead>Students</TableHead>
              <TableHead>Lectures</TableHead>

              <TableHead>Completion</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* {data.map((course, index) => ( */}
            {/* <TableRow key={index}>
                <TableCell className="font-medium">{course.name}</TableCell>

                <TableCell>₹{course.price}</TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      course.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.status}
                  </span>
                </TableCell>

                <TableCell>{course.students ?? 0}</TableCell>

                <TableCell className="text-right">
                  {console.log("(course._id): ", course._id)}

                  <Button
                    size="sm"
                    className={"cursor-pointer p-4"}
                    onClick={() => handleEdit(course._id)}
                  >
                    <Icons.SquarePen className="w-5 h-5 mr-1" />{" "}
                    <span>Edit</span>
                  </Button>
                </TableCell>
              </TableRow> */}
            {/* ))} */}
            {(courses || [])?.map((course,key) => (
              <TableRow key={key}>
                {/* {console.log("courses: ", courses)} */}
                <TableCell className="font-medium">{course?.title}</TableCell>

                <TableCell>{course?.students}</TableCell>

                <TableCell>{course?.lectures}</TableCell>

                <TableCell>{course?.completionRate ?? 0}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CoursePerformance;

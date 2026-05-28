// components/tables/CourseTable.jsx

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

const CourseTable = ({ data }) => {
  return (
    <div className="rounded-xl border bg-white overflow-x-auto">

      <Table className={"text-lg"}>

        <TableHeader>
          <TableRow>

            <TableHead>Course</TableHead>

            <TableHead>Price</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Students</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>

          {data.map((course) => (
            <TableRow key={course.id}>

              <TableCell className="font-medium">
                {course.name}
              </TableCell>

              <TableCell>
                ₹{course.price}
              </TableCell>

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

              <TableCell>
                {course.students}
              </TableCell>

              <TableCell className="text-right">

                <Button size="sm" className={"cursor-pointer p-4"}>
                   <Icons.SquarePen className="w-5 h-5 mr-1" /> <span>Edit</span>
                </Button>

              </TableCell>

            </TableRow>
          ))}

        </TableBody>

      </Table>

    </div>
  );
};

export default CourseTable;
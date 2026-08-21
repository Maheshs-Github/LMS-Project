// components/tables/UserTable.jsx

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
import { formatDate } from "@/utils/formatters";
import { useState } from "react";
import InputField from "../common/InputField";
import { courseCategories } from "@/resources/Data";

const CourseTable = ({
  data = [],
  loading,
  handleView,
  handleBlockUnblock,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [cUser, setCUser] = useState({
    id: "",
    status: false,
    reason: "",
  });

  const handleblock = (course) => {
    handleBlockUnblock(course);
    setIsOpen(false);
  };

  const STATUS_STYLES = {
    draft: {
      bg: "bg-gray-100",
      text: "text-gray-700",
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
    },
    approved: {
      bg: "bg-green-100",
      text: "text-green-700",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
    },
  };
  const getLabel = (category) =>
    courseCategories.find((cate) => cate.value === category)?.label ?? "NA";

  return (
    <div className="rounded-xl border bg-white overflow-x-auto">
      <Table className="text-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>

            <TableHead>Instructor</TableHead>

            <TableHead>Category</TableHead>

            <TableHead>Price</TableHead>

            <TableHead>Students</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!loading ? (
            data.map((course) => {
              return (
                <TableRow key={course._id}>
                  <TableCell className="font-medium capitalize">
                    <span className="block w-55 truncate">{course.title}</span>
                  </TableCell>

                  <TableCell>{course.instructor}</TableCell>

                  <TableCell>
                    <span className="capitalize">
                      {getLabel(course.category)}
                    </span>
                  </TableCell>
                  <TableCell>{course.price}</TableCell>

                  <TableCell>{course.students}</TableCell>

                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        STATUS_STYLES[course?.status].text
                      } ${STATUS_STYLES[course?.status].bg}`}
                    >
                      {course?.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => handleView(course._id)}
                        className="p-2! text-base cursor-pointer"
                      >
                        <Icons.Eye className="size-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center w-full">
          <div className="border-primary rounded-2xl bg-white p-4 sm:w-132.5 flex flex-col gap-4">
            <InputField
              label={"Block Reason"}
              name="reason"
              placeholder="Enter the Reason"
              value={cUser.reason}
              onChange={(e) =>
                setCUser((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              type="text"
              required={true}
            />
            <div className="flex gap-3 w-full mt-2">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setIsOpen(false)}
                className={"flex-1"}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                className={"flex-1"}
                onClick={() => handleblock(cUser)}
              >
                Block User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTable;

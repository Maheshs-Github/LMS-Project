import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icons from "@/utils/Icons";
import { useState } from "react";
import InputField from "../common/InputField";
import { courseCategories } from "@/resources/Data";

const CourseTable = ({
  data = [],
  loading = false,
  handleView,
  handleBlockUnblock,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cUser, setCUser] = useState({
    id: "",
    status: false,
    reason: "",
  });

  const handleblock = (course) => {
    if (handleBlockUnblock) {
      handleBlockUnblock(course);
    }
    setIsOpen(false);
  };

  const getStatusBadge = (status = "") => {
    const s = status.toLowerCase();
    switch (s) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 capitalize text-xs">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="capitalize text-xs">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 capitalize text-xs">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="capitalize text-xs">
            {status || "Draft"}
          </Badge>
        );
    }
  };

  const getLabel = (category) =>
    courseCategories.find((cate) => cate.value === category)?.label ?? category ?? "General";

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Course Title
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Instructor
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Category
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Price
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5 text-center">
                Students
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  Loading courses...
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((course) => (
                <TableRow key={course._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-foreground py-3.5">
                    <div className="flex items-center gap-2 max-w-xs md:max-w-sm">
                      <Icons.BookOpen className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{course.title || "Untitled"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground capitalize text-sm py-3.5">
                    {course.instructor || "Unknown"}
                  </TableCell>

                  <TableCell className="text-muted-foreground text-xs py-3.5">
                    {getLabel(course.category)}
                  </TableCell>

                  <TableCell className="font-bold text-foreground text-sm py-3.5">
                    ₹{course.price || 0}
                  </TableCell>

                  <TableCell className="text-center font-semibold text-muted-foreground text-sm py-3.5">
                    {course.students ?? 0}
                  </TableCell>

                  <TableCell className="py-3.5">
                    {getStatusBadge(course.status)}
                  </TableCell>

                  <TableCell className="text-right py-3.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(course._id)}
                      className="cursor-pointer h-8 px-3 text-xs"
                    >
                      <Icons.Eye className="w-3.5 h-3.5 mr-1" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Icons.BookOpen className="w-8 h-8 text-muted-foreground/40" />
                    <span>No courses found matching filters</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4 z-50">
          <div className="rounded-2xl bg-card border border-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-foreground">Specify Reason</h3>
            <InputField
              label="Reason"
              name="reason"
              placeholder="Enter reason for this action..."
              value={cUser.reason}
              onChange={(e) =>
                setCUser((prev) => ({ ...prev, reason: e.target.value }))
              }
              type="text"
              required={true}
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleblock(cUser)}
                className="cursor-pointer"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTable;

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
import { Badge } from "@/components/ui/badge";
import Icons from "@/utils/Icons";

const CourseTable = ({ data = [], loading = false, handleEdit, handleDiscuss }) => {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Course
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Price
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Visibility
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5 text-center">
                Enrolled
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length > 0 ? (
              data.map((course, index) => (
                <TableRow key={course._id || index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-foreground py-3.5">
                    <div className="flex items-center gap-2 max-w-xs md:max-w-md">
                      <Icons.BookOpen className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{course.name || "Untitled Course"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5 font-semibold text-foreground">
                    <div className="flex items-center gap-0.5">
                      <Icons.Rupee className="w-3.5 h-3.5" />
                      {course.price || 0}
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge variant="secondary" className="capitalize text-xs font-medium">
                      {course.status || "Draft"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold px-2.5 py-0.5 ${
                        course.Published === "Published"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {course.Published}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center font-medium text-muted-foreground py-3.5">
                    {course.students ?? 0}
                  </TableCell>

                  <TableCell className="text-right py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer h-8 px-3 text-xs"
                        onClick={() => handleEdit(course._id)}
                      >
                        <Icons.SquarePen className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="cursor-pointer h-8 px-3 text-xs shadow-xs"
                        onClick={() => handleDiscuss(course._id)}
                      >
                        <Icons.MessageCircle className="w-3.5 h-3.5 mr-1" />
                        Discuss
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Icons.BookOpen className="w-10 h-10 text-muted-foreground/40" />
                    <p className="font-semibold text-foreground">No courses found</p>
                    <p className="text-xs max-w-sm">
                      You haven't created any courses yet. Click "Launch New Course" to get started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;

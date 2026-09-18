import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Icons from "@/utils/Icons";

const CoursePerformance = ({ courses }) => {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Course Title
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5 text-center">
                Enrolled Students
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5 text-center">
                Total Lectures
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5 text-center">
                Completion Rate
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses && courses.length > 0 ? (
              courses.map((course, key) => (
                <TableRow key={key} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-foreground py-3.5">
                    <div className="flex items-center gap-2">
                      <Icons.BookOpen className="w-4 h-4 text-primary shrink-0" />
                      <span className="line-clamp-1">{course?.title || "Untitled"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center font-semibold text-foreground py-3.5">
                    {course?.students ?? 0}
                  </TableCell>

                  <TableCell className="text-center text-muted-foreground py-3.5">
                    {course?.lectures ?? 0}
                  </TableCell>

                  <TableCell className="text-center py-3.5">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-semibold px-2.5 py-0.5 ${
                        (course?.completionRate || 0) >= 75
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : (course?.completionRate || 0) >= 30
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {course?.completionRate ?? 0}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Icons.BookOpen className="w-8 h-8 text-muted-foreground/40" />
                    <span>No course performance data available yet</span>
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

export default CoursePerformance;

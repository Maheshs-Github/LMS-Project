import React from "react";
import Icons from "@/utils/Icons";

const RecentPublishedCourses = ({ courses = [] }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <Icons.BookOpen className="w-4 h-4 text-primary" />
        Recently Published Courses
      </h2>

      <div className="space-y-3">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="border-b border-border/40 last:border-none pb-3 last:pb-0"
            >
              <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                {course.title || "Untitled Course"}
              </h3>

              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                by {course.instructorName || "Instructor"}
              </p>

              <span className="text-[11px] text-muted-foreground block mt-1">
                {course.updatedAt
                  ? new Date(course.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic py-3 text-center">
            No recently published courses
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentPublishedCourses;
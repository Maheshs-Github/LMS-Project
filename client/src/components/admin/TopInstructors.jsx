import React from "react";
import Icons from "@/utils/Icons";

const TopInstructors = ({ instructors = [] }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <Icons.UserRoundCog className="w-5 h-5 text-primary" />
        Top Instructors
      </h2>

      <div className="space-y-4">
        {instructors && instructors.length > 0 ? (
          instructors.map((instructor, index) => (
            <div
              key={instructor._id || index}
              className="flex items-center justify-between border-b border-border/40 last:border-none pb-4 last:pb-0"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground capitalize">
                  {instructor.name}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icons.BookOpen className="w-3.5 h-3.5 text-primary" />
                    {instructor.coursesSize || 0} Courses
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Icons.Users className="w-3.5 h-3.5 text-primary" />
                    {instructor.totalInstructorStudents || 0} Students
                  </span>
                </div>

                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-0.5">
                  ₹{Number(instructor.toatlIntructorRevenue || 0).toFixed(2)} Revenue
                </p>
              </div>

              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm text-foreground shrink-0">
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : `#${index + 1}`}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic py-4 text-center">
            No instructor metrics available yet
          </p>
        )}
      </div>
    </div>
  );
};

export default TopInstructors;
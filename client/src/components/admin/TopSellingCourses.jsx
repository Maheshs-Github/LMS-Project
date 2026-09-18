import React from "react";
import Icons from "@/utils/Icons";

const TopSellingCourses = ({ courses = [] }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <Icons.Trophy className="w-5 h-5 text-amber-500" />
        Top Selling Courses
      </h2>

      <div className="space-y-4">
        {courses && courses.length > 0 ? (
          courses.map((course, index) => (
            <div
              key={course._id || index}
              className="flex items-center justify-between border-b border-border/40 last:border-none pb-4 last:pb-0 gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-14 h-14 rounded-xl object-cover border border-border/60 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <Icons.BookOpen className="w-6 h-6" />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-foreground line-clamp-1">
                    {course.title || "Untitled Course"}
                  </h3>

                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Icons.Users className="w-3.5 h-3.5" />
                    {course.enrolledCount || 0} Students enrolled
                  </p>

                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ₹{course.price || 0}
                  </p>
                </div>
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
            No course performance data available yet
          </p>
        )}
      </div>
    </div>
  );
};

export default TopSellingCourses;
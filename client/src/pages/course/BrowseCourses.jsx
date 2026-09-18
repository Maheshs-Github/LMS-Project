import React from "react";
import Courses from "@/components/student/Courses";
import Icons from "@/utils/Icons";

const BrowseCourses = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Icons.Compass className="w-3.5 h-3.5" />
            Course Catalog
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Explore All Courses
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Discover interactive courses and video masterclasses taught by top industry instructors.
          </p>
        </div>
      </div>

      <Courses isShow={true} />
    </div>
  );
};

export default BrowseCourses;

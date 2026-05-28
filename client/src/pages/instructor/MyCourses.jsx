import CourseTable from "@/components/common/CourseTable";
import { courses } from "@/resources/Data";
import { Button } from "@/components/ui/button";



const MyCourses = () => {
  return (
    <div className="flex flex-col gap-6 p-6">

    <div className="flex justify-between">
      <h1 className="text-3xl font-bold">
        My Courses
      </h1>
      <Button className={"text-lg p-4 px-6 cursor-pointer"}>Launch New Course</Button>
    </div>
      <CourseTable data={courses} />

    </div>
  );
};

export default MyCourses;
import CourseTable from "@/components/common/CourseTable";
import { courses } from "@/resources/Data";
import { Button } from "@/components/ui/button";
import { useGet } from "@/hooks/useGet";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const MyCourses = () => {
  const navigate=useNavigate()
  const { data } = useGet("course/myCourses");
  useEffect(() => console.log("data: ", data), [data]);

  const courseData = (data?.data || []).map((data) => ({
    _id: data?._id,
    name: data?.title,
    price: data?.price,
    status:data?.status,
    Published: `${data?.isPublished ? "Published" : "Draft"}`,
  }));
  console.log("courseData: ", courseData);

  const handleEdit=(id)=>{
    // console.log("Hello There");
    // console.log("id: ",id);
    navigate(`/instructor/edit-course/${id}`)

  }
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link to={"/instructor/new-course"}><Button className={"text-lg p-4 px-6 cursor-pointer"} >
          Launch New Course
        </Button></Link>
      </div>
      <CourseTable data={courseData} handleEdit={handleEdit} />
    </div>
  );
};

export default MyCourses;

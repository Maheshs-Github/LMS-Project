import CourseTable from "@/components/common/CourseTable";
import { Button } from "@/components/ui/button";
import { useGet } from "@/hooks/useGet";
import { Link, useNavigate } from "react-router-dom";
import Icons from "@/utils/Icons";

const MyCourses = () => {
  const navigate = useNavigate();
  const { data, loading } = useGet("course/myCourses");

  const courseData = (data?.data || []).map((item) => ({
    _id: item?._id,
    name: item?.title,
    price: item?.price,
    status: item?.status,
    Published: `${item?.isPublished ? "Published" : "Draft"}`,
    students: item?.enrolledStudents?.length ?? 0,
  }));

  const handleEdit = (id) => {
    navigate(`/instructor/edit-course/${id}`);
  };

  const handleDiscuss = (courseId) => {
    navigate(`/instructor/discuss/${courseId}`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Courses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your published courses, curriculum, lectures, and student discussions
          </p>
        </div>
        <Link to="/instructor/new-course" className="self-start sm:self-auto">
          <Button className="cursor-pointer shadow-sm">
            <Icons.Plus className="w-4 h-4 mr-1.5" />
            Launch New Course
          </Button>
        </Link>
      </div>

      <CourseTable
        data={courseData}
        loading={loading}
        handleEdit={handleEdit}
        handleDiscuss={handleDiscuss}
      />
    </div>
  );
};

export default MyCourses;

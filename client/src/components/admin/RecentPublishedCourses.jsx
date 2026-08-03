const RecentPublishedCourses = ({ courses = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-xl font-semibold mb-5">
        📚 Recent Published Courses
      </h2>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="border-b last:border-none pb-3 last:pb-0"
          >
            <h3 className="font-medium line-clamp-1">
              {course.title}
            </h3>

            <p className="text-sm text-gray-500 capitalize">
              {course.instructorName}
            </p>

            <span className="text-sm text-gray-400">
              {new Date(course.updatedAt).toLocaleDateString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPublishedCourses;
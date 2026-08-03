const TopSellingCourses = ({ courses = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-xl font-semibold mb-5">
        🏆 Top Selling Courses
      </h2>

      <div className="space-y-4">
        {courses.map((course, index) => (
          <div
            key={course._id}
            className="flex items-center justify-between border-b last:border-none pb-4 last:pb-0"
          >
            <div className="flex items-center gap-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover"
              />

              <div>
                <h3 className="font-semibold line-clamp-1">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500">
                  👥 {course.enrolledCount} Students
                </p>

                <p className="text-sm font-medium text-green-600">
                  ₹{course.price}
                </p>
              </div>
            </div>

            <span className="text-2xl">
              {index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : `#${index + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingCourses;
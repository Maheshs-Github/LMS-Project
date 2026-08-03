const TopInstructors = ({ instructors = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-xl font-semibold mb-5">
        👨‍🏫 Top Instructors
      </h2>

      <div className="space-y-4">
        {instructors.map((instructor, index) => (
          <div
            key={instructor._id}
            className="flex items-center justify-between border-b last:border-none pb-4 last:pb-0"
          >
            <div>
              <h3 className="font-semibold capitalize">
                {instructor.name}
              </h3>

              <p className="text-sm text-gray-500">
                📚 {instructor.coursesSize} Courses
              </p>

              <p className="text-sm text-gray-500">
                👨‍🎓 {instructor.totalInstructorStudents} Students
              </p>

              <p className="text-sm font-medium text-green-600">
                💰 ₹{Number(
                  instructor.toatlIntructorRevenue
                ).toFixed(2)}
              </p>
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

export default TopInstructors;
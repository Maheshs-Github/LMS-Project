const RecentUsers = ({ users = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-xl font-semibold mb-5">👤 Recent Users</h2>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="border-b last:border-none pb-3 last:pb-0"
          >
            <h3 className="font-medium capitalize">
              {user.name}
            </h3>

            <div className="flex justify-between mt-1">
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                {user.role}
              </span>

              <span className="text-sm text-gray-400">
                {new Date(user.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
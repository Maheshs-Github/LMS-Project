const RecentPayments = ({ payments = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-xl font-semibold mb-5">💳 Recent Payments</h2>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment._id}
            className="border-b last:border-none pb-3 last:pb-0"
          >
            <h3 className="font-medium capitalize">
              {payment.studentName}
            </h3>

            <p className="text-sm text-gray-500 line-clamp-1">
              {payment.courseName}
            </p>

            <div className="flex justify-between mt-1 text-sm">
              <span className="font-semibold text-green-600">
                ₹{payment.amount}
              </span>

              <span className="text-gray-400">
                {new Date(payment.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPayments;
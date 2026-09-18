import React from "react";
import Icons from "@/utils/Icons";

const RecentPayments = ({ payments = [] }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <Icons.CreditCard className="w-4 h-4 text-primary" />
        Recent Payments
      </h2>

      <div className="space-y-3">
        {payments && payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="border-b border-border/40 last:border-none pb-3 last:pb-0"
            >
              <h3 className="font-semibold text-sm text-foreground capitalize">
                {payment.studentName || "Student"}
              </h3>

              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {payment.courseName || "Course Purchase"}
              </p>

              <div className="flex justify-between items-center mt-1.5 text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{payment.amount || 0}
                </span>

                <span className="text-muted-foreground">
                  {payment.createdAt
                    ? new Date(payment.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic py-3 text-center">
            No recent payment transactions
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentPayments;
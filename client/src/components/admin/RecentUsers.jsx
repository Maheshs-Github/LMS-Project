import React from "react";
import Icons from "@/utils/Icons";
import { Badge } from "@/components/ui/badge";

const RecentUsers = ({ users = [] }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <Icons.Users className="w-4 h-4 text-primary" />
        Recent Users
      </h2>

      <div className="space-y-3">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="border-b border-border/40 last:border-none pb-3 last:pb-0"
            >
              <h3 className="font-semibold text-sm text-foreground capitalize">
                {user.name || "User"}
              </h3>

              <div className="flex justify-between items-center mt-1.5">
                <Badge
                  variant="secondary"
                  className="text-[11px] capitalize font-medium px-2 py-0.5"
                >
                  {user.role || "student"}
                </Badge>

                <span className="text-[11px] text-muted-foreground">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
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
            No recent registered users
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentUsers;
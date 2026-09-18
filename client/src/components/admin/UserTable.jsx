import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icons from "@/utils/Icons";
import { formatDate } from "@/utils/formatters";
import { useState } from "react";
import InputField from "../common/InputField";

const UserTable = ({ data = [], loading = false, handleView, handleBlockUnblock }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cUser, setCUser] = useState({
    id: "",
    status: false,
    reason: "",
  });

  const handleblock = (user) => {
    handleBlockUnblock(user);
    setIsOpen(false);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                User Name
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Email Address
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Role
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Account Status
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5">
                Joined Date
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-3.5 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((user) => (
                <TableRow key={user._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-foreground capitalize text-sm py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm py-3.5">
                    {user.email}
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge variant="secondary" className="capitalize text-xs font-medium">
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold px-2.5 py-0.5 ${
                        user?.isBlocked
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {user?.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-xs py-3.5">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  <TableCell className="text-right py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(user._id)}
                        className="cursor-pointer h-8 px-2.5 text-xs"
                      >
                        <Icons.Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>

                      {user?.isBlocked ? (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-8 px-2.5 text-xs"
                          onClick={() =>
                            handleBlockUnblock({
                              id: user._id,
                              status: !user.isBlocked,
                            })
                          }
                        >
                          <Icons.UserCheck className="w-3.5 h-3.5 mr-1" />
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer h-8 px-2.5 text-xs"
                          onClick={() => {
                            setIsOpen(true);
                            setCUser({ id: user?._id, status: !user.isBlocked });
                          }}
                        >
                          <Icons.UserX className="w-3.5 h-3.5 mr-1" />
                          Block
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Icons.Users className="w-8 h-8 text-muted-foreground/40" />
                    <span>No users found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4 z-50">
          <div className="rounded-2xl bg-card border border-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-foreground">Block User Account</h3>
            <InputField
              label="Block Reason"
              name="reason"
              placeholder="State reason for blocking account..."
              value={cUser.reason}
              onChange={(e) =>
                setCUser((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              type="text"
              required={true}
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleblock(cUser)}
                className="cursor-pointer"
              >
                Confirm Block
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;

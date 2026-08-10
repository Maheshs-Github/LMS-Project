// components/tables/UserTable.jsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Icons from "@/utils/Icons";
import { formatDate } from "@/utils/formatters";
import { useState } from "react";
import InputField from "../common/InputField";

const UserTable = ({ data = [], loading, handleView, handleBlockUnblock }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
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
    <div className="rounded-xl border bg-white overflow-x-auto">
      <Table className="text-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>

            <TableHead>Email</TableHead>

            <TableHead>Role</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Joined</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!loading ? (
            data.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium capitalize">
                  {user.name}
                </TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>
                  <span className="capitalize">{user.role}</span>
                </TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user?.isBlocked ? "Blocked" : "Active"}
                  </span>
                </TableCell>

                <TableCell>{formatDate(user.createdAt)}</TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleView(user._id)}
                      className="p-2! text-base cursor-pointer"
                    >
                      <Icons.Eye className="size-4 mr-1" />
                      View
                    </Button>

                    {user?.isBlocked ? (
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 cursor-pointer"
                        onClick={() =>
                          handleBlockUnblock({
                            id: user._id,
                            status: !user.isBlocked,
                          })
                        }
                      >
                        <Icons.UserCheck className="w-4 h-4 mr-1" />
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => {
                          setIsOpen(true);
                          setCUser({ id: user?._id, status: !user.isBlocked });
                        }}
                      >
                        <Icons.UserX className="w-4 h-4 mr-1" />
                        Block
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center w-full">
          <div className="border-primary rounded-2xl bg-white p-4 sm:w-132.5 flex flex-col gap-4">
            <InputField
              label={"Block Reason"}
              name="reason"
              placeholder="Enter the Reason"
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
            <div className="flex gap-3 w-full mt-2">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setIsOpen(false)}
                className={"flex-1"}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                className={"flex-1"}
                onClick={() => handleblock(cUser)}
              >
                Block User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;

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
// import { formatDate } from "@/utils/formatDate";

const UserTable = ({
  data = [],
  handleView,
  handleBlock,
  handleUnblock,
}) => {
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

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium capitalize">
                {user.name}
              </TableCell>

              <TableCell>{user.email}</TableCell>

              <TableCell>
                <span className="capitalize">
                  {user.role}
                </span>
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

              <TableCell>
                {formatDate(user.createdAt)}
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    // onClick={() => handleView(user._id)}
                  >
                    <Icons.Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  {user?.isBlocked ? (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        handleUnblock(user._id)
                      }
                    >
                      <Icons.UserCheck className="w-4 h-4 mr-1" />
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleBlock(user._id)
                      }
                    >
                      <Icons.UserX className="w-4 h-4 mr-1" />
                      Block
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
import UserTable from "@/components/admin/UserTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGet } from "@/hooks/useGet";
import { useMutation } from "@/hooks/useMutation";
import Icons from "@/utils/Icons";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [cPage, setCPage] = useState(1);
  const [filters, setFilters] = useState({
    searchValue: "",
    role: "All",
    status: "All",
    sortBy: "latest",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    role: "All",
    status: "All",
    sortBy: "latest",
  });

  const { data, loading, refetch } = useGet(
    `admin/users?page=${cPage}&searchValue=${appliedFilters.searchValue}&role=${appliedFilters.role}&status=${appliedFilters.status}&sortBy=${appliedFilters.sortBy}`
  );
  const { mutate } = useMutation();

  const userData = data?.data?.Users ?? [];
  const pagination = data?.data?.pagination;

  const handleSearch = () => {
    setAppliedFilters(filters);
    setCPage(1);
  };

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    const defaultState = {
      searchValue: "",
      role: "All",
      status: "All",
      sortBy: "latest",
    };
    setFilters(defaultState);
    setAppliedFilters(defaultState);
    setCPage(1);
  };

  const handleView = (id) => {
    navigate("/admin/user-management/user-details", {
      state: { id },
    });
  };

  const handleBlockUnblock = async (user) => {
    try {
      const payload = {
        userId: user.id,
        blockStatus: user.status,
      };
      if (user.status) {
        payload.blockReason = user.reason;
      }
      let res = await mutate({
        method: "patch",
        url: "admin/toggle-block",
        body: payload,
      });
      toast.success(res?.message || "User status updated successfully");
      await refetch();
    } catch (error) {
      toast.error(error?.message || "Failed to update user status");
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || cPage;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View, search, and manage students and instructor accounts across the platform
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex flex-col lg:flex-row items-center gap-3">
        <div className="relative w-full lg:flex-1">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-10 text-sm"
            placeholder="Search users by name or email..."
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            value={filters.searchValue}
            name="searchValue"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
          <Select
            value={filters.role}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[130px] h-10 text-sm">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[130px] h-10 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, sortBy: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[130px] h-10 text-sm">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button
            className="flex-1 lg:flex-initial h-10 cursor-pointer shadow-xs"
            onClick={handleSearch}
            disabled={loading}
          >
            <Icons.Search className="w-4 h-4 mr-1.5" />
            Search
          </Button>
          <Button
            variant="outline"
            className="flex-1 lg:flex-initial h-10 cursor-pointer"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        data={userData}
        handleView={handleView}
        loading={loading}
        handleBlockUnblock={handleBlockUnblock}
      />

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {pagination?.totalUsers
              ? (currentPage - 1) * (pagination?.pageLimit || 10) + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">
            {Math.min(
              currentPage * (pagination?.pageLimit || 10),
              pagination?.totalUsers || 0
            )}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {pagination?.totalUsers ?? 0}
          </span>{" "}
          users
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => setCPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || loading}
          >
            <Icons.ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <span className="text-xs font-semibold px-2">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => setCPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || loading}
          >
            Next
            <Icons.ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

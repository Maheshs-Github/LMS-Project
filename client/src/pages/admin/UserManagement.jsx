import UserTable from "@/components/admin/UserTable";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  const LIMIT = 1;
  const { data, loading, refetch } = useGet(
    `admin/users?page=${cPage}&searchValue=${appliedFilters.searchValue}&role=${appliedFilters.role}&status=${appliedFilters.status}&sortBy=${appliedFilters.sortBy}`,
  );
  const { mutate } = useMutation();
  useEffect(() => console.log("data: ", data), [data]);
  const userData = data?.data?.Users;
  const pagination = data?.data?.pagination;
  console.log("userData: ", userData);
  useEffect(() => console.log("filters: ", filters), [filters]);

  const handleSearch = () => {
    setAppliedFilters(filters);
    refetch();
  };

  const handleChnage = (e) => {
    console.log("e.target.value: ", e.target.value);
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setFilters({
      searchValue: "",
      role: "All",
      status: "All",
      sortBy: "latest",
    });
    setAppliedFilters({
      searchValue: "",
      role: "All",
      status: "All",
      sortBy: "latest",
    });
  };

  const handleView = (id) => {
    navigate("/admin/user-management/user-details", {
      state: {
        id: id,
      },
    });
  };

  const handleBlockUnblock = async (user) => {
    try {
      const payload = {};
      payload.userId = user.id;
      payload.blockStatus = user.status;
      if (user.status) {
        payload.blockReason = user.reason;
      }
      let res = await mutate({
        method: "patch",
        url: "admin/toggle-block",
        body: payload,
      });
      console.log("res: ", res);
      toast.success(res?.message);
       setIsOpen(false);
      await refetch();
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.message);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-12 gap-2 w-full my-6">
        <div className="relative sm:col-span-6 col-span-12">
          <Icons.Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className=" p-4 pl-10"
            placeholder="Search Users..."
            onChange={handleChnage}
            value={filters.searchValue}
            name="searchValue"
          />
        </div>

        <div className="flex gap-4 sm:col-span-4 col-span-12 w-full">
          <Select
            value={filters.role}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, role: value }))
            }
            className=" w-full"
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="Role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          className="p-1 bg-black text-white font-semibold cursor-pointer  rounded-xl sm:col-span-1 col-span-12"
          onClick={handleSearch}
          disabled={loading}
        >
          Search
        </button>
        <button
          className="p-1 bg-red-700 text-white font-semibold cursor-pointer  rounded-xl sm:col-span-1 col-span-12"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>
      </div>
      <UserTable
        data={userData}
        handleView={handleView}
        loading={loading}
        handleBlockUnblock={handleBlockUnblock}
      />
      <div className="flex justify-between items-center">
        <div>
          Showing{" "}
          <span className="font-semibold text-lg">
            {" "}
            {pagination?.pageLimit * pagination?.currentPage -
              pagination?.pageLimit +
              1}{" "}
            - {pagination?.pageLimit * pagination?.currentPage}
          </span>{" "}
          User Out of{" "}
          <span className="font-semibold text-lg">
            {pagination?.totalUsers}
          </span>
        </div>
        <div className="flex justify-end items-center gap-3 my-6 ">
          <button
            className="bg-black text-white font-semibold p-2 rounded-xl cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
            onClick={() => setCPage((page) => page - 1)}
            disabled={cPage == 1}
          >
            <ArrowLeft />
          </button>
          <span className="text-xl">{pagination?.currentPage}</span>
          <button
            className="bg-black text-white font-semibold p-2 rounded-xl cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
            onClick={() => setCPage((page) => page + 1)}
            disabled={cPage == pagination?.totalPages}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

import CourseTable from "@/components/admin/CourseTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGet } from "@/hooks/useGet";
import { courseCategories } from "@/resources/Data";
import Icons from "@/utils/Icons";
import React, { useEffect, useState } from "react";

const CourseManagement = () => {
  const [filters, setFilters] = useState({
    searchValue: "",
    category: "",
    status: "",
    sortBy: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    category: "",
    status: "",
    sortBy: "",
  });

  const { data } = useGet(
    `admin/courses?searchValue=${appliedFilters.searchValue}&category=${appliedFilters.category}&status=${appliedFilters.status}&sortBy=${appliedFilters.sortBy}`,
  );
  useEffect(() => console.log("data: ", data), [data]);

  const courseData = data?.data ?? [];

  const handleChnage = (e) => {
    console.log("e.target.value: ", e.target.value);
    setFilters((filt) => ({ ...filt, searchValue: e.target.value }));
  };
  const handleReset = () => {};
  const handleSearch = () => {
    console.log("filters: ", filters);
    setAppliedFilters(filters);
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-2 w-full my-6">
        <div className="relative sm:col-span-6 col-span-12">
          <Icons.Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className=" p-4 pl-10"
            placeholder="Search Courses..."
            onChange={handleChnage}
            value={filters.searchValue}
            name="searchValue"
          />
        </div>

        <div className="flex gap-4 sm:col-span-4 col-span-12 w-full">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value }))
            }
            className=" w-full"
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {courseCategories?.map((cate) => (
                <SelectItem value={cate.value}>{cate.label}</SelectItem>
              ))}
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
          // disabled={loading}
        >
          Search
        </button>
        <button
          className="p-1 bg-red-700 text-white font-semibold cursor-pointer  rounded-xl sm:col-span-1 col-span-12"
          onClick={handleReset}
          // disabled={loading}
        >
          Reset
        </button>
      </div>
      <CourseTable
        data={courseData}
        // handleView={handleView}
        // loading={loading}
        // handleBlockUnblock={handleBlockUnblock}
      />
    </div>
  );
};

export default CourseManagement;

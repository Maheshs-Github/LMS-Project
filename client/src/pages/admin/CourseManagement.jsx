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
import { useMutation } from "@/hooks/useMutation";
import { courseCategories } from "@/resources/Data";
import Icons from "@/utils/Icons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CourseManagement = () => {
  const [filters, setFilters] = useState({
    searchValue: "",
    category: "",
    status: "all",
    sortBy: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    category: "",
    status: "all",
    sortBy: "",
  });
  const [page, setPage] = useState(1);
  const navigate=useNavigate();

  const { data, loading, refetch } = useGet(
    `admin/courses?searchValue=${appliedFilters.searchValue}&category=${appliedFilters.category}&status=${appliedFilters.status}&sortBy=${appliedFilters.sortBy}&page=${page}`,
  );

  // useEffect(() => console.log("page: ", page), [page]);
  // useEffect(()=>console.log("appliedFilters: ",appliedFilters),[appliedFilters])

  const courseData = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  // console.log("courseData: ",courseData)

  const handleChnage = (e) => {
    // console.log("e.target.value: ", e.target.value);
    setFilters((filt) => ({ ...filt, searchValue: e.target.value }));
  };
  const handleReset = async () => {
    setFilters({
      searchValue: "",
      category: "",
      status: "",
      sortBy: "",
    });
    setAppliedFilters({
      searchValue: "",
      category: "",
      status: "",
      sortBy: "",
    });
    // await refetch();
  };
  const handleSearch = () => {
    // console.log("filters: ", filters);
    setAppliedFilters(filters);
  };

  const handleView=async(id)=>{
    console.log("id: ",id)
    navigate("/admin/course-management/course-details",{
      state:{id}
    })
  }

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
      <CourseTable
        data={courseData}
        handleView={handleView}
        // loading={loading}
        // handleBlockUnblock={handleBlockUnblock}
      />
      <div className="flex justify-between items-center mt-3">
        <div>
          Showing{" "}
          <span className="font-semibold">
            {pagination?.currentPage * pagination?.pageLimit -
              pagination?.pageLimit +
              1}{" "}
            - {pagination?.currentPage * pagination?.pageLimit}
          </span>{" "}
          Out of{" "}
          <span className="font-semibold">{pagination?.totalCourses}</span>
        </div>
        <div className="flex gap-1 item-center ">
          <button
            className="p-1 bg-black text-white font-semibold cursor-pointer  rounded-xl sm:col-span-1 col-span-12 disabled:bg-gray-200 disabled:cursor-not-allowed"
            onClick={() => setPage((page) => page - 1)}
            disabled={page <= 1}
          >
            <ArrowLeft />
          </button>
          <span className="text-xl">{pagination?.currentPage}</span>
          <button
            className="p-1 bg-black text-white font-semibold cursor-pointer  rounded-xl sm:col-span-1 col-span-12 disabled:bg-gray-200 disabled:cursor-not-allowed"
            onClick={() => setPage((page) => page + 1)}
            disabled={page == pagination?.totalPages}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;

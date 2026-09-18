import CourseTable from "@/components/admin/CourseTable";
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
import { courseCategories } from "@/resources/Data";
import Icons from "@/utils/Icons";
import React, { useState } from "react";
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
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet(
    `admin/courses?searchValue=${appliedFilters.searchValue}&category=${appliedFilters.category}&status=${appliedFilters.status}&sortBy=${appliedFilters.sortBy}&page=${page}`
  );

  const courseData = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, searchValue: e.target.value }));
  };

  const handleReset = () => {
    const defaultState = {
      searchValue: "",
      category: "",
      status: "all",
      sortBy: "",
    };
    setFilters(defaultState);
    setAppliedFilters(defaultState);
    setPage(1);
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleView = (id) => {
    navigate("/admin/course-management/course-details", {
      state: { id },
    });
  };

  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || page;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Course Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review, approve, and manage all instructor courses across the platform
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex flex-col lg:flex-row items-center gap-3">
        <div className="relative w-full lg:flex-1">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-10 text-sm"
            placeholder="Search courses by title..."
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            value={filters.searchValue}
            name="searchValue"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value === "all" ? "" : value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[150px] h-10 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {courseCategories?.map((cate, idx) => (
                <SelectItem key={idx} value={cate.value}>
                  {cate.label}
                </SelectItem>
              ))}
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy || "newest"}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, sortBy: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[130px] h-10 text-sm">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
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

      {/* Course Table */}
      <CourseTable data={courseData} handleView={handleView} />

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {pagination?.totalCourses
              ? (currentPage - 1) * (pagination?.pageLimit || 10) + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">
            {Math.min(
              currentPage * (pagination?.pageLimit || 10),
              pagination?.totalCourses || 0
            )}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {pagination?.totalCourses ?? 0}
          </span>{" "}
          courses
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

export default CourseManagement;

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icons from "@/utils/Icons";
import CourseSkeleton from "./courseSkeleton";
import { useGet } from "@/hooks/useGet";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { courseCategories } from "@/resources/Data";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Courses = ({ isShow = true }) => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    category: "All",
    sort: "",
  });

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    {
      _id: "",
      img: "",
      name: "",
      price: "",
    },
  ]);
  const page = 1,
    limit = 6;
  const [curPage, setCurPage] = useState(1);
  const { loading, data, refetch } = useGet(
    `course?searchValue=${appliedFilters.search}&sortBy=${appliedFilters.sort}&category=${appliedFilters.category}&page=${curPage}&limit=${limit}`,
  );
  useEffect(() => {
    if (location?.state?.searchValue)
      setFilters((prev) => ({ ...prev, search: location?.state?.searchValue }));
  }, [location?.state?.searchValue]);
  useEffect(() => {
    const formattedData = (data?.data?.courseReviewData || [])?.map((data) => ({
      _id: data?._id,
      img: data?.thumbnail,
      name: data?.title,
      price: data?.price,
      level: data?.level,
      averageRating: data?.averageRating,
      reviewCount: data?.reviewCount,
      instructorName: data?.instructor?.name,
      instructorImg: data?.instructor?.photoUrl,
      enrolledStudents: data?.enrolledStudents,
    }));
    setCourses(formattedData);
  }, [data]);

  const initials = (Name) => {
    return Name?.split(" ")
      ?.map((name) => name[0])
      ?.join("")
      ?.toUpperCase();
  };
  const handleEnroll = (id) => {
    navigate(user ? `/student/course/${id}` : `/course/${id}`);
  };

  const handleContinueLearning = (courseId) => {
    navigate(`/student/learn/${courseId}`);
  };

  const levelStyles = {
    Beginner: "bg-green-100 text-green-700 border border-green-200",
    Moderate: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Advance: "bg-red-100 text-red-700 border border-red-200",
  };

  const handleChnage = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSearch = () => {
    setAppliedFilters(filters);
    setCurPage(1);
  };
  const handleReset = () => {
    setFilters({
      search: "",
      category: "All",
      sort: "",
    });
    setAppliedFilters({
      search: "",
      category: "All",
      sort: "",
    });
    setCurPage(1);
  };
  const paginationData = data?.data?.pagination;

  const handleExplore = () => {
    navigate("/courses");
  };

  return (
    <div className="w-full space-y-6">
      {/* Section Header (when shown as featured courses on home) */}
      {!isShow && (
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-foreground">
              Featured Courses
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Top-rated programs chosen by thousands of learners
            </p>
          </div>
          <button
            className="text-sm font-semibold text-primary hover:underline cursor-pointer whitespace-nowrap"
            onClick={handleExplore}
          >
            View All →
          </button>
        </div>
      )}

      {/* Filter Bar */}
      {isShow && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search courses..."
              onChange={handleChnage}
              value={filters.search}
              name="search"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Category */}
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {courseCategories.map((cate) => (
                <SelectItem value={cate.value} key={cate.value}>
                  {cate.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={filters.sort}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, sort: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low → High</SelectItem>
              <SelectItem value="price-high">Price: High → Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              className="flex-1 sm:flex-none px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="flex-1 sm:flex-none px-5 py-2 bg-destructive/10 text-destructive text-sm font-semibold rounded-lg cursor-pointer hover:bg-destructive/20 transition-colors border border-destructive/20"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {!loading
          ? courses?.map((course, index) => {
              const isEnrolled = course?.enrolledStudents?.some(
                (student) => student === user?._id,
              );
              return (
                <Card
                  className="course-card relative mx-auto w-full pt-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
                  key={index}
                >
                  {/* Thumbnail overlay */}
                  <div className="absolute inset-0 z-30 aspect-video bg-black/20" />
                  <img
                    src={course?.img ? course.img : undefined}
                    alt={course?.name || "Course thumbnail"}
                    className="relative z-20 aspect-video w-full object-cover"
                  />
                  <CardHeader className={"flex flex-col gap-2 pt-3"}>
                    <CardTitle
                      className={"text-base font-semibold leading-snug line-clamp-2"}
                    >
                      {course?.name}
                    </CardTitle>
                    <div className="flex gap-2 justify-between w-full items-center">
                      <div className="flex gap-1.5 items-center">
                        {course?.instructorImg ? (
                          <img
                            src={course?.instructorImg ?? ""}
                            className="rounded-full w-7 h-7 object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="rounded-full w-7 h-7 flex justify-center items-center bg-amber-500 text-white text-xs font-bold shrink-0">
                            {initials(course?.instructorName)}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground font-medium truncate max-w-24 capitalize">
                          {course?.instructorName}
                        </span>
                      </div>
                      {course?.level && (
                        <Badge
                          variant="secondary"
                          className={`${levelStyles[course?.level]} px-2 py-0.5 text-xs shrink-0`}
                        >
                          {course?.level}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold">
                      <div className="flex items-center gap-0.5">
                        <Icons.Rupee size={15} />
                        <span>{course?.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground font-normal">
                        <Icons.Star
                          size={13}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="font-medium text-foreground">
                          {course?.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-xs">
                          ({course?.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-0 pb-4">
                    <Button
                      className="w-full cursor-pointer text-sm font-semibold"
                      onClick={() =>
                        !isEnrolled
                          ? handleEnroll(course?._id)
                          : handleContinueLearning(course?._id)
                      }
                    >
                      {isEnrolled ? "Continue Learning" : "Enroll Now"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          : Array.from({ length: 6 }).map((_, i) => <CourseSkeleton key={i} />)}
      </div>

      {/* Pagination */}
      {isShow && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8">
          <p className="text-sm text-muted-foreground">
            {paginationData
              ? `Showing ${limit * paginationData?.currentPage - limit + 1}–${Math.min(limit * paginationData?.currentPage, paginationData?.totalCourses)} of ${paginationData?.totalCourses} courses`
              : "Loading..."}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg border bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => setCurPage(curPage - 1)}
              disabled={curPage === 1}
            >
              <ArrowLeft size={18} />
            </button>
            <span className="px-3 py-1 rounded-lg border bg-primary text-primary-foreground text-sm font-semibold min-w-8 text-center">
              {curPage}
            </span>
            <button
              className="p-2 rounded-lg border bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => setCurPage(curPage + 1)}
              disabled={curPage === paginationData?.totalPages}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

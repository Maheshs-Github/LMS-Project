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
import Friern from "../../assets/FrierenSama.jpg";
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
import {
  ArrowLeft,
  ArrowLeftSquare,
  ArrowRight,
  ArrowRightSquare,
} from "lucide-react";

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
    limit = 3;
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
  // useEffect(() => {
  //   console.log("courses: ", courses);
  // }, [courses]);
  // useEffect(()=>{
  //   refetch();
  // },[searchValue])

  const initials = (Name) => {
    return Name?.split(" ")
      ?.map((name) => name[0])
      ?.join("")
      ?.toUpperCase();
  };
  const handleEnroll = (id) => {
    navigate(user ? `/student/course/${id}` : `course/${id}`);
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
    // setSearch(e.target.value);
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSearch = () => {
    // setSearchValue(search);
    // setCategoryValue(category);
    // setSortValue(sort);

    setAppliedFilters(filters);
  };
  const handleReset = () => {
    setFilters({
      search: "",
      category: "",
      sort: "",
    });

    setAppliedFilters({
      search: "",
      category: "",
      sort: "",
    });
  };
  const paginationData = data?.data?.pagination;

    const handleExplore=()=>{
    navigate("/courses")
  }

  return (
    <div className="p-8">
      <div className="flex justify-between gap-4">
      <h3 className="w-full text-center font-bold text-3xl mb-6">Courses</h3>
      <button className="bg-black text-white font-semibold py-2 h-fit px-4 rounded-lg whitespace-nowrap cursor-pointer" onClick={handleExplore}>View All</button>
      </div>

      {isShow && (
        <div className="grid grid-cols-12 gap-2 w-full my-6">
          <div className="relative sm:col-span-6 col-span-12">
            <Icons.Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className=" p-4 pl-10"
              placeholder="Search courses..."
              onChange={handleChnage}
              value={filters.search}
              name="search"
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
                <SelectItem value="All">All</SelectItem>
                {courseCategories.map((cate) => (
                  <SelectItem value={cate.value} key={cate.value}>
                    {cate.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.sort}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, sort: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>

                <SelectItem value="price-low">Price Low → High</SelectItem>

                <SelectItem value="price-high">Price High → Low</SelectItem>

                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            className="p-1 bg-black text-white font-semibold cursor-pointer  rounded-xl sm:col-span-1 col-span-12"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="p-1 bg-red-700 text-white font-semibold cursor-pointer  rounded-xl sm:col-span-1 col-span-12"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-10">
        {!loading
          ? courses?.map((course, index) => {
              const isEnrolled = course?.enrolledStudents?.some(
                (student) => student === user?._id,
              );
              return (
                <Card
                  className="relative mx-auto w-full max-w-sm pt-0 col-span-1"
                  key={index}
                >
                  <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                  <img
                    src={course?.img ? course.img : undefined}
                    alt="Event cover"
                    className="relative z-20 aspect-video w-full object-cover  dark:brightness-40"
                  />
                  <CardHeader className={"flex flex-col gap-2"}>
                    <CardTitle
                      className={"text-lg truncate font-semibold w-[96%]"}
                    >
                      {course?.name}
                    </CardTitle>
                    <div className="flex gap-0.5 justify-between w-full items-center">
                      <div className="flex gap-2 items-center">
                        {course?.instructorImg ? (
                          <img
                            src={course?.instructorImg ?? ""}
                            className="rounded-full w-8 h-8 "
                            alt=""
                          />
                        ) : (
                          <div className="rounded-full w-8 h-8 flex justify-center gap-1 items-center bg-amber-600 text-white font-semibold">
                            {initials(course?.instructorName)}
                          </div>
                        )}
                        <h4 className="font-medium text-base capitalize">
                          {course?.instructorName}
                        </h4>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${levelStyles[course?.level]} p-3 text-sm `}
                      >
                        {course?.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 font-semibold">
                      <div className="flex items-center gap-1 text-lg">
                        <Icons.Rupee size={18} />
                        {course?.price}
                      </div>

                      <div className="flex items-center gap-1">
                        <Icons.Star
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span>
                          {course?.averageRating?.toFixed(1) || "0.0"}
                        </span>

                        <span className="text-muted-foreground text-sm">
                          ({course?.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>

                    <Button
                      className="w-full cursor-pointer"
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
          : Array.from({ length: 4 }).map((_, i) => <CourseSkeleton key={i} />)}
      </div>
      {isShow && (
        <div className="flex justify-end items-center gap-3 my-6 ">
          <div>
            <div className="flex items-center gap-4 my-3">
              <button
                className={`bg-black text-white font-semibold p-2 rounded-xl cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed`}
                onClick={() => setCurPage(curPage - 1)}
                disabled={curPage == 1}
              >
                <ArrowLeft />
              </button>
              <p className="text-xl">{curPage}</p>
              <button
                className={`bg-black text-white font-semibold p-2 rounded-xl cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed`}
                onClick={() => setCurPage(curPage + 1)}
                disabled={curPage == paginationData?.totalPages}
              >
                <ArrowRight />
              </button>
            </div>
            <p>{`Showing ${limit * paginationData?.currentPage - limit + 1} - ${limit * paginationData?.currentPage} out of total ${paginationData?.totalCourses} Courses`}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

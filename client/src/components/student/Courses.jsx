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
import { useNavigate } from "react-router-dom";
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

const CourseData = [
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
  {
    coverImg: Friern,
    courseTitle: "Design systems meetup meetup meetup meetupmeetup",
    courseProviderImg: Friern,
    courseProviderName: "Friern Sama",
    coursePrize: 700,
  },
];

const Courses = () => {
  const [search,setSearch]=useState("");
  const [searchValue,setSearchValue]=useState("");
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
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const page=1,limit=2;
  const { loading, data,refetch } = useGet(`course?searchValue=${searchValue}&sortBy=${sort}&category=${category}&page=${page}&limit=${limit}`);
  useEffect(() => {
    console.log("Data: ", data);
    const formattedData = (data?.data || [])?.map((data) => ({
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
  useEffect(() => {
    console.log("courses: ", courses);
  }, [courses]);
  useEffect(()=>{
    refetch();
  },[searchValue])

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
    console.log("courseId in My Learn: ", courseId);
    navigate(`/student/learn/${courseId}`);
  };

  const levelStyles = {
    Beginner: "bg-green-100 text-green-700 border border-green-200",
    Moderate: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Advance: "bg-red-100 text-red-700 border border-red-200",
  };

  const handleSearchChnage=(e)=>{
    setSearch(e.target.value);
  }
  const handleSearch=()=>{
    setSearchValue(search);
  }
  return (
    <div className="p-8">
      <h3 className="w-full text-center font-bold text-3xl mb-6">
        Our Courses
      </h3>

      <div className="relative ">
        <Icons.Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className=" p-4 pl-10" placeholder="Search courses..." onChange={handleSearchChnage} value={search}/>
      </div>
      <div className="flex gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {courseCategories.map((cate) => (
              <SelectItem value={cate.value}>{cate.label}</SelectItem>
            ))}
            {/* <SelectItem value="Web Development">Web Development</SelectItem>
          <SelectItem value="AI">AI</SelectItem> */}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
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
                  {/* {console.log("course: ",course)} */}
                  <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                  <img
                    src={course?.img}
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
                        {/* {console.log("course?.level: ",course?.level)} */}
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
                    {/* {console.log("id: ", course?._id)} */}

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
    </div>
  );
};

export default Courses;

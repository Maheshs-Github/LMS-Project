import { IndianRupee, Info, Play, PlayCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import video from "../../assets/video/file_example_MP4_480_1_5MG.mp4";
import { useGet } from "@/hooks/useGet";
import parse from "html-react-parser"
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const {id} =useParams();
  const { data, refetch } = useGet(id?`course/${id}`:null);

  const [courseData, setCourseData] = useState({
    title: "",
    subTitle: "",
    category: "",
    createdAt: "",
    description: "",
    price: "",
    thumbnail: "",
    level: "",
    updatedAt: "",
    lectures: "",
    instructor: "",
  });

  useEffect(() => {
    console.log("data: ", data);
    setCourseData({
      title: data?.data?.title ?? "",
      subTitle: data?.data?.subTitle ?? "",
      category: data?.data?.category ?? "",
      createdAt: data?.data?.createdAt ?? "",
      description: data?.data?.description ?? "",
      price: data?.data?.price ?? "",
      thumbnail: data?.data?.thumbnail ?? "",
      level: data?.data?.level ?? "",
      updatedAt: data?.data?.updatedAt ?? "",
      lectures: data?.data?.lectures ?? "",
      instructor: data?.data?.instructor ?? "",
    });
  }, [data]);
  return (
    <div className="">
      <div className="bg-black text-white px-4 py-10 rounded flex flex-col gap-2">
        <h1 className="text-2xl font-semibold ">{courseData.title}</h1>
        <h3 className="text-lg">{courseData.subTitle}</h3>
        <h3>
          Created By -{" "}
          <span className="text-purple-400 font-semibold underline">
            {courseData.instructor}
          </span>
        </h3>
        <div className="flex gap-1 items-center italic">
          <Info className="font-bold" size={16} strokeWidth={3} />{" "}
          <span className="text-sm">Last Updated On -</span>{" "}
          <span className="text-sm">
            {new Date(courseData.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <h4>Students Enrolled: 1 </h4>
      </div>
      <div className="grid grid-cols-2 px-4 py-10 gap-20">
        <div className="col-span-1">
          <div className=" ">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <div>
              {parse(courseData?.description)}
            </div>
          </div>
          <div className="border px-4 py-4 mt-5 rounded ">
            <h2 className="text-xl font-semibold mb-3">Course Content</h2>
            {(courseData?.lectures|| [])?.map((lecture,data)=>(
              <div className="flex items-center gap-1 my-2" key={data}>
                {/* {console.log("lect: "+lecture.title)} */}
              <PlayCircleIcon className="" strokeWidth={3} size={18} />{" "}
              <span className="text-lg">{lecture?.title}</span>
            </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 border p-2 rounded">
          <video src={video} muted autoPlay controls></video>
          <h2 className="font-semibold text-lg my-3">
            Introduction to Next.js
          </h2>
          <hr className="font-semibold  text-black" />
          <div className="flex font-semibold items-center my-3">
            <h2 className="font-semibold text-2xl">{courseData.price} </h2>
            <IndianRupee size={16} strokeWidth={3} />
          </div>
          <button className="rounded bg-green-600 hover:bg-green-700 text-white py-2 px-6 cursor-pointer flex items-center justify-center w-full">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

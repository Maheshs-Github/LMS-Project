import { IndianRupee, Info, Play, PlayCircleIcon } from "lucide-react";
import React from "react";
import video from "../../assets/video/file_example_MP4_480_1_5MG.mp4";

const CourseDetails = () => {
  return (
    <div className="">
      <div className="bg-black text-white px-4 py-10 rounded flex flex-col gap-2">
        <h1 className="text-2xl font-semibold ">
          Mastering Next.js: Full Stack Web Developemnet
        </h1>
        <h3 className="text-lg">SubTitle of the courese</h3>
        <h3>
          Created By -{" "}
          <span className="text-purple-400 font-semibold underline">
            Mahesh Mane
          </span>
        </h3>
        <div className="flex gap-1 items-center italic">
          <Info className="font-bold" size={16} strokeWidth={3}/>{" "}
          <span className="text-sm">Last Updated On -</span>{" "}
          <span className="text-sm">2024-10-20</span>
        </div>
        <h4>Students Enrolled: 1 </h4>
      </div>
      <div className="grid grid-cols-2 px-4 py-10 gap-20">
        <div className="col-span-1">
          <div className=" ">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p>
              DescriptionDescription Description Description Description
              Description Description Description Description Description
              Description Description Description
            </p>
          </div>
          <div className="border px-4 py-4 mt-3 rounded ">
            <h2 className="text-xl font-semibold mb-3">Course Content</h2>
            <div className="flex items-center gap-1">
              <PlayCircleIcon className=""strokeWidth={2.5} size={16} />{" "}
              <span>Introduction to Next.js</span>
            </div>
          </div>
        </div>
        <div className="col-span-1 border p-2 rounded">
          <video src={video} muted autoPlay controls></video>
          <h2 className="font-semibold text-lg my-3">
            Introduction to Next.js
          </h2>
          <hr className="font-semibold  text-black" />
          <div className="flex font-semibold items-center my-3">
            <h2>
              239 {" "}
            </h2>
            <IndianRupee size={16} strokeWidth={3}/>
          </div>
          <button className="rounded bg-green-600 hover:bg-green-700 text-white py-2 px-6 cursor-pointer flex items-center justify-center w-full">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

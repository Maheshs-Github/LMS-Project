import { IndianRupee, Info, Play, PlayCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import video from "../../assets/video/file_example_MP4_480_1_5MG.mp4";
import { useGet } from "@/hooks/useGet";
import parse from "html-react-parser";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import Icons from "@/utils/Icons";
import loadRazorpay from "@/utils/loadRazorpay";

const CourseDetails = () => {
  const { id } = useParams();
  const { data, refetch } = useGet(id ? `course/${id}` : null);
  const user = useSelector((state) => state.auth.user);
  const { mutate } = useMutation();

  const [courseData, setCourseData] = useState({
    _id: "",
    title: "",
    subTitle: "",
    category: "",
    createdAt: "",
    description: "",
    price: "",
    thumbnail: "",
    level: "",
    updatedAt: "",
    lectures: [],
    instructor: "",
    enrolledStudents: [],
  });

  useEffect(() => {
    console.log("data: ", data);
    setCourseData({
      _id: data?.data?.fetchedCourse?._id ?? "",
      title: data?.data?.fetchedCourse?.title ?? "",
      subTitle: data?.data?.fetchedCourse?.subTitle ?? "",
      category: data?.data?.fetchedCourse?.category ?? "",
      createdAt: data?.data?.fetchedCourse?.createdAt ?? "",
      description: data?.data?.fetchedCourse?.description ?? "",
      price: data?.data?.fetchedCourse?.price ?? "",
      thumbnail: data?.data?.fetchedCourse?.thumbnail ?? "",
      level: data?.data?.fetchedCourse?.level ?? "",
      updatedAt: data?.data?.fetchedCourse?.updatedAt ?? "",
      lectures: data?.data?.fetchedCourse?.lectures ?? "",
      enrolledStudents: data?.data?.fetchedCourse?.enrolledStudents ?? "",
      instructor: data?.data?.fetchedCourse?.instructor ?? "",
    });
  }, [data]);

  const reviewCount = data?.data?.reviewCount;
  const courseAvgRating = data?.data?.courseAvgRating;

  const handleEnroll = async (cId) => {
    try {
      const res = await mutate({
        url: `course/${cId}`,
        method: "post",
        // body: { userId: user?._id },
      });
      console.log("res: ", res);
      toast.success(res?.message);
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.message);
    }
  };

const handleBuy = async (cId) => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    toast.error("Failed to load Razorpay");
    return;
  }

  try {
    const res = await mutate({
      url: "payment/create-order",
      body: { courseId: cId },
      method: "POST",
    });

    console.log(res);

    toast.success(res.message || "Order created successfully");

    const options = {
      key: res.data.key,
      amount: res.data.amount,
      currency: res.data.currency,
      order_id: res.data.orderId,

      name: "Infinity LMS",
      description: "Course Purchase",

      // Optional but recommended
      prefill: {
        name: user?.fullName,
        email: user?.email,
      },

      theme: {
        color: "#2563eb",
      },

      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled");
        },
      },

      handler: async function (response) {
        console.log("Payment Success");

        console.log(response);

        // We will call verify API here next
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();

  } catch (error) {
    console.log(error);

    toast.error(error.message || "Failed to create order");
  }
};
  return (
    <div className="">
      <div className="bg-black text-white px-4 py-10 rounded flex flex-col gap-2">
        <h1 className="text-2xl font-semibold ">{courseData.title}</h1>
        <h3 className="text-lg">{courseData.subTitle}</h3>
        <div className="flex items-center gap-1 text-sm">
          <Icons.Star size={16} className="fill-yellow-400 text-yellow-400" />

          <span className="font-semibold text-yellow-400">
            {courseAvgRating?.toFixed(1) || "0.0"}
          </span>

          <span className="text-gray-400">({reviewCount || 0} Reviews)</span>
        </div>
        <h3>
          Created By -{" "}
          <span className="text-purple-400 font-semibold underline capitalize">
            {courseData.instructor?.name}
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
        <h4>
          Students Enrolled: {courseData?.enrolledStudents?.length ?? "NA"}{" "}
        </h4>
      </div>
      <div className="grid grid-cols-2 px-4 py-10 gap-20">
        <div className="col-span-1">
          <div className=" ">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <div>{parse(courseData?.description)}</div>
          </div>
          <div className="border px-4 py-4 mt-5 rounded ">
            <h2 className="text-xl font-semibold mb-3">Course Content</h2>
            {(courseData?.lectures || [])?.map((lecture, data) => (
              <div className="flex items-center gap-1 my-2" key={data}>
                {/* {console.log("lect: "+lecture.title)} */}
                <PlayCircleIcon className="" strokeWidth={3} size={18} />{" "}
                <span className="text-lg">{lecture?.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 border p-2 rounded">
          <video
            src={courseData?.lectures[0]?.videoUrl}
            muted
            autoPlay
            controls
            className=" aspect-video p-8"
          ></video>
          <h2 className="font-semibold text-lg my-3">
            {courseData?.lectures[0]?.title}
          </h2>
          <hr className="font-semibold  text-black" />
          <div className="flex font-semibold items-center my-3">
            <h2 className="font-semibold text-2xl">{courseData.price} </h2>
            <IndianRupee size={16} strokeWidth={3} />
          </div>
          {/* <button
            className="rounded bg-green-600 hover:bg-green-700 text-white py-2 px-6 cursor-pointer flex items-center justify-center w-full"
            onClick={() => handleEnroll(courseData?._id)}
          >
            Enroll Now
          </button> */}
                    <button
            className="rounded bg-green-600 hover:bg-green-700 text-white py-2 px-6 cursor-pointer flex items-center justify-center w-full"
            onClick={() => handleBuy(courseData?._id)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

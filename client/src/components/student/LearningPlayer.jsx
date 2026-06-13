import { useGet } from "@/hooks/useGet";
import { PlayCircleIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import video from "../../assets/video/file_example_MP4_480_1_5MG.mp4";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";

const LearningPlayer = () => {
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const { courseId } = useParams();
  const isCompleteref = useRef();
  console.log("courseId: ", courseId);
  const { data } = useGet(`course/${courseId}/lectures`);
  const { data:lectureProgress, refetch } = useGet(`progress/${courseId}`);
  const { mutate } = useMutation();
  const [playingVideoData, setPlayingVideoData] = useState({
    _id: "",
    name: "",
    videoUrl: "",
  });
  useEffect(() => console.log("lectureProgress: ", lectureProgress), [lectureProgress]);
  const handleVideoPlay = (lec) => {
    setPlayingVideoData({
      _id: lec?._id,
      name: lec?.title,
      videoUrl: lec?.videoUrl,
    });
  };
  // useEffect(
  //   () => console.log("playingVieo: HERE", playingVideoData),
  //   [playingVideoData],
  // );

  useEffect(()=>{

  })
  useEffect(() => {
    if (data?.data?.lectures?.length > 0 && !playingVideoData.videoUrl) {
      setPlayingVideoData({
        _id: data.data.lectures[0]._id,
        name: data.data.lectures[0].title,
        videoUrl: data.data.lectures[0].videoUrl,
      });
    }
  }, [data, playingVideoData.videoUrl]);

  useEffect(() => {
    isCompleteref.current = false;
  }, [playingVideoData]);

  // useEffect(async () => {
  //   const res = await mutate({
  //     url: "progress/6a1a7630f91aba30565481b8/6a2b77c72e14d13ee194bdad",
  //     method: "post",
  //   });
  //   console.log("res: ", res);
  // }, []);

  const handleVideoComplete = async (e) => {
    if (isCompleteref.current) return;
    try {
      // console.log(
      //   "Time: ",
      //   e.target.currentTime,
      //   " Duration: ",
      //   e.target.duration,
      // );
      const video = e.target;
      const videoWatchedPercn = (video.currentTime / video.duration) * 100;
      if (videoWatchedPercn >= 90) {
        isCompleteref.current = true;
        console.log("Course:", data?.data?._id);
        console.log("Lecture:", playingVideoData?._id);
        const res = await mutate({
          url: `progress/${data?.data?._id}/${playingVideoData?._id}`,
          method: "post",
        });
        toast.success(res.message || "Set as Watched");
      }
    } catch (error) {
      toast.error(error.message || "Could able to set as Read");
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl  font-semibold">Learning Player</h1>
      <h2 className="text-lg text-center w-full font-semibold">
        {data?.data?.title}
      </h2>
      {data?.data?.lectures.length ? (
        <div className="grid grid-cols-12 p-5 border rounded-l-2xl mt-2">
          <div className="col-span-4">
            {(data?.data?.lectures || [])?.map((lec) => (
              <button
                className={`flex items-center rounded-md cursor-pointer my-2 border-2 p-2 w-full gap-1 ${playingVideoData.videoUrl === lec?.videoUrl ? "bg-gray-400" : ""}`}
                key={lec?._id}
                onClick={() => handleVideoPlay(lec)}
              >
                {console.log("lect: ", lec)}
                <PlayCircleIcon className="" strokeWidth={3} size={18} />{" "}
                <span className="text-lg">{lec?.title}</span>
              </button>
            ))}
          </div>
          <div className="col-span-8 ">
            <h2 className={`text-xl font-semibold flex justify-center `}>
              {playingVideoData?.name}
            </h2>
            {playingVideoData?.videoUrl && (
              <video
                src={playingVideoData?.videoUrl ?? undefined}
                muted
                autoPlay
                controls
                className="justify-center items-center w-full flex aspect-video p-8 rounded-2xl"
                // onTimeUpdate={handleVideoComplete}
                onTimeUpdate={
                  !isVideoCompleted ? handleVideoComplete : undefined
                }
              ></video>
            )}
          </div>
        </div>
      ) : (                  
        <div className="flex justify-center w-full text-2xl font-semibold mt-10">
          No lectures available yet.
        </div>
      )}
    </div>
  );
};

export default LearningPlayer;

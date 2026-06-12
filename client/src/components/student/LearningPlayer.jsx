import { useGet } from "@/hooks/useGet";
import { PlayCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import video from "../../assets/video/file_example_MP4_480_1_5MG.mp4";

const LearningPlayer = () => {
  const { id } = useParams();
  console.log("id: ", id);
  const { data } = useGet(`course/${id}/lectures`);
  const [playingVideoData,setPlayingVideoData]=useState({
    name: "",
    videoUrl: "",
  });
  useEffect(() => console.log("data: ", data), [data]);
  const handleVideoPlay=(lec)=>{
    setPlayingVideoData({name:lec?.title,videoUrl:lec?.videoUrl})
  }
  useEffect(()=>console.log("playingVieo: ",playingVideoData),[playingVideoData])
  useEffect(() => {
  if (data?.data?.lectures?.length >0 && !playingVideoData.videoUrl) {
    setPlayingVideoData({
      name: data.data.lectures[0].title,
      videoUrl: data.data.lectures[0].videoUrl,
    });
  }
}, [data]);

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl  font-semibold">Learning Player</h1>
      <h2 className="text-lg text-center w-full font-semibold">
        {data?.data?.title}
      </h2>
      <div className="grid grid-cols-12 p-5 border rounded-l-2xl mt-2">
        <div className="col-span-4">
          {(data?.data?.lectures || [])?.map((lec) => (
            <button
              className="flex items-center rounded-md cursor-pointer my-2 border-2 p-2 w-full gap-1"
              key={lec?._id}
              onClick={()=>handleVideoPlay(lec)}
            >
              {/* {console.log("lect: "+lecture.title)} */}
              <PlayCircleIcon className="" strokeWidth={3} size={18} />{" "}
              <span className="text-lg">{lec?.title}</span>
            </button>
          ))}
        </div>
        <div className="col-span-8 ">
          <h2 className="text-xl font-semibold flex justify-center">{playingVideoData?.name}</h2>
          <video
            src={playingVideoData?.videoUrl}
            muted
            autoPlay
            controls
            className="justify-center items-center w-full flex p-8 rounded-2xl"
          ></video>
        </div>
      </div>
    </div>
  );
};

export default LearningPlayer;

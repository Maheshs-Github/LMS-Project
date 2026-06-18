import { useGet } from "@/hooks/useGet";
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  Play,
  PlayCircle,
  PlayCircleIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import video from "../../assets/video/file_example_MP4_480_1_5MG.mp4";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Icons from "@/utils/Icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const ReviewModel = () => {
  const [openReviewPopUp, setOpenReviewPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { courseId } = useParams();

  const { mutate } = useMutation();

  const handleSave = async () => {
    console.log("review: ", review, " Rating: ", rating);
    try {
      const res = await mutate({
        url: `reviewAndRating/${courseId}`,
        method: "post",
        body: { review, rating },
      });
      console.log("res: ", res);
      toast.success(res.message || "review has been added successfully");
      setRating(0);
    setReview("");
    setOpenReviewPopup(false);
  } catch (error) {
      console.log("error: ", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="border rounded-xl p-3 m-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">MERN Stack Development</h2>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icons.Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <span className="font-medium">4.6</span>

              <span className="text-muted-foreground">(128 Reviews)</span>
            </div>
          </div>

          <Button
            className="h-10 px-5 cursor-pointer"
            onClick={() => setOpenReviewPopup(true)}
          >
            Write Review
          </Button>
        </div>
      </div>

      <Dialog open={openReviewPopUp} onOpenChange={setOpenReviewPopup}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rate this Course</DialogTitle>

            <DialogDescription>
              Share your experience with other students.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-2 py-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icons.Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition-all hover:scale-110 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-300"
                  }`}
                />
              ))}
            </div>

            {rating > 0 && (
              <span className="text-sm text-muted-foreground">
                You rated this course {rating} / 5
              </span>
            )}
          </div>

          <Textarea
            dir="ltr"
            placeholder="Tell others what you liked or disliked about this course..."
            className="min-h-28 text-left"
            value={review}
            onChange={(event) => setReview(event.target.value)}
          />

          <Button
            type="button"
            className="w-full cursor-pointer"
            disabled={!rating}
            onClick={handleSave}
          >
            Submit Review
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LearningPlayer = () => {
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const { courseId } = useParams();
  const isCompleteref = useRef();
  console.log("courseId: ", courseId);
  const { data, refetch } = useGet(`course/${courseId}/lectures`);
  const { data: lectureProgress, refetch: refetchprogress } = useGet(
    `progress/${courseId}`,
  );
  const { mutate } = useMutation();
  const [playingVideoData, setPlayingVideoData] = useState({
    _id: "",
    name: "",
    videoUrl: "",
  });

  const lecture = data?.data?.course;
  const lectures = lecture?.lectures || [];
  const lectureCount = data?.data?.course?.lectureCount || lectures.length;
  const lectureProgressData = lectureProgress?.data;
  const completedLecturesCount =
    lectureProgressData?.lecturesCompleted?.length ?? 0;
  const progressPercentage = lectureCount
    ? Math.round((completedLecturesCount / lectureCount) * 100)
    : 0;
  const reviewUrl =
    progressPercentage === 100 ? `reviewAndRating/${courseId}` : null;
  const { data: reviewData } = useGet(reviewUrl);
  useEffect(
    () => console.log("lectureProgress: ", lectureProgress),
    [lectureProgress],
  );
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

  // useEffect(() => {});
  useEffect(() => {
    const isNotContain = lectures?.find(
      (lecData) =>
        !lectureProgressData?.lecturesCompleted.includes(lecData?._id),
    );
    console.log("isNotContain: ", isNotContain);
    if (lectures.length > 0 && !playingVideoData.videoUrl) {
      if (isNotContain) {
        setPlayingVideoData({
          _id: isNotContain?._id,
          name: isNotContain?.title,
          videoUrl: isNotContain?.videoUrl,
        });
      } else {
        setPlayingVideoData({
          _id: lectures[0]._id,
          name: lectures[0].title,
          videoUrl: lectures[0].videoUrl,
        });
      }
    }
  }, [data, playingVideoData.videoUrl]);

  // useEffect(() => {
  //   const isAlllecComplete = lectureCount === completedLecturesCount;
  //   if (isAlllecComplete)
  //     toast.success("🎉 Congratulations! You've completed this course.");
  // }, []);

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
        console.log("Course:", lecture?._id);
        console.log("Lecture:", playingVideoData?._id);
        const res = await mutate({
          url: `progress/${lecture?._id}/${playingVideoData?._id}`,
          method: "post",
        });
        toast.success(res.message || "Set as Watched");
        refetch();
        refetchprogress();
      }
    } catch (error) {
      toast.error(error.message || "Could able to set as Read");
    }
  };

  useEffect(() => {
    console.log("reviewData: ", reviewData);
  }, [reviewData]);

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl  font-semibold">Learning Player</h1>
      <h2 className="text-lg text-center w-full font-semibold my-4">
        {lecture?.title}
      </h2>
      <div className="mb-6 border rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Course Progress</h2>

        <div className="flex justify-between text-sm font-medium mb-2">
          <span>
            {completedLecturesCount ?? 0} / {lectureCount} Lectures Completed
          </span>
          <span>{progressPercentage ?? 0}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">
              {completedLecturesCount ?? 0}
            </p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          <div className="border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">
              {lectureCount - (completedLecturesCount ?? 0) ?? 0}
            </p>
            <p className="text-sm text-gray-500">Remaining</p>
          </div>

          <div className="border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{lectureCount}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>

        {progressPercentage === 100 && (
          <div className="mt-4 rounded-lg bg-green-100 border border-green-300 p-3 text-center">
            🎉 Congratulations! You have completed this course.
          </div>
        )}

        <ReviewModel />
      </div>
      {lectures.length ? (
        <div className="grid grid-cols-12 p-5 border rounded-l-2xl mt-2">
          {/* <div className="col-span-4">
            {(data?.data?.lectures || [])?.map((lec) => (
              <button
                className={`flex items-center rounded-md cursor-pointer my-2 border-2 p-2 w-full gap-1 ${playingVideoData.videoUrl === lec?.videoUrl ? "bg-gray-400" : ""}`}
                key={lec?._id}
                onClick={() => handleVideoPlay(lec)}
              >
              {lectureProgress?.data?.lecturesCompleted.includes(lec?._id)?<Ticket />:< Circle />}
                {console.log("lect: ", lec)}
                <PlayCircleIcon className="" strokeWidth={3} size={18} />{" "}
                <span className="text-lg">{lec?.title}</span>
              </button>
            ))}
          </div> */}

          <div className="col-span-4 border-r pr-4">
            {lectures.map((lec) => {
              const isCompleted =
                lectureProgressData?.lecturesCompleted?.includes(lec?._id);

              const isCurrent = playingVideoData?._id === lec?._id;

              return (
                <button
                  key={lec?._id}
                  onClick={() => handleVideoPlay(lec)}
                  className={`w-full flex items-center gap-3 p-3 my-2 rounded-lg border transition-all duration-200 text-left
                  ${
                    isCurrent
                      ? "bg-blue-100 border-blue-500 shadow-sm"
                      : "hover:bg-gray-100"
                  }
                `}
                >
                  <div>
                    {isCurrent ? (
                      <Play size={18} className="text-orange-400" />
                    ) : isCompleted ? (
                      <CheckCircle2 size={18} className="text-green-600" />
                    ) : (
                      <CircleDashed size={18} className="text-gray-400" />
                    )}
                  </div>

                  <PlayCircleIcon
                    size={18}
                    className={isCurrent ? "text-blue-600" : "text-gray-500"}
                  />

                  <div className="flex flex-col overflow-hidden">
                    <span
                      className={`truncate font-medium ${
                        isCurrent ? "text-blue-700" : ""
                      }`}
                    >
                      {lec?.title}
                    </span>

                    {isCompleted && (
                      <span className="text-xs text-green-600">Completed</span>
                    )}
                  </div>
                </button>
              );
            })}
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

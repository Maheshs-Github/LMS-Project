import { useGet } from "@/hooks/useGet";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icons from "@/utils/Icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import BASE_URL from "@/utils/BASE_URL";

const ReviewModel = ({ userReview }) => {
  const [openReviewPopUp, setOpenReviewPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { courseId } = useParams();

  const { mutate } = useMutation();

  const handleSave = async () => {
    try {
      const res = await mutate({
        url: `reviewAndRating/${courseId}`,
        method: "post",
        body: { review, rating },
      });
      toast.success(res?.message || "Review added successfully");
      setRating(0);
      setReview("");
      setOpenReviewPopup(false);
    } catch (error) {
      toast.error(error?.message || "Failed to submit review");
    }
  };

  useEffect(() => {
    if (userReview) {
      setRating(userReview?.rating || 0);
      setReview(userReview?.review || "");
    }
  }, [userReview]);

  const timestamp = new Date(userReview?.createdAt).getTime();
  const days = Number.isNaN(timestamp)
    ? null
    : Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));

  return (
    <>
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {userReview?.review ? "Your Course Review" : "Course Feedback & Rating"}
            </h3>
            {userReview?.review ? (
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icons.Star
                        key={star}
                        size={15}
                        className={
                          star <= (userReview?.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/30"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {userReview?.rating} / 5
                  </span>
                  {days !== null && (
                    <span className="text-xs text-muted-foreground">
                      • {days === 0 ? "Today" : `${days}d ago`}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  "{userReview?.review}"
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-0.5">
                Share your rating and feedback to help others and support the instructor.
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer shrink-0"
            onClick={() => setOpenReviewPopup(true)}
          >
            <Icons.Star className="w-3.5 h-3.5 mr-1.5 text-amber-400 fill-amber-400" />
            {userReview?.review ? "Edit Review" : "Write Review"}
          </Button>
        </div>
      </div>

      <Dialog open={openReviewPopUp} onOpenChange={setOpenReviewPopup}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rate & Review this Course</DialogTitle>
            <DialogDescription>
              Share your thoughts and feedback with the instructor and community.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-2 py-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icons.Star
                  key={star}
                  size={28}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition-transform hover:scale-125 ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30 hover:text-amber-300"
                  }`}
                />
              ))}
            </div>

            {rating > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                You rated this course {rating} of 5 stars
              </span>
            )}
          </div>

          <Textarea
            dir="ltr"
            placeholder="Tell us what you loved or how this course can be improved..."
            className="min-h-28 text-sm"
            value={review}
            onChange={(event) => setReview(event.target.value)}
          />

          <Button
            type="button"
            className="w-full cursor-pointer mt-2"
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
  const [userReview, setUserReview] = useState({});
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isCompleteref = useRef(false);

  const { data, refetch } = useGet(`course/${courseId}/lectures`);
  const { data: lectureProgress, refetch: refetchprogress } = useGet(
    `progress/${courseId}`
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

  useEffect(() => {
    if (reviewData?.data) {
      setUserReview(reviewData.data);
    }
  }, [reviewData]);

  const handleVideoPlay = (lec) => {
    setPlayingVideoData({
      _id: lec?._id,
      name: lec?.title,
      videoUrl: lec?.videoUrl,
    });
  };

  useEffect(() => {
    const isNotContain = lectures?.find(
      (lecData) =>
        !lectureProgressData?.lecturesCompleted?.includes(lecData?._id)
    );
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
  }, [data, playingVideoData.videoUrl, lectures, lectureProgressData]);

  useEffect(() => {
    isCompleteref.current = false;
  }, [playingVideoData]);

  const handleVideoComplete = async (e) => {
    if (isCompleteref.current) return;
    try {
      const videoEl = e.target;
      if (!videoEl || !videoEl.duration) return;
      const videoWatchedPercn = (videoEl.currentTime / videoEl.duration) * 100;
      if (videoWatchedPercn >= 90) {
        isCompleteref.current = true;
        const res = await mutate({
          url: `progress/${lecture?._id}/${playingVideoData?._id}`,
          method: "post",
        });
        toast.success(res?.message || "Lecture completed!");
        refetch();
        refetchprogress();
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save lecture progress");
    }
  };

  const handleCertificateDownload = async () => {
    try {
      const response = await axios.get(`${BASE_URL}certificate/${courseId}`, {
        responseType: "blob",
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `Certificate-${courseId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      toast.error("Unable to download certificate.");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <Icons.ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground line-clamp-1">
              {lecture?.title || "Course Player"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Interactive Learning & Video Lectures
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/student/discuss/${courseId}`, {
              state: {
                courseName: lecture?.title,
                coureStudetsCount: lecture?.enrolledStudents?.length || 0,
              },
            })
          }
          className="self-start sm:self-auto cursor-pointer"
        >
          <Icons.MessageSquare className="w-4 h-4 mr-1.5" />
          Course Discussion
        </Button>
      </div>

      {/* Progress & Stats Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground">Course Completion Progress</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedLecturesCount} of {lectureCount} lectures completed
            </p>
          </div>
          <Badge
            variant={progressPercentage === 100 ? "default" : "secondary"}
            className="self-start sm:self-auto font-bold text-xs px-3 py-1"
          >
            {progressPercentage}% Complete
          </Badge>
        </div>

        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-border/50 bg-background/50 p-3 text-center">
            <p className="text-lg md:text-2xl font-extrabold text-emerald-500">
              {completedLecturesCount}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/50 p-3 text-center">
            <p className="text-lg md:text-2xl font-extrabold text-amber-500">
              {Math.max(0, lectureCount - completedLecturesCount)}
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/50 p-3 text-center">
            <p className="text-lg md:text-2xl font-extrabold text-foreground">
              {lectureCount}
            </p>
            <p className="text-xs text-muted-foreground">Total Lectures</p>
          </div>
        </div>

        {/* Certificate banner */}
        {progressPercentage === 100 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Icons.Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Course Completed! 🎉</h4>
                <p className="text-xs text-muted-foreground">
                  You've completed all lectures. Download your certificate of completion.
                </p>
              </div>
            </div>
            <Button
              className="w-full sm:w-auto cursor-pointer shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={handleCertificateDownload}
            >
              <Icons.Download className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        )}

        <ReviewModel userReview={userReview} />
      </div>

      {/* Video Player & Playlist Layout */}
      {lectures.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Video Viewport */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-border/60 shadow-md">
              {playingVideoData?.videoUrl ? (
                <video
                  key={playingVideoData.videoUrl}
                  src={playingVideoData.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  onTimeUpdate={!isVideoCompleted ? handleVideoComplete : undefined}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                  <Icons.PlayCircle className="w-16 h-16 mb-2 opacity-50" />
                  <p className="text-sm">Select a lecture from the playlist to begin playback</p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Icons.Play className="w-3.5 h-3.5 fill-current" />
                Now Playing
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {playingVideoData?.name || "Select a lecture"}
              </h2>
            </div>
          </div>

          {/* Lecture Playlist Column */}
          <div className="lg:col-span-4 rounded-2xl border border-border/60 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Icons.Layers className="w-4 h-4 text-primary" />
                Course Content
              </h3>
              <span className="text-xs text-muted-foreground">
                {completedLecturesCount}/{lectures.length} done
              </span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {lectures.map((lec, idx) => {
                const isCompleted =
                  lectureProgressData?.lecturesCompleted?.includes(lec?._id);
                const isCurrent = playingVideoData?._id === lec?._id;

                return (
                  <button
                    key={lec?._id || idx}
                    onClick={() => handleVideoPlay(lec)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs"
                        : "border-border/40 hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="shrink-0">
                      {isCompleted ? (
                        <Icons.CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : isCurrent ? (
                        <Icons.Play className="w-4 h-4 text-primary fill-current" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate leading-tight">
                        {lec?.title}
                      </p>
                      {lec?.duration && (
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                          {lec.duration}
                        </span>
                      )}
                    </div>

                    {isCompleted && (
                      <span className="text-[10px] font-semibold text-emerald-500 shrink-0">
                        Watched
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-border bg-card/40">
          <Icons.Video className="w-12 h-12 text-muted-foreground/60 mb-2" />
          <h3 className="text-lg font-semibold text-foreground">No lectures available</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The instructor has not uploaded any video lectures to this course yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default LearningPlayer;

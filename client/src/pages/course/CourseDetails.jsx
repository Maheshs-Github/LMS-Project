import React, { useEffect, useState } from "react";
import { useGet } from "@/hooks/useGet";
import parse from "html-react-parser";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import Icons from "@/utils/Icons";
import loadRazorpay from "@/utils/loadRazorpay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useGet(id ? `course/${id}` : null);
  const user = useSelector((state) => state.auth.user);
  const { mutate, loading: buyingLoading } = useMutation();

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
    instructor: null,
    enrolledStudents: [],
  });

  useEffect(() => {
    if (data?.data?.fetchedCourse) {
      const c = data.data.fetchedCourse;
      setCourseData({
        _id: c._id ?? "",
        title: c.title ?? "",
        subTitle: c.subTitle ?? "",
        category: c.category ?? "",
        createdAt: c.createdAt ?? "",
        description: c.description ?? "",
        price: c.price ?? "",
        thumbnail: c.thumbnail ?? "",
        level: c.level ?? "",
        updatedAt: c.updatedAt ?? "",
        lectures: c.lectures ?? [],
        enrolledStudents: c.enrolledStudents ?? [],
        instructor: c.instructor ?? null,
      });
    }
  }, [data]);

  const reviewCount = data?.data?.reviewCount ?? 0;
  const courseAvgRating = data?.data?.courseAvgRating ?? 0;

  const handleBuy = async (cId) => {
    if (!user) {
      toast.error("Please login to purchase courses");
      navigate("/auth");
      return;
    }

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK");
      return;
    }

    try {
      const res = await mutate({
        url: "payment/create-order",
        body: { courseId: cId },
        method: "POST",
      });

      toast.success(res.message || "Order created successfully");

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        order_id: res.data.orderId,
        name: "Infinity LMS",
        description: "Course Purchase",
        prefill: {
          name: user?.name || "Student",
          email: user?.email,
        },
        theme: {
          color: "#2563eb",
        },
        handler: async function (response) {
          await handleVerifyPayment(response, cId);
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", async function (response) {
        try {
          await mutate({
            url: "payment/failure",
            method: "POST",
            body: {
              orderId: response.error.metadata.order_id,
              code: response.error.code,
              description: response.error.description,
              reason: response.error.reason,
              source: response.error.source,
              step: response.error.step,
            },
          });
          toast.error(response.error.description || "Payment Failed");
        } catch (error) {
          toast.error("Failed to record payment failure");
        }
      });

      paymentObject.open();
    } catch (error) {
      toast.error(error?.message || "Failed to create order");
    }
  };

  const handleVerifyPayment = async (response, cId) => {
    try {
      const verifyRes = await mutate({
        url: "payment/verify",
        method: "POST",
        body: {
          courseId: cId,
          ...response,
        },
      });

      toast.success(verifyRes?.message || "Payment verified successfully!");
      navigate("/student/my-learning");
    } catch (error) {
      toast.error(error?.message || "Payment verification failed");
    }
  };

  const lectures = Array.isArray(courseData?.lectures) ? courseData.lectures : [];
  const previewLecture = lectures[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Course Hero Header Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-slate-50 border-b border-slate-800 py-10 md:py-14">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/20" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {courseData.category && (
              <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">
                {courseData.category}
              </Badge>
            )}
            {courseData.level && (
              <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                {courseData.level}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
            {courseData.title || "Loading Course Details..."}
          </h1>

          {courseData.subTitle && (
            <p className="text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed">
              {courseData.subTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300 pt-2">
            {/* Rating */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              <Icons.Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-300">
                {courseAvgRating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-slate-400">({reviewCount} reviews)</span>
            </div>

            {/* Instructor */}
            {courseData.instructor?.name && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Instructor:</span>
                <span className="font-semibold text-white capitalize">
                  {courseData.instructor.name}
                </span>
              </div>
            )}

            {/* Students count */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Icons.Users className="w-4 h-4" />
              <span>{courseData?.enrolledStudents?.length || 0} students enrolled</span>
            </div>

            {/* Last updated */}
            {courseData.updatedAt && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Icons.Clock className="w-4 h-4" />
                <span>
                  Updated{" "}
                  {new Date(courseData.updatedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Icons.BookOpen className="w-5 h-5 text-primary" />
                About This Course
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm md:text-base leading-relaxed text-muted-foreground">
                {courseData.description ? (
                  typeof courseData.description === "string" &&
                  (courseData.description.includes("<") ? (
                    parse(courseData.description)
                  ) : (
                    <p className="whitespace-pre-line">{courseData.description}</p>
                  ))
                ) : (
                  <p className="italic text-muted-foreground">No description provided.</p>
                )}
              </div>
            </div>

            {/* Course Curriculum & Lectures */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Icons.Layers className="w-5 h-5 text-primary" />
                  Course Curriculum
                </h2>
                <span className="text-xs text-muted-foreground font-medium">
                  {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
                </span>
              </div>

              {lectures.length > 0 ? (
                <div className="space-y-2.5">
                  {lectures.map((lecture, idx) => (
                    <div
                      key={lecture._id || idx}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground truncate">
                          {lecture.title || "Untitled Lecture"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Icons.PlayCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Preview</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic py-4 text-center">
                  Lectures will be added soon by the instructor.
                </p>
              )}
            </div>
          </div>

          {/* Right / Pricing & Preview Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <Card className="overflow-hidden border border-border/60 shadow-lg bg-card">
              <div className="relative aspect-video w-full bg-black">
                {previewLecture?.videoUrl ? (
                  <video
                    src={previewLecture.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : courseData.thumbnail ? (
                  <img
                    src={courseData.thumbnail}
                    alt={courseData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
                    <Icons.Video className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs">Course Preview</span>
                  </div>
                )}
              </div>

              <CardContent className="p-6 space-y-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-foreground flex items-center">
                    <Icons.Rupee className="w-6 h-6 mr-0.5" />
                    {courseData.price || 0}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    One-time payment
                  </span>
                </div>

                <Button
                  className="w-full text-base font-bold py-6 cursor-pointer shadow-md"
                  onClick={() => handleBuy(courseData?._id)}
                  disabled={buyingLoading}
                >
                  <Icons.CreditCard className="w-5 h-5 mr-2" />
                  {buyingLoading ? "Processing..." : "Enroll & Buy Now"}
                </Button>

                <div className="space-y-2.5 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
                    This course includes:
                  </p>
                  <div className="flex items-center gap-2">
                    <Icons.Video className="w-4 h-4 text-primary shrink-0" />
                    <span>{lectures.length} on-demand video lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Award className="w-4 h-4 text-primary shrink-0" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.MessageSquare className="w-4 h-4 text-primary shrink-0" />
                    <span>Community & discussion forum access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>Full lifetime access</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

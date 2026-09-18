import { useGet } from "@/hooks/useGet";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import parse from "html-react-parser";
import { formatDate } from "@/utils/formatters";
import { useMutation } from "@/hooks/useMutation";
import { Textarea } from "../ui/textarea";
import Icons from "@/utils/Icons";
import toast from "react-hot-toast";

const AdminCourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location?.state?.id;

  const { data, loading, refetch } = useGet(courseId ? `admin/courses/${courseId}` : null);
  const { mutate } = useMutation();
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectPopOpen, setRejectPopOpen] = useState(false);

  const course = data?.data?.[0];
  const lectures = course?.lectures || [];

  const handleUpdateStatus = async (cId, status) => {
    if (status === "rejected" && !rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    const finalReason = rejectionReason.trim() ? rejectionReason : null;
    try {
      const res = await mutate({
        url: `admin/courses/${cId}`,
        body: { status, rejectedReason: finalReason },
        method: "patch",
      });
      toast.success(res?.message || "Course status updated successfully");
      setRejectPopOpen(false);
      setRejectionReason("");
      refetch();
    } catch (error) {
      toast.error(error?.message || "Error while updating status");
    }
  };

  const getStatusBadge = (status = "") => {
    const s = status.toLowerCase();
    switch (s) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 capitalize text-xs">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="capitalize text-xs">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 capitalize text-xs">
            Pending Approval
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="capitalize text-xs">
            {status || "Draft"}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center text-muted-foreground text-sm">
          Loading course details...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center space-y-4">
          <p className="text-base font-semibold text-foreground">Course not found</p>
          <Button onClick={() => navigate(-1)} className="cursor-pointer">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <Icons.ArrowLeft className="w-4 h-4 mr-1" />
            Courses
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Review Course
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inspect course curriculum, lecture contents, and moderate status
            </p>
          </div>
        </div>

        {getStatusBadge(course?.status)}
      </div>

      {/* Main Course Header Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start">
        {course?.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full md:w-52 aspect-video rounded-xl object-cover border border-border/60 shrink-0"
          />
        ) : (
          <div className="w-full md:w-52 aspect-video rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            <Icons.BookOpen className="w-8 h-8" />
          </div>
        )}

        <div className="space-y-2 min-w-0 flex-1">
          <h2 className="text-xl font-bold text-foreground capitalize">
            {course?.title || "Untitled Course"}
          </h2>
          {course?.subTitle && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.subTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2">
            <span>
              Instructor: <strong className="text-foreground capitalize">{course?.instructor?.name || "Unknown"}</strong>
            </span>
            <span>•</span>
            <span>
              Category: <strong className="text-foreground capitalize">{course?.category || "General"}</strong>
            </span>
            <span>•</span>
            <span>
              Level: <strong className="text-foreground">{course?.level || "Beginner"}</strong>
            </span>
            <span>•</span>
            <span>
              Price: <strong className="text-foreground font-bold">₹{course?.price ?? 0}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Icons.FileText className="w-4 h-4 text-primary" />
          Course Description
        </h3>
        <div className="text-sm text-muted-foreground leading-relaxed">
          {course?.description ? (
            typeof course.description === "string" && course.description.includes("<") ? (
              parse(course.description)
            ) : (
              <p className="whitespace-pre-line">{course.description}</p>
            )
          ) : (
            <p className="italic">No description provided.</p>
          )}
        </div>
      </div>

      {/* Lectures Content */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Icons.Video className="w-4 h-4 text-primary" />
            Curriculum & Lectures
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
          </span>
        </div>

        {lectures.length > 0 ? (
          <div className="space-y-2">
            {lectures.map((lecture, index) => (
              <div
                key={lecture?._id || index}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {lecture?.title || "Untitled Lecture"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                  {lecture?.videoUrl && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                      Video Available
                    </Badge>
                  )}
                  {lecture?.updatedAt && (
                    <span>{formatDate(lecture.updatedAt)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4 text-center">
            No lectures uploaded for this course yet.
          </p>
        )}
      </div>

      {/* Moderation Actions */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Course Moderation</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Approve course for public catalog or reject with feedback
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setRejectPopOpen(true)}
            className="cursor-pointer text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <Icons.Ban className="w-4 h-4 mr-1.5" />
            Reject Course
          </Button>

          <Button
            onClick={() => handleUpdateStatus(course?._id, "approved")}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Icons.Check className="w-4 h-4 mr-1.5" />
            Approve Course
          </Button>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectPopOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Rejection Reason</h3>
              <Icons.XIcon
                className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setRejectPopOpen(false)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Please provide feedback explaining why this course was rejected so the instructor can make revisions.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete curriculum or poor video audio quality..."
              rows={4}
              className="text-sm"
              required
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectPopOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleUpdateStatus(course?._id, "rejected")}
                className="cursor-pointer"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseDetails;

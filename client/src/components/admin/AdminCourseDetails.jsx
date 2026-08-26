import { useGet } from "@/hooks/useGet";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import { formatDate } from "@/utils/formatters";
import { useMutation } from "@/hooks/useMutation";
import { Textarea } from "../ui/textarea";
import Icons from "@/utils/Icons";
import toast from "react-hot-toast";

const AdminCourseDetails = () => {
  const location = useLocation();
  const courseId = location?.state?.id;
  console.log("courseId: ", courseId);

  const { data, loading, refetch } = useGet(`admin/courses/${courseId}`);
  const { mutate } = useMutation();
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectPopOpen, setRejectPopOpen] = useState(false);

  useEffect(() => console.log("data: ", data), [data]);

  const course = data?.data[0];

  const lectures = course?.lectures;
  console.log("lectures: ", lectures);

  const STATUS_STYLES = {
    draft: {
      bg: "bg-gray-100",
      text: "text-gray-700",
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
    },
    approved: {
      bg: "bg-green-100",
      text: "text-green-700",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
    },
  };

  const handleUpdateStatus = async (cId, status) => {
    if (status === "rejected" && !rejectionReason) {
      toast.error("Reject Reason is required for Reject action");
      return;
    }
    const finalReason = rejectionReason ? rejectionReason : null;
    try {
      const res = await mutate({
        url: `admin/courses/${cId}`,
        body: { status, rejectedReason: finalReason },
        method: "patch",
      });
      toast.success(
        res?.message || "Successfully updated the status of the course",
      );
      setRejectPopOpen(false);
      refetch();
    } catch (error) {
      toast.error(error?.message || "Error while updating the status");
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="flex items-start gap-4">
          <img
            src={course?.thumbnail}
            alt={course?.title}
            className="h-24 w-36 rounded-lg object-cover"
          />

          <div>
            <h2 className="text-xl font-semibold capitalize">
              {course?.title}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {course?.subTitle}
            </p>
          </div>
        </div>

        {/* Course Information */}
        <section>
          <h3 className="mb-4 text-base font-semibold">Course Information</h3>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-lg border p-4">
            <div>
              <p className="text-xs text-muted-foreground">Title</p>
              <p className="mt-1 font-medium">{course?.title || "NA"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Subtitle</p>
              <p className="mt-1 font-medium">{course?.subTitle || "NA"}</p>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Description</p>
              <div className="mt-1 text-sm leading-6">
                {course?.description ? parse(course.description) : "NA"}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="mt-1 font-medium capitalize">
                {course?.category || "NA"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="mt-1 font-medium">{course?.level || "NA"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="mt-1 font-medium">₹{course?.price ?? "NA"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Instructor</p>
              <p className="mt-1 font-medium capitalize">
                {course?.instructor?.name || "NA"}
              </p>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Course Content</h3>

            <span className="text-sm text-muted-foreground">
              {lectures?.length || 0} Lectures
            </span>
          </div>

          <div className="divide-y rounded-lg border">
            {lectures?.length > 0 ? (
              lectures.map((lecture, index) => (
                <div key={lecture?._id} className="flex items-center gap-3 p-4">
                  {/* Lecture Number */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {index + 1}
                  </span>

                  {/* Lecture Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {lecture?.title || "Untitled Lecture"}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {lecture?.videoUrl && (
                        <span className="rounded-md bg-muted px-2 py-0.5">
                          Video
                        </span>
                      )}

                      {lecture?.updatedAt && (
                        <span>Updated {formatDate(lecture.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                No lectures available.
              </p>
            )}
          </div>
        </section>

        {/* Moderation */}
        <section>
          <h3 className="mb-4 text-base font-semibold">Moderation</h3>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>

              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium
            ${STATUS_STYLES[course?.status]?.bg}
            ${STATUS_STYLES[course?.status]?.text}
          `}
              >
                {course?.status}
              </span>
            </div>

            <div className="flex gap-2">
              {(course?.status === "pending" || course?.status === "approved")
                 && (
                  <Button
                    variant="outline"
                    onClick={() => setRejectPopOpen(true)}
                    className="cursor-pointer"
                  >
                    Reject
                  </Button>
                )}
              {(course?.status === "pending" ||
                course?.status === "rejected") && (
                  <Button
                    onClick={() => handleUpdateStatus(course?._id, "approved")}
                    className="cursor-pointer"
                  >
                    Approve
                  </Button>
                )}
            </div>
          </div>
        </section>
      </div>
      {rejectPopOpen && (
        <div className="fixed flex items-center justify-center inset-0 bg-black/50 rounded-2xl">
          <div className="bg-white p-4 rounded w-full sm:w-112.5 flex flex-col gap-2">
            <div className="w-full flex justify-end">
              <Icons.XIcon
                className="size-5 cursor-pointer"
                onClick={() => setRejectPopOpen(false)}
              />
            </div>
            <h2>Rejection Reason </h2>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={"Enter the rejection Reason"}
              required
            />
            <Button
              size="lg"
              variant="primary"
              onClick={() => {
                handleUpdateStatus(course?._id, "rejected");
                // setRejectPopOpen(false);
              }}
              className="p-1 bg-black text-white font-semibold cursor-pointer  rounded-xl"
            >
              Add Reason
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseDetails;

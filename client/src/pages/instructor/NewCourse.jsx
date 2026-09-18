import InputField from "@/components/common/InputField";
import RichTextEditor from "@/components/common/RichTextEditor";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseCategories } from "@/resources/Data";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useGet } from "@/hooks/useGet";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icons from "@/utils/Icons";

const NewCourse = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [courseData, setCourseData] = useState({
    title: "",
    subTitle: "",
    category: "",
    level: "",
    price: "",
    thumbnail: "",
    status: "",
    isPublished: false,
  });

  const [lectureData, setLectureData] = useState({
    title: "",
    video: "",
    _id: "",
  });
  const [open, setOpen] = useState(false);
  const [videoEdit, setVideoEdit] = useState(false);

  const { id } = useParams();
  const {
    data,
    refetch,
    loading: loadingLec,
  } = useGet(id ? `course/${id}/lectures` : null);
  const { mutate, loading } = useMutation();

  useEffect(() => {
    if (!id || !data?.data?.course) return;
    const c = data.data.course;
    setCourseData({
      _id: c._id ?? "",
      title: c.title ?? "",
      subTitle: c.subTitle ?? "",
      category: c.category ?? "",
      level: c.level ?? "",
      price: c.price ?? "",
      thumbnail: c.thumbnail ?? "",
      isPublished: c.isPublished ?? false,
      status: c.status ?? "",
    });
    setDescription(c.description ?? "");
  }, [data, id]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("subTitle", courseData.subTitle);
    formData.append("category", courseData.category);
    formData.append("level", courseData.level);
    formData.append("price", courseData.price);
    formData.append("description", description);
    if (courseData.thumbnail instanceof File) {
      formData.append("thumbnail", courseData.thumbnail);
    }
    try {
      const res = await mutate({
        url: !id ? `course/` : `course/${courseData?._id}`,
        method: !id ? "post" : "PATCH",
        body: formData,
      });
      toast.success(res?.message || (!id ? "Course created successfully" : "Course updated successfully"));
      if (!id && res?.data?._id) {
        navigate(`/instructor/edit-course/${res.data._id}`);
      }
    } catch (error) {
      toast.error(error?.message || "Error while saving course");
    }
  };

  const handleInputChange = (e) => {
    setCourseData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLectureInputChange = (e) => {
    setLectureData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectedChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setCourseData((prev) => ({ ...prev, thumbnail: e.dataTransfer.files[0] }));
    }
  };

  const thumbnailSrc =
    courseData.thumbnail instanceof File
      ? URL.createObjectURL(courseData.thumbnail)
      : courseData.thumbnail;

  const handleAddVideo = async () => {
    try {
      const formData = new FormData();
      formData.append("title", lectureData?.title);
      formData.append("videoUrl", lectureData?.video);
      const res = await mutate({
        url: `lecture/${id}`,
        method: "post",
        body: formData,
      });
      toast.success(res?.message || "Lecture added successfully");
      setLectureData({ title: "", video: "", _id: "" });
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error(error?.message || "Error while adding lecture");
    }
  };

  const handleLectureEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", lectureData.title);
      formData.append("videoUrl", lectureData.video);

      const res = await mutate({
        url: `lecture/${lectureData?._id}`,
        method: "patch",
        body: formData,
      });
      setLectureData({ title: "", video: "", _id: "" });
      setVideoEdit(false);
      setOpen(false);
      refetch();
      toast.success(res?.message || "Lecture updated successfully");
    } catch (error) {
      toast.error(error?.message || "Error while updating lecture");
    }
  };

  const handleDelete = async (lecId) => {
    try {
      const res = await mutate({
        url: `lecture/${lecId}`,
        method: "delete",
      });
      toast.success(res?.message || "Lecture deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.message || "Error while deleting lecture");
    }
  };

  const handleLectureEditOpen = (lec) => {
    setVideoEdit(true);
    setOpen(true);
    setLectureData({
      title: lec?.title || "",
      video: lec?.videoUrl || "",
      _id: lec?._id || "",
    });
  };

  const handlePublish = async (cId) => {
    try {
      const res = await mutate({
        url: `course/${cId}/publish`,
        body: { isPublished: !courseData.isPublished },
        method: "patch",
      });
      toast.success(res?.message || "Course publish status updated");
      setCourseData((prev) => ({ ...prev, isPublished: !prev.isPublished }));
      refetch();
    } catch (error) {
      toast.error(error?.message || "Error while updating publish status");
    }
  };

  const handleApproval = async (cId) => {
    try {
      const res = await mutate({
        url: `course/${cId}/submit`,
        method: "patch",
      });
      toast.success(res?.message || "Submitted for admin approval successfully");
      setCourseData((prev) => ({ ...prev, status: "pending" }));
    } catch (error) {
      toast.error(error?.message || "Error while submitting for approval");
    }
  };

  const lectures = data?.data?.course?.lectures || [];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/instructor/my-courses")}
            className="cursor-pointer"
          >
            <Icons.ArrowLeft className="w-4 h-4 mr-1" />
            Courses
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {!id ? "Create New Course" : "Edit Course Details"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {!id
                ? "Fill in course details and launch your new curriculum"
                : "Manage curriculum, upload lectures, and publish your course"}
            </p>
          </div>
        </div>

        {id && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {courseData?.status && (
              <Badge variant="secondary" className="capitalize text-xs">
                Status: {courseData.status}
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-1 ${
                courseData?.isPublished
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              {courseData?.isPublished ? "● Published" : "○ Draft"}
            </Badge>
          </div>
        )}
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Icons.BookOpen className="w-4 h-4 text-primary" />
          Course Information
        </h2>

        <div className="space-y-4">
          <InputField
            name="title"
            label="Course Title"
            placeholder="e.g. Full-Stack Web Development with React & Node"
            onChange={handleInputChange}
            value={courseData.title}
          />

          <InputField
            name="subTitle"
            label="Subtitle / Short Description"
            placeholder="e.g. Master modern web development from scratch with practical projects"
            onChange={handleInputChange}
            value={courseData.subTitle}
          />

          <div className="space-y-1.5">
            <RichTextEditor
              value={description}
              onChange={setDescription}
              label="Full Description"
              placeholder="Provide a detailed description of what students will learn..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-foreground">
                Category
              </label>
              <Select
                value={courseData.category}
                onValueChange={(val) => handleSelectedChange("category", val)}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {courseCategories.map((cat, idx) => (
                      <SelectItem key={idx} value={cat.value} className="text-sm">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="level" className="text-sm font-medium text-foreground">
                Difficulty Level
              </label>
              <Select
                value={courseData.level}
                onValueChange={(val) => handleSelectedChange("level", val)}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Beginner" className="text-sm">Beginner</SelectItem>
                    <SelectItem value="Moderate" className="text-sm">Intermediate</SelectItem>
                    <SelectItem value="Advance" className="text-sm">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <InputField
              name="price"
              label="Price (₹)"
              placeholder="e.g. 499"
              onChange={handleInputChange}
              value={courseData.price}
            />
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <label className="text-sm font-medium text-foreground">Course Thumbnail</label>

          <label
            htmlFor="thumbnail"
            className="border-dashed border-2 rounded-xl p-6 border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/30 transition-colors flex flex-col justify-center items-center cursor-pointer text-center group"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Icons.Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
            <p className="text-sm font-medium text-foreground">
              Drag & drop image here, or <span className="text-primary font-semibold">browse files</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (16:9 ratio recommended)</p>
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setCourseData((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
              }
            }}
          />

          {thumbnailSrc && (
            <div className="mt-3 max-w-sm rounded-xl border border-border overflow-hidden bg-muted/40 p-2">
              <img
                src={thumbnailSrc}
                alt="Thumbnail Preview"
                className="aspect-video w-full rounded-lg object-cover"
              />
              {courseData.thumbnail?.name && (
                <p className="mt-1.5 text-xs text-muted-foreground truncate px-1">
                  {courseData.thumbnail.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Course Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/40">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer shadow-sm"
          >
            <Icons.Check className="w-4 h-4 mr-1.5" />
            {!id ? "Create Course" : "Save Course Changes"}
          </Button>

          {id && (
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={loading}
              onClick={
                courseData?.status === "approved"
                  ? () => handlePublish(id)
                  : () => handleApproval(id)
              }
            >
              {courseData?.status === "approved" ? (
                courseData?.isPublished ? (
                  <>
                    <Icons.Ban className="w-4 h-4 mr-1.5" />
                    Unpublish Course
                  </>
                ) : (
                  <>
                    <Icons.Play className="w-4 h-4 mr-1.5" />
                    Publish Course
                  </>
                )
              ) : (
                <>
                  <Icons.Send className="w-4 h-4 mr-1.5" />
                  Submit For Admin Approval
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Lectures Section (Shown when editing course) */}
      {id && (
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Icons.Video className="w-4 h-4 text-primary" />
                Course Lectures ({lectures.length})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload and manage video lectures for this course curriculum
              </p>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="cursor-pointer shadow-xs self-start sm:self-auto"
                  onClick={() => {
                    setVideoEdit(false);
                    setLectureData({ title: "", video: "", _id: "" });
                  }}
                >
                  <Icons.Plus className="w-4 h-4 mr-1.5" />
                  Add Lecture
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{videoEdit ? "Edit Lecture" : "Add New Lecture"}</DialogTitle>
                  <DialogDescription>
                    Provide a title and select the video file for this lecture.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <InputField
                    name="title"
                    label="Lecture Title"
                    placeholder="e.g. Introduction to Component Lifecycle"
                    onChange={handleLectureInputChange}
                    value={lectureData.title}
                  />

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Lecture Video</label>
                    <label
                      htmlFor="video"
                      className="border-dashed border-2 rounded-xl p-4 border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/30 transition-colors flex flex-col justify-center items-center cursor-pointer text-center group"
                      onDragOver={handleDragOver}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) {
                          setLectureData((prev) => ({ ...prev, video: e.dataTransfer.files[0] }));
                        }
                      }}
                    >
                      <Icons.Video className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                      <p className="text-xs font-medium text-foreground">
                        Drag video file or <span className="text-primary font-semibold">browse</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">MP4, WebM or MOV</p>
                    </label>
                    <input
                      type="file"
                      id="video"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setLectureData((prev) => ({ ...prev, video: e.target.files[0] }));
                        }
                      }}
                    />
                    {lectureData.video && (
                      <p className="text-xs text-muted-foreground truncate bg-muted/40 p-2 rounded-lg">
                        {lectureData.video.name ?? lectureData.video}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={videoEdit ? handleLectureEdit : handleAddVideo}
                    className="w-full cursor-pointer mt-2"
                    disabled={loading || !lectureData.title}
                  >
                    {loading
                      ? "Uploading..."
                      : videoEdit
                      ? "Save Lecture Changes"
                      : "Add Lecture"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loadingLec ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading lectures...</p>
          ) : lectures.length > 0 ? (
            <div className="space-y-2">
              {lectures.map((lecture, idx) => (
                <div
                  key={lecture._id || idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground truncate">
                      {lecture.title || "Untitled Lecture"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2.5 text-xs cursor-pointer"
                      onClick={() => handleLectureEditOpen(lecture)}
                    >
                      <Icons.Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                      onClick={() => handleDelete(lecture?._id)}
                    >
                      <Icons.Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
              <Icons.Video className="w-8 h-8 mx-auto mb-1 text-muted-foreground/40" />
              No lectures added yet. Click "Add Lecture" to upload video lessons.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewCourse;

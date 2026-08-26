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
import { useParams } from "react-router-dom";
import { useGet } from "@/hooks/useGet";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import Icons from "@/utils/Icons";

const NewCourse = () => {
  // const lectureState = useSelector((state) => state.lectures.lectures);
  // const Dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [courseData, setCourseData] = useState({
    title: "",
    subTitle: "",
    category: "",
    level: "",
    price: "",
    thumbnail: "",
    status: "",
  });

  const [lectureData, setLectureData] = useState({
    title: "",
    video: "",
    _id: "",
  });
  const [open, setOpen] = useState(false);
  const [videoEdit, setVideoEdit] = useState(false);

  // useEffect(() => console.log("id: ", id), [id]);
  const { id } = useParams();
  // const { data } = useGet(id ? `course/${id}` : null);
  const {
    data,
    refetch,
    loading: loadingLec,
  } = useGet(id ? `course/${id}/lectures` : null);
  const { mutate, loading } = useMutation();

  useEffect(
    () => console.log("data: ", data, " courseData", courseData),
    [data, courseData],
  );

  useEffect(() => {
    if (!id) return;
    setCourseData({
      _id: data?.data?.course?._id ?? "",
      title: data?.data?.course?.title ?? "",
      subTitle: data?.data?.course?.subTitle ?? "",
      category: data?.data?.course?.category ?? "",
      level: data?.data?.course?.level ?? "",
      price: data?.data?.course?.price ?? "",
      thumbnail: data?.data?.course?.thumbnail ?? "",
      isPublished: data?.data?.course?.isPublished ?? "",
      status: data?.data?.course?.status ?? "",

    });
    setDescription(data?.data?.course?.description ?? "");
  }, [data]);

  // useEffect(() => {
  //   console.log("courseData:", courseData);
  //   console.log("description:", description);
  // }, [courseData, description]);

  useEffect(() => {
    console.log("lectureData: ", lectureData);
  }, [lectureData]);

  // useEffect(() => {
  //   const res = useGet("course/6a1a7630f91aba30565481b8/lectures");
  //   console.log("rea: ", res);
  // }, [lectureState]);

  // useEffect(() => console.log("lectures: ", lectures), [lectures]);

  const handleSubmit = async () => {
    console.log(courseData);
    console.log("description: ", description);
    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("subTitle", courseData.subTitle);
    formData.append("category", courseData.category);
    formData.append("level", courseData.level);
    formData.append("price", courseData.price);
    formData.append("description", description);
    if (courseData.thumbnail instanceof File)
      formData.append("thumbnail", courseData.thumbnail);
    try {
      console.log("idL ", id);
      const res = await mutate({
        url: !id ? `course/` : `course/${courseData?._id}`,
        method: !id ? "post" : "PATCH",
        body: formData,
      });
      console.log("Res: ", res);
      toast.success(res.message || "Course Craetion success");
      setCourseData({
        title: "",
        subTitle: "",
        category: "",
        level: "",
        price: "",
        thumbnail: "",
      });
      setDescription("");
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message || "Error while course Cration");
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
  useEffect(() => console.log("Category: ", courseData), [courseData]);

  const handleDragOver = (e) => {
    e.preventDefault();
    // console.log("e: ",e);
    // console.log("DFiles: ",e.files);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    console.log("DFiles: ", e.dataTransfer.files[0]);
    setCourseData((prev) => ({ ...prev, thumbnail: e.dataTransfer.files[0] }));
  };

  const thumbnailSrc =
    courseData.thumbnail instanceof File
      ? URL.createObjectURL(courseData.thumbnail)
      : courseData.thumbnail;

  const handleAddVideo = async () => {
    console.log("LecutureData: ", lectureData);
    try {
      const formData = new FormData();
      formData.append("title", lectureData?.title);
      formData.append("videoUrl", lectureData?.video);
      const res = await mutate({
        url: `lecture/${id}`,
        method: "post",
        body: formData,
      });
      console.log("res: ", res);
      toast.success(res?.message || "Lecture Added Successfully");
      setLectureData({
        title: "",
        video: "",
      });
      setOpen(false);
      refetch();
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message || "Error while Adding the Lecture");
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
      console.log("res: ", res);
      setLectureData({
        title: "",
        video: "",
        _id: "",
      });
      setVideoEdit(false);
      setOpen(false);
      refetch();
      toast.success(res?.message || "Lecture has been updated Successfully");
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error?.message || "Error Occured While UPadting the Lecture");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await mutate({
        url: `lecture/${id}`,
        method: "delete",
      });
      console.log("res: ", res);
      toast.success(res.message || "Lecture has been Deleted Successfully");
      refetch();
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message || "There is been some error while Deleting");
    }
  };

  const handleLectureEditOpen = (data) => {
    setVideoEdit(true);
    setOpen(true);

    setLectureData({
      title: data?.title || "",
      video: data?.videoUrl || "",
      _id: data?._id || "",
    });
  };

  const handlePublish = async (cId) => {
    try {
      console.log("!courseData.isPublished: ", !courseData.isPublished);
      const res = await mutate({
        url: `course/${cId}/publish`,
        body: { isPublished: !courseData.isPublished },
        method: "patch",
      });
      console.log("res: ", res);
      toast.success(res.message || "Course Publish Status has been updated");
      refetch();
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message || "Error while updateing the status");
    }
  };

  const handleApproval=async(cId)=>{
    try {
      const res=await mutate({
        url:`course/${cId}/submit`,
        // body:{},
        method:"patch"
      })
      console.log("res: ",res);
      toast.success(res?.message || "Send for Admin Approval Successfully");
       setCourseData({
        title: "",
        subTitle: "",
        category: "",
        level: "",
        price: "",
        thumbnail: "",
      });
      setDescription("");
      setLectureData({});
    } catch (error) {
            console.log("Error: ", error);
      toast.error(error.message || "Error while updateing the status");
    }
  }

  return (
    <div className="p-6 ">
      <h2 className="text-lg font-semibold mb-4">
        {!id
          ? "Let's add up the details of new course"
          : "Edit the Course details"}
      </h2>
      <div className="p-5 border rounded-lg flex flex-col gap-5">
        <div className="flex justify-between">
          <h4 className="font-semibold">Basic Information </h4>
          <div className="flex items-center">
            {courseData?.isPublished ? (
              <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 border border-emerald-200">
                <Icons.Circle
                  size={18}
                  className="bg-green-600 rounded-full text-white font-semibold"
                />
                <span>Published</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 border border-red-200">
                <Icons.Circle
                  size={24}
                  className="bg-red-600  rounded-full text-white font-semibold"
                />
                <span>Unpublished</span>
              </div>
            )}
          </div>
        </div>
        <InputField
          name={"title"}
          label={"Title"}
          placeholder={"Enter the Title"}
          onChange={handleInputChange}
          value={courseData.title}
        />
        <InputField
          name={"subTitle"}
          label={"SubTitle"}
          placeholder={"Enter the SubTitle"}
          onChange={handleInputChange}
          value={courseData.subTitle}
        />
        <RichTextEditor
          value={description}
          onChange={setDescription}
          label={"Description"}
          placeholder={"Add the Decription to the Course"}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="font-medium">
              Course Category
            </label>
            <Select
              className="mt-2"
              value={courseData.category}
              onValueChange={(val) => handleSelectedChange("category", val)}
            >
              <SelectTrigger className="w-full h-20 text-base py-5">
                <SelectValue placeholder="Select a Course Category" />
              </SelectTrigger>
              <SelectContent className={"p-2"}>
                <SelectGroup>
                  {courseCategories.map((category, index) => (
                    <SelectItem
                      key={index}
                      value={category.value}
                      className="text-base py-2"
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="level" className="font-medium">
              Course Level
            </label>
            <Select
              className="mt-2 w-full"
              value={courseData.level}
              onValueChange={(val) => handleSelectedChange("level", val)}
            >
              <SelectTrigger
                className="w-full h-20 text-base py-5"
                name="courseData.level"
                id="level"
              >
                <SelectValue placeholder="Select a Course Level" />
              </SelectTrigger>
              <SelectContent className={"p-2"}>
                <SelectGroup>
                  <SelectItem value="Beginner" className="text-base py-2">
                    Beginner
                  </SelectItem>
                  <SelectItem value="Moderate" className="text-base py-2">
                    Moderate
                  </SelectItem>
                  <SelectItem value="Advance" className="text-base py-2">
                    Advance
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <InputField
            name={"price"}
            label={"Price"}
            placeholder={"Enter Price"}
            onChange={handleInputChange}
            value={courseData.price}
          />
        </div>
        <div className="">
          <h3 className="font-medium mb-2"> Course Thumbnail</h3>

          <label
            htmlFor="thumbnail"
            className="border-dashed border-2 max-w-xl h-56 border-black hover:border-gray-500 rounded flex  flex-col justify-center items-center cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h4 className="text-lg">Drag & Drop </h4>
            <div className="font-semibold">or</div>
            <h4 className="text-blue-600 font-semibold">Click to Browse</h4>
          </label>
          <input
            type="file"
            id="thumbnail"
            className="hidden"
            onChange={(e) => {
              setCourseData((prev) => ({
                ...prev,
                thumbnail: e.target.files[0],
              }));
            }}
          />
          {courseData.thumbnail && (
            <div className="mt-4 max-w-xl rounded-xl border bg-muted/20 p-3">
              <img
                src={thumbnailSrc}
                alt="Thumbnail Preview"
                className="h-56 w-full rounded-lg object-cover border"
              />

              <div className="mt-3 rounded-md bg-background px-3 py-2  font-medium text-muted-foreground truncate">
                {courseData.thumbnail.name}
              </div>
            </div>
          )}
        </div>

        {/* Add Lecture */}
        {id ? (
          <div className=" my-2 p-10!">
            {!loadingLec ? (
              data?.data?.course?.lectures?.length ? (
                data?.data?.course?.lectures?.map((lecture) => {
                  return (
                    <Card className={"my-2 p-1.5!"}>
                      <CardContent className="flex items-center justify-between ">
                        <p className="text-lg font-medium italic">
                          {lecture.title ?? "Not avaliable"}
                        </p>

                        <div className="flex gap-2">
                          <Button
                            variant="outline "
                            className={
                              "text-lg font-semibold p-5 bg-gray-400 hover:bg-gray-500 cursor-pointer"
                            }
                            onClick={() => handleLectureEditOpen(lecture)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            className={
                              "text-lg font-semibold p-5  bg-red-100 hover:bg-red-300 cursor-pointer"
                            }
                            onClick={() => handleDelete(lecture?._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div>No lectures Found</div>
              )
            ) : (
              <div>Loading...</div>
            )}
            {/* basic flow from tutorial  */}
            {/* i haven't decide on the time line for DSA , but i will revise least 2 problme amd solve 2  */}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className={
                    "flex gap-4 cursor-pointer py-6 px-4 font-semibold text-lg bg-transparent text-black "
                  }
                  onClick={() => {
                    setVideoEdit(false);
                    setLectureData({
                      title: "",
                      video: "",
                      _id: "",
                    });
                  }}
                >
                  <Icons.Plus />
                  <span>Add Lecture</span>
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>

                <InputField
                  name={"title"}
                  label={" Title"}
                  placeholder={"Enter Lecture Title"}
                  onChange={handleLectureInputChange}
                  value={lectureData.title}
                />

                <div className="">
                  <h3 className="font-medium mb-2"> Lecture Video</h3>

                  <label
                    htmlFor="video"
                    className="border-dashed border-2 max-w-xl h-28 border-black hover:border-gray-500 rounded flex  flex-col justify-center items-center cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <h4 className="text-lg">Drag & Drop </h4>
                    <div className="font-semibold">or</div>
                    <h4 className="text-blue-600 font-semibold">
                      Click to Browse
                    </h4>
                  </label>
                  <input
                    type="file"
                    id="video"
                    className="hidden"
                    onChange={(e) => {
                      setLectureData((prev) => ({
                        ...prev,
                        video: e.target.files[0],
                      }));
                    }}
                  />
                  {lectureData.video && (
                    <div className="mt-3 rounded-md bg-background px-3 py-2  font-medium text-muted-foreground truncate max-w-xs">
                      {lectureData.video.name ?? lectureData.video}
                    </div>
                  )}
                </div>
                <Button
                  onClick={videoEdit ? handleLectureEdit : handleAddVideo}
                  className={`cursor-pointer `}
                  disabled={loading}
                >
                  {loading
                    ? "Plz.. wait In Progress"
                    : videoEdit
                      ? "Edit Video"
                      : "Add Video"}
                </Button>

                {/* Form Fields */}
              </DialogContent>
            </Dialog>
          </div>
        ) : null}
        <div className="flex gap-4 mt-3">
          <button
            className="text-white font-semibold bg-black rounded p-2 px-8 cursor-pointer"
            onClick={handleSubmit}
          >
            {!id ? "Create Course" : "Edit Course"}
          </button>
          {console.log("courseData?.status: ",courseData?.status)}
          <button
            className="border rounded font-semibold p-2 px-8 cursor-pointer"
            onClick={courseData?.status === "approved"?()=>handlePublish(id):() => handleApproval(id)}
          >
            {courseData?.status === "approved"
              ? !courseData?.isPublished
                ? "Publish"
                : "UnPublish"
              : "Submit For Approval"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;

// improving communication for iterview, like GD and all interview questions pratice them before hand , for improving communication what we can try
// also about health my feel fatigue even after small activity or why not feeling fresh after completing the sleep , u eat but still , to increase immnity and weight gain
// what can we do for the hair fall, any thing about t otake care of it
// let's see the personalty development any good courses or videos about it , gita , being mindfula nd peaceful , less overthinking
// shrimat Bhagvad Gita, mobile no use

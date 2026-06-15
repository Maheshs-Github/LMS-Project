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
import { useLocation, useParams } from "react-router-dom";
import { useGet } from "@/hooks/useGet";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";

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
  const { data } = useGet(id ? `course/${id}` : null);
  const { mutate, loading } = useMutation();

  useEffect(
    () => console.log("data: ", data, " courseData", courseData),
    [data, courseData],
  );

  useEffect(() => {
    if (!id) return;
    setCourseData({
      _id: data?.data?._id ?? "",
      title: data?.data?.title ?? "",
      subTitle: data?.data?.subTitle ?? "",
      category: data?.data?.category ?? "",
      level: data?.data?.level ?? "",
      price: data?.data?.price ?? "",
      thumbnail: data?.data?.thumbnail ?? "",
    });
    setDescription(data?.data?.description ?? "");
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

  const {
    data: lectures,
    refetch,
    loading: loadingLec,
  } = useGet(id ? `course/${id}/lectures` : null);

  useEffect(() => console.log("lectures: ", lectures), [lectures]);

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

  return (
    <div className="p-6 ">
      <h2 className="text-lg font-semibold mb-4">
        {!id
          ? "Let's add up the details of new course"
          : "Edit the Course details"}
      </h2>
      <div className="p-5 border rounded-lg flex flex-col gap-5">
        <div className="flex justify-between">
          <div>
            <h4 className="font-semibold">Basic Information </h4>
          </div>
          <div className="flex gap-6">
            <button className="p-2 px-4 rounded text-black shadow-md border cursor-pointer bg-white">
              Unpublish
            </button>
            <button className="p-2 bg-black text-white rounded cursor-pointer">
              Remove Course
            </button>
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
        <div className=" my-2 p-10!">
          {!loadingLec ? (
            lectures?.data?.lecture?.lectures?.length ? (
              lectures?.data?.lecture?.lectures?.map((lecture) => {
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
                <Plus />
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
        <div className="flex gap-4 mt-3">
          <button className="border rounded font-semibold p-2 px-8 cursor-pointer">
            Cancel
          </button>
          <button
            className="text-white font-semibold bg-black rounded p-2 px-8 cursor-pointer"
            onClick={handleSubmit}
          >
            {!id ? "Submit" : "Edit"}
            {}
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

// 13:30
// "What am I thinking about right now?"
// just thinking about completing the SI video ,or maybe continue with project , if not bale to focus on calculations, but not feeling really well to focus, guess health is not fine, alos thinking about the luch whaT to take for it , some thought about the trip also about switch
// "How does my body feel?" (tight? tired? fine?)
// tight and tired, well maybe bcoz of not feeking well, burt it is fine than morning
// "Am I actually present or am I somewhere in my head?"
// yeah mostly in the present , othere than above things

// /14:50
// "What am I thinking about right now?"
// hmm. mind is tired , it just want to sleep , actaully just had the lunch after that i was taking little nap first i was no thinking mode on ,but still some thing like evenmention in this reports pop up , then slowly i was sleeping damn one , thinking about so herd repluy to msg my friend , also have to sleep early today and about apptitude
// "How does my body feel?" (tight? tired? fine?)
// feeling fine, just litlle head on side of eyes and litle tight else fine ,power nap was nice
// "Am I actually present or am I somewhere in my head?"
// yup seems like it

// next dy 10:00
// "What am I thinking about right now?"
// what to strt eiher aptitude or project , have to do apptitude but not feel like project have to do, well we have to do it , apptitude it is , about collegues amight not come today , ppl leaving IG but using the YT short , nthg else
// "How does my body feel?" (tight? tired? fine?)
// hmm. slept about 10 hrs feeling good , but still litlle tightness in mind and neck , else good
// "Am I actually present or am I somewhere in my head?"
// mostly yes, about what do do ,s trtig my work

// next dy 11:11
// "What am I thinking about right now?"
// nthg much wherther  to continuw with the apptitude or LMs , doing apptitude
// "How does my body feel?" (tight? tired? fine?)
// hmm. feeling bettre than morning , just did face wash with water , little break
// "Am I actually present or am I somewhere in my head?"
// yeah

// 13:00
// "What am I thinking about right now?"
// nthg much hungry, head is still not good , actually my health bben not that is why , thinkig baout when to go eat
// "How does my body feel?" (tight? tired? fine?)
// nthg difremt that above
// "Am I actually present or am I somewhere in my head?"
// yeah

// 17:48
// "What am I thinking about right now?"
// what i am thinking , just took powe nap, thinking about what should i do maybe juast write our weekly progress whethere to go face wash and et some air , will do then , thinking about the talking with collegues but guess they are working
// "How does my body feel?" (tight? tired? fine?)
// feeling fine rn , songs and all
// "Am I actually present or am I somewhere in my head?"
// u can say i g

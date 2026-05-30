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

const NewCourse = () => {
  const [description, setDescription] = useState("");
  const [courseData, setCourseData] = useState({
    title: "",
    subTitle: "",
    category: "",
    level: "",
    price:"",
    thumbnail: "",
  });
  const {mutate}=useMutation();
  // const [category,setCategory]=useState("");

  const handleSubmit = async() => {
    console.log(courseData);
    console.log("description: ",description);
    const formData=new FormData();
    formData.append("title",courseData.title)
    formData.append("subTitle",courseData.subTitle)
    formData.append("category",courseData.category)
    formData.append("level",courseData.level)
    formData.append("price",courseData.price)
    formData.append("thumbnail",courseData.thumbnail)
    formData.append("description",description)
try {
  const res=await mutate({
          url: `course`,
        method: "post",
        body: formData,
});
  console.log("Res: ",res);
  toast.success(res.message || "Course Craetion success");
} catch (error) {
  console.log("Error: ",error);
      toast.error(error.message || "Error while course Cration");
}

  };
  const handleInputChange = (e) => {
    setCourseData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
  return (
    <div className="p-6 ">
      <h2 className="text-lg font-semibold mb-4">
        Let's add up the details of new course
      </h2>
      <div className="p-5 border rounded-lg flex flex-col gap-5">
        <div className="flex justify-between">
          <div>
            <h4 className="font-semibold">Basic Information </h4>
            <p>Fill up the Info to Launch new Course</p>
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
                  {courseCategories.map((category) => (
                    <SelectItem value={category.value} className="text-base py-2">
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
                  <SelectItem value="Beginner" className="text-base py-2">Beginner</SelectItem>
                  <SelectItem value="Moderate" className="text-base py-2">Moderate</SelectItem>
                  <SelectItem value="Advanced" className="text-base py-2">Advance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <InputField
          name={"price"}
          label={"Course Price"}
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
                src={URL.createObjectURL(courseData.thumbnail)}
                alt="Thumbnail Preview"
                className="h-56 w-full rounded-lg object-cover border"
              />

              <div className="mt-3 rounded-md bg-background px-3 py-2  font-medium text-muted-foreground truncate">
                {courseData.thumbnail.name}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-3">
      <button className="border rounded font-semibold p-2 px-8 cursor-pointer">Cancel</button>
      <button className="text-white font-semibold bg-black rounded p-2 px-8 cursor-pointer" onClick={handleSubmit}>Submit</button>
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

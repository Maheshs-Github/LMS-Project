import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res) => {
  
    
  
  // console.log("Body: ",req.body);
  // console.log("File: ",req.file);
  const { title, subTitle, category, level, price, description } = req.body;
  console.log("req User: ", req?.user);
  if (
    [title, subTitle, category, level, price, description].some(
      (field) => !field || field.trim() === "",
    )
  )
    throw new ApiError(400, "All fields are required");

  const thumbnailPath = req.file.path;
  console.log("thumbnailPath: ", thumbnailPath);

  const uploadedThumb = await uploadOnCloudinary(thumbnailPath);
  console.log("photo fromCloud: ", uploadedThumb);

  if (!uploadedThumb.url)
    throw new ApiError(
      400,
      "There was error while uploading the Thumbnail on cloudinary",
    );

  const createdCourse = await Course.create({
    title,
    subTitle,
    category,
    level,
    price,
    description,
    thumbnail: uploadedThumb.url,
    creator: req?.user?.id,
  });

  if (!createCourse)
    throw new ApiError(400, "There was Error while crating the Course");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createCourse,
        "Course has been created successfully",
      ),
    );
    
});

export { createCourse };

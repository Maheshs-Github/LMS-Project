import mongoose from "mongoose";
import generateSlug from "../utils/generateSlug.js";
import dotenv from "dotenv";
import { Course } from "../models/course.model.js";

dotenv.config();

const migrateCourseSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const courses = await Course.find(
      {},
      { _id: 1, title: 1, slug: 1 }
    ).lean();

    let updated = 0;
    let skipped = 0;

    for (const course of courses) {
      if (course.slug) {
        skipped++;
        continue;
      }

      const slug = generateSlug(course.title, course._id);

      await Course.updateOne(
        { _id: course._id, slug: { $exists: false } },
        { $set: { slug } }
      );

      updated++;
    }

    const missing = await Course.countDocuments({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" },
      ],
    });

    const duplicates = await Course.aggregate([
      { $group: { _id: "$slug", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    console.log({ updated, skipped, missing, duplicates });

    if (missing > 0 || duplicates.length > 0) {
      throw new Error("Migration verification failed");
    }

    console.log("Course slug migration completed");
  } catch (error) {
    console.error("Course slug migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

migrateCourseSlugs();
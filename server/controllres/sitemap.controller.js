import redisClient from "../config/redis.js";
import { Course } from "../models/course.model.js";

const SITEMAP_CACHE_KEY = "sitemap:xml";
const SITEMAP_CACHE_TTL = 300;

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const getSitemap = async (req, res, next) => {
  try {
    const cachedSitemap = await redisClient.get(SITEMAP_CACHE_KEY);

    if (cachedSitemap) {
      res.type("application/xml").send(cachedSitemap);
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is not configured");
    }

    const courses = await Course.find({
      status: "approved",
      isPublished: true,
      slug: { $exists: true, $ne: "" },
    })
      .select("slug updatedAt")
      .lean();

    const staticUrls = ["/", "/courses"]
      .map(
        (path) => `
    <url>
      <loc>${escapeXml(`${frontendUrl}${path}`)}</loc>
    </url>`,
      )
      .join("");

    const courseUrls = courses
      .map(
        (course) => `
    <url>
      <loc>${escapeXml(`${frontendUrl}/course/${course.slug}`)}</loc>
      ${
        course.updatedAt
          ? `<lastmod>${new Date(course.updatedAt).toISOString()}</lastmod>`
          : ""
      }
    </url>`,
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${courseUrls}
</urlset>`;

    await redisClient.set(SITEMAP_CACHE_KEY, sitemap, {
      EX: SITEMAP_CACHE_TTL,
    });

    res.type("application/xml").send(sitemap);
  } catch (error) {
    next(error);
  }
};

export { getSitemap };

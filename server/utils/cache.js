import redisClient from "../config/redis.js";

const invalidateCourseCatalogCache = async () => {
  const keys = [];

  for await (const key of redisClient.scanIterator({
    MATCH: "course:catalog:*",
    COUNT: 100,
  })) {
    keys.push(key);
  }

  if (keys.length > 0) {
    await redisClient.del(...keys);
  }

  console.log(`Invalidated ${keys.length} course catalog cache keys`);
};

export { invalidateCourseCatalogCache };
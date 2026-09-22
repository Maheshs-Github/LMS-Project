import redisClient from "../config/redis.js";

const invalidateCourseCatalogCache = async () => {
  const keys = [];

  for await (const batch of redisClient.scanIterator({
    MATCH: "course:catalog:*",
    COUNT: 100,
  })) {
    keys.push(...batch);
  }

  if (!keys.length) {
    console.log("No course catalog cache found");
    return;
  }

  await redisClient.del(keys);

  console.log(`Invalidated ${keys.length} course catalog cache keys`);
};

export { invalidateCourseCatalogCache };

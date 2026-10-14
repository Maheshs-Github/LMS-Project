const generateSlug = (title, id) => {
  const titleSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${titleSlug || "course"}-${id.toString().slice(0, 6)}`;
};

export default generateSlug;
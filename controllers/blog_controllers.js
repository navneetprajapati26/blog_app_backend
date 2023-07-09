import mongoose from "mongoose";
import Blog from "../model/blog";
import User from "../model/user";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    return console.log(err);
  }

  if (!blogs) {
    return res.status(404).json({ message: "no blogs Found" });
  }
  return res.status(200).json({ blogs });
};

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res.status(400)({ message: "unabel to finde User by this id" });
  }

  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;

  // req.params.id come form url, jha hm id ko difine kiye hen
  const blagId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blagId, {
      title,
      description,
    });
  } catch (err) {
    return console.log(err);
  }

  if (!blog) {
    return res.status(500).json({ message: "Unabel to update blog" });
  }
  return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
  const blagId = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(blagId);
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unabel to get blog" });
  }
  return res.status(200).json({ blog });
};

export const deleteBlog = async (req, res, next) => {
  const blagId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndRemove(blagId).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return console.log(err);
  }

  if (!blog) {
    return res.status(500).json({ message: "Unabel to delete blog" });
  }
  return res.status(200).json({ message: "delete succsefully blog" });
};

export const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (err) {
    return console.log(err);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "no blogs Found" });
  }
  return res.status(200).json({ blogs: userBlogs });
};

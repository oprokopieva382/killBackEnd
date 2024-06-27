import { ObjectId } from "mongodb";
import { BlogDBType, PostDBType } from "../cloud_DB";
import { BlogInputModel, BlogPostInputModel } from "../type-models";
import { blogsRepository, postsRepository } from "../repositories";
import { ApiError } from "../helper/api-errors";

export const blogsService = {
  async removeBlog(id: string) {
    return await blogsRepository.removeBlog(id);
  },

  async createBlog(data: BlogInputModel) {
    const { name, description, websiteUrl } = data;
    const newBlog = new BlogDBType(
      new ObjectId(),
      name,
      description,
      websiteUrl,
      new Date().toISOString()
    );

    const createdBlog = await blogsRepository.createBlog(newBlog);

    return blogsRepository.getByIdBlog(createdBlog._id.toString());
  },

  async updateBlog(data: BlogInputModel, id: string) {
    return await blogsRepository.updateBlog(data, id);
  },

  async createPost(
    blogId: string,
    data: BlogPostInputModel
  ): Promise<PostDBType | null> {
    const { title, shortDescription, content } = data;
    const isBlogExist = await blogsRepository.getByIdBlog(blogId);

    if (!isBlogExist) {
      throw ApiError.NotFoundError("Not found", ["No blog found"]);
    }

    const newPost = new PostDBType(
      new ObjectId(),
      title,
      shortDescription,
      content,
      new ObjectId(blogId),
      isBlogExist.name,
      new Date().toISOString()
    );

    const createdPost = await blogsRepository.createPost(newPost);

    if (!createdPost) {
      throw ApiError.NotFoundError("Not found", ["Can't create post"]);
    }

    const result = await postsRepository.getByIdPost(
      createdPost._id.toString()
    );

    if (!result) {
      throw ApiError.NotFoundError("Not found", ["No post found"]);
    }

    return result;
  },
};

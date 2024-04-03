import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts-repository";
import { PostInputModel } from "../../models/PostInputModel";
import { PostViewModel } from "../../models/PostViewModel";
import { APIErrorResult } from "../../output-errors-type";
import { validation } from "../../utils/validation";
import { ParamType } from ".";

export const postsController = {
  getAll: () => {
    return (req: Request, res: Response) => {
      const posts = postsRepository.getAllPosts();
      res.status(200).json(posts);
    };
  },

  getById: () => {
    return (
      req: Request<ParamType>,
      res: Response<PostViewModel | APIErrorResult>
    ) => {
      const foundPost = postsRepository.getByIdPost(+req.params.id);

      if (!foundPost) {
        res.status(404);
        return;
      }

      res.status(200).json(foundPost);
    };
  },

  deleteById: () => {
    return async (
      req: Request<ParamType>,
      res: Response<void | APIErrorResult>
    ) => {
      const isPostExist = await postsRepository.getByIdPost(+req.params.id);
      console.log(isPostExist);
      const postToRemove = postsRepository.removePost(+req.params.id);

      if (!isPostExist) {
        res.status(404)
        return;
      }

      res.sendStatus(204);
    };
  },

  create: () => {
    return (
      req: Request<{}, {}, PostInputModel>,
      res: Response<PostViewModel | APIErrorResult>
    ) => {
      const errors = validation(req.body);
      const newPost = postsRepository.createPost(req.body);

      if (errors.errorsMessages.length > 0) {
        res.status(400).json(errors);
        return;
      }

      res.status(201).json(newPost);
    };
  },
};

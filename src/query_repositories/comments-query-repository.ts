import { CommentViewModel, Paginator } from "../models";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { commentsCollection } from "../cloud_DB/mongo_db_atlas";
import { QueryCommentsType } from "../query-type";

export const commentsQueryRepository = {
  async getCommentsOfPost(
    postId: string,
    query: QueryCommentsType
  ): Promise<Paginator<CommentViewModel>> {
    const totalCommentsCount = await commentsCollection.countDocuments({
      postId: postId.toString(),
    });

    const comments: CommentDBType[] = await commentsCollection
      .find({ postId: postId.toString() })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort(query.sortBy, query.sortDirection)
      .toArray();

    const commentsToView = {
      pagesCount: Math.ceil(totalCommentsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCommentsCount,
      items: comments.map((c) => this._mapCommentDBToView(c)),
    };

    return commentsToView;
  },

  _mapCommentDBToView(comment: CommentDBType): CommentViewModel {
    return {
      // Convert ObjectId to string
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    };
  },
};
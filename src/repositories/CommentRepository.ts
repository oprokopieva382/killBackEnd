import { ObjectId } from "mongodb";
import { CommentInputModel } from "../type-models";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { CommentModel } from "../models";

export class CommentRepository {
  async getByIdComment(commentId: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(commentId),
    });
  }

  async removeComment(commentId: string) {
    return await CommentModel.findOneAndDelete({
      _id: new ObjectId(commentId),
    });
  }

  async updateComment(data: CommentInputModel, commentId: string) {
    const { content } = data;

    const updatedComment = await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content,
        },
      }
    );

    return updatedComment;
  }
}

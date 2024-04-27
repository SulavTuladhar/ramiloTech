import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../../helpers/interfaces";
import { repo } from "../../helpers/repo";
import customError from "../../helpers/customError";
import { Comment } from "../../entities/comment.entity";
import { User } from "../../entities/user.entity";

export async function comment(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const user = await repo.userRepo.findOneBy({ id: req.user.id }) as User;
        const blog = await repo.blogRepo.findOneBy({ id: +req.params.id });
        if (!blog) {
            throw customError("Blog not found", 404);
        }
        const comment = new Comment();
        comment.comment = req.body.comment;
        comment.user = user;
        comment.blog = blog;
        const savedComment = await repo.commentRepo.save(comment);
        res.status(200).json({
            data: savedComment,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

export async function updateComment(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const user = await repo.userRepo.findOneBy({ id: req.user.id }) as User;
        const comment = await repo.commentRepo.findOne({ where: { id: +req.params.id }, relations: ['user'] });
        if (!comment) {
            throw customError("Comment not found", 404);
        }
        if (comment.user.id !== user.id) {
            throw customError("Unauthorized! Sorry You Can't Update This Comment", 401);
        }
        comment.comment = req.body.comment;
        const savedComment = await repo.commentRepo.save(comment);
        savedComment.user.password = "";
        savedComment.user.role = "";
        savedComment.user.id = 0;
        res.status(200).json({
            data: savedComment,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

export async function deleteComment(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const user = await repo.userRepo.findOneBy({ id: req.user.id }) as User;
        const comment = await repo.commentRepo.findOne({ where: { id: +req.params.id }, relations: ['user'] });
        if (!comment) {
            throw customError("Comment not found", 404);
        }
        if (comment.user.id !== user.id) {
            throw customError("Unauthorized! Sorry You Can't Delete This Comment", 401);
        }
        await repo.commentRepo.remove(comment);
        res.status(200).json({
            message: "Deleted Successfully",
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}
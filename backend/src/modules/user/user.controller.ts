import { NextFunction, Request, Response } from "express";
import { ExtendedRequest } from "../../helpers/interfaces";
import { repo } from "../../helpers/repo";
import customError from "../../helpers/customError";
import { User } from "../../entities/user.entity";
import { comparePassword, generatePassword } from "../../helpers/passwordHash";
import fs from 'fs';
import path from "path";
import { appDatasource } from "../../appDataSource";
import { Post } from "../../entities/post.entity";
import moment from "moment";

export async function fetchUser(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const user = await repo.userRepo.findOneBy({ id: req.user.id }) as User;
        user.password = "";
        res.status(200).json({
            data: user,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

export async function updateUser(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const data = req.body;
        if (req.fileTypeError) {
            throw customError("Invalid File Format", 400);
        }
        const filename = req.file?.filename as string;
        var user = await repo.userRepo.findOneBy({ id: req.user.id }) as User;
        var oldImg = user?.image;
        user.email = data.email;
        user.name = data.name;
        if (data.password) {
            const isMatched = await comparePassword(data.password, user.password)
            if (!isMatched) { throw customError("Invalid credentials", 401); }
            const hashPassword = await generatePassword(data.password) as string;
            user.password = hashPassword;
        }
        user.image = filename;
        if (req.file && oldImg) {
            fs.unlink(path.join(process.cwd(), '/src/uploads/profile/' + oldImg), (err: any) => {
                if (err) {
                    console.log('Error while removing old img >', err)
                }
            })
        }
        const savedUser = await repo.userRepo.save(user);
        savedUser.password = "";
        res.status(200).json({
            data: savedUser,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

// export async function fetchOwnBlogs(req: ExtendedRequest, res: Response, next: NextFunction) {
//     try {
//         const user = await repo.userRepo.findOneBy({ id: req.user.id });
//         res.json({
//             data: user
//         })
//     } catch (err) {
//         return next(err);
//     }
// }


export async function fetchOwnedBlogs(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user as User;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const offset = (page - 1) * pageSize;
        const blogs = await appDatasource
            .getRepository(Post)
            .createQueryBuilder('blog')
            .select([
                'blog.id as id',
                'blog.title as title',
                'blog.content as content',
                'blog.creationDate as createdDate',
                'blog.image as image',
                'author.name as authorName',
                'category.name as category',
                'tags.name as tagsName'
            ])
            .leftJoin('blog.author', 'author')
            .leftJoin('blog.category', 'category')
            .leftJoin('blog.tags', 'tags')
            .where('author.id = :authorId', { authorId: user.id })
            .orderBy('blog.creationDate', 'DESC')
            .skip(offset)
            .take(pageSize)
            .getRawMany();

        res.status(200).json({
            data: blogs,
            page: page,
            pageSize: pageSize,
            status: 200
        });
        
    } catch (err) {
        return next(err);
    }
}
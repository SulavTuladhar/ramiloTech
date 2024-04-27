import { NextFunction, Request, Response } from "express";
import { ExtendedRequest } from "../../helpers/interfaces";
import { Post } from "../../entities/post.entity";
import { repo } from "../../helpers/repo";
import customError from "../../helpers/customError";
import { Category } from "../../entities/category.entity";
import { Tag } from "../../entities/tag.entity";
import { appDatasource } from "../../appDataSource";
import moment from "moment";
import fs from 'fs';
import path from "path";
import { getRepository } from "typeorm";
import { Comment } from "../../entities/comment.entity";

// Category CRUD
export async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
        let { name } = req.body;
        const redudentCategory = await repo.categoryRepo.findOneBy({ name: name });
        if (redudentCategory) {
            throw customError("Category already exists", 409)
        }
        const category = new Category();
        category.name = name;
        const savedCategory = await repo.categoryRepo.save(category);
        res.status(201).json({
            data: savedCategory,
            status: 201
        })
    } catch (err) {
        return next(err);
    }
}
export async function fetchAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await repo.categoryRepo.find({});
        res.status(200).json({
            data: categories,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const category = await repo.categoryRepo.findOneBy({ id: +id });
        if (!category) {
            throw customError("Category not found", 404)
        }
        await repo.categoryRepo.remove(category);
        res.status(200).json({
            message: "Deleted Successfully",
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

// Tag CRUD
export async function fetchAllTags(req: Request, res: Response, next: NextFunction) {
    try {
        const tags = await repo.tagRepo.find();
        res.status(200).json({
            data: tags,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

export async function createTag(req: Request, res: Response, next: NextFunction) {
    try {
        let { name } = req.body;
        const redudentTag = await repo.tagRepo.findOneBy({ name: name });
        if (redudentTag) {
            throw customError("Tag already exists", 409)
        }
        const tag = new Tag();
        tag.name = name;
        const savedTag = await repo.tagRepo.save(tag);
        res.status(201).json({
            data: savedTag,
            status: 201
        })
    } catch (err) {
        return next(err);
    }
}

export async function deleteTag(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const tag = await repo.tagRepo.findOneBy({ id: +id });
        if (!tag) {
            throw customError("Tag not found", 404)
        }
        await repo.tagRepo.remove(tag);
        res.status(200).json({
            message: "Deleted Successfully",
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

export async function createBlog(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const data = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            tags: Array.isArray(req.body.tags) ? req.body.tags : []
        }
        if (req.fileTypeError) {
            throw customError("Invalid File Format", 400);
        }
        const filename = req.file?.filename as string;
        // const { title, content, category, tags} = req.body;
        const savedCategory = await repo.categoryRepo.findOneBy({ id: +data.category });
        if (!savedCategory) {
            throw customError("Category Not Found", 404)
        }
        var savedTags: Tag[] = [];
        // tags?.forEach(async (tag: string) => {
        //     const savedTag = await repo.tagRepo.findOneBy({ name: tag });
        //     if (!savedTag) {
        //         throw customError("Tag Not Found", 404)
        //     }
        //     savedTags.push(savedTag)
        // })
        const user = req.user;
        const blog = new Post();
        blog.image = filename;
        blog.title = data.title;
        blog.content = data.content;
        blog.author = user;
        blog.category = savedCategory;
        blog.creationDate = moment(new Date()).format("DD/MM/YYYY");
        // blog.tags = tags;
        const savedBlog = await repo.blogRepo.save(blog);
        res.status(201).json({
            data: savedBlog,
            status: 201
        })
    } catch (err) {
        return next(err);
    }
}

export async function fetchAllblogs(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const offset = (page - 1) * pageSize;

        const blogs = await repo.blogRepo.find({
            skip: offset,
            take: pageSize,
            relations: ['category', 'author']
        });

        const formattedBlogs = blogs.map(blog => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            creationDate: blog.creationDate,
            image: blog.image,
            authorName: blog.author?.name,
            category: blog.category?.name
        }));
        res.status(200).json({
            data: formattedBlogs,
            page: page,
            pageSize: pageSize,
            totalItems: blogs.length,
            status: 200
        });
    } catch (err) {
        return next(err);
    }
}

export async function fetchBlogByCat(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const blog = await appDatasource
            .getRepository(Post)
            .createQueryBuilder('blog')
            .select([
                'blog.id as id',
                'blog.title as title',
                'blog.content as content',
                'blog.image as image',
                'blog.creationDate as craetionDate',
                'category.name as category',
                'author.name as author',
            ])
            .where('blog.category = :id', { id: id })
            .leftJoin('blog.tags', 'tag')
            .leftJoin('blog.category', 'category')
            .leftJoin('blog.author', 'author')
            .getRawMany();
        res.status(200).json({
            data: blog,
        })
    } catch (err) {
        return next(err);
    }
}

export async function fetchBlog(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const blog = await appDatasource
            .getRepository(Post)
            .createQueryBuilder('blog')
            .select([
                'blog.id as id',
                'blog.title as title',
                'blog.content as content',
                'blog.image as image',
                'blog.creationDate as craetionDate',
                'category.name as category',
                'author.name as author',
            ])
            .where('blog.id = :id', { id: id })
            .leftJoin('blog.tags', 'tag')
            .leftJoin('blog.category', 'category')
            .leftJoin('blog.author', 'author')
            .getRawOne();
        if (!blog) {
            throw customError("Not Not Found", 404)
        }
        const comments = await appDatasource
            .getRepository(Comment)
            .createQueryBuilder('comment')
            .select([
                'comment.id as id',
                'comment.comment as comment',
                'user.id as userId',
                'user.name as userName',
                'user.email as userEmail',
            ])
            .where('comment.blog = :blog', { blog: blog.id })
            .leftJoin('comment.user', 'user')
            .getRawMany();
        const formattedResult = {
            id: blog.id,
            title: blog.title,
            content: blog.content,
            creationDate: blog.craetionDate,
            category: blog.category,
            image: blog.image,
            authorName: blog.author,
            comments: comments
        };

        res.status(200).json({
            data: formattedResult,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

export async function updateBlog(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user;
        const { id } = req.params
        const { title, content } = req.body;
        if (req.fileTypeError) {
            throw customError("Invalid File Format", 400);
        }
        const filename = req.file?.filename as string;
        var blog = await appDatasource
            .getRepository(Post)
            .createQueryBuilder('blog')
            .select()
            .where('blog.author.id = :user', { user: user.id })
            .andWhere('blog.id = :id', { id: id })
            .getOne()
        if (!blog) {
            throw customError("blog not found", 404)
        }
        var oldImg = user?.image;
        user.image = filename;
        blog.title = title;
        blog.content = content;
        if (req.file && oldImg) {
            fs.unlink(path.join(process.cwd(), '/src/uploads/blog/' + oldImg), (err: any) => {
                if (err) {
                    console.log('Error while removing old img >', err)
                }
            })
        }
        const updatedBlog = await repo.blogRepo.save(blog);
        res.status(200).json({
            data: updatedBlog,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}

export async function deleteBlog(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user;
        const { id } = req.params
        const Blog = await appDatasource
            .getRepository(Post)
            .createQueryBuilder('blog')
            .select()
            .where('blog.author.id = :user', { user: user.id })
            .andWhere('blog.id = :id', { id: id })
            .getOne()
        if (!Blog) {
            throw customError("Blog not found", 404)
        }
        await appDatasource
            .getRepository(Post)
            .remove(Blog);
        res.status(200).json({
            message: "Deleted Successfully",
            status: 200
        })
    } catch (err) {
        return next(err)
    }
}

export async function searchBlog(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const data = req.body;
        var blog = await appDatasource
            .getRepository(Post)
            .createQueryBuilder("blog")
            .select()
            .innerJoin("blog.category", "category")
            .where("blog.title like :title", { title: `%${data.title}%` })
            .orWhere('category.name = :cat', { cat: data.category })
            .getMany()

        res.status(200).json({
            data: blog,
            status: 200
        })
    } catch (err) {
        next(err);
    }
}
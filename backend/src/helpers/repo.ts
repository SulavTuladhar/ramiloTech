import { appDatasource } from "../appDataSource";
import { Category } from "../entities/category.entity";
import { Comment } from "../entities/comment.entity";
import { Post } from "../entities/post.entity";
import { Tag } from "../entities/tag.entity";
import { User } from "../entities/user.entity";

export const repo = {
    userRepo: appDatasource.getRepository(User),
    blogRepo: appDatasource.getRepository(Post),
    tagRepo: appDatasource.getRepository(Tag),
    categoryRepo: appDatasource.getRepository(Category),
    commentRepo: appDatasource.getRepository(Comment),
}
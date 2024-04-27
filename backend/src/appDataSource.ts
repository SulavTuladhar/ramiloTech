import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Post } from "./entities/post.entity";
import { Tag } from "./entities/tag.entity";
import { Category } from "./entities/category.entity";
import { Comment } from "./entities/comment.entity";

export const appDatasource = new DataSource({
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": "ramailotech",
    "synchronize": true,
    "logging": true,
    "entities": [User, Post, Tag, Category, Comment],
})
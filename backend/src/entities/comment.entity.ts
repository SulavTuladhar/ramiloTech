import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'longtext' })
    comment !: string;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    blog!: Post;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user!: User;

}
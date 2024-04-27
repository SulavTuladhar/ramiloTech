import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Tag } from "./tag.entity";
import { Category } from "./category.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index({ fulltext: true })
    title!: string;

    @Column({ type: 'longtext' })
    content !: string;

    @Column()
    image!: string;

    @Column()
    creationDate !: string;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    author!: User;

    @ManyToOne(() => Category, (category) => category.posts, { onDelete: 'CASCADE' })
    category!: Category;

    @OneToMany(() => Tag, (tag) => tag.post)
    tags!: Tag[]

    @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true })
    comments!: Comment[]
}
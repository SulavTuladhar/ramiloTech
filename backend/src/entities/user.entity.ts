import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "./enum";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email !: string;

    @Column({ nullable: false })
    password!: string;

    @Column()
    image!: string;

    @Column({
        type: "enum",
        enum: RoleEnum,
        default: RoleEnum.USER
    })
    role!: string;

    @OneToMany(() => Post, (post) => post.author, { cascade: true })
    @JoinColumn()
    posts!: Post[]

    @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
    comments!: Comment[]
}
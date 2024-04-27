import { NextFunction, Request, Response } from "express";
import { configs } from "../../configs";
import { User } from "../../entities/user.entity";
import { comparePassword, generatePassword } from "../../helpers/passwordHash";
import { repo } from "../../helpers/repo";
import customError from "../../helpers/customError";
import { RoleEnum } from "../../entities/enum";

const jwt = require('jsonwebtoken');

function createToken(id: number) {
    let token = jwt.sign({ id: id }, configs.JWT_SEC)
    return token;
}

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        let { name, email, password, role } = req.body;
        if (role == 'admin') {
            const admin = await repo.userRepo.findOneBy({ role: RoleEnum.ADMIN });
            if (admin) {
                throw customError("Admin Exists. There can be only one admin in this system", 401)
            }
        }
        var user = new User();
        user.name = name;
        user.email = email;
        user.role = role;
        const hashpassword = await generatePassword(password) as string;
        user.password = hashpassword;
        await repo.userRepo.save(user);
        res.status(201).json({
            message: 'User Created',
            status: 201
        })
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            return next({
                message: "Email is already registered",
                status: 400
            })
        } else {
            return next(err)
        }
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        let { email, password } = req.body;
        const user = await repo.userRepo.findOneBy({ email: email });
        if (!user) {
            throw customError("Invalid credentials", 401);
        }
        const matched = await comparePassword(password, user.password)
        if (!matched) {
            throw customError("Invalid credentials", 401);
        }
        let token = createToken(user.id);
        user.password = "";
        res.status(200).json({
            data: user,
            token,
            status: 200
        })
    } catch (err) {
        return next(err);
    }
}
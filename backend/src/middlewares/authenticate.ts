import { NextFunction, Request, Response } from 'express';
import { configs } from '../configs';
import { repo } from '../helpers/repo';
import { User } from '../entities/user.entity';
import { ExtendedRequest } from '../helpers/interfaces';

const jwt = require('jsonwebtoken');

export default function (req: ExtendedRequest, res: Response, next: NextFunction) {
    let token;
    if (req.headers['authorization'])
        token = req.headers['authorization']
    if (!token) {
        return next({
            message: "Auth failed, token not provided",
            status: 401
        })
    }

    jwt.verify(token, configs.JWT_SEC, async function (err: any, decoded: any) {
        if (err) {
            return next(err);
        }
        try {
            const user = await repo.userRepo.findOneBy({ id: decoded.id });
            if (!user) {
                next({
                    message: "Auth failed, user not found",
                    status: 401
                })
            }
            req.user = user as User;
            req.user.password = "";
            next();
        } catch (err) {
            return next(err);
        }
    })
}
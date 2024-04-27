import { NextFunction, Request, Response } from "express";

exports.restrictTo = (...roles: any) => {
    return (req: any, res: Response, next: NextFunction) => {
        console.log("yaha aye ta ma ", roles);

        // roles ['admin', ]. role='user'
        if (!roles.includes(req.user.role)) {
            return next({
                message: 'You do not have permission to perform this action',
                status: 403
            }
            );
        }
        next();
    };
};
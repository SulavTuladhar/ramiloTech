import { Request } from "express";
import { User } from "../entities/user.entity";
import { File, FileOptions } from "buffer";

export interface ExtendedError extends Error {
    status: number
}

export interface ExtendedRequest extends Request {
    user: User
    fileTypeError: boolean,
    file: ExtendedFile
}

export interface ExtendedFile extends File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    filename: string;
    buffer: Buffer;
    size: number;
}
import { ExtendedError } from "./interfaces";

export default function customError(errMsg: string, status: number){
    var error = new Error(errMsg) as ExtendedError;
    error.status = status;
    return error
}
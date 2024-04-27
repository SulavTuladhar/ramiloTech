import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { appDatasource } from './appDataSource';
const app = express();
const PORT = 9090;

// initializing database
appDatasource.initialize()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log('Error while connecting to database >', err))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static('uploads'));
app.use('/files', express.static(path.join(process.cwd(), '/src/uploads')));

const API_ROUTE = require('./api.router');
app.use('/', API_ROUTE)

app.use((req: Request, res: Response, next: NextFunction) => {
    next({
        message: "Page Not Found",
        status: 404
    })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 400);
    res.json({
        message: err.message || err,
        status: err.status || 400
    })
})

app.listen(PORT, () => console.log("Server started on port " + PORT));
import {Request, Response, NextFunction} from "express";
import prisma from "./../config/database.js";
import * as tokenProvider from "./../providers/tokenProvider.js"

export async function validateToken (req: Request, res: Response, next : NextFunction) {

const { authorization } = req.headers;

    const token = authorization?.replace('Bearer', '').trim();
    if (!token) {
        throw { name: "notFound", message: "Inexistent Token"}
    }

    const {id} = tokenProvider.decode(token);

    const user = await prisma.instructor.findUnique({where: {id}});

    console.log(user);

    if (!user) {
        throw {name: "notFound", message: "User not found"}
    }

    res.locals.user = user;
     
    next();
}
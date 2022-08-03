import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.TOKEN_SECRET || "secret";
const EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "1d";

interface TokenPayload {
    id: number
}

export function encode (payload : TokenPayload): string {
    return jwt.sign(payload, SECRET, {expiresIn: EXPIRES_IN})
}

export function decode (token: string): TokenPayload {
    try {
        return jwt.verify(token, SECRET) as TokenPayload
    } 
    catch (error) {
        throw { name: "notAuthorized", message: "Invalid token"}    
    }
}
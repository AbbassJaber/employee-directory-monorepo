import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from '@/types';

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET'];
const ACCESS_EXPIRES_IN = process.env['JWT_ACCESS_EXPIRES_IN'];

export const generateAccessToken = (userId: number, email: string): string => {
    return jwt.sign({ userId, email }, ACCESS_SECRET!, {
        expiresIn: ACCESS_EXPIRES_IN!,
    } as jwt.SignOptions);
};

export const generateRefreshTokenId = (): string => {
    return uuidv4();
};

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, ACCESS_SECRET!) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid access token');
    }
};

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch (error) {
        return null;
    }
};

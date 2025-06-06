import jwt from 'jsonwebtoken'
import { Response } from 'express'
import APIError from './api-error.js'

const createJWT = (payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as any, {
    expiresIn: process.env.JWT_LIFETIME as any,
  })
  return token
}

const isTokenValid = (token: any) => jwt.verify(token, process.env.JWT_SECRET as any)

const attachCookiesToResponse = (res: Response, user: any) => {
  const token = createJWT(user)

  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

const createTokenUser = (user: any) => {
  return { name: user.name, userId: user._id, role: user.role }
}

const checkPermissions = (requestUser: any, resourceUserId: any) => {
  if (requestUser.role === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return
  throw new APIError('Not authorized to access this route', 401)
}

export { createJWT, isTokenValid, attachCookiesToResponse, createTokenUser, checkPermissions }

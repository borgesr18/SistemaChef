import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const signToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' })
}

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}

export const getAuthUser = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    const user = await prisma.usuario.findUnique({
      where: { id: payload.userId }
    })

    return user
  } catch (error) {
    return null
  }
}

export const requireAuth = async (req: NextRequest) => {
  const user = await getAuthUser(req)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export const requireRole = async (req: NextRequest, allowedRoles: string[]) => {
  const user = await requireAuth(req)
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
  return user
}

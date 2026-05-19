import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types/auth'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    let token: string | undefined

    // Primeiro, tentar obter token do header Authorization
    const authHeader = request.headers.authorization
    if (authHeader) {
      token = authHeader.replace('Bearer ', '')
    }

    // Se não houver token no header, tentar obter do cookie
    if (!token) {
      token = request.cookies?.authToken
    }

    if (!token) {
      return reply.status(401).send({
        error: 'Token de acesso não fornecido'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

    // Adicionar informações do usuário à requisição
    request.user = decoded
  } catch (error) {
    return reply.status(401).send({
      error: 'Token de acesso inválido'
    })
  }
}

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h'
  })
}

export async function adminMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  await authMiddleware(request, reply)

  if (reply.sent) return

  if (request.user?.tipo !== 'ADMIN') {
    return reply.status(403).send({
      error: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    })
  }
}

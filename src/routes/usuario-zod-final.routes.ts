import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UsuarioController } from '../controllers/usuario.controller.js'
import { registerSchema, loginSchema, updateUserSchema, loginResponseSchema, userSchema, changePasswordSchema } from '../types/auth.js'
import { authMiddleware } from '../middleware/auth.js'

export async function usuarioZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // Schemas auxiliares usando funcionalidades modernas do Zod v4
  const ParamsSchema = z.object({
    id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do usuário')
  })

  const QuerySchema = z.object({
    skip: z.coerce.number().int().min(0, { message: 'Skip deve ser >= 0' }).default(0).describe('Registros para pular'),
    take: z.coerce.number().int().min(1, { message: 'Take deve ser >= 1' }).max(100, { message: 'Máximo 100 registros' }).default(10).describe('Registros para retornar'),
    orderBy: z.string().optional().describe('Campo para ordenação')
  })



  // Schemas de resposta para diferentes operações
  const SuccessResponseSchema = z.object({
    message: z.string()
  })

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string().optional()
  })

  // POST /usuarios/register - Registro de usuário
  app.post('/register', {
    schema: {
      description: 'Registrar novo usuário no sistema',
      tags: ['Usuários'],
      summary: 'Registrar usuário',
      body: registerSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: userSchema.omit({ createdAt: true, updatedAt: true })
        }),
        400: ErrorResponseSchema,
        409: ErrorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.register(request, reply)
  })

  // POST /usuarios/login - Login de usuário
  app.post('/login', {
    schema: {
      description: 'Autenticar usuário no sistema',
      tags: ['Usuários'],
      summary: 'Login de usuário',
      body: loginSchema,
      response: {
        200: loginResponseSchema,
        401: ErrorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.login(request, reply)
  })

  // POST /usuarios/logout - Logout de usuário
  app.post('/logout', {
    schema: {
      description: 'Encerrar sessão do usuário',
      tags: ['Usuários'],
      summary: 'Logout de usuário',
      response: {
        200: SuccessResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.logout(request, reply)
  })

  // GET /usuarios/perfil - Obter perfil do usuário logado
  app.get('/perfil', {
    preHandler: authMiddleware,
    schema: {
      description: 'Obter dados do usuário com sessão ativa',
      tags: ['Usuários'],
      summary: 'Perfil do usuário logado',
      response: {
        200: z.object({
          message: z.string(),
          data: userSchema
        }),
        401: ErrorResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.getProfile(request, reply)
  })

  // PUT /usuarios/perfil/atualizar - Atualizar perfil do usuário logado
  app.put('/perfil/atualizar', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados do próprio perfil',
      tags: ['Usuários'],
      summary: 'Atualizar perfil próprio',
      body: updateUserSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: userSchema
        }),
        401: ErrorResponseSchema,
        409: ErrorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.updateProfile(request, reply)
  })

  // POST /usuarios/alterar-senha - Alterar senha do usuário logado
  app.post('/alterar-senha', {
    preHandler: authMiddleware,
    schema: {
      description: 'Alterar senha do usuário logado',
      tags: ['Usuários'],
      summary: 'Alterar senha',
      body: changePasswordSchema,
      response: {
        200: SuccessResponseSchema,
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.changePassword(request, reply)
  })

  // GET /usuarios - Listar usuários
  app.get('/', {
    schema: {
      description: 'Listar todos os usuários do sistema',
      tags: ['Usuários'],
      summary: 'Listar usuários',
      querystring: QuerySchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.array(userSchema)
        })
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.findMany(request, reply)
  })

  // GET /usuarios/:id - Buscar usuário por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar usuário específico por ID',
      tags: ['Usuários'],
      summary: 'Buscar usuário por ID',
      params: ParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: userSchema
        }),
        404: ErrorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.findById(request, reply)
  })

  // PUT /usuarios/:id - Atualizar usuário
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de um usuário específico',
      tags: ['Usuários'],
      summary: 'Atualizar usuário',
      params: ParamsSchema,
      body: updateUserSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: userSchema
        }),
        404: ErrorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.update(request, reply)
  })

  // DELETE /usuarios/:id - Deletar usuário
  app.delete('/:id', {
    schema: {
      description: 'Deletar um usuário do sistema',
      tags: ['Usuários'],
      summary: 'Deletar usuário',
      params: ParamsSchema,
      response: {
        200: SuccessResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = new UsuarioController(app.prisma)
    return controller.delete(request, reply)
  })
}


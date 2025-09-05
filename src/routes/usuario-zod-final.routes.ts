import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UsuarioController } from '../controllers/usuario.controller.js'

export async function usuarioZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new UsuarioController(app.prisma)

  // Schemas Zod para validação interna
  const CreateUsuarioZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email deve ser válido'),
    senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
  })

  const UpdateUsuarioZod = z.object({
    nome: z.string().min(1).optional(),
    email: z.string().email().optional(),
    senha: z.string().min(6).optional(),
    ativo: z.boolean().optional()
  })

  const LoginZod = z.object({
    email: z.string().email('Email deve ser válido'),
    senha: z.string().min(1, 'Senha é obrigatória')
  })

  // POST /usuarios/register - Registro de usuário
  app.post('/register', {
    schema: {
      description: 'Registrar novo usuário no sistema',
      tags: ['Usuários'],
      summary: 'Registrar usuário',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome completo do usuário' },
          email: { type: 'string', format: 'email', description: 'Email válido do usuário' },
          senha: { type: 'string', minLength: 6, description: 'Senha com pelo menos 6 caracteres' }
        },
        required: ['nome', 'email', 'senha']
      },
      response: {
        201: {
          description: 'Usuário registrado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                email: { type: 'string', format: 'email' },
                ativo: { type: 'boolean' }
              }
            }
          }
        },
        400: {
          description: 'Erro de validação',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        409: {
          description: 'Email já cadastrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.register(request, reply)
  })

  // POST /usuarios/login - Login de usuário
  app.post('/login', {
    schema: {
      description: 'Autenticar usuário no sistema',
      tags: ['Usuários'],
      summary: 'Login de usuário',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', description: 'Email do usuário' },
          senha: { type: 'string', description: 'Senha do usuário' }
        },
        required: ['email', 'senha']
      },
      response: {
        200: {
          description: 'Login realizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                email: { type: 'string', format: 'email' }
              }
            }
          }
        },
        401: {
          description: 'Credenciais inválidas',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = LoginZod.parse(request.body)
    return controller.login(request, reply)
  })

  // GET /usuarios - Listar usuários
  app.get('/', {
    schema: {
      description: 'Listar todos os usuários do sistema',
      tags: ['Usuários'],
      summary: 'Listar usuários',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Lista de usuários',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  nome: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  ativo: { type: 'boolean' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request, reply)
  })

  // GET /usuarios/:id - Buscar usuário por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar usuário específico por ID',
      tags: ['Usuários'],
      summary: 'Buscar usuário por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Usuário encontrado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                email: { type: 'string', format: 'email' },
                ativo: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Usuário não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request, reply)
  })

  // PUT /usuarios/:id - Atualizar usuário
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de um usuário específico',
      tags: ['Usuários'],
      summary: 'Atualizar usuário',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 6 },
          ativo: { type: 'boolean' }
        }
      },
      response: {
        200: {
          description: 'Usuário atualizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                email: { type: 'string', format: 'email' },
                ativo: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Usuário não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = UpdateUsuarioZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /usuarios/:id - Deletar usuário
  app.delete('/:id', {
    schema: {
      description: 'Deletar um usuário do sistema',
      tags: ['Usuários'],
      summary: 'Deletar usuário',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Usuário deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Usuário não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, controller.delete.bind(controller))
}

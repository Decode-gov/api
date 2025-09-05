import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod'
import { prismaPlugin } from './plugins/prisma.js'
import { registerAllRoutes } from './routes/index.js'
import { AuditMiddleware } from './middleware/audit.middleware.js'

const app = Fastify({
  logger: true
}).withTypeProvider<ZodTypeProvider>()

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Register Swagger
await app.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de dados governamentais - DECODE-GOV',
      description: 'API completa para gestão de dados governamentais com validação Zod.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de desenvolvimento'
      }
    ],
    tags: [
      { name: 'Usuários', description: 'Gestão de usuários' },
      { name: 'Sistemas', description: 'Gestão de sistemas' },
      { name: 'Tabelas', description: 'Gestão de tabelas' },
      { name: 'Colunas', description: 'Gestão de colunas' },
      { name: 'Comunidades', description: 'Gestão de comunidades' },
      { name: 'Políticas Internas', description: 'Gestão de políticas' },
      { name: 'Processos', description: 'Gestão de processos' },
      { name: 'KPIs', description: 'Gestão de KPIs' },
      { name: 'Termos', description: 'Gestão de termos' },
      { name: 'Bancos de Dados', description: 'Gestão de bancos de dados' },
      { name: 'Papéis', description: 'Gestão de papéis e responsabilidades' },
      { name: 'Necessidades de Informação', description: 'Gestão de necessidades de informação' },
      { name: 'Regras de Negócio', description: 'Gestão de regras de negócio' },
      { name: 'Listas de Referência', description: 'Gestão de listas de referência e valores padronizados' }
    ]
  }
})

await app.register(swaggerUi, {
  routePrefix: '/',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => {
    return swaggerObject
  },
  transformSpecificationClone: true
})

await app.register(sensible)
await app.register(cors, { origin: true })
await app.register(prismaPlugin)

// Register audit middleware
AuditMiddleware.register(app)

// Register all model routes
await registerAllRoutes(app)

const port = Number(process.env.PORT || 3333)
const host = process.env.HOST || '0.0.0.0'

try {
  await app.listen({ port, host })
  app.log.info(`HTTP server running on http://${host}:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const yaml = require('js-yaml')
const fs = require('fs')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')
const Subscription = require('./resolvers/Subscription')

try {
  var config = yaml.safeLoad(fs.readFileSync('./database/prisma.yml', 'utf8'))
} catch (e) {
  console.log(e);
}

const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  Subscription
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: config.endpoint,
      secret: config.secret,
      debug: true
    })
  })
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
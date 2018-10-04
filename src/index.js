const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const yaml = require('js-yaml')
const fs = require('fs')

try {
  var config = yaml.safeLoad(fs.readFileSync('./database/prisma.yml', 'utf8'));
} catch (e) {
  console.log(e);
}

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
    // single: (root, args) => {
    //   let singleLink = links.filter(f => f.id === args.id)
    //   //console.log(singleLink[0])
    //   return singleLink[0]
    // }
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description
        }
      }, info)
    },
    // put: (root, args) => {
    //   let changedLink = null
    //   links.find((f) => {
    //     //update the one with same id
    //     if(f.id === args.id) {
    //       changedLink = f;
    //       f.url = args.url
    //       f.description = args.description
    //     }
    //   })
    //   //can be done with this one line
    //   return changedLink
    // },
    // delete: (root, args) => {
    //   let targetLink = links.filter(f => f.id === args.id)
    //   links = links.filter(f => f.id !== args.id)//don't include in links the above filtered
    //   return targetLink[0]
    // }
  },
  // Link: {
  //   id: (root) => root.id,
  //   description: (root) => root.description,
  //   url: (root) => root.url,
  // }
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
});

server.start(() => console.log(`Server is running on http://localhost:4000`))
const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    single: (root, args) => {
      let singleLink = links.filter(f => f.id === args.id)
      //console.log(singleLink[0])
      return singleLink[0]
    }
  },
  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link)
      return link
    },
    put: (root, args) => {
      let changedLink = null
      links.find((f) => {
        //update the one with same id
        if(f.id === args.id) {
          changedLink = f;
          f.url = args.url
          f.description = args.description
        }
      })
      //can be done with this one line
      return changedLink
    },
    delete: (root, args) => {
      let targetLink = links.filter(f => f.id === args.id)
      links = links.filter(f => f.id !== args.id)//don't include in links the above filtered
      return targetLink[0]
    }
  },
  // Link: {
  //   id: (root) => root.id,
  //   description: (root) => root.description,
  //   url: (root) => root.url,
  // }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`))
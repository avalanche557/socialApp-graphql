const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs')

const { MONGODB } = require('./config.js')
const resolvers = require('./graphql/resolvers/index')
const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('mongoDB connected')
        return server.listen({ port: 5000 })
    })
    .then(res => {
        console.log(`server running at ${res.url}`)
    })




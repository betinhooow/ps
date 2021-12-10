const { ApolloServer } = require('apollo-server');
const SessionAPI = require('./datasource/sessions');
const SpeakerAPI = require('./datasource/speakers');

const typeDefs = require('./schema.js');

const resolvers = require('./resolvers.js');

const dataSources = () => ({
  sessionAPI: new SessionAPI(),
  speakerAPI: new SpeakerAPI()
})
const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  dataSources,
  debug: false,
  formatError: (err) => {
    if(err.extensions.code == "INTERNAL_SERVER_ERROR") {
      return new ApolloError("We are having some trouble", "ERROR", {
        token: "uniquetoken"
      })
    }
  }
});

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => {
    console.log(`graphQL running at ${url}`);
  })
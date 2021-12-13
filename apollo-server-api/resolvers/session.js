const { ApolloError } = require("apollo-server");

module.exports = {
  speakers: async (session, args, { dataSources }, info) => {
    try {
      const speakers = await dataSources.speakerAPI.getSpeakers();
  
      return speakers.filter(
        speaker => speaker.sessions.find(({ id }) => id == session.id)
      )
    } catch (error) {
      return new ApolloError("Unable to get speakers", "SPEAKAPIERROR", {
        token: "uniqueerror"
      })
    }
  }
}
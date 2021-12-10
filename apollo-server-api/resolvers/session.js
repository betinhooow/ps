module.exports = {
  speakers: async (session, args, { dataSources }, info) => {
    const speakers = await dataSources.speakerAPI.getSpeakers();

    return speakers.filter(
      speaker => speaker.sessions.find(({ id }) => id == session.id)
    )
  }
}
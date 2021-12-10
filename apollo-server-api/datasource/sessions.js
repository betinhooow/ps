const sessions = require('./../data/sessions.json');
const { DataSource } = require('apollo-datasource')
const _ = require('lodash');

class SessionAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {

  }

  getSessions(args) {
    return _.filter(sessions, args);
  }

  getSessionById(id) {
    return _.find(sessions, { id: parseInt(id) });
  }

  toggleFavoriteSession(id) {
    const session =  _.find(sessions, { id: parseInt(id) });
    session.favorite = !session.favorite;

    return session;
  }

  addSession(session) {
    session.id = 13;
    sessions.push(session);

    return session;
  }
}

module.exports = SessionAPI;
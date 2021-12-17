const Query = require("./query");
const Mutation = require("./mutation");
const Session = require("./sessions");
const Speaker = require("./speakers");
const Subscription = require("./subscriptions");
const User = require("./users");
const resolvers = { Query, Mutation, Session, Subscription, Speaker, User };

module.exports = resolvers;

const express = require("express");
const path = require("path");
const db = require("./config/connection");
//

// creating appolo server
const { ApolloServer } = require("apollo-server-express");
//authMiddleware
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");
const app = express();
//create port variables
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
server.applyMiddleware({ app });

// ...serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));
}
//
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
//
db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

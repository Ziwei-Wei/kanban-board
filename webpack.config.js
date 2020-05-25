const clientDevelopment = require("./webpack.client.dev.config");
const clientProduction = require("./webpack.client.prod.config");
const server = require("./webpack.server.config");

module.exports = (_, argv) => {
  switch (argv.mode) {
    case "development":
      return [clientDevelopment, server];
    case "production":
      return [clientProduction, server];
    default:
      return [];
  }
};

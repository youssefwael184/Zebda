const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Goal Guesser API",
      version: "1.0.0",
      description: "Football Hangman API",
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
  },
  // This is correct because swagger.js is inside src/
  apis: [path.join(__dirname, "routes/*.js")],
};

module.exports = swaggerJsdoc(options);
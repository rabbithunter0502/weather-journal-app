// Dependencies
const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const SERVER_PORT = 8080;

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Start up an instance of server
const server = express();

// Middleware
server.use(parser.urlencoded({ extended: false }));

server.use(parser.json());

server.use(cors());

server.use(express.static('website'));

// Handle request form client
const addWeatherData = (req, res) => {
    projectData = req?.body;
    res.send(projectData);
}
server.post('/postWeatherData', addWeatherData);

const getWeatherData = (req, res) => {
    res.send(projectData);
};
server.get('/getWeatherData', getWeatherData);


server.listen(SERVER_PORT, () => {
    console.log(`server port is: ${SERVER_PORT}`);
});
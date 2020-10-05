const redis = require("redis");

const client = redis.createClient({
  port: 6379,
  host: "127.0.0.1",
}); // By default it will be in 127.0.0.1:6379

client.on("connect", () => {
  console.log("Client connected to REDIS");
});

client.on("ready", () => {
  console.log("Client connected to Redis and ready to use...");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", () => {
  console.log("Client disconnected from redis");
});

// We want to STOP Redis when we press CTRL+C in our application:
process.on("SIGINT", () => {
  console.log("Closing redis connection before shutting down the app");
  // This will make the client quit from redit when the application stops:
  client.quit();
});

// Note that 'process.on()' will still work if we export the client!!!
module.exports = client;

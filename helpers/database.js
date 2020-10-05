const mongoose = require("mongoose");
// database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

mongoose.connection.on("connected", () => {
  console.log(`Mongoose is connected to the ${process.env.DB_NAME} db`);
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Closing mongoose connection before shutting down the app");
  process.exit(0); // Check that this should be a 0, normally
});

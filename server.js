const express = require("express");
const app = express();
const server = require("http").createServer(app);

const path = require("path");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoutes = require("./routes/user.routes");

app.use("/api/images", express.static(path.join(__dirname, "images")));

app.use("/api/users", userRoutes);

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3001");

server.listen(port, () => {
  console.log("Listening on " + port);
});

const app = require("./src/app");
const API_PORT = process.env.API_PORT;

app.listen(API_PORT);
console.info(`🚀 Server started on http://localhost:${API_PORT}`);

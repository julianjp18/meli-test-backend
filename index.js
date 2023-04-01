const app = require("./app");

const PORT = 3000;
const HOST_NAME = "localhost";

app.listen(PORT, HOST_NAME, () => {
    console.log(`Server running at ${HOST_NAME}:${PORT}`)
});
const itemsRouter = require("./items");

function routerApi(app) {
    app.use("/api/items", itemsRouter);
}

module.exports = routerApi;
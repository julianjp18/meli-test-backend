const express = require("express");

const ItemsService = require('../services/items');
const validateParams = require("../middleware/queryParams");

const itemsRouter = express.Router();
const service = new ItemsService();

const PROJECT_INFO = {
    name: 'Julian',
    lastname: 'Perez',
};

itemsRouter.get("/:itemId", async (req, res, next) => {
    try {
        const { itemId } = req.params;
        if (itemId) {
            const itemSelected = await service.findOne(itemId);
            res.status(200).json({
                author: PROJECT_INFO,
                ...itemSelected
            });
        } else {
            res.status(404).json({
                message: 'ItemId not found',
            });
        }
    } catch(e) {
        next(e);
    }
});

itemsRouter.get("/", validateParams, async (req, res, next) => {
    try {
        const { q } = req.query;
        let queryParam = q ?? ':query';
        if (queryParam) {
            const itemsList = service.find(queryParam);
            res.status(200).json({
                author: PROJECT_INFO,
                ...itemsList
            });
        }
    } catch(e) {
        next(e);
    }
});

module.exports = itemsRouter;
const axios = require('axios');
const boom = require('@hapi/boom');

const MAIN_URL = 'https://api.mercadolibre.com/';

class ItemsService {

    constructor() {
        this.items = [];
        this.getData();
    }

    setItems(newItems) {
        this.items = newItems;
    }

    async getData(queryParam = ':query') {
        try {
            const { data } = await axios.get(`${MAIN_URL}sites/MLA/search?q=${queryParam}`);
            if (!data) throw boom.notFound('Data not found');
            let categories = [];
            const itemsList = [];
            data.results.forEach(({
                category_id,
                condition,
                id,
                thumbnail,
                shipping: { free_shipping },
                installments: { currency_id, amount, rate },
            }) => {
                categories.push(category_id);
                itemsList.push({
                    id,
                    condition,
                    picture: thumbnail,
                    price: {
                        currency: currency_id,
                        amount,
                        decimals: rate,
                    },
                    free_shipping,
                })
            });
            if (categories.length > 0) categories = [...new Set(categories)];
            this.setItems({
                categories,
                items: itemsList,
            });
        } catch(e) {
            throw boom.notAcceptable(e.message);
        }
    }

    find(queryParam) {
        this.getData(queryParam);
        if (!this.items) throw boom.notFound('Items not found');
        return this.items;
    }

    async findOne(itemId) {
        const { data: generalData } = await axios.get(`${MAIN_URL}items/${itemId}`);
        const { data: description } = await axios.get(`${MAIN_URL}items/${itemId}/description`);
        const {
            condition,
            id,
            title,
            thumbnail,
            currency_id,
            shipping: { free_shipping },
            sold_quantity,
        } = generalData;
        const { plain_text } = description;
        if (!generalData || !description) throw boom.notFound('Data not found');
        const itemFounded = {
            id,
            condition,
            free_shipping,
            picture: thumbnail,
            price: {
                currency: currency_id,
            },
            title,
            sold_quantity,
        };
        
        return {
            item: {
                ...itemFounded,
                description: plain_text,
            },
        };
    }
}

module.exports = ItemsService;
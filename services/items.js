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
                installments: { currency_id, amount, rate },
                shipping: { free_shipping },
                thumbnail,
                title,
            }) => {
                categories.push(category_id);
                itemsList.push({
                    id,
                    condition,
                    title,
                    category_id,
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
            category_id,
            condition,
            currency_id,
            id,
            pictures,
            price,
            shipping: { free_shipping },
            sold_quantity,
            title,
            thumbnail,
        } = generalData;
        const { plain_text } = description;
        if (!generalData || !description) throw boom.notFound('Data not found');
        const itemFounded = {
            id,
            condition,
            free_shipping,
            category_id,
            picture: pictures[0].url ?? thumbnail,
            price: {
                currency: currency_id,
                amount: price,
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
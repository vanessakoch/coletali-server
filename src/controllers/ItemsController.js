const knex = require('../database/connection');

class ItemsController {
  async index(request, response) {
    const items = await knex('item').select('*');

    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.2.112:3333/assets/${item.image}`,
        isDonationItem: item.isDonationItem,
        information: item.information
      };
    })

    return response.json(serializedItems);
  }
}

module.exports = ItemsController;
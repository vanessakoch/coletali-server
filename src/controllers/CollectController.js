const knex = require('../database/connection');

class CollectController {

  async all(request, response) {
    const collections = await knex('collection_point')
      .join('address', 'collection_point.address_id', '=', "address.id")
      .select('collection_point.*')
      .select('address.latitude')
      .select('address.longitude')
      .select('address.number')
      .select('address.city')
      .select('address.uf')

    const serializedPoints = collections.map(point => {
      return {
        ...point,
        image_url: `http://192.168.2.112:3333/uploads/${point.image}`
      };
    })
    response.json(serializedPoints)
  }

  async index(request, response) {
    const items = request.query.items

    const parsedItems = String(items).split(',').map(item => item.trim());
    const collectionPoint = await knex('collection_point')
      .join('collection_point_items', 'collection_point.id', '=', 'collection_point_items.collect_id')
      .whereIn('collection_point_items.item_id', parsedItems)
      .join('address', 'collection_point.address_id', '=', 'address.id')
      .select('collection_point.*')
      .select('address.latitude')
      .select('address.longitude')
      .select('address.number')
      .select('address.city')
      .select('address.uf')
      .distinct();

    const serializedPoints = collectionPoint.map(point => {
      return {
        ...point,
        image_url: `http://192.168.2.112:3333/uploads/${point.image}`
      };
    })
    response.json(serializedPoints)
  }

  async show(request, response) {
    const { id } = request.params;

    const collect = await knex('collection_point')
      .where('collection_point.id', id).first()
      .join('address', 'collection_point.address_id', '=', 'address.id')
      .select('collection_point.*')
      .select('address.latitude')
      .select('address.longitude')
      .select('address.number')
      .select('address.city')
      .select('address.uf')

    if (!collect) {
      return response.status(400).json({ message: 'Ponto de coleta não encontrado.' })
    }

    const serializedPoint = {
      ...collect,
      image_url: `http://192.168.2.112:3333/uploads/${collect.image}`
    }

    const items = await knex('item')
      .join('collection_point_items', 'item.id', '=', 'collection_point_items.item_id')
      .where('collection_point_items.collect_id', id)
      .select('item.id')
      .select('item.title')
      .select('item.information');

    return response.json({ collect: serializedPoint, items });
  }

  async create(request, response) {
    const {
      name,
      email,
      whatsapp,
      items,
      address_id,
      user_id
    } = request.body;

    const trx = await knex.transaction();

    const collect = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      address_id,
      user_id
    }

    const insertedIds = await trx('collection_point').insert(collect);

    const collect_id = insertedIds[0];

    const collectItems = items
      .split(',')
      .map(item => Number(item.trim()))
      .map(item_id => {
        return {
          item_id,
          collect_id,
        };
      })

    await trx('collection_point_items').insert(collectItems)

    await trx.commit();

    return response.json({
      id: collect_id,
      ...collect,
    });
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name,
      email,
      whatsapp,
      items,
    } = request.body;

    let collectUpdate;

    if (request.file) {
      collectUpdate = {
        name,
        email,
        whatsapp,
        image: request.file.filename
      }
    } else {
      collectUpdate = {
        name,
        email,
        whatsapp,
      }
    }

    const collectItems = items
      .split(',')
      .map(item => Number(item.trim()))
      .map(item_id => {
        return {
          item_id,
          collect_id: id,
        };
      })

    const collect = await knex('collection_point').where('id', id).first();

    if (!collect) {
      return response.send(400, { message: 'Ponto de coleta não encontrado.' })
    }

    const trx = await knex.transaction()

    await trx('collection_point_items')
      .where('collect_id', id)
      .delete()

    await trx('collection_point_items')
      .insert(collectItems)

    await trx('collection_point')
      .where('id', id)
      .first()
      .update(collectUpdate)

    await trx.commit()

    return response.send({ message: 'Ponto de coleta atualizado com sucesso.' })
  }

  async delete(request, response) {
    const { id } = request.params;

    const collect = await knex('collection_point').where('id', id).first();

    if (!collect) {
      return response.status(400).json({ message: 'Ponto de coleta não encontrado.' })
    }

    const trx = await knex.transaction()

    await trx('collection_point_items')
      .where('collect_id', id)
      .delete()

    await trx('address')
      .where('id', collect.address_id)
      .first()
      .delete()

    await trx('collection_point')
      .where('id', id)
      .first()
      .delete()

    await trx.commit()

    return response.status(200).send({ message: 'Ponto de coleta apagado com sucesso.' })
  }
}

module.exports = CollectController;
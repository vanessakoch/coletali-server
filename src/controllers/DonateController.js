const knex = require('../database/connection');

class DonateController {

  async all(request, response) {
    const donations = await knex('donation_point')
      .join('address', 'donation_point.address_id', '=', "address.id")
      .select('donation_point.*')
      .select('address.latitude')
      .select('address.longitude')
      .select('address.number')
      .select('address.city')
      .select('address.uf')

    const serializedPoints = donations.map(point => {
      return {
        ...point,
        image_url: `${process.env.APP_URL}/uploads/${point.image}`
      };
    })
    response.json(serializedPoints)
  }


  async index(request, response) {
    const items = request.query.items
    const parsedItems = String(items).split(',').map(item => item.trim());
    
    if(parsedItems.length > 0) {
      const donationPoint = await knex('donation_point')
        .join('donation_point_items', 'donation_point.id', '=', 'donation_point_items.donate_id')
        .whereIn('donation_point_items.item_id', parsedItems)
        .join('address', 'donation_point.address_id', '=', 'address.id')
        .select('donation_point.*')
        .select('address.latitude')
        .select('address.longitude')
        .select('address.number')
        .select('address.city')
        .select('address.uf')
        .distinct();
  
      const serializedPoints = donationPoint.map(point => {
        return {
          ...point,
          image_url: `${process.env.APP_URL}/uploads/${point.image}`
        };
      })
      response.json(serializedPoints)
    }
  }

  async show(request, response) {
    const { id } = request.params;

    const donate = await knex('donation_point')
      .where('donation_point.id', id).first()
      .join('address', 'donation_point.address_id', '=', 'address.id')
      .select('donation_point.*')
      .select('address.latitude')
      .select('address.longitude')
      .select('address.number')
      .select('address.city')
      .select('address.uf')

    if (!donate) {
      return response.status(400).json({ message: 'Ponto de doação não encontrado.' })
    }

    const serializedPoint = {
      ...donate,
      image_url: `${process.env.APP_URL}/uploads/${donate.image}`
    }

    const items = await knex('item')
      .join('donation_point_items', 'item.id', '=', 'donation_point_items.item_id')
      .where('donation_point_items.donate_id', id)
      .select('item.id')
      .select('item.title')
      .select('item.information');

    return response.json({ donate: serializedPoint, items });
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

    const donate = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      address_id,
      user_id
    }

    const insertedIds = await trx('donation_point').insert(donate)

    const donate_id = insertedIds[0];

    const donateItems = items
      .split(',')
      .map(item => Number(item.trim()))
      .map(item_id => {
        return {
          item_id,
          donate_id,
        };
      })

    await trx('donation_point_items').insert(donateItems)

    await trx.commit();

    return response.json({
      id: donate_id,
      ...donate
    })

  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name,
      email,
      whatsapp,
      items,
    } = request.body;

    let donateUpdate;

    if (request.file) {
      donateUpdate = {
        name,
        email,
        whatsapp,
        image: request.file.filename
      }
    } else {
      donateUpdate = {
        name,
        email,
        whatsapp,
      }
    }

    const donateItems = items
      .split(',')
      .map(item => Number(item.trim()))
      .map(item_id => {
        return {
          item_id,
          donate_id: id,
        };
      })

    const donate = await knex('donation_point').where('id', id).first();

    if (!donate) {
      return response.send(400, { message: 'Ponto de doação não encontrado.' })
    }

    const trx = await knex.transaction()

    await trx('donation_point_items')
      .where('donate_id', id)
      .delete()

    await trx('donation_point_items')
      .insert(donateItems)

    await trx('donation_point')
      .where('id', id)
      .first()
      .update(donateUpdate)

    await trx.commit()

    return response.send({ message: 'Ponto de doação atualizado com sucesso.' })
  }

  async delete(request, response) {
    const { id } = request.params;

    const donate = await knex('donation_point').where('id', id).first();

    if (!donate) {
      return response.status(400).json({ message: 'Ponto de doação não encontrado.' })
    }

    const trx = await knex.transaction()

    await trx('donation_point_items')
      .where('donate_id', id)
      .delete()

    await trx('address')
      .where('id', donate.address_id)
      .first()
      .delete()

    await trx('donation_point')
      .where('id', id)
      .first()
      .delete()

    await trx.commit()

    return response.status(200).send({ message: 'Ponto de doação apagado com sucesso.' })
  }
}

module.exports = DonateController;
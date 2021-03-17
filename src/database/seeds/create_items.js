exports.seed = async function (knex) {
  await knex('item').insert([
    {
      title: 'Vidro',
      image: 'glass.svg',
      isDonationItem: false,
      information: 'Coloque-o em caixas de papelão, jornais ou sacos grossos, lembrando de etiquetá-los descrevendo o conteúdo.'
    },
    {
      title: 'Metal',
      image: 'metal.svg',
      isDonationItem: false,
      information: 'Alumínio; Cobre; Ferro; Aço.'
    },
    {
      title: 'Plástico',
      image: 'plastic_bottle.svg',
      isDonationItem: false
    },
    {
      title: 'Papel e Papelão',
      image: 'paper.svg',
      isDonationItem: false
    },
    {
      title: 'Óleo de Cozinha',
      image: 'oleo.svg',
      isDonationItem: false,
      information: 'Armazenar a sobra da fritura em um recipiente ou garrafa PET e entregar ao posto de coleta.'
    },
    {
      title: 'Lâmpadas',
      image: 'lamp.svg',
      isDonationItem: false,
      information: 'Se não estiverem quebradas, armazene em local seguro, separadas de outros materiais recicláveis. Se não estiverem quebradas, armazene em local seguro, separadas de outros materiais recicláveis.'
    },
    {
      title: 'Eletrônicos',
      image: 'electronic.svg',
      isDonationItem: false,
      information: 'Guarde com cuidado para não quebrar, deixe em ambiente arejado e encaminhe ao ponto mais próximo.'
    },
    {
      title: 'Pilhas e Baterias',
      image: 'battery.svg',
      isDonationItem: false
    },
    {
      title: 'Remédios',
      image: 'medicinal.svg',
      isDonationItem: false
    },
    {
      title: 'Alimentos',
      image: 'food.svg',
      isDonationItem: true,
    },
    {
      title: 'Brinquedos',
      image: 'toy.svg',
      isDonationItem: true,
    },
    {
      title: 'Roupas',
      image: 'clothes.svg',
      isDonationItem: true,
    },
    {
      title: 'Calçados',
      image: 'shoes.svg',
      isDonationItem: true
    },
    {
      title: 'Cobertores',
      image: 'blanket.svg',
      isDonationItem: true
    },
    {
      title: 'Móveis',
      image: 'couch.svg',
      isDonationItem: true
    },
  ])
}
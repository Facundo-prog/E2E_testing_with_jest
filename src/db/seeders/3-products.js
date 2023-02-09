const { PRODUCT_TABLE } = require('../models/product.model');

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert(PRODUCT_TABLE, [
      {
        name: 'product 1',
        image: 'http://image.png',
        description: 'bla bla bla',
        price: 100,
        category_id: 1,
        created_at: new Date()
      },
      {
        name: 'product 2',
        image: 'http://image.png',
        description: 'bla bla bla',
        price: 20,
        category_id: 2,
        created_at: new Date()
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(PRODUCT_TABLE, null, {});
  }
};

const { CATEGORY_TABLE } = require('../models/category.model');

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert(CATEGORY_TABLE, [
      {
        name: 'category 1',
        image: 'http://image.png',
        created_at: new Date()
      },
      {
        name: 'category 2',
        image: 'http://image.png',
        created_at: new Date()
      }
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(CATEGORY_TABLE, null, {});
  }
};

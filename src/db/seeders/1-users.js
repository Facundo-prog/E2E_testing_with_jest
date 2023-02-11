const bcrypt = require('bcrypt');
const { USER_TABLE } = require('../models/user.model');

module.exports = {
  up: async (queryInterface) => {
    if(queryInterface.context) queryInterface = queryInterface.context

    return await queryInterface.bulkInsert(USER_TABLE, [
      {
        email: 'admin@mail.com',
        password: await bcrypt.hash('admin1234', 10),
        role: 'admin',
        created_at: new Date()
      },
      {
        email: 'customer@gmail.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'customer',
        created_at: new Date()
      },
    ]);
  },
  down: (queryInterface) => {
    if(queryInterface.context) queryInterface = queryInterface.context
    return queryInterface.bulkDelete(USER_TABLE, null, {});
  }
};

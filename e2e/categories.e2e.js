const request = require('supertest');

const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/seed');

describe('endpoint /categories', () => {
  let server, api;
  let access_token_admin = null;
  let access_token_customer = null;

  beforeAll(async () => {
    const app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });


  describe('POST /categories with not token', () => {
    test('should return 401', async () => {
      const inputData = {
        name: 'Categoria 1',
        image: 'http://image.png'
      }

      const { status } = await api.post('/api/v1/categories').send(inputData);
      expect(status).toBe(401);
    });
  });


  describe('POST /categories with admin user', () => {
    beforeAll(async () => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: 'admin1234'
      }
      const { status, body } = await api.post('/api/v1/auth/login').send(inputData);

      expect(status).toEqual(200);
      access_token_admin = body.access_token;
    });

    test('should return 201 created', async () => {
      const inputData = {
        name: 'Categoria 1',
        image: 'http://image.png'
      }

      const { status, body } = await api
        .post('/api/v1/categories')
        .set({ 'Authorization': `Bearer ${access_token_admin}` })
        .send(inputData);

      expect(status).toBe(201);

      const category = await models.Category.findByPk(body.id);
      expect(category.name).toBe(inputData.name);
    });
  });


  describe('POST /categories with customer user', () => {
    beforeAll(async () => {
      const user = await models.User.findByPk('2');
      const inputData = {
        email: user.email,
        password: '12345678'
      }
      const { status, body } = await api.post('/api/v1/auth/login').send(inputData);

      expect(status).toEqual(200);
      access_token_customer = body.access_token;
    })

    test('should return 401 with not admin user', async () => {
      const inputData = {
        name: 'Categoria 1',
        image: 'http://image.png'
      }

      const { status } = await api
        .post('/api/v1/categories')
        .set({ 'Authorization': `Bearer ${access_token_customer }` })
        .send(inputData);

      expect(status).toBe(401);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});

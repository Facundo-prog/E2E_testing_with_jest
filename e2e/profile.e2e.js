const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/seed');

describe('endpoint /profile', () => {
  let server, api;

  beforeAll(async () => {
    const app = createApp();
    api = request(app);
    server = app.listen(9000, "", () => {
      console.log('E2E server runing');
    });
    await upSeed();
  });

  describe('GET /my-user', () => {
    test('Should return a 401 Unauthorized', async () => {
      const access_token = "invalid_acccess_token";
      const { status } = await api.get('/api/v1/profile/my-user').set({
        'Authtorization': `Bearer ${access_token}`
      });

      expect(status).toBe(401);
    });

    test('Should return a valid user', async () => {
      const user = await models.User.findByPk('1');
      const dataInput = {
        email: user.email,
        password: "admin1234"
      }
      const { body: loginBody } = await await api.post('/api/v1/auth/login').send(dataInput);
      const { status, body } = await api.get('/api/v1/profile/my-user').set({
        'Authorization': `Bearer ${loginBody.access_token}`
      });

      expect(status).toBe(200);
      expect(body.email).toEqual(dataInput.email);
      expect(user.password).toEqual(body.password);
    });
  });

  describe('GET /my-orders', () => {
    test('Should return a 401 Unauthorized', async () => {
      const access_token = "invalid_acccess_token";
      const { status } = await api.get('/api/v1/profile/my-orders').set({
        'Authtorization': `Bearer ${access_token}`
      });

      expect(status).toBe(401);
    });

    test('Should return a orders with user', async () => {
      const user = await models.User.findByPk('2');
      const dataInput = {
        email: user.email,
        password: "12345678"
      }

      const { body: loginBody } = await await api.post('/api/v1/auth/login').send(dataInput);
      const { status } = await api.get('/api/v1/profile/my-orders').set({
        'Authorization': `Bearer ${loginBody.access_token}`
      });

      expect(status).toBe(200);
    });
  });

  afterAll(async () => {
    server.close();
    await downSeed();
  });
});
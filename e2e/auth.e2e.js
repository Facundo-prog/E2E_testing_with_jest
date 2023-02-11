const request = require('supertest');
const createApp = require('../src/app');
const { config } = require('../src/config/config');
const { models } = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockImplementation(() => {
      return {
        sendMail: mockSendMail
      }
    })
  }
})

describe('endpoint /auth', () => {
  let server, api;

  beforeAll(async () => {
    const app = createApp();
    api = request(app);
    server = app.listen(9000);
    await upSeed();
  });


  describe('POST request', () => {
    test('Should return a 401 Unauthorized', async () => {
      const dataInput = {
        email: "admin@mail.com",
        password: "password"
      }

      const { status, body } = await api.post('/api/v1/auth/login').send(dataInput);

      expect(status).toBe(401);
      expect(body.error).toBe("Unauthorized");
    });

    test('Should return a 200 ok', async () => {
      const user = await models.User.findByPk('1');
      const dataInput = {
        email: user.email,
        password: "admin1234"
      }

      const { status, body } = await api.post('/api/v1/auth/login').send(dataInput);

      expect(status).toBe(200);
      expect(body.user.email).toEqual(dataInput.email);
      expect(body.user.password).toBeUndefined();
      expect(body.access_token).toBeTruthy();
    });
  });


  describe('GET /protected-route', () => {
    test('Should return a 401 Unauthorized', async () => {
      const { status, body } = await api.get('/protected-route');

      expect(status).toBe(401);
      expect(body.error).toBe("Unauthorized");
    });

    test('Should return a 200 ok', async () => {
      const { status, body } = await api.get('/protected-route').set({ api: config.apiKey });

      expect(status).toBe(200);
      expect(body.message).toEqual('Hola, soy una ruta protegida');
    });
  });


  describe('POST /recovery', () => {
    beforeAll(() => {
      mockSendMail.mockClear();
    });

    test('Should return a 401 Unauthorized for invalid email', async () => {
      const email = 'test@gmail.com';
      const { status, body } = await api.post('/api/v1/auth/recovery').send({ email });

      expect(status).toBe(401);
      expect(body.error).toBe("Unauthorized");
    });

    test('Should return send email', async () => {
      mockSendMail.mockResolvedValue(true);

      const email = 'admin@mail.com';
      const { status, body } = await api.post('/api/v1/auth/recovery').send({ email });

      expect(status).toBe(200);
      expect(body.message).toEqual('mail sent');
      expect(mockSendMail).toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    server.close();
    await downSeed();
  });
});

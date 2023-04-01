const request = require('supertest');
const createApp = require('../app');

jest.mock('axios');

describe('tests for MELI application', () => {

    let app = null;
    let server = null;
    let api = null;
  
    beforeEach(() => {
      app = createApp();
      server = app.listen(9000);
      api = request(app);
    });
  
    test('GET /:itemId [One item]', async () => {
        const response = await api.get('api/items/MLA1131359154');
        expect(response).toBeTruthy();
        expect(response.statusCode).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
    });
  
    test('GET / [All items]', async () => {
      const response = await api.get('api/items?q=:query');
      expect(response).toBeTruthy();
      expect(response.statusCode).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  
    afterEach(async () => {
      await server.close();
    });
});
const request = require('supertest');
const app = require('./server');
const db = require('./database');

let server; 

beforeAll((done) => {
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(() => {
    db.close(done);
  });
});

describe('POST /api/counsel', () => {

    test('should map "acne scars" query and return relevant packages', async () => {

        const response = await request(server)
            .post('/api/counsel')
            .send({ q: "I have acne scars on cheeks" });

        expect(response.statusCode).toBe(200);
        expect(response.body.mapped_concern).toBe("acne scars");
        expect(response.body.curated.length).toBeGreaterThan(0);
    });

    test('should map "tummy scar" query and include scar revision surgery', async () => {
        const response = await request(server)
            .post('/api/counsel')
            .send({ q: "saggy tummy scar from surgery" });

        expect(response.statusCode).toBe(200);
        expect(response.body.mapped_concern).toBe("tummy scar");

        const allPackages = [...response.body.curated, ...response.body.alternatives];
        const hasSurgeryPackage = allPackages.some(p => p.package.package_name === "Scar Revision Surgery");
        expect(hasSurgeryPackage).toBe(true);
    });

    test('should return 400 if query "q" is missing', async () => {
        const response = await request(server)
            .post('/api/counsel')
            .send({ invasiveness: 'any' });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Query "q" is required.');
    });
});
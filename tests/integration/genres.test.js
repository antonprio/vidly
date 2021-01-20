const request = require('supertest');
const { Genre, validateGenre } = require('../../models/genre.model');
const { User } = require('../../models/user.model');
let server;
const endpoint = '/api/genres';

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        server.close();
        await Genre.remove({});        
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre 1' },
                { name: 'genre 2' },
                { name: 'genre 3' },
            ]);
            const res = await request(server).get(endpoint);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre 1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre 2')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre 3')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {        
        it('should return genre with id', async() => {
            const genre = new Genre({ name: "genre 1" });
            await genre.save();

            const res = await request(server).get(`${endpoint}/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async() => {
            const res = await request(server).get(`${endpoint}/1`);

            expect(res.status).toBe(404);            
        });
    });

    describe('POST /', () => {

        // Mosh technique : 
        // Define the happy path, and then in each test, we change one parameter 
        // that clearly aligns with the name of the test 
        // 1. Define the recurring step, in this case the token and the name parameter
        let token;
        let name;

        const exec = async() => {
            return await request(server)
                .post(endpoint)
                .set('x-auth-token', token)
                .send({ name });
        }

        // 2. Set the recurring step into valid object before each test.
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        // 3. Then difine the value on each test.
        it('should return 401 if client not logged in', async() => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 char', async() => {
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 char', async() => {            
            name = new Array(52).join('cba');
            const res = await exec();                
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async() => {            
            await exec();            
            const genre = await Genre.findOne({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('should return the genre if its valid', async() => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', res.body._id);
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});
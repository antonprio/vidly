const request = require('supertest');
const { User } = require('../../models/user.model');
const { Genre } = require('../../models/genre.model');
let server;

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async() => { 
        server.close(); 
        await Genre.remove({});
    });

    let token;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it('should return 401 if no token provided', async() => {
        token = '';
        const result = await exec();
        expect(result.status).toBe(401);
    });
    
    it('should return 400 if it is invalid', async() => {
        token = '1234';
        const result = await exec();
        expect(result.status).toBe(400);
    });
    
    it('should return 200 if token is valid', async() => {        
        const result = await exec();
        expect(result.status).toBe(200);
    });
});
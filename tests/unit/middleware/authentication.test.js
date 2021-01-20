const { User } = require('../../../models/user.model');
const auth = require('../../../middleware/authentication');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should populate req.user with the payload of valid JWT', () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const token = new User(user).generateAuthToken();
        const req = { header: jest.fn().mockReturnValue(token) };
        const next = jest.fn();
        const res = {};        

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});
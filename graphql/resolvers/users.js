const { model } = require('../../models/User');
const User = require('../../models/User');
const { SECRET_KEY } = require('../../config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server')

const { validateRegisterInput } = require('../../util/validators')

module.exports = {
    Mutation: {
        async register(_, { registerInput: { username, password, confirmPassword, email } }, context, info) {
            // validate user data
            const { valid, errors} = validateRegisterInput(username, email, password, confirmPassword)
            if(!valid) {
                throw new UserInputError('Errors', {errors});
            }
            // make sure that user doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('username is already taken', {
                    error: {
                        username: 'This username is taken'
                    }
                });
            }

            // hash the pasword and create an auth tokem
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            });
            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h' })

            return {
                ...res._doc,
                id: res._id,
                token
            }

        }
    }
}
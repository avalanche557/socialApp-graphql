const { model } = require('../../models/User');
const User = require('../../models/User');
const { SECRET_KEY } = require('../../config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')

function generateToken (user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
    Mutation: {
        async login(_ ,{username, password}) {
            const { errors, valid} = validateLoginInput(username, password) 
            if(!valid) {
                throw new UserInputError('errors', {errors})
            }
            const user = await User.findOne({username});
            if(!user) {
                errors.general = 'user not found'
                throw new UserInputError('user not found', {errors})
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong Credentials'
                throw new UserInputError('Wrong Credentials', {errors})
            }
            const token  = generateToken (user)

            return {
                ...user._doc,
                id: user._id,
                token
            }

            
        },
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

            const token = generateToken (res)

            return {
                ...res._doc,
                id: res._id,
                token
            }

        }
    }
}


import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { responseData, responseMessage } from '../utils/responseHandler.js';

export const register = async (req, res) => {
    if (req.body.password !== req.body.passwordConfirmation) {
        return res.status(400).json({
            message: 'Passwords do not match'
        })
    }

    const salt = await bcrypt.genSalt();
    req.body.password = await bcrypt.hash(req.body.password, salt);
    await User.create(req.body).then(user => {
        res.status(201).json({
            message: 'User created successfully',
            data: user
        })
    }).catch(error => {
        res.json({
            message: error.message
        })
    })
}

export const login = (req, res) => {
    const data = {
        email: req.body.email,
    }

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            })
        }

        bcrypt.compare(req.body.password, user.password).then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Login failed. Wrong password'
                })
            }
            const token = jwt.sign(user.toJSON(), process.env.SECRET, {
                // 30 days
                expiresIn: '30d'
            })

            res.status(200).json({
                message: 'Login successful',
                data: {
                    user,
                    token
                }
            })
        }).catch(error => {
            return res.json({
                message: error.message
            })
        })
    }).catch(error => {
        return res.json({
            message: error.message,
            data: error
        })
    })
}


export const getProfile = (req, res) => {
    res.json({
        message: 'Success getting user profile',
        data: req.user
    })
}


export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Logout failed'
            });
        }
        res.clearCookie('connect.sid', { path: '/' });

        res.status(200).json({
            message: 'Logout successful'
        });
    });
};

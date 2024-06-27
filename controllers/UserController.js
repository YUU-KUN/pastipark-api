import User from "../models/User.js"
import { responseData, responseMessage } from "../utils/responseHandler.js";

export const index = async (req, res) => {
    const user = await User.findAll()
    return responseData(res, 200, user)
}

export const show = async (req, res) => {
    const id = req.params.id
    const user = await User.findByPk(id);
    return responseData(res, 200, user, 'User found successfully');
}

export const create = async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const user = await User.create(data);
    return responseMessage(res, 200, 'User created successfully');
}

export const update = async (req, res) => {
    const id = req.params.id
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const user = await User.update(data, { where: { id: id } });
    return responseData(res, 200, user, 'User updated successfully');
}

export const destroy = async (req, res) => {
    const id = req.params.id
    const user = await User.findByPk(id);
    user.destroy();

    return responseMessage(res, 200, 'User deleted successfully');
}

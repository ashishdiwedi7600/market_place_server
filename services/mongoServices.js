const create = async (Model, data) => {
    return await Model.create(data);
};
const insertMany = async (Model, data) => {
    return await Model.insertMany(data);
};

const findAll = async (Model, filter = {}) => {
    return await Model.find(filter);
};

const findOne = async (Model, filter = {}) => {
    return await Model.findOne(filter);
};

const findById = async (Model, id) => {
    return await Model.findById(id);
};

const exists = async (Model, filter = {}) => {
    return await Model.exists(filter);
};

const updateOne = async (Model, filter = {}, update = {}) => {
    return await Model.findOneAndUpdate(filter, update, { new: true });
};

const deleteOne = async (Model, filter = {}) => {
    return await Model.findOneAndDelete(filter);
};

module.exports = {
    create,
    findAll,
    findOne,
    exists,
    updateOne,
    deleteOne,
    insertMany,
    findById
};
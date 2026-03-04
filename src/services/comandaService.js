const Comanda = require('../models/Comanda');

const createComanda = async (data) => {
    const comanda = new Comanda(data);
    return await comanda.save();
};

const getComandes = async () => {
    return await Comanda.find().sort({ createdAt: -1 });
};

const getComandaById = async (id) => {
    return await Comanda.findById(id);
};

const getComandesUsuari = async (usuariId) => {
    return await Comanda.find({ usuari: usuariId }).sort({ createdAt: -1 });
};

const updateComanda = async (id, data) => {
    return await Comanda.findByIdAndUpdate(id, data, { new: true });
};

const deleteComanda = async (id) => {
    return await Comanda.findByIdAndDelete(id);
};

module.exports = {
    createComanda,
    getComandes,
    getComandaById,
    getComandesUsuari,
    updateComanda,
    deleteComanda
};

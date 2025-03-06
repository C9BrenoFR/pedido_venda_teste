const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    CNPJ: { type: String, required: true, unique: true },
    codigo_cliente: { type: String, required: true },
    nome: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
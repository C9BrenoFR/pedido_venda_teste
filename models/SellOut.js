const mongoose = require('mongoose');

const SellOutSchema = new mongoose.Schema({
    CNPJ: { type: String, required: true },
    codigo_cliente: { type: String, required: true },
    ano: String,
    mes: String,
    meta: Number,
    realizado: Number,
    atingido: Number,
}, { collection: 'sell_out' });

module.exports = mongoose.model('SellOut', SellOutSchema);
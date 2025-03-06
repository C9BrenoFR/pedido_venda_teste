const mongoose = require('mongoose');

const SellInSchema = new mongoose.Schema({
    CNPJ: { type: String, required: true },
    codigo_cliente: { type: String, required: true },
    ano: String,
    mes: String,
    meta: Number,
    realizado: Number,
    atingido: Number,
}, { collection: 'sell_in' });

module.exports = mongoose.model('SellIn', SellInSchema);
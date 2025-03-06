const mongoose = require('mongoose');

const MercadoSchema = new mongoose.Schema({
    CNPJ: { type: String, required: true },
    codigo_cliente: { type: String, required: true },
    ano: String,
    mes: String,
    fatia_KZ: Number,
    fatia_outros: Number,
}, { collection: 'mercado' });

module.exports = mongoose.model('Mercado', MercadoSchema);
const mongoose = require('mongoose');

const MercadoSchema = new mongoose.Schema({
    CNPJ: { type: String, required: true },
    codigo_cliente: { type: String, required: true },
    nome: { type: String, required: true },
    ano: String,
    mes: String,
    KZ: Number,
    fatia_demais: Number,
    fatia_KZ: Number
}, { collection: 'mercado' });

module.exports = mongoose.model('Mercado', MercadoSchema);
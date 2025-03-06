const mongoose = require('mongoose');

const InvestimentosSchema = new mongoose.Schema({
    CNPJ: { type: String, required: true },
    codigo_cliente: { type: String, required: true },
    ano: String,
    mes: String,
    realizado: Number,
    base_faturamento: Number,
}, { collection: 'investimentos' });

module.exports = mongoose.model('Investimentos', InvestimentosSchema);
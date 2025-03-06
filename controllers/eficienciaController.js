const Cliente = require('../models/Cliente');
const Positivacao = require('../models/Positivacao');
const SellIn = require('../models/SellIn');
const SellOut = require('../models/SellOut');
const Investimentos = require('../models/Investimentos');
const Mercado = require('../models/Mercado');

exports.getEficienciaByCNPJ = async (req, res) => {
    try {
        const { cnpj } = req.params;
        const cliente = await Cliente.findOne({ CNPJ: cnpj });
        if (!cliente) return res.status(404).json({ message: "Cliente não encontrado." });
        
        const positivacao = await Positivacao.find({ CNPJ: cnpj });
        const sellIn = await SellIn.find({ CNPJ: cnpj });
        const sellOut = await SellOut.find({ CNPJ: cnpj });
        const investimentos = await Investimentos.find({ CNPJ: cnpj });
        const mercado = await Mercado.find({ CNPJ: cnpj });
        
        res.json({ cliente, positivacao, sellIn, sellOut, investimentos, mercado });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error });
    }
};

exports.salvarEficiencia = async (req, res) => {
    try {
        const { CNPJ, codigo_cliente, ano, mes, meta, realizado } = req.body;
        const atingido = meta > 0 ? ((realizado / meta) * 100).toFixed(2) : 0;
        
        await Positivacao.findOneAndUpdate(
            { CNPJ, codigo_cliente, ano, mes },
            { meta, realizado, atingido },
            { upsert: true, new: true }
        );
        
        res.json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar dados", error });
    }
};

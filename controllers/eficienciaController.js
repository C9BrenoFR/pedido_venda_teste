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
        const { CNPJ, codigo_cliente,nome,tabelas } = req.body;
        
        let cliente = await Cliente.findOne({ CNPJ });
        if (!cliente) {
            cliente = new Cliente({ CNPJ, codigo_cliente, nome });
            await cliente.save();
        }
        
        await Promise.all([
            ...tabelas.positivacao.map(dado => 
                Positivacao.findOneAndUpdate(
                    { CNPJ, codigo_cliente,nome, ano: dado.ano, mes: dado.mes },
                    dado,
                    { upsert: true, new: true }
                )
            ),
            ...tabelas.sellIn.map(dado => 
                SellIn.findOneAndUpdate(
                    { CNPJ, codigo_cliente,nome,ano: dado.ano, mes: dado.mes },
                    dado,
                    { upsert: true, new: true }
                )
            ),
            ...tabelas.sellOut.map(dado => 
                SellOut.findOneAndUpdate(
                    { CNPJ, codigo_cliente,nome ,ano: dado.ano, mes: dado.mes },
                    dado,
                    { upsert: true, new: true }
                )
            ),
            ...tabelas.investimentos.map(dado => 
                Investimentos.findOneAndUpdate(
                    { CNPJ, codigo_cliente,nome,ano: dado.ano, mes: dado.mes },
                    dado,
                    { upsert: true, new: true }
                )
            ),
            ...tabelas.mercado.map(dado => 
                Mercado.findOneAndUpdate(
                    { CNPJ, codigo_cliente,nome ,ano: dado.ano, mes: dado.mes },
                    dado,
                    { upsert: true, new: true }
                )
            )
        ]);
        
        res.json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar dados", error });
    }
};

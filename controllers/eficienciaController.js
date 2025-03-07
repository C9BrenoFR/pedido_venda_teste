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
        const { CNPJ, codigo_cliente, nome, tabelas, overwrite } = req.body;
        
        let cliente = await Cliente.findOne({ CNPJ });
        if (!cliente) {
            if (overwrite) {
                return res.status(400).json({ message: "Cliente não encontrado para sobrescrever." });
            }
            cliente = new Cliente({ CNPJ, codigo_cliente, nome });
            await cliente.save();
        }

        const updateOptions = overwrite ? { new: true } : { upsert: true, new: true };

        await Promise.all([
            ...tabelas.positivacao.map(dado => {
                console.log("Dados recebidos para positivacao:", dado); // Log dos dados brutos
                // Converter apenas se necessário, evitando perda de valores
                const meta = typeof dado.meta === 'string' ? parseFloat(dado.meta) : dado.meta || 0;
                const realizado = typeof dado.realizado === 'string' ? parseFloat(dado.realizado) : dado.realizado || 0;
                const atingido = typeof dado.atingido === 'string' ? parseFloat(dado.atingido) : dado.atingido || 0;

                console.log("Valores convertidos para positivacao:", { meta, realizado, atingido }); // Log após conversão

                return Positivacao.findOneAndUpdate(
                    { CNPJ, codigo_cliente, nome, ano: dado.ano, mes: dado.mes },
                    { ...dado, meta, realizado, atingido }, // Usar valores convertidos diretamente
                    updateOptions
                ).then(result => {
                    console.log("Documento salvo em positivacao:", result); // Log do resultado salvo
                    return result;
                });
            }),
            ...tabelas.sellIn.map(dado => {
                console.log("Dados recebidos para sellIn:", dado);
                const meta = typeof dado.meta === 'string' ? parseFloat(dado.meta) : dado.meta || 0;
                const realizado = typeof dado.realizado === 'string' ? parseFloat(dado.realizado) : dado.realizado || 0;
                const atingido = typeof dado.atingido === 'string' ? parseFloat(dado.atingido) : dado.atingido || 0;

                console.log("Valores convertidos para sellIn:", { meta, realizado, atingido });

                return SellIn.findOneAndUpdate(
                    { CNPJ, codigo_cliente, nome, ano: dado.ano, mes: dado.mes },
                    { ...dado, meta, realizado, atingido },
                    updateOptions
                ).then(result => {
                    console.log("Documento salvo em sellIn:", result);
                    return result;
                });
            }),
            ...tabelas.sellOut.map(dado => {
                console.log("Dados recebidos para sellOut:", dado);
                const meta = typeof dado.meta === 'string' ? parseFloat(dado.meta) : dado.meta || 0;
                const realizado = typeof dado.realizado === 'string' ? parseFloat(dado.realizado) : dado.realizado || 0;
                const atingido = typeof dado.atingido === 'string' ? parseFloat(dado.atingido) : dado.atingido || 0;

                console.log("Valores convertidos para sellOut:", { meta, realizado, atingido });

                return SellOut.findOneAndUpdate(
                    { CNPJ, codigo_cliente, nome, ano: dado.ano, mes: dado.mes },
                    { ...dado, meta, realizado, atingido },
                    updateOptions
                ).then(result => {
                    console.log("Documento salvo em sellOut:", result);
                    return result;
                });
            }),
            ...tabelas.investimentos.map(dado => {
                console.log("Dados recebidos para investimentos:", dado);
                const realizado = typeof dado.realizado === 'string' ? parseFloat(dado.realizado) : dado.realizado || 0;
                const base_faturamento = typeof dado.base_faturamento === 'string' ? parseFloat(dado.base_faturamento) : dado.base_faturamento || 0;

                console.log("Valores convertidos para investimentos:", { realizado, base_faturamento });

                return Investimentos.findOneAndUpdate(
                    { CNPJ, codigo_cliente, nome, ano: dado.ano, mes: dado.mes },
                    { ...dado, realizado, base_faturamento },
                    updateOptions
                ).then(result => {
                    console.log("Documento salvo em investimentos:", result);
                    return result;
                });
            }),
            ...tabelas.mercado.map(dado => {
                console.log("Dados recebidos para mercado:", dado);
                const KZ = typeof dado.KZ === 'string' ? parseFloat(dado.KZ) : dado.KZ || 0;
                const fatia_demais = typeof dado.fatia_demais === 'string' ? parseFloat(dado.fatia_demais) : dado.fatia_demais || 0;
                const fatia_KZ = typeof dado.fatia_KZ === 'string' ? parseFloat(dado.fatia_KZ) : dado.fatia_KZ || 0;

                console.log("Valores convertidos para mercado:", { KZ, fatia_demais, fatia_KZ });

                return Mercado.findOneAndUpdate(
                    { CNPJ, codigo_cliente, nome, ano: dado.ano, mes: dado.mes },
                    { ...dado, KZ, fatia_demais, fatia_KZ },
                    updateOptions
                ).then(result => {
                    console.log("Documento salvo em mercado:", result);
                    return result;
                });
            })
        ]);

        res.json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
        console.error("Erro ao salvar eficiência:", error);
        res.status(500).json({ message: "Erro ao salvar dados", error });
    }
};
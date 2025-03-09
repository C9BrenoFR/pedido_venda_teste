const Cliente = require('../models/Cliente');
const Display = require('../models/Display/Display');



exports.getDisplayBycodgroup = async (req, res) => {


    try {
         const { codgroup } = req.params;
         const cliente = await Cliente.findOne({ codigo_cliente: codgroup });
         if (!cliente) return res.status(404).json({ message: "Cliente não encontrado." });

         const display = await Display.find({ codigo_cliente: codgroup });

         res.json({ cliente, display });
   
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error });
    }

}


exports.salvarDisplay = async (req, res) => {
        try {
       
        } catch (error) {
            res.status(500).json({ message: "Erro no servidor", error });
        }

}

exports.removerLinhaDisplay = async (req, res) => {
    try {
   
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error });
    }

}
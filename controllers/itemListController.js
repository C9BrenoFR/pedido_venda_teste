const apiList_preco = require('../utils/apiLista_preco');

async function getItemList(req, res) {

    const { codgroup } = req.params;

    try {
        const codList = await apiList_preco.fetchItemPriceListDetails(codgroup);

        if (!codList) {
            return res.status(404).json({ message: 'Lista não encontrada' });
        }

        return res.status(200).json(codList);
    } catch (error) {
        console.error('Erro ao obter lista:', error);
        res.status(500).send('Erro ao obter lista2');
    }
}

async function getItemListNew(req, res) {

    const { codClient } = req.params;

    try {
        const codListNew = await apiList_preco.fetchAllClientsWithPriceList(codClient);

        if (!codListNew) {
            return res.status(404).json({ message: 'Lista não encontrada' });
        }

        return res.status(200).json(codListNew);
    } catch (error) {
        console.error('Erro ao obter lista:', error);
        res.status(500).send('Erro ao obter lista2');
    }
}


module.exports = { 
    getItemList,
    getItemListNew
};
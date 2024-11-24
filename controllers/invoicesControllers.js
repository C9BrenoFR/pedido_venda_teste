
const { getSpreadsheetData } = require('../utils/apiServiceLogistica');

async function fetchLogisticsData(req, res) {
    try {
        // IDs do OneDrive para a planilha específica
        const driveId = ''; // Substitua pelo ID correto do drive
        const itemId = '';   // Substitua pelo ID correto do arquivo
        const sheetName = 'MASTER'; // Nome da aba na planilha

        const data = await getSpreadsheetData(driveId, itemId, sheetName);

        // Processar os dados para o formato necessário
        const formattedData = data.map(row => ({
            dataEmissao: row[0],
            numero: row[1],
            codCliente: row[2],
            cliente: row[3],
            cnpj: row[4],
            codRep: row[5],
            representante: row[6],
            transportadora: row[7],
            saida: row[8],
            previsaoEntrega: row[9],
            agenda: row[10],
            ocorrencia: row[11],
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Erro ao buscar dados do OneDrive:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do OneDrive' });
    }
}

module.exports = {
 fetchLogisticsData
};

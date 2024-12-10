
const { getSpreadsheetData } = require('../utils/apiServiceLogistica');

// Função para converter data no formato Excel para JavaScript Date
function excelDateToJSDate(serial) {
    if (!serial || isNaN(serial)) {
        return null; // Retorna nulo se o valor for inválido
    }
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    return new Date(utcValue * 1000);
}


async function fetchLogisticsData(req, res) {
    try {
        // IDs do OneDrive para a planilha específica
        const driveId = 'b!XH-eb-xz-E6X2UiiEteqUdmnlFRU0p5LmLmtxXKjZ0IQdp2f5MVEQqMjT7VUFk1Z'; // Substitua pelo ID correto do drive
        const itemId = '01DKYK72E4OA25KFVSX5DIYRQ4A2BE57MQ';   // Substitua pelo ID correto do arquivo
        const sheetName = 'MASTER'; // Nome da aba na planilha

        const data = await getSpreadsheetData(driveId, itemId, sheetName);

        // Processar os dados para o formato necessário
        const formattedData = data.slice(4).map(row => ({
            NF: row[0],
            EMISSÃO: row[1] ? (excelDateToJSDate(row[1]) ? excelDateToJSDate(row[1]).toISOString(): null) : null,
            codCliente: row[2],
            Rep: row[3],
            NOME: row[4],
            UF: row[5],
            REGIÃO: row[6],
            VOL: row[7],
            CodTransporte: row[8],
            TRANSPORTES: row[9],
            SAÍDA: row[10] ? (excelDateToJSDate(row[10]) ? excelDateToJSDate(row[10]).toISOString() : null) : null,
            PrevisaoEntrega: row[11] ? (excelDateToJSDate(row[11]) ? excelDateToJSDate(row[11]).toISOString() : null) : null,
            ENTREGUE: row[12] ? (excelDateToJSDate(row[12]) ? excelDateToJSDate(row[12]).toISOString() : null) : null,
            AGENDA: row[13],
            OCORRÊNCIA: row[14],
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

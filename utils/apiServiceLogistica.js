const axios = require('axios');
const qs = require('qs');

// Configurações do Azure
const tenantId = "d443408c-996a-424e-81a7-d4d8dceb3800";
const clientId = "9fe66d1c-6602-414c-b811-d6bf98eae186";
const clientSecret = "94S8Q~85LUm_NoRH5lZWxg62Zz8bczeXcjskQaT9";
const scope = "https://graph.microsoft.com/.default";

// URL da API Graph
const graphBaseUrl = "https://graph.microsoft.com/v1.0";

// Função para obter o token de acesso
async function getAccessToken() {
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const body = qs.stringify({
        client_id: clientId,
        scope,
        client_secret: clientSecret,
        grant_type: "client_credentials",
    });

    try {
        const response = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Erro ao obter token de acesso:", error.response?.data || error.message);
        throw new Error("Falha ao obter o token de acesso");
    }
}

// Função para buscar dados da planilha
async function getSpreadsheetData(driveId, itemId, sheetName) {
    const token = await getAccessToken();
    const url = `${graphBaseUrl}/drives/${driveId}/items/${itemId}/workbook/worksheets('${sheetName}')/range(address='A1:Z100')`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.values;
    } catch (error) {
        console.error("Erro ao buscar dados da planilha:", error.response?.data || error.message);
        throw new Error("Falha ao buscar dados da planilha");
    }
}

module.exports = {
    getSpreadsheetData,
};

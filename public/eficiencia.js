
let clientesData1;

//Função para atualizar os caches no navegador
const timestamp1 = new Date().getTime();

// Função para carregar os JSONs 
fetch(`/data/cliente.json?cacheBust=${timestamp1}`)
    .then(response => response.json())
    .then(data => {
        clientesData1 = data;
    });

    // Função para ajustar o CNPJ com zeros à esquerda, se necessário
function ajustarCNPJ1(cnpj) {
    while (cnpj.length < 14) {
        cnpj = '0' + cnpj;
    }
    return cnpj;
}

// Função para verificar se o CNPJ é composto apenas de zeros
function cnpjInvalido1(cnpj) {
    return /^0+$/.test(cnpj);
}


// Função para limpar todos os campos relacionados ao cliente
function limparCamposCliente() {
    document.getElementById('cliente').value = '';
    document.getElementById('codgroup').value = '';

}


// Adiciona o evento de focus no campo CNPJ
document.getElementById('cnpj').addEventListener('focus', function () {
    limparCamposCliente(); // Limpa todos os campos relacionados ao cliente
});


// Função para buscar os dados do cliente pelo CNPJ
function buscarCliente1(cnpj) {
    // Ajusta o CNPJ com zeros à esquerda
    cnpj = ajustarCNPJ1(cnpj);

    for (let i = 1; i < clientesData1.length; i++) {
        let cnpjCliente = ajustarCNPJ1(clientesData1[i][1].toString());
        if (cnpjCliente === cnpj) {
            return clientesData1[i];
        }
    }
    return null;
}


document.getElementById('cnpj').addEventListener('blur', function () {

       let cnpj = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Verifica se o campo está vazio
        if (cnpj === '') {
            return; // Sai da função sem buscar dados
         }

        // Verifica se o CNPJ é inválido (apenas zeros)
        if (cnpjInvalido1(cnpj)) {
            alert("CNPJ inválido.");
            this.value = ''; // Limpa o campo CNPJ
            return; // Sai da função sem buscar dados
        }

        cnpj = ajustarCNPJ1(cnpj);

        let cliente = buscarCliente1(cnpj);

        if (cliente) {

            document.getElementById('cliente').value = cliente[29];
            document.getElementById('codgroup').value = cliente[30];
    
        } else {
            alert("Cliente não encontrado.");
        }


});


function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function limparMoeda(valor) {
    return parseFloat(valor.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
}



document.addEventListener("DOMContentLoaded", function () {
    function calcularPositivacao() {
        let totalMeta = 0;
        let totalRealizado = 0;

        const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dev"];

        meses.forEach(mes => {
            const metaInput = document.getElementById(`positivacao_Meta_${mes}`);
            const realizadoInput = document.getElementById(`positivacao_Realizado_${mes}`);
            const atingidoInput = document.getElementById(`positivacao_Atingido_${mes}`);

            const meta = parseFloat(metaInput.value) || 0;
            const realizado = parseFloat(realizadoInput.value) || 0;

            // Calcula % Atingido, evita divisão por zero
            const percentual = meta > 0 ? ((realizado / meta) * 100).toFixed(2) + "%" : "0%";
            atingidoInput.value = percentual;

            // Soma total das colunas
            totalMeta += meta;
            totalRealizado += realizado;
        });

        // Atualiza totais na linha final
        document.getElementById("positivacao_Meta-total_total").value = totalMeta;
        document.getElementById("positivacao_Realizado-total_total").value = totalRealizado;

        // Calcula % Atingido total
        const totalAtingido = totalMeta > 0 ? ((totalRealizado / totalMeta) * 100).toFixed(2) + "%" : "0%";
        document.getElementById("positivacao_Atingido-total_total").value = totalAtingido;
    }

    // Adiciona evento para recalcular ao digitar nos campos
    document.querySelectorAll(".positivacao input").forEach(input => {
        input.addEventListener("input", calcularPositivacao);
    });

    // Chamada inicial
    calcularPositivacao();
});



document.addEventListener("DOMContentLoaded", function () {
    function calcularsellIn() {
        let totalMetasellIn = 0;
        let totalRealizadosellIn = 0;

        const mesessellIn = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dev"];

        mesessellIn.forEach(mes => {
            const metaInputsellIn = document.getElementById(`sellIn_Meta_${mes}`);
            const realizadoInputsellIn = document.getElementById(`sellIn_Realizado_${mes}`);
            const atingidoInputsellIn = document.getElementById(`sellIn_Atingido_${mes}`);

            const metasellIn = parseFloat(metaInputsellIn.value) || 0;
            const realizadosellIn = parseFloat(realizadoInputsellIn.value) || 0;

            // Calcula % Atingido, evita divisão por zero
            const percentualsellIn = metasellIn > 0 ? ((realizadosellIn / metasellIn) * 100).toFixed(2) + "%" : "0%";
            atingidoInputsellIn.value = percentualsellIn;

            // Soma total das colunas
            totalMetasellIn += metasellIn;
            totalRealizadosellIn += realizadosellIn;
        });

        // Atualiza totais na linha final
        document.getElementById("sellIn_Meta-total_total").value = totalMetasellIn;
        document.getElementById("sellIn_Realizado-total_total").value = totalRealizadosellIn;

        // Calcula % Atingido total
        const totalAtingidosellIn = totalMetasellIn > 0 ? ((totalRealizadosellIn / totalMetasellIn) * 100).toFixed(2) + "%" : "0%";
        document.getElementById("sellIn_Atingido-total_total").value = totalAtingidosellIn;
    }

    // Adiciona evento para recalcular ao digitar nos campos
    document.querySelectorAll(".sellIn input").forEach(input => {
        input.addEventListener("input", calcularsellIn);
    });

    // Chamada inicial
    calcularsellIn();
});



document.addEventListener("DOMContentLoaded", function () {
    function calcularsellOut() {
        let totalMetasellOut = 0;
        let totalRealizadosellOut = 0;

        const mesessellOut = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dev"];

        mesessellOut.forEach(mes => {
            const metaInputsellOut = document.getElementById(`sellOut_Meta_${mes}`);
            const realizadoInputsellOut = document.getElementById(`sellOut_Realizado_${mes}`);
            const atingidoInputsellOut = document.getElementById(`sellOut_Atingido_${mes}`);

            const metasellOut = parseFloat(metaInputsellOut.value) || 0;
            const realizadosellOut = parseFloat(realizadoInputsellOut.value) || 0;

            // Calcula % Atingido, evita divisão por zero
            const percentualsellOut = metasellOut > 0 ? ((realizadosellOut / metasellOut) * 100).toFixed(2) + "%" : "0%";
            atingidoInputsellOut.value = percentualsellOut;

            // Soma total das colunas
            totalMetasellOut += metasellOut;
            totalRealizadosellOut += realizadosellOut;
        });

        // Atualiza totais na linha final
        document.getElementById("sellOut_Meta-total_total").value = totalMetasellOut;
        document.getElementById("sellOut_Realizado-total_total").value = totalRealizadosellOut;

        // Calcula % Atingido total
        const totalAtingidosellOut = totalMetasellOut > 0 ? ((totalRealizadosellOut / totalMetasellOut) * 100).toFixed(2) + "%" : "0%";
        document.getElementById("sellOut_Atingido-total_total").value = totalAtingidosellOut;
    }

    // Adiciona evento para recalcular ao digitar nos campos
    document.querySelectorAll(".sellOut input").forEach(input => {
        input.addEventListener("input", calcularsellOut);
    });

    // Chamada inicial
    calcularsellOut();
});

document.addEventListener("DOMContentLoaded", function () {
    function calcularmercado() {
        let totalMetamercado = 0;
        let totalRealizadomercado = 0;

        const mesesmercado = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dev"];

        mesesmercado.forEach(mes => {
            const metaInput = document.getElementById(`mercado_Meta_${mes}`);
            const realizadoInput = document.getElementById(`mercado_Realizado_${mes}`);
            const atingidoInput = document.getElementById(`mercado_Atingido_${mes}`);

            const meta = parseFloat(metaInput.dataset.valor) || 0;
            const realizado = parseFloat(realizadoInput.dataset.valor) || 0;

            // Calcula % Atingido, evita divisão por zero
            const percentual = meta > 0 ? ((realizado / meta) * 100).toFixed(2) + "%" : "0%";
            atingidoInput.value = percentual;

            // Soma total das colunas
            totalMetamercado += meta;
            totalRealizadomercado += realizado;
        });

        // Atualiza totais na linha final
        document.getElementById("mercado_Meta-total_total").value = formatarMoeda(totalMetamercado);
        document.getElementById("mercado_Realizado-total_total").value = formatarMoeda(totalRealizadomercado);

        // Calcula % Atingido total
        const totalAtingido = totalMetamercado > 0 ? ((totalRealizadomercado / totalMetamercado) * 100).toFixed(2) + "%" : "0%";
        document.getElementById("mercado_Atingido-total_total").value = totalAtingido;
    }

    document.querySelectorAll(".mercado input").forEach(input => {
        input.dataset.valor = "0"; // Inicializa o dataset para evitar NaN

        // Ao focar no input, remove a formatação para facilitar edição
        input.addEventListener("focus", function () {
            this.value = this.dataset.valor; // Mostra apenas o número real para digitação
        });

        // Ao digitar, mantém apenas números e converte corretamente
        input.addEventListener("input", function () {
            let valor = limparMoeda(this.value);
            this.dataset.valor = valor; // Salva valor limpo
            this.value = valor; // Mantém apenas números enquanto digita
            calcularmercado();
        });

        // Ao sair do input, formata como moeda e mantém o valor real salvo
        input.addEventListener("blur", function () {
            let valor = limparMoeda(this.value);
            this.dataset.valor = valor; // Salva valor numérico puro
            this.value = formatarMoeda(valor); // Exibe formatado em moeda
            calcularmercado();
        });
    });

    // Chamada inicial
    calcularmercado();
});



document.addEventListener("DOMContentLoaded", function () {
    function calcularinvest() {
        let totalRealizadosellIn1 = 0;
        let totalRealizadoinvest = 0;

        const mesesinvest = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dev"];

        mesesinvest.forEach(mes => {
            const sellinRealizado1 = document.getElementById(`sellIn_Realizado_${mes}`);
            const realizadoInputinvest = document.getElementById(`invest_Realizado_${mes}`);
            const atingidoInputinvest = document.getElementById(`invest_Atingido_${mes}`);

            const seliinre = parseFloat(sellinRealizado1.value) || 0;
            const realizadoinvest = parseFloat(realizadoInputinvest.value) || 0;

            // Calcula % Atingido, evita divisão por zero
            const percentualinvest = seliinre > 0 ? ((realizadoinvest / seliinre) * 100).toFixed(2) + "%" : "0%";
            atingidoInputinvest.value = percentualinvest;

            // Soma total das colunas
            totalRealizadosellIn1 += seliinre;
            totalRealizadoinvest += realizadoinvest;
        });

        // Atualiza totais na linha final
        document.getElementById("sellIn_Realizado-total_total").value  = totalRealizadosellIn1;
        document.getElementById("invest_Realizado-total_total").value = totalRealizadoinvest;

        // Calcula % Atingido total
        const totalAtingidoinvest = totalRealizadosellIn1 > 0 ? ((totalRealizadoinvest / totalRealizadosellIn1) * 100).toFixed(2) + "%" : "0%";
        document.getElementById("invest_Atingido-total_total").value = totalAtingidoinvest;
    }

    // Adiciona evento para recalcular ao digitar nos campos
    document.querySelectorAll(".invest input").forEach(input => {
        input.addEventListener("input", calcularinvest);
    });

    // Chamada inicial
    calcularinvest();
});

document.addEventListener("DOMContentLoaded", function () {
    const btnSalvar = document.getElementById("btnSalvarDados");

    btnSalvar.addEventListener("click", async function () {
        const cnpj = document.getElementById("cnpj").value.trim();
        const codigoCliente = document.getElementById("codgroup").value.trim();
        const nomeCliente = document.getElementById("cliente").value.trim();
        
        if (!cnpj || !codigoCliente) {
            alert("Por favor, preencha o CNPJ e o Código do Cliente antes de salvar.");
            return;
        }

        const dados = {
            CNPJ: cnpj,
            codigo_cliente: codigoCliente,
            nome: nomeCliente,
            tabelas: {
                positivacao: obterDadosPositivacao(),
                sellIn: obterDadosSellIn(),
                sellOut: obterDadosSellOut(),
                investimentos: obterDadosInvestimentos(),
                mercado: obterDadosMercado(),
            }
        };

        try {
            const response = await fetch("/api/eficiencia/salvar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            alert("Erro ao salvar os dados. Verifique a conexão com o servidor.");
        }
    });

    function obterDadosPositivacao() {
        return obterDadosTabela("positivacao", ["meta", "realizado", "atingido"]);
    }

    function obterDadosSellIn() {
        return obterDadosTabela("sellIn", ["meta", "realizado", "atingido"]);
    }

    function obterDadosSellOut() {
        return obterDadosTabela("sellOut", ["meta", "realizado", "atingido"]);
    }

    function obterDadosInvestimentos() {
        return obterDadosTabela("invest", ["realizado", "base_faturamento"]);
    }

    function obterDadosMercado() {
        return obterDadosTabela("mercado", ["KZ", "fatia_demais", "fatia_KZ"]);
    }

    function obterDadosTabela(tabela, campos) {
        const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dev"];
        return meses.map(mes => {
            let dadosMes = { ano: "2025", mes: mes };
            campos.forEach(campo => {
                const elemento = document.getElementById(`${tabela}_${campo}_${mes}`);
                dadosMes[campo] = elemento ? elemento.value || 0 : 0;
            });
            return dadosMes;
        });
    }
});

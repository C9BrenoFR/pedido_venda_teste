// variavel global
let clientesData2;

// Função para atualizar os caches no navegador
const timestamp2 = new Date().getTime();

// Função para carregar os JSONs 
fetch(`/data/cliente.json?cacheBust=${timestamp2}`)
    .then(response => response.json())
    .then(data => {
        clientesData2 = data;
});

// Função para ajustar o CNPJ com zeros à esquerda, se necessário
function ajustarCNPJ2(cnpj) {
    while (cnpj.length < 14) {
        cnpj = '0' + cnpj;
    }
    return cnpj;
}

// Função para verificar se o CNPJ é composto apenas de zeros
function cnpjInvalido2(cnpj) {
    return /^0+$/.test(cnpj);
}


// Função para limpar todos os campos relacionados ao cliente
function limparCamposCliente1() {
    document.getElementById('cliente').value = '';
    document.getElementById('codgroup').value = '';
   
}

// Adiciona o evento de focus no campo CNPJ
document.getElementById('cnpj').addEventListener('focus', function () {
    limparCamposCliente1(); // Limpa todos os campos relacionados ao cliente
});


// Função para buscar os dados do cliente pelo CNPJ
function buscarCliente2(cnpj) {
    // Ajusta o CNPJ com zeros à esquerda
    cnpj = ajustarCNPJ2(cnpj);

    for (let i = 1; i < clientesData2.length; i++) {
        let cnpjCliente = ajustarCNPJ2(clientesData2[i][1].toString());
        if (cnpjCliente === cnpj) {
            return clientesData2[i];
        }
    }
    return null;
}


document.getElementById('cnpj').addEventListener('blur', async function () {
    let cnpj = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Verifica se o campo está vazio
    if (cnpj === '') {
        limparCamposCliente1();
        return; // Sai da função sem buscar dados
    }

    // Verifica se o CNPJ é inválido (apenas zeros)
    if (cnpjInvalido2(cnpj)) {
        alert("CNPJ inválido.");
        this.value = ''; // Limpa o campo CNPJ
        limparCamposCliente1();
        return; // Sai da função sem buscar dados
    }

    cnpj = ajustarCNPJ2(cnpj);

    let cliente = buscarCliente2(cnpj);

    if (cliente) {
        document.getElementById('cliente').value = cliente[29];
        document.getElementById('codgroup').value = cliente[30]
    } else {
        alert("Cliente não encontrado.");
        limparCamposCliente1();
    }
});


document.getElementById('adicionaLinha').addEventListener('click', function () {

        const tableBody = document.getElementById("table-body");
        const row = document.createElement("tr");
        const columns = 21;

        for (let i = 0; i < columns - 1; i++) {
          let cell = document.createElement("td");
          let input = document.createElement("input");
          input.type = "text";
          cell.appendChild(input);
          row.appendChild(cell);
        }
        let deleteCell = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Remover";
        deleteButton.onclick = function() {
          tableBody.removeChild(row);
        };
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
        tableBody.appendChild(row);
    
        
}); 
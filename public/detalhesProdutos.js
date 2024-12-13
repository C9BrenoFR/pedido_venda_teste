// Variáveis globais para armazenar os dados dos JSONs
let detalhesProdutosData;
let imgProdutosData;

// Função para carregar os JSONs
function carregarDados() {
    fetch('/data/detalhesProdutos.json') // Caminho do JSON de detalhes
        .then(response => response.json())
        .then(data => {
            detalhesProdutosData = data;
        });

    fetch('/data/img_produtos.json') // Caminho do JSON de imagens
        .then(response => response.json())
        .then(data => {
            imgProdutosData = data;
        });
}

// Função para buscar os dados do produto pelo código
function buscarProduto(codigo) {
    if (!detalhesProdutosData || !imgProdutosData) return null;

    let produtoDetalhes = null;
    let produtoImagem = null;

    // Buscar detalhes do produto
    for (let i = 1; i < detalhesProdutosData.length; i++) {
        if (detalhesProdutosData[i][0].toString() === codigo) {
            produtoDetalhes = detalhesProdutosData[i];
            break;
        }
    }

    // Buscar imagem do produto
    for (let i = 1; i < imgProdutosData.length; i++) {
        if (imgProdutosData[i][0].toString() === codigo) {
            produtoImagem = imgProdutosData[i][1]; // Campo "CAMINHO"
            break;
        }
    }

    return { produtoDetalhes, produtoImagem };
}

// Função para preencher os campos ao digitar o código
document.getElementById('codigo').addEventListener('input', function () {
    const codigo = this.value.trim();

    // Limpar os campos se o código estiver vazio
    if (!codigo) {
        limparCamposProduto();
        return;
    }

    const produto = buscarProduto(codigo);

    if (produto && produto.produtoDetalhes) {
        preencherCamposProduto(produto.produtoDetalhes, produto.produtoImagem);
    } else {
        limparCamposProduto();
    }
});

// Função para preencher os campos do produto
function preencherCamposProduto(detalhes, caminhoImagem) {
    document.getElementById('descricao').value = detalhes[1]; // Descrição
    document.getElementById('classificacao').value = detalhes[2]; // Classificação Fiscal
    document.getElementById('ipi').value = detalhes[24] || '0%'; // IPI
    document.getElementById('preco-ref').value = `R$ ${detalhes[23]}`; // Preço Referência
    document.getElementById('preco-ipi').value = `R$ ${(detalhes[23] * (1 + (detalhes[24] || 0) / 100)).toFixed(2)}`; // Preço com IPI
    document.getElementById('codigo-master').value = `${detalhes[3]}`;
    document.getElementById('qtd-caixa').value = `${detalhes[4]}`;
    document.getElementById('peso-caixa').value = `${detalhes[5]}`;
    document.getElementById('comprimento-caixa').value = `${detalhes[6]}`;
    document.getElementById('largura-caixa').value = `${detalhes[7]}`;
    document.getElementById('altura-caixa').value = `${detalhes[8]}`;
    document.getElementById('codigo-display').value = `${detalhes[9]}`;
    document.getElementById('qtd-display').value = `${detalhes[10]}`;
    document.getElementById('peso-display').value = `${detalhes[11]}`;
    document.getElementById('comprimento-display').value = `${detalhes[12]}`;
    document.getElementById('largura-display').value = `${detalhes[13]}`;
    document.getElementById('altura-display').value = `${detalhes[14]}`;
    document.getElementById('codigo-unidade').value = `${detalhes[15]}`;
    document.getElementById('peso-unitario').value = `${detalhes[16]}`;
    document.getElementById('comprimento-unitario').value = `${detalhes[17]}`;
    document.getElementById('largura-unitario').value = `${detalhes[18]}`;
    document.getElementById('altura-unitario').value = `${detalhes[19]}`;
    document.getElementById('altura-max').value = `${detalhes[20]}`;
    document.getElementById('altura-pallet').value = `${detalhes[21]}`;
    document.getElementById('qtd-lastro').value = `${detalhes[22]}`;
    document.getElementById('qtd-altura').value = `${detalhes[23]}`;
    document.getElementById('cx-pallet').value = `${detalhes[24]}`;
    document.getElementById('alt-pallet').value = `${detalhes[25]}`;
    document.getElementById('peso-pallet').value = `${detalhes[26]}`;
   
    

    // Atualizar imagem
    const imgElemento = document.getElementById('imagem');
    imgElemento.src = caminhoImagem || 'placeholder.jpg';
    imgElemento.alt = detalhes[1] || 'Imagem não disponível';
}

// Função para limpar os campos do produto
function limparCamposProduto() {
    document.getElementById('descricao').value = '';
    document.getElementById('classificacao').value = '';
    document.getElementById('ipi').value = '';
    document.getElementById('preco-ref').value = '';
    document.getElementById('preco-ipi').value = '';
    document.getElementById('codigo-master').value = ``;
    document.getElementById('qtd-caixa').value = ``;
    document.getElementById('peso-caixa').value = ``;
    document.getElementById('comprimento-caixa').value = ``;
    document.getElementById('largura-caixa').value = ``;
    document.getElementById('altura-caixa').value = ``;
    document.getElementById('codigo-display').value = ``;
    document.getElementById('qtd-display').value = ``;
    document.getElementById('peso-display').value = ``;
    document.getElementById('comprimento-display').value = ``;
    document.getElementById('largura-display').value = ``;
    document.getElementById('altura-display').value = ``;
    document.getElementById('codigo-unidade').value = ``;
    document.getElementById('peso-unitario').value = ``;
    document.getElementById('comprimento-unitario').value = ``;
    document.getElementById('largura-unitario').value = ``;
    document.getElementById('altura-unitario').value = ``;
    document.getElementById('altura-max').value = ``;
    document.getElementById('altura-pallet').value = ``;
    document.getElementById('qtd-lastro').value = ``;
    document.getElementById('qtd-altura').value = ``;
    document.getElementById('cx-pallet').value = ``;
    document.getElementById('alt-pallet').value = ``;
    document.getElementById('peso-pallet').value = ``;
    document.getElementById('imagem').src = 'placeholder.jpg';
    document.getElementById('imagem').alt = 'Imagem não disponível';
    
}

// Inicializar os dados ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDados);

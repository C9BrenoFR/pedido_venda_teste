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
    document.getElementById('imagem').src = 'placeholder.jpg';
    document.getElementById('imagem').alt = 'Imagem não disponível';
}

// Inicializar os dados ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDados);

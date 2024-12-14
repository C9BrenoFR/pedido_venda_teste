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
    document.getElementById('ipi').value =  detalhes[24] 
                                            ? `${detalhes[24].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                                            : '0%'; // IPI
    document.getElementById('preco-ref').value = `R$ ${detalhes[23].toFixed(2).toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('.', ',')}`; // Preço Referência
    document.getElementById('preco-ipi').value = `R$ ${((detalhes[23] * (1 + (detalhes[24] || 0) / 100))).toFixed(2).toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('.', ',')}`; // Preço com IPI
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
    document.getElementById('altura-max').value = 1.30;
    document.getElementById('altura-pallet').value = 0.15;


           // Tratamento dos campos para número float para fazer os calculos
           const alturaMax = parseFloat(document.getElementById('altura-max').value); // T4
           const alturaPallet = parseFloat(document.getElementById('altura-pallet').value); // X4
           const pesoCaixa = parseFloat(document.getElementById('peso-caixa').value); // E15
           const comprimentoCaixa = parseFloat(document.getElementById('comprimento-caixa').value); // E16
           const larguraCaixa = parseFloat(document.getElementById('largura-caixa').value); // E17
           const alturaCaixa = parseFloat(document.getElementById('altura-caixa').value); // E18


           //variáveis dos resultados
           let qtdLastro = '';
           let qtdAltura = '';
           let cxPorPallet = '';
           let altPallet = '';
           let pesoPallet = '';

           
           // Calculo campo QUANTIDADE LASTRO:------inicio--------------------------------------------------------------------------
           if (comprimentoCaixa > 0 && larguraCaixa > 0) {
           qtdLastro = Math.floor((1 * alturaMax) / (comprimentoCaixa * larguraCaixa)); // Cálculo arredondado para baixo
           }
           document.getElementById('qtd-lastro').value = qtdLastro || ''; // Exibe vazio se ocorrer erro
           // Calculo campo QUANTIDADE LASTRO:----fim ----------------------------------------------------------------------------

            
            // Calculo campo QUATIDADE ALTURA:------inicio--------------------------------------------------------------------------
            if (alturaCaixa > 0) { // Verificando se alturaCaixa é maior que 0 para evitar divisão por zero
                qtdAltura = Math.floor(alturaMax / alturaCaixa); // Realizando o cálculo e arredondando para baixo
            }
            document.getElementById('qtd-altura').value = qtdAltura || '';
            // Calculo campo QUATIDADE ALTURA:----fim ----------------------------------------------------------------------------



            // Calculo campo QUATIDADE DE CAIXA POR PALLET:------inicio--------------------------------------------------------------------------
            // Obtendo os valores de qtdLastro e qtdAltura
            const qtdLastro1 = parseInt(document.getElementById('qtd-lastro').value) || 0; // Convertendo para inteiro ou 0 se vazio
            const qtdAltura1 = parseInt(document.getElementById('qtd-altura').value) || 0; // Convertendo para inteiro ou 0 se vazio

            // Calculando o número de caixas por pallet
            if (qtdLastro1 > 0 && qtdAltura1 > 0) {
                cxPorPallet = qtdLastro1 * qtdAltura1; // Multiplicação
            }
            document.getElementById('cx-plt').value = cxPorPallet || '';
            // Calculo campo QUATIDADE DE CAIXA POR PALLET:------inicio--------------------------------------------------------------------------


         
          
          // Calculo campo ALTURA PALLET:------inicio--------------------------------------------------------------------------
           const alturaCaixa1 = parseFloat(document.getElementById('altura-caixa').value) || 0; // E18
           const alturaPallet1 = parseFloat(document.getElementById('altura-pallet').value) || 0; // X4

           // Calculando ((E18 * T9) - X4)
          if (alturaCaixa > 0 && qtdAltura > 0) { // Verificando se os valores são válidos
              altPallet = (alturaCaixa1 * qtdAltura1) - alturaPallet1;
          }
          document.getElementById('alt-pallet').value = altPallet > 0 
                                                    ? altPallet.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                                                    : '';
          // Calculo campo ALTURA PALLET:------inicio--------------------------------------------------------------------------

           

           // Calculo campo PESO PALLET:------inicio--------------------------------------------------------------------------
           const cxPorPallet1 = parseInt(document.getElementById('cx-plt').value) || 0;

           if(cxPorPallet1 > 0 && pesoCaixa > 0){

              pesoPallet = cxPorPallet1 * pesoCaixa

              // Arredondar para duas casas decimais e formatar com vírgula
              pesoPallet = pesoPallet.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
           }
           document.getElementById('peso-pallet').value = pesoPallet || '' ;
           // Calculo campo PESO PALLET:------inicio--------------------------------------------------------------------------
   
    

    const imgElemento = document.getElementById('imagem');
    if (caminhoImagem) {
        imgElemento.src = caminhoImagem;
        imgElemento.alt = detalhes[1] || 'Imagem do Produto';
    } else {
        imgElemento.src = 'placeholder.jpg'; // Imagem padrão
        imgElemento.alt = 'Imagem não disponível';
    }

    console.log('Detalhes do Produto:', detalhes);
    console.log('Caminho da Imagem:', caminhoImagem);
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
    document.getElementById('cx-plt').value = ``;
    document.getElementById('alt-pallet').value = ``;
    document.getElementById('peso-pallet').value = ``;
    document.getElementById('imagem').src = 'placeholder.jpg';
    document.getElementById('imagem').alt = 'Imagem não disponível';
    
}

// Inicializar os dados ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDados);

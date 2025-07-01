document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS GLOBAIS ---
    const listaImoveisDiv = document.getElementById('lista-imoveis');
    const semImoveisAviso = document.getElementById('sem-imoveis-aviso');

    // --- LÓGICA DO BANCO DE DADOS (LOCALSTORAGE) ---

    // Função para carregar imóveis do LocalStorage
    const carregarImoveis = () => {
        const imoveisJSON = localStorage.getItem('imoveisDB');
        // Se não houver nada, retorna um array vazio. Senão, converte de JSON para objeto.
        return imoveisJSON ? JSON.parse(imoveisJSON) : [];
    };

    // Função para salvar imóveis no LocalStorage
    const salvarImoveis = (imoveis) => {
        // Converte o array de objetos para uma string JSON e salva.
        localStorage.setItem('imoveisDB', JSON.stringify(imoveis));
    };

    // Função para renderizar os cards de imóveis na tela
    const renderizarImoveis = () => {
        const imoveis = carregarImoveis();
        listaImoveisDiv.innerHTML = ''; // Limpa a lista atual

        if (imoveis.length === 0) {
            semImoveisAviso.classList.remove('d-none'); // Mostra o aviso
        } else {
            semImoveisAviso.classList.add('d-none'); // Esconde o aviso
            imoveis.forEach(imovel => {
                // Cria o HTML do card para cada imóvel
                const cardHTML = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${imovel.foto}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="Foto de ${imovel.titulo}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${imovel.titulo}</h5>
                                <p class="card-text text-muted">${imovel.bairro}, Campina Grande</p>
                                <div class="d-flex justify-content-around my-3">
                                    <span><i class="fas fa-bed"></i> ${imovel.quartos} Qts</span>
                                    <span><i class="fas fa-bath"></i> 2 Banh.</span>
                                    <span><i class="fas fa-car"></i> 2 Vagas</span>
                                </div>
                                <p class="card-text small">${imovel.descricao.substring(0, 80)}...</p>
                                <a href="#" class="btn btn-primary mt-auto">Ver Detalhes</a>
                            </div>
                        </div>
                    </div>
                `;
                listaImoveisDiv.innerHTML += cardHTML;
            });
        }
    };

    // --- LÓGICA DO PORTAL DO CORRETOR ---
    const loginCreciDiv = document.getElementById('login-creci');
    const ferramentaIaDiv = document.getElementById('ferramenta-ia');
    const formValidaCreci = document.getElementById('form-valida-creci');
    const inputCreci = document.getElementById('creci');

    // O resto do seu código da ferramenta de IA continua aqui...
    const iaForm = document.getElementById('ia-form');
    const resultadoIaTexto = document.getElementById('resultado-ia-texto');
    const botoesAcaoIa = document.getElementById('botoes-acao-ia');
    const btnCopiar = document.getElementById('btn-copiar');
    const btnUsarDescricao = document.getElementById('btn-usar-descricao');
    const spinner = '<i class="fas fa-spinner fa-spin"></i> Gerando descrição. Aguarde...';

    const inputFotos = document.getElementById('fotosImovel');
    const previewFotosDiv = document.getElementById('preview-fotos');
    let arquivosDeFotos = [];

    formValidaCreci.addEventListener('submit', (event) => {
        event.preventDefault();
        if (inputCreci.value && inputCreci.value.length >= 4) {
            loginCreciDiv.classList.add('d-none');
            ferramentaIaDiv.classList.remove('d-none');
        } else {
            alert('Por favor, insira um CRECI válido para continuar.');
        }
    });

    inputFotos.addEventListener('change', () => { /* ... sua lógica de preview continua a mesma ... */
        previewFotosDiv.innerHTML = '';
        arquivosDeFotos = Array.from(inputFotos.files).slice(0, 5); // Pega até 5 arquivos

        arquivosDeFotos.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'preview-imagem-container';
                const img = document.createElement('img');
                img.src = reader.result;
                imgContainer.appendChild(img);
                previewFotosDiv.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    });

    iaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // ... sua lógica de fetch para a IA continua a mesma ...
        // ... no 'try' depois de receber a resposta da IA ...
        try {
            const response = await fetch('/api/generate', { /* ... corpo do fetch ... */ });
            if (!response.ok) { throw new Error('Erro do servidor'); }
            const data = await response.json();
            const descricaoGerada = data.descricao;
            resultadoIaTexto.innerHTML = descricaoGerada.replace(/\n/g, '<br>');
            botoesAcaoIa.classList.remove('d-none');
        } catch (error) {
            // ... seu tratamento de erro ...
        }
    });

    btnCopiar.addEventListener('click', () => { /* ... sua lógica de copiar continua a mesma ... */ });

    // --- ATUALIZAÇÃO DA LÓGICA DO BOTÃO "USAR DESCRIÇÃO" ---
    btnUsarDescricao.addEventListener('click', () => {
        // 1. Coletar todos os dados do anúncio
        const tipoImovel = document.getElementById('tipoImovel').value;
        const bairro = document.getElementById('bairro').value;
        const quartos = document.getElementById('quartos').value;
        const descricao = resultadoIaTexto.innerText; // Pega o texto puro
        const fotoPrincipal = previewFotosDiv.querySelector('img') ? previewFotosDiv.querySelector('img').src : 'https://via.placeholder.com/400x250/ccc/808080?text=Sem+Foto';

        if (!tipoImovel || !bairro || !quartos || !descricao) {
            alert('Por favor, preencha todos os campos antes de salvar.');
            return;
        }

        // 2. Criar um novo objeto de imóvel
        const novoImovel = {
            id: Date.now(), // ID único baseado no tempo
            titulo: `${tipoImovel} no Bairro ${bairro}`,
            bairro: bairro,
            quartos: quartos,
            descricao: descricao,
            foto: fotoPrincipal,
        };

        // 3. Salvar no nosso "banco de dados"
        const imoveisAtuais = carregarImoveis();
        imoveisAtuais.push(novoImovel); // Adiciona o novo imóvel ao array
        salvarImoveis(imoveisAtuais); // Salva o array atualizado

        // 4. Feedback e atualização da tela
        alert('Anúncio publicado com sucesso no site!');
        iaForm.reset();
        previewFotosDiv.innerHTML = '';
        resultadoIaTexto.innerHTML = '<p class="text-muted">Preencha todos os campos e clique em gerar.</p>';
        botoesAcaoIa.classList.add('d-none');

        // 5. Re-renderizar a lista de imóveis para mostrar o novo anúncio
        renderizarImoveis();
    });

    // --- INICIALIZAÇÃO DA PÁGINA ---
    // Renderiza os imóveis salvos assim que a página carregar
    renderizarImoveis();
});
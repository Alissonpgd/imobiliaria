document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS GLOBAIS ---
    const listaImoveisDiv = document.getElementById('lista-imoveis');
    const semImoveisAviso = document.getElementById('sem-imoveis-aviso');
    const formBusca = document.getElementById('form-busca');
    const buscaInput = document.getElementById('busca-local');

    // --- BANCO DE DADOS LOCAL ---
    const carregarImoveis = () => JSON.parse(localStorage.getItem('imoveisDB')) || [];
    const salvarImoveis = (imoveis) => localStorage.setItem('imoveisDB', JSON.stringify(imoveis));

    // --- RENDERIZAÇÃO E BUSCA ---
    const renderizarImoveis = (termoBusca = '') => {
        const imoveis = carregarImoveis();
        listaImoveisDiv.innerHTML = '';
        termoBusca = termoBusca.toLowerCase();

        const imoveisFiltrados = imoveis.filter(imovel => {
            return imovel.titulo.toLowerCase().includes(termoBusca) || imovel.bairro.toLowerCase().includes(termoBusca);
        });

        if (imoveisFiltrados.length === 0) {
            semImoveisAviso.classList.remove('d-none');
            semImoveisAviso.textContent = termoBusca ? "Nenhum imóvel encontrado para esta busca." : "Nenhum imóvel cadastrado. Seja o primeiro a anunciar!";
        } else {
            semImoveisAviso.classList.add('d-none');
            imoveisFiltrados.sort((a, b) => b.id - a.id).forEach(imovel => {
                const cardHTML = `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100 shadow-sm">
                            <img src="${imovel.fotos[0]}" class="card-img-top" style="height: 220px; object-fit: cover;" alt="Foto de ${imovel.titulo}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${imovel.titulo}</h5>
                                <p class="card-text text-muted small">${imovel.bairro}, Campina Grande</p>
                                <a href="imovel.html?id=${imovel.id}" class="btn btn-primary mt-auto">Ver Detalhes</a>
                            </div>
                        </div>
                    </div>
                `;
                listaImoveisDiv.innerHTML += cardHTML;
            });
        }
    };

    formBusca.addEventListener('submit', (e) => {
        e.preventDefault();
        renderizarImoveis(buscaInput.value);
    });

    // Limpa a busca quando o campo fica vazio
    buscaInput.addEventListener('input', () => {
        if (buscaInput.value === '') {
            renderizarImoveis();
        }
    });

    // --- PORTAL DO CORRETOR ---
    const loginCreciDiv = document.getElementById('login-creci');
    const ferramentaIaDiv = document.getElementById('ferramenta-ia');
    const formValidaCreci = document.getElementById('form-valida-creci');
    const inputCreci = document.getElementById('creci');

    if (formValidaCreci) {
        formValidaCreci.addEventListener('submit', (event) => {
            event.preventDefault();
            if (inputCreci.value && inputCreci.value.length >= 4) {
                loginCreciDiv.classList.add('d-none');
                ferramentaIaDiv.classList.remove('d-none');
            } else {
                alert('Por favor, insira um CRECI válido para continuar.');
            }
        });
    }

    const iaForm = document.getElementById('ia-form');
    if (iaForm) {
        const resultadoIaTexto = document.getElementById('resultado-ia-texto');
        const botoesAcaoIa = document.getElementById('botoes-acao-ia');
        const btnCopiar = document.getElementById('btn-copiar');
        const btnUsarDescricao = document.getElementById('btn-usar-descricao');
        const inputFotos = document.getElementById('fotosImovel');
        const previewFotosDiv = document.getElementById('preview-fotos');
        let arquivosDeFotosData = [];

        inputFotos.addEventListener('change', () => {
            previewFotosDiv.innerHTML = '';
            arquivosDeFotosData = [];
            const files = Array.from(inputFotos.files).slice(0, 5);

            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target.result;
                    arquivosDeFotosData[index] = dataUrl;

                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'preview-imagem-container';
                    imgContainer.setAttribute('data-index', index);

                    const img = document.createElement('img');
                    img.src = dataUrl;

                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remover-img-btn';
                    removeBtn.innerHTML = '×';
                    removeBtn.onclick = () => {
                        const idxToRemove = parseInt(imgContainer.getAttribute('data-index'));
                        arquivosDeFotosData[idxToRemove] = null; // Marca para remoção
                        imgContainer.remove();
                    };

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    previewFotosDiv.appendChild(imgContainer);
                };
                reader.readAsDataURL(file);
            });
        });

        iaForm.addEventListener('submit', async (event) => {
            // ... sua lógica de fetch para a IA (sem alterações) ...
        });

        btnUsarDescricao.addEventListener('click', () => {
            const fotosFinais = arquivosDeFotosData.filter(f => f !== null);
            if (fotosFinais.length === 0) {
                alert('Por favor, adicione pelo menos uma foto.');
                return;
            }

            const novoImovel = {
                id: Date.now(),
                titulo: `${document.getElementById('tipoImovel').value} no Bairro ${document.getElementById('bairro').value}`,
                bairro: document.getElementById('bairro').value,
                quartos: document.getElementById('quartos').value,
                descricao: document.getElementById('resultado-ia-texto').innerText,
                fotos: fotosFinais
            };

            const imoveisAtuais = carregarImoveis();
            imoveisAtuais.push(novoImovel);
            salvarImoveis(imoveisAtuais);
            alert('Anúncio publicado com sucesso!');
            iaForm.reset();
            previewFotosDiv.innerHTML = '';
            botoesAcaoIa.classList.add('d-none');
            resultadoIaTexto.innerHTML = '<p class="text-muted">Preencha todos os campos...</p>';
            renderizarImoveis();
            document.getElementById('destaques').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    renderizarImoveis();
});
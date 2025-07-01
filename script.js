document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS GLOBAIS ---
    const listaImoveisDiv = document.getElementById('lista-imoveis');
    const semImoveisAviso = document.getElementById('sem-imoveis-aviso');

    // --- LÓGICA DO BANCO DE DADOS LOCAL (LOCALSTORAGE) ---

    const carregarImoveis = () => {
        const imoveisJSON = localStorage.getItem('imoveisDB');
        return imoveisJSON ? JSON.parse(imoveisJSON) : [];
    };

    const salvarImoveis = (imoveis) => {
        localStorage.setItem('imoveisDB', JSON.stringify(imoveis));
    };

    const renderizarImoveis = () => {
        const imoveis = carregarImoveis();
        listaImoveisDiv.innerHTML = '';

        if (imoveis.length === 0) {
            semImoveisAviso.classList.remove('d-none');
        } else {
            semImoveisAviso.classList.add('d-none');
            // Ordena para que o mais novo apareça primeiro
            imoveis.sort((a, b) => b.id - a.id);

            imoveis.forEach(imovel => {
                const cardHTML = `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100 shadow-sm">
                            <img src="${imovel.foto}" class="card-img-top" style="height: 220px; object-fit: cover;" alt="Foto de ${imovel.titulo}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${imovel.titulo}</h5>
                                <p class="card-text text-muted small">${imovel.bairro}, Campina Grande - PB</p>
                                <div class="d-flex justify-content-around my-3 text-secondary">
                                    <span><i class="fas fa-bed"></i> ${imovel.quartos} Qts</span>
                                    <span><i class="fas fa-bath"></i> ${imovel.banheiros || 1} Banh.</span>
                                    <span><i class="fas fa-car"></i> ${imovel.vagas || 1} Vaga(s)</span>
                                </div>
                                <p class="card-text flex-grow-1">${imovel.descricao.substring(0, 100)}...</p>
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

    const iaForm = document.getElementById('ia-form');
    const resultadoIaTexto = document.getElementById('resultado-ia-texto');
    const botoesAcaoIa = document.getElementById('botoes-acao-ia');
    const btnCopiar = document.getElementById('btn-copiar');
    const btnUsarDescricao = document.getElementById('btn-usar-descricao');
    const spinner = '<div class="d-flex justify-content-center align-items-center"><i class="fas fa-spinner fa-spin me-2"></i> Gerando descrição. Aguarde...</div>';

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

    inputFotos.addEventListener('change', () => {
        previewFotosDiv.innerHTML = '';
        arquivosDeFotos = Array.from(inputFotos.files).slice(0, 5);

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
        botoesAcaoIa.classList.add('d-none');
        resultadoIaTexto.innerHTML = spinner;

        const tipoImovel = document.getElementById('tipoImovel').value;
        const bairro = document.getElementById('bairro').value;
        const quartos = document.getElementById('quartos').value;
        const caracteristicas = document.getElementById('caracteristicas').value;

        const prompt = `Crie uma descrição de anúncio imobiliário atraente e profissional para: ${tipoImovel} com ${quartos} quartos no bairro ${bairro} em Campina Grande - PB. Características especiais: ${caracteristicas}. O texto deve ter 3 parágrafos curtos.`;

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('Falha na comunicação com a IA.');
            }

            const data = await response.json();
            const descricaoGerada = data.descricao;
            resultadoIaTexto.innerHTML = descricaoGerada.replace(/\n/g, '<br>');
            botoesAcaoIa.classList.remove('d-none');

        } catch (error) {
            console.error('Erro detalhado:', error);
            resultadoIaTexto.innerText = 'Desculpe, houve um problema ao gerar a descrição.';
        }
    });

    btnCopiar.addEventListener('click', () => {
        const textoParaCopiar = resultadoIaTexto.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
        navigator.clipboard.writeText(textoParaCopiar).then(() => {
            btnCopiar.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => { btnCopiar.innerHTML = '<i class="fas fa-copy"></i> Copiar Texto'; }, 2000);
        });
    });

    btnUsarDescricao.addEventListener('click', () => {
        // 1. Coletar todos os dados do anúncio
        const tipoImovel = document.getElementById('tipoImovel').value;
        const bairro = document.getElementById('bairro').value;
        const quartos = document.getElementById('quartos').value;
        const descricao = resultadoIaTexto.innerText;

        // Pega a primeira imagem do preview ou uma imagem padrão
        const primeiraImagem = previewFotosDiv.querySelector('img');
        const fotoPrincipal = primeiraImagem ? primeiraImagem.src : 'https://via.placeholder.com/400x250/ccc/808080?text=Sem+Foto';

        if (!tipoImovel || !bairro || !quartos || !descricao) {
            alert('Por favor, preencha todos os campos antes de salvar o anúncio.');
            return;
        }

        // 2. Criar o novo objeto de imóvel
        const novoImovel = {
            id: Date.now(), // ID único
            titulo: `${tipoImovel} no Bairro ${bairro}`,
            bairro: bairro,
            quartos: quartos,
            descricao: descricao,
            foto: fotoPrincipal,
            // Adicione outros campos como banheiros, vagas, etc., se quiser
            banheiros: 2,
            vagas: 1
        };

        // 3. Salvar no LocalStorage
        const imoveisAtuais = carregarImoveis();
        imoveisAtuais.push(novoImovel);
        salvarImoveis(imoveisAtuais);

        // 4. Feedback e limpeza do formulário
        alert('Anúncio publicado com sucesso no painel de imóveis!');
        iaForm.reset();
        previewFotosDiv.innerHTML = '';
        resultadoIaTexto.innerHTML = '<p class="text-muted">Preencha todos os campos e clique em gerar.</p>';
        botoesAcaoIa.classList.add('d-none');

        // 5. ATUALIZAR A LISTA NA TELA
        renderizarImoveis();

        // Rola a tela para a seção de destaques para o usuário ver o resultado
        document.getElementById('destaques').scrollIntoView({ behavior: 'smooth' });
    });

    // --- INICIALIZAÇÃO DA PÁGINA ---
    renderizarImoveis();
});
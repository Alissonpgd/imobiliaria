document.addEventListener('DOMContentLoaded', () => {
    const detalheContainer = document.getElementById('detalhe-imovel-container');

    const carregarImovel = () => {
        // Pega o ID do imóvel da URL (ex: imovel.html?id=12345)
        const urlParams = new URLSearchParams(window.location.search);
        const imovelId = parseInt(urlParams.get('id'));

        if (!imovelId) {
            detalheContainer.innerHTML = '<p class="text-center text-danger">Imóvel não encontrado.</p>';
            return;
        }

        const imoveisJSON = localStorage.getItem('imoveisDB');
        const imoveis = imoveisJSON ? JSON.parse(imoveisJSON) : [];
        const imovel = imoveis.find(i => i.id === imovelId);

        if (imovel) {
            renderizarDetalhes(imovel);
        } else {
            detalheContainer.innerHTML = '<p class="text-center text-danger">Detalhes do imóvel não encontrados.</p>';
        }
    };

    const renderizarDetalhes = (imovel) => {
        // Constrói os itens do carrossel
        let carrosselItems = '';
        let carrosselIndicators = '';
        imovel.fotos.forEach((foto, index) => {
            carrosselItems += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${foto}" class="d-block w-100 rounded" style="height: 500px; object-fit: cover;" alt="Foto ${index + 1} do imóvel">
                </div>
            `;
            carrosselIndicators += `
                <button type="button" data-bs-target="#carrosselImovel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${index + 1}"></button>
            `;
        });

        // Monta o HTML completo da página
        const detalheHTML = `
            <div class="row">
                <div class="col-lg-8">
                    <!-- Carrossel de Fotos -->
                    <div id="carrosselImovel" class="carousel slide shadow-sm mb-4" data-bs-ride="carousel">
                        <div class="carousel-indicators">${carrosselIndicators}</div>
                        <div class="carousel-inner">${carrosselItems}</div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carrosselImovel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carrosselImovel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div class="col-lg-4">
                    <h2>${imovel.titulo}</h2>
                    <p class="lead text-muted">${imovel.bairro}, Campina Grande - PB</p>
                    <h3 class="text-primary my-3">R$ ${imovel.preco || 'A consultar'}</h3>
                    <div class="d-flex justify-content-start gap-4 my-4">
                        <span><i class="fas fa-bed me-2"></i> ${imovel.quartos} Quartos</span>
                        <span><i class="fas fa-bath me-2"></i> ${imovel.banheiros || 1} Banh.</span>
                        <span><i class="fas fa-car me-2"></i> ${imovel.vagas || 1} Vaga</span>
                    </div>
                    <a href="https://wa.me/5583999999999?text=Olá!%20Tenho%20interesse%20no%20imóvel%20cód.%20${imovel.id}" class="btn btn-success btn-lg w-100">
                        <i class="fab fa-whatsapp me-2"></i> Falar com Corretor
                    </a>
                </div>
            </div>
            <hr class="my-4">
            <div>
                <h4>Descrição</h4>
                <p style="white-space: pre-wrap;">${imovel.descricao}</p>
            </div>
        `;
        detalheContainer.innerHTML = detalheHTML;
    };

    carregarImovel();
});
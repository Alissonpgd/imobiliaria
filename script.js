const renderizarImoveis = (termoBusca = '') => {
    const imoveis = carregarImoveis();
    listaImoveisDiv.innerHTML = '';
    termoBusca = termoBusca.toLowerCase();

    const imoveisFiltrados = imoveis.filter(imovel => {
        // Validação defensiva: só filtra se o imovel e suas propriedades existirem
        if (!imovel || !imovel.titulo || !imovel.bairro) return false;

        return imovel.titulo.toLowerCase().includes(termoBusca) || imovel.bairro.toLowerCase().includes(termoBusca);
    });

    if (imoveisFiltrados.length === 0) {
        semImoveisAviso.classList.remove('d-none');
        semImoveisAviso.textContent = termoBusca ? "Nenhum imóvel encontrado para esta busca." : "Nenhum imóvel cadastrado. Seja o primeiro a anunciar!";
    } else {
        semImoveisAviso.classList.add('d-none');
        imoveisFiltrados.sort((a, b) => b.id - a.id).forEach(imovel => {

            // AQUI ESTÁ A CORREÇÃO PRINCIPAL:
            // Verificamos se 'imovel.fotos' existe e se não está vazio.
            // Se não tiver fotos, usamos uma imagem padrão.
            const fotoPrincipal = (imovel.fotos && imovel.fotos.length > 0)
                ? imovel.fotos[0]
                : 'https://via.placeholder.com/400x220/ccc/808080?text=Sem+Foto';

            const cardHTML = `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${fotoPrincipal}" class="card-img-top" style="height: 220px; object-fit: cover;" alt="Foto de ${imovel.titulo}">
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
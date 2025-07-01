document.addEventListener('DOMContentLoaded', () => {
    // Selecionando os elementos do portal
    const loginCreciDiv = document.getElementById('login-creci');
    const ferramentaIaDiv = document.getElementById('ferramenta-ia');
    const formValidaCreci = document.getElementById('form-valida-creci');
    const inputCreci = document.getElementById('creci');

    // Selecionando os elementos da ferramenta de IA
    const iaForm = document.getElementById('ia-form');
    const resultadoIaTexto = document.getElementById('resultado-ia-texto');
    const botoesAcaoIa = document.getElementById('botoes-acao-ia');
    const btnCopiar = document.getElementById('btn-copiar');
    const btnUsarDescricao = document.getElementById('btn-usar-descricao');
    const spinner = '<i class="fas fa-spinner fa-spin"></i> Gerando descrição. Aguarde...';

    // Selecionando elementos de upload de fotos
    const inputFotos = document.getElementById('fotosImovel');
    const previewFotosDiv = document.getElementById('preview-fotos');
    let arquivosDeFotos = []; // Array para guardar os arquivos selecionados

    // --- LÓGICA DE LOGIN COM CRECI ---
    formValidaCreci.addEventListener('submit', (event) => {
        event.preventDefault();
        // Validação simples: verifica se o campo não está vazio e tem pelo menos 4 caracteres.
        // Numa aplicação real, isso consultaria uma API de validação de CRECI.
        if (inputCreci.value && inputCreci.value.length >= 4) {
            loginCreciDiv.classList.add('d-none'); // Esconde o login
            ferramentaIaDiv.classList.remove('d-none'); // Mostra a ferramenta
        } else {
            alert('Por favor, insira um CRECI válido para continuar.');
        }
    });

    // --- LÓGICA DE UPLOAD E PREVIEW DE FOTOS ---
    inputFotos.addEventListener('change', () => {
        previewFotosDiv.innerHTML = ''; // Limpa o preview antigo
        arquivosDeFotos = Array.from(inputFotos.files); // Atualiza nosso array de arquivos

        // Limita a 5 fotos
        if (arquivosDeFotos.length > 5) {
            alert('Você pode selecionar no máximo 5 fotos.');
            arquivosDeFotos = arquivosDeFotos.slice(0, 5); // Pega apenas as 5 primeiras
        }

        arquivosDeFotos.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'preview-imagem-container';

                const img = document.createElement('img');
                img.src = reader.result;

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remover-img-btn';
                removeBtn.innerHTML = '×';
                removeBtn.title = 'Remover imagem';

                // Evento para remover a imagem
                removeBtn.addEventListener('click', () => {
                    // Remove o arquivo do nosso array
                    arquivosDeFotos.splice(index, 1);
                    // Remove o elemento visual do preview
                    imgContainer.remove();
                    // NOTE: Isso não remove o arquivo do <input> original, mas nosso array é a fonte da verdade.
                });

                imgContainer.appendChild(img);
                imgContainer.appendChild(removeBtn);
                previewFotosDiv.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    });


    // --- LÓGICA DE GERAÇÃO COM IA ---
    iaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        botoesAcaoIa.classList.add('d-none');
        resultadoIaTexto.innerHTML = spinner;

        // Coleta dos dados...
        const tipoImovel = document.getElementById('tipoImovel').value;
        const bairro = document.getElementById('bairro').value;
        const quartos = document.getElementById('quartos').value;
        const caracteristicas = document.getElementById('caracteristicas').value;

        const prompt = `
            Crie uma descrição de anúncio imobiliário atraente e profissional para o seguinte imóvel.
            Use um tom amigável e vendedor, destacando os benefícios.
            O texto deve ter entre 3 e 4 parágrafos curtos.
            
            - Tipo de Imóvel: ${tipoImovel}
            - Bairro: ${bairro}, em Campina Grande - PB
            - Quartos: ${quartos}
            - Características Especiais: ${caracteristicas}
        `;

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                const errorMessage = errorBody ? errorBody.error : 'O servidor não deu detalhes.';
                throw new Error(`Erro do Servidor: ${response.status}. Detalhes: ${errorMessage}`);
            }

            const data = await response.json();
            const descricaoGerada = data.descricao;

            resultadoIaTexto.innerHTML = descricaoGerada.replace(/\n/g, '<br>');
            botoesAcaoIa.classList.remove('d-none');

        } catch (error) {
            console.error('Erro detalhado ao gerar descrição:', error);
            resultadoIaTexto.innerText = 'Desculpe, houve um problema. Por favor, tente novamente.';
            botoesAcaoIa.classList.add('d-none');
        }
    });

    // --- LÓGICA DOS BOTÕES DE AÇÃO ---
    btnCopiar.addEventListener('click', () => {
        const textoParaCopiar = resultadoIaTexto.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
        navigator.clipboard.writeText(textoParaCopiar).then(() => {
            btnCopiar.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => {
                btnCopiar.innerHTML = '<i class="fas fa-copy"></i> Copiar Texto';
            }, 2000);
        });
    });

    btnUsarDescricao.addEventListener('click', () => {
        // No futuro, isso faria a submissão de TODOS os dados: fotos, inputs e a descrição gerada.
        alert('Anúncio salvo com sucesso! (Simulação)');
        iaForm.reset(); // Limpa o formulário
        previewFotosDiv.innerHTML = ''; // Limpa o preview
        resultadoIaTexto.innerHTML = '<p class="text-muted">Preencha todos os campos e clique em gerar.</p>';
        botoesAcaoIa.classList.add('d-none');
    });
});
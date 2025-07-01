document.addEventListener('DOMContentLoaded', () => {

    const iaForm = document.getElementById('ia-form');
    const resultadoIa = document.getElementById('resultado-ia');

    iaForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const tipoImovel = document.getElementById('tipoImovel').value;
        const bairro = document.getElementById('bairro').value;
        const quartos = document.getElementById('quartos').value;
        const caracteristicas = document.getElementById('caracteristicas').value;

        resultadoIa.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando descrição. Aguarde...';

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            // AQUI ESTÁ A MUDANÇA: vamos capturar mais detalhes antes de dar erro.
            if (!response.ok) {
                // Vamos ler a resposta de erro do servidor para ver a mensagem
                const errorBody = await response.json().catch(() => null); // Tenta ler o corpo do erro
                const errorMessage = errorBody ? errorBody.error : 'O servidor não deu detalhes.';

                // Lançamos um erro mais informativo
                throw new Error(`Erro do Servidor: ${response.status} ${response.statusText}. Detalhes: ${errorMessage}`);
            }

            const data = await response.json();
            const descricaoGerada = data.descricao;

            resultadoIa.innerHTML = descricaoGerada.replace(/\n/g, '<br>');

        } catch (error) {
            // Agora o console.error vai mostrar a mensagem completa que criamos
            console.error('Erro detalhado ao gerar descrição:', error);
            resultadoIa.innerText = 'Desculpe, houve um problema ao se comunicar com nosso servidor. Tente novamente.';
        }
    });
});
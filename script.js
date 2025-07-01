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
            // AQUI ESTÁ A MUDANÇA: Chamamos nossa própria API!
            const response = await fetch('/api/generate', { // A Vercel entende esse caminho
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error('Falha na comunicação com a IA.');
            }

            const data = await response.json();
            const descricaoGerada = data.descricao;

            // Usamos .replace() para formatar o texto com quebras de linha no HTML
            resultadoIa.innerHTML = descricaoGerada.replace(/\n/g, '<br>');

        } catch (error) {
            console.error('Erro ao gerar descrição:', error);
            resultadoIa.innerText = 'Desculpe, não foi possível gerar a descrição no momento. Tente novamente.';
        }
    });
});
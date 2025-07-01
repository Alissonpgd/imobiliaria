// Importa a biblioteca do Google
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Pega a sua chave de API secreta que estará guardada na Vercel (NÃO AQUI NO CÓDIGO)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Esta é a função que a Vercel vai rodar.
// 'req' é o pedido que chega do seu site, 'res' é a resposta que vamos enviar de volta.
export default async function handler(req, res) {
    // Garante que o método seja POST (mais seguro)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body; // Pega o prompt que o frontend enviou

        // Validação simples
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Inicializa o modelo Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Gera o conteúdo com base no prompt
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Envia o texto gerado de volta para o frontend
        res.status(200).json({ descricao: text });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate description' });
    }
}

import { GoogleGenAI, Type } from "@google/genai";

// Ensure API_KEY is available in the environment.
// In a real app, this would be handled by the build/deployment environment.
// Using import.meta.env for Vite compatibility, falling back to process.env if needed (though process might not exist)
const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || process.env.API_KEY;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        serviceType: {
            type: Type.STRING,
            description: "Categorize o serviço em uma das seguintes opções: Instalação, Manutenção, Reparo, Upgrade, Consultoria, Outro. Seja conciso."
        },
        notes: {
            type: Type.STRING,
            description: "Resuma o problema ou a solicitação do cliente em um parágrafo curto para o campo de observações técnicas. Capture os pontos chave."
        }
    },
    required: ["serviceType", "notes"]
};

export const parseServiceRequest = async (description: string): Promise<{ serviceType: string; notes: string } | null> => {
    if (!API_KEY) {
        console.warn("Gemini API key is not configured.");
        alert("A chave da API Gemini não está configurada. Esta funcionalidade está desativada.");
        return null;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp", // Updated to a valid model name if needed, or keep gemini-1.5-flash
            contents: `Analise a seguinte solicitação de serviço e extraia as informações estruturadas conforme o schema. Solicitação: "${description}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const text = result.text.trim();
        const parsedJson = JSON.parse(text);
        return parsedJson;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        alert("Falha ao processar a solicitação com a IA. Por favor, preencha os campos manualmente.");
        return null;
    }
};

import { GoogleGenAI, Modality } from "@google/genai";

// The API key is injected from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const BASE_PROMPT_PREFIX = "Genera una imagen profesional en formato 1:1 para publicación en LinkedIn. Tema:";
const BASE_PROMPT_SUFFIX = "El estilo debe ser moderno, con buena iluminación y enfoque, transmitiendo confianza, liderazgo e innovación. Colores sobrios, con predominio de azules, grises y tonos neutros. Fondos limpios y profesionales. Rostros naturales, expresiones positivas o inspiradoras.";

export const generateLinkedInImages = async (
    userPrompt: string,
    stylePrompt: string,
    count: number, 
    referenceImage: string | null
): Promise<string[]> => {
    if (!userPrompt.trim()) {
        throw new Error("La descripción no puede estar vacía.");
    }
    
    const fullPrompt = `${BASE_PROMPT_PREFIX} ${userPrompt}. Estilo: ${stylePrompt}. ${BASE_PROMPT_SUFFIX}`;

    try {
        const generationPromises: Promise<string>[] = [];
        
        for (let i = 0; i < count; i++) {
            generationPromises.push(
                (async () => {
                    const parts: any[] = [{ text: fullPrompt }];

                    if (referenceImage) {
                        const [header, base64Data] = referenceImage.split(',');
                        if (!base64Data) {
                            throw new Error("Formato de imagen de referencia no válido.");
                        }
                        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
                        
                        // Add the image part to the beginning of the array
                        parts.unshift({
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType,
                            },
                        });
                    }

                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash-image',
                        contents: { parts },
                        config: {
                            responseModalities: [Modality.IMAGE],
                        },
                    });
                    
                    for (const part of response.candidates[0].content.parts) {
                        if (part.inlineData) {
                            const base64ImageBytes: string = part.inlineData.data;
                            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                        }
                    }
                    
                    throw new Error("No se pudo extraer la imagen de la respuesta de la IA.");
                })()
            );
        }
        
        const imageUrls = await Promise.all(generationPromises);

        if (imageUrls.length === 0) {
            throw new Error("No se pudieron generar las imágenes. Intenta con una descripción diferente.");
        }
        
        return imageUrls;

    } catch (error) {
        console.error("Error generating images:", error);
        if (error instanceof Error) {
            if(error.message.includes('API key not valid')) {
                return Promise.reject(new Error('La clave de API no es válida. Por favor, verifica tu configuración.'));
            }
            return Promise.reject(new Error(`Error al contactar el servicio de IA. ${error.message}`));
        }
        return Promise.reject(new Error("Ocurrió un error inesperado al generar las imágenes."));
    }
};
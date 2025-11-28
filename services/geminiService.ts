import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model Constants
const MODEL_FLASH = 'gemini-2.5-flash';
const MODEL_FLASH_LITE = 'gemini-2.5-flash-lite-preview-02-05';
const MODEL_PRO_VISION = 'gemini-3-pro-preview';

export interface AnalysisOptions {
  useThinking?: boolean;
  image?: string; // Base64 string
  mimeType?: string;
}

export const analyzeTicketIssue = async (
  title: string, 
  description: string, 
  deviceName: string, 
  options?: AnalysisOptions
): Promise<string> => {
  try {
    const prompt = `
      بصفتك خبير صيانة أجهزة طبية، قم بتحليل المشكلة التالية:
      الجهاز: ${deviceName}
      العنوان: ${title}
      الوصف: ${description}

      قدم تشخيصًا أوليًا محتملاً وخطوات مقترحة للفني للتحقق منها. 
      اجعل الرد باللغة العربية.
    `;

    let modelName = MODEL_FLASH;
    let config: any = {};
    const parts: Part[] = [];

    // Image Analysis (gemini-3-pro-preview)
    if (options?.image && options?.mimeType) {
      modelName = MODEL_PRO_VISION;
      parts.push({
        inlineData: {
          data: options.image,
          mimeType: options.mimeType
        }
      });
      parts.push({ text: "قم بتحليل الصورة المرفقة لهذا الجهاز الطبي مع الوصف التالي:" });
    }

    parts.push({ text: prompt });

    // Thinking Mode (gemini-3-pro-preview)
    if (options?.useThinking) {
      modelName = MODEL_PRO_VISION;
      config.thinkingConfig = { thinkingBudget: 32768 };
      // Note: Do not set maxOutputTokens when using thinkingBudget logic for max reasoning
    } 

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: config
    });

    return response.text || "لم يتمكن النظام من تحليل المشكلة حالياً.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.";
  }
};

export type ChatMode = 'fast' | 'search' | 'thinking';

export const createTechnicianChat = (mode: ChatMode = 'fast'): Chat => {
  let modelName = MODEL_FLASH_LITE;
  let config: any = {
    systemInstruction: `
      أنت مساعد فني ذكي متخصص في صيانة الأجهزة الطبية في المملكة العربية السعودية.
      تحدث باللغة العربية بأسلوب مهني.
    `,
  };

  if (mode === 'fast') {
    modelName = MODEL_FLASH_LITE; // Low latency
  } else if (mode === 'search') {
    modelName = MODEL_FLASH; // Supports Google Search
    config.tools = [{ googleSearch: {} }];
    // Ensure we don't set responseMimeType/responseSchema with googleSearch
  } else if (mode === 'thinking') {
    modelName = MODEL_PRO_VISION; // Supports Thinking
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  return ai.chats.create({
    model: modelName,
    config: config,
  });
};

export interface DatabaseCheckResult {
  text: string;
  sources: Array<{title: string; uri: string}>;
}

export const checkDeviceDatabase = async (deviceName: string, serialNumber: string): Promise<DatabaseCheckResult> => {
  const modelName = MODEL_FLASH;
  const prompt = `
    قم بالبحث الدقيق في قاعدة بيانات الأجهزة الطبية والإنترنت عن الجهاز التالي: "${deviceName}".
    
    الهدف: التحقق من بيانات الجهاز وتوافقه مع معايير المملكة العربية السعودية (SFDA - الهيئة العامة للغذاء والدواء).
    
    المطلوب:
    1. حالة التسجيل أو الاعتماد (إذا توفرت معلومات عامة).
    2. المواصفات الفنية الرئيسية.
    3. بلد المنشأ والشركة المصنعة.
    4. أي تحذيرات سلامة (Recalls) أو تنبيهات صيانة عالمية حديثة.
    
    قدم ملخصاً احترافياً باللغة العربية.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    // Extract sources
    const sources: Array<{title: string; uri: string}> = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((c: any) => {
            if (c.web?.uri) {
                sources.push({ title: c.web.title, uri: c.web.uri });
            }
        });
    }

    // Filter unique sources
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return {
        text: response.text || "لم يتم العثور على معلومات كافية في قاعدة البيانات العامة.",
        sources: uniqueSources
    };

  } catch (e) {
      console.error("Database Check Error:", e);
      return { text: "حدث خطأ أثناء الاتصال بقاعدة البيانات.", sources: [] };
  }
};
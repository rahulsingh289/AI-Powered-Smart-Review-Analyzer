import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const GEMINI_TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS) || 15000;

let genAI = null;

/**
 * Initialize the Google Generative AI client.
 */
export const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment variables.");
    return null;
  }
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

/**
 * Lazily loads and returns the initialized Generative AI client.
 * Raises an error if key is not configured.
 * 
 * @returns {GoogleGenerativeAI}
 */
const getGenerativeClient = () => {
  if (!genAI) {
    initGemini();
  }
  if (!genAI) {
    throw new Error("Gemini API is not initialized. Please configure GEMINI_API_KEY in your backend/.env file.");
  }
  return genAI;
};

/**
 * Formats the customer reviews into a structured prompt targeting specific styles.
 * 
 * @param {string[]} lines 
 * @param {string} tone 
 * @param {string} language 
 * @returns {string} Prompt string
 */
const buildAnalysisPrompt = (lines, tone, language) => {
  return `
You are an expert hospitality customer service AI.
Analyze the following guest reviews.
For each review, determine the sentiment, identify the primary theme, and generate a suggested response.

Target Tone: ${tone}
Target Language: ${language}

Input Reviews:
${JSON.stringify(lines, null, 2)}

Requirements for each review:
1. "text": Must match the original review text exactly.
2. "sentiment": Must be exactly one of: "Positive", "Neutral", "Negative".
3. "theme": Identify the main category of feedback. Use standard theme names such as "Cleanliness", "Facilities", "Value", "Location", "Food/Host". If a review doesn't match these, categorize it under the most appropriate specific word.
4. "suggestedResponse": Generate a reply to the customer in the requested language "${language}" and tone "${tone}". Address specific comments mentioned in the review. If the sentiment is Negative, offer an appropriate apology and plan of action.

Output Format:
You MUST return a JSON array containing one object per input review, matching this schema:
[
  {
    "text": "original review text",
    "sentiment": "Positive" | "Neutral" | "Negative",
    "theme": "ThemeName",
    "suggestedResponse": "detailed reply matching the requested language and tone"
  }
]
`;
};

/**
 * Wraps content generation call in a Promise.race timeout wrapper.
 * 
 * @param {any} model 
 * @param {string} prompt 
 * @returns {Promise<string>} Raw output text
 */
const executeGeminiCallWithTimeout = async (model, prompt) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Gemini API request timed out after ${GEMINI_TIMEOUT_MS / 1000} seconds.`));
    }, GEMINI_TIMEOUT_MS);
  });

  const apiPromise = (async () => {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const response = await result.response;
    return response.text();
  })();

  try {
    return await Promise.race([apiPromise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Parses and verifies if output is a valid JSON array format.
 * 
 * @param {string} jsonText 
 * @returns {any[]}
 */
const parseAndValidateResponse = (jsonText) => {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) {
    throw new Error("Gemini response is not a valid JSON array.");
  }
  return parsed;
};

/**
 * Call the Gemini model to analyze reviews (Orchestrator).
 * 
 * @param {string[]} lines - Array of review texts.
 * @param {string} tone - Requested response tone.
 * @param {string} language - Requested response language.
 * @param {string} [promptTemplate] - Optional custom prompt template to test variations.
 * @returns {Promise<Array<{text: string, sentiment: string, theme: string, suggestedResponse: string}>>}
 */
export const analyzeReviewsWithGemini = async (lines, tone, language, promptTemplate = null) => {
  const client = getGenerativeClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  // Construct prompt
  const prompt = promptTemplate
    ? promptTemplate
        .replace("{{tone}}", tone)
        .replace("{{language}}", language)
        .replace("{{reviews}}", JSON.stringify(lines, null, 2))
    : buildAnalysisPrompt(lines, tone, language);

  // Execute API call
  const responseText = await executeGeminiCallWithTimeout(model, prompt);

  // Parse and return validated structures
  return parseAndValidateResponse(responseText);
};

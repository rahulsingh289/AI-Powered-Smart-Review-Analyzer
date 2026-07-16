# Prompts Log: Google Gemini Review Analysis

This document details the development and iteration of prompts for the AI Review Analyzer feature using the Google Gemini API (`gemini-1.5-flash`). We designed, tested, and compared three distinct prompt variations.

---

## Input Sample Used for Testing
```json
[
  "The bathroom was dirty and smelled like wet dog.",
  "Excellent food and very polite receptionist! Had a wonderful dinner.",
  "WiFi was slow, but the beach view was absolutely stunning."
]
```
*   **Target Tone**: Empathetic
*   **Target Language**: Spanish

---

## Prompt Variation 1: Minimal Prompt
### Prompt Content
```
Analyze these reviews:
["The bathroom was dirty and smelled like wet dog.","Excellent food and very polite receptionist! Had a wonderful dinner.","WiFi was slow, but the beach view was absolutely stunning."]
Output a JSON array of objects. For each object, include "text", "sentiment" (Positive/Neutral/Negative), "theme" (Cleanliness/Facilities/Value/Location/Food/Host), and "suggestedResponse" (in Empathetic tone and Spanish language).
```

### Example Output
```json
[
  {
    "text": "The bathroom was dirty and smelled like wet dog.",
    "sentiment": "Negative",
    "theme": "Cleanliness",
    "suggestedResponse": "Lamentamos mucho escuchar eso. Nos disculpamos por el inconveniente con el baño."
  },
  {
    "text": "Excellent food and very polite receptionist! Had a wonderful dinner.",
    "sentiment": "Positive",
    "theme": "Food/Host",
    "suggestedResponse": "Muchas gracias por sus amables palabras sobre nuestra comida y personal."
  },
  {
    "text": "WiFi was slow, but the beach view was absolutely stunning.",
    "sentiment": "Neutral",
    "theme": "Facilities",
    "suggestedResponse": "Nos alegra que le gustara la vista. Trabajaremos en mejorar el WiFi."
  }
]
```

### Evaluation
*   **Pros**: Short, easy to compute.
*   **Cons**: Lacks clear constraints. Responses are brief and generic, failing to sound truly "empathetic." Sentiment analysis on mixed reviews (e.g. WiFi vs. Beach view) is inconsistent.

---

## Prompt Variation 2: Few-Shot / Role-Based Prompt
### Prompt Content
```
You are an experienced Customer Service Manager for a boutique hotel.
Your task is to analyze guest reviews and draft replies.

Tone: Empathetic
Language: Spanish

Examples:
Review: "The room was dusty and AC did not cool properly."
Output: {
  "text": "The room was dusty and AC did not cool properly.",
  "sentiment": "Negative",
  "theme": "Cleanliness",
  "suggestedResponse": "Lamentamos mucho que la habitación y el aire acondicionado no hayan cumplido con sus expectativas. Hemos notificado al equipo."
}

Analyze the following:
["The bathroom was dirty and smelled like wet dog.","Excellent food and very polite receptionist! Had a wonderful dinner.","WiFi was slow, but the beach view was absolutely stunning."]

Return a JSON array of objects with keys: "text", "sentiment", "theme", "suggestedResponse". Ensure responses are translated to Spanish and set to Empathetic tone.
```

### Example Output
```json
[
  {
    "text": "The bathroom was dirty and smelled like wet dog.",
    "sentiment": "Negative",
    "theme": "Cleanliness",
    "suggestedResponse": "Lamentamos mucho las molestias causadas por la falta de limpieza en el baño. Hemos reportado esto de inmediato a nuestro equipo de limpieza para que sea solucionado."
  },
  {
    "text": "Excellent food and very polite receptionist! Had a wonderful dinner.",
    "sentiment": "Positive",
    "theme": "Food/Host",
    "suggestedResponse": "Nos alegra enormemente saber que disfrutó de una deliciosa cena y que la atención de nuestro recepcionista fue de su agrado. ¡Esperamos verle de nuevo pronto!"
  },
  {
    "text": "WiFi was slow, but the beach view was absolutely stunning.",
    "sentiment": "Neutral",
    "theme": "Facilities",
    "suggestedResponse": "Agradecemos sus comentarios. Sentimos el inconveniente con la velocidad de la conexión WiFi y nos alegra que la vista de la playa haya sido de su agrado. Trabajamos para mejorar."
  }
]
```

### Evaluation
*   **Pros**: The role definition encourages professional phrasing. Few-shot example helps ensure formatting and style align with expectations.
*   **Cons**: Gemini occasionally mirrors the example response phrasing too closely (e.g., using similar transition words and apologizing in the exact same style).

---

## Prompt Variation 3: Structured Instruction & Constraints Prompt (Selected)
### Prompt Content
```
You are an expert hospitality customer service AI.
Analyze the following guest reviews.
For each review, determine the sentiment, identify the primary theme, and generate a suggested response.

Target Tone: Empathetic
Target Language: Spanish

Input Reviews:
[
  "The bathroom was dirty and smelled like wet dog.",
  "Excellent food and very polite receptionist! Had a wonderful dinner.",
  "WiFi was slow, but the beach view was absolutely stunning."
]

Requirements for each review:
1. "text": Must match the original review text exactly.
2. "sentiment": Must be exactly one of: "Positive", "Neutral", "Negative".
3. "theme": Identify the main category of feedback. Use standard theme names such as "Cleanliness", "Facilities", "Value", "Location", "Food/Host". If a review doesn't match these, categorize it under the most appropriate specific word.
4. "suggestedResponse": Generate a reply to the customer in the requested language "Spanish" and tone "Empathetic". Address specific comments mentioned in the review. If the sentiment is Negative, offer an appropriate apology and plan of action.

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
```

### Example Output
```json
[
  {
    "text": "The bathroom was dirty and smelled like wet dog.",
    "sentiment": "Negative",
    "theme": "Cleanliness",
    "suggestedResponse": "Le pedimos nuestras más sinceras disculpas por el estado del baño a su llegada. Entendemos lo frustrante que esto debe ser; nuestro equipo de ama de llaves ya ha sido notificado para desinfectar e inspeccionar el área a fondo."
  },
  {
    "text": "Excellent food and very polite receptionist! Had a wonderful dinner.",
    "sentiment": "Positive",
    "theme": "Food/Host",
    "suggestedResponse": "¡Muchas gracias por compartir su maravillosa experiencia! Nos complace saber que la cena y el servicio amable de nuestro recepcionista hicieron su noche especial. Transmitiremos sus elogios al equipo."
  },
  {
    "text": "WiFi was slow, but the beach view was absolutely stunning.",
    "sentiment": "Neutral",
    "theme": "Location",
    "suggestedResponse": "Agradecemos que destaque la hermosa vista de nuestra playa. Lamentamos sinceramente que la conexión de WiFi haya estado lenta durante su estancia; estamos revisando el ancho de banda para mejorar el servicio."
  }
]
```

### Evaluation
*   **Pros**: Highly structured rules result in extremely accurate responses. Distinctly guides tone generation (e.g. detailed apology + action plan for negative reviews). Output format fits the database schema perfectly.
*   **Cons**: Slightly longer prompt, but highly reliable.

---

## Conclusion: Which Prompt Worked Best and Why?
**Prompt Variation 3** worked best for this feature. It provides clear, actionable instructions and strict schema boundaries which prevent formatting errors when parsing the JSON output. Additionally, by specifying clear guidelines for generating suggested responses (e.g. requiring a plan of action for negative sentiments), the output suggestions are much higher quality and fit the requested tone (e.g. empathetic, professional, casual) and language perfectly.

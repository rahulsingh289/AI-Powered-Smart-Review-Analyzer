import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend Vite dev server origin
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());

// In-memory data store for Reviews (CRUD operations)
let reviews = [
  {
    id: 1,
    text: "The food was amazing and host was very friendly and helpful",
    sentiment: "Positive",
    theme: "Food/Host",
    date: "2 May 2026",
    suggestedResponse: "Thank you so much for your kind words! We are happy you enjoyed your stay"
  },
  {
    id: 2,
    text: "Room was clean and location is near to the beach",
    sentiment: "Positive",
    theme: "Cleanliness",
    date: "13 May 2026",
    suggestedResponse: "We're glad you enjoyed our location and cleanliness. We look forward to hosting you again!"
  },
  {
    id: 3,
    text: "The WiFi was slow and the TV did not work",
    sentiment: "Negative",
    theme: "Facilities",
    date: "28 May 2026",
    suggestedResponse: "We are sorry for the convenience. We will check the WiFi speed and the TV issues immediately."
  },
  {
    id: 4,
    text: "Bathroom was not clean and smelled bad.",
    sentiment: "Negative",
    theme: "Location",
    date: "9 May 2026",
    suggestedResponse: "We apologize for the cleanliness. We have flagged this with our housekeeping team to improve."
  },
  {
    id: 5,
    text: "Good value for money. I will come back again",
    sentiment: "Positive",
    theme: "Value",
    date: "30 Apr 2026",
    suggestedResponse: "Great value is what we strive for! Thank you for staying with us, and see you next time!"
  }
];

// Mock translation engine
const translateText = (text, targetLang) => {
  if (targetLang === "Spanish") {
    // Basic translations for common structures
    let translated = text;
    if (text.includes("We apologize for the cleanliness issues")) {
      translated = "Nos disculpamos por los problemas de limpieza. Lo hemos reportado al equipo de mantenimiento.";
    } else if (text.includes("Thank you! We take pride in keeping our rooms clean")) {
      translated = "¡Gracias! Nos enorgullece mantener nuestras habitaciones limpias y cómodas.";
    } else if (text.includes("Thank you so much! Our hospitality staff")) {
      translated = "¡Muchas gracias! Nuestro personal de servicio está encantado de atenderle.";
    } else if (text.includes("We apologize for the service issues")) {
      translated = "Nos disculpamos por los problemas de servicio. Hemos compartido esto con nuestro equipo para mejorar.";
    }
    
    if (translated === text) {
      return "[Traducido]: " + text;
    }
    return translated;
  }
  
  if (targetLang === "French") {
    let translated = text;
    if (text.includes("We apologize for the cleanliness issues")) {
      translated = "Nous nous excusons pour les problèmes de propreté. Nous avons signalé cela à notre équipe de ménage.";
    } else if (text.includes("Thank you! We take pride in keeping our rooms clean")) {
      translated = "Merci! Nous sommes fiers de garder nos chambres propres et confortables.";
    } else if (text.includes("Thank you so much! Our hospitality staff")) {
      translated = "Merci beaucoup! Notre personnel est ravi de vous servir.";
    } else if (text.includes("We apologize for the service issues")) {
      translated = "Nous nous excusons pour les problèmes de service. Nous avons partagé cela avec notre équipe pour nous améliorer.";
    }
    
    if (translated === text) {
      return "[Traduit]: " + text;
    }
    return translated;
  }

  if (targetLang === "German") {
    let translated = text;
    if (text.includes("We apologize for the cleanliness issues")) {
      translated = "Wir entschuldigen uns für die Sauberkeitsprobleme. Wir haben dies an unser Reinigungsteam weitergeleitet.";
    } else if (text.includes("Thank you! We take pride in keeping our rooms clean")) {
      translated = "Vielen Dank! Wir legen großen Wert auf saubere und komfortable Zimmer.";
    } else if (text.includes("Thank you so much! Our hospitality staff")) {
      translated = "Vielen Dank! Unser Service-Team freut sich sehr über Ihre Worte.";
    } else if (text.includes("We apologize for the service issues")) {
      translated = "Wir entschuldigen uns für die Serviceprobleme. Wir haben dies mit unserem Team besprochen.";
    }
    
    if (translated === text) {
      return "[Übersetzt]: " + text;
    }
    return translated;
  }

  return text; // English
};

// Helper to extract keywords for sentiment/theme analysis (NLP Mock Engine)
const parseReviewNLP = (line, idx, tone = "Professional", language = "English") => {
  let sentiment = "Positive";
  let theme = "Food/Host";
  let response = "Thank you so much for your kind words! We are happy you enjoyed your stay.";

  const lower = line.toLowerCase();
  
  // Keyword lists
  const negativeWords = [
    "dirty", "smell", "bad", "slow", "broken", "not work", "poor", "expensive", 
    "overpriced", "rude", "cold", "disappointed", "worst", "terrible", "annoying", 
    "uncomfortable", "horrible", "awful", "ugly", "unprofessional", "waste", 
    "disgusting", "nasty", "horrid", "dislike", "hate", "unfriendly", "unhelpful",
    "noisy", "loud", "crowded", "smelly", "dusty", "stain", "stained", "messy"
  ];
  const positiveWords = [
    "amazing", "friendly", "helpful", "clean", "location", "near", "good", "great", 
    "value", "comfort", "nice", "excellent", "wonderful", "perfect", "love", 
    "tasty", "delicious", "happy", "pleased", "satisfied", "enjoyed", "best",
    "brilliant", "fantastic", "awesome", "spotless", "welcoming", "cosy", "cozy",
    "superb", "satisfying", "pleasant", "recommend"
  ];
  const neutralWords = [
    "ok", "okay", "average", "decent", "fine", "normal", "mediocre", 
    "moderate", "so-so", "satisfactory", "but", "though", "however"
  ];

  let hasNegative = negativeWords.some(w => lower.includes(w));
  let hasPositive = positiveWords.some(w => lower.includes(w));
  const hasNeutral = neutralWords.some(w => lower.includes(w));

  // Negation check (e.g. "not clean", "no wifi", "not friendly")
  const negatedPositivePhrases = [
    "not clean", "not friendly", "not helpful", "not good", "not great", 
    "not nice", "not comfortable", "no wifi", "no tv", "not enjoy", 
    "not satisfied", "not happy", "did not like", "didn't like", 
    "dont like", "don't like", "not worth", "no value", "not value",
    "not working", "not work"
  ];
  const hasNegatedPositive = negatedPositivePhrases.some(phrase => lower.includes(phrase));

  if (hasNegatedPositive) {
    hasNegative = true;
    hasPositive = false;
  }

  // Determine sentiment
  if (hasNegative && hasPositive) {
    sentiment = "Neutral";
  } else if (hasNegative) {
    sentiment = "Negative";
  } else if (hasNeutral) {
    sentiment = "Neutral";
  } else if (hasPositive) {
    sentiment = "Positive";
  } else {
    // If no sentiment indicator keywords are matched, default to Neutral
    sentiment = "Neutral";
  }

  // Determine theme
  if (lower.includes("clean") || lower.includes("dirty") || lower.includes("smell") || lower.includes("bathroom") || lower.includes("room") || lower.includes("bed") || lower.includes("sheets") || lower.includes("towel") || lower.includes("housekeeping")) {
    theme = "Cleanliness";
  } else if (lower.includes("wifi") || lower.includes("tv") || lower.includes("internet") || lower.includes("ac") || lower.includes("facilities") || lower.includes("shower") || lower.includes("heater")) {
    theme = "Facilities";
  } else if (lower.includes("price") || lower.includes("money") || lower.includes("value") || lower.includes("expensive") || lower.includes("cost") || lower.includes("charge")) {
    theme = "Value";
  } else if (lower.includes("location") || lower.includes("beach") || lower.includes("near") || lower.includes("close") || lower.includes("walk") || lower.includes("distance") || lower.includes("view")) {
    theme = "Location";
  } else if (lower.includes("food") || lower.includes("host") || lower.includes("friendly") || lower.includes("staff") || lower.includes("helpful") || lower.includes("service") || lower.includes("breakfast")) {
    theme = "Food/Host";
  } else {
    theme = "Food/Host";
  }

  // Theme responses map based on Sentiment and AI Tone settings
  const responses = {
    "Cleanliness": {
      "Negative": {
        "Professional": "We apologize for the cleanliness issues. We have flagged this with our housekeeping team to resolve immediately.",
        "Casual": "So sorry about the room cleanliness! We've let our cleaning team know to make sure this doesn't happen again.",
        "Empathetic": "We are truly sorry that the cleanliness was not up to standard. We understand how disappointing this is, and we've contacted our housekeeping team to fix it.",
        "Concise": "We apologize for the cleanliness issue. We're addressing this with our housekeeping team."
      },
      "Positive": {
        "Professional": "Thank you! We take pride in keeping our rooms clean and comfortable for our guests.",
        "Casual": "Thanks! We love keeping everything sparkling clean and comfy for you.",
        "Empathetic": "Thank you so much! We are glad we could provide a clean, comfortable, and welcoming room for your stay.",
        "Concise": "Thanks! We're glad you found the room clean and comfortable."
      },
      "Neutral": {
        "Professional": "Thank you for the feedback. We appreciate your comments and will continue to work on maintaining clean spaces.",
        "Casual": "Thanks for the feedback! We'll keep working on keeping everything fresh and clean.",
        "Empathetic": "We appreciate your honest comments. We'll take this as an opportunity to review our housekeeping details.",
        "Concise": "Thanks. We will use your feedback to maintain our cleanliness standards."
      }
    },
    "Facilities": {
      "Negative": {
        "Professional": "We are sorry for the inconvenience caused. We will check the facility issues and correct them immediately.",
        "Casual": "Really sorry about the facility issues! We're on it and will get this fixed right away.",
        "Empathetic": "We apologize for the inconvenience with our facilities. We know how frustrating it is when things don't work, and we are fixing it.",
        "Concise": "Apologies for the facility issue. We are checking and fixing it now."
      },
      "Positive": {
        "Professional": "We are glad you enjoyed our modern facilities and amenities!",
        "Casual": "Awesome! Glad you liked our facilities and tech!",
        "Empathetic": "Thank you! We are delighted that our amenities and facilities contributed to a smooth and comfortable stay.",
        "Concise": "Thanks, glad to hear you enjoyed the facilities."
      },
      "Neutral": {
        "Professional": "Thank you for sharing your experience. We are in the process of auditing and updating our utility facilities.",
        "Casual": "Thanks for letting us know! We'll keep working on updating our facilities.",
        "Empathetic": "Thank you for the suggestions. We will look into these facility remarks to improve our overall setup.",
        "Concise": "Thanks. We are working on updating our facilities."
      }
    },
    "Value": {
      "Negative": {
        "Professional": "We appreciate your feedback on value. We monitor rates closely to match market expectations and comfort.",
        "Casual": "Thanks for the feedback on price. We try our best to keep things worth every penny.",
        "Empathetic": "We hear you, and we understand that pricing is important. We are reviewing our rates to ensure we provide value.",
        "Concise": "Apologies. We are reviewing our rates to match standard expectations."
      },
      "Positive": {
        "Professional": "Great value is what we strive to offer! We are happy your stay was worth it.",
        "Casual": "Sweet! We always aim to give you the best bang for your buck.",
        "Empathetic": "Thank you so much! We are thrilled we could deliver great value and an exceptional stay for your money.",
        "Concise": "Glad to hear we offered good value for your stay."
      },
      "Neutral": {
        "Professional": "Thank you. We appreciate your comments and strive to balance cost with our service standards.",
        "Casual": "Thanks! We'll keep working on offering a good experience for the price.",
        "Empathetic": "We appreciate your feedback. We are committed to making sure every guest gets a fair and high-quality stay.",
        "Concise": "Thank you. We try to balance pricing with standard services."
      }
    },
    "Location": {
      "Negative": {
        "Professional": "We understand location convenience varies. We offer transit details and tips to help you get around easier.",
        "Casual": "Sorry the location didn't suit you. We've got maps and transit tips to help you next time!",
        "Empathetic": "We understand location is critical, and we apologize if it was inconvenient. We hope our transport guides help.",
        "Concise": "Apologies. We provide transit tips to help guests get around."
      },
      "Positive": {
        "Professional": "Yes, our central location is one of our best features. We are glad it was convenient for you!",
        "Casual": "Totally! Our location is perfect for getting around easily.",
        "Empathetic": "We are so glad our convenient location made it easy for you to explore and enjoy your trip.",
        "Concise": "Glad our location was convenient for your stay."
      },
      "Neutral": {
        "Professional": "Thank you for the location feedback. We are situated near various local transit routes.",
        "Casual": "Thanks! Our location is pretty close to public transit.",
        "Empathetic": "Thank you. We list transport and local highlights to help make our location as convenient as possible.",
        "Concise": "Thanks. We are located near several local transit lines."
      }
    },
    "Food/Host": {
      "Negative": {
        "Professional": "We apologize for the service issues. We have shared this with our hospitality team for retraining.",
        "Casual": "Really sorry about the service! We'll discuss this with our crew to make it better next time.",
        "Empathetic": "We are deeply sorry for the service you received. We strive to be warm and helpful, and we failed here. We are retraining our team.",
        "Concise": "Apologies for the poor service. We are addressing this with our staff."
      },
      "Positive": {
        "Professional": "Thank you so much! Our hospitality staff is always thrilled to serve our guests.",
        "Casual": "Thanks a bunch! Our crew will be super happy to hear your nice words.",
        "Empathetic": "Thank you from the bottom of our hearts! Our team is dedicated to hospitality, and we're so glad you felt welcomed.",
        "Concise": "Thanks! Glad our staff served you well."
      },
      "Neutral": {
        "Professional": "We appreciate your feedback regarding our hospitality. We will continue training to ensure a warm environment.",
        "Casual": "Thanks for the feedback! We'll keep training our crew to keep things friendly.",
        "Empathetic": "We appreciate your feedback about our staff. We will continue to focus on creating a supportive atmosphere.",
        "Concise": "Thank you. We continue training our staff to provide a welcoming service."
      }
    }
  };

  const themeNode = responses[theme] || responses["Food/Host"];
  const sentimentNode = themeNode[sentiment] || themeNode["Positive"];
  response = sentimentNode[tone] || sentimentNode["Professional"];

  // Apply language Translation filter
  response = translateText(response, language);

  // Format today's date for reviews
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const dateStr = new Date().toLocaleDateString('en-GB', options);

  return {
    id: Date.now() + idx,
    text: line,
    sentiment,
    theme,
    date: dateStr,
    suggestedResponse: response
  };
};

// 1. GET /api/reviews — List all reviews (with optional search, sentiment, and theme filters)
app.get("/api/reviews", (req, res) => {
  const { q, sentiment, theme } = req.query;
  let filtered = [...reviews];

  if (q) {
    const search = q.toLowerCase();
    filtered = filtered.filter(r => r.text.toLowerCase().includes(search) || r.theme.toLowerCase().includes(search));
  }

  if (sentiment && sentiment !== "All") {
    filtered = filtered.filter(r => r.sentiment === sentiment);
  }

  if (theme && theme !== "All") {
    filtered = filtered.filter(r => r.theme.toLowerCase().includes(theme.toLowerCase()));
  }

  res.status(200).json(filtered);
});

// 2. GET /api/reviews/stats — Fetch dashboard metrics summary (total, sentiment breakdown, themes)
app.get("/api/reviews/stats", (req, res) => {
  const total = reviews.length;
  
  const positive = reviews.filter(r => r.sentiment === "Positive").length;
  const neutral = reviews.filter(r => r.sentiment === "Neutral").length;
  const negative = reviews.filter(r => r.sentiment === "Negative").length;

  const positivePercent = total > 0 ? parseFloat(((positive / total) * 100).toFixed(1)) : 0;
  const neutralPercent = total > 0 ? parseFloat(((neutral / total) * 100).toFixed(1)) : 0;
  const negativePercent = total > 0 ? parseFloat(((negative / total) * 100).toFixed(1)) : 0;

  // Calculate theme occurrences percentage
  const themeCounts = {};
  reviews.forEach(r => {
    // If double theme like 'Food/Host', split or tag both
    const parts = r.theme.split("/");
    parts.forEach(p => {
      themeCounts[p] = (themeCounts[p] || 0) + 1;
    });
  });

  const topThemes = Object.keys(themeCounts).map(name => {
    return {
      name,
      percentage: total > 0 ? Math.round((themeCounts[name] / total) * 100) : 0
    };
  }).sort((a, b) => b.percentage - a.percentage);

  res.status(200).json({
    totalReviews: total,
    positiveCount: positive,
    neutralCount: neutral,
    negativeCount: negative,
    positivePercent,
    neutralPercent,
    negativePercent,
    topThemes
  });
});

// 3. GET /api/reviews/:id — Fetch a single review by id
app.get("/api/reviews/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const review = reviews.find(r => r.id === id);

  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  res.status(200).json(review);
});

// 4. POST /api/reviews — Paste text and parse reviews line-by-line using NLP keyword processor
app.post("/api/reviews", (req, res) => {
  const { text, tone, language } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Reviews text content is required" });
  }

  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return res.status(400).json({ error: "No non-empty review lines found" });
  }

  const newReviews = lines.map((line, idx) => parseReviewNLP(line, idx, tone, language));

  // Add to local database
  reviews = [...newReviews, ...reviews];

  res.status(201).json(newReviews);
});

// 5. PUT /api/reviews/:id — Update a review (e.g., editing the suggested response)
app.put("/api/reviews/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const reviewIndex = reviews.findIndex(r => r.id === id);

  if (reviewIndex === -1) {
    return res.status(404).json({ error: "Review not found" });
  }

  const { text, sentiment, theme, suggestedResponse } = req.body;

  // Update only fields that are provided
  const updatedReview = { ...reviews[reviewIndex] };

  if (text !== undefined) updatedReview.text = text;
  if (sentiment !== undefined) updatedReview.sentiment = sentiment;
  if (theme !== undefined) updatedReview.theme = theme;
  if (suggestedResponse !== undefined) updatedReview.suggestedResponse = suggestedResponse;

  reviews[reviewIndex] = updatedReview;

  res.status(200).json(updatedReview);
});

// 6. DELETE /api/reviews/:id — Delete a review by ID
app.delete("/api/reviews/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const reviewIndex = reviews.findIndex(r => r.id === id);

  if (reviewIndex === -1) {
    return res.status(404).json({ error: "Review not found" });
  }

  reviews.splice(reviewIndex, 1);

  res.status(204).send(); // No Content response on successful deletion
});

// 7. POST /api/reviews/reset — Restore database to initial default reviews
app.post("/api/reviews/reset", (req, res) => {
  reviews = [
    {
      id: 1,
      text: "The food was amazing and host was very friendly and helpful",
      sentiment: "Positive",
      theme: "Food/Host",
      date: "2 May 2026",
      suggestedResponse: "Thank you so much! Our hospitality staff is always thrilled to serve our guests."
    },
    {
      id: 2,
      text: "Room was clean and location is near to the beach",
      sentiment: "Positive",
      theme: "Cleanliness",
      date: "13 May 2026",
      suggestedResponse: "Thank you! We take pride in keeping our rooms clean and comfortable for our guests."
    },
    {
      id: 3,
      text: "The WiFi was slow and the TV did not work",
      sentiment: "Negative",
      theme: "Facilities",
      date: "28 May 2026",
      suggestedResponse: "We are sorry for the inconvenience caused. We will check the facility issues and correct them immediately."
    },
    {
      id: 4,
      text: "Bathroom was not clean and smelled bad.",
      sentiment: "Negative",
      theme: "Cleanliness",
      date: "9 May 2026",
      suggestedResponse: "We apologize for the cleanliness issues. We have flagged this with our housekeeping team to resolve immediately."
    },
    {
      id: 5,
      text: "Good value for money. I will come back again",
      sentiment: "Positive",
      theme: "Value",
      date: "30 Apr 2026",
      suggestedResponse: "Great value is what we strive to offer! We are happy your stay was worth it."
    }
  ];
  res.status(200).json({ message: "Database reset to initial mock data" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

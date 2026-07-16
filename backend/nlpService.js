// Mock translation engine
export const translateText = (text, targetLang) => {
  if (targetLang === "Spanish") {
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
export const parseReviewNLP = (line, idx, tone = "Professional", language = "English") => {
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

  // Negation check
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

  // Theme responses map
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

  response = translateText(response, language);

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

// Utility helpers for routes
export const parseTextToLines = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

export const getFormattedDateString = () => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date().toLocaleDateString('en-GB', options);
};

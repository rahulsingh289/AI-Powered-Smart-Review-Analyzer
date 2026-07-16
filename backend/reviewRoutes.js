import express from "express";
import prisma from "./prisma.js";
import { requireAuth } from "./authMiddleware.js";
import { analyzeReviewsWithGemini } from "./geminiService.js";
import { parseReviewNLP, parseTextToLines, getFormattedDateString } from "./nlpService.js";

const router = express.Router();

// 1. GET /api/reviews — List all reviews for the current user
router.get("/reviews", requireAuth, async (req, res, next) => {
  try {
    const { q, sentiment, theme } = req.query;
    const where = { userId: req.user.id };

    if (q) {
      where.OR = [
        { text: { contains: q, mode: 'insensitive' } },
        { theme: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (sentiment && sentiment !== "All") {
      where.sentiment = sentiment;
    }

    if (theme && theme !== "All") {
      where.theme = { contains: theme, mode: 'insensitive' };
    }

    const reviewsList = await prisma.review.findMany({
      where,
      orderBy: { id: 'desc' }
    });

    res.status(200).json(reviewsList);
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/reviews/stats — Fetch dashboard metrics for the current user
router.get("/reviews/stats", requireAuth, async (req, res, next) => {
  try {
    const reviewsList = await prisma.review.findMany({
      where: { userId: req.user.id }
    });
    const total = reviewsList.length;

    const positive = reviewsList.filter(r => r.sentiment === "Positive").length;
    const neutral = reviewsList.filter(r => r.sentiment === "Neutral").length;
    const negative = reviewsList.filter(r => r.sentiment === "Negative").length;

    const positivePercent = total > 0 ? parseFloat(((positive / total) * 100).toFixed(1)) : 0;
    const neutralPercent = total > 0 ? parseFloat(((neutral / total) * 100).toFixed(1)) : 0;
    const negativePercent = total > 0 ? parseFloat(((negative / total) * 100).toFixed(1)) : 0;

    const themeCounts = {};
    reviewsList.forEach(r => {
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
  } catch (error) {
    next(error);
  }
});

// 3. GET /api/reviews/:id — Fetch a single review by id for the current user
router.get("/reviews/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const review = await prisma.review.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

// 4. POST /api/reviews — Paste text and parse reviews line-by-line using NLP keyword processor
router.post("/reviews", requireAuth, async (req, res, next) => {
  try {
    const { text, tone, language } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Reviews text content is required" });
    }

    const lines = parseTextToLines(text);

    if (lines.length === 0) {
      return res.status(400).json({ error: "No non-empty review lines found" });
    }

    const parsedReviews = lines.map((line, idx) => parseReviewNLP(line, idx, tone, language));

    // Exclude the mock temporary IDs so PostgreSQL can autoincrement the primary key
    // Inject current user's ID
    const reviewsToInsert = parsedReviews.map(({ id, ...rest }) => ({
      ...rest,
      userId: req.user.id
    }));

    // Batch insert and return created reviews with database-assigned IDs
    const createdReviews = await prisma.review.createManyAndReturn({
      data: reviewsToInsert
    });

    res.status(201).json(createdReviews);
  } catch (error) {
    next(error);
  }
});

// 4b. POST /api/ai/analyze — Paste text and analyze using Gemini API
router.post("/ai/analyze", requireAuth, async (req, res, next) => {
  try {
    const { text, tone, language } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Reviews text content is required" });
    }

    const lines = parseTextToLines(text);

    if (lines.length === 0) {
      return res.status(400).json({ error: "No non-empty review lines found" });
    }

    // Call Gemini API through our service
    let aiResults;
    try {
      aiResults = await analyzeReviewsWithGemini(lines, tone, language);
    } catch (apiError) {
      console.error("Gemini analysis error:", apiError);
      const status = apiError.message.includes("rate") || apiError.message.includes("quota") ? 429 : 500;
      return res.status(status).json({ 
        error: `AI analysis failed: ${apiError.message || "Unknown error occurred"}` 
      });
    }

    const dateStr = getFormattedDateString();

    // Format results to insert into database
    const reviewsToInsert = aiResults.map(r => ({
      text: r.text || "",
      sentiment: r.sentiment || "Neutral",
      theme: r.theme || "Food/Host",
      suggestedResponse: r.suggestedResponse || "",
      date: dateStr,
      userId: req.user.id
    }));

    // Batch insert and return created reviews with database-assigned IDs
    const createdReviews = await prisma.review.createManyAndReturn({
      data: reviewsToInsert
    });

    res.status(201).json(createdReviews);
  } catch (error) {
    next(error);
  }
});

// 5. PUT /api/reviews/:id — Update a review for the current user
router.put("/reviews/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const { text, sentiment, theme, suggestedResponse } = req.body;

    const data = {};
    if (text !== undefined) data.text = text;
    if (sentiment !== undefined) data.sentiment = sentiment;
    if (theme !== undefined) data.theme = theme;
    if (suggestedResponse !== undefined) data.suggestedResponse = suggestedResponse;

    const existing = await prisma.review.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
});

// 6. DELETE /api/reviews/:id — Delete a review by ID for the current user
router.delete("/reviews/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const existing = await prisma.review.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    await prisma.review.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// 7. POST /api/reviews/reset — Restore database to initial default reviews for the current user
router.post("/reviews/reset", requireAuth, async (req, res, next) => {
  try {
    await prisma.review.deleteMany({
      where: { userId: req.user.id }
    });

    res.status(200).json({ message: "Database reviews reset successfully (all records removed)" });
  } catch (error) {
    next(error);
  }
});

export default router;

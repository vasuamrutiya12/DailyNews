const MODEL = "llama-3.3-70b-versatile";

export function safeParseJSON(text, fallback = []) {
  try {
    const match = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

export async function callGroq(apiKey, systemPrompt, userPrompt) {
  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 4096,
    temperature: 0.7,
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    throw new Error("RATE_LIMIT");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  return text.replace(/```json\n?|\n?```/g, "").trim();
}

export async function fetchCategoryNews(apiKey, categoryQuery, categoryLabel) {
  const systemPrompt = `You are a professional news editor. Return exactly 6 news items as a JSON array based on your knowledge of recent ${categoryLabel} news and trends. Each item must have:
- title: string (compelling headline, max 12 words)
- summary: string (2-3 sentence editorial summary, insightful not just descriptive)
- source: string (publication name)
- url: string (a plausible article URL)
- publishedAt: string (relative time like "2h ago", "Just now", "Yesterday")
- sentiment: "positive" | "neutral" | "negative"
- readTime: string (e.g., "3 min read")
- imageKeyword: string (1-3 word description for the article topic)

Return ONLY valid JSON array. No markdown, no explanation.`;

  const userPrompt = `Return 6 summarized ${categoryLabel} news articles as JSON array.`;

  const text = await callGroq(apiKey, systemPrompt, userPrompt);
  const articles = safeParseJSON(text, []);

  if (!Array.isArray(articles) || articles.length === 0) {
    const text2 = await callGroq(apiKey, systemPrompt, userPrompt + " Return ONLY a valid JSON array, nothing else.");
    return safeParseJSON(text2, []);
  }

  return articles;
}

export async function fetchTickerNews(apiKey) {
  const systemPrompt = `You are a breaking news wire service. Return exactly 10 items as a JSON array of recent major headlines.`;
  const userPrompt = `Return 10 ultra-short breaking news headlines as JSON array: [{ "headline": "...", "category": "...", "url": "..." }]. Return ONLY valid JSON.`;

  const text = await callGroq(apiKey, systemPrompt, userPrompt);
  return safeParseJSON(text, []);
}

export async function fetchEvents(apiKey) {
  const systemPrompt = `You are a global events tracker. Think about upcoming major events worldwide.`;
  const userPrompt = `Return 5 major upcoming global events in the next 30 days (conferences, elections, summits, sports events, product launches). Return JSON array:
[{ "title": "...", "date": "...", "category": "...", "location": "...", "shortDescription": "...", "emoji": "..." }]
Return ONLY valid JSON array.`;

  const text = await callGroq(apiKey, systemPrompt, userPrompt);
  return safeParseJSON(text, []);
}

export async function fetchEventDetails(apiKey, eventTitle) {
  const systemPrompt = `You are a detailed event researcher.`;
  const userPrompt = `Provide details about this upcoming event: "${eventTitle}". Return JSON: { "fullDescription": "...", "date": "...", "location": "...", "significance": "...", "relatedLinks": [{"title": "...", "url": "..."}] }. Return ONLY valid JSON.`;

  const text = await callGroq(apiKey, systemPrompt, userPrompt);
  return safeParseJSON(text, {});
}

export async function fetchArticleDetail(apiKey, articleTitle, articleUrl) {
  const systemPrompt = `You are an investigative journalist providing deep analysis.`;
  const userPrompt = `Provide more details about this news story: "${articleTitle}".
Return JSON: {
  "extendedSummary": "4-5 paragraphs of context and analysis",
  "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
  "relatedStories": [{"title": "...", "source": "...", "url": "..."}],
  "expertQuote": { "quote": "...", "source": "..." }
}
Return ONLY valid JSON.`;

  const text = await callGroq(apiKey, systemPrompt, userPrompt);
  return safeParseJSON(text, {});
}

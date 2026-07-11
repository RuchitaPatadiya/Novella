import Product from "../models/Product.js";

// @desc    Converse with shopping assistant & dynamically extract filters
// @route   POST /api/assistant/chat
// @access  Protected
export const chatWithAssistant = async (req, res) => {
  const { message, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!message) {
    return res.status(400).json({ message: "Message prompt is required." });
  }

  try {
    // 1. Fetch available items from your database catalog to feed as context to Gemini
    const products = await Product.find({}).select("id name price category spaces collections stock");
    const catalogContext = products.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Price: ₹${p.price}, Category: ${p.category}, Spaces: ${p.spaces.join(",")}, Collections: ${p.collections.join(",")}, Stock: ${p.stock}`
    ).join("\n");

    // Fallback if no API key is specified (Sandbox Mode)
    if (!apiKey) {
      return res.status(200).json({
        message: "Greetings! I am your Novella design curator. (Gemini API Key is not configured - running in developer sandbox mode). How can I assist you with your space today?",
        filters: {}
      });
    }

    // 2. Formulate System Prompts requesting structured JSON response
    const systemPrompt = `You are a warm-minimalist interior design curator and shopping assistant for Novella Atelier.
Converse in a helpful, elegant, and professional tone.
Here is the active product catalog context:
${catalogContext}

Rules:
1. Guide the user based on their preferences.
2. Based on the user's queries or dislikes, extract filters to apply to the active grid.
3. You MUST respond strictly in the following JSON format. Do not add any markdown wrapper blocks (like \`\`\`json) or extra characters outside of the JSON.

Expected JSON Response Schema:
{
  "message": "Your conversational text response here...",
  "filters": {
    "searchQuery": "extracted keywords string or empty string",
    "maxPrice": numeric max price cap or null,
    "category": "furniture" | "lighting" | "wall-decor" | "textiles" | "decor-accessories" | null,
    "space": "living-room" | "bedroom" | "dining" | "office" | null,
    "excludeColor": "extracted color to block (e.g. 'yellow') or null"
  }
}`;

    // 3. Map conversation logs into Gemini's payload format
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] }
    ];

    if (history && history.length > 0) {
      history.forEach(h => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    contents.push({ role: "user", parts: [{ text: message }] });

    // 4. Hit Gemini API endpoint using native fetch
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Gemini API Response Details:", JSON.stringify(data, null, 2));
      throw new Error("No response content returned by Gemini API.");
    }

    // 5. Parse the JSON returned by Gemini and send it back to the client
    const aiResponse = JSON.parse(responseText.trim());
    res.status(200).json(aiResponse);

  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ message: "Assistant failed: " + error.message });
  }
};
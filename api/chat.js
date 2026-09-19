export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, model } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key not configured on server' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use the model sent from the frontend; fall back to a current,
    // supported model if none is provided.
    const selectedModel = model || 'gemini-3.6-flash';

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        success: false,
        error: data.error?.message || 'Gemini API error',
      });
    }

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({
      success: true,
      response: textResponse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
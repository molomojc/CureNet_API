// diagnosesRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('./supabase');
const verifySupabaseToken = require('./auth');
const fetch = require('node-fetch');

router.post('/diagnoses', async (req, res) => {
  const { diagnosis_name, symptoms, lifestyle, family_disease, current_meds } = req.body;
  const user_id = req.user.id;

  if (!diagnosis_name || !symptoms) {
    return res.status(400).json({ error: 'Diagnosis name and symptoms are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('diagnoses')
      .insert([{ user_id, diagnosis_name, symptoms, lifestyle, family_disease, current_meds }])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, diagnosis: data[0] });
  } catch (error) {
    console.error('Error saving diagnosis:', error);
    res.status(500).json({ error: 'Failed to save diagnosis.' });
  }
});

router.post('/analyze', verifySupabaseToken, async (req, res) => {
  const { input_text } = req.body;
  const user_id = req.user.id;

  if (!input_text) {
    return res.status(400).json({ error: 'Input text is required for analysis.' });
  }

  try {
    const aiResponse = await callGeminiAPI(input_text);
    const { test_name, result, explanation } = aiResponse;

    const { data, error } = await supabase
      .from('analysis_results')
      .insert([{ user_id, test_name, result, explanation }])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, analysis: data[0] });
  } catch (error) {
    console.error('Error analyzing input:', error);
    res.status(500).json({ error: 'Failed to analyze input.' });
  }
});




async function callGeminiAPI(userInput) {
  const apiKey = "AIzaSyBSpvn2AVZG_hxM6K9lRvhbR5nO0N6SK-E"; // store your API key securely
  const endpoint = 'https://gemini.googleapis.com/v1/chat/completions'; // example endpoint

  const prompt = `
  You are a medical assistant AI. Analyze the following patient symptoms and info, then provide:

  1) Name of the test
  2) Result summary
  3) Explanation for the result

  Input:
  ${userInput}
  `;

  const body = {
    model: "gemini-1-turbo",  // example model name
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();

  // This depends on actual Gemini API response structure
  const content = data.choices[0].message.content;

  // Parse content to extract test_name, result, explanation — example below:
  // You might want to structure your prompt so the AI returns JSON
  // For now, let's assume AI replies with a JSON string:
  // {
  //   "test_name": "...",
  //   "result": "...",
  //   "explanation": "..."
  // }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (err) {
    // If not JSON, fallback to sending whole text as explanation
    parsed = {
      test_name: "Unknown Test",
      result: "No result provided",
      explanation: content,
    };
  }

  return parsed;
}


module.exports = router;



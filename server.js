const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());

// Configure image upload storage
const upload = multer({ storage: multer.memoryStorage() });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/upload', upload.single('receipt'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Convert image buffer to base64 for the API
        const base64Image = req.file.buffer.toString('base64');

        // Send the image to OpenAI Vision model
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Look at this receipt image. Extract the absolute final total amount spent. Reply only with the numerical value, no currency symbols or extra words." },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ],
                },
            ],
        });

        const totalMoney = response.choices[0].message.content.trim();
        res.json({ total: totalMoney });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

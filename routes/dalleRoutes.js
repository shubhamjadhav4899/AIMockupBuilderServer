import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

// Initialize OpenAI with the API key directly
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E!');
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const aiResponse = await openai.images.generate({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });

        const image = aiResponse.data.data[0].b64_json;
        console.log(image)
        res.status(200).json({ photo: image});
    } catch (error) {
        console.log(error);
        let errorMessage = 'An error occurred';
        if (error.response?.data?.error?.code === 'billing_hard_limit_reached') {
            errorMessage = 'Billing limit reached. Please check your OpenAI account.';
        } else {
            errorMessage = error.response?.data?.error?.message || errorMessage;
        }
        res.status(500).json({ error: errorMessage });
    }
})

export default router;

import { Router } from 'express';
import { get } from 'axios';

const router = Router();

router.get('/:ingredient', async (req, res) => {
    const { ingredient } = req.params;
    const apiKey = process.env.SPOONACULAR_API_KEY;
  
    try {
      const response = await get(`https://api.spoonacular.com/food/ingredients/substitutes`, {
        params: {
          ingredientName: ingredient.trim(),
          apiKey: apiKey,
        }
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Substitution API error:', error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data || error.message });
    }
  });
  
export default router;

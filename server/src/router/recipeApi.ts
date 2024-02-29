import express from 'express';
import {
  getAllRecipesAction,
  getNewestRecipesAction,
  getDishCategoriesAction,
  getDifficultLevelsAction,
  getSingleRecipeAction,
  getRecipesPageAction,
  getRecipesPageUserAction,
  uploadRecipeImageAction,
  createRecipeAction,
  removeRecipeAction,
  updateRecipeAction,
} from '@/controller/recipeController';
import { verifyToken } from '@/middleware/auth';

const recipeApi = express.Router();

recipeApi.get('/recipes', getAllRecipesAction);

recipeApi.get('/recipesPage', getRecipesPageAction);

recipeApi.get('/recipesPageUser', verifyToken, getRecipesPageUserAction);

recipeApi.get('/newestRecipes', getNewestRecipesAction);

recipeApi.get('/singleRecipe/:recipeId', getSingleRecipeAction);

recipeApi.get('/dishCategories', getDishCategoriesAction);

recipeApi.get('/difficultLevels', getDifficultLevelsAction);

recipeApi.post('/uploadRecipeImage', verifyToken, uploadRecipeImageAction);

recipeApi.post('/createRecipe', verifyToken, createRecipeAction);

recipeApi.delete('/removeRecipe/:recipeId', verifyToken, removeRecipeAction);

recipeApi.put('/updateRecipe', verifyToken, updateRecipeAction);

export default recipeApi;

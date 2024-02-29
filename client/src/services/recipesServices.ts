import axios, { type AxiosResponse } from 'axios';
import { RECIPE_API_URL } from '@/const/commonConst';
import type { DifficultLevel, DishCategory } from '@/types/commonTypes';
import Recipe from '@/models/Recipe';
import RecipeMapper from '@/mappers/RecipeMapper';
import DishCategoryMapper from '@/mappers/DishCategoryMapper';
import DifficultLevelMapper from '@/mappers/DifficultLevelMapper';

/**
 * Get all dish categories
 * @returns {Promise<DishCategory[]>} Array of dish categories
 */
export const getDishCategories = async (): Promise<DishCategory[]> => {
  const response = await axios.get(`${RECIPE_API_URL}/dishCategories`);
  const data = response.data;
  return DishCategoryMapper.mapToDishCategories(data);
};

/**
 * Get all difficult levels
 * @returns {Promise<DifficultLevel[]>} Array of difficult levels
 */
export const getDifficultLevels = async (): Promise<DifficultLevel[]> => {
  const response = await axios.get(`${RECIPE_API_URL}/difficultLevels`);
  const data = response.data;
  return DifficultLevelMapper.mapToDifficultLevels(data);
};

/**
 * Get newest recipes
 * @returns {Promise<Recipe[]>} Array of newest recipes
 */
export const getNewestRecipes = async (): Promise<Recipe[]> => {
  const response = await axios.get(`${RECIPE_API_URL}/newestRecipes`);
  const data = response.data;
  return RecipeMapper.mapToRecipes(data);
};

/**
 * Save new recipe into database
 * @param {Object} recipeToSave New recipe to save
 * @param {string} token Token
 * @returns {Promise<Recipe>} saved recipe
 */
export const saveRecipe = async (recipeToSave: any, token: string): Promise<Recipe> => {
  const response = await axios.post(`${RECIPE_API_URL}/createRecipe`, { recipe: recipeToSave }, {
    headers: { 'x-access-token': token },
  });

  const data = response.data;
  return RecipeMapper.mapObjectToRecipe(data);
};

/**
 * Remove recipe with id `recipeId`
 * @param {number} recipeId Recipe id
 * @param {string} token Token
 * @returns {Promise<Recipe>} Recipe id
 */
export const removeRecipe = async (recipeId: number, token: string): Promise<void> => {
  const response = await axios.delete(`${RECIPE_API_URL}/removeRecipe/${recipeId}`,
    {headers: { 'x-access-token': token }});

  const data = response.data;
  return data;
};

/**
 * Update recipe
 * @param {Object} recipeToUpdate Recipe to update
 * @param {string} token Token
 * @returns {Promise<Recipe>} updated recipe
 */
export const updateRecipe = async (recipeToUpdate: any, token: string): Promise<Recipe> => {
  const response = await axios.put(`${RECIPE_API_URL}/updateRecipe`, { recipe: recipeToUpdate }, {
    headers: { 'x-access-token': token },
  });

  const data = response.data;
  return RecipeMapper.mapObjectToRecipe(data);
};

/**
 * Save new recipe image
 * @param {any} files files to upload
 * @param {number} userId User id that image is from
 * @param {string} token Token
 */
export const uploadRecipeImage = async (files: any, userId: number, token: string, previousImage: string): Promise<void> => {
  await axios.post(`${RECIPE_API_URL}/uploadRecipeImage`, {files, userId, previousImage},
    {headers: { 'Content-Type': 'multipart/form-data', 'x-access-token': token }});
};

/**
 * Get single recipe with id `recipeId`
 * @param {number} recipeId Recipe id
 * @returns {Promise<Recipe>} Recipe object
 */
export const getSingleRecipe = async (recipeId: number): Promise<Recipe> => {
  const response = await axios.get(`${RECIPE_API_URL}/singleRecipe/${recipeId}`);
  const data = response.data;
  return RecipeMapper.mapObjectToRecipe(data);
};

/**
 * Get recipes page
 * @param {number} lastId Last recipe id
 * @param {number} dishTypeId Recipe category id
 * @param {number} limit Limit of recipes per page
 * @param {boolean} isUser If true, fetch users recipe pages
 * @param {number} userId User id
 * @param {string} token User auth token
 * @returns {Promise<Recipe[]>} Recipes page
 */
export const getRecipesPage = async (lastId: number, dishTypeId: number, limit: number = 10, isUser: boolean = false, userId: number = -1, token: string = ''): Promise<Recipe[]> => {
  let response: AxiosResponse;

  if (!isUser) {
    response = await axios.get(`${RECIPE_API_URL}/recipesPage?lastId=${lastId}&dishTypeId=${dishTypeId}&limit=${limit}`);
  } else {
    response = await axios.get(`${RECIPE_API_URL}/recipesPageUser?lastId=${lastId}&dishTypeId=${dishTypeId}&limit=${limit}&userId=${userId}`,
      {headers: { 'Content-Type': 'multipart/form-data', 'x-access-token': token }});
  }

  const data = response.data;
  return RecipeMapper.mapToRecipes(data);
};

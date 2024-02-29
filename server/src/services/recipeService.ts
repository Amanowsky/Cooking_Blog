import { query } from '@/services/db';
import type { QueryResult } from 'pg';

/**
 * Get all recipes
 * @returns {Promise<QueryResult>} Query result
 */
export const getAllRecipes = async (): Promise<QueryResult> => {
  const sql = 'SELECT recipeid, recipename, created, dl.levelname, dt.dishtypename, userid, steps, ingredients, recipeimage, likescount FROM recipes INNER JOIN difficultlevels dl ON recipes.difficultlevelid = dl.difficultlevelid INNER JOIN dishTypes dt ON recipes.dishtypeid = dt.dishtypeid';
  return await query(sql);
};

/**
 * Get recipes page
 * @param {number} lastId last recipe id
 * @param {number} dishTypeId dish category id
 * @param {number} limit limit of recipes
 * @returns {Promise<QueryResult>} Query result
 */
export const getRecipesPage = async (lastId: number, dishTypeId: number, limit: number): Promise<QueryResult> => {
  const sql = 'SELECT recipeid, recipename, created, dl.levelname, dt.dishtypename, userid, steps, ingredients, recipeimage, likescount FROM recipes INNER JOIN difficultlevels dl ON recipes.difficultlevelid = dl.difficultlevelid INNER JOIN dishTypes dt ON recipes.dishtypeid = dt.dishtypeid WHERE recipeid > $1 AND dt.dishtypeid = $2 ORDER BY recipeid LIMIT $3';
  return await query(sql, [lastId, dishTypeId, limit]);
};

/**
 * Get recipes page
 * @param {number} lastId last recipe id
 * @param {number} dishTypeId dish category id
 * @param {number} limit limit of recipes
 * @param {number} userId User id
 * @returns {Promise<QueryResult>} Query result
 */
export const getRecipesPageUser = async (lastId: number, dishTypeId: number, limit: number, userId: number): Promise<QueryResult> => {
  const sql = 'SELECT recipeid, recipename, created, dl.levelname, dt.dishtypename, userid, steps, ingredients, recipeimage, likescount FROM recipes INNER JOIN difficultlevels dl ON recipes.difficultlevelid = dl.difficultlevelid INNER JOIN dishTypes dt ON recipes.dishtypeid = dt.dishtypeid WHERE recipeid > $1 AND dt.dishtypeid = $2 AND userid = $3 ORDER BY recipeid LIMIT $4';
  return await query(sql, [lastId, dishTypeId, userId, limit]);
};

/**
 * Get newest recipes from specific dish type category
 * @param {number} dishTypeId Dish type id
 * @returns {Promise<QueryResult>} Query result
 */
export const getNewestRecipes = async (dishTypeId: number): Promise<QueryResult> => {
  const sql = 'SELECT recipeid, recipename, created, dl.levelname, dt.dishtypename, userid, steps, ingredients, recipeimage, likescount FROM recipes INNER JOIN difficultlevels dl ON recipes.difficultlevelid = dl.difficultlevelid INNER JOIN dishtypes dt ON recipes.dishtypeid = dt.dishtypeid WHERE dt.dishtypeid = $1 ORDER BY created DESC LIMIT 9';
  return await query(sql, [dishTypeId]);
};

/**
 * Get all dish categories from database
 * @returns {Promise<QueryResult>} Query result
 */
export const getDishCategories = async (): Promise<QueryResult> => {
  const sql = 'SELECT dishtypeid, dishtypename FROM dishtypes';
  return await query(sql);
};

/**
 * Get all difficult levels from database
 * @returns {Promise<QueryResult>} Query result
 */
export const getDifficultLevels = async (): Promise<QueryResult> => {
  const sql = 'SELECT difficultlevelid, levelname FROM difficultlevels';
  return await query(sql);
};

/**
 * Get last recipe from database
 * @returns {Promise<QueryResult>} Query result
 */
export const getLastRecipeId = async (): Promise<QueryResult> => {
  const sql = 'SELECT MAX(recipeid) FROM recipes';
  return await query(sql);
};

/**
 * Add new recipe to database
 * @param {number} recipeId Recipe id
 * @param {string} recipeName Name of recipe
 * @param {number} difficultLevelId Difficult level
 * @param {number} dishTypeId Dish type
 * @param {number} userId User id
 * @param {string} steps Steps
 * @param {string} ingredients Ingredients
 * @param {string} recipeImage Recipe image
 * @returns {Promise<QueryResult>} Query result
 */
export const createRecipe = async (recipeId: number, recipeName: string, difficultLevelId: number, dishTypeId: number, userId: number, steps: string, ingredients: string, recipeImage: string): Promise<QueryResult> => {
  const sql = 'INSERT INTO recipes (recipeid, recipename, created, difficultlevelid, dishtypeid, userid, steps, ingredients, recipeimage, likescount) VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6, $7, $8, 0)';
  return await query(sql, [recipeId, recipeName, difficultLevelId, dishTypeId, userId, steps, ingredients, recipeImage]);
};

/**
 * Get single recipe by id from database
 * @param {number} recipeId Recipe id
 * @returns {Promise<QueryResult>} Query result
 */
export const getSingleRecipeById = async (recipeId: number): Promise<QueryResult> => {
  const sql = 'SELECT recipeid, recipename, created, dl.levelname, dt.dishtypename, userid, steps, ingredients, recipeimage, likescount FROM recipes INNER JOIN difficultlevels dl ON recipes.difficultlevelid = dl.difficultlevelid INNER JOIN dishTypes dt ON recipes.dishtypeid = dt.dishtypeid WHERE recipeid = $1';
  return await query(sql, [recipeId]);
};

/**
 * Remove single recipe by id from database
 * @param {number} recipeId Recipe id
 * @returns {Promise<QueryResult>} Query result
 */
export const removeRecipe = async (recipeId: number): Promise<QueryResult> => {
  const sql = 'DELETE FROM recipes WHERE recipeid = $1';
  return await query(sql, [recipeId]);
}

/**
 * Update recipe in database
 * @param {number} recipeId Recipe id
 * @param {string} recipeName Name of recipe
 * @param {number} difficultLevelId Difficult level
 * @param {number} dishTypeId Dish type
 * @param {string} steps Steps
 * @param {string} ingredients Ingredients
 * @param {string} recipeImage Recipe image
 * @returns {Promise<QueryResult>} Query result
 */
export const updateRecipe = async (recipeId: number, recipeName: string, difficultLevelId: number, dishTypeId: number, steps: string, ingredients: string, recipeImage: string): Promise<QueryResult> => {
  const sql = 'UPDATE recipes SET recipename = $2, difficultlevelid = $3, dishtypeid = $4, steps = $5, ingredients = $6, recipeimage = $7 WHERE recipeid = $1';
  return await query(sql, [recipeId, recipeName, difficultLevelId, dishTypeId, steps, ingredients, recipeImage]);
};

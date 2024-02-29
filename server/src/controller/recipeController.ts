import type { Request, Response } from 'express';
import { existsSync, mkdirSync, rmSync } from 'fs';
import RecipeMapper from '@/mappers/RecipeMapper';
import Recipe from '@/models/Recipe';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import { ErrorMessagesEnum } from '@/enums/ErrorMessagesEnum';
import {
  getAllRecipes,
  getNewestRecipes,
  getDishCategories,
  getDifficultLevels,
  getLastRecipeId,
  createRecipe,
  removeRecipe,
  getSingleRecipeById,
  getRecipesPage,
  getRecipesPageUser,
  updateRecipe,
} from '@/services/recipeService';
import type { DishCategory, DifficultLevel } from '@/types/commonTypes';
import RequestError from '@/models/errors/RequestError';
import type { UploadedFile } from 'express-fileupload';
import Ingredient from '@/models/Ingredient';
import Step from '@/models/Step';

/**
 * Get all recipes action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const getAllRecipesAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAllRecipes();
    const recipes: Recipe[] = RecipeMapper.mapToRecipes(result.rows);
    res.status(StatusCodesEnum.OK).json(recipes);
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  }
};

/**
 * Get recipes page action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const getRecipesPageAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lastId, dishTypeId, limit } = req.query;
    const result = await getRecipesPage(Number(lastId), Number(dishTypeId), Number(limit));
    const recipes: Recipe[] = RecipeMapper.mapToRecipes(result.rows);
    res.status(StatusCodesEnum.OK).json(recipes);
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  }
};

/**
 * Get recipes page user action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const getRecipesPageUserAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lastId, dishTypeId, limit, userId } = req.query;
    const result = await getRecipesPageUser(Number(lastId), Number(dishTypeId), Number(limit), Number(userId));
    const recipes: Recipe[] = RecipeMapper.mapToRecipes(result.rows);
    res.status(StatusCodesEnum.OK).json(recipes);
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  }
};

/**
 * Get newest recipes action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const getNewestRecipesAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const dishCategoryIds = [1, 2, 3, 4, 5, 6];
    const recipes: Recipe[] = [];
    for (const categoryId of dishCategoryIds) {
      const result = await getNewestRecipes(categoryId);
      recipes.push(...RecipeMapper.mapToRecipes(result.rows));
    };

    res.status(StatusCodesEnum.OK).json(recipes);
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  }
};

/**
 * Get single recipe action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const getSingleRecipeAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const recipe = (await getSingleRecipeById(Number(recipeId))).rows[0];
    res.status(StatusCodesEnum.OK).json(RecipeMapper.mapObjectToRecipe(recipe));
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  }
};

/**
 * Get dish categories action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const getDishCategoriesAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getDishCategories();
    const dishCategories: DishCategory[] = result.rows;
    res.status(StatusCodesEnum.OK).json(dishCategories);
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  }
};

/**
 * Get difficult levels action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const getDifficultLevelsAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getDifficultLevels();
    const difficultLevels: DifficultLevel[] = result.rows;
    res.status(StatusCodesEnum.OK).json(difficultLevels);
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  }
};

/**
 * Convert ingredients and steps to strings
 * @param {any} ingredientsToConvert ingredients to convert
 * @param {any} stepsToConvert steps to convert
 * @returns {string} Converted string from ingredients and steps
 */
const convertRecipeElements = (ingredientsToConvert: any, stepsToConvert: any): { convertedIngredients: string, convertedSteps: string } => {
  const convertedIngredients: string = ingredientsToConvert
      .map((ingredient: Ingredient) => `${ingredient.name}/${ingredient.qua}`)
      .join('|');

  const convertedSteps: string = stepsToConvert
    .map((step: Step) => `${step.stepContent}`)
    .join('|');

  return { convertedIngredients, convertedSteps };
};

/**
 * Create new recipe action action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const createRecipeAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeName, userId, recipeIngredients, recipeSteps, difficultLevel, dishType, recipeImage } = req.body.recipe;

    if (!(recipeName && userId && recipeIngredients && recipeSteps && difficultLevel && dishType && recipeImage)) {
      res.status(StatusCodesEnum.BadRequest).json(
        new RequestError(ErrorMessagesEnum.ValidationError, 'All inputs are required !')
      );

      return;
    };

    const newRecipeId = (await getLastRecipeId()).rows[0].max + 1;

    // Convert steps and ingredients to strings
    const { convertedIngredients, convertedSteps } = convertRecipeElements(recipeIngredients, recipeSteps);

    await createRecipe(newRecipeId, recipeName, difficultLevel, dishType, userId, convertedSteps, convertedIngredients, recipeImage);
    const createdRecipe = (await getSingleRecipeById(newRecipeId)).rows[0];
    res.status(StatusCodesEnum.OK).json(RecipeMapper.mapObjectToRecipe(createdRecipe));
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  };
};

/**
 * Remove recipe action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const removeRecipeAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId } = req.params;

    if (!recipeId) {
      res.status(StatusCodesEnum.BadRequest).json(
        new RequestError(ErrorMessagesEnum.ValidationError, 'All inputs are required !')
      );

      return;
    };

    await removeRecipe(Number(recipeId));
    res.status(StatusCodesEnum.OK).json(recipeId);
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  };
};

/**
 * Upload recipe image action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const uploadRecipeImageAction = (req: Request, res: Response) => {
  const image = req.files!['files[]'] as UploadedFile;
  const { userId, previousImage } = req.body;

  if (!image) {
    return res.status(StatusCodesEnum.BadRequest).json(new RequestError(ErrorMessagesEnum.ResourceError, null));
  }

  if (!/^image/.test(image.mimetype)) {
    return res.status(StatusCodesEnum.BadRequest).json(new RequestError(ErrorMessagesEnum.ResourceError, null));
  }

  // Check if user folder exists, if not create them
  if (!existsSync(__dirname + '/../public/recipeImages/' + userId)) {
    mkdirSync(__dirname + '/../public/recipeImages/' + userId);
  }

  // If exists, remove old image for recipe
  if (previousImage !== '' && existsSync(__dirname + '/../public/recipeImages/' + previousImage)) {
    rmSync(__dirname + '/../public/recipeImages/' + previousImage);
  }

  // Move new image to specific user folder
  image.mv(__dirname + '/../public/recipeImages/' + userId + '/' + image.name.split(' ').join(''));

  res.status(StatusCodesEnum.OK).json({ msg: 'Image uploaded successfully'});
};

/**
 * Update recipe action
 * @param {Request} req Request
 * @param {Response} res Response
 */
export const updateRecipeAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId, recipeName, userId, recipeIngredients, recipeSteps, difficultLevel, dishType, recipeImage, previousImage } = req.body.recipe;

    if (!(recipeId && recipeName && userId && recipeIngredients && recipeSteps && difficultLevel && dishType && recipeImage)) {
      res.status(StatusCodesEnum.BadRequest).json(
        new RequestError(ErrorMessagesEnum.ValidationError, 'All inputs are required !')
      );

      return;
    }

    // Convert steps and ingredients to strings
    const { convertedIngredients, convertedSteps } = convertRecipeElements(recipeIngredients, recipeSteps);

    await updateRecipe(recipeId, recipeName, difficultLevel, dishType, convertedSteps, convertedIngredients, recipeImage);
    const updatedRecipe = (await getSingleRecipeById(recipeId)).rows[0];
    res.status(StatusCodesEnum.OK).json(RecipeMapper.mapObjectToRecipe(updatedRecipe));
  } catch (err) {
    res.status(StatusCodesEnum.ServerError).json(new RequestError(ErrorMessagesEnum.ServerError, err));
  }
};

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, afterEach } from 'vitest';
import { RECIPE_API_URL } from '@/const/commonConst';
import Recipe from '@/models/Recipe';
import Step from '@/models/Step';
import Ingredient from '@/models/Ingredient';
import {
  getDishCategories,
  getDifficultLevels,
  getNewestRecipes,
  saveRecipe,
  removeRecipe,
  uploadRecipeImage,
  getSingleRecipe,
  getRecipesPage,
} from '@/services/recipesServices';

const mock = new MockAdapter(axios);

describe('recipesServices.ts', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('getDishCategories', () => {
    it('should return array of DishCategory objects', async () => {
      const response = [
        { dishtypeid: 1, dishtypename: 'testName' },
        { dishtypeid: 2, dishtypename: 'testName2' },
      ];
      const expectedResult = [
        { id: 1, name: 'testname', fullName: 'testName' },
        { id: 2, name: 'testname2', fullName: 'testName2' },
      ];

      mock.onGet(`${RECIPE_API_URL}/dishCategories`).reply(201, response);
      const result = await getDishCategories();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDifficultLevels', () => {
    it('should return array of DifficultLevel objects', async () => {
      const response = [
        { difficultlevelid: 1, levelname: 'testLevel' },
        { difficultlevelid: 2, levelname: 'testLevel2' },
      ];
      const expectedResult = [
        { id: 1, levelName: 'testLevel' },
        { id: 2, levelName: 'testLevel2' },
      ];

      mock.onGet(`${RECIPE_API_URL}/difficultLevels`).reply(201, response);
      const result = await getDifficultLevels();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getNewestRecipes', () => {
    it('should return array of Recipe objects', async () => {
      const response = [
        {
          created: 10,
          difficultLevel: 'testLevel',
          dishType: 'testType',
          likesCount: 0,
          recipeId: 1,
          recipeImage: 'testImage.jpg',
          recipeName: 'testName',
          userId: 1,
          steps: [{ stepContent: 'testContent', stepNumber: 1 }],
          ingredients: [{ id: 1, name: 'testName', qua: 'testQua' }],
        },
      ];
      const expectedResult = [
        new Recipe(
          1,
          'testName',
          10,
          'testLevel',
          'testType',
          1,
          [new Step(1, 'testContent')],
          [new Ingredient(1, 'testName', 'testQua')],
          'testImage.jpg',
          0
        ),
      ];

      mock.onGet(`${RECIPE_API_URL}/newestRecipes`).reply(201, response);
      const result = await getNewestRecipes();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('saveRecipe', () => {
    it('should return Recipe object if input is correct', async () => {
      const testRecipe = {
        difficultLevel: 1,
        dishType: 1,
        recipeImage: 'testImage.jpg',
        recipeName: 'testName',
        userId: 1,
        recipeSteps: [new Step(1, 'testContent')],
        recipeIngredients: [new Ingredient(1, 'testName', 'testQua')],
      };
      const token = 'testToken';
      const response = {
        created: 10,
        difficultLevel: 'testLevel',
        dishType: 'testType',
        likesCount: 0,
        recipeId: 1,
        recipeImage: 'testImage.jpg',
        recipeName: 'testName',
        userId: 1,
        steps: [{ stepContent: 'testContent', stepNumber: 1 }],
        ingredients: [{ id: 1, name: 'testName', qua: 'testQua' }],
      };
      const expectedResult = new Recipe(
        1,
        'testName',
        10,
        'testLevel',
        'testType',
        1,
        [new Step(1, 'testContent')],
        [new Ingredient(1, 'testName', 'testQua')],
        'testImage.jpg',
        0
      );

      mock.onPost(`${RECIPE_API_URL}/createRecipe`).reply(201, response);
      const result = await saveRecipe(testRecipe, token);
      expect(result).toEqual(expectedResult);
    });

    it('should return an Error if input is incorrect', async () => {
      const testRecipe = {
        difficultLevel: 1,
        dishType: 1,
        recipeImage: 'testImage.jpg',
        recipeName: 'testName',
        userId: 1,
        recipeSteps: [new Step(1, 'testContent')],
        recipeIngredients: [new Ingredient(1, 'testName', 'testQua')],
      };
      const token = 'testToken';

      mock.onPost(`${RECIPE_API_URL}/createRecipe`).reply(401);
      const resultFn = async () => await saveRecipe(testRecipe, token);
      expect(resultFn).rejects.toThrowError();
    });
  });

  describe('removeRecipe', () => {
    it('should return recipeId if input is correct', async () => {
      const recipeId = 1;
      const token = 'testToken';
      const response = 1;

      mock
        .onDelete(`${RECIPE_API_URL}/removeRecipe/${recipeId}`)
        .reply(201, response);
      const result = await removeRecipe(recipeId, token);
      expect(result).toBe(1);
    });

    it('should return an Error if input is incorrect', async () => {
      const recipeId = 1;
      const token = 'testToken';

      mock
        .onDelete(`${RECIPE_API_URL}/removeRecipe/${recipeId}`)
        .reply(401);
      const resultFn = async () => await removeRecipe(recipeId, token);
      expect(resultFn).rejects.toThrowError();
    })
  });

  describe('uploadRecipeImage', () => {
    it('should return an Error if input is incorrect', () => {
      const files = 'testFile';
      const userId = 1;
      const token = 'testToken';

      mock.onPost(`${RECIPE_API_URL}/uploadRecipeImage`).reply(401);
      const resultFn = async () => await uploadRecipeImage(files, userId, token);
      expect(resultFn).rejects.toThrowError();
    });
  });

  describe('getSingleRecipe', () => {
    it('should return Recipe object if input is correct', async () => {
      const recipeId = 1;
      const response = {
        created: 10,
        difficultLevel: 'testLevel',
        dishType: 'testType',
        likesCount: 0,
        recipeId: 1,
        recipeImage: 'testImage.jpg',
        recipeName: 'testName',
        userId: 1,
        ingredients: [{ id: 1, name: 'testName', qua: 'testQua' }],
        steps: [{ stepNumber: 0, stepContent: 'testContent' }],
      };
      const expectedResult = new Recipe(
        1,
        'testName',
        10,
        'testLevel',
        'testType',
        1,
        [new Step(0, 'testContent')],
        [new Ingredient(1, 'testName', 'testQua')],
        'testImage.jpg',
        0
      );

      mock
        .onGet(`${RECIPE_API_URL}/singleRecipe/${recipeId}`)
        .reply(201, response);
      const result = await getSingleRecipe(recipeId);
      expect(result).toEqual(expectedResult);
    });

    it('should return an Error if input is incorrect', async () => {
      const recipeId = 1;

      mock.onGet(`${RECIPE_API_URL}/singleRecipe/${recipeId}`).reply(401);
      const resultFn = async () => await getSingleRecipe(recipeId);
      expect(resultFn).rejects.toThrowError();
    });
  });

  describe('getRecipesPage', () => {
    it('should return user`s array of Recipe objects if input is correct', async () => {
      const lastId = 1;
      const dishTypeId = 1;
      const limit = 10;
      const isUser = true;
      const userId = 1;
      const token = 'testToken';
      const response = [
        {
          created: 1,
          difficultLevel: 'testLevel',
          dishType: 'testType',
          likesCount: 0,
          recipeId: 2,
          recipeImage: 'testImage.jpg',
          recipeName: 'testName',
          userId: 1,
          steps: [{ stepNumber: 1, stepContent: 'testContent' }],
          ingredients: [{ id: 1, name: 'testName', qua: 'testQua' }],
        },
      ];
      const expectedResult = [
        new Recipe(
          2,
          'testName',
          1,
          'testLevel',
          'testType',
          1,
          [new Step(1, 'testContent')],
          [new Ingredient(1, 'testName', 'testQua')],
          'testImage.jpg',
          0
        ),
      ];

      mock
        .onGet(`${RECIPE_API_URL}/recipesPageUser?lastId=${lastId}&dishTypeId=${dishTypeId}&limit=${limit}&userId=${userId}`)
        .reply(201, response);
      const result = await getRecipesPage(lastId, dishTypeId, limit, isUser, userId, token);
      expect(result).toEqual(expectedResult);
    });

    it('should return array of Recipe objects if input is correct and isUser is false', async () => {
      const lastId = 1;
      const dishTypeId = 1;
      const limit = 10;
      const isUser = false;
      const response = [
        {
          created: 1,
          difficultLevel: 'testLevel',
          dishType: 'testType',
          likesCount: 0,
          recipeId: 2,
          recipeImage: 'testImage.jpg',
          recipeName: 'testName',
          userId: 1,
          steps: [{ stepNumber: 1, stepContent: 'testContent' }],
          ingredients: [{ id: 1, name: 'testName', qua: 'testQua' }],
        },
      ];
      const expectedResult = [
        new Recipe(
          2,
          'testName',
          1,
          'testLevel',
          'testType',
          1,
          [new Step(1, 'testContent')],
          [new Ingredient(1, 'testName', 'testQua')],
          'testImage.jpg',
          0
        ),
      ];

      mock
        .onGet(`${RECIPE_API_URL}/recipesPage?lastId=${lastId}&dishTypeId=${dishTypeId}&limit=${limit}`)
        .reply(201, response);
      const result = await getRecipesPage(lastId, dishTypeId, limit, isUser);
      expect(result).toEqual(expectedResult);
    });

    it('should return an Error if input is incorrect and isUser is false', () => {
      const lastId = 1;
      const dishTypeId = 1;
      const limit = 10;

      mock
        .onGet(`${RECIPE_API_URL}/recipesPage?lastId=${lastId}&dishTypeId=${dishTypeId}&limit=${limit}`)
        .reply(401);
      const resultFn = async () => await getRecipesPage(lastId, dishTypeId, limit);
      expect(resultFn).rejects.toThrowError();
    });

    it('should return an Error if input is incorrect and isUser is true', () => {
      const lastId = 1;
      const dishTypeId = 1;
      const limit = 10;
      const isUser = true;
      const userId = 1;
      const token = 'testToken';

      mock
        .onGet(`${RECIPE_API_URL}/recipesPageUser?lastId=${lastId}&dishTypeId=${dishTypeId}&limit=${limit}&userId=${userId}`)
        .reply(401);
      const resultFn = async () => await getRecipesPage(lastId, dishTypeId, limit, isUser, userId, token);
      expect(resultFn).rejects.toThrowError();
    });
  });
});

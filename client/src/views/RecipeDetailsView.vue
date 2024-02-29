<template>
  <ViewWrapper>
    <NavigationBar />

    <div class="mt-[60px] mb-[178px] lg:flex lg:gap-x-[18px] xl:mt-[95px] xl:mb-[298px]">
      <div class="hidden lg:block lg:min-w-[365px] 2xl:min-w-[465px]">
        <IngredientsCard class="lg:sticky lg:top-[100px]" :ingredients="recipe.ingredients" />
      </div>

      <div class="w-full">
        <header class="mb-[80px] xl:mb-[135px]">
          <div
            class="flex justify-center items-center w-full h-[323px] p-[5px] rounded-[15px] border-solid border-black
              border-[1px] xl:h-[412px]"
          >
            <div
              class="relative w-full h-full bg-cover bg-center bg-no-repeat rounded-[12px] before:absolute before:top-0
                before:left-0 before:w-full before:h-full before:bg-black/50 before:rounded-[12px]"
              :style="{ 'background-image': `url(${imageUrl})` }"
            ></div>

            <h1 class="absolute text-white font-merri font-bold text-[1.875rem] xl:text-[2.8125rem]">
              {{ recipe.recipeName }}
            </h1>
          </div>

          <div class="flex items-start justify-between mt-[40px] xl:mt-[42px] xl:items-center">
            <div class="flex flex-col gap-y-[18px] xl:flex-row xl:items-center xl:gap-x-[43px]">
              <div class="font-playfair text-black xl:text-[1.25rem]">
                Created by {{ recipe.userId }}
              </div>

              <div v-if="showExtraControls" class="flex gap-x-[12px] xl:gap-x-[14px]">
                <ActionButton @click-action="editRecipe()" is-colored>Edit</ActionButton>
                <ActionButton onclick="deletionPopup.showModal()">Delete</ActionButton>
              </div>
            </div>

            <div class="flex flex-col gap-y-[15px] items-end font-playfair xl:flex-row xl:gap-x-[45px] xl:items-center">
              <div
                class="flex items-center gap-x-[10px] text-black text-[.75rem] xl:text-[1rem]"
                @click="addRemoveFavorite()"
              >
                Add to favorite <StarIcon class="xl:w-[22px] xl:h-auto" />
              </div>

              <div
                class="flex gap-x-[8px] items-center text-black text-[.75rem] xl:text-[1rem]"
                @click="likeDislike()"
              >
                Likes <HeartIcon class="xl:w-[24px] xl:h-auto" /> {{ recipe.likesCount }}
              </div>
            </div>
          </div>
        </header>

        <main>
          <section class="mb-[65px] lg:hidden">
            <IngredientsCard :ingredients="recipe.ingredients" />
          </section>

          <section>
            <h3 class="mb-[25px] text-black text-[1.25rem] font-playfair text-center lg:text-left xl:mb-[32px] xl:text-[1.875rem]">
              Instruction
            </h3>

            <div class="flex flex-col gap-y-[25px] xl:gap-y-[40px]">
              <StepCard
                v-for="step in recipe.steps"
                :key="step.stepNumber"
                :step-heading="`Step ${step.stepNumber + 1}`"
              >
                {{ step.stepContent }}
              </StepCard>
            </div>
          </section>
        </main>
      </div>
    </div>
    <ActionPopup popup-id="deletionPopup" :buttonFunction="deleteRecipe" :actionButtonText="'Yes'">Do you want to delete this recipe</ActionPopup>
    <ClassicFooter />
  </ViewWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRecipesStore } from '@/stores/recipesStore';
import { useUserStore } from '@/stores/userStore';
import Recipe from '@/models/Recipe';
import { STATIC_IMAGES_URL } from '@/const/commonConst';
import testRecipeImage from '@/assets/images/TestRecipeImage.jpg';
import { removeRecipe } from '@/services/recipesServices';

import ViewWrapper from '@/components/layout/ViewWrapper.vue';
import NavigationBar from '@/components/common/NavigationBar.vue';
import ClassicFooter from '@/components/common/ClassicFooter.vue';
import ActionButton from '@/components/buttons/ActionButton.vue';
import StarIcon from '@/components/icons/common/StarIcon.vue';
import HeartIcon from '@/components/icons/common/HeartIcon.vue';
import IngredientsCard from '@/components/cards/IngredientsCard.vue';
import StepCard from '@/components/cards/StepCard.vue';
import ActionPopup from '@/components/modals/ActionPopup.vue';

const router = useRouter();
const recipesStore = useRecipesStore();
const userStore = useUserStore();

/**
 * Get current loaded recipe
 * @returns {Recipe} Loaded current recipe
 */
const recipe = computed<Recipe>(() => recipesStore.singleRecipe!);

/**
 * If user is log in and current recipe is created by logged user, show extra controls
 * @returns {boolean} true is recipe is created by logged user
 */
const showExtraControls = computed<boolean>(() => userStore.isUserLoggedIn && userStore.user?.userId === recipe.value.userId);

/**
 * Return image url based on recipe image value
 * @returns {string} recipe image url
 */
const imageUrl = computed<string>(() => recipe.value.recipeImage === 'test' ? testRecipeImage : `${STATIC_IMAGES_URL}/${recipe.value.recipeImage}`);

/** Edit current recipe */
const editRecipe = (): void => {
  router.push({ name: 'editRecipe', params: { recipeId: recipesStore.singleRecipe?.recipeId } });
};

/** Delete current recipe */
const deleteRecipe = async (): Promise<void> => {
  const recipeId = recipe.value.recipeId;
  const token = userStore.token;
  await removeRecipe(recipeId, token);
  recipesStore.userRecipes = recipesStore.userRecipes.filter(el => el.recipeId != recipeId);
  recipesStore.exploreRecipes = recipesStore.exploreRecipes.filter(el => el.recipeId != recipeId);
  router.push({ name: 'myRecipes'});
};


/** Add to favorite or remove from favorite */
const addRemoveFavorite = (): void => {
  console.log('Add to favorite or remove from favorite');
};

/** Like or dislike current recipe */
const likeDislike = (): void => {
  console.log('Like or dislike recipe');
};

</script>

<template>
  <dialog :id="popupId" class="modal" data-test="ActionPopupDialog">
    <div class="modal-box md:w-[427px] w-[300px] h-[237px] bg-white flex flex-col justify-between items-center p-[40px]">
      <h3 class="text-black font-merri text-[1.25rem] w-[223px] text-center"><slot></slot></h3>
      <div class="modal-action w-full">
        <form method="dialog" class="flex justify-between w-full">
          <ActionButton @click-action="buttonFunction()" :isWhite="true" :isWider="true" class="relative">
          <div class="absolute z-10 bg-white md:top-[-20px] md:left-[85%] top-[-20px] left-[75%]"><DessertIcon></DessertIcon></div>
          {{ actionButtonText }}
          </ActionButton>
          <ActionButton :isWider="true">Cancel</ActionButton>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import ActionButton from '@/components/buttons/ActionButton.vue';
import DessertIcon from '@/components/icons/dishCategories/DessertIcon.vue';

defineProps({
  popupId: {
    type: String,
    required: true
  },
  actionButtonText: {
    type: String,
    default: 'Example'
  },
  buttonFunction: {
    type: Function,
    required: true
  },
});
</script>

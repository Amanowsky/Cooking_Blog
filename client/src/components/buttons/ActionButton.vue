<template>
  <button
    class="btn px-[19px] h-[36px] min-h-[auto] font-merri font-black normal-case text-[.75rem]
      md:h-[48px] md:px-[26px] md:text-[.9375rem]"
    @click="emitClickEvent()"
    :class="[
      isWhite ? 'bg-white text-black' : 'bg-black text-white',
      isColored && !isWhite ? 'bg-blue' : 'bg-black',
      biggerBorderRadius ? 'rounded-[8px]' : 'rounded-[6px] md:rounded-[8px]',
      isWider ? 'md:w-[160px] w-[100px]' : 'w-auto'
    ]"
    data-test="ActionButtonMainBtn"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  isColored: {
    type: Boolean,
    default: false,
  },
  isWhite: {
    type: Boolean,
    default: false,
  },
  biggerBorderRadius: {
    type: Boolean,
    default: false,
  },
  isWider: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  /** Emit event after click button */
  (e: 'clickAction'): void;
}>();

/** Emit click action event */
const emitClickEvent = () => emit('clickAction');
</script>

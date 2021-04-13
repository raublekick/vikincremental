<template>
  <article class="panel">
    <p v-if="heading" class="panel-heading">{{ heading }}</p>
    <slot name="content"></slot>
  </article>
</template>
<script>
export default {
  name: "Panel",
  props: {
    heading: {
      required: false,
      type: String,
    },
  },
};
</script>

<template>
  <section class="box">
    <div class="columns">
      <div v-if="heading" class="subtitle column">
        {{ heading }}
      </div>
      <slot name="buttons" class="column"></slot>
    </div>
    <slot name="content"></slot>
  </section>
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

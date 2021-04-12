<template>
  <section>
    <div>Gear</div>
    <div v-for="(item, index) in gear" :key="index">
      {{ item.name }}
    </div>
  </section>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Gear",
  data() {
    return {};
  },

  computed: {
    ...mapState(["gear"]),
  },
};
</script>

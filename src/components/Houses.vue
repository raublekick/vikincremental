<template>
  <section>
    <div class="subtitle">Housing</div>
    <div>
      {{ house.name }}
    </div>
    <div>Beds: {{ house.beds }}</div>
    <div>Comfort: {{ comfort }}</div>
    <div v-for="(item, index) in houses" :key="index">
      <house :item="item" />
    </div>
  </section>
</template>
<script>
import { mapState } from "vuex";
import House from "@/components/House";

export default {
  name: "Houses",
  data() {
    return {};
  },

  components: {
    House,
  },

  computed: {
    ...mapState(["houses", "house", "comfort"]),
  },
};
</script>

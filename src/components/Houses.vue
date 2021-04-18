<template>
  <section>
    <panel heading="Housing">
      <template slot="content">
        <!-- <div class="subtitle">Housing</div> -->
        <div>
          {{ house.name }}
        </div>
        <div>Beds: {{ house.beds }}</div>
        <div>Comfort: {{ comfort }}</div>
        <div>Fortification: {{ fortification }}</div>
        <div v-for="(item, index) in houses" :key="index">
          <house :item="item" />
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import House from "@/components/House";
import Panel from "@/components/Panel";

export default {
  name: "Houses",
  data() {
    return {};
  },

  components: {
    House,
    Panel,
  },

  computed: {
    ...mapState(["houses", "house", "comfort", "fortification"]),
  },
};
</script>

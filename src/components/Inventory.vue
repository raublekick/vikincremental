<template>
  <section>
    <div>Inventory</div>
    <div v-for="(item, index) in items" :key="index">
      {{ item }}: {{ inventory[item] }}
    </div>
  </section>
</template>
<script>
import { mapState } from "vuex";
import * as _ from "lodash";
export default {
  name: "Inventory",
  data() {
    return {};
  },

  computed: {
    ...mapState(["inventory"]),
    items() {
      return _.keys(this.inventory);
    },
  },
};
</script>

<template>
  <section>
    <panel heading="Inventory">
      <template slot="content">
        <div class="panel-block" v-for="(item, index) in items" :key="index">
          {{ item }}: {{ inventory[item] }}
        </div>
        <div
          class="panel-block"
          v-for="(item, index) in food"
          :key="'food' + index"
        >
          {{ item.name }}: {{ item.amount }}
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import * as _ from "lodash";
import Panel from "@/components/Panel";
export default {
  name: "Inventory",
  data() {
    return {};
  },

  components: { Panel },

  computed: {
    ...mapState(["inventory", "food"]),
    items() {
      return _.keys(this.inventory);
    },
  },
};
</script>

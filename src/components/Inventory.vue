<template>
  <section>
    <panel heading="Inventory">
      <template slot="content">
        <div
          class="panel-block"
          v-for="(item, index) in inventory"
          :key="index"
        >
          {{ item.name }}: {{ item.amount }}
        </div>
        <template v-for="(item, index) in food">
          <div
            :key="'food' + index"
            class="panel-block"
            v-if="Math.floor(item.amount) >= 1"
          >
            {{ item.name }}: {{ Math.floor(item.amount) }}
          </div>
        </template>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import Panel from "@/components/Panel";
export default {
  name: "Inventory",
  data() {
    return {};
  },

  components: { Panel },

  computed: {
    ...mapState(["inventory", "food"]),
  },
};
</script>

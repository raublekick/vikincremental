<template>
  <section>
    <panel heading="Inventory">
      <template slot="content">
        <template v-for="(item, index) in inventory">
          <div class="item" :key="index" v-if="Math.floor(item.amount) >= 1">
            {{ item.name }}: {{ Math.floor(item.amount) }}
          </div>
        </template>
        <template v-for="(item, index) in food">
          <div
            :key="'food' + index"
            class="item"
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

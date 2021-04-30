<template>
  <section>
    <!-- <panel heading="Inventory">
      <template slot="content"> -->
    <b-field>
      <b-input v-model="search" placeholder="Search..."> </b-input>
    </b-field>
    <template v-for="(item, index) in items">
      <div class="item" :key="index" v-if="Math.floor(item.amount) >= 1">
        {{ item.name }}: {{ Math.floor(item.amount) }}
      </div>
    </template>
    <template v-for="(item, index) in foodItems">
      <div
        :key="'food' + index"
        class="item"
        v-if="Math.floor(item.amount) >= 1"
      >
        {{ item.name }}: {{ Math.floor(item.amount) }}
      </div>
    </template>
    <!-- </template>
    </panel> -->
  </section>
</template>
<script>
import { mapState } from "vuex";
import * as _ from "lodash";
//import Panel from "@/components/Panel";
export default {
  name: "Inventory",
  data() {
    return { search: "" };
  },

  // components: { Panel },

  computed: {
    ...mapState(["inventory", "food"]),
    items() {
      if (this.search != "") {
        return _.filter(this.inventory, (item) => {
          return item.name.toLowerCase().includes(this.search.toLowerCase());
        });
      }
      return this.inventory;
    },
    foodItems() {
      if (this.search != "") {
        return _.filter(this.food, (item) => {
          return item.name.toLowerCase().includes(this.search.toLowerCase());
        });
      }
      return this.food;
    },
  },
};
</script>

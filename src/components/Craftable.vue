<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">{{ item.name }}</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="title">Components</div>
        <div v-for="component in item.components" :key="component.name">
          {{ component.name }}: {{ component.amount }}
        </div>
        <b-button :disabled="!canCraft" @click="craft()">Craft</b-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import * as _ from "lodash";
export default {
  name: "Craftable",
  data() {
    return {};
  },

  props: {
    item: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },

  computed: {
    ...mapState(["inventory"]),
    ...mapGetters(["inventoryKeys"]),
    canCraft() {
      return (
        _.filter(this.item.components, (component) => {
          return this.inventory[component.name] >= component.amount;
        }).length === this.item.components.length
      );
    },
  },

  methods: {
    ...mapMutations(["decrementInventory", "addGear"]),
    craft() {
      // create a new piece of gear to add
      let newGear = {
        name: this.item.name,
      };

      // decrement components from inventory
      _.forEach(this.item.components, (component) => {
        this.decrementInventory({
          key: component.name,
          amount: component.amount,
        });
      });
      // add new gear to gear store
      this.addGear(newGear);
    },
  },
};
</script>

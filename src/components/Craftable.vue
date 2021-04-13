<template>
  <div style="width: 100%" class="has-text-left">
    {{ item.name }}<br />
    <span v-for="component in item.components" :key="component.name">
      {{ component.name }}: {{ component.amount }}
    </span>
    <b-button class="is-pulled-right" :disabled="!canCraft" @click="craft()"
      >Craft</b-button
    >
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

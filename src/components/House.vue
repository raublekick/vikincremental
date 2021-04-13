<template>
  <div style="width: 100%" class="has-text-left panel-block" v-if="canCraft">
    {{ item.name }}<br />
    Beds: {{ item.beds }}<br />
    <span v-for="component in item.components" :key="component.name">
      {{ component.name }}: {{ component.amount }}
    </span>
    <b-button class="is-pulled-right" :disabled="!canCraft" @click="craft()"
      >Craft House</b-button
    >
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import * as _ from "lodash";
export default {
  name: "House",
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
    ...mapState(["inventory", "gear"]),
    canCraft() {
      var componentsMet =
        _.filter(this.item.components, (component) => {
          return this.inventory[component.name] >= component.amount;
        }).length === this.item.components.length;

      var requirementsMet = _.filter(this.item.requirements, (requirement) => {
        return (
          _.filter(this.gear, (gear) => {
            return gear.name === requirement.name;
          }).length > 0
        );
      });

      return componentsMet && requirementsMet;
    },
  },

  methods: {
    ...mapMutations(["decrementInventory", "setHouse"]),
    craft() {
      // create a new piece of gear to add
      let newHouse = Object.assign({}, this.item);

      // decrement components from inventory
      _.forEach(this.item.components, (component) => {
        this.decrementInventory({
          key: component.name,
          amount: component.amount,
        });
      });
      // add new gear to gear store
      this.setHouse(newHouse);
    },
  },
};
</script>

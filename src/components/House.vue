<template>
  <div v-if="canCraft" class="item">
    <div class="columns">
      <div class="column">
        <div class="is-size-5">{{ item.name }}</div>
        <div v-for="component in item.components" :key="component.name">
          {{ component.name }}: {{ component.amount }}
        </div>
      </div>
      <div class="column has-text-right">
        Beds: {{ item.beds }}
        <b-button :disabled="!canCraft" @click="updateHouse(item)"
          >Craft House</b-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import * as _ from "lodash";
import mixin from "@/store/mixin";
export default {
  name: "House",
  data() {
    return {};
  },

  mixins: [mixin],

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
    ...mapState(["inventory", "gear", "house"]),
    canCraft() {
      var componentsMet =
        this.item.components.length === 0 ||
        _.filter(this.item.components, (component) => {
          var inventoryItem = this.findItem(this.inventory, component.name);
          return inventoryItem && inventoryItem.amount >= component.amount;
        }).length === this.item.components.length;

      var requirementsMet =
        this.item.gearRequirements.length === 0 ||
        _.filter(this.item.gearRequirements, (requirement) => {
          return (
            _.filter(this.gear, (gear) => {
              return gear.name === requirement;
            }).length > 0
          );
        }).length > 0;

      return (
        componentsMet && requirementsMet && this.house.beds < this.item.beds
      );
    },
  },

  methods: {
    ...mapActions(["updateHouse"]),
  },
};
</script>
<style scoped>
.house {
  border-top: 1px solid black;
}
</style>

<template>
  <div style="width: 100%" class="has-text-left panel-block" v-if="canCraft">
    {{ item.name }}<br />
    Beds: {{ item.beds }}<br />
    <span v-for="component in item.components" :key="component.name">
      {{ component.name }}: {{ component.amount }}
    </span>
    <b-button
      class="is-pulled-right"
      :disabled="!canCraft"
      @click="updateHouse(item)"
      >Craft House</b-button
    >
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
        _.filter(this.item.components, (component) => {
          var inventoryItem = this.findItem(this.inventory, component.name);
          return inventoryItem && inventoryItem.amount >= component.amount;
        }).length === this.item.components.length;

      var requirementsMet = _.filter(this.item.requirements, (requirement) => {
        return (
          _.filter(this.gear, (gear) => {
            return gear.name === requirement.name;
          }).length > 0
        );
      });

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

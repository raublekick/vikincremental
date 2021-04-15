<template>
  <div v-if="canCraft || item.built">
    <div class="columns is-multiline">
      <div class="column is-half house-top">
        <div class="is-size-5">{{ item.name }}</div>
      </div>
      <div class="column is-half has-text-right">
        <b-button
          v-if="canCraft && !item.built"
          @click="
            setAddOnBuildState({
              objectKey: 'houseAddOns',
              key: item.name,
              state: true,
            })
          "
          >Craft Add-on</b-button
        >
        <div v-else-if="item.built && item.processing.length">
          <b-field>
            <b-checkbox v-model="item.enabled" :native-value="item.enabled">
              Enabled
            </b-checkbox>
          </b-field>
        </div>
      </div>
      <div class="column house-input">
        <div v-if="!item.built">
          <div v-for="component in item.components" :key="component.name">
            {{ component.name }}: {{ component.amount }}
          </div>
        </div>
        <div v-else-if="item.built && item.enabled">
          <div
            v-for="(process, index) in item.processing"
            :key="'process' + index"
          >
            <span
              v-for="(item, index) in process.input"
              :key="'item' + index"
              class="list-item"
              >{{ item.amount }} {{ item.name }}</span
            >
            -> {{ process.output.name }}
            {{ process.output.amount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import * as _ from "lodash";
import mixin from "@/store/mixin";
export default {
  name: "HouseAddOn",
  data() {
    return { enabled: false };
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
    ...mapState(["inventory", "gear", "house", "houseAddOns"]),
    canCraft() {
      // must have all components
      var componentsMet =
        this.item.components.length === 0 ||
        _.filter(this.item.components, (component) => {
          var inventoryItem = this.findItem(this.inventory, component.name);
          return inventoryItem && inventoryItem.amount >= component.amount;
        }).length === this.item.components.length;

      // must have one requirement
      var requirementsMet =
        this.item.gearRequirements.length === 0 ||
        _.filter(this.item.gearRequirements, (requirement) => {
          return (
            _.filter(this.gear, (gear) => {
              return gear.name === requirement;
            }).length > 0
          );
        }).length > 0;

      var addOnsMet =
        this.item.addOnRequirements.length === 0 ||
        _.filter(this.item.addOnRequirements, (requirement) => {
          return (
            _.filter(this.houseAddOns, (addOn) => {
              return addOn.name === requirement && addOn.built === true;
            }).length > 0
          );
        }).length > 0;

      // check if inventory contains at least one of the inputs (i.e. player cannot unlock smelter until an ore has been mined)

      return (
        componentsMet && requirementsMet && addOnsMet && this.house.beds > 0
      );
    },
  },

  methods: {
    ...mapMutations(["setAddOnBuildState"]),
  },
};
</script>
<style scoped>
.house {
  border-top: 1px solid black;
}
.house-input {
  padding-top: 0;
}
.house-top {
  padding-bottom: 0;
}
</style>

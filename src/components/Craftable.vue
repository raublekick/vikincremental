<template>
  <div class="columns" v-if="canCraft">
    <div class="column">
      <div>{{ item.name }}</div>
    </div>
    <div class="column">
      <div v-for="component in item.components" :key="component.name">
        {{ component.name }}: {{ component.amount }}
      </div>
    </div>
    <div class="column has-text-right">
      <b-button size="is-small" :disabled="!canCraft" @click="craftGear(item)"
        >Craft</b-button
      >
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import * as _ from "lodash";
import mixin from "@/store/mixin";
export default {
  name: "Craftable",
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
    ...mapState(["inventory"]),

    canCraft() {
      return (
        _.filter(this.item.components, (component) => {
          var inventoryItem = this.findItem(this.inventory, component.name);
          return inventoryItem && inventoryItem.amount >= component.amount;
        }).length === this.item.components.length
      );
    },
  },

  methods: {
    ...mapActions(["craftGear"]),
  },
};
</script>

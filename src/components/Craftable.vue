<template>
  <div style="width: 100%" class="has-text-left panel-block" v-if="canCraft">
    {{ item.name }}<br />
    <span v-for="component in item.components" :key="component.name">
      {{ component.name }}: {{ component.amount }}
    </span>
    <b-button
      class="is-pulled-right"
      :disabled="!canCraft"
      @click="craftGear(item)"
      >Craft</b-button
    >
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

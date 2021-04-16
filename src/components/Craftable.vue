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
    ...mapState(["inventory", "house", "houseAddOns"]),

    canCraft() {
      return this.craftable(this.item, this.house, this.houseAddOns);
    },
  },

  methods: {
    ...mapActions(["craftGear"]),
  },
};
</script>

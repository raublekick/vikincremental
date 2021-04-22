<template>
  <div class="columns" v-if="unlocked">
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
import { mapState, mapActions, mapMutations } from "vuex";
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
    ...mapState(["inventory", "house", "houseAddOns", "newCraft"]),

    unlocked() {
      return this.requirementsMet(this.item, this.house, this.houseAddOns);
    },
    canCraft() {
      // must have all components
      return this.craftable(this.item) && this.unlocked;
    },
  },

  methods: {
    ...mapMutations(["setField"]),
    ...mapActions(["craftGear"]),
  },

  watch: {
    unlocked: {
      handler(value) {
        if (value && !this.item.built) {
          this.setField({ name: "newCraft", value: true });
        }
      },
      deep: true,
    },
  },
};
</script>

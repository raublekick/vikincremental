<template>
  <div v-if="unlocked && house.beds < item.beds" class="item">
    <div class="columns">
      <div class="column">
        <div class="is-size-5">{{ item.name }}</div>
      </div>
      <div class="column has-text-right">
        Beds: {{ item.beds }}
        <b-button
          size="is-small"
          :disabled="!canCraft"
          :type="canCraft ? 'is-success' : ''"
          @click="updateHouse(item)"
          >Craft</b-button
        >
      </div>
    </div>
    <div v-for="component in item.components" :key="component.name">
      <crafting-component :component="component" />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import CraftingComponent from "@/components/CraftingComponent";
import mixin from "@/store/mixin";
export default {
  name: "House",
  data() {
    return {};
  },

  mixins: [mixin],

  components: {
    CraftingComponent,
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
    ...mapState(["inventory", "gear", "house", "houseAddOns"]),
    unlocked() {
      return this.requirementsMet(this.item, this.house, this.houseAddOns);
    },
    canCraft() {
      // must have all components
      return (
        this.craftable(this.item) &&
        this.unlocked &&
        this.house.beds < this.item.beds
      );
    },
  },

  methods: {
    ...mapMutations(["setField"]),
    ...mapActions(["updateHouse"]),
  },

  watch: {
    canCraft: {
      handler(value, old) {
        if (value && !old) {
          this.setField({ name: "newHouse", value: true });
          this.notification("New house unlocked: " + this.item.name);
        }
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.house {
  border-top: 1px solid black;
}
</style>

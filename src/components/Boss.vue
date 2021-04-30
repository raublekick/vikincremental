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
      <b-button
        size="is-small"
        :disabled="!canCraft || worldTier != item.worldTier"
        :type="canCraft && worldTier === item.worldTier ? 'is-success' : ''"
        @click="challengeBoss(item)"
        >Challenge</b-button
      >
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import mixin from "@/store/mixin";
export default {
  name: "Boss",
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
    ...mapState(["bossCombat", "inventory", "worldTier"]),

    canCraft() {
      return this.craftable(this.item);
    },
  },

  methods: {
    ...mapActions(["challengeBoss"]),
  },
};
</script>

<template>
  <div v-if="unlocked || item.built">
    <div class="columns is-multiline">
      <div class="column is-half house-top">
        <div class="is-size-5">{{ item.name }}</div>
      </div>
      <div class="column is-half has-text-right">
        <b-button
          size="is-small"
          :disabled="!canCraft"
          :type="canCraft ? 'is-success' : ''"
          v-if="!item.built"
          @click="craftFortification(item)"
          >Craft</b-button
        >
      </div>
      <div class="column house-input">
        <div v-if="!item.built">
          <div v-for="component in item.components" :key="component.name">
            {{ component.name }}: {{ component.amount }}
          </div>
        </div>
        <div v-else-if="item.built && item.enabled">
          <div v-if="item.fortification">
            Fortification: {{ item.fortification }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import mixin from "@/store/mixin";
export default {
  name: "Fortification",
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
    ...mapState(["inventory", "house", "houseAddOns"]),
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
    ...mapActions(["craftFortification"]),
  },

  watch: {
    unlocked: {
      handler(value) {
        if (value && !this.item.built) {
          this.setField({ name: "newHouse", value: true });
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
.house-input {
  padding-top: 0;
}
.house-top {
  padding-bottom: 0;
}
</style>

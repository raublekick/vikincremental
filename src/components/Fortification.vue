<template>
  <div v-if="canCraft || item.built">
    <div class="columns is-multiline">
      <div class="column is-half house-top">
        <div class="is-size-5">{{ item.name }}</div>
      </div>
      <div class="column is-half has-text-right">
        <b-button
          size="is-small"
          v-if="canCraft && !item.built"
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
import { mapState, mapActions } from "vuex";
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
    canCraft() {
      // must have all components
      return this.craftable(this.item, this.house, this.houseAddOns);
    },
  },

  methods: {
    ...mapActions(["craftFortification"]),
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

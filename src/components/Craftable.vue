<template>
  <div v-if="unlocked">
    <div class="columns">
      <div class="column">
        <div>
          <b-tooltip position="is-bottom" multilined dashed>
            {{ item.name }}
            <template v-slot:content>
              <div v-if="item.tooltip">
                {{ item.tooltip }}
              </div>
              <div v-if="item.combat">
                <div>Damage: {{ item.combat.damage }}</div>
                <div>Stamina: {{ item.combat.stamina }}</div>
                <div>Acc: {{ item.combat.accuracy }}</div>
              </div>
              <div v-if="item.armorType">
                <div>{{ item.armorType }}, {{ item.armor }} armor</div>
              </div>
            </template>
          </b-tooltip>
        </div>
      </div>
      <div class="column is-6">
        <div v-for="component in item.components" :key="component.name">
          <crafting-component :component="component" />
        </div>
      </div>
      <div class="column has-text-right is-2">
        <b-button
          size="is-small"
          :disabled="!canCraft"
          @click="craftGear(item)"
          :type="canCraft ? 'is-success' : ''"
          >Craft</b-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import mixin from "@/store/mixin";
import CraftingComponent from "./CraftingComponent.vue";
export default {
  name: "Craftable",
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
      handler(value, old) {
        if (value && !old && !this.item.built) {
          this.setField({ name: "newCraft", value: true });
          this.notification("New crafting item unlocked: " + this.item.name);
        }
      },
      deep: true,
    },
  },
};
</script>

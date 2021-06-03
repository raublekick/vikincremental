<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="subtitle">{{ item.name }}</div>
      </div>
      <div class="column">
        <b-tooltip
          class="is-pulled-right"
          label="Bring this viking back to the realm of the living, at a cost."
          type="is-primary is-light"
        >
          <b-button
            type="is-danger"
            :disabled="ichor < cost"
            @click="reviveViking({ viking: item, cost: cost })"
            >{{ cost }} Ichor</b-button
          >
        </b-tooltip>
      </div>
    </div>
    <div>
      If revived, gets {{ item.bossesDefeated }} points to maximum health,
      maximum stamina, and base values of health regen and stamina regen.
    </div>

    <div v-for="(gear, gIndex) in item.gear" :key="gIndex" class="item">
      <div class="columns">
        <div class="column">{{ gear.name }}</div>
        <div class="column">Value: {{ gear.cost }} Ichor</div>
        <div class="column">
          <a
            class="button is-small is-primary is-pulled-right"
            @click.prevent="
              convertVikingGear({
                item: gear,
                gearIndex: gIndex,
                vikingIndex: index,
              })
            "
            >Convert</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import mixin from "@/store/mixin";

export default {
  name: "VikingDeath",
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
    index: {
      type: Number,
      required: true,
      default() {
        return 0;
      },
    },
  },

  computed: {
    ...mapState(["inventory"]),
    cost() {
      return Math.floor(this.item.baseHealth + this.item.bossesDefeated);
    },
    ichor() {
      return this.findItem(this.inventory, "Ichor").amount;
    },
  },

  methods: {
    ...mapActions(["destroyVikingGear", "reviveViking", "convertVikingGear"]),
  },
};
</script>

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
            @click="reviveViking({ viking: item, cost: cost })"
            >{{ cost }} Ichor</b-button
          >
        </b-tooltip>
      </div>
    </div>
    <div>
      If revived, gets {{ item.bossesDefeated }} point to maximum health, health
      regen, maximum stamina, and stamina regen.
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
import { mapActions } from "vuex";
import * as _ from "lodash";
export default {
  name: "VikingDeath",
  data() {
    return {};
  },

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
    cost() {
      return Math.floor(
        this.item.healthRegen +
          _.sumBy(this.item.gear, (gear) => {
            return gear.cost ? gear.cost : 0;
          })
      );
    },
  },

  methods: {
    ...mapActions(["destroyVikingGear", "reviveViking", "convertVikingGear"]),
  },
};
</script>

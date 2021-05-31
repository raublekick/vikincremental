<template>
  <div>
    <div>
      <span>{{ item.name }}</span>
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

    <div v-for="(gear, gIndex) in item.gear" :key="gIndex">
      <b-field>
        {{ gear.name }} (
        <a
          @click.prevent="
            destroyGear({ gearIndex: gIndex, vikingIndex: index })
          "
          >Destroy ( -{{ gear.cost }} )
        </a>
        )
      </b-field>
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
      return (
        this.item.healthRegen +
        _.sumBy(this.item.gear, (gear) => {
          return gear.cost ? gear.cost : 0;
        })
      );
    },
  },

  methods: { ...mapActions(["destroyGear", "reviveViking"]) },
};
</script>

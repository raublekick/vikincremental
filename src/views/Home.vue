<template>
  <section class="container">
    <div class="content">
      <h1 class="title">Vikincrement</h1>
    </div>
    <div class="columns">
      <div class="column is-3 box mr-4">
        <div class="subtitle">
          Day: {{ day.totalDays }} ( {{ day.dayTicks }} / {{ day.dayLength }})
        </div>
        <hr />
        <div class="subtitle">
          Vikings: {{ vikings.length }} / {{ house.beds || 1 }}
        </div>
        <div>Encounter Rate: {{ encounterChance * 100 }}% / day</div>
        <hr />
        <houses />
        <hr />
        <house-add-ons />
        <hr />
        <div class="subtitle">Lore:</div>
      </div>
      <div class="column">
        <b-tabs v-model="tab">
          <b-tab-item label="Vikings" value="vikings">
            <combat />
            <vikings v-if="!combat" />
          </b-tab-item>

          <b-tab-item label="Inventory" value="inventory">
            <div class="columns">
              <div class="column">
                <inventory />
              </div>
              <div class="column">
                <gear />
              </div>

              <div class="column">
                <craftables />
              </div>
            </div>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Vikings from "@/components/Vikings";
import Inventory from "@/components/Inventory";
import Craftables from "@/components/Craftables";
import Houses from "@/components/Houses";
import HouseAddOns from "@/components/HouseAddOns";
import Gear from "@/components/Gear";
import Combat from "@/components/Combat";

export default {
  name: "Home",
  data() {
    return {};
  },

  components: {
    Vikings,
    Inventory,
    Craftables,
    Gear,
    Houses,
    HouseAddOns,
    Combat,
  },

  computed: {
    ...mapState([
      "activeTab",
      "combat",
      "vikings",
      "tasks",
      "inventory",
      "maxVikings",
      "craftables",
      "day",
      "house",
      "flags",
      "encounterChance",
    ]),
    tab: {
      get() {
        return this.activeTab;
      },
      set(value) {
        this.setActiveTab(value);
      },
    },
  },

  methods: {
    ...mapActions(["tick"]),
    ...mapMutations(["setActiveTab"]),
  },

  created() {
    setInterval(() => {
      this.tick();
    }, 1000);
  },
};
</script>

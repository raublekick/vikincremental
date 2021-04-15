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
        <hr />
        <houses />
        <hr />
        <house-add-ons />
        <hr />
        <div class="subtitle">Lore:</div>
      </div>
      <div class="column">
        <b-tabs v-model="activeTab">
          <b-tab-item label="Vikings"> <vikings /> </b-tab-item>

          <b-tab-item label="Inventory">
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
import { mapState, mapActions } from "vuex";
import Vikings from "@/components/Vikings";
import Inventory from "@/components/Inventory";
import Craftables from "@/components/Craftables";
import Houses from "@/components/Houses";
import HouseAddOns from "@/components/HouseAddOns";
import Gear from "@/components/Gear";

export default {
  name: "Home",
  data() {
    return {
      activeTab: 0,
    };
  },

  components: {
    Vikings,
    Inventory,
    Craftables,
    Gear,
    Houses,
    HouseAddOns,
  },

  computed: {
    ...mapState([
      "vikings",
      "tasks",
      "inventory",
      "maxVikings",
      "craftables",
      "day",
      "house",
    ]),
  },

  methods: {
    ...mapActions(["tick"]),
  },

  created() {
    setInterval(() => {
      this.tick();
    }, 1000);
  },
};
</script>

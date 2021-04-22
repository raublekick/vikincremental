<template>
  <div>
    <div class="content">
      <h1 class="title p-4">
        Vikincrement<b-button @click="reset()" class="is-pulled-right"
          >Reset</b-button
        >
      </h1>
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
        <div>Exploring: {{ biomes[worldTier].name }}</div>
        <div>World Tier: {{ worldTier }}</div>
        <div>Encounter Rate: {{ encounterChance * 100 }}% / day</div>
        <hr />
        <!-- <houses /> -->
        <div class="subtitle">Housing</div>
        <div>
          {{ house.name }}
        </div>
        <div>Beds: {{ house.beds }}</div>
        <div>Comfort: {{ comfort }}</div>
        <div>Fortification: {{ fortification }}</div>
        <hr />
        <!-- <house-add-ons /> -->
        <!-- <hr /> -->
        <div class="subtitle">Inventory</div>
        <inventory />
        <hr />
        <div class="subtitle">Lore:</div>
      </div>
      <div class="column">
        <b-tabs v-model="tab" @input="clearNewItem">
          <b-tab-item label="Vikings" value="vikings">
            <combat />
            <vikings v-if="!combat" />
          </b-tab-item>

          <b-tab-item
            label="Building"
            value="building"
            :icon="newAddOn ? 'alert-circle' : ''"
          >
            <div class="columns">
              <div class="column">
                <houses />
              </div>
              <div class="column">
                <house-add-ons />
              </div>

              <div class="column">
                <fortifications />
              </div>
            </div>
          </b-tab-item>

          <b-tab-item
            label="Crafting"
            value="crafting"
            :icon="newCraft ? 'alert-circle' : ''"
          >
            <div class="columns">
              <div class="column">
                <gear />
              </div>

              <div class="column">
                <craftables />
              </div>
            </div>
          </b-tab-item>

          <b-tab-item label="Proving Grounds" value="proving">
            <proving-grounds />
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Vikings from "@/components/Vikings";
import Inventory from "@/components/Inventory";
import Craftables from "@/components/Craftables";
import Houses from "@/components/Houses";
import HouseAddOns from "@/components/HouseAddOns";
import Fortifications from "@/components/Fortifications";
import Gear from "@/components/Gear";
import Combat from "@/components/Combat";
import ProvingGrounds from "@/components/ProvingGrounds";

export default {
  name: "Game",
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
    Fortifications,
    ProvingGrounds,
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
      "comfort",
      "fortification",
      "worldTier",
      "biomes",
      "newCraft",
      "newAddOn",
    ]),
    tab: {
      get() {
        return this.activeTab;
      },
      set(value) {
        this.setField({ name: "activeTab", value: value });
      },
    },
  },

  methods: {
    ...mapActions(["tick", "saveToDb", "reset"]),
    ...mapMutations(["setField", "setField"]),
    clearNewItem(event) {
      console.log(event);
      switch (event) {
        case "crafting":
          this.setField({ name: "newCraft", value: false });
          break;
        case "building":
          this.setField({ name: "newAddOn", value: false });
          break;
        default:
          break;
      }
    },
  },

  created() {
    setInterval(() => {
      this.tick();
      this.saveToDb();
    }, 1000);
  },
};
</script>

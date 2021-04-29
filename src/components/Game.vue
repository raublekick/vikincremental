<template>
  <div>
    <div class="content">
      <h1 class="title p-4">
        Vikincrement<b-button @click="reset()" class="is-pulled-right"
          >Reset</b-button
        >
        <!-- <b-button @click="resetTier()" class="is-pulled-right"
          >Reset Tier</b-button
        > -->
      </h1>
    </div>
    <div class="columns">
      <div class="column is-3 box mr-4">
        <div class="subtitle">
          Day: {{ day.totalDays }} ( {{ day.dayTicks }} / {{ day.dayLength }})
          <b-button
            class="is-pulled-right"
            :icon-left="isPaused ? 'play' : 'pause'"
            :type="isPaused ? 'is-success is-light' : 'is-warning is-light'"
            @click="setField({ name: 'isPaused', value: !isPaused })"
            >Pause</b-button
          >
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
                <fortifications />
              </div>

              <div class="column">
                <house-add-ons type="processing" label="Processing" />
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <house-add-ons type="workbench" label="Workbench" />
              </div>
              <div class="column">
                <house-add-ons type="forge" label="Forge" />
              </div>

              <div class="column">
                <house-add-ons type="comfort" label="Decorations" />
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

          <b-tab-item label="Debug" value="debug">
            <b-button type="is-primary" label="Copy" @click="copy(state)" />
            <b-field>
              <b-input
                type="textarea"
                v-model="newState"
                @input="updateState()"
              >
              </b-input>
            </b-field>
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
    return {
      newState: null,
    };
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
      "isPaused",
    ]),
    state: {
      get() {
        return this.$store.state;
      },
      set(value) {
        this.init(value);
      },
    },
    tab: {
      get() {
        return this.activeTab;
      },
      set(value) {
        if (value != "") {
          this.setField({ name: "activeTab", value: value });
        }
      },
    },
  },

  methods: {
    ...mapActions(["tick", "saveToDb", "reset"]),
    ...mapMutations(["setField", "setField", "init"]),
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
    resetTier() {
      this.setField({ name: "worldTier", value: 0 });
    },
    async copy(s) {
      await navigator.clipboard.writeText(JSON.stringify(s));
      this.$buefy.toast.open({
        message: "Copied to clipboard!",
        type: "is-success",
      });
    },
    updateState() {
      this.state = JSON.parse(this.newState);
    },
  },

  async created() {
    setInterval(() => {
      if (!this.isPaused) {
        this.tick();
        this.saveToDb();
      }
    }, 1000);
  },
};
</script>

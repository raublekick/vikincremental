<template>
  <div>
    <div class="content">
      <h1 class="title p-4">
        Vikincrement<b-button
          @click="reset()"
          class="is-pulled-right"
          type="is-danger"
          >Reset</b-button
        >
        <!-- <b-button @click="resetTier()" class="is-pulled-right"
          >Reset Tier</b-button
        > -->
      </h1>
    </div>
    <div class="columns mb-4">
      <div class="column is-3 box mr-4">
        <div class="subtitle">
          Day: {{ day.totalDays }} ( {{ day.dayTicks }} / {{ day.dayLength }})
          <b-button
            class="is-pulled-right"
            :icon-left="isPaused ? 'play' : 'pause'"
            :type="isPaused ? 'is-success is-light' : 'is-warning is-light'"
            @click="setField({ name: 'isPaused', value: !isPaused })"
            >{{ isPaused ? "Play" : "Pause" }}</b-button
          >
        </div>
        <hr />
        <div class="subtitle">
          Vikings: {{ vikings.length }} / {{ house.beds || 1 }}
        </div>
        <div>Exploring: {{ biomes[worldTier].name }}</div>
        <div>World Tier: {{ worldTier }}</div>
        <div>
          Encounter Rate: {{ (encounterChance * 100).toFixed(2) }}% / day
        </div>
      </div>
      <div class="column box">
        <div class="log" ref="log" v-html="battleLog"></div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-3 box mr-4">
        <inventory />
      </div>
      <div class="column">
        <b-tabs v-model="tab" @input="clearNewItem">
          <b-tab-item label="Vikings" value="vikings">
            <combat />
            <vikings v-if="!combat" />
          </b-tab-item>

          <b-tab-item
            label="Housing"
            value="building"
            :icon="newHouse ? 'alert-circle' : ''"
          >
            <b-field>
              <b-input v-model="search" placeholder="Search..."> </b-input>
            </b-field>
            <div class="columns tab-container">
              <div class="column">
                <houses />
              </div>
              <div class="column">
                <fortifications :filter="search" />
              </div>

              <div class="column">
                <house-add-ons
                  type="comfort"
                  label="Decorations"
                  :filter="search"
                />
              </div>
            </div>
          </b-tab-item>

          <b-tab-item
            label="Workshop"
            value="workshop"
            :icon="newAddOn ? 'alert-circle' : ''"
          >
            <b-field>
              <b-input v-model="search" placeholder="Search..."> </b-input>
            </b-field>
            <div class="columns tab-container">
              <div class="column">
                <house-add-ons
                  type="workbench"
                  label="Workbench"
                  :filter="search"
                />
              </div>
              <div class="column">
                <house-add-ons type="forge" label="Forge" :filter="search" />
              </div>

              <div class="column">
                <house-add-ons
                  type="processing"
                  label="Processing"
                  :filter="search"
                />
              </div>
            </div>
          </b-tab-item>

          <b-tab-item
            label="Crafting"
            value="crafting"
            :icon="newCraft ? 'alert-circle' : ''"
          >
            <b-field>
              <b-input v-model="search" placeholder="Search..."> </b-input>
            </b-field>
            <div class="columns">
              <div class="column">
                <gear :filter="search" />
              </div>

              <div class="column">
                <craftables :filter="search" />
              </div>
            </div>
          </b-tab-item>

          <b-tab-item label="Proving Grounds" value="proving">
            <proving-grounds />
          </b-tab-item>

          <b-tab-item label="Debug" value="debug">
            <b-field label="Item Rate Modifier">
              <b-input v-model="itemRate"> </b-input>
            </b-field>
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
    <b-modal v-model="dead">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ deathHeader }}</p>
          <button type="button" class="delete" @click="dead = false" />
        </header>
        <section class="modal-card-body">
          {{ deathMessage }}
        </section>
        <footer class="modal-card-foot">
          <b-button label="Close" @click="dead = false" />
        </footer>
      </div>
    </b-modal>
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
      search: "",
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
      "newHouse",
      "isPaused",
      "battleLog",
      "isDead",
      "deathHeader",
      "deathMessage",
    ]),
    state: {
      get() {
        return this.$store.state;
      },
      set(value) {
        this.init(value);
      },
    },
    dead: {
      get() {
        return this.isDead;
      },
      set(value) {
        this.setField({ name: "isDead", value: value });
        this.setField({ name: "isPaused", value: value });
      },
    },
    itemRate: {
      get() {
        return this.$store.state.itemRateModifier;
      },
      set(value) {
        this.setField({ name: "itemRateModifier", value: value });
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
          this.setField({ name: "newHouse", value: false });
          break;
        case "workshop":
          this.setField({ name: "newAddOn", value: false });
          break;
        default:
          break;
      }
    },
    resetTier() {
      this.setField({ name: "worldTier", value: 0 });
    },
    closeModal() {
      this.setField({ name: "isDead", value: false });
      this.setField({ name: "isPaused", value: false });
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

  watch: {
    battleLog() {
      this.$nextTick(() => {
        this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
      });
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
<style scoped>
.log {
  height: 200px;
  max-height: 200px;
  width: 100%;
}
.content {
  height: 100%;
}
.info {
  max-height: 250px;
}
.main-area {
  max-height: 30vmax;
}
.scrollable {
  overflow: auto;
  /* max-height: 100vmax; */
}
.column.box {
  margin-bottom: 1rem;
}
</style>

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

          <b-tab-item label="Instruction Manual" value="howto">
            <dl>
              <dt class="has-text-weight-bold subtitle mt-4">
                What is Vikincremental?
              </dt>
              <dd>
                Vikincremental is part incremental/idle game, part text
                adventure, and part resource management game. Manage a party of
                vikings through treacherous lands by performing tasks, exploring
                dungeons, and challenging bosses.<br /><br />

                The original goal was to translate as much of Valheim as I could
                into a text-based incremental game.
              </dd>
            </dl>

            <dl>
              <dt class="has-text-weight-bold subtitle mt-4">The Day Cycle</dt>
              <dd>
                Vikincremental works on a day cycle of 24 hours. At the
                beginning of each day your vikings will rest, if able, restoring
                and improving their health and stamina for the day. Each viking
                will eat independently so make sure you have enough food for
                all. Resting is only possible with beds and a fire, so be sure
                to prioritize those items!<br /><br />

                Also at the start of each day is the chance for a random enemy
                encounter. The encounter chance is based on the number of
                vikings in your party, as well as your comfort level and
                fortification level.
              </dd>
            </dl>

            <dl>
              <dt class="has-text-weight-bold subtitle mt-4">Housing</dt>
              <dd>
                Housing determines the maximum number of vikings available in
                your party. New houses will become available as your progress
                through the world. As you improve your housing, enemies will
                find you a more attractive target.
              </dd>

              <dt class="has-text-weight-bold">Fortifications</dt>
              <dd>
                Fortifications mitigate the effects of a prosperous homestead.
                Although optional, it may be in your best interest to make your
                homestead as safe as possible.
              </dd>

              <dt class="has-text-weight-bold">Decorations</dt>
              <dd>
                Decorations affect the comfort level and attractiveness of your
                homestead. Comfort affects the daily health and stamina regen
                bonuses provided to your vikings.
              </dd>
            </dl>

            <dl>
              <dt class="has-text-weight-bold subtitle mt-4">Workshop</dt>
              <dd>
                The workshop is where all of the tools to prosper can be found.
              </dd>

              <dt class="has-text-weight-bold">Workbench</dt>
              <dd>Pertains mostly to woodworking and other simple crafts.</dd>

              <dt class="has-text-weight-bold">Forge</dt>
              <dd>The tools for smithing and crafting with metals.</dd>

              <dt class="has-text-weight-bold">Processing</dt>
              <dd>
                Tools that, if enabled, will automatically process resources
                based on pre-determined recipes.
              </dd>
            </dl>

            <dl>
              <dt class="has-text-weight-bold subtitle mt-4">Tasks</dt>
              <dd>
                Tasks are generally controlled by equipment, but in some cases
                certain workshop items must be built before a task can be used.
                Tasks use up stamina so balancing the work of each viking is
                vital to sucecss. <br /><br />Don't forget to check in on your
                vikings to see if new tasks have become available.
              </dd>
            </dl>

            <dl>
              <dt class="has-text-weight-bold subtitle mt-4">
                Proving Grounds
              </dt>
              <dd>
                The Proving Grounds are where vikings go to test their mettle.
                In Delves, vikings will explore randomly generated dungeons
                filled with treasure, enemies, and key items for facing each
                boss.<br /><br />
                Each biome tier has a unique boss that must be defeated before
                your party can move to the next area. Find the keys in Delves to
                be able to challenge each boss.
              </dd>
            </dl>

            <dl>
              <dt class="has-text-weight-bold subtitle mt-4">
                The Cycle of Death and Rebirth
              </dt>
              <dd>
                Death is not always a bad outcome of battle. As vikings perish,
                they will be placed on the corpse pile and remain unusable. Once
                all of your vikings perish, you have a chance to revive them
                with bonuses to health and stamina based on the number of bosses
                you have defeated this cycle.<br /><br />
                Reviving costs Ichor and increases with the power of your
                vikings. You are able to sell off gear you have accumulated in
                exchange for Ichor.<br /><br />
                After reviving your vikings, the world is reset back to the
                first biome, but your invintory and anything you have built
                remains.
              </dd>
            </dl>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
    <b-modal v-model="dead" :can-cancel="false" full-screen>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ deathHeader }}</p>
          <button type="button" class="delete" @click="clearDead()" />
        </header>
        <section class="modal-card-body">
          <div>
            Your bravery is not forgotten. You may choose to revive your vikings
            at a cost. Shed the burden of material possessions to ease the cost.
          </div>

          <div>Ichor: {{ ichor }}</div>
          <b-tabs @input="clearNewItem">
            <b-tab-item label="Vikings">
              <div
                class="item"
                v-for="(viking, index) in ripVikings"
                :key="index"
              >
                <viking-death :item="viking" :index="index" />
              </div>
            </b-tab-item>

            <b-tab-item label="Gear">
              <div v-for="(item, index) in gear" :key="index" class="item">
                <div class="columns">
                  <div class="column">{{ item.name }}</div>
                  <div class="column">Value: {{ item.cost }} Ichor</div>
                  <div class="column">
                    <a
                      class="button is-small is-primary is-pulled-right"
                      @click.prevent="convertGear({ item: item, index: index })"
                      >Convert</a
                    >
                  </div>
                </div>
              </div>
            </b-tab-item>
          </b-tabs>
        </section>
        <footer class="modal-card-foot">
          <b-button label="Close" @click="clearDead()" />
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Vikings from "@/components/Vikings";
import VikingDeath from "@/components/VikingDeath";
import Inventory from "@/components/Inventory";
import Craftables from "@/components/Craftables";
import Houses from "@/components/Houses";
import HouseAddOns from "@/components/HouseAddOns";
import Fortifications from "@/components/Fortifications";
import Gear from "@/components/Gear";
import Combat from "@/components/Combat";
import ProvingGrounds from "@/components/ProvingGrounds";
import mixin from "@/store/mixin";

export default {
  name: "Game",
  data() {
    return {
      newState: null,
      search: "",
    };
  },

  mixins: [mixin],

  components: {
    Vikings,
    VikingDeath,
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
      "ripVikings",
      "gear",
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
    ichor() {
      var item = this.findItem(this.inventory, "Ichor");
      return item ? item.amount : 0;
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
    ...mapActions(["tick", "saveToDb", "reset", "clearDead", "convertGear"]),
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

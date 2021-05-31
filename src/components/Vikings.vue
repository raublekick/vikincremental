<template>
  <section>
    <panel heading="Vikings">
      <template slot="buttons">
        <b-button
          v-if="!showName"
          :disabled="!canCreateViking"
          @click="showName = true"
          :type="canCreateViking ? 'is-primary' : ''"
        >
          +1 Viking
        </b-button>
        <b-field class="has-addons" v-if="showName">
          <div class="control">
            <b-input placeholder="State your name" v-model="name"> </b-input>
          </div>
          <div class="control">
            <a
              class="button is-primary"
              @click.prevent="
                showName = false;
                createViking(name);
                name = randomName();
              "
              >Summon</a
            >
          </div>
        </b-field>
      </template>
      <template slot="content">
        <div class="item" v-for="(viking, index) in vikings" :key="index">
          <viking :item="viking" :index="index" />
        </div>
      </template>
    </panel>

    <panel heading="Corpse Pile" v-if="ripVikings.length">
      <template slot="content">
        <div class="item" v-for="(viking, index) in ripVikings" :key="index">
          <div class="columns">
            <div class="column">
              <div>{{ viking.name }}</div>
            </div>
            <!-- <div class="column">
              <b-tooltip
                class="is-pulled-right"
                label="Retain this viking's gear but send them off to Valhalla. You will be able to summon a new viking in their place. However, the new viking will not have the bonuses earned by this viking."
                type="is-primary is-light"
              >
                <b-button type="is-danger" @click="burnViking(viking)"
                  >Honor in Pyre</b-button
                >
              </b-tooltip>
            </div> -->
          </div>
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Viking from "@/components/Viking";
import Panel from "@/components/Panel";
import mixin from "../store/mixin";
export default {
  name: "Vikings",
  data() {
    return {
      showName: false,
      name: "",
    };
  },

  mixins: [mixin],

  components: {
    Viking,
    Panel,
  },

  computed: {
    ...mapState(["vikings", "ripVikings", "maxVikings", "house"]),
    canCreateViking() {
      if (this.vikings.length + this.ripVikings.length >= this.maxVikings) {
        return false;
      }

      if (
        this.vikings.length + this.ripVikings.length >= this.house.beds &&
        this.vikings.length >= 1
      ) {
        return false;
      }

      return true;
    },
  },

  methods: {
    ...mapActions(["createViking", "burnViking"]),
  },

  created() {
    this.name = this.randomName();
  },
};
</script>

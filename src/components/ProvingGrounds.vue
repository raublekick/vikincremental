<template>
  <div>
    <div v-if="bossCombat">
      <combat />
    </div>
    <div v-else-if="delve"><delve /></div>
    <div v-else-if="!bossCombat && !combat" class="box">
      <div v-for="(biome, i) in unlockedBiomes" :key="'biome' + i" class="item">
        <h3 class="subtitle">
          {{ biome.name
          }}<b-button
            v-if="biome.delve"
            :disabled="worldTier != i || vikings.length === 0"
            :type="worldTier === i && vikings.length > 0 ? 'is-success' : ''"
            @click="initializeDelve()"
            class="is-small is-pulled-right"
            >Delve</b-button
          >
        </h3>
        <pre>{{ biome.flavor }}</pre>

        <boss class="pt-4" :item="bossList[i]" />
      </div>
    </div>
    <div v-else>Cannot delve or challenge a boss while in combat.</div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Boss from "@/components/Boss";
import Combat from "@/components/Combat";
import Delve from "@/components/Delve";
import * as _ from "lodash";
export default {
  name: "ProvingGrounds",
  data() {
    return {};
  },
  components: {
    Boss,
    Combat,
    Delve,
  },
  computed: {
    ...mapState([
      "bossCombat",
      "combat",
      "vikings",
      "enemies",
      "battleLog",
      "bossList",
      "biomes",
      "delve",
      "worldTier",
    ]),
    unlockedBiomes() {
      return _.filter(this.biomes, (biome) => {
        return biome.unlocked;
      });
    },
  },
  methods: {
    ...mapActions(["initializeDelve"]),
  },
};
</script>
<style scoped>
pre {
  height: auto;
  max-height: 200px;
}
</style>

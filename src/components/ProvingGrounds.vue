<template>
  <div class="box">
    <div v-if="bossCombat">
      <combat />
    </div>
    <div v-else-if="!bossCombat && !combat">
      <!-- <div v-for="(boss, i) in bossList" :key="'boss' + i" class="item">
        <boss :item="boss" />
      </div> -->
      <div v-for="(biome, i) in unlockedBiomes" :key="'biome' + i" class="item">
        <h3 class="subtitle">{{ biome.name }}</h3>
        <pre>{{ biome.flavor }}</pre>
        <boss :item="bossList[i]" />
      </div>
    </div>
    <div v-else>Cannot challenge a boss while in combat.</div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Boss from "@/components/Boss";
import Combat from "@/components/Combat";
import * as _ from "lodash";
export default {
  name: "ProvingGrounds",
  data() {
    return {};
  },
  components: {
    Boss,
    Combat,
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
    ]),
    unlockedBiomes() {
      return _.filter(this.biomes, (biome) => {
        return biome.unlocked;
      });
    },
  },
};
</script>
<style scoped>
pre {
  height: auto;
  max-height: 200px;
}
</style>

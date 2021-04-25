<template>
  <div>
    <combat v-if="combat" />

    <div class="box">
      <pre v-show="!combat">{{ battleLog }}</pre>
      <delve-map :config="biome.delve" />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Combat from "./Combat";
import DelveMap from "./DelveMap";
export default {
  name: "Delve",
  data() {
    return {};
  },

  components: {
    Combat,
    DelveMap,
  },
  computed: {
    ...mapState([
      "combat",
      "vikings",
      "enemies",
      "battleLog",
      "delve",
      "worldTier",
      "biomes",
    ]),
    biome() {
      return this.biomes[this.worldTier];
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

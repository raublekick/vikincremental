<template>
  <div>
    <combat v-if="combat" />

    <div class="box">
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
<style scoped></style>

<template>
  <div>
    <combat v-if="combat" />

    <div class="box">
      <delve-map :config="biome.delve" />
      <b-message type="is-info">
        Use the arrow keys to move around. Press space to exit when you are on
        the starting tile. Click on the map if your arrow keys aren't working.
      </b-message>
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

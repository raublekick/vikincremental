<template>
  <div>
    <combat v-if="combat" />

    <div class="box">
      <div ref="delveLog" class="log" v-html="battleLog" v-if="!combat"></div>
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
  watch: {
    battleLog() {
      this.$nextTick(() => {
        this.$refs.delveLog.scrollTop = this.$refs.delveLog.scrollHeight;
      });
    },
  },
};
</script>
<style scoped>
.log {
  height: auto;
  max-height: 200px;
  width: 100%;
}
</style>

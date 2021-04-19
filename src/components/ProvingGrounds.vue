<template>
  <div class="box">
    <div v-if="bossCombat">
      <combat />
    </div>
    <div v-else-if="!bossCombat && !combat">
      <pre>{{ battleLog }}</pre>
      <div v-for="(boss, i) in bossList" :key="'boss' + i" class="item">
        <boss :item="boss" />
      </div>
    </div>
    <div v-else>Cannot challenge a boss while in combat.</div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Boss from "@/components/Boss";
import Combat from "@/components/Combat";
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
    ]),
  },
};
</script>
<style scoped>
pre {
  height: auto;
  max-height: 200px;
  overflow: auto;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
}
</style>

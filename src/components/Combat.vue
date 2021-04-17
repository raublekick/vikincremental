<template>
  <div class="box">
    <pre>{{ battleLog }}</pre>
    <div v-if="combat">
      <div class="columns">
        <div class="column">
          <div class="item" v-for="(viking, index) in vikings" :key="index">
            <viking-combat :item="viking" :index="index" />
          </div>
        </div>
        <div class="divider is-vertical">VS</div>
        <div class="column">
          <div class="item" v-for="(enemy, index) in enemies" :key="index">
            <enemy :item="enemy" :index="index" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import VikingCombat from "@/components/VikingCombat";
import Enemy from "@/components/Enemy";
export default {
  name: "Combat",
  data() {
    return {};
  },
  components: {
    VikingCombat,
    Enemy,
  },
  computed: {
    ...mapState(["combat", "vikings", "enemies", "battleLog"]),
  },
};
</script>

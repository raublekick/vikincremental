<template>
  <section class="container">
    <start v-if="!flags.gameStart" />
    <game v-else />
  </section>
</template>

<script>
//import { mapState, mapActions, mapMutations } from "vuex";
import Game from "@/components/Game";
import Start from "@/components/Start";
import { mapState, mapActions } from "vuex";

export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    Game,
    Start,
  },
  computed: {
    ...mapState(["flags"]),
  },
  methods: {
    ...mapActions(["initialize"]),
  },
  created() {
    this.initialize();
  },
};
</script>

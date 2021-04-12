<template>
  <section>
    <div>Vikings</div>
    <div v-for="(viking, index) in vikings" :key="index">
      <viking :item="viking" />
    </div>
    <b-button :disabled="vikings.length === maxVikings" @click="createViking()">
      +1 Viking
    </b-button>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Viking from "@/components/Viking";
export default {
  name: "Vikings",
  data() {
    return {};
  },

  components: {
    Viking,
  },

  computed: {
    ...mapState(["vikings", "maxVikings"]),
  },

  methods: {
    ...mapActions(["createViking"]),
  },
};
</script>

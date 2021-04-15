<template>
  <section>
    <panel heading="Vikings">
      <template slot="buttons">
        <b-button
          :disabled="!canCreateViking"
          @click="createViking()"
          :type="canCreateViking ? 'is-primary' : ''"
        >
          +1 Viking
        </b-button>
      </template>
      <template slot="content">
        <div class="item" v-for="(viking, index) in vikings" :key="index">
          <viking :item="viking" :index="index" />
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Viking from "@/components/Viking";
import Panel from "@/components/Panel";
export default {
  name: "Vikings",
  data() {
    return {};
  },

  components: {
    Viking,
    Panel,
  },

  computed: {
    ...mapState(["vikings", "maxVikings", "house"]),
    canCreateViking() {
      if (this.vikings.length >= this.maxVikings) {
        return false;
      }

      if (this.vikings.length >= this.house.beds && this.vikings.length >= 1) {
        return false;
      }

      return true;
    },
  },

  methods: {
    ...mapActions(["createViking"]),
  },
};
</script>

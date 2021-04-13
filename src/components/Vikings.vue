<template>
  <section>
    <panel heading="Vikings">
      <template slot="content">
        <div
          class="panel-block"
          v-for="(viking, index) in vikings"
          :key="index"
        >
          <viking :item="viking" />
        </div>
        <b-button
          class="panel-block"
          :disabled="vikings.length === maxVikings"
          @click="createViking()"
        >
          +1 Viking
        </b-button>
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
    ...mapState(["vikings", "maxVikings"]),
  },

  methods: {
    ...mapActions(["createViking"]),
  },
};
</script>

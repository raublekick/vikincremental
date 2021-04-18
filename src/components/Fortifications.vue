<template>
  <section>
    <panel heading="Fortifications">
      <template slot="content">
        <div v-for="(item, index) in fortifications" :key="index" class="item">
          <fortification :item="item" />
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import Fortification from "@/components/Fortification";
import Panel from "@/components/Panel";
export default {
  name: "Fortifications",
  data() {
    return {};
  },

  components: { Fortification, Panel },

  computed: {
    ...mapState(["fortifications", "house"]),
  },
};
</script>

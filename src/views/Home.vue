<template>
  <section>
    <div class="columns">
      <div class="column">
        <houses />
      </div>
      <div class="column">
        <vikings />
      </div>

      <div class="column">
        <inventory />
      </div>

      <div class="column">
        <gear />
      </div>

      <div class="column">
        <craftables />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Vikings from "@/components/Vikings";
import Inventory from "@/components/Inventory";
import Craftables from "@/components/Craftables";
import Houses from "@/components/Houses";
import Gear from "@/components/Gear";

export default {
  name: "Home",
  data() {
    return {};
  },

  components: {
    Vikings,
    Inventory,
    Craftables,
    Gear,
    Houses,
  },

  computed: {
    ...mapState(["vikings", "tasks", "inventory", "maxVikings", "craftables"]),
  },

  methods: {
    ...mapActions(["tick"]),
  },

  created() {
    setInterval(() => {
      this.tick();
    }, 1000);
  },
};
</script>

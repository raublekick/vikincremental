<template>
  <section>
    <div class="columns">
      <div class="column">
        <vikings />
      </div>

      <div class="column">
        <inventory />
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

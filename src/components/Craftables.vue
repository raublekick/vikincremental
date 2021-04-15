<template>
  <section>
    <panel heading="Craftables">
      <template slot="content">
        <div v-for="(item, index) in craftables" :key="index" class="item">
          <craftable :item="item" />
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import Craftable from "@/components/Craftable";
import Panel from "@/components/Panel";
export default {
  name: "Craftables",
  data() {
    return {};
  },

  components: {
    Craftable,
    Panel,
  },

  computed: {
    ...mapState(["craftables"]),
  },
};
</script>

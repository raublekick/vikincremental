<template>
  <section>
    <div>Craftables</div>
    <div v-for="(item, index) in craftables" :key="index">
      <craftable :item="item" />
    </div>
  </section>
</template>
<script>
import { mapState } from "vuex";
import Craftable from "@/components/Craftable";
export default {
  name: "Craftables",
  data() {
    return {};
  },

  components: {
    Craftable,
  },

  computed: {
    ...mapState(["craftables"]),
  },
};
</script>

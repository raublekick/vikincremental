<template>
  <section>
    <div class="subtitle">Add-Ons</div>
    <div v-for="(item, index) in houseAddOns" :key="index" class="item">
      <house-add-on :item="item" />
    </div>
  </section>
</template>
<script>
import { mapState } from "vuex";
import HouseAddOn from "@/components/HouseAddOn";

export default {
  name: "AddOns",
  data() {
    return {};
  },

  components: { HouseAddOn },

  computed: {
    ...mapState(["houseAddOns", "house"]),
  },
};
</script>

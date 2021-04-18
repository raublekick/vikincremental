<template>
  <section>
    <panel heading="Add-Ons">
      <template slot="content">
        <div v-for="(item, index) in houseAddOns" :key="index" class="item">
          <house-add-on :item="item" />
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import HouseAddOn from "@/components/HouseAddOn";
import Panel from "@/components/Panel";
export default {
  name: "AddOns",
  data() {
    return {};
  },

  components: { HouseAddOn, Panel },

  computed: {
    ...mapState(["houseAddOns", "house"]),
  },
};
</script>

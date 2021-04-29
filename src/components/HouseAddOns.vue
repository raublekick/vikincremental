<template>
  <section>
    <panel :heading="label">
      <template slot="content">
        <div v-for="(item, index) in items" :key="index" class="item">
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
import * as _ from "lodash";
export default {
  name: "AddOns",
  data() {
    return {};
  },

  props: {
    type: {
      required: true,
    },
    label: {
      required: true,
    },
  },

  components: { HouseAddOn, Panel },

  computed: {
    ...mapState(["houseAddOns", "house"]),
    items() {
      return _.filter(this.houseAddOns, (item) => {
        return item.type === this.type;
      });
    },
  },
};
</script>

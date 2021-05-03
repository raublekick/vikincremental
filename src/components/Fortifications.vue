<template>
  <section>
    <panel heading="Fortifications">
      <template slot="content">
        <div v-for="(item, index) in items" :key="index">
          <fortification :item="item" class="item" />
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import * as _ from "lodash";
import Fortification from "@/components/Fortification";
import Panel from "@/components/Panel";
export default {
  name: "Fortifications",
  data() {
    return {};
  },

  props: {
    filter: {
      required: false,
      type: String,
      default() {
        return "";
      },
    },
  },

  components: { Fortification, Panel },

  computed: {
    ...mapState(["fortifications", "house"]),
    items() {
      if (this.filter != "") {
        return _.filter(this.fortifications, (item) => {
          return (
            item.name.toLowerCase().includes(this.filter.toLowerCase()) ||
            _.filter(item.components, (component) => {
              return component.name
                .toLowerCase()
                .includes(this.filter.toLowerCase());
            }).length > 0
          );
        });
      }
      return this.fortifications;
    },
  },
};
</script>

<template>
  <section>
    <panel heading="Craftables">
      <template slot="content">
        <div v-for="(item, index) in items" :key="index" class="item">
          <craftable :item="item" />
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import * as _ from "lodash";
import Craftable from "@/components/Craftable";
import Panel from "@/components/Panel";
export default {
  name: "Craftables",
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

  components: {
    Craftable,
    Panel,
  },

  computed: {
    ...mapState(["craftables"]),
    items() {
      if (this.filter != "") {
        return _.filter(this.craftables, (item) => {
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
      return this.craftables;
    },
  },
};
</script>

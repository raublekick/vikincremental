<template>
  <section>
    <panel heading="Housing">
      <template slot="content">
        <div class="panel-block">
          {{ house.name }}<br />
          Beds: {{ house.beds }}
        </div>
        <div v-for="(item, index) in houses" :key="index">
          <house :item="item" />
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import House from "@/components/House";
import Panel from "@/components/Panel";
export default {
  name: "Houses",
  data() {
    return {};
  },

  components: {
    House,
    Panel,
  },

  computed: {
    ...mapState(["houses", "house"]),
  },
};
</script>

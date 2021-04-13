<template>
  <section>
    <panel heading="Gear">
      <template slot="content">
        <div class="panel-block" v-for="(item, index) in gear" :key="index">
          {{ item.name }}
        </div>
      </template>
    </panel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import Panel from "@/components/Panel";
export default {
  name: "Gear",
  data() {
    return {};
  },

  components: { Panel },

  computed: {
    ...mapState(["gear"]),
  },
};
</script>

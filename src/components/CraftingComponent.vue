<template>
  <div>
    <dl class="columns component">
      <dt class="column is-7">{{ component.name }}:</dt>
      <dd class="column has-text-right">
        <span :class="availableClass">{{ available }}</span> /
        {{ component.amount }}
      </dd>
    </dl>
  </div>
</template>
<script>
import { mapState } from "vuex";
import mixin from "@/store/mixin";
export default {
  name: "CraftingComponent",
  data() {
    return {};
  },
  mixins: [mixin],
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["inventory"]),
    available() {
      var item = this.findItem(this.inventory, this.component.name);
      if (item) {
        return Math.floor(item.amount);
      }
      return 0;
    },
    availableClass() {
      return this.available > this.component.amount
        ? "has-text-success"
        : "has-text-danger";
    },
  },
};
</script>
<style scoped>
.component {
  margin: 0;
}
.component .column {
  padding: 0;
}
.component:last-child {
  margin: 0;
}
</style>

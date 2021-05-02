<template>
  <div v-if="unlocked || item.built">
    <div class="columns is-multiline">
      <div class="column is-half house-top">
        <div class="is-size-5">{{ item.name }}</div>
      </div>
      <div class="column is-half has-text-right">
        <b-button
          size="is-small"
          :disabled="!canCraft"
          :type="canCraft ? 'is-success' : ''"
          v-if="!item.built"
          @click="craftAddOn(item)"
          >Craft</b-button
        >
        <div v-else-if="item.built && item.processing.length">
          <b-field>
            <b-checkbox v-model="item.enabled" :native-value="item.enabled">
              Enabled
            </b-checkbox>
          </b-field>
        </div>
      </div>
      <div class="column house-input">
        <div v-if="!item.built">
          <div v-for="component in item.components" :key="component.name">
            {{ component.name }}: {{ component.amount }}
          </div>
        </div>
        <div v-else-if="item.built && item.enabled">
          <div v-if="item.comfort">Comfort: {{ item.comfort }}</div>
          <div v-if="item.processing.length">
            <a href="#" @click.prevent="show = !show">show | hide</a>
            <div v-if="show">
              <div
                v-for="(process, index) in item.processing"
                :key="'process' + index"
              >
                <span
                  v-for="(item, index) in process.input"
                  :key="'item' + index"
                  class="list-item"
                  >{{ item.amount }} {{ item.name }}</span
                >
                -> {{ process.output.name }}
                {{ process.output.amount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import mixin from "@/store/mixin";
export default {
  name: "HouseAddOn",
  data() {
    return { enabled: false, show: true };
  },

  mixins: [mixin],

  props: {
    item: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },

  computed: {
    ...mapState(["inventory", "food", "gear", "house", "houseAddOns"]),
    unlocked() {
      return this.requirementsMet(this.item, this.house, this.houseAddOns);
    },
    canCraft() {
      // must have all components
      return this.craftable(this.item) && this.unlocked;
    },
  },

  methods: {
    ...mapMutations(["setField"]),
    ...mapActions(["craftAddOn"]),
  },

  watch: {
    unlocked: {
      handler(value, old) {
        if (value && !old && !this.item.built) {
          if (
            this.item.type === "workbench" ||
            this.item.type === "forge" ||
            this.item.type === "processing"
          ) {
            this.setField({ name: "newAddOn", value: true });
            this.notification(
              "New " + this.item.type + " item unlocked: " + this.item.name
            );
          } else {
            this.setField({ name: "newHouse", value: true });
            this.notification(
              "New " + this.item.type + " item unlocked: " + this.item.name
            );
          }
        }
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.house {
  border-top: 1px solid black;
}
.house-input {
  padding-top: 0;
}
.house-top {
  padding-bottom: 0;
}
</style>

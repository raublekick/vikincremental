<template>
  <panel heading="Gear">
    <template slot="content">
      <div v-for="(item, index) in items" :key="index" class="item">
        <div class="columns">
          <div class="column">{{ item.name }}</div>
          <div class="column">
            <b-field class="has-addons" v-if="vikings.length">
              <div class="control">
                <b-select
                  size="is-small"
                  placeholder="Select a viking"
                  v-model="vikingIndex"
                >
                  <option
                    v-for="(viking, index) in vikings"
                    :value="index"
                    :key="index"
                  >
                    {{ viking.name }}
                  </option>
                </b-select>
              </div>
              <div class="control">
                <a
                  class="button is-small is-primary"
                  @click.prevent="
                    assignGear({ item: item, vikingIndex: vikingIndex })
                  "
                  >Assign</a
                >
              </div>
            </b-field>
          </div>
        </div>
      </div>
    </template>
  </panel>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import * as _ from "lodash";
import Panel from "@/components/Panel";
export default {
  name: "Gear",
  data() {
    return {
      vikingIndex: 0,
    };
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

  components: { Panel },

  computed: {
    ...mapState(["gear", "vikings"]),
    items() {
      if (this.filter != "") {
        return _.filter(this.gear, (item) => {
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
      return this.gear;
    },
  },

  methods: {
    ...mapMutations(["assignGear"]),
  },
};
</script>

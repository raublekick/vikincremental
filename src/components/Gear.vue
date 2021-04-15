<template>
  <panel heading="Gear">
    <template slot="content">
      <div v-for="(item, index) in gear" :key="index" class="item">
        <div class="columns">
          <div class="column">{{ item.name }}</div>
          <div class="column">
            <b-field class="has-addons">
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
                    assignGear({ gearIndex: index, vikingIndex: vikingIndex })
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
import Panel from "@/components/Panel";
export default {
  name: "Gear",
  data() {
    return {
      vikingIndex: 0,
    };
  },

  components: { Panel },

  computed: {
    ...mapState(["gear", "vikings"]),
  },

  methods: {
    ...mapMutations(["assignGear"]),
  },
};
</script>

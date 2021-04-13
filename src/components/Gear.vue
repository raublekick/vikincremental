<template>
  <section>
    <panel heading="Gear">
      <template slot="content">
        <div class="panel-block" v-for="(item, index) in gear" :key="index">
          {{ item.name }}

          <b-field label="Simple">
            <b-select placeholder="Select a viking" v-model="vikingIndex">
              <option
                v-for="(viking, index) in vikings"
                :value="index"
                :key="index"
              >
                {{ viking.name }}
              </option>
            </b-select>
            <a
              @click.prevent="
                assignGear({ gearIndex: index, vikingIndex: vikingIndex })
              "
              >Assign</a
            >
          </b-field>
        </div>
      </template>
    </panel>
  </section>
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

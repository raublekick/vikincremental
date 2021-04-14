<template>
  <div>
    <header>
      <p>{{ item.name }}</p>
    </header>
    <div>
      <div>
        <b-progress :max="item.maxStamina" :value="item.stamina" show-value />
      </div>
      <div v-for="task in usableTasks" :key="task.name">
        <b-field>
          <b-checkbox v-model="item.tasks" :native-value="task"
            >{{ task.name }}
          </b-checkbox>
        </b-field>
      </div>

      <div v-for="(gear, index) in item.gear" :key="index">
        <b-field>
          {{ gear.name }} (
          <a
            @click.prevent="
              unequipGear({ gearIndex: index, vikingIndex: index })
            "
            >Remove</a
          >
          )
        </b-field>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import * as _ from "lodash";
export default {
  name: "Viking",
  data() {
    return {};
  },

  props: {
    item: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
    index: {
      type: Number,
      required: true,
      default() {
        return 0;
      },
    },
  },

  computed: {
    ...mapState(["tasks"]),
    usableTasks() {
      var tasks = _.filter(this.tasks, (task) => {
        if (!task.requirements || !task.requirements.length) {
          return true;
        }

        var requirementsMet = _.filter(task.requirements, (requirement) => {
          return _.filter(this.item.gear, (gear) => {
            return gear.name === requirement;
          }).length;
        }).length;

        return requirementsMet > 0;
      });

      return tasks;
    },
  },

  methods: { ...mapActions(["unequipGear"]) },
};
</script>

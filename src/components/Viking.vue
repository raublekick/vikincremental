<template>
  <div>
    <header>
      <p>{{ item.name }}</p>
    </header>
    <div>
      <div>
        <div v-for="task in usableTasks" :key="task.name">
          <b-field>
            <b-checkbox v-model="item.tasks" :native-value="task"
              >{{ task.name }}
            </b-checkbox>
          </b-field>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
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
  },

  computed: {
    ...mapState(["tasks"]),
    usableTasks() {
      return _.filter(this.tasks, (task) => {
        if (!task.requirements || !task.requirements.length) {
          return true;
        }

        var requirementsMet = _.filter(task.requirements, (requirement) => {
          return _.filter(this.item.gear, (gear) => {
            return gear.name === requirement.name;
          }).lenght;
        });

        return requirementsMet > 0;
      });
    },
  },

  methods: {},
};
</script>

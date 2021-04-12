<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">{{ item.name }}</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="title">Tasks</div>
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

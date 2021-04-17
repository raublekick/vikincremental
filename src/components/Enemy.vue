<template>
  <div class="columns">
    <div class="column">
      <div>{{ item.name }}</div>
      <div>
        <b-progress :max="item.maxHealth" :value="item.health" show-value
          >{{ item.health }} / {{ item.maxHealth }}</b-progress
        >
      </div>
      <div>Health Regen: {{ item.healthRegen }}</div>
      <div>
        <b-progress :max="item.maxStamina" :value="item.stamina" show-value
          >{{ item.stamina }} / {{ item.maxStamina }}</b-progress
        >
      </div>
      <div>Stamina Regen: {{ item.staminaRegen }}</div>
    </div>
    <div class="column">
      <div v-for="(attack, index) in item.attacks" :key="index">
        <div>{{ attack.name }}</div>
        <div>{{ attack.damage }} dmg</div>
        <div>{{ attack.stamina }} stm</div>
        <div>{{ attack.accuracy }} acc</div>
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
    preference: {
      get() {
        return this.item.foodPreference;
      },
      set(value) {
        this.item.foodPreference = value;
      },
    },
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
};
</script>

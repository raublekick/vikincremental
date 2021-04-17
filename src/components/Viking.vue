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
      <div v-for="task in usableTasks" :key="task.name">
        <b-field>
          <b-checkbox v-model="item.tasks" :native-value="task"
            >{{ task.name }}
          </b-checkbox>
        </b-field>
      </div>
    </div>
    <div class="column">
      <div v-for="(gear, gIndex) in item.gear" :key="gIndex">
        <b-field>
          {{ gear.name }} (
          <a
            @click.prevent="
              unequipGear({ gearIndex: gIndex, vikingIndex: index })
            "
            >Remove</a
          >
          )
        </b-field>
      </div>
    </div>
    <div class="column">
      <b-field label="Food preference">
        <div class="control">
          <b-select size="is-small" v-model="preference">
            <option value="best">Best</option>
            <option value="worst">Worst</option>
          </b-select>
        </div>
      </b-field>
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

  methods: { ...mapActions(["unequipGear"]) },
};
</script>

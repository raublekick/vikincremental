import Vue from "vue";
import Vuex from "vuex";
import mixin from "@/store/mixin";
import * as _ from "lodash";
import vikingData from "./viking.json";
import craftingData from "./craftables.json";
import houseData from "./houses.json";
import taskData from "./tasks.json";

Vue.use(Vuex);

let defaultViking = vikingData;
let craftables = craftingData;

var houses = houseData;

let tasks = taskData;

export default new Vuex.Store({
  state: {
    day: {
      dayLength: 5,
      dayTicks: 0,
      totalDays: 0,
    },
    maxVikings: 10,
    vikings: [],
    tasks: tasks,
    inventory: [],
    gear: [],
    food: [],
    craftables: craftables,
    house: { name: "None", beds: 0 },
    houses: houses,
  },
  getters: {
    canRest: (state) => {
      // if has a fire
      return state.vikings.length > 0;
    },
  },
  mutations: {
    addViking(state, payload) {
      state.vikings.push(payload);
    },
    addStamina(state, payload) {
      var stamina = (state.vikings[payload.vikingIndex].stamina +=
        payload.staminaCost);
      var maxStamina = state.vikings[payload.vikingIndex].maxStamina;
      if (stamina > maxStamina) {
        stamina = maxStamina;
      }
      state.vikings[payload.vikingIndex].stamina = stamina;
    },
    incrementObject(state, payload) {
      var index = mixin.methods.findIndex(
        state[payload.objectKey],
        payload.key
      );
      if (index >= 0) {
        state[payload.objectKey][index].amount += payload.amount;
      } else {
        state[payload.objectKey].push({
          name: payload.key,
          amount: payload.amount,
        });
      }
    },
    decrementObject(state, payload) {
      var index = mixin.methods.findIndex(
        state[payload.objectKey],
        payload.key
      );
      if (index >= 0) {
        state[payload.objectKey][index].amount -= payload.amount;
      }
    },
    addGear(state, gear) {
      state.gear.push(gear);
    },
    setHouse(state, house) {
      state.house = house;
    },
    assignGear(state, payload) {
      var gear = state.gear[payload.gearIndex];
      state.gear.splice(payload.gearIndex, 1);
      state.vikings[payload.vikingIndex].gear.push(gear);
    },
    removeGear(state, payload) {
      var gear = state.vikings[payload.vikingIndex].gear[payload.gearIndex];
      state.vikings[payload.vikingIndex].gear.splice(payload.gearIndex, 1);
      state.gear.push(gear);
    },
    removeTask(state, payload) {
      var taskIndex = _.findIndex(
        state.vikings[payload.vikingIndex].tasks,
        (task) => {
          return task.name === payload.task.name;
        }
      );

      state.vikings[payload.vikingIndex].tasks.splice(taskIndex, 1);
    },
  },
  actions: {
    async tick({ state, commit, getters }) {
      // check the day cycle
      var newDay = false;
      if (state.day.dayTicks === state.day.dayLength) {
        state.day.dayTicks = 0;
        state.day.totalDays += 1;
        newDay = true;
      }
      state.day.dayTicks++;
      // fill inventory from task items
      _.forEach(state.vikings, (viking, i) => {
        var totalStaminaCost = 0,
          totalStaminaDrain = viking.staminaRegen;

        _.forEach(viking.tasks, (task) => {
          // get items first if stamina is positive
          if (viking.stamina > 0) {
            _.forEach(task.items, (item) => {
              commit("incrementObject", {
                objectKey: "inventory",
                key: item.name,
                amount: item.perSecond,
              });
            });

            _.forEach(task.food, (item) => {
              commit("incrementObject", {
                objectKey: "food",
                key: item.name,
                amount: item.perSecond,
              });
            });
            // calculate stamina costs for this task
            totalStaminaCost += task.staminaCost;
          }
        });
        totalStaminaDrain -= totalStaminaCost;
        commit("addStamina", {
          vikingIndex: i,
          staminaCost: totalStaminaDrain,
        });

        // if this is a new day, eat and set each viking's stamina to the max, set stamina regen based on comfort
        if (newDay && getters.canRest === true) {
          viking.stamina = viking.maxStamina;
        }
      });
    },
    async createViking({ state, commit }) {
      if (state.vikings.length < state.maxVikings) {
        let newViking = JSON.parse(JSON.stringify(defaultViking));
        newViking.name = "Viking " + (state.vikings.length + 1);

        commit("addViking", newViking);
      }
    },
    async unequipGear({ state, commit }, payload) {
      commit("removeGear", payload);

      // remove tasks that are no longer allowed
      var tasks = _.filter(state.vikings[payload.vikingIndex].tasks, (task) => {
        if (!task.requirements || !task.requirements.length) {
          return false;
        }

        var requirementsMet = _.filter(task.requirements, (requirement) => {
          return _.filter(state.vikings[payload.vikingIndex].gear, (gear) => {
            return gear.name === requirement;
          }).length;
        }).length;

        return requirementsMet <= 0;
      });

      _.forEach(tasks, (task) => {
        commit("removeTask", {
          vikingIndex: payload.vikingIndex,
          task: task,
        });
      });
    },
    async craftGear({ commit }, payload) {
      let newGear = {
        name: payload.name,
      };

      // decrement components from inventory
      _.forEach(payload.components, (component) => {
        commit("decrementObject", {
          objectKey: "inventory",
          key: component.name,
          amount: component.amount,
        });
      });
      // add new gear to gear store
      commit("addGear", newGear);
    },
    async updateHouse({ commit }, payload) {
      // create a new piece of gear to add
      let newHouse = Object.assign({}, payload);

      // decrement components from inventory
      _.forEach(payload.components, (component) => {
        commit("decrementObject", {
          objectKey: "inventory",
          key: component.name,
          amount: component.amount,
        });
      });
      // add new gear to gear store
      commit("setHouse", newHouse);
    },
  },
  modules: {},
});

import Vue from "vue";
import Vuex from "vuex";
import * as _ from "lodash";

Vue.use(Vuex);

let defaultViking = {
  name: "Viking 1",
  stamina: 25,
  health: 25,
  maxStamina: 25,
  maxHealth: 25,
  staminaRegen: 1,
  healthRegen: 0,
  gear: [],
  tasks: [],
};

let craftables = [
  {
    name: "Hammer",
    components: [
      {
        name: "Wood",
        amount: 8,
      },
    ],
  },
  {
    name: "Stone Axe",
    components: [
      {
        name: "Wood",
        amount: 8,
      },
      {
        name: "Stone",
        amount: 2,
      },
    ],
  },
];

var houses = [
  {
    name: "Hut",
    beds: 1,
    components: [{ name: "Wood", amount: 100 }],
    requirements: ["Hammer"],
  },
  {
    name: "Small House",
    beds: 2,
    components: [{ name: "Wood", amount: 200 }],
    requirements: ["Hammer"],
  },
  {
    name: "Longhouse",
    beds: 4,
    components: [{ name: "Wood", amount: 400 }],
    requirements: ["Hammer"],
  },
  {
    name: "Grand Hall",
    beds: 6,
    components: [
      { name: "Wood", amount: 500 },
      { name: "Stone", amount: 500 },
    ],
    requirements: ["Hammer"],
  },
  {
    name: "Fortress",
    beds: 10,
    components: [
      { name: "Wood", amount: 1000 },
      { name: "Stone", amount: 1000 },
    ],
    requirements: ["Hammer"],
  },
];

let inventory = {
  Stone: 0,
  Wood: 0,
};

let tasks = [
  {
    name: "Gather",
    staminaCost: 1,
    requirements: [],
    food: [
      {
        name: "Berries",
        perSecond: 1,
      },
    ],
    items: [
      {
        name: "Stone",
        perSecond: 1,
      },
      {
        name: "Wood",
        perSecond: 1,
      },
    ],
  },
  {
    name: "Chop Wood",
    staminaCost: 3,
    requirements: ["Stone Axe", "Flint Axe"],
    items: [{ name: "Wood", perSecond: 2 }],
  },
];

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
    inventory: inventory,
    gear: [],
    food: [],
    craftables: craftables,
    house: { name: "None", beds: 0 },
    houses: houses,
  },
  getters: {
    inventoryKeys: (state) => {
      return _.keys(state.inventory);
    },
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
    decrementInventory(state, payload) {
      state.inventory[payload.key] -= payload.amount;
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
    resetTasks(state, payload) {
      state.vikings[payload.vikingIndex].tasks = [];
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
    removeGear(state, payload) {
      var gear = state.vikings[payload.vikingIndex].gear[payload.gearIndex];
      state.vikings[payload.vikingIndex].gear.splice(payload.gearIndex, 1);
      state.gear.push(gear);
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
              if (!state.inventory[item.name]) {
                state.inventory[item.name] = 0;
              }
              state.inventory[item.name] += item.perSecond;
            });

            _.forEach(task.food, (item) => {
              //console.log("Incrementing item: " + item.name);
              var food = _.findIndex(state.food, (food) => {
                return food.name === item.name;
              });
              if (food < 0) {
                state.food.push({ name: item.name, amount: item.perSecond });
              } else {
                state.food[food].amount += item.perSecond;
              }
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
  },
  modules: {},
});

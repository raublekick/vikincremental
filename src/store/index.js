import Vue from "vue";
import Vuex from "vuex";
import * as _ from "lodash";

Vue.use(Vuex);

let defaultViking = {
  name: "Viking 1",
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
  Berries: 0,
};

let tasks = [
  {
    name: "Gather",
    requirements: [],
    items: [
      {
        name: "Stone",
        perSecond: 1,
      },
      {
        name: "Wood",
        perSecond: 1,
      },
      {
        name: "Berries",
        perSecond: 1,
      },
    ],
  },
  {
    name: "Chop Wood",
    requirements: ["Stone Axe", "Flint Axe"],
    items: [{ name: "Wood", perSecond: 2 }],
  },
];

export default new Vuex.Store({
  state: {
    maxVikings: 10,
    vikings: [],
    tasks: tasks,
    inventory: inventory,
    gear: [],
    craftables: craftables,
    house: { name: "None", beds: 0 },
    houses: houses,
  },
  getters: {
    inventoryKeys: (state) => {
      return _.keys(state.inventory);
    },
  },
  mutations: {
    addViking(state, payload) {
      state.vikings.push(payload);
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
    async tick({ state }) {
      _.forEach(state.vikings, (viking) => {
        //console.log("Incrementing " + viking.name);
        _.forEach(viking.tasks, (task) => {
          //console.log("Incrementing task: " + task.name);
          _.forEach(task.items, (item) => {
            //console.log("Incrementing item: " + item.name);
            if (!state.inventory[item.name]) {
              state.inventory[item.name] = 0;
            }
            state.inventory[item.name] += item.perSecond;
          });
        });
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

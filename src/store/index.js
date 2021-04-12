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
        amount: 2,
      },
    ],
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
        let newViking = Object.assign({}, defaultViking);
        newViking.name = "Viking " + (state.vikings.length + 1);

        commit("addViking", newViking);
      }
    },
    async assignTask({ state, commit }, payload) {
      let viking = _.find(state.vikings, (viking) => {
        return viking.name === payload.vikingName;
      });

      let hasTask = _.find(viking.tasks, (task) => {
        return task.name === payload.task.name;
      });

      if (!hasTask) {
        commit("addTaskToViking", payload);
      }
    },
  },
  modules: {},
});

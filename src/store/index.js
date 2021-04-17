import Vue from "vue";
import Vuex from "vuex";
import mixin from "@/store/mixin";
import * as _ from "lodash";
import vikingData from "./viking.json";
import craftingData from "./craftables.json";
import houseData from "./houses.json";
import taskData from "./tasks.json";
import foodData from "./food.json";
import houseAddOnData from "./house-add-ons.json";

Vue.use(Vuex);

let defaultViking = vikingData;

export default new Vuex.Store({
  state: {
    day: {
      dayLength: process.env.NODE_ENV === "production" ? 24 : 24,
      dayTicks: 0,
      totalDays: 0,
    },
    flags: {
      combatUnlocked: false,
    },
    worldTier: 1,
    activeTab: "vikings",
    combat: false,
    battleLog: "",
    attackTicks: 4,
    baseEncounterChance: 0.25,
    maxVikings: 10,
    maxFood: 3,
    defaultStamina: 25,
    defaultHealth: 25,
    comfort: 0,
    baseComfort: 0,
    vikings: [],
    tasks: taskData,
    inventory: [],
    gear: [],
    food: foodData,
    craftables: craftingData,
    house: { name: "None", beds: 0 },
    houses: houseData,
    houseAddOns: houseAddOnData,
    enemies: [],
  },
  getters: {
    canRest: (state) => {
      // if has a fire
      return state.comfort > 0;
    },
    foodBestToWorst: (state) => {
      var edibleFood = _.filter(state.food, (food) => {
        return food.amount >= 1;
      });
      return _.orderBy(edibleFood, ["stamina"], ["desc"]);
    },
    foodWorstToBest: (state) => {
      var edibleFood = _.filter(state.food, (food) => {
        return food.amount >= 1;
      });
      return _.orderBy(edibleFood, ["stamina"], ["asc"]);
    },
  },
  mutations: {
    setActiveTab(state, payload) {
      state.activeTab = payload;
    },
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
    addHealth(state, payload) {
      var health = (state.vikings[payload.vikingIndex].health += payload.value);
      var maxHealth = state.vikings[payload.vikingIndex].maxHealth;
      if (health > maxHealth) {
        health = maxHealth;
      }
      state.vikings[payload.vikingIndex].health = health;
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
    setAddOnBuildState(state, payload) {
      var index = mixin.methods.findIndex(
        state[payload.objectKey],
        payload.key
      );
      if (index >= 0) {
        state[payload.objectKey][index].built = payload.state;
      }
    },
  },
  actions: {
    async tick({ state, commit, getters }) {
      // check the day cycle
      var battleLog = state.battleLog;
      var newDay = false;
      if (state.day.dayTicks === state.day.dayLength) {
        state.day.dayTicks = 0;
        state.day.totalDays += 1;
        newDay = true;
      }
      state.day.dayTicks++;

      // should we enter combat?
      if (newDay && state.vikings.length) {
        var chance = Math.random();
        if (state.enemies.length) {
          state.combat = true;
        } else if (chance < state.baseEncounterChance) {
          state.combat = true;
          state.flags.combatUnlocked = true;
          battleLog =
            "Starting day " + state.day.totalDays + " on the battlefield...\n";

          // get how many enemies to add
          var numberOfEnemies = mixin.methods.randomIntFromInterval(
            1,
            state.vikings.length
          );

          for (var i = 1; i <= numberOfEnemies; i++) {
            state.enemies.push({
              name: "Test Baddie",
              stamina: 15,
              health: 15,
              maxStamina: 15,
              maxHealth: 15,
              staminaRegen: 1,
              baseStaminaRegen: 1,
              healthRegen: 0,
              baseHealthRegen: 0,
              tier: 1,
              attacks: [
                { name: "Swipe", damage: "10", stamina: 10, accuracy: 0.45 },
              ],
            });
            battleLog += "A Test Baddie has entered the battlefield!\n";
          }
        } else {
          state.enemies = [];
          state.combat = false;
        }
      }

      // fill inventory from task items
      _.forEach(state.vikings, (viking, i) => {
        var totalStaminaCost = 0,
          totalStaminaDrain = viking.staminaRegen;

        // if in combat, disable tasks
        if (!state.combat) {
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
        } else {
          // attack only on some of ticks dayTick % (dayLength / attackTicks) === 0
          if (
            state.day.dayTicks % (state.day.dayLength / state.attackTicks) ===
              0 &&
            viking.stamina > 0 &&
            state.enemies.length &&
            !newDay
          ) {
            // get target
            var targetIndex = mixin.methods.randomIntFromInterval(
              0,
              state.enemies.length - 1
            );
            // calculate damage
            var weapon = mixin.methods.getWeapon(viking.gear);
            var hit = Math.random() < weapon.combat.accuracy;
            var damage = hit ? weapon.combat.damage : 0;
            var staminaCost = weapon.combat.stamina;
            if (hit) {
              battleLog +=
                viking.name +
                " hits " +
                state.enemies[targetIndex].name +
                " for " +
                damage +
                " damage and uses " +
                staminaCost +
                " stamina!\n";
            } else {
              battleLog +=
                viking.name +
                " misses and uses " +
                staminaCost +
                " stamina...\n";
            }
            // subtract damage from enemy health
            state.enemies[targetIndex].health -= damage;
            if (state.enemies[targetIndex].health <= 0) {
              battleLog +=
                viking.name +
                " has defeated " +
                state.enemies[targetIndex].name +
                "!\n";
              state.enemies.splice(targetIndex, 1);
            }
            // subtract stamina from viking
            totalStaminaCost += staminaCost;

            // reset combat if all enemies are defeated
            if (!state.enemies.length) {
              state.combat = false;
              battleLog += "You are victorious on this day!\n";
            }
          }
        }
        totalStaminaDrain -= totalStaminaCost;
        commit("addStamina", {
          vikingIndex: i,
          staminaCost: totalStaminaDrain,
        });
        commit("addHealth", {
          vikingIndex: i,
          value: viking.healthRegen,
        });

        // need to calculate comfort outside of new day so it is ready
        state.comfort =
          state.baseComfort +
          _.sumBy(
            _.filter(state.houseAddOns, (addOn) => {
              return addOn.built === true && addOn.enabled === true;
            }),
            (addOn) => {
              return addOn.comfort ? addOn.comfort : 0;
            }
          );
        // if this is a new day, eat and set each viking's stamina to the max, set stamina regen based on comfort
        if (newDay && getters.canRest === true) {
          // reset to default. If there is no edible food or not enough to eat, will not gain benefit from prior day
          viking.stamina = state.defaultStamina;
          viking.maxStamina = state.defaultStamina;

          let stamina = 0;
          let healthRegen = 0;
          let foodEaten = 0;
          if (viking.foodPreference === "best") {
            _.forEach(getters.foodBestToWorst, (food) => {
              if (foodEaten >= state.maxFood) {
                return;
              }
              stamina += food.stamina;
              healthRegen += food.healthRegen;
              commit("decrementObject", {
                objectKey: "food",
                key: food.name,
                amount: 1,
              });
              foodEaten++;
            });
          }

          viking.staminaRegen = viking.baseStaminaRegen + state.comfort;
          viking.healthRegen = viking.baseHealthRegen + healthRegen;
          viking.maxStamina += stamina;
          viking.stamina += stamina;
        }
      });

      // enemy battle
      if (state.combat && state.enemies.length && !newDay) {
        _.forEach(state.enemies, (enemy) => {
          var totalStaminaCost = 0,
            totalStaminaDrain = enemy.staminaRegen;
          if (
            state.day.dayTicks % (state.day.dayLength / state.attackTicks) ===
              0 &&
            enemy.stamina > 0 &&
            state.vikings.length
          ) {
            // get target
            var targetIndex = mixin.methods.randomIntFromInterval(
              0,
              state.vikings.length - 1
            );
            // calculate damage
            var weapon =
              enemy.attacks[
                mixin.methods.randomIntFromInterval(0, enemy.attacks.length - 1)
              ];
            var hit = Math.random() < weapon.accuracy;
            var damage = hit ? weapon.damage : 0;
            var staminaCost = weapon.stamina;
            if (hit) {
              battleLog +=
                enemy.name +
                " hits " +
                state.vikings[targetIndex].name +
                " for " +
                damage +
                " damage and uses " +
                staminaCost +
                " stamina!\n";
            } else {
              battleLog +=
                enemy.name +
                " misses and uses " +
                staminaCost +
                " stamina...\n";
            }
            // subtract damage from enemy health
            state.vikings[targetIndex].health -= damage;
            if (state.vikings[targetIndex].health <= 0) {
              battleLog +=
                state.vikings[targetIndex].name +
                " has been defeated by " +
                enemy.name +
                "...\n";
              state.vikings.splice(targetIndex, 1);
            }
            // subtract stamina from viking
            totalStaminaCost += staminaCost;

            // reset combat if all enemies are defeated
            if (!state.vikings.length) {
              state.combat = false;
              state.enemies = [];
              battleLog += "Your party has been eliminated...\n";
            }
          }
          totalStaminaDrain -= totalStaminaCost;
          enemy.stamina -= totalStaminaDrain;
        });
      }

      // process enabled house add-ons
      _.forEach(state.houseAddOns, (addOn) => {
        if (addOn.enabled) {
          // if enough input exists in inventory, remove it and add output to inventory
          _.forEach(addOn.processing, (process) => {
            // check that every input is available
            var tmpItems = [];
            _.forEach(process.input, (item) => {
              var tmpItem = mixin.methods.findItem(state.inventory, item.name);
              if (tmpItem && tmpItem.amount >= item.amount) {
                tmpItems.push(item);
              }
            });
            // if all input items are available
            if (tmpItems.length === process.input.length) {
              _.forEach(tmpItems, (item) => {
                commit("decrementObject", {
                  objectKey: "inventory",
                  key: item.name,
                  amount: item.amount,
                });
              });
              commit("incrementObject", {
                objectKey: process.output.type,
                key: process.output.name,
                amount: process.output.amount,
              });
            }
          });
        }
      });

      state.battleLog = battleLog;
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
        combat: payload.combat,
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

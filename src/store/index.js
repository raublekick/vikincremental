import Vue from "vue";
import Vuex from "vuex";
import mixin from "@/store/mixin";
import * as _ from "lodash";
import vikingData from "./viking.json";
import idbs from "./idbService";

const store = "vikings";

import defaultState from "./state";

Vue.use(Vuex);

let defaultViking = vikingData;

export default new Vuex.Store({
  state: _.clone(defaultState),
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
    init(state, payload) {
      Object.assign(state, payload);
    },
    setLoading(state, payload) {
      state.isLoading = payload;
    },
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
    addEnemyStamina(state, payload) {
      var stamina = (state.enemies[payload.enemyIndex].stamina +=
        payload.staminaCost);
      var maxStamina = state.enemies[payload.enemyIndex].maxStamina;
      if (stamina > maxStamina) {
        stamina = maxStamina;
      }
      state.enemies[payload.enemyIndex].stamina = stamina;
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
    removeObject(state, payload) {
      state[payload.objectKey].splice(payload.index, 1);
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
    async initializeCombat({ state }) {
      if (state.newDay && state.vikings.length && !state.bossCombat) {
        var chance = Math.random();
        if (state.enemies.length) {
          state.combat = true;
        } else if (chance < state.encounterChance) {
          state.combat = true;
          state.flags.combatUnlocked = true;
          state.battleLog =
            "Starting day " + state.day.totalDays + " on the battlefield...\n";

          // get how many enemies to add
          var numberOfEnemies = mixin.methods.randomIntFromInterval(
            1,
            state.vikings.length
          );

          var tierEnemies = _.filter(state.enemyList, (enemy) => {
            return enemy.worldTier === state.worldTier;
          });

          for (var i = 1; i <= numberOfEnemies; i++) {
            var selectedEnemy = _.clone(
              tierEnemies[
                mixin.methods.randomIntFromInterval(0, tierEnemies.length - 1)
              ]
            );
            state.enemies.push(selectedEnemy);
            state.battleLog +=
              "A " + selectedEnemy.name + " has entered the battlefield!\n";
          }
        } else {
          state.enemies = [];
          state.combat = false;
        }
      }
    },
    async challengeBoss({ state }, boss) {
      state.bossCombat = true;
      state.combat = true;
      state.enemies = [_.clone(boss)];
      state.battleLog =
        "You have challenged the mighty " +
        boss.name +
        "! Do not fear, for even in death you may be rewarded for such bravery.\n";
    },
    async vikingTick({ state, commit, getters }) {
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
            !state.newDay
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
              state.battleLog +=
                viking.name +
                " hits " +
                state.enemies[targetIndex].name +
                " for " +
                damage +
                " damage and uses " +
                staminaCost +
                " stamina!\n";
            } else {
              state.battleLog +=
                viking.name +
                " misses and uses " +
                staminaCost +
                " stamina...\n";
            }
            // subtract damage from enemy health
            state.enemies[targetIndex].health -= damage;
            if (state.enemies[targetIndex].health <= 0) {
              state.battleLog +=
                viking.name +
                " has defeated " +
                state.enemies[targetIndex].name +
                "!\n";
              // get enemy drops
              _.forEach(state.enemies[targetIndex].drops, (drop) => {
                commit("incrementObject", {
                  objectKey: "inventory",
                  key: drop.name,
                  amount: drop.amount,
                });
                state.battleLog +=
                  state.enemies[targetIndex].name +
                  " drops " +
                  drop.amount +
                  " " +
                  drop.name +
                  "!\n";
              });
              if (state.bossCombat) {
                // mark the boss as defeated
                var boss = mixin.methods.findItem(
                  state.bossList,
                  state.enemies[targetIndex].name
                );
                boss.defeated = true;
                if (boss.worldTier === state.worldTier) {
                  state.worldTier++;
                  if (state.biomes[state.worldTier]) {
                    state.biomes[state.worldTier].unlocked = true;
                  }
                }
              }
              commit("removeObject", {
                objectKey: "enemies",
                index: targetIndex,
              });
            }
            // subtract stamina from viking
            totalStaminaCost += staminaCost;

            // reset combat if all enemies are defeated
            if (!state.enemies.length) {
              state.combat = false;
              state.battleLog += "You are victorious on this day!\n";
              if (state.bossCombat) {
                state.bossCombat = false;
                // drop boss artifacts
                state.battleLog +=
                  "For your victory, you are rewarded a sacred artifact.\n";
              }
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

        // if this is a new day, eat and set each viking's stamina to the max, set stamina regen based on comfort
        if (state.newDay && getters.canRest === true) {
          // reset to default. If there is no edible food or not enough to eat, will not gain benefit from prior day
          viking.stamina = viking.baseStamina;
          viking.maxStamina = viking.baseStamina;
          viking.maxHealth = viking.baseHealth;

          let stamina = 0;
          let health = 0;
          let foodEaten = 0;
          var food = [];
          if (viking.foodPreference === "best") {
            food = getters.foodBestToWorst;
          } else {
            food = getters.foodWorstToBest;
          }
          _.forEach(food, (food) => {
            if (foodEaten >= state.maxFood) {
              return;
            }
            stamina += food.stamina;
            health += food.health;
            commit("decrementObject", {
              objectKey: "food",
              key: food.name,
              amount: 1,
            });
            foodEaten++;
          });

          viking.staminaRegen = viking.baseStaminaRegen + state.comfort;
          viking.healthRegen = viking.baseHealthRegen + state.comfort;
          viking.maxStamina += stamina;
          viking.stamina += stamina;
          viking.maxHealth += health;
          commit("addHealth", { vikingIndex: i, value: health / 2 });
        }
      });
    },
    async enemyTick({ state, commit }) {
      if (state.combat && state.enemies.length && !state.newDay) {
        _.forEach(state.enemies, (enemy, i) => {
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
            var armor = mixin.methods.getArmor(state.vikings[targetIndex].gear);
            var damage = hit ? weapon.damage - armor.armorTotal : 0;
            var staminaCost = weapon.stamina;
            if (hit) {
              state.battleLog +=
                enemy.name +
                " hits " +
                state.vikings[targetIndex].name +
                " for " +
                damage +
                " damage and uses " +
                staminaCost +
                " stamina!\n";
            } else {
              state.battleLog +=
                enemy.name +
                " misses and uses " +
                staminaCost +
                " stamina...\n";
            }
            // subtract damage from viking health
            state.vikings[targetIndex].health -= damage;
            if (state.vikings[targetIndex].health <= 0) {
              state.battleLog +=
                state.vikings[targetIndex].name +
                " has been defeated by " +
                enemy.name +
                "...\n";
              if (state.bossCombat) {
                var ripViking = _.clone(state.vikings[targetIndex]);
                state.ripVikings.push(ripViking);
              }
              state.vikings.splice(targetIndex, 1);
            }
            // subtract stamina from viking
            totalStaminaCost += staminaCost;
          }
          totalStaminaDrain -= totalStaminaCost;

          if (state.vikings.length) {
            commit("addEnemyStamina", {
              enemyIndex: i,
              staminaCost: totalStaminaDrain,
            });
          } else {
            // reset combat if all enemies are defeated
            state.combat = false;
            state.battleLog += "Your party has been eliminated...\n";
            state.enemies = [];

            if (state.bossCombat) {
              state.bossCombat = false;

              // reset viking tasks, give bonus to base max health, stamina, health regen, and stamina regen, reset health and stamina
              _.forEach(state.ripVikings, (viking) => {
                var bossesDefeated = _.filter(
                  state.bosses,
                  (boss) => (boss.defeated = true)
                ).length;
                var bonus = 1 + bossesDefeated;
                state.battleLog +=
                  "For your bravery, you are reborn with a bonus " +
                  (1 + bossesDefeated) +
                  " point each to maximum health, health regen, maximum stamina, and stamina regen.\n";
                viking.tasks = [];
                viking.baseHealthRegen += bonus;
                viking.baseStaminaRegen += bonus;
                viking.baseHealth += bonus;
                viking.baseStamina += bonus;
                viking.maxHealth = viking.baseHealth;
                viking.maxStamina = viking.baseStamina;
                viking.health = viking.baseHealth;
                viking.stamina = viking.baseStamina;
                viking.staminaRegen = viking.baseStaminaRegen;
                viking.healthRegen = viking.baseHealthRegen;
              });
              state.vikings = _.clone(state.ripVikings);
            } else {
              // reset world tier, reset ripVikings, remove artifacts, reset bosses, bosssesdefeated
              state.worldTier = 0;
              state.ripVikings = [];
              state.bossList = _.clone(defaultState.bossList);
              state.biomes = _.clone(defaultState.biomes);
              state.battleLog +=
                "Flying far above the battlefield the crow observes, knowing that now it must retrieve more mortals. But these vikings have made a place for themselves, and it may be of use to those to come.\n";
            }
          }
        });
      }
    },
    async processingTick({ state, commit }) {
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
    },
    async tick({ state, dispatch }) {
      // check the day cycle
      state.newDay = false;
      if (state.day.dayTicks === state.day.dayLength) {
        state.day.dayTicks = 0;
        state.day.totalDays += 1;
        state.newDay = true;

        // set comfort level for the day
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

        state.fortification =
          state.baseFortification +
          _.sumBy(
            _.filter(state.fortifications, (addOn) => {
              return addOn.built === true && addOn.enabled === true;
            }),
            (addOn) => {
              return addOn.fortification ? addOn.fortification : 0;
            }
          );

        state.encounterChance =
          state.baseEncounterChance +
          state.vikings.length / 100 +
          (state.comfort * 5) / 100 -
          (state.fortification * 2.5) / 100;
      }
      state.day.dayTicks++;

      // should we enter combat?
      await dispatch("initializeCombat");

      // viking tick
      await dispatch("vikingTick");

      // enemy battle
      await dispatch("enemyTick");

      // process enabled house add-ons
      await dispatch("processingTick");
    },
    async createViking({ state, commit }, name) {
      if (state.vikings.length < state.maxVikings) {
        let newViking = JSON.parse(JSON.stringify(defaultViking));
        newViking.birthday = state.day.totalDays;
        if (name) {
          newViking.name = name;
        } else {
          newViking.name = "Viking " + (state.vikings.length + 1);
        }

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
      let newGear = _.clone(payload);

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
    async craftAddOn({ commit }, payload) {
      // decrement components from inventory
      _.forEach(payload.components, (component) => {
        commit("decrementObject", {
          objectKey: "inventory",
          key: component.name,
          amount: component.amount,
        });
      });
      commit("setAddOnBuildState", {
        objectKey: "houseAddOns",
        key: payload.name,
        state: true,
      });
    },
    async craftFortification({ commit }, payload) {
      // decrement components from inventory
      _.forEach(payload.components, (component) => {
        commit("decrementObject", {
          objectKey: "inventory",
          key: component.name,
          amount: component.amount,
        });
      });
      commit("setAddOnBuildState", {
        objectKey: "fortifications",
        key: payload.name,
        state: true,
      });
    },
    async clear({ commit }, payload) {
      commit("setLoading", true);
      idbs.clear(payload);
      commit("setLoading", false);
    },
    async saveToDb({ state, commit, dispatch }) {
      commit("setLoading", true);
      await dispatch("clear", store);
      try {
        await idbs.save(store, [state]);
      } catch (e) {
        console.log("Error saving " + store + ": " + e);
      }
      commit("setLoading", false);
    },
    async reset({ commit }) {
      commit("init", _.clone(defaultState));
    },
    async newGame({ commit, dispatch }, payload) {
      var newGame = _.clone(defaultState);
      newGame.flags.gameStart = true;
      commit("init", newGame);
      dispatch("createViking", payload.name);
    },
    async initialize({ commit }) {
      commit("setLoading", true);
      try {
        let data = await idbs.getAll(store);
        if (data === null) {
          throw new Error("Could not load save data!");
        } else if (data.length === 0) {
          console.log("No saved data found");
        } else {
          console.log("Loaded from save");
          commit("init", data[0]);
        }
      } catch (e) {
        // The value in storage was invalid or corrupt so just set it to blank
        console.log(e);
        //commit("init", { store, data: {} });
      }
      commit("setLoading", false);
    },
  },
  modules: {},
});

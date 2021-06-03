import craftingData from "./craftables.json";
import houseData from "./houses.json";
import taskData from "./tasks.json";
import foodData from "./food.json";
import houseAddOnData from "./house-add-ons.json";
import fortificationData from "./fortifications.json";
import enemyData from "./enemies.json";
import bossData from "./bosses.json";
import biomeData from "./biomes.json";

export default {
  itemRateModifier: 1,
  isPaused: false,
  isLoading: false,
  newCraft: false,
  newAddOn: false,
  newHouse: false,
  day: {
    dayLength: process.env.NODE_ENV === "production" ? 24 : 24,
    dayTicks: 0,
    totalDays: 0,
  },
  flags: {
    gameStart: false,
    combatUnlocked: false,
  },
  worldTier: 0,
  biomes: biomeData,
  enemyList: enemyData,
  bossList: bossData,
  tasks: taskData,
  houses: houseData,
  houseAddOns: houseAddOnData,
  fortifications: fortificationData,
  food: foodData,
  craftables: craftingData,
  activeTab: "vikings",
  combat: false,
  delve: false,
  bossCombat: false,
  newDay: false,
  battleLog: "",
  deathMessage: "",
  deathHeader: "",
  isDead: false,
  attackTicks: 8,
  encounterChance: 0.25,
  baseEncounterChance: 0.25,
  maxVikings: 10,
  maxFood: 3,
  comfort: 0,
  baseComfort: 0,
  fortification: 0,
  baseFortification: 0,
  vikings: [],
  ripVikings: [],
  memorial: [],
  inventory: [],
  gear: [],
  house: { name: "None", beds: 0 },
  enemies: [],
};

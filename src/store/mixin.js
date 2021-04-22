import * as _ from "lodash";
import names from "./names.json";
import titles from "./title.json";
export default {
  methods: {
    randomName() {
      var titleIndex = this.randomIntFromInterval(0, titles.length);
      var nameIndex = this.randomIntFromInterval(0, names.length);
      return names[nameIndex] + " " + titles[titleIndex];
    },
    findItem(collection, name) {
      var item = _.find(collection, (item) => {
        return item.name === name;
      });

      return item;
    },
    findIndex(collection, name) {
      var itemIndex = _.findIndex(collection, (item) => {
        return item.name === name;
      });

      return itemIndex;
    },
    hasRequirement(collection) {
      return collection && collection.length;
    },
    randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    getWeapon(collection) {
      var gear = _.orderBy(
        _.filter(collection, (item) => {
          return item.combat && item.combat.damage;
        }),
        (item) => {
          return item.combat.damage;
        },
        ["desc"]
      );

      if (!gear.length) {
        return {
          name: "Bare Fists",
          combat: {
            damage: 5,
            stamina: 5,
            accuracy: 0.95,
          },
        };
      }

      return gear[0];
    },
    getArmor(collection) {
      var headArmor = _.orderBy(
        _.filter(collection, (item) => {
          return item.armorType && item.armorType === "Head";
        }),
        (item) => {
          return item.armor;
        },
        ["desc"]
      )[0];

      var bodyArmor = _.orderBy(
        _.filter(collection, (item) => {
          return item.armorType && item.armorType === "Body";
        }),
        (item) => {
          return item.armor;
        },
        ["desc"]
      )[0];

      var legArmor = _.orderBy(
        _.filter(collection, (item) => {
          return item.armorType && item.armorType === "Legs";
        }),
        (item) => {
          return item.armor;
        },
        ["desc"]
      )[0];

      var headValue = headArmor ? headArmor.armor : 0;
      var bodyValue = bodyArmor ? bodyArmor.armor : 0;
      var legValue = legArmor ? legArmor.armor : 0;
      var value = headValue + bodyValue + legValue;

      return { armorTotal: value, armor: [headArmor, bodyArmor, legArmor] };
    },
    requirementsMet(item, house, houseAddOns) {
      // must have one requirement
      var requirementsMet =
        item.gearRequirements && item.gearRequirements.length > 0
          ? _.filter(item.gearRequirements, (requirement) => {
              return (
                _.filter(this.gear, (gear) => {
                  return gear.name === requirement;
                }).length > 0
              );
            }).length > 0
          : true;

      var addOnsMet =
        item.addOnRequirements &&
        item.addOnRequirements.length > 0 &&
        houseAddOns
          ? _.filter(item.addOnRequirements, (requirement) => {
              return (
                _.filter(houseAddOns, (addOn) => {
                  return addOn.name === requirement && addOn.built === true;
                }).length > 0
              );
            }).length > 0
          : true;

      var bedsMet =
        house && item.bedRequirement ? item.bedRequirement <= house.beds : true;

      // check if inventory contains at least one of the inputs (i.e. player cannot unlock smelter until an ore has been mined)

      return bedsMet && addOnsMet && requirementsMet;
    },
    craftable(item) {
      //var open = this.unlocked(item, house, houseAddOns);
      // must have all components
      var componentsMet =
        item.components && item.components.length > 0
          ? _.filter(item.components, (component) => {
              var inventoryItem = this.findItem(this.inventory, component.name);
              return inventoryItem && inventoryItem.amount >= component.amount;
            }).length === item.components.length
          : true;

      return componentsMet; // && open;
    },
  },
};

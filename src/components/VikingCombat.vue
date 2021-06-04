<template>
  <div class="columns">
    <div class="column">
      <div>{{ item.name }}</div>
      <div>
        <b-progress
          :type="healthColor"
          :max="item.maxHealth"
          :value="item.health"
          show-value
          >{{ item.health }} / {{ item.maxHealth }}</b-progress
        >
      </div>
      <div>Health Regen: {{ item.healthRegen }}</div>
      <div>
        <b-progress
          :max="item.maxStamina"
          :value="item.stamina"
          show-value
          type="is-warning"
          >{{ item.stamina }} / {{ item.maxStamina }}</b-progress
        >
      </div>
      <div>Stamina Regen: {{ item.staminaRegen }}</div>
      <div>Armor: {{ armor.armorTotal }}</div>
    </div>
    <div class="column">
      <div>{{ weapon.name }}</div>
      <div>
        {{ weapon.combat.damage }} dmg / {{ weapon.combat.stamina }} stm /
        {{ weapon.combat.accuracy }} acc
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import mixin from "@/store/mixin";
export default {
  name: "Viking",
  data() {
    return {};
  },

  mixins: [mixin],

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
    healthColor() {
      if (this.item.health > this.item.maxHealth / 2) {
        return "is-success";
      } else if (this.item.health > this.item.maxHealth / 4) {
        return "is-warning";
      } else {
        return "is-danger";
      }
    },
    armor() {
      return this.getArmor(this.item.gear);
    },
    weapon() {
      return this.getWeapon(this.item.gear);
    },
  },
};
</script>

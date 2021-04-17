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
      <div>{{ weapon.name }}</div>
      <div>{{ weapon.combat.damage }} dmg</div>
      <div>{{ weapon.combat.stamina }} stm</div>
      <div>{{ weapon.combat.accuracy }} acc</div>
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
    weapon() {
      return this.getWeapon(this.item.gear);
    },
  },
};
</script>

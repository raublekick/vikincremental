<template>
  <section class="hero">
    <div class="hero-body">
      <p class="title">Vikingcrement</p>
      <p class="subtitle">An incremental text adventure</p>
      <div v-if="step === 0">
        <b-button @click="step = 1" type="is-success">New Game</b-button>
      </div>
      <div v-if="step === 1">
        <b-field class="has-addons">
          <div class="control">
            <b-input placeholder="State your name" v-model="name"> </b-input>
          </div>
          <div class="control">
            <a class="button is-primary" @click.prevent="step = 2">Start</a>
          </div>
        </b-field>
      </div>
      <div v-if="step === 2">
        <div class="log" v-html="message"></div>
        <b-button @click="newGame({ name: name })" type="is-success"
          >Start</b-button
        >
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixin from "../store/mixin";
export default {
  name: "Start",
  data() {
    return {
      step: 0,
      name: "",
    };
  },

  mixins: [mixin],

  components: {},

  computed: {
    ...mapState(["flags"]),
    message() {
      var message =
        "You awaken in the clutches of an enormous black bird, its feathers shimmering in the bright sun. The wind batters your face as you come to the realization that you are being carried in the air. Regaining your senses, you have no recollection of how you came to be in this situation. From the vantage of this flight you can see green rolling meadows surrounded by a thick, impenetrable fog. The bird descends towards a mysterious stone arrangement, too well formed to be anything natural, but unlike any design you can recall.<br /><br />";

      message +=
        "As you land, the bird disappears into a cloud of mist and reappears, smaller, perched on a rock pedestal in front of you.<br /><br />";
      message +=
        '<span class="has-background-danger has-text-light">"Hail, ' +
        this.name +
        '! Welcome to my lands"</span>, the bird squawks.<br /><br />';

      message +=
        '<span class="has-background-success has-text-light">"Where am I? Why am I here? And how do you know my name?"</span>, you ask.<br /><br />';

      message +=
        '<span class="has-background-danger has-text-light">"Where is here? Here is where. In truth, I do not know the name of this realm. Your name, however, enters my mind as if I have always known."</span><br /><br />';

      message +=
        '<span class="has-background-success has-text-light">"And my reason for being here?"</span><br /><br />';

      message +=
        '<span class="has-background-danger has-text-light">"That I cannot say."</span><br /><br />';

      message +=
        '<span class="has-background-success has-text-light">"But didn\'t you just say these were your lands?"</span><br /><br />';

      message +=
        '<span class="has-background-danger has-text-light">"Hmm. Nobody has told me these are not my lands. I have been ferrying mortals such as you to these lands for as long as I can remember, but I can no longer remember why."</span><br /><br />';

      message +=
        '<span class="has-background-success has-text-light">"So I have been carried here by you, against my will, robbed of my memory, for reasons you cannot explain?"</span><br /><br />';

      message +=
        '<span class="has-background-danger has-text-light">"So it seems. I can tell you what little I know. These meadows are a relatively peaceful and bountiful land. Make use of the resources you find here. Build yourself a place to rest your head and your work may be rewarded."</span><br /><br />';

      message +=
        '<span class="has-background-success has-text-light">"And what of the fog surrounding these lands?"</span><br /><br />';

      message +=
        '<span class="has-background-danger has-text-light">"The fog... the fog... Oh yes, the fog! Beyond the fog are more dangerous lands. One might want to steer clear of those lands, but then again, one might not."</span><br /><br />';

      message +=
        "The bird disappears once more into a cloud of mist, and seems to be gone for good.";
      return message;
    },
  },

  methods: {
    ...mapActions(["newGame"]),
  },
  created() {
    this.name = this.randomName();
  },
};
</script>
<style scoped></style>

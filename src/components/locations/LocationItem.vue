<template>
  <li class="location-item">
    <div>
      <h4>
        Position
        <a href="#" v-on:click="removeMe"><span class="glyphicon glyphicon-remove"></span></a>
      </h4>
      {{ marker.position.lat() }}
      {{ marker.position.lng() }}
    </div>
  </li>
</template>

<script>
export default {
  name: 'location-item',
  props: ['marker', 'index'],
  methods: {
    removeMe() {
      this.$emit('remove', this.index);
    },
  },
};
</script>

<style>
  .location-item {
    text-align: left;
  }
</style>

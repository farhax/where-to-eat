<template>
  <li class="place-item">
    <div>
      <h4>
        {{ place.name }}
        <small>
          {{ place.rating }}
          <span class="glyphicon glyphicon-star"></span>
        </small>
      </h4>
      <p>
        {{ place.vicinity }}
      </p>
    </div>
  </li>
</template>

<script>
export default {
  name: 'place-item',
  props: ['place'],
};
</script>

<style>
  .place-item {
    text-align: left;
  }
</style>

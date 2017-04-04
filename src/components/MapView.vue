<template>
  <div class="Map">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="page-header">Where 2 Eat</h1>
      </div>
      <div class="col-sm-4">
        <h3>Locations</h3>
        <ul>
          <location-item v-for="(marker, index) in markers" v-bind:marker="marker" v-bind:index="index" v-on:remove="removeMarker"/>
        </ul>
        <hr>

        <template v-if="manualPositionMode">
          <template v-if="!localPosition">
            <template v-if="localPositionLoading">
              <img src="../assets/ajax-loader.gif">
            </template>
            <template v-else>
              <button type="button" v-on:click="findMyPosition">Find Me</button>
            </template>
          </template>
          <h4>or click on the map to add locations</h4>
          <button type="button" v-on:click="disableManualPosition">Done</button>
        </template>
        <template v-else>
          <button type="button" v-on:click="enableManualPosition">Add position</button>
        </template>

        <template v-if="centerMarker">
          <hr>
          <h3>Radius</h3>
          <input type="range" v-model="circleRadiusString" min="1" max="10000"/>
          <p>{{ circleRadius }}</p>
          <button type="button" >Find places</button>
        </template>
      </div>
      <div class="col-sm-8">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import LocationItem from '@/components/locations/LocationItem';
import gmap from '@/services/map';

export default {
  name: 'map-view',
  data() {
    return {
      circles: [],
      markers: [],
      circleRadiusString: '1000',
      localPosition: false,
      localPositionLoading: false,
      manualPositionMode: false,
      centerMarker: null,
    };
  },
  computed: {
    circleRadius() {
      return parseInt(this.circleRadiusString, 10);
    },
  },
  components: {
    LocationItem,
  },
  methods: {
    findMyPosition() {
      this.localPositionLoading = true;

      navigator.geolocation.getCurrentPosition((location) => {
        const { latitude, longitude } = location.coords;
        const latLng = {
          lat: latitude,
          lng: longitude,
        };

        this.localPosition = true;
        this.addMarker(latLng);
      });
    },
    enableManualPosition() {
      this.manualPositionMode = true;
      gmap.setManualAddMode(true);
    },
    disableManualPosition() {
      this.manualPositionMode = false;
      gmap.setManualAddMode(false);
    },
    addMarker(position) {
      const marker = new gmap.google.maps.Marker({
        position,
        optimized: true,
        map: gmap.map,
      });
      this.markers.push(marker);
      this.updateCenterMarker();
    },
    removeMarker(markerIndex) {
      this.markers[markerIndex].setMap(null);
      this.markers.splice(markerIndex, 1);
      this.updateCenterMarker();
    },
    updateCenterMarker() {
      if (this.markers.length === 0) {
        this.centerMarker.setVisible(false);
        this.centerMarker = null;
        return;
      }

      let lat = 0.0;
      let lng = 0.0;

      this.markers.forEach((marker) => {
        lat += marker.position.lat();
        lng += marker.position.lng();
      });

      lat /= this.markers.length;
      lng /= this.markers.length;

      const latLng = { lat, lng };

      if (this.centerMarker) {
        this.centerMarker.setCenter(latLng);
      } else {
        this.centerMarker = new gmap.google.maps.Circle({
          visible: true,
          map: gmap.map,
          center: latLng,
          strokeColor: '#0000FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0000FF',
          fillOpacity: 0.35,
          radius: this.circleRadius,
        });
      }
    },
  },
  mounted() {
    gmap.loadMap('map').then(() => {
      gmap.addMapListener((e) => {
        this.addMarker(e.latLng);
      });
    });
  },
  watch: {
    circleRadiusString() {
      if (this.centerMarker) {
        this.centerMarker.setRadius(this.circleRadius);
      }
    },
  },
};
</script>

<style>
  #map {
    height: 500px;
  }
</style>

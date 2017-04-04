import GoogleMapsLoader from 'google-maps';

const MAP_API_KEY = 'AIzaSyCbnHD6EXbvX5f-FWEa7mCRVLp8qRB7K0w';

export default {
  google: null,
  map: null,
  manualAddMode: false,

  loadMap(elementId) {
    return new Promise((resolve) => {
      const { center, zoom } = this.loadMapView();

      GoogleMapsLoader.KEY = MAP_API_KEY;
      GoogleMapsLoader.load((google) => {
        this.google = google;
        this.map = new google.maps.Map(global.document.getElementById(elementId), {
          center,
          scrollwheel: true,
          zoom,
        });

        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          resolve();
        });
      });
    });
  },

  addMapListener(callBack) {
    this.map.addListener('click', (e) => {
      if (this.manualAddMode) {
        callBack(e);
      }
    });
  },

  setManualAddMode(enabled) {
    this.manualAddMode = enabled;
  },

  clearMap() {
    this.google = null;
    this.map = null;
  },
  saveMapView() {
    const latLngCenter = this.map.getCenter();
    const zoom = this.map.getZoom();

    global.window.localStorage.setItem('latLngCenter', JSON.stringify(latLngCenter));
    global.window.localStorage.setItem('zoom', JSON.stringify(zoom));
  },
  loadMapView() {
    const latLngCenter = JSON.parse(global.window.localStorage.getItem('latLngCenter'));
    const zoom = JSON.parse(global.window.localStorage.getItem('zoom'));

    return {
      center: latLngCenter || { lat: 57.784782, lng: 14.2216445 },
      zoom: zoom || 11,
    };
  },
};

<template>
  <v-container fluid style="height: 100vh;">
        <l-map
            v-if="showMap"
            ref="mymap"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 87%"
            @update:center="centerUpdate"
            @update:zoom="zoomUpdate"
            @click="mapClick"
        >
            <l-tile-layer
                :url="url"
                :attribution="attribution"
            />
            <l-marker v-if="coordsPopup" ref="onclickmarker" :lat-lng="coordsPopup" >

              <l-popup v-if="popUpLoading">
                <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
              </l-popup>

              <l-popup v-if="errorShowing">
                <error-component :errorMsg="errorMsg"></error-component>
              </l-popup>

              <l-popup v-if="currentDataForViewing" >
                <custom-spark-line-component v-if="currentDataForViewing" :chartData="currentDataForViewing.lineChartData"></custom-spark-line-component>

                <custom-data-table-component v-if="currentDataForViewing" :dataTableItems="currentDataForViewing.items"></custom-data-table-component>
              </l-popup>

            </l-marker>
        </l-map>
        <!-- <custom-data-presentation v-if="currentData" :weatherData="currentData"></custom-data-presentation> -->
  </v-container>
</template>

<script>
import * as L from 'leaflet';
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
// import customPopUp from './customPopUp.vue';
// import customDataPresentation from './customDataPresentation.vue'
import customSparkLineComponent from './customSparkLineComponent.vue'
import customDataTableComponent from './customDataTableComponent.vue'
import errorComponent from './errorComponent.vue'

export default {
    name: 'mapComponent',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        customSparkLineComponent,
        customDataTableComponent,
        errorComponent
        // customPopUp,
        // customDataPresentation
    },
    props: ['api'],
    inject: ['isotodate'],
    data: () => ({
      zoom: 13,
      center: L.latLng(40.6401, 22.9444),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      // coordsPopup: L.latLng(40.6401, 22.9444),
      coordsPopup: null,
      currentZoom: 11.5,
      currentCenter: L.latLng(40.6401, 22.9444),
      currentData: null,
      currentDataForViewing: null,
      popUpLoading: false,
      errorShowing: false,
      errorMsg: 'Our digital pandas are trying to solve it!',
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      customMarkerIcon: L.icon({
        iconUrl: "https://toppng.com/uploads/preview/map-marker-icon-600x-map-marker-11562939743ayfahlvygl.png",
        iconSize: [32, 37],
        // iconAnchor: [16, 37]
      })
    }),
    created(){
      // fix for leaflet marker START
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png")
      });
      // fix for leaflet marker END
    },
    mounted(){
        // automatic map click at start
        // this.$nextTick(() => {
        //         this.mapClick({'latlng': L.latLng(40.6401, 22.9444)});
        // }) 
    },
    methods:{
        zoomUpdate(zoom) {
            this.currentZoom = zoom;
        },
        centerUpdate(center) {
            this.currentCenter = center;
        },
        // click on the map, triggers the whole procedure
        mapClick(e){
            this.currentData = null;
            this.currentDataForViewing = null;
            this.coordsPopup = e.latlng;
            this.currentCenter = e.latlng;
            let from_date = this.isotodate(new Date(Date.now() + (60 * 60 * 1000)));
            let to_date = this.isotodate(new Date(new Date().setDate(new Date().getDate() + 1)));

            // getting obj for api ready
            let objForApi = {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              from_date: from_date,
              to_date: to_date
            };

            this.errorShowing = false;
            this.popUpLoading = true;
            this.$nextTick(() => {
              this.$refs.onclickmarker.mapObject.openPopup();
            });

            // live api call
            this.api.getWeatherMeteoHourly(objForApi).then((dataResult) => {
              this.popUpLoading = false;
              this.currentData = dataResult.rawData;
              this.currentDataForViewing = dataResult.dataForViewing;
              this.$nextTick(() => {
                this.$refs.onclickmarker.mapObject.openPopup();
              });
            }).catch(error => {
              this.errorMsg = '(' + error.response.status + ') ' + error.response.data;
              this.popUpLoading = false;
              this.errorShowing = true;
              this.$nextTick(() => {
                this.$refs.onclickmarker.mapObject.openPopup();
              });
            });

            // // mock api call
            // let dataResult = this.api.getMockAnswer(objForApi);
            // this.currentData = dataResult.rawData;
            // this.currentDataForViewing = dataResult.dataForViewing;
            // this.value = this.currentDataForViewing.lineChartData;
            // this.$nextTick(() => {
            //   this.$refs.onclickmarker.mapObject.openPopup();
            // });
        }
    }
  }
</script>

<style>
/* .leaflet-popup-content {
    width: auto;
    height: auto;
} */
</style>

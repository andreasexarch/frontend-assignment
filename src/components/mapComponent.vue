<template>
  <v-container>
    <div style="height: 1000px; width: 100%">
        <l-map
            v-if="showMap"
            ref="mymap"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 80%"
            @update:center="centerUpdate"
            @update:zoom="zoomUpdate"
            @click="mapClick"
        >
            <l-tile-layer
                :url="url"
                :attribution="attribution"
            />
            <l-marker v-if="coordsPopup" ref="onclickmarker" :lat-lng="coordsPopup" >
                <l-popup>
                  <v-progress-circular
                  v-if="currentData === null"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>

                    <custom-spark-line-component v-if="currentDataForViewing" :chartData="currentDataForViewing.lineChartData"></custom-spark-line-component>

                    <custom-data-table-component v-if="currentDataForViewing" :dataTableItems="currentDataForViewing.items"></custom-data-table-component>

                    <!-- <v-data-table v-if="currentDataForViewing"
                        :headers="dataTableValues.headers"
                        :items="dataTableValues.items"
                        :items-per-page="4"
                        class="elevation-1"
                        :footer-props="{
                          disableItemsPerPage: true,
                        }"
                    ></v-data-table> -->


                </l-popup>
            </l-marker>
        </l-map>
        <!-- <custom-data-presentation v-if="currentData" :weatherData="currentData"></custom-data-presentation> -->
    </div>
  </v-container>
</template>

<script>
import * as L from 'leaflet';
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
// import customPopUp from './customPopUp.vue';
// import customDataPresentation from './customDataPresentation.vue'
import customSparkLineComponent from './customSparkLineComponent.vue'
import customDataTableComponent from './customDataTableComponent.vue'

export default {
    name: 'mapComponent',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        customSparkLineComponent,
        customDataTableComponent
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
      coordsPopup: L.latLng(40.6401, 22.9444),
      currentZoom: 11.5,
      currentCenter: L.latLng(40.6401, 22.9444),
      currentData: null,
      currentDataForViewing: null,
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
             this.$nextTick(() => {
                this.$refs.onclickmarker.mapObject.openPopup();
            });
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

            // live api call
            // this.api.getWeatherMeteoHourly(objForApi).then((dataResult) => {
            //   this.currentData = dataResult.rawData;
            //   this.currentDataForViewing = dataResult.dataForViewing;
            //   this.value = this.currentDataForViewing.lineChartData;
            //   console.log(this.currentDataForViewing)
            //   this.dataTableValues.items = this.currentDataForViewing.items
            // });

            // mock api call
            let dataResult = this.api.getMockAnswer(objForApi);
            this.currentData = dataResult.rawData;
            this.currentDataForViewing = dataResult.dataForViewing;
            this.value = this.currentDataForViewing.lineChartData;
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

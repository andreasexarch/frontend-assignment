<template>
  <v-container fluid style="height: 100vh;">
        <l-map
            ref="mymap"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 87%; z-index:1;"
            @click="mapClick"
            @update:zoom="zoomUpdate"
            v-resize="onResize"
        >
            <l-tile-layer
                :url="url"
                :attribution="attribution"
            />
            <l-marker v-if="coordsPopup" ref="onclickmarker" :lat-lng="coordsPopup" @click="markerClicked($event)">

              <!-- <l-popup v-if="popUpLoading" >
                  <v-progress-circular
                    :size="100"
                    indeterminate
                    color="primary"
                    style="width: 100%"
                  ></v-progress-circular>
              </l-popup> -->

              <!-- <l-popup v-if="errorShowing">
                <error-component :errorMsg="errorMsg"></error-component>
              </l-popup> -->

              <!-- <l-popup v-if="currentDataForViewing">
                <line-chart v-if="Object.keys(currentDataForViewing.rawData.temperature2m.data).length > 0" :getData="currentDataForViewing"/> -->
                <!-- <custom-spark-line-component v-if="currentDataForViewing" :chartData="currentDataForViewing.dataForViewing.lineChartData"></custom-spark-line-component> -->
                <!-- <custom-table :items="currentDataForViewing" :tableOptions="{ itemsPerPage: 4 }"></custom-table>
              </l-popup> -->

            </l-marker>
        </l-map>
            <!-- Loading data dialog START -->
            <v-dialog
              v-model="popUpLoading"
              hide-overlay
              persistent
              width="300"
            >
              <v-card
                color="primary"
                dark
              >
                <v-card-text>
                  Loading data..
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- Loading data dialog END -->

            <!-- Data dialog START -->
            <v-dialog
              v-model="dialogShowing"
              style="z-index:2;"
              hide-overlay
              width="40vh"
            >
              <v-card 
                elevation="5"
                outlined
              >
                <minimal-data-presentation v-if="dialogShowing && minimalDialog" :data="currentDataForViewing" :latlng="coordsPopup"></minimal-data-presentation>

                <div v-if="dialogShowing && !minimalDialog">
                  <line-chart v-if="Object.keys(currentDataForViewing.rawData.temperature2m.data).length > 0" :getData="currentDataForViewing"/>
                  <!-- <custom-spark-line-component v-if="currentDataForViewing" :chartData="currentDataForViewing.dataForViewing.lineChartData"></custom-spark-line-component> -->
                  <custom-table :items="currentDataForViewing" :tableOptions="{ itemsPerPage: 4 }"></custom-table>
                </div>

                <v-card-actions>
                  <v-switch
                    v-model="minimalDialog"
                    :label="`Minimal form`"
                  ></v-switch>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="dialogShowing = false">
                    Ok
                  </v-btn>
                  <!-- <v-spacer></v-spacer> -->
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- Data dialog END -->


            <!-- Error dialog START -->
            <v-dialog
              v-model="errorShowing"
              hide-overlay
              width="300"
            >
              <v-card
                elevation="5"
                outlined
              >
                  <error-component :errorMsg="errorMsg"></error-component>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="errorShowing = false">
                      Ok
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- Erro dialog END -->
  </v-container>
</template>

<script>
import * as L from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
// import customSparkLineComponent from './customSparkLineComponent.vue'
import errorComponent from './errorComponent.vue'
import customTable from './customTable.vue'
import lineChart from './lineChartjs.vue'
import minimalDataPresentation from './minimalDataPresentation.vue';

export default {
    name: 'mapComponent',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        // LPopup,
        // customSparkLineComponent,
        errorComponent,
        customTable,
        lineChart,
        minimalDataPresentation
    },
    props: {
      api: {
        type: Object,
        required: true
      }
    },
    inject: ['isotodate'],
    data() {
      return {
        zoom: 13,
        currentZoom: 11.5,
        center: L.latLng(40.6401, 22.9444),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        coordsPopup: null,
        currentDataForViewing: null,
        popUpLoading: false,
        errorShowing: false,
        dialogShowing: false,
        minimalDialog: false,
        errorMsg: 'Our digital pandas are trying to solve it!',
        mapOptions: {
          zoomSnap: 0.5
        },
        customMarkerIcon: L.icon({
          iconUrl: "https://toppng.com/uploads/preview/map-marker-icon-600x-map-marker-11562939743ayfahlvygl.png",
          iconSize: [32, 37],
        })
      }
    },
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
      // dispatch map object in store
      this.$store.dispatch('action_set_new_mapObject', this.$refs.mymap)
    },
    methods:{
        markerClicked(){
          this.dialogShowing = true;
        },
        onResize(){
          // this.center = this.coordsPopup;
          if (this.coordsPopup){
            this.$refs.mymap.mapObject.setView(this.coordsPopup, this.currentZoom);
          }
        },
        zoomUpdate(zoom) {
            this.currentZoom = zoom;
        },
        // click on the map, triggers the whole procedure
        mapClick(e){
            this.currentData = null;
            this.currentDataForViewing = null;
            this.coordsPopup = e.latlng;
            this.center = e.latlng;
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
            // this.$nextTick(() => {
            //   this.$refs.onclickmarker.mapObject.openPopup();
            // });

            // live api call
            this.api.getWeatherMeteoHourly(objForApi).then((dataResult) => {
              this.popUpLoading = false;
              this.dialogShowing = true;
              this.currentData = dataResult.rawData;
              this.currentDataForViewing = dataResult;
              // this.$nextTick(() => {
              //   this.$refs.onclickmarker.mapObject.openPopup();
              // });
            }).catch(error => {
              if (error.response){
                this.errorMsg = '(' + error.response.status + ') ' + error.response.data;
              }
              this.popUpLoading = false;
              this.errorShowing = true;
              this.$nextTick(() => {
                this.$refs.onclickmarker.mapObject.openPopup();
              });
            });


            // // mock api call
            // let dataResult = this.api.getMockAnswer(objForApi);
            // this.currentData = dataResult.rawData;
            // this.currentDataForViewing = dataResult;
            // this.value = this.currentDataForViewing.lineChartData;
            // this.$nextTick(() => {
            //   this.$refs.onclickmarker.mapObject.openPopup();
            // });
        }
    }
  }
</script>

<style>
.leaflet-popup-content{
  width: 40vh !important;
}

</style>

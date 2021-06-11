<template>
    <v-container>
                    <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="text-h5">
                        {{ latlng.lat.toFixed(4) }} {{ latlng.lng.toFixed(4) }}
                      </v-list-item-title>
                      <v-list-item-subtitle>{{ sliderLabels.values[selectedTime].date }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-card-text>
                    <v-row align="center">
                      <v-col
                        class="text-h2"
                        cols="6"
                      >
                        {{ sliderLabels.values[selectedTime].rawData.temp }}&deg;C
                      </v-col>
                      <v-col cols="6">
                        <v-img
                          src="https://cdn.vuetifyjs.com/images/cards/sun.png"
                          alt="Sunny image"
                          width="92"
                        ></v-img>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-weather-rainy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-subtitle>{{ sliderLabels.values[selectedTime].rawData.rh2m }}%</v-list-item-subtitle>
                  </v-list-item>

                  <v-slider
                    v-model="selectedTime"
                    :max="sliderLabels.labels.length - 1"
                    :tick-labels="sliderLabels.labels"
                    class="mx-4"
                    ticks="always"
                    tick-size="1"
                    :thumb-size="2"
                  ></v-slider>
    </v-container>
</template>

<script>
export default {
    name: 'minimalDataPresentation',
    props:{
        data:{
            type: Object,
            default: null
        },
        latlng: {
            type: Object,
            default: null
        }
    },
    data: function(){
        return{
            sliderLabels: {
                labels: [],
                values: []
            },
            selectedTime: 0
        }
    },
    created(){
        this.data.dataForViewing.items.forEach(item => {
            console.log('hours ', new Date(item.date).getHours())
            this.sliderLabels.labels.push(new Date(item.date).getHours().toString());
            this.sliderLabels.values.push(item);
        });
    }
}
</script>
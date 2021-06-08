<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                    <v-data-table
                        :headers="temperatureDataTable.headers"
                        :items="temperatureDataTable.items"
                        :items-per-page="4"
                        class="elevation-1"
                        :footer-props="{
                          disableItemsPerPage: true,
                        }"
                    ></v-data-table>
                </v-col>
                <v-col>
                    <v-sparkline
                        :value="value"
                        :gradient="gradient"
                        :smooth="radius || false"
                        :padding="padding"
                        :line-width="width"
                        :stroke-linecap="lineCap"
                        :gradient-direction="gradientDirection"
                        :fill="fill"
                        :type="type"
                        :auto-line-width="autoLineWidth"
                        auto-draw
                    >
                    <template v-slot:label="item">
                      {{ Math.floor(item.value) }}
                    </template>
                    </v-sparkline>
                </v-col>
                <v-col>
                    <v-data-table
                        :headers="humidityDataTable.headers"
                        :items="humidityDataTable.items"
                        :items-per-page="4"
                        class="elevation-1"
                        :footer-props="{
                          disableItemsPerPage: true,
                        }"
                    ></v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
  const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]
export default {
  name: 'customDataPresentation',
  props: ['weatherData'],
  components: {
  },
  data: () => ({
    temperatureDataTable: {
      headers: [{
        text: 'Date',
        align: 'start',
        sortable: false,
        value: 'date'
      },{
        text: 'Temperature',
        align: 'start',
        sortable: true,
        value: 'temp'
      }],
      items: []
    },
    humidityDataTable: {
      headers: [{
        text: 'Date',
        align: 'start',
        sortable: false,
        value: 'date'
      },{
        text: 'rh2m',
        align: 'start',
        sortable: false,
        value: 'rh2m'
      }],
      items: []
    },
    width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: gradients[5],
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'trend',
      autoLineWidth: false,
  }),
  created(){
    // set data for temperature data table
    Object.keys(this.weatherData.temperature2m.data).forEach(header => {
      let timeObj = new Date(Date.parse(header));
      this.temperatureDataTable.items.push({
        date: timeObj.toDateString() + ' ' + timeObj.getHours() + ':00',
        temp: Math.round(this.weatherData.temperature2m.data[header]) + ' ' + this.weatherData.temperature2m.unit
      })
    })
    // set data for humidity data table
    Object.keys(this.weatherData.rh2m.data).forEach(header => {
      let timeObj = new Date(Date.parse(header));
      this.humidityDataTable.items.push({
        date: timeObj.toDateString() + ' ' + timeObj.getHours() + ':00',
        rh2m: (this.weatherData.rh2m.data[header] * 100) + ' ' + this.weatherData.rh2m.unit
      })
    })
    // set data for sparklines (graph)
    this.value = Object.values(this.weatherData.temperature2m.data)
  },
  mounted(){
  }
};
</script>

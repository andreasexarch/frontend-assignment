<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
      absolute
    >
      <div class="d-flex align-center">
        <span class="mr-2">Temperature Forecast App</span>
      </div>

      <v-spacer></v-spacer>

      <span class="mr-2">Front-end Assign</span>

    </v-app-bar>

     <v-main>
      <map-component :api="api"/>
    </v-main>
  </v-app>

</template>

<script>
import MapComponent from './components/mapComponent.vue';
import { draxisApi } from './draxisApi'
import { ISODateString } from './helper_functions.js'

export default {
  name: 'App',
  provide:{
    isotodate: ISODateString
  },
  components: {
    MapComponent
  },

  created(){
    this.api = new draxisApi('4181a631-652a-40a2-a57f-e8338074cc5a', 'https://cors-anywhere.herokuapp.com/');
  },

  data: () => ({
    
  }),
  methods:{
 
  }
};
</script>

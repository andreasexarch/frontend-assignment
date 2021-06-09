<template>
        <v-container>
            <v-data-table
                        :headers="dataTableValues.headers"
                        :items="dataTableValues.items"
                        :items-per-page="4"
                        class="elevation-1"
                        :footer-props="{
                          disableItemsPerPage: true,
                        }"
                    ></v-data-table>
        </v-container>
</template>

<script>
export default {
  name: 'customDataTableComponent',
  props: ['dataTableItems'],
  components: {
  },
  data: () => ({
      dataTableValues: {
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
        },
        {
          text: 'Humidity',
          align: 'start',
          sortable: true,
          value: 'rh2m'
        }],
        items: []
      }
  }),
  created(){
    this.dataTableValues.items = this.dataTableItems
  },
  mounted(){
  }
};
</script>

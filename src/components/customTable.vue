<template>
        <v-container>
            <v-row justify="space-between" no-gutters>
                <v-col v-for="header in headers" :key="header.value"> {{ header.text }} 
                    <v-btn x-small :plain="currentSortingValue !== header.value" color="primary" @click="triggerSorting(header.value)">
                        <v-icon dark>{{sortingIcon}}</v-icon>
                    </v-btn>
            </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters v-for="item in itemsPerPageContent[currentPage]" :key="item.date">
                <v-col>{{ item.date }}</v-col>
                <!-- <v-col>{{ item.temp }}</v-col> -->
                <v-col><v-chip :color="chipColorsTemperature(item.rawData.temp)" class="mx-4">{{ item.temp }}</v-chip></v-col>
                <v-col><v-chip :color="chipColorsHumidity(item.rawData.rh2m)" class="mx-4">{{ item.rh2m }}</v-chip></v-col>
            </v-row>
            <v-divider class="mx-4"></v-divider>
            <v-row justify="space-between">
                <v-col>{{ tableOptions.itemsPerPage + (tableOptions.itemsPerPage * currentPage) }} of {{ items.dataForViewing.items.length }}</v-col>
                <!-- <v-col>
                    <v-btn elevation="1" x-small :disabled="prevBtnDisabled" @click="currentPage--">
                        <v-icon dark>mdi-arrow-left</v-icon>
                    </v-btn>
                </v-col> -->
                <v-col class="d-flex justify-end">
                    <v-btn elevation="1" x-small :disabled="prevBtnDisabled" @click="currentPage--" class="mx-2">
                        <v-icon dark>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-btn elevation="1" x-small :disabled="nextBtnDisabled" @click="currentPage++" class="mx-2">
                        <v-icon dark>mdi-arrow-right</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
</template>

<script>
export default {
    name: 'customTable',
    props: ['items', 'tableOptions'],
    data: () => ({
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
        itemsPerPageContent: [],
        currentPage: 0,
        isSortingAscending: true, // values are ['none', 'asc', 'desc']
        currentSortingValue: 'date'
    }),
    created(){
        this.pagesCount = Math.ceil(this.items.dataForViewing.items.length / this.tableOptions.itemsPerPage);
        this.allocateItemsInPages();
    },
    mounted(){
        this.currentPage = 0;
    },
    methods: {
        triggerSorting(valueToSort){
            this.changeSorting(valueToSort);
            this.sortItems(valueToSort, this.isSortingAscending);
            this.allocateItemsInPages();
        },
        changeSorting(valueToSort){
            if (valueToSort !== this.currentSortingValue){
                return;
            }else{
                this.isSortingAscending = !this.isSortingAscending;
            }
        },
        sortItems(valueToSort, sortingType){
            if (valueToSort === 'date'){
                if (sortingType){
                    this.items.dataForViewing.items.sort((a, b) => Date.parse(a[valueToSort]) - Date.parse(b[valueToSort]));
                }else{
                    this.items.dataForViewing.items.sort((a, b) => Date.parse(b[valueToSort]) - Date.parse(a[valueToSort]));
                }
            }else{
                if (sortingType){
                    this.items.dataForViewing.items.sort((a, b) => a.rawData[valueToSort] - b.rawData[valueToSort]);
                }else{
                    this.items.dataForViewing.items.sort((a, b) => b.rawData[valueToSort] - a.rawData[valueToSort]);
                }
            }
            this.currentSortingValue = valueToSort;
        },
        allocateItemsInPages(){
            this.itemsPerPageContent = [];
            for(let i=0;i<this.pagesCount;i++ ){
                this.itemsPerPageContent.push(new Array());
            }
            this.items.dataForViewing.items.forEach((item, index) => {
                let pageToPush = Math.floor(index/this.tableOptions.itemsPerPage);
                this.itemsPerPageContent[pageToPush].push(item)
            });
        },
        chipColorsTemperature(value){
            if (value < 10){
                return 'green'
            }else if (value >= 10 && value < 25){
                return 'yellow'
            }else{
                return 'red'
            }
        },
        chipColorsHumidity(value){
            if (value < 40){
                return 'green'
            }else if (value >= 40 && value < 70){
                return 'yellow'
            }else{
                return 'red'
            }
        }
    },
    computed:{
        prevBtnDisabled: function(){
            return this.currentPage === 0;
        },

        nextBtnDisabled: function(){
            return !(this.currentPage < this.pagesCount - 1);
        },

        sortingIcon: function(){
            if (this.isSortingAscending){
                return 'mdi-sort-ascending';
            }else{
                return 'mdi-sort-descending';
            }
        }
    }
}
</script>
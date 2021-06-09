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
            <v-row v-for="item in itemsPerPageContent[currentPage]" :key="item.date">
                <v-col>{{ item.date }}</v-col>
                <v-col>{{ item.temp }}</v-col>
                <v-col>{{ item.rh2m }}</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row justify="space-between">
                <v-col>{{ tableOptions.itemsPerPage + (tableOptions.itemsPerPage * currentPage) }} of {{ items.dataForViewing.items.length }}</v-col>
                <v-col>
                    <v-btn elevation="1" x-small :disabled="prevBtnDisabled" @click="currentPage--">
                        <v-icon dark>mdi-arrow-left</v-icon>
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn elevation="1" x-small :disabled="nextBtnDisabled" @click="currentPage++">
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
        temperatureSortingType: 'none', // values are ['none', 'asc', 'desc']
        currentSortingValue: null
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
            this.changeSorting();
            this.sortItems(valueToSort, this.temperatureSortingType);
            this.allocateItemsInPages();
        },
        changeSorting(){
            switch(this.temperatureSortingType){
                case 'none':
                    this.temperatureSortingType = 'asc';
                    break;
                case 'asc':
                    this.temperatureSortingType = 'desc';
                    break;
                case 'desc':
                    this.temperatureSortingType = 'asc';
                    break;
            }
        },
        sortItems(valueToSort, sortingType){
            if (valueToSort === 'date'){
                if (sortingType === 'asc'){
                    this.items.dataForViewing.items.sort((a, b) => Date.parse(a[valueToSort]) - Date.parse(b[valueToSort]));
                }else{
                    this.items.dataForViewing.items.sort((a, b) => Date.parse(b[valueToSort]) - Date.parse(a[valueToSort]));
                }
            }else{
                if (sortingType === 'asc'){
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
    },
    computed:{
        prevBtnDisabled: function(){
            return this.currentPage === 0;
        },

        nextBtnDisabled: function(){
            return !(this.currentPage < this.pagesCount - 1);
        },

        sortingIcon: function(){
            if (this.temperatureSortingType === 'asc'){
                return 'mdi-sort-ascending';
            }else{
                return 'mdi-sort-descending';
            }
        }
    }
}
</script>
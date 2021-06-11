<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
    props: {
        getData: {
            type: Object,
            default: null
        },
        options: {
        type: Object,
        default: function(){
            return{
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMax: 45,    // minimum will be 0, unless there is a lower value.
                            // OR //
                            beginAtZero: true   // minimum value will be 0.
                        }
                    }],
                     xAxes: [{
                        display: false //this will remove all the x-axis grid lines
                    }]
                }
            }
        } 
    }
  },
  data: function(){
      return{
          chartData: {
              labels: [],
                datasets: [
                    {
                        label: 'Temperature line chart (24hrs)',
                        backgroundColor: '#418dd9',
                        fill: false,
                        data: []
                    },{
                        label: 'Humidity line chart (24hrs)',
                        backgroundColor: '#41D979',
                        fill: false,
                        data: []
                    }
                ]
          },
          chartOptions: {
            responsive: true,
            maintainAspectRatio: true,
        }
      }
  },
  mounted () {
    this.chartOptions = this.options
    this.getData.dataForViewing.items.forEach(item => {
        this.chartData.labels.push(item.date);
        this.chartData.datasets[0].data.push(item.rawData.temp);
        this.chartData.datasets[1].data.push(item.rawData.rh2m);
    })

    this.renderChart(this.chartData, this.chartOptions)
  }
}
</script>

<style>
/* #line-chart{
    height: 350px !important;
} */
</style>
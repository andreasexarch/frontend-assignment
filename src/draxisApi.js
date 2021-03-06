const axios = require("axios");

/*
    Class that implements the api calls to api.draxis.gr and also contains
    parser function in order to work on the responses

*/
export class draxisApi{
    constructor(token, proxy = ''){
        this.token = token;
        this.proxy = proxy;
        this.apiURL = "https://api.draxis.gr";
    }

    getWeatherMeteoHourly(objParams){
        return new Promise((resolve, reject) => {
            axios.get(`${this.proxy + this.apiURL}/weather/meteo/hourly?apikey=${this.token}&lat=${objParams.lat}&lon=${objParams.lon}&from_date=${objParams.from_date}&to_date=${objParams.to_date}&resolution=2km`)
            .then((response) => {
              let myVariablesAnswer = {
                'temperature2m': response.data.temperature2m,
                'rh2m': response.data.rh2m
                }
                let result = this.parseWeatherMeteoHourlyResponse(myVariablesAnswer)
                resolve({
                    rawData: myVariablesAnswer,
                    dataForViewing: result
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    parseWeatherMeteoHourlyResponse(data){
        // set data for temperature data table and line chart
        let finalDataObj = {
            items: [],
            lineChartData: Object.values(data.temperature2m.data)
        };
        let valueToIterate = null;
        Object.keys(data).forEach(key => {
            if (Object.keys(data[key].data).length > 0){
                valueToIterate = key;
            }
        });

        if (valueToIterate === null){
            throw new Error()
        }

        Object.keys(data[valueToIterate].data).forEach(header => {
            let timeObj = new Date(Date.parse(header.slice(0, header.indexOf('+'))));
            finalDataObj.items.push({
                date: timeObj.toDateString() + ' ' + timeObj.getHours() + ':00',
                temp: Math.round(data.temperature2m.data[header]) + ' ' + data.temperature2m.unit,
                rh2m: Math.round(data.rh2m.data[header]) + ' ' + data.rh2m.unit,
                rawData: {
                    temp: Math.round(data.temperature2m.data[header]),
                    rh2m: Math.round(data.rh2m.data[header])         
                }
            })
        })
        return finalDataObj;
    }

    

    getMockAnswer(){
        let mockApiAnswer = {
            "precipitation": {
                "data": {
                    "2021-05-01T00:00:00+0000": 0,
                    "2021-05-01T01:00:00+0000": 0,
                    "2021-05-01T02:00:00+0000": 0,
                    "2021-05-01T03:00:00+0000": 0,
                    "2021-05-01T04:00:00+0000": 0,
                    "2021-05-01T05:00:00+0000": 0,
                    "2021-05-01T06:00:00+0000": 0,
                    "2021-05-01T07:00:00+0000": 0,
                    "2021-05-01T08:00:00+0000": 0,
                    "2021-05-01T09:00:00+0000": 0,
                    "2021-05-01T10:00:00+0000": 0,
                    "2021-05-01T11:00:00+0000": 0,
                    "2021-05-01T12:00:00+0000": 0,
                    "2021-05-01T13:00:00+0000": 0,
                    "2021-05-01T14:00:00+0000": 0,
                    "2021-05-01T15:00:00+0000": 0,
                    "2021-05-01T16:00:00+0000": 0,
                    "2021-05-01T17:00:00+0000": 0,
                    "2021-05-01T18:00:00+0000": 0,
                    "2021-05-01T19:00:00+0000": 0,
                    "2021-05-01T20:00:00+0000": 0
                },
                "unit": "kg/m^2",
                "description": "Total precipitation [kg/m^2]"
            },
            "soilmoisture": {
                "data": {
                    "2021-05-01T00:00:00+0000": 0.46,
                    "2021-05-01T01:00:00+0000": 0.46,
                    "2021-05-01T02:00:00+0000": 0.46,
                    "2021-05-01T03:00:00+0000": 0.46,
                    "2021-05-01T04:00:00+0000": 0.46,
                    "2021-05-01T05:00:00+0000": 0.46,
                    "2021-05-01T06:00:00+0000": 0.46,
                    "2021-05-01T07:00:00+0000": 0.46,
                    "2021-05-01T08:00:00+0000": 0.46,
                    "2021-05-01T09:00:00+0000": 0.46,
                    "2021-05-01T10:00:00+0000": 0.46,
                    "2021-05-01T11:00:00+0000": 0.46,
                    "2021-05-01T12:00:00+0000": 0.46,
                    "2021-05-01T13:00:00+0000": 0.46,
                    "2021-05-01T14:00:00+0000": 0.46,
                    "2021-05-01T15:00:00+0000": 0.46,
                    "2021-05-01T16:00:00+0000": 0.46,
                    "2021-05-01T17:00:00+0000": 0.46,
                    "2021-05-01T18:00:00+0000": 0.46,
                    "2021-05-01T19:00:00+0000": 0.46,
                    "2021-05-01T20:00:00+0000": 0.46,
                    "2021-05-01T21:00:00+0000": 0.46,
                    "2021-05-01T22:00:00+0000": 0.46,
                    "2021-05-01T23:00:00+0000": 0.46
                },
                "unit": "Kg/m^2",
                "description": "Liquid volumetric soil moisture (non-frozen) [Kg/m^2]"
            },
            "hail": {
                "data": [],
                "unit": "-",
                "description": "Hail Event"
            },
            "reference_et": {
                "data": {
                    "2021-05-01T00:00:00+0000": 0,
                    "2021-05-01T01:00:00+0000": 0,
                    "2021-05-01T02:00:00+0000": 0,
                    "2021-05-01T03:00:00+0000": 0,
                    "2021-05-01T04:00:00+0000": 0,
                    "2021-05-01T05:00:00+0000": 0.0828060656785965,
                    "2021-05-01T06:00:00+0000": 0.0717960447072983,
                    "2021-05-01T07:00:00+0000": 0.105272136628628,
                    "2021-05-01T08:00:00+0000": 0.246202811598778,
                    "2021-05-01T09:00:00+0000": 0.287677615880966,
                    "2021-05-01T10:00:00+0000": 0.364356696605682,
                    "2021-05-01T11:00:00+0000": 0.333938926458359,
                    "2021-05-01T12:00:00+0000": 0.213350743055344,
                    "2021-05-01T13:00:00+0000": 0.274296581745148,
                    "2021-05-01T14:00:00+0000": 0.181062966585159,
                    "2021-05-01T15:00:00+0000": 0.239768281579018,
                    "2021-05-01T16:00:00+0000": 0.107756413519382,
                    "2021-05-01T17:00:00+0000": 0.0217056181281805,
                    "2021-05-01T18:00:00+0000": 0.0131656210869551,
                    "2021-05-01T19:00:00+0000": 0,
                    "2021-05-01T20:00:00+0000": 0
                },
                "unit": "mm",
                "description": "FAO56 PM Reference Evapotranspiration"
            },
            "temperature2m_max": {
                "data": {
                    "2021-05-01T00:00:00+0000": 22.7304992675781
                },
                "unit": "C",
                "description": "Temperature [C]"
            },
            "temperature2m": {
                "data": {
                    "2021-05-01T00:00:00+0000": 14.9834375,
                    "2021-05-01T01:00:00+0000": 15.351125,
                    "2021-05-01T02:00:00+0000": 14.944,
                    "2021-05-01T03:00:00+0000": 15.6368125,
                    "2021-05-01T04:00:00+0000": 15.0135625,
                    "2021-05-01T05:00:00+0000": 14.9445625,
                    "2021-05-01T06:00:00+0000": 17.4191875,
                    "2021-05-01T07:00:00+0000": 17.4885625,
                    "2021-05-01T08:00:00+0000": 19.0311875,
                    "2021-05-01T09:00:00+0000": 20.275625,
                    "2021-05-01T10:00:00+0000": 20.997875,
                    "2021-05-01T11:00:00+0000": 22.4970625,
                    "2021-05-01T12:00:00+0000": 22.7305,
                    "2021-05-01T13:00:00+0000": 22.6371875,
                    "2021-05-01T14:00:00+0000": 22.5844375,
                    "2021-05-01T15:00:00+0000": 20.88475,
                    "2021-05-01T16:00:00+0000": 19.8235,
                    "2021-05-01T17:00:00+0000": 19.3495,
                    "2021-05-01T18:00:00+0000": 19.0458125,
                    "2021-05-01T19:00:00+0000": 19.0346875,
                    "2021-05-01T20:00:00+0000": 17.858875,
                    "2021-05-01T21:00:00+0000": 17.293625,
                    "2021-05-01T22:00:00+0000": 16.31925,
                    "2021-05-01T23:00:00+0000": 16.285
                },
                "unit": "C",
                "description": "Temperature [C]"
            },
            "temperature2m_min": {
                "data": {
                    "2021-05-01T00:00:00+0000": 14.9440002441406
                },
                "unit": "C",
                "description": "Temperature [C]"
            },
            "windspeed10m": {
                "data": [],
                "unit": "m/s",
                "description": "Wind speed [m/s]"
            },
            "rh2m": {
                "data": {
                    "2021-05-01T00:00:00+0000": 14.9834375,
                    "2021-05-01T01:00:00+0000": 15.351125,
                    "2021-05-01T02:00:00+0000": 14.944,
                    "2021-05-01T03:00:00+0000": 15.6368125,
                    "2021-05-01T04:00:00+0000": 15.0135625,
                    "2021-05-01T05:00:00+0000": 14.9445625,
                    "2021-05-01T06:00:00+0000": 17.4191875,
                    "2021-05-01T07:00:00+0000": 17.4885625,
                    "2021-05-01T08:00:00+0000": 19.0311875,
                    "2021-05-01T09:00:00+0000": 20.275625,
                    "2021-05-01T10:00:00+0000": 20.997875,
                    "2021-05-01T11:00:00+0000": 22.4970625,
                    "2021-05-01T12:00:00+0000": 22.7305,
                    "2021-05-01T13:00:00+0000": 22.6371875,
                    "2021-05-01T14:00:00+0000": 22.5844375,
                    "2021-05-01T15:00:00+0000": 20.88475,
                    "2021-05-01T16:00:00+0000": 19.8235,
                    "2021-05-01T17:00:00+0000": 19.3495,
                    "2021-05-01T18:00:00+0000": 19.0458125,
                    "2021-05-01T19:00:00+0000": 19.0346875,
                    "2021-05-01T20:00:00+0000": 17.858875,
                    "2021-05-01T21:00:00+0000": 17.293625,
                    "2021-05-01T22:00:00+0000": 16.31925,
                    "2021-05-01T23:00:00+0000": 16.285
                },
                "unit": "%",
                "description": "Relative humidity [%]"
            }
        } 
        let myVariablesAnswer = {
            'temperature2m': mockApiAnswer.temperature2m,
            'rh2m': mockApiAnswer.rh2m
        }
        let result = this.parseWeatherMeteoHourlyResponse(myVariablesAnswer)
        return {
            rawData: myVariablesAnswer,
            dataForViewing: result
        };
    }

}
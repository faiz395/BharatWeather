const apiKey = '5ac37f376a734c6eafc72639240807';
// http://api.weatherapi.com/v1/current.json?key=5ac37f376a734c6eafc72639240807&q=mumbai
// Fix issue in this: http://api.weatherapi.com/v1/history.json?key=5ac37f376a734c6eafc72639240807&q=mumbai
// http://api.weatherapi.com/v1/forecast.json?key=5ac37f376a734c6eafc72639240807&q=mumbai&days=3

let city = 'mumbai';
let reportUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}`
let historyReportUrl = `http://api.weatherapi.com/v1/history.json?key=${apiKey}`
let futureReportUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}`
let sunTiming = `https://api.sunrisesunset.io/json`;

// https://api.sunrisesunset.io/json?lat=18.98&lng=72.83

async function fetchData(urlToFetch) {
  let currResponse = await fetch(urlToFetch)
    .then((response) => {
      // console.log(response);
      return response.json()
    })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
    })

  return currResponse;
}

let homeForm = document.getElementById('homeForm');
let forcastForm = document.getElementById('forecastForm');
let historyForm = document.getElementById('historyForm');
let homeLocationForecast = document.getElementById('homeCurrentForecast');
let futureForecast = document.getElementById('futureForecast');
let historyForecast = document.getElementById('historyForecast');

if (homeForm) {
  homeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // console.log(e);
    let stateval = document.getElementById('stateNameHome').value;
    let urltoFetch = reportUrl + `&q=${stateval}`
    let response = await fetchData(urltoFetch)
    // console.log('latitude is '+response.location.lat+' and longitude is '+response.location.lon);
    let sunUrl = sunTiming + `?lat=${response.location.lat}&lng=${response.location.lon}`
    let sunDetails = await fetchData(sunUrl);
    // console.log('sun details api url '+sunUrl);

    updateHome(response, sunDetails.results);
  }, false)
}

if (forcastForm) {
  forcastForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let stateval = document.getElementById('stateNameForecast').value;
    let urltoFetch = futureReportUrl + `&q=${stateval}&days=3`
    let response = await fetchData(urltoFetch)
    updateForecast(response);
  })
}

if (historyForm) {
  historyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let stateval = document.getElementById('stateNameForecast').value;
    document.getElementById('hourlyHistoryDetail').innerHTML = "";
    // yyyy-MM-dd
    const currentDate = new Date();
    // Get the current date
    let date = currentDate.getDate();
    // Get the current month (January is 0, December is 11)
    let month = currentDate.getMonth() + 1; // Adding 1 to get the 1-based month
    // Get the current year
    let year = currentDate.getFullYear();
    for (let i = 0; i < 7; i++) {

      if (date - 1 <= 0) {
        if (month - 1 <= 0) {
          year--;
          month = 12;
        }
        else {
          month--;
          switch (month) {
            case 1:
              date = 31;
              break;
            case 2:
              date = 28;
              break;
            case 3:
              date = 31;
              break;
            case 4:
              date = 30;
              break;
            case 5:
              date = 31;
              break;
            case 6:
              date = 30;
              break;
            case 7:
              date = 31;
              break;
            case 8:
              date = 31;
              break;
            case 9:
              date = 30;
              break;
            case 10:
              date = 31;
              break;
            case 11:
              date = 30;
              break;
            case 12:
              date = 31;
              break;
            default:
              date = 1;
              break;
          }
        }
      }
      else {
        date--;
      }

      console.log(date + "-" + month + "-" + year);
      console.log(typeof (date + "-" + month + "-" + year));
      let urltoFetch = historyReportUrl + `&q=${stateval}&dt=${year + "-" + month + "-" + date}`
      let response = await fetchData(urltoFetch)
      updateHistory(response);
    }

  })
}

if (homeLocationForecast) {
  homeLocationForecast.addEventListener('click', async (e) => {
    e.preventDefault();
    // let lat = "", long="";
    // 19.0699603 72.8404588
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      console.log(lat, long);
      let urltoFetch = reportUrl + `&q=${lat},${long}`
      let response = await fetchData(urltoFetch)
      // // console.log('latitude is '+response.location.lat+' and longitude is '+response.location.lon);
      let sunUrl = sunTiming + `?lat=${lat}&lng=${long}`
      // let sunUrl = sunTiming + `?lat=${response.location.lat}&lng=${response.location.lon}`
      let sunDetails = await fetchData(sunUrl);
      // // console.log('sun details api url '+sunUrl);
      updateHome(response, sunDetails.results);
    });
    // console.log(lat, long);


  })
}

if (futureForecast) {
  futureForecast.addEventListener('click', async (e) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      console.log(lat, long);
      let urltoFetch = futureReportUrl + `&q=${lat},${long}&days=3`
      let response = await fetchData(urltoFetch)
      updateForecast(response);
    });
  })
}

if (historyForecast) {
  historyForecast.addEventListener('click', async (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      console.log(lat, long);
      document.getElementById('hourlyHistoryDetail').innerHTML = "";
      // yyyy-MM-dd
      const currentDate = new Date();
      // Get the current date
      let date = currentDate.getDate();
      // Get the current month (January is 0, December is 11)
      let month = currentDate.getMonth() + 1; // Adding 1 to get the 1-based month
      // Get the current year
      let year = currentDate.getFullYear();
      for (let i = 0; i < 7; i++) {

        if (date - 1 <= 0) {
          if (month - 1 <= 0) {
            year--;
            month = 12;
          }
          else {
            month--;
            switch (month) {
              case 1:
                date = 31;
                break;
              case 2:
                date = 28;
                break;
              case 3:
                date = 31;
                break;
              case 4:
                date = 30;
                break;
              case 5:
                date = 31;
                break;
              case 6:
                date = 30;
                break;
              case 7:
                date = 31;
                break;
              case 8:
                date = 31;
                break;
              case 9:
                date = 30;
                break;
              case 10:
                date = 31;
                break;
              case 11:
                date = 30;
                break;
              case 12:
                date = 31;
                break;
              default:
                date = 1;
                break;
            }
          }
        }
        else {
          date--;
        }

        console.log(date + "-" + month + "-" + year);
        // console.log(typeof (date + "-" + month + "-" + year));
        let urltoFetch = historyReportUrl + `&q=${lat},${long}&dt=${year + "-" + month + "-" + date}`
        let response = await fetchData(urltoFetch)
        updateHistory(response);
      }
    });
  })
}


function updateHome(val, sunDetails) {
  // console.log("Printing weather value: ")
  // console.log(val);
  // console.log("Printing sun details");
  // console.log(sunDetails);
  // console.log(typeof sunDetails.sunrise);
  let htmlHome = `<div id="city_weather" class="bg-blue-950 text-white p-6 m-4 w-lg max-w-lg">
        <div class="flex align-middle justify-between py-1">
          <h3>${val.location.name} ${val.location.region} ${val.location.country}</h3>
          <!--### commented for displaying current weather on main page###-->
          <div class="weather flex" >
            <span>${val.current.condition.text}</span>

           <img style="height:30px; width:30px;" src="${val.current.condition.icon}" title="">
          </div>
        </div>

        <div class="tempt ">
          <div class="flex py-1">
            <div id="temperature" class="flex" style="width: 90px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-thermometer" viewBox="0 0 16 16">
                  <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                  <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z"/>
                </svg> ${val.current.temp_c}<sup>o</sup>C
            </div>
            <div id="temperature" class="flex py-1" style="width:auto;">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-thermometer" viewBox="0 0 16 16">
                  <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                  <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z"/>
                </svg> Feel Like ${val.current.feelslike_c}<sup>o</sup>C
            </div>
          </div>

          <div id="temperature1" class="flex py-1" style="width: 55%;">
            <i class="fa fa-wind"></i> Wind ${val.current.wind_kph} km/h
          </div>
          <div style="width: 100%;" class="flex py-1">
            <i class="fa fa-clock"></i> Observation time : ${val.current.last_updated} IST
          </div>
          <div class="flex py-1">
            <div style="width: 25%;" class="flex flex-col px-1">
              <span class="font-bold">Sunrise</span> <span class='text-sm'> ${sunDetails.sunrise} (IST)</span>
            </div>
            <div style="width: 25%;" class="flex flex-col px-1">
              <span class="font-bold">Sunset</span> <span class='text-sm'> ${sunDetails.sunset} (IST)</span>
            </div>
            <div style="width: 25%;" class="flex flex-col px-1">
              <span class="font-bold">Dawn</span> <span class='text-sm'>${sunDetails.dawn} (IST)</span> 
            </div>
            <div style="width: 25%;" class="flex flex-col px-1">
              <span class="font-bold">Day Length</span> <span class='text-sm'>${sunDetails.day_length}</span> 
            </div>
          </div>
        </div>

      </div>`
  let target = document.getElementById('weatherDetails').innerHTML = htmlHome;
}

function updateForecast(val) {
  let overAllForecast = `<div id="city_weather" class="bg-blue-950 text-white p-6 m-4 w-lg max-w-lg">
        <div class="flex align-middle justify-between py-1">
          <h3>${val.location.name} ${val.location.region} ${val.location.country}</h3>
          <!--### commented for displaying current weather on main page###-->
          <div class="weather flex" >
            <span>${val.current.condition.text}</span>

           <img style="height:30px; width:30px;" src="${val.current.condition.icon}" title="">
          </div>
        </div>

        <div class="tempt ">
          <div class="flex py-1">
            <div id="temperature" class="flex" style="width: 90px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-thermometer" viewBox="0 0 16 16">
                  <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                  <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z"/>
                </svg> ${val.current.temp_c}<sup>o</sup>C
            </div>
            <div id="temperature" class="flex py-1" style="width:auto;">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-thermometer" viewBox="0 0 16 16">
                  <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                  <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z"/>
                </svg> Feel Like ${val.current.feelslike_c}<sup>o</sup>C
            </div>
          </div>

          <div id="temperature1" class="flex py-1" style="width: 55%;">
            <i class="fa fa-wind"></i> Wind ${val.current.wind_kph} km/h
          </div>
          <div style="width: 100%;" class="flex py-1">
            <i class="fa fa-clock"></i> Observation time : ${val.current.last_updated} IST
          </div>
          <div class="flex py-1">
            <div style="width: 25%;" class="flex flex-col px-1">
              <span class="font-bold">Sunrise</span> <span class='text-sm'> ${val.forecast.forecastday[0].astro.sunrise} (IST)</span>
            </div>
            <div style="width: 25%;" class="flex flex-col px-1">
              <span class="font-bold">Sunset</span> <span class='text-sm'> ${val.forecast.forecastday[0].astro.sunset} (IST)</span>
            </div>
            <div style="width: 25%;" class="flex flex-col px-1">
              <span class="font-bold">Moonrise</span> <span class='text-sm'>${val.forecast.forecastday[0].astro.moonrise} (IST)</span> 
            </div>
            <div style="width: 25%;" class="flex flex-col px-1">
              <span class="font-bold">Moonset</span> <span class='text-sm'>${val.forecast.forecastday[0].astro.moonset}</span> 
            </div>
          </div>
        </div>
      </div>`

  document.getElementById('overallForecastDetails').innerHTML = overAllForecast;

  let threeDaysVal = val.forecast.forecastday;
  let hourlyDetails = document.getElementById('hourlyForecastDetail');
  hourlyDetails.innerHTML = "";
  for (val of threeDaysVal) {
    hourlyDetails.innerHTML += `<div class="max-w-screen-xl mx-auto px-5 bg-white min-h-auto">
                        <div class="grid divide-y divide-neutral-200 max-w-full mx-auto mt-8">
                            <div class="py-5">
                                <details class="group">
                                    <summary
                                        class="flex justify-between items-center font-medium cursor-pointer list-none pt-1 pb-1">
                                        <span>Hourly Details For ${val.date}</span>
                                        <span class="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                                <path d="M6 9l6 6 6-6"></path>
                                            </svg>
                                        </span>
                                    </summary>
                                    <!-- component -->
                                    <div class="container">
                                        <table class=" text-left w-full mt-3">
                                            <thead class="bg-black flex text-white w-full max-sm:text-xs">
                                                <tr class="flex w-full mb-4 mt-4 max-sm:mb-2 max-sm:mt-2">
                                                    <th class="p-2 w-1/6">Time</th>
                                                    <th class="p-2 w-1/6">Condition</th>
                                                    <th class="p-2 w-1/6">Temp <sup>o</sup>C</th>
                                                    <th class="p-2 w-1/6">Feels like</th>
                                                    <th class="p-2 w-1/6">Chance Of Rain</th>
                                                    <th class="p-2 w-1/6">Humidity</th>
                                                </tr>
                                            </thead>
                                            <!-- Remove the nasty inline CSS fixed height on production and replace it with a CSS class — this is just for demonstration purposes! -->
                                            <tbody
                                                class="forecastTable bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full max-sm:text-xs"
                                                style="height: auto;">
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>`
    let tBodyForecast = document.getElementsByClassName('forecastTable');
    let tableForecastLastElement = tBodyForecast[tBodyForecast.length - 1];
    console.log('list of table tag elemenets present ' + tBodyForecast);
    console.log('last element that we will be updating ' + tableForecastLastElement);

    for (valHour of val.hour) {
      tableForecastLastElement.innerHTML += `<tr class="flex w-full mb-4">
                                                      <td class="p-2 w-1/6">${valHour.time}</td>
                                                      <td class="p-2 w-1/6"><img style="height:30px; width:30px;"
                                                              src=${valHour.condition.icon}
                                                              title=""> ${valHour.condition.text}
                                                      </td>
                                                      <td class="p-2 w-1/6">${valHour.temp_c}</td>
                                                      <td class="p-2 w-1/6">${valHour.feelslike_c}</td>
                                                      <td class="p-2 w-1/6">${valHour.chance_of_rain}</td>
                                                      <td class="p-2 w-1/6">${valHour.humidity}</td>
                                                  </tr>`
    }

  }
}

function updateHistory(val) {
  // complete this and finish the work
  let hourlyDetails = document.getElementById('hourlyHistoryDetail');
  let threeDaysVal = val.forecast.forecastday;
  hourlyDetails.innerHTML += `<div class="max-w-screen-xl mx-auto px-5 bg-white min-h-auto">
  <div class="grid divide-y divide-neutral-200 max-w-full mx-auto mt-8">
      <div class="py-5">
          <details class="group">
              <summary
                  class="flex justify-between items-center font-medium cursor-pointer list-none pt-1 pb-1">
                  <span>Hourly Details For ${threeDaysVal[0].date}</span>
                  <span class="transition group-open:rotate-180">
                      <svg fill="none" height="24" shape-rendering="geometricPrecision"
                          stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="1.5" viewBox="0 0 24 24" width="24">
                          <path d="M6 9l6 6 6-6"></path>
                      </svg>
                  </span>
              </summary>
              <!-- component -->
              <div class="container">
                  <table class=" text-left w-full mt-3">
                      <thead class="bg-black flex text-white w-full max-sm:text-xs">
                          <tr class="flex w-full mb-4 mt-4 max-sm:mb-2 max-sm:mt-2">
                              <th class="p-2 w-1/6">Time</th>
                              <th class="p-2 w-1/6">Condition</th>
                              <th class="p-2 w-1/6">Temp <sup>o</sup>C</th>
                              <th class="p-2 w-1/6">Feels like</th>
                              <th class="p-2 w-1/6">Chance Of Rain</th>
                              <th class="p-2 w-1/6">Humidity</th>
                          </tr>
                      </thead>
                      <!-- Remove the nasty inline CSS fixed height on production and replace it with a CSS class — this is just for demonstration purposes! -->
                      <tbody
                          class="forecastTable bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full max-sm:text-xs"
                          style="height: auto;">
                      </tbody>
                  </table>
              </div>
          </details>
      </div>
  </div>
</div>`
  let tBodyForecast = document.getElementsByClassName('forecastTable');
  let tableForecastLastElement = tBodyForecast[tBodyForecast.length - 1];
  // console.log('list of table tag elemenets present ' + tBodyForecast);
  // console.log('last element that we will be updating ' + tableForecastLastElement);
  console.log(val);
  console.log(val.hour);
  for (valHour of threeDaysVal[0].hour) {
    tableForecastLastElement.innerHTML += `<tr class="flex w-full mb-4">
                                <td class="p-2 w-1/6">${valHour.time}</td>
                                <td class="p-2 w-1/6"><img style="height:30px; width:30px;"
                                        src=${valHour.condition.icon}
                                        title=""> ${valHour.condition.text}
                                </td>
                                <td class="p-2 w-1/6">${valHour.temp_c}</td>
                                <td class="p-2 w-1/6">${valHour.feelslike_c}</td>
                                <td class="p-2 w-1/6">${valHour.chance_of_rain}</td>
                                <td class="p-2 w-1/6">${valHour.humidity}</td>
                            </tr>`
  }

}


// let val = {
//     "location": {
//         "name": "Mumbai",
//         "region": "Maharashtra",
//         "country": "India",
//         "lat": 18.98,
//         "lon": 72.83,
//         "tz_id": "Asia/Kolkata",
//         "localtime_epoch": 1720435465,
//         "localtime": "2024-07-08 16:14"
//     },
//     "current": {
//         "last_updated_epoch": 1720434600,
//         "last_updated": "2024-07-08 16:00",
//         "temp_c": 27.1,
//         "temp_f": 80.8,
//         "is_day": 1,
//         "condition": {
//             "text": "Torrential rain shower",
//             "icon": "//cdn.weatherapi.com/weather/64x64/day/359.png",
//             "code": 1246
//         },
//         "wind_mph": 5.6,
//         "wind_kph": 9,
//         "wind_degree": 100,
//         "wind_dir": "E",
//         "pressure_mb": 1001,
//         "pressure_in": 29.56,
//         "precip_mm": 0.15,
//         "precip_in": 0.01,
//         "humidity": 100,
//         "cloud": 100,
//         "feelslike_c": 30.3,
//         "feelslike_f": 86.5,
//         "windchill_c": 28.6,
//         "windchill_f": 83.5,
//         "heatindex_c": 33.5,
//         "heatindex_f": 92.3,
//         "dewpoint_c": 24.5,
//         "dewpoint_f": 76.1,
//         "vis_km": 1.5,
//         "vis_miles": 0,
//         "uv": 6,
//         "gust_mph": 17.4,
//         "gust_kph": 28
//     }
// }



// sample html widget
{/* <div id="city_weather" class="bg-blue-950 text-white p-6 m-4 w-lg max-w-lg">
<div class="flex align-middle justify-between">
  <h3>New Delhi</h3>
  <!--### commented for displaying current weather on main page###-->
  <div class="weather flex" >
    <span>Haze</span>
    <i class="qi-502" title="Haze"></i>
    <img style="height:30px; width:30px;" src="//cdn.weatherapi.com/weather/64x64/day/359.png" title="">
  </div>
</div>

<div class="tempt">
  <div class="flex ">
    <div id="temperature" class="flex" style="width: 90px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-thermometer" viewBox="0 0 16 16">
        <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
        <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z"/>
      </svg>31.2<sup>o</sup>C
    </div>
    <div id="temperature" class="flex"style="width:auto;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-thermometer" viewBox="0 0 16 16">
        <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
        <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z"/>
      </svg> Feel Like 37.2<sup>o</sup>C
    </div>
  </div>

  <div id="temperature1" class="flex" style="width: 55%;">
    <i class="fa fa-wind"></i> Northeasterly 14.8 km/h
  </div>
  <div style="width: 100%;" class="flex">
    <i class="fa fa-clock"></i> Observation time : 2024-07-08 11.30 IST
  </div>
  <div class="flex">
    <div style="width: 25%;" class="flex flex-col">
      <span class="font-bold">Sunrise</span> <span class='text-sm'>05:30 (IST)</span> 
    </div>
    <div style="width: 25%;" class="flex flex-col">
      <span class="font-bold">Sunset</span> 19:23 (IST)
    </div>
    <div style="width: 25%;" class="flex flex-col">
      <span class="font-bold">Moonrise</span> 07:28 (IST)
    </div>
    <div style="width: 25%;" class="flex flex-col">
      <span class="font-bold">Moonset</span> 21:25 (IST)
    </div>
  </div>
</div>

</div> */}

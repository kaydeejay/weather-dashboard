$(document).ready(function(){

    var apiKey = "7fa09e46f60ddbd49aa136e8c0cd30a4";
    var searchForm = $(".city-search");
    var searchedCities = [];

    $(searchForm).submit(addCity);

    function getCityData(city){
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: weatherURL,
            method: "GET"
          }).then(function(response){
            var cityID = response.id;
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;

            $(".city-title").text(city);
            $("#cityTemp").text(Math.round((response.main.temp - 273.15)*1.8 + 32) + String.fromCharCode(176) + "F");
            $("#cityHumid").text(response.main.humidity + "%");
            $("#cityWind").text(response.wind.speed + "mph");

            // call fiveDay function
            getFiveDay(cityID);
            // call UV Index function
            getUV(latitude, longitude);
          });
        
    }

    function getUV(lat, lon){
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
        
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response){
            $("#cityUV").text(response.value);
        });
    }

    function getFiveDay(cityID){
        var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey;

        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function(response){
            var fiveDayDates = [];
            var fiveDayIcons = [];
            var fiveDayTemps = [];
            var fiveDayHumid = [];
            for (var i = 2; i <= 34; i += 8){
                fiveDayDates.push(response.list[i].dt_txt);
                fiveDayIcons.push(response.list[i].weather[0].main);
                fiveDayTemps.push(response.list[i].main.temp);
                fiveDayHumid.push(response.list[i].main.humidity);
            }
            
        });
    }
    
    function addCity(){
        event.preventDefault();

        var cityList = $(".list-group");
        var newCity = $("#cityName").val();
        var newCityEl = $("<li>");

        if (searchedCities.indexOf(newCity) === -1){
            searchedCities.push(newCity);
            $(newCityEl).attr("class", "list-group-item");
            $(newCityEl).text(newCity);
            $(cityList).prepend(newCityEl);
            $("#cityName").val("");
            getCityData(newCity);
        }
        
    }
});
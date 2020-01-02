$(document).ready(function(){

    var weatherKey = "7fa09e46f60ddbd49aa136e8c0cd30a4";
    var weatherCityName = "New York";
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + weatherCityName + "&appid=" + weatherKey;
    var searchForm = $(".city-search");

    $(searchForm).submit(addCity);

    function addCity(){
        event.preventDefault();
        var cityList = $(".list-group");
        var newCity = $("#cityName").val();
        var newCityEl = $("<li>");

        $(newCityEl).attr("class", "list-group-item");
        $(newCityEl).text(newCity);
        $(cityList).prepend(newCityEl);

        $("#cityName").val("");
    }
});
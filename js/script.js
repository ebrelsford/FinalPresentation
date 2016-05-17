var map = L.map('map').setView([40.82   ,-96.68], 4);

// set a tile layer to be CartoDB tiles 
var MapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/czirkel/cio0p3is40010aingpsulead4/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3ppcmtlbCIsImEiOiJjaW45ajM1eGQwMGJvdmdrdmlpcHdqNmFtIn0.mJ3V4g-gZpUP9MarrEjrkQ',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(MapboxTiles);
// Ask CartoDB for the music festivals camping true layer, as GeoJSON

var camping = $.getJSON('https://clzirkel.cartodb.com/api/v2/sql?q=SELECT * FROM musicfestivals_1 WHERE camping IN (true)&format=GeoJSON')
  
    // When it's done, add the results to the map
    .done(function (data) {
      
         L.geoJson(data, {
        //
        // Create circles instead of standard markers
        //
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },

        //
        // Use an object to style the circle markers.
        //
        // If you wanted to, you could make this a function
        // that takes the feature and returns a style specific
        // to that feature.
        //
        
        style: {
          fillColor: '#ffffff',
          fillOpacity: 0.5,
          radius: 8,
          stroke: false
        }
      }).addTo(map);   
    });
//legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')

        div.innerHTML +=
        '<b>Music Genre*</b><br />' +
        '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg1"/></svg><span>Alternative</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg2"/></svg><span>Bluegrass</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg3"/></svg><span>Country</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg4"/></svg><span>EDM</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg5"/></svg><span>Folk</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg6"/></svg><span>Hip Hop</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg7"/></svg><span>Indie</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg8"/></svg><span>Jazz</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg9"/></svg><span>Rock</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg10"/></svg><span>Top 40</span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg11"/></svg><span>Other</span><br />' +
            '<span>*<b>Larger</b> dots represent <p><b>higher</b> ticket prices.</p><p> <a href= "https://www.musicfestivalwizard.com">Source 1</a></p><p> <a href= "https://www.fest300.com/">Source 2</a></p></span><br />' +
            '<svg class="left" width="22" height="18"><circle cx="10" cy="9" r="8" class="legendSvg12"/></svg><span>Camping Available</span><br />';
            //'<svg class="left" width="22" height="18"><path d = "m 2 2 L 18 2 L 10 16 L 2 2" class="legendSvg"/></svg><span>Triangles denote unknown discharge volume.</span><br /><br />' + 
;
    return div;
};

legend.addTo(map);



// set data layer as global variable so we can use it in the layer control below
var musicgeoJSON;

// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function

//$.getJSON( "data/musicfestivals.geojson", function( data ) {
$.getJSON( "https://clzirkel.cartodb.com/api/v2/sql?q=SELECT * FROM musicfestivals_1", function( data ) {
    var musicCount = data;
// draw the dataset on the map

    console.log(musicCount);

    //style
    //
    var musicCountPointToLayer = function (feature, latlng){

        console.log(feature.properties.genre);
        var value = feature.properties.genre;
        var fillColor = null;
        if (value == "Alternative"){
            fillColor = "#66ffc2";
        } else if (value == "Bluegrass"){
            fillColor = "#66d9ff";
        } else if (value == "Country"){
            fillColor = "#ffb366";
        } else if (value == "EDM"){
            fillColor = "#ff3385";   
        } else if (value == "Folk"){
            fillColor = "#b3ff66";
        } else if (value == "Hip Hop"){
            fillColor = "#ffbf00";
        } else if (value == "Indie"){
            fillColor = "#6666ff";
        } else if (value == "Jazz"){
            fillColor = "#cc99ff";
        } else if (value == "Rock"){
            fillColor = "#339966";
        } else if (value == "Top 40"){
            fillColor = "#ff0000";
        } else if (value == "Retreat"){
            fillColor = "#999999";
        }

//set the radius of the point based off how expensive the festival is
        var musicCountMarker = L.circleMarker(latlng, {
            weight: 1,
            opacity: 0.1 ,
            color: 'white',
            fillOpacity: 0.75 ,
            fillColor: fillColor,
            radius: radius(feature.properties.full_festival_ticket_price)
        });

        return musicCountMarker; 
    }

    var musicCountClick = function (feature, layer) {
        var genre = feature.properties.musicfestivals;
                    var template = $('#template').html(); 
            var output = Mustache.render(template, feature.properties);
            layer.bindPopup(output)

        //bind to pop up
        //up case and lower case MATTERS
        //layer.bindPopup("<strong>Festival Name:</strong>" + " " + feature.properties.festival_name + "<br /><strong>Genre:</strong> " + feature.properties.genre + "<br /><strong>Location: </strong>" + feature.properties.city + "," + " " + feature.properties.state + "<br /><strong>Approximate Ticket Price: </strong>" + " " + "$" + feature.properties.full_festival_ticket_price);
    }

    musicCountGeoJSON = L.geoJson(musicCount, {
        pointToLayer: musicCountPointToLayer,
        onEachFeature: musicCountClick
    }).addTo(map);


});


function radius(d) {
    console.log(d);
    return d > 1000 ? 30 :
           d > 500  ? 25 :
           d > 250  ? 20  :
           d > 125  ? 15  :
           d > 75   ? 10  :
                      5 ;
}
// Set option value in constructor
// Set date option

//$("#slider").dateRangeSlider();
$("#slider").dateRangeSlider({
  //"option",
  bounds: {
  
    min: new Date(2016, 0, 1),
    max: new Date(2016, 11, 31)},  
});

$("#slider").bind("valuesChanged", function(e, data){
    var sql = "SELECT * FROM musicfestivals_1 WHERE start_date > '" + data.values.min.toISOString() + "' AND end_date < '" + data.values.max.toISOString() + "'";
    var url = 'https://clzirkel.cartodb.com/api/v2/sql?' + $.param({
        q: sql,
        format: 'GeoJSON'
    });

    $.getJSON(url)

    .done(function (data) {
        dataLayer.clearLayers();
        dataLayer.addData(data);
    });
    console.log(data)
  console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
});


function createLayerControls(){
    // add in layer controls
    var baseMaps = {
        "Mapbox Basemap": MapboxTiles,
    };

    var overlayMaps = {
        "Music Festivals": musicgeoJSON,
        "Camping": camping,
    };

    // add control
    L.control.layers(baseMaps, overlayMaps, camping).addTo(map);
    
};
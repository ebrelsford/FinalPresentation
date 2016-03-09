// This script shows a simple leaflet map and simple d3 chart with some interactions

var map = L.map('map').setView([40.81,-96.68], 4 );

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);

//legend
var legend = L.control({position: 'topright'});

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
            '<span>*<b>Larger</b> dots represent <b>larger</b> higher ticket prices.</span><br />';
            //'<svg class="left" width="22" height="18"><path d = "m 2 2 L 18 2 L 10 16 L 2 2" class="legendSvg"/></svg><span>Triangles denote unknown discharge volume.</span><br /><br />' + 
;
    return div;
};

legend.addTo(map);



// set data layer as global variable so we can use it in the layer control below
var musicgeoJSON;

// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function

$.getJSON( "data/musicfestivals.geojson", function( data ) {
    
    var musicCount = data;
// draw the dataset on the map

    console.log(musicCount);

    //style
    var musicCountPointToLayer = function (feature, latlng){
        var musicCountMarker = L.circleMarker(latlng, 20000, {
          
        });

        return musicCountMarker; 
    }

    var genreStyle = function (feature){
        var value = feature.properties.musicfestivals.genre;
        var fillColor = null;
        if (value == "Top 40"){
            fillColor = "#fee5d9";

        } else if (value == "EDM"){
            fillColor = "#fcbba1";

        } else if (value == "Alternative"){
            fillColor = "#fc9272";
        } else if (value == "Indie"){
            fillColor = "#fb6a4a";
        }

        var style = {
            weight: 1 ,
            poacity: .1 ,
            color: 'white' ,
            fillOpacity: 0.75 ,
            fillColor: fillColor
        };

        return style;
    }

    var musicCountClick = function (feature, layer) {
        var genre = feature.properties.musicfestivals;

        //bind to pop up
        //up case and lower case MATTERS
        layer.bindPopup("<strong>Festival Name</strong>" + feature.properties.festival_name + "<br /><strong>Genre:</strong>" + feature.properties.genre + "<br /><strong>Location:</strong>" + feature.properties.city + "," + " " + feature.properties.state + "<br /><strong>Approximate Ticket Price:</strong>" + " " + "$" + feature.properties.full_festival_ticket_price);
    }

    musicCountGeoJSON = L.geoJson(musicCount, {
        pointToLayer: musicCountPointToLayer,
        onEachFeature: musicCountClick
    }).addTo(map);


});


function createLayerControls(){
    // add in layer controls
    var baseMaps = {
        "CartoDB Basemap": CartoDBTiles,
    };

    var overlayMaps = {
        "Music Festivals": musicgeoJSON,
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    
};

/*// adding in new data with leaflet.omnivore
omnivore.csv('data/musicfestivals.csv').addTo(map);

// lets add these data with some styling base on two data attributes 
// and have a popup show up on hovering instead of clicking

// lets set up some global functions for setting styles for the dots
// we'll use these again in the legend

function fillColor(d) {
    return d > 500000 ? '#006d2c' :
           d > 250000 ? '#31a354' :
           d > 100000 ? '#74c476' :
           d > 50000  ? '#a1d99b' :
           d > 10000  ? '#c7e9c0' :
                        '#edf8e9';
}
function radius(d) {
    return d > 9000 ? 20 :
           d > 7000 ? 12 :
           d > 5000 ? 8  :
           d > 3000 ? 6  :
           d > 1000 ? 4  :
                      2 ;
}
// first we need to define how we would like the layer styled
var checkCashingStyle = function (feature, latlng){
    //console.log(feature.properties.address);
    var checkCashingMarker = L.circleMarker(latlng, {
        stroke: false,
        fillColor: fillColor(feature.properties.amount),
        fillOpacity: 1,
        radius: radius(feature.properties.customers)
    });
    
    return checkCashingMarker;
    
}
var checkCashingInteraction = function(feature,layer){    
    var highlight = {
        stroke: true,
        color: '#ffffff', 
        weight: 3,
        opacity: 1,
    };
    var clickHighlight = {
        stroke: true,
        color: '#f0ff00', 
        weight: 3,
        opacity: 1,
    };
    var noHighlight = {
        stroke: false,
    };
    
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(e) {
        //highlight point
        layer.setStyle(highlight);
        // ensure that the dot is moved to the front
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        
    });
        
    layer.on('mouseout', function(e) {
        // reset style
        layer.setStyle(noHighlight); 
                        
    });
    
    // on click 
    layer.on("click",function(e){
        // bind popup and open on the map
        layer.bindPopup('<div class="popupStyle"><h3>' + feature.properties.name + '</h3><p>'+ feature.properties.address + '<br /><strong>Amount:</strong> $' + feature.properties.amount + '<br /><strong>Customers:</strong> ' + feature.properties.customers + '</p></div>').openPopup();
        // set new style for clicked point
        layer.setStyle(clickHighlight); 
    });
    
    
}
// next, we'll create a shell L.geoJson for omnivore to use to apply styling and interaction
var checkCashingCustomStuff = L.geoJson(null, {
    pointToLayer: checkCashingStyle,
    onEachFeature: checkCashingInteraction
});
// lastly, we'll call omnivore to grab the CSV and apply the styling and interaction
var checkCashingLayer = omnivore.csv('data/musicfestivals.csv', null, checkCashingCustomStuff).addTo(map);

*/
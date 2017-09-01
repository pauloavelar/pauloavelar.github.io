var MapManager = (function() {

  var mMap;
  var mMarkerCluster;

  var IconTemplate = L.Icon.extend({
    options: {
      iconSize: [30, 30],
      iconAnchor: [15, 29],
      popupAnchor: [0, -32]
    }
  });

  var fnInit = function(map) {
    mMap = L.map('map').setView([-15, -55], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(mMap);
  }

  var fnLoad = function(options) {
    // gets contents from FileLoader
    var csv = FileLoader.getCsvContents();
    if (!csv || !Array.isArray(csv)) return;

    // prepare all marker icons
    var counter = 0;
    var markers = {};

    for (var i = 1, len = csv.length; i < len; i++) {
      if (!fnTestFilters(csv[i], options.filters)) continue;

      var row = csv[i];
      var marker1 = row[options.markerFields[0]];
      var marker2 = row[options.markerFields[1]];

      // 1st level - outer prop
      if (!marker1) marker1 = Strings.blankField;
      if (!markers.hasOwnProperty(marker1)) {
        markers[marker1] = {};
      }
      // 2nd level - inner prop
      if (!marker2) marker2 = Strings.blankField;
      if (!markers[marker1].hasOwnProperty(marker2)) {
        markers[marker1][marker2] = { index: counter++ };
      }
    }

    // creating color palette and custom classes
    Utils.iterate2D(markers, function(item, outerProp, innerProp) {
      // setting marker icon values
      item.hueRotation = item.index / counter * 360 - 10;
      item.cssClass = 'marker-icon-' + item.index;
      item.addedToLegend = false;
      // injecting CSS into the DOM
      var css = {};
      var filter = 'hue-rotate(' + item.hueRotation + 'deg)';
      css['.' + item.cssClass] = {
        'filter': filter, '-webkit-filter': filter, '-moz-filter': filter
      };
      $.injectCSS(css);
      // creating the icon instance
      item.icon = new IconTemplate({
        iconUrl: 'img/marker.png', className: item.cssClass
      });
    });

    fnAddLegendItems(markers);

    // iterates the whole csv, except headers
    if (mMarkerCluster) mMap.removeLayer(mMarkerCluster);
    mMarkerCluster = L.markerClusterGroup();
    for (var i = 1, len = csv.length; i < len; i++) {
      // check filters, if failed then go to next row
      if (!fnTestFilters(csv[i], options.filters)) continue;

      var row = csv[i];
      var blank = Strings.blankField;
      var marker1 = row[options.markerFields[0]];
      var marker2 = row[options.markerFields[1]];

      fnAddMarker({
        latitude: row[FileLoader.getFieldId(Utils.coordinates.LATITUDE)],
        longitude: row[FileLoader.getFieldId(Utils.coordinates.LONGITUDE)],
        popupText: fnCreatePopupText(csv[0], row),
        marker: markers[marker1 || blank][marker2 || blank]
      });
    }
    mMap.addLayer(mMarkerCluster);
  };

  var fnCreatePopupText = function(headers, row) {
    var $container = $('<p>');
    for (var i = 0, len = row.length; i < len; i++) {
      $container
        .append($('<strong>').html(headers[i] + ': '))
        .append(row[i]).append('<br />');
    }
    var lat = row[FileLoader.getFieldId(Utils.coordinates.LATITUDE)];
    var lon = row[FileLoader.getFieldId(Utils.coordinates.LONGITUDE)];
    $container.append(
      $('<a>')
        .attr('href', 'http://maps.apple.com/?q=' + lat + ',' + lon)
        .attr('target', '_blank').append(Strings.navigate)
    );
    return $container[0];
  };

  var fnAddLegendItems = function(markers) {
    Utils.iterate2D(markers, function(item, outerProp, innerProp) {
      if (innerProp == Strings.blankField &&
          Object.keys(markers[outerProp]).length <= 1) {
        View.addLegendItem(item, outerProp);
      } else {
        View.addLegendItem(item, outerProp, innerProp);
      }
    });
    View.showLegend(true);
  };

  var fnTestFilters = function(row, filters) {
    for (var i = 0, len = filters.length; i < len; i++) {
      var field  = filters[i].field;
      var accept = filters[i].accept;

      if (accept.indexOf(row[field]) == -1) return false;
    }
    return true;
  };

  var fnAddMarker = function(options) {
    var marker = L.marker([options.latitude, options.longitude], {
      icon: options.marker.icon
    }); //.addTo(mMap);
    mMarkerCluster.addLayer(marker);
    marker.bindPopup(options.popupText);
  };

  return {
    init: fnInit,
    load: fnLoad,
    addMarker: fnAddMarker
  };

})();

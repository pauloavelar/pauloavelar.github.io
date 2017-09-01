var Utils = (function() {

  var DATABASE_PATH = 'db/database.csv';

  var coordinates = Object.freeze({
    LATITUDE: 'LAT',
    LONGITUDE: 'LON'
  });

  var unfilterableFields = Object.freeze([
    coordinates.LATITUDE, coordinates.LONGITUDE
  ]);

  var mSelectors = Object.freeze({
    navBar: {
      btnChangeFilters: '#btn-change-filters'
    },
    loading: '#loading',
    filtersModal: {
      main: '#filters-modal',
      filtersWrapper: '#filters',
      btnLoadMap: '#btn-modal-load',
      btnCancel: '#btn-modal-cancel',
      progressPanel: '#panel-progress'
    },
    filterPanel: {
      main: '#filters div.panel',
      bodies: '#filters .content-top > div.panel-body',
      title: '.panel-title a',
      heading: '.panel-heading',
      content: '.content-top',
      body: '.panel-body',
      select: 'select.main-select'
    },
    markerFields: {
      sel1: '#marker-select-1',
      sel2: '#marker-select-2'
    },
    legend: {
      main: '#legend',
      header: '#legend div.panel-heading',
      body: '#legend div.panel-body',
      itemIcon: 'img.legend-icon',
      expander: '#legend #expander'
    },
    errors: {
      panel: '#error-panel',
      message: '#error-message'
    }
  });

  var fnIsFilterable = function(fieldName) {
    return unfilterableFields.indexOf(fieldName) == -1;
  };

  var fnGetPercent = function(value, min, max) {
    if (!min && !max) return 0;
    if (!min) min = 0;
    if (!max) max = 0;
    if (!value) value = 0;

    if (min == max) return 0.2;

    if (min > max) {
      var aux = max;
      max = min;
      min = aux;
    }

    return (value - min) / (max - min);
  };

  var fnIterate2D = function(array2D, fn) {
    if (typeof fn != 'function') return;

    for (var oProp in array2D) {
      if (!array2D.hasOwnProperty(oProp)) continue;

      for (var iProp in array2D[oProp]) {
        if (!array2D[oProp].hasOwnProperty(iProp)) continue;

        if (fn(array2D[oProp][iProp], oProp, iProp) === false) return;
      }
    }
  };

  // list all properties of an object until nth level
  // obj.prop = level 0; obj.prop.prop = level 1; and so on
  var fnGetAllProps = function(obj, deepestLevel, currentLevel) {
    var props = [];
    if (!currentLevel) currentLevel = 0;

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        props.push(prop);
        if (currentLevel < deepestLevel) {
          if (typeof obj[prop] == 'object')
            props = props.concat(fnGetAllProps(obj, deepestLevel, currentLevel + 1));
        }
      }
    }

    return props;
  };

  var fnMakeUniqueArray = function(array) {
    if (!Array.isArray(array)) return array;

    var uniqueArray = [];
    array.forEach(function(item) {
      if (uniqueArray.indexOf(item) == -1) uniqueArray.push(item);
    });
    return uniqueArray;
  }

  var fnIsNumberArray = function(array) {
    if (!array || !Array.isArray(array)) return false;

    var result = true;
    array.forEach(function(item) {
      if (!item || isNaN(item)) {
        result = false;
        return;
      }
    });
    return result;
  };

  var fnCompareNumbers = function(a, b) {
    // NaN controls
    if (isNaN(a) && isNaN(b)) return 0;
    if (isNaN(a)) return -1; // a comes first
    if (isNaN(b)) return  1; // b comes first

    // Number comparisons
    var numA = parseFloat(a), numB = parseFloat(b);
    if (numA == numB) return 0;
    return (numA < numB ? -1 : 1);
  };

  return {
    DATABASE_PATH: DATABASE_PATH,
    coordinates: coordinates,
    selectors: mSelectors,
    iterate2D: fnIterate2D,
    getAllProperties: fnGetAllProps,
    makeUniqueArray: fnMakeUniqueArray,
    isNumberArray: fnIsNumberArray,
    compareNumbers: fnCompareNumbers,
    getPercent: fnGetPercent,
    isFilterable: fnIsFilterable
  };

})();

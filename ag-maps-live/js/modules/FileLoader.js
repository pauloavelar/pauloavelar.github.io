var FileLoader = (function() {

  /* --- Enums --- */
  var ErrorCode = Object.freeze({
    NO_ERROR: 100, FILE_TOO_BIG: 101, TOO_MANY_LINES: 102, PARSING_ERROR: 103
  });

  /* --- Private properties --- */
  var mCsv = [];

  /* --- Publicly visible functions --- */

  // checks if a file is valid
  var fnGetCsvContents = function() {
    return mCsv;
  }

  var fnShowError = function(errorCode) {
    switch (errorCode) {
      case ErrorCode.PARSING_ERROR:
        View.showError(Strings.parsingError);
        break;
      case ErrorCode.FILE_TOO_BIG:
        View.showError(Strings.fileTooBig);
        break;
      case ErrorCode.TOO_MANY_LINES:
        View.showError(Strings.tooManyLines);
        break;
      default:
        View.showError();
    }
  };

  var fnLoadDatabase = function(file) {
    mCsv = [];
    Papa.parse(Utils.DATABASE_PATH, {
      download: true,
      // encoding: 'CP1250', // default MS Excel encoding
      step: function(results, parser) {
        if (results.errors.length > 0) {
          fnShowError(ErrorCode.PARSING_ERROR);
          parser.abort();
        }
        mCsv.push(results.data[0]);
      },
      complete: function(results) {
        View.hideProgress();
        fnLoadFilters();
      },
      error: function(err) {
        fnShowError(ErrorCode.PARSING_ERROR);
      }
    });
  };

  var fnLoadFilters = function() {
    for (var i = 0, len = mCsv[0].length; i < len; i++) {
      if (mCsv[0][i] && Utils.isFilterable(mCsv[0][i])) {
        View.addFilterPanel(i, mCsv[0][i], i, len);
        View.addMarkerField(i, mCsv[0][i]);
      }
    }
    View.showMarkerFields();
  };

  var fnGetFieldId = function(fieldName) {
    if (!mCsv || !mCsv[0]) return;
    return mCsv[0].indexOf(fieldName);
  };

  var fnGetFilterItems = function(itemId) {
    if (!Array.isArray(mCsv) || !mCsv[0]) return [];

    var item, items = [];

    for (var i = 1, len = mCsv.length; i < len; i++) {
      item = mCsv[i][itemId];
      if (item && items.indexOf(item) == -1) {
        items.push(item); // pushes only unique and defined items
      }
    }
    var isNumeric = Utils.isNumberArray(items);
    return items.sort(isNumeric ? Utils.compareNumbers : undefined);
  };

  return {
    loadDatabase: fnLoadDatabase,
    getFilterItems: fnGetFilterItems,
    getCsvContents: fnGetCsvContents,
    getFieldId: fnGetFieldId
  };

})();

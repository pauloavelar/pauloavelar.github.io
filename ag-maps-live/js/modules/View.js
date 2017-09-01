var View = (function() {

  /* --- Private variables --- */

  // View init state control flag
  var hasInitBeenCalled = false;

  // jQuery selectors
  var selectors;

  /* --- Module functions --- */

  // Must be called whenever the page is created
  var fnInit = function() {
    if (hasInitBeenCalled) return;
    // creates selectors reference
    selectors = Utils.selectors;
    // creates the backdrop modal (by default an uncloseable one)
    $(selectors.filtersModal.main).modal({
      show: false, backdrop: 'static', keyboard: false
    });
    // registers DOM listeners for static elements
    $(selectors.navBar.btnChangeFilters).on('click', fnOpenFiltersModal);
    $(selectors.filtersModal.btnLoadMap).on('click', fnClickLoadMap);
    $(selectors.legend.header).on('click', fnToggleLegend);
    // hides the loading div
    $(selectors.loading).fadeOut();
    // loads the CSV database
    FileLoader.loadDatabase();
    // sets up Leaflet maps
    MapManager.init();
    // shows the modal with a half-second delay
    window.setTimeout(fnOpenFiltersModal, 500, {firstTime: true});
    // updates the flag to avoid double binding
    hasInitBeenCalled = true;
  };

  var fnToggleLegend = function($event) {
    // var $body = $(selectors.legend.body);
    // var visible = !$body.hasClass('hidden');
    //
    // if (visible) {
    //   $body.addClass('hidden');
    //   $(selectors.legend.expander).removeClass('glyphicon-chevron-up');
    //   $(selectors.legend.expander).addClass('glyphicon-chevron-down');
    // } else {
    //   $body.removeClass('hidden');
    // }
    $(selectors.legend.body).toggleClass('hidden');
    $(selectors.legend.expander)
      .toggleClass('glyphicon-chevron-up')
      .toggleClass('glyphicon-chevron-down');
  };

  // parses the interface to get map options
  var fnClickLoadMap = function($event) {
    if ($($event.target).hasClass('disabled')) return;

    $(selectors.filtersModal.btnLoadMap).addClass('disabled');
    fnShowError();

    var mapOptions = fnPrepareMapOptions();
    if (mapOptions) {
      MapManager.load(mapOptions);
      fnHideFiltersModal();
    }
  };

  var fnOpenFiltersModal = function(options) {
    var $filtersModal = $(selectors.filtersModal.main);
    var $modalData = $filtersModal.data('bs.modal');

    if (options.firstTime === true) {
      // hides the cancel button
      $filtersModal.find(selectors.filtersModal.btnCancel).hide();
      $modalData.options.backdrop = 'static';
      $modalData.options.keyboard = false;
    } else {
      // default: shows the cancel button, allows backdrop and kbd escaping
      $filtersModal.find(selectors.filtersModal.btnCancel).show();
      $modalData.options.backdrop = true;
      $modalData.options.keyboard = true;
    }

    $modalData.escape(); // apparently necessary to update the data
    $filtersModal.modal('show'); // opens the modal itself
    $(selectors.filtersModal.btnLoadMap).removeClass('disabled');
    fnClearLegend();
  };

  var fnHideFiltersModal = function() {
    $(selectors.filtersModal.main).modal('hide');
  };

  var fnShowError = function(message) {
    var $panel = $(selectors.errors.panel);
    if (message) {
      $panel.removeClass('hidden');
      $(selectors.errors.message).html(message);
      // sets the modal to a position where error is visible
      $(selectors.filtersModal.main).scrollTo($panel, {
        easing: 'swing', duration: 200, offset: -10
      });
    } else {
      $panel.addClass('hidden');
    }
  };

  var fnClearFilters = function() {
    $(selectors.legend.main).addClass('hidden');
    $(selectors.legend.body).html('');
    $(selectors.filtersModal.filtersWrapper).html('');
  };

  var fnAddLegendItem = function(item, title, subtitle) {
    var $legendItem = LegendItemFactory.create(item, title, subtitle);
    $(selectors.legend.body).append($legendItem);
  };

  var fnClearLegend = function() {
    $(selectors.legend.body).html('');
  };

  var fnAddFilterPanel = function(itemId, itemName, sequenceId, totalItems) {
    var $wrapper = $(selectors.filtersModal.filtersWrapper);
    var items = FileLoader.getFilterItems(itemId);
    var $row = FilterPanelFactory.create(itemId, itemName, sequenceId, items);
    $(selectors.filtersModal.btnLoadMap).removeClass('disabled');
    $wrapper.append($row);
    $row.find(selectors.filterPanel.select).select2({
      minimumResultsForSearch: 10
    });
  };

  var fnShowLegend = function(visible) {
    var $legend = $(selectors.legend.main);
    var hidden = $legend.hasClass('hidden');

    if (visible && hidden) $legend.removeClass('hidden');
    else if (!visible && !hidden) $legend.addClass('hidden');
  };

  var fnAddMarkerField = function(fieldId, fieldName) {
    $(selectors.markerFields.sel1).append(
      $('<option>').attr('value', fieldId).append(fieldName)
    );
    $(selectors.markerFields.sel2).append(
      $('<option>').attr('value', fieldId).append(fieldName)
    );
  };

  var fnConfigureMarkerFields = function() {
    $(selectors.markerFields.sel1).select2({minimumResultsForSearch:Infinity});
    $(selectors.markerFields.sel2).select2({minimumResultsForSearch:Infinity});
  };

  var fnHideProgress = function() {
    $(selectors.filtersModal.progressPanel).addClass('hidden');
  }

  var fnPrepareMapOptions = function() {
    var mapOptions = { markerFields: [], filters: [] };
    var anyError = false;

    // marker fields
    if ($(selectors.markerFields.sel1).val() != '(NONE)')
      mapOptions.markerFields.push($(selectors.markerFields.sel1).val());
    if ($(selectors.markerFields.sel2).val() != '(NONE)')
      mapOptions.markerFields.push($(selectors.markerFields.sel2).val());

    // filters
    $(selectors.filterPanel.main).each(function(index) {
      var $filter = $(this);
      var values = $filter.find(selectors.filterPanel.select).val();
      if (values && values.length > 0) {
        mapOptions.filters.push({ field: $filter.data('id'), accept: values });
      }
    });

    return mapOptions;
  };

  /* --- Publicly visible module props --- */
  return {
    init: fnInit,
    openFiltersModal: fnOpenFiltersModal,
    hideFiltersModal: fnHideFiltersModal,
    showError: fnShowError,
    hideProgress: fnHideProgress,
    clearHeaders: fnClearFilters,
    addFilterPanel: fnAddFilterPanel,
    addMarkerField: fnAddMarkerField,
    showMarkerFields: fnConfigureMarkerFields,
    addLegendItem: fnAddLegendItem,
    showLegend: fnShowLegend
  };

})();

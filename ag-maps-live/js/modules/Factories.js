var FilterPanelFactory = (function() {

  var mTemplate;

  // Format:
  // <div class="panel panel-default">
  //   <div class="panel-heading" role="tab" id="headingOne">
  //     <h4 class="panel-title">
  //       <a role="button" data-toggle="collapse" data-parent="#filters"
  //          href="#collapseOne" aria-controls="collapseOne">
  //         Filter by:
  //       </a>
  //     </h4>
  //   </div>
  //   <div id="collapseOne" class="panel-collapse collapse"
  //        role="tabpanel" aria-labelledby="headingOne">
  //     <div class="panel-body"></div>
  //   </div>
  // </div>

  var fnCreateTemplate = function() {
    if (mTemplate) return;

    mTemplate = $('<div>').addClass('panel panel-default');
    mTemplate.append(
      $('<div>').addClass('panel-heading').attr('role', 'tab').append(
        $('<h4>').addClass('panel-title').append(
          $('<a>') // missing: href, aria-controls
            .attr('role', 'button').attr('data-toggle', 'collapse')
            .attr('data-parent', '#filters')
        )
      )
    );
    mTemplate.append(
      $('<div>') // missing: ID, aria-labelledby
        .addClass('content-top panel-collapse collapse')
        .attr('role', 'tabpanel').append(
          $('<div>').addClass('panel-body').append(
            $('<select>').attr('multiple', 'multiple').addClass('main-select')
          )
        )
    );
  };

  var fnCreate = function(itemId, fieldName, sequenceId, data) {
    if (!mTemplate) fnCreateTemplate();

    var sels = Utils.selectors.filterPanel;
    var $instance = mTemplate.clone();
    $instance.data('id', itemId);
    $instance.find(sels.heading)
      .attr('id', 'heading'  + sequenceId);
    $instance.find(sels.content)
      .attr('id', 'collapse' + sequenceId)
      .attr('aria-labelledby', 'heading' + sequenceId);
    $instance.find(sels.title).html(Strings.filterBy + fieldName)
      .attr('href', '#collapse' + sequenceId)
      .attr('aria-controls', 'collapse' + sequenceId);

    var blankAdded = false;
    if (data) {
      var $select = $instance.find(sels.select);
      for (var i = 0, len = data.length; i < len; i++) {
        if (!data[i] && !blankAdded) {
          blankAdded = true;
          $select.append($('<option>').attr('value', '').append(Strings.blank));
        } else {
          $select.append($('<option>').attr('value', data[i]).append(data[i]));
        }
      }
    }

    return $instance;
  };

  return {
    create: fnCreate
  };

})();

var LegendItemFactory = (function() {

  var mTemplate;

  // Format:
  // <div class="vert-align">
  //   <img class="legend-icon" src="img/marker.png"> itemName
  // </div>

  var fnCreateTemplate = function() {
    if (mTemplate) return;

    mTemplate = $('<div>').addClass('vert-align').append(
      $('<img>').addClass('legend-icon').attr('src', 'img/marker.png')
    );
  };

  var fnCreate = function(item, title, subtitle) {
    if (!mTemplate) fnCreateTemplate();

    var $instance = mTemplate.clone();
    $instance.append(title);
    if (subtitle) $instance.append(' - ' + subtitle);
    $instance.find(Utils.selectors.legend.itemIcon).addClass(item.cssClass);

    return $instance;
  };

  return {
    create: fnCreate
  };

})();

var MarkerSelectorFactory = (function() {

  var mTemplate;

  var fnCreateTemplate = function() {
    if (mTemplate) return;

    mTemplate = $('<span>') // span neeeded because select2 needs a parent
      .append($('<select>')
        .addClass('form-control')
        .css('width', '100%') // inline CSS because of select2
      );
  };

  var fnCreate = function(items) {
    if (!mTemplate) fnCreateTemplate();

    var itemDisplay;
    var $instance = mTemplate.clone();
    var $select = $instance.find(Utils.selectors.filtersModal);
    var isNumeric = Utils.isNumberArray(items);
    items.forEach(function(item) {
      itemDisplay = (isNumeric ? $.number(item, 2) : item);
      $select.append($('<option>').val(item).append(itemDisplay));
    });
    $select.select2({ placeholder: Strings.showOnly });

    return $instance;
  };

  return {
    create: fnCreate
  };

})();

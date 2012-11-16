;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;
    $.fn.placeholder                ? $('input, textarea').placeholder() : null;
  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

  var $message = $("#message");
  var showMessage = function(msg, state_class) {
    $message.removeClass('success alert secondary');
    $message.html(msg).addClass(state_class);
  };

  // Method to transform the json input to input elements
  var jsonToEditor = function() {
    var source_json = $("#source_text").val();
    var target_json = $("#target_text").val();

    try {
      source_json = JSON.parse(source_json);
    }
    catch(e) {
      return showMessage('Invalid "source" JSON: <em>' + e.message + '</em> <small>(' + e.type + ')</small>', 'alert');
    }
    try {
      target_json = JSON.parse(target_json);
    }
    catch(e) {
      if(target_json === '') {
        target_json = null;
      }
      else {
        return showMessage('Invalid "target" JSON: <em>' + e.message + '</em> <small>(' + e.type + ')</small>', 'alert');
      }
    }

    var results_source = recursiveJsonTreeParser(source_json, '');
    var results_target = recursiveJsonTreeParser(target_json, '');

    // clear table
    $("#editorTab table tbody").html('');

    for(var key in results_source) {
      var dot_name = key.replace(/\[/g, '.').replace(/\]/g, '');
      var row = $("<tr />").appendTo("#editorTab table tbody");
      var key_column = $("<td />").appendTo(row);
      var source_column = $("<td />").appendTo(row);
      var target_column = $("<td />").appendTo(row);

      key_column.html('<label class="right">'+dot_name+'</label>');
      $("<input type='text' />")
        .prop('name', key)
        .val(results_source[key])
        .addClass('source')
        .appendTo(source_column);

      var target_input = $("<input type='text' />")
        .prop('name', key)
        .addClass('target')
        .appendTo(target_column);

      if (results_target[key] !== 'undefined'){
        target_input.val(results_target[key]).appendTo(target_column);
      }
    }
    showMessage('JSON converted to input fields', 'success');
    $(".editor_tab a").trigger('click.fndtn');
  };

  // Recursively walk through the json to create key value pars
  var recursiveJsonTreeParser = function(node, parent_string) {
    var result = [];
    for(var elm in node) {
      if(typeof(node[elm]) === "object") {
        if(parent_string === '') {
          $.extend(result, recursiveJsonTreeParser(node[elm], elm));
        }
        else {
          $.extend(result, recursiveJsonTreeParser(node[elm], parent_string +'['+elm+']'));
        }
      }
      else {
        if(parent_string === '') {
          result[elm] = node[elm];
        }
        else {
          result[parent_string + '[' + elm + ']'] = node[elm];
        }
      }
    }
    return result;
  };

  // Transform input fields to json based on there name
  var editorToJson = function() {
    var source_json = $("input.source").toJSON();
    var target_json = $("input.target").toJSON();

    $("#source_text").val(JSON.stringify(source_json, null, 2));
    $("#target_text").val(JSON.stringify(target_json, null, 2));

    showMessage('Input fields converted to JSON', 'success');
  };

  // Trigger converting inputs to json
  $("#editor_to_json").on("click", function(e) {
    e.preventDefault();
    editorToJson();
    $(".source_tab a").trigger('click.fndtn');
  });

  // Trigger converting json to inputs
  $("#json_to_editor").on("click", function(e) {
    e.preventDefault();
    jsonToEditor();
  });

  // Highlight current row
  $("#editorTab table tbody tr input").live('focus', function() {
    $(this).parents('tr:first').addClass('focus');
  }).live('blur', function() {
    $(this).parents('tr:first').removeClass('focus');
  });

  // Prettify JSON
  $(".prettify").on("click", function(e) {
    e.preventDefault();
    var $elm = $($(this).data('target'));
    try {
      $elm.val(JSON.stringify(JSON.parse($elm.val()), null, 2));
      showMessage('JSON prettified', 'success');
    }
    catch(e) {
      showMessage('Unable to parse JSON: <em>' + e.message + '</em> <small>(' + e.type + ')</small>', 'alert');
    }
  });

})(jQuery, this);

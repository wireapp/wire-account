window.initForms = function() {
  $('form').submit(function(event) {
    $button = $(this).find('button:submit');
    $button.prop('disabled', true);
    $button.text($button.data('loading-text'));
  });
};

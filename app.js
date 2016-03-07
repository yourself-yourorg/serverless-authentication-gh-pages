'use strict';

$(function(){
  $('.providers button').on('click', function(event){
    var provider = $(event.target).attr('id');
    window.location.href = 'https://i3tswjv8ak.execute-api.eu-west-1.amazonaws.com/dev/signin/' + provider;
  });
  var query = getQueryParams(document.location.search);
  var token = query.token?query.token:'';
  $('#token').html(token);
  localStorage.setItem('token', token);

  $('.testers #test').on('click', function() {
     $.ajax({
       method: 'GET',
       url: 'https://i3tswjv8ak.execute-api.eu-west-1.amazonaws.com/dev/test-token/?ts='+ (new Date()).getTime(),
       headers: { Authorization: localStorage.getItem('token') }
     })
      .done(function(data) {
        $('#test-result').html(JSON.stringify(data));
      })
      .fail(function(error) {
        $('#test-result').html(JSON.stringify(error));
      });
  });
});

function getQueryParams(qs) {
  qs = qs.split('+').join(' ');
  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}


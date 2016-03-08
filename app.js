'use strict';

var endpoint = 'https://i3tswjv8ak.execute-api.eu-west-1.amazonaws.com/dev';

function testToken() {
  $('#test-result').html('Loading...');
  $.ajax({
      method: 'GET',
      url: endpoint + '/test-token',
      headers: {Authorization: localStorage.getItem('token')}
    })
    .done(function (data) {
      $('#test-result').html(JSON.stringify(data));
    })
    .fail(function (error) {
      $('#test-result').html('Unauthorized');
    });
}

function getPathFromUrl(url) {
  return url.split(/[?#]/)[0];
}

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

$(function () {
  $('.providers button').on('click', function (event) {
    var provider = $(event.target).attr('id');
    window.location.href = endpoint + '/signin/' + provider;
  });

  $('#logout').on('click', function(event) {
    localStorage.removeItem('token');
    window.location.href = getPathFromUrl(window.location.href);
  });

  var query = getQueryParams(document.location.search);
  var token = query.token ? query.token : '';
  $('#token').html(token);
  localStorage.setItem('token', token);

  testToken();

  $('.testers #test').on('click', testToken);
});


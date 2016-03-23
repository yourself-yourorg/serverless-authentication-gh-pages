'use strict';

var endpoint = 'https://ijgrniyi74.execute-api.eu-west-1.amazonaws.com/dev';

function testToken() {
  $('#test-result').html('Loading...');

  // set token to Authorization header
  $.ajax({
      method: 'GET',
      url: endpoint + '/test-token',
      headers: {
        Authorization: localStorage.getItem('token')
      }
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
    var provider = $(event.currentTarget).attr('id');
    $('#token').html('Loading...');
    $('#test-result').html('Loading...');
    window.location.href = endpoint + '/authentication/signin/' + provider;
  });

  $('#logout').on('click', function(event) {
    localStorage.removeItem('token');
    window.location.href = getPathFromUrl(window.location.href);
  });

  var query = getQueryParams(document.location.search);
  var token = query.token ? query.token : '';
  $('#token').html(token);

  // Save token to local storage for later use
  localStorage.setItem('token', token);

  // trigger test token
  testToken();

  $('.testers #test').on('click', testToken);
});


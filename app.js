'use strict';

var endpoint = 'https://xg5mkc5ci8.execute-api.us-west-2.amazonaws.com/prod';

function testToken() {
  $('#test-result').html('Loading...');

  // set token to Authorization header
  $.ajax({
      method: 'GET',
      url: endpoint + '/test-token',
      headers: {
        Authorization: localStorage.getItem('authorization_token')
      }
    })
    .done(function (data) {
      $('#test-result').html(JSON.stringify(data));
    })
    .fail(function (error) {
      if($('#auto-refresh').prop('checked')) {
        $('#test-result').html('Refreshing token...');
        refreshToken();
      } else {
        $('#test-result').html('Unauthorized');
      }
    });
}

function refreshToken() {
  $('#test-result').html('Loading...');

  // refresh token
  $.ajax({
      method: 'GET',
      url: endpoint + '/authentication/refresh?refresh_token=' + localStorage.getItem('refresh_token') + '&id=' + localStorage.getItem('id')
    })
    .done(function (data) {
      console.log(data.errorMessage);
      if (data.errorMessage) {
        $('#test-result').html(data.errorMessage);
      } else {
        saveResponse(data.authorization_token, data.refresh_token, data.id);
        testToken();
      }
    })
    .fail(function (error) {
      $('#test-result').html('Unauthorized');
    });
}

function saveResponse(authorization_token, refresh_token, id) {
  $('#token').html('authorization_token:'+authorization_token+'<hr>refresh_token:'+refresh_token+'<hr>id:'+id);
  // Save token to local storage for later use
  localStorage.setItem('authorization_token', authorization_token);
  localStorage.setItem('refresh_token', refresh_token);
  localStorage.setItem('id', id);
}

/*
 headers: {
  Authorization: localStorage.getItem('refresh')
 }
 */
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
    localStorage.removeItem('authorization_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id');
    window.location.href = getPathFromUrl(window.location.href);
  });

  var query = getQueryParams(document.location.search);
  saveResponse(query.authorization_token, query.refresh_token, query.id);

  // trigger test token
  testToken();

  $('.testers #test').on('click', testToken);
  $('.testers #refresh').on('click', refreshToken);

});

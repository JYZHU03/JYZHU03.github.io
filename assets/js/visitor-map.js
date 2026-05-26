(function () {
  function project(lon, lat) {
    var clampedLat = Math.max(-80, Math.min(83, Number(lat)));
    var clampedLon = Math.max(-180, Math.min(180, Number(lon)));

    return {
      x: 30 + ((clampedLon + 180) / 360) * 900,
      y: 20 + ((83 - clampedLat) / 163) * 390
    };
  }

  function showCurrentPin(svg, data) {
    var pin = document.getElementById('visitor-map-current-pin');
    var title = document.getElementById('visitor-map-current-title');

    if (!pin || !Number.isFinite(Number(data.latitude)) || !Number.isFinite(Number(data.longitude))) {
      return;
    }

    var point = project(data.longitude, data.latitude);
    var location = [data.city, data.country_name].filter(Boolean).join(', ');

    pin.setAttribute('transform', 'translate(' + point.x.toFixed(1) + ', ' + point.y.toFixed(1) + ')');
    pin.setAttribute('aria-hidden', 'false');
    pin.classList.add('is-visible');

    if (title) {
      title.textContent = location ? 'Your approximate location: ' + location : 'Your approximate location';
    }
  }

  function initVisitorMap() {
    var svg = document.querySelector('.visitor-map__canvas[data-current-location-enabled="true"]');
    if (!svg || !window.fetch) {
      return;
    }

    var endpoint = svg.getAttribute('data-current-location-endpoint') || 'https://ipapi.co/json/';

    fetch(endpoint, { credentials: 'omit', cache: 'force-cache' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('IP location request failed');
        }
        return response.json();
      })
      .then(function (data) {
        showCurrentPin(svg, data);
      })
      .catch(function () {
        // Keep the map useful even when the third-party IP lookup is unavailable.
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisitorMap);
  } else {
    initVisitorMap();
  }
}());

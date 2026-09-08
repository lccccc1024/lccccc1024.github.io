(function () {
  var log = document.getElementById('map-log')
  if (!log) {
    log = document.createElement('pre')
    log.id = 'map-log'
    log.style.cssText = 'padding:8px;margin:8px 0;background:#f5f5f5;border-radius:6px;font-size:12px;white-space:pre-wrap;display:none'
    var mapEl = document.getElementById('map')
    if (mapEl && mapEl.parentNode) mapEl.parentNode.insertBefore(log, mapEl.nextSibling)
  }
  function out(msg) { log.textContent += msg + '\n'; log.style.display = 'block' }

  out('AMap: ' + typeof AMap)
  out('__PLACES__: ' + (window.__PLACES__ ? window.__PLACES__.length + ' items' : 'undefined'))

  if (typeof AMap === 'undefined') {
    out('SKIP: AMap not loaded')
    return
  }

  var mapEl = document.getElementById('map')
  if (!mapEl) {
    out('SKIP: #map not found')
    return
  }

  try {
    var map = new AMap.Map('map', {
      zoom: 4,
      center: [104.1954, 35.8617],
      viewMode: '2D'
    })
    out('Map created')
    out('Map zoom: ' + map.getZoom())

    var places = window.__PLACES__ || []
    places.forEach(function (p) {
      var m = new AMap.Marker({ position: [p.lng, p.lat], title: p.name })
      m.on('click', function () {
        new AMap.InfoWindow({
          content: '<b>' + p.name + '</b><br>' + p.date + (p.note ? '<br>' + p.note : ''),
          offset: new AMap.Pixel(0, -20)
        }).open(map, m.getPosition())
      })
      map.add(m)
    })
    out('Markers: ' + places.length)

    if (places.length > 0) {
      map.setFitView(null, false, [60, 60, 60, 60])
      out('FitView done')
    }

    var darkMode = document.documentElement.classList.contains('dark')
    var observer = new MutationObserver(function () {
      var d = document.documentElement.classList.contains('dark')
      if (d !== darkMode) {
        darkMode = d
        map.setMapStyle(d ? 'amap://styles/dark' : 'amap://styles/normal')
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    window.addEventListener('astro:before-swap', function () {
      observer.disconnect()
      map.destroy()
    })

    out('DONE - map should be visible')
  } catch (e) {
    out('ERROR: ' + e.message)
  }
})()

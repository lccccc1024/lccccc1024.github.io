(function () {
  if (typeof AMap === 'undefined') return

  var mapEl = document.getElementById('map')
  if (!mapEl) return

  var places = window.__PLACES__ || []

  var map = new AMap.Map('map', {
    zoom: 4,
    center: [104.1954, 35.8617],
    viewMode: '2D',
    mapStyle: 'amap://styles/normal'
  })

  places.forEach(function (p) {
    var marker = new AMap.Marker({
      position: [p.lng, p.lat],
      title: p.name,
      animation: 'AMAP_ANIMATION_DROP'
    })

    var info = new AMap.InfoWindow({
      content:
        '<div style="padding:4px 2px;line-height:1.6;font-size:14px">' +
        '<b>' + p.name + '</b><br>' +
        p.date +
        (p.note ? '<br><span style="opacity:.7">' + p.note + '</span>' : '') +
        '</div>',
      offset: new AMap.Pixel(0, -20)
    })

    marker.on('click', function () {
      info.open(map, marker.getPosition())
    })

    map.add(marker)
  })

  if (places.length > 0) {
    map.setFitView(null, false, [60, 60, 60, 60])
  }

  var darkMode = document.documentElement.classList.contains('dark')

  var observer = new MutationObserver(function () {
    var nowDark = document.documentElement.classList.contains('dark')
    if (nowDark !== darkMode) {
      darkMode = nowDark
      map.setMapStyle(darkMode ? 'amap://styles/dark' : 'amap://styles/normal')
    }
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  window.addEventListener('astro:before-swap', function () {
    observer.disconnect()
    map.destroy()
  })
})()

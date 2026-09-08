(function () {
  if (typeof AMap === 'undefined') return

  var mapEl = document.getElementById('map')
  if (!mapEl) return

  var places = window.__PLACES__ || []

  var map = new AMap.Map('map', {
    zoom: 4,
    center: [104.1954, 35.8617]
  })

  places.forEach(function (p) {
    var marker = new AMap.Marker({
      position: [p.lng, p.lat],
      title: p.name
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

    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar({ position: 'RT' }))
    map.add(marker)
  })

  if (places.length > 0) {
    map.setFitView()
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
})()

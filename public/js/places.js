(function () {
  if (typeof L === 'undefined') return

  const mapEl = document.getElementById('map')
  if (!mapEl) return

  const places = window.__PLACES__ || []

  const map = L.map('map', { zoomControl: true, scrollWheelZoom: true }).setView([35.8617, 104.1954], 4)

  const lightLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
    subdomains: '1234',
    attribution: '&copy; <a href="https://amap.com">高德地图</a>',
    maxZoom: 18
  })

  const darkLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    subdomains: '1234',
    attribution: '&copy; <a href="https://amap.com">高德地图</a>',
    maxZoom: 18
  })

  function isDark() {
    return document.documentElement.classList.contains('dark')
  }

  function updateLayer() {
    if (isDark()) {
      if (map.hasLayer(lightLayer)) map.removeLayer(lightLayer)
      if (!map.hasLayer(darkLayer)) darkLayer.addTo(map)
    } else {
      if (map.hasLayer(darkLayer)) map.removeLayer(darkLayer)
      if (!map.hasLayer(lightLayer)) lightLayer.addTo(map)
    }
  }

  updateLayer()

  const markerIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-dot"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  })

  const markers = []
  places.forEach(function (p) {
    const marker = L.marker([p.lat, p.lng], { icon: markerIcon }).addTo(map)
    const popup = '<b>' + p.name + '</b><br>' + p.date + (p.note ? '<br><span style="opacity:.7">' + p.note + '</span>' : '')
    marker.bindPopup(popup)
    markers.push(marker)
  })

  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.15))
  }

  const observer = new MutationObserver(function () {
    updateLayer()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  window.addEventListener('astro:before-swap', function () {
    observer.disconnect()
    map.remove()
  })
})()

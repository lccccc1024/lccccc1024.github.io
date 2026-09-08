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

  // Diagnostic: check map DOM after a delay
  setTimeout(function () {
    var log = document.createElement('pre')
    log.style.cssText = 'padding:8px;margin:8px 0;background:#fff3cd;border:1px solid #ffc107;border-radius:6px;font-size:11px;white-space:pre-wrap;max-height:300px;overflow:auto'
    var info = ''

    // Check #map computed style
    var cs = window.getComputedStyle(mapEl)
    info += '#map: ' + cs.width + ' x ' + cs.height + ', overflow:' + cs.overflow + ', visibility:' + cs.visibility + ', display:' + cs.display + '\n'

    // Check AMap container
    var amapContainer = mapEl.querySelector('.amap-container')
    if (amapContainer) {
      var acs = window.getComputedStyle(amapContainer)
      info += '.amap-container: ' + acs.width + ' x ' + acs.height + ', overflow:' + acs.overflow + '\n'
    } else {
      info += '.amap-container: NOT FOUND\n'
    }

    // Check tile images
    var tiles = mapEl.querySelectorAll('img')
    info += 'IMG elements: ' + tiles.length + '\n'
    if (tiles.length > 0) {
      for (var i = 0; i < Math.min(3, tiles.length); i++) {
        var t = tiles[i]
        info += '  tile[' + i + ']: ' + t.className + ' | ' + t.width + 'x' + t.height + ' | src: ' + (t.src || '').substring(0, 100) + '\n'
      }
    }

    // Check for canvas
    var canvases = mapEl.querySelectorAll('canvas')
    info += 'CANVAS elements: ' + canvases.length + '\n'

    // Check all divs with position:absolute inside map
    var absDivs = mapEl.querySelectorAll('div')
    var tilePane = mapEl.querySelector('[class*="tile"]') || mapEl.querySelector('[class*="layer"]')
    if (tilePane) {
      info += 'Tile pane found: ' + tilePane.className + ', children:' + tilePane.children.length + '\n'
    }

    // Check for any elements with opacity:0 or visibility:hidden
    var allEls = mapEl.querySelectorAll('*')
    var hiddenCount = 0
    for (var j = 0; j < allEls.length; j++) {
      var elCS = window.getComputedStyle(allEls[j])
      if (elCS.visibility === 'hidden' || elCS.opacity === '0' || elCS.display === 'none') {
        hiddenCount++
      }
    }
    info += 'Hidden/zero-opacity elements: ' + hiddenCount + ' / ' + allEls.length + '\n'

    // Check parent chain for overflow:hidden
    var parent = mapEl.parentElement
    while (parent && parent !== document.body) {
      var pcs = window.getComputedStyle(parent)
      if (pcs.overflow === 'hidden' || pcs.overflowX === 'hidden' || pcs.overflowY === 'hidden') {
        info += 'Parent overflow:hidden: ' + parent.tagName + '.' + parent.className.substring(0, 40) + '\n'
      }
      parent = parent.parentElement
    }

    log.textContent = info
    mapEl.parentNode.insertBefore(log, mapEl.nextSibling)
  }, 3000)

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

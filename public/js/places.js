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

  setTimeout(function () {
    var log = document.createElement('pre')
    log.style.cssText = 'padding:8px;margin:8px 0;background:#fff3cd;border:1px solid #ffc107;border-radius:6px;font-size:11px;white-space:pre-wrap;max-height:400px;overflow:auto'
    var info = ''

    // Canvas details
    var canvas = mapEl.querySelector('canvas')
    if (canvas) {
      var ccs = window.getComputedStyle(canvas)
      info += 'canvas: ' + canvas.width + 'x' + canvas.height + ' (attr)\n'
      info += 'canvas computed: ' + ccs.width + ' x ' + ccs.height + '\n'
      info += 'canvas position: ' + ccs.position + ', top:' + ccs.top + ', left:' + ccs.left + '\n'
      info += 'canvas z-index: ' + ccs.zIndex + ', opacity:' + ccs.opacity + '\n'
      info += 'canvas visibility: ' + ccs.visibility + ', display:' + ccs.display + '\n'
      info += 'canvas transform: ' + ccs.transform + '\n'
      // Check parent of canvas
      var cp = canvas.parentElement
      if (cp) {
        var cpcs = window.getComputedStyle(cp)
        info += 'canvas parent: ' + cp.tagName + '.' + cp.className.substring(0,50) + '\n'
        info += '  size: ' + cpcs.width + ' x ' + cpcs.height + ', overflow:' + cpcs.overflow + '\n'
      }
    } else {
      info += 'canvas: NOT FOUND\n'
    }

    // All layers div
    var layers = mapEl.querySelector('.amap-layers')
    if (layers) {
      info += '\n.amap-layers children:\n'
      for (var i = 0; i < layers.children.length; i++) {
        var child = layers.children[i]
        var ccs2 = window.getComputedStyle(child)
        info += '  [' + i + '] ' + child.tagName + '.' + child.className.substring(0,40) + ' | ' + ccs2.width + 'x' + ccs2.height + ' | vis:' + ccs2.visibility + ' | display:' + ccs2.display + '\n'
      }
    }

    // Full DOM tree of map (first 3 levels)
    info += '\nDOM tree (3 levels):\n'
    function tree(el, depth, max) {
      if (depth > max) return ''
      var prefix = '  '.repeat(depth)
      var cs3 = window.getComputedStyle(el)
      var result = prefix + el.tagName + (el.className ? '.' + String(el.className).substring(0,30) : '') + ' [' + cs3.width + 'x' + cs3.height + ']\n'
      for (var k = 0; k < el.children.length && k < 10; k++) {
        result += tree(el.children[k], depth + 1, max)
      }
      return result
    }
    info += tree(mapEl, 0, 3)

    // #map overflow check
    var mapCS = window.getComputedStyle(mapEl)
    info += '\n#map overflow: ' + mapCS.overflow + ', overflowX:' + mapCS.overflowX + ', overflowY:' + mapCS.overflowY + '\n'

    log.textContent = info
    mapEl.parentNode.insertBefore(log, mapEl.nextSibling)
  }, 3000)

  places.forEach(function (p) {
    var marker = new AMap.Marker({
      position: [p.lng, p.lat],
      title: p.name,
      animation: 'AMAP_ANIMATION_DROP'
    })
    var infoWin = new AMap.InfoWindow({
      content: '<div style="padding:4px 2px;line-height:1.6;font-size:14px"><b>' + p.name + '</b><br>' + p.date + (p.note ? '<br><span style="opacity:.7">' + p.note + '</span>' : '') + '</div>',
      offset: new AMap.Pixel(0, -20)
    })
    marker.on('click', function () { infoWin.open(map, marker.getPosition()) })
    map.add(marker)
  })

  if (places.length > 0) map.setFitView(null, false, [60, 60, 60, 60])

  var darkMode = document.documentElement.classList.contains('dark')
  var observer = new MutationObserver(function () {
    var d = document.documentElement.classList.contains('dark')
    if (d !== darkMode) { darkMode = d; map.setMapStyle(d ? 'amap://styles/dark' : 'amap://styles/normal') }
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  window.addEventListener('astro:before-swap', function () { observer.disconnect(); map.destroy() })
})()

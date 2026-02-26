---
layout: default
title: 想要的东西
permalink: /want/   # 或 /2025/07/01/想要的东西/，自定义路径
---
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>想要的东西</title>
  <link rel="icon" type="image/png" href="/lccccc1024.png">
  <style>
    .title {
      text-align: center;
      font-size: 24px;
      margin: 20px 0 10px;
    }
    table {
      border-collapse: collapse;
      width: 85%;
      margin: auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(60, 72, 88, 0.08);
      margin-bottom: 20px;
    }
    th {
      background: #3b82f6;
      color: #fff;
      font-weight: 700;
      padding: 12px 10px;
      text-align: left;
    }
    th:first-child, td:first-child {
      text-align: center;
    }
    td {
      padding: 12px 10px;
      color: #374151;
      font-size: 0.98rem;
      border: none;
    }
    tr:nth-child(even) {
      background-color: #f3f6fa;
    }
    tr:hover {
      background: #e0e7ef;
      transition: background 0.2s;
    }
    .strike td,
    .strike td * {
      text-decoration: line-through;
      color: #888;
    }
    .totals {
      width: 85%;
      margin: auto;
      background: #f1f5f9;
      border-radius: 12px;
      padding: 18px;
      font-size: 1.1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      color: #2d3748;
      line-height: 2;
    }
  </style>
</head>
<body>

<h1 class="title">想要的东西</h1>

<table id="wishlist">
  <thead>
    <tr>
      <th>#</th>
      <th>商品名</th>
      <th>价格</th>
      <th>链接</th>
      <th>购买时间</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>房子</td>
      <td>1200000</td>
      <td>N/A</td>
      <td></td>
    </tr>
    <tr>
      <td>2</td>
      <td>Dji neo</td>
      <td>1299</td>
      <td><a href="https://item.jd.com/100134198972.html" target="_blank">京东</a></td>
      <td></td>
    </tr>
    <tr>
      <td>3</td>
      <td>喜德盛ad300公路自行车</td>
      <td>0</td>
      <td>老婆送的</td>
      <td>2025-05</td>
    </tr>
    <tr>
      <td>4</td>
      <td>ikf v11 pro电竞耳机</td>
      <td>168.31</td>
      <td><a href="https://item.jd.com/100137893545.html" target="_blank">京东</a></td>
      <td>2025-07</td>
    </tr>
    <tr>
      <td>5</td>
      <td>米家方框尼龙偏光太阳镜</td>
      <td>199</td>
      <td>N/A</td>
      <td></td>
    </tr>
    <tr>
      <td>6</td>
      <td>尼康Z30+16-50套机</td>
      <td>4595.08</td>
      <td><a href="https://mobile.yangkeduo.com/goods1.html?ps=uCg3Bg7zf0" target="_blank">拼多多</a></td>
      <td>2025-11</td>
    </tr>
    <tr>
      <td>7</td>
      <td>尼克尔 Z DX 50-250mm f/4.5-6.3 VR</td>
      <td>0</td>
      <td>老婆送的</td>
      <td>2026-01</td>
    </tr>
  </tbody>
</table>

<div class="totals">
  ✅ 已购总价：<span id="bought-total">0.00</span> 元<br>
  🛒 未购总价：<span id="unbought-total">0.00</span> 元
</div>

<script>
  const tbody = document.querySelector("#wishlist tbody");
  const boughtEl = document.getElementById("bought-total");
  const unboughtEl = document.getElementById("unbought-total");

  function updateTotalsAndStyle() {
    let bought = 0, unbought = 0;

    tbody.querySelectorAll("tr").forEach(tr => {
      const price = parseFloat(tr.children[2].textContent.trim()) || 0;
      const time = tr.children[4].textContent.trim();
      if (time) {
        tr.classList.add("strike");
        bought += price;
      } else {
        tr.classList.remove("strike");
        unbought += price;
      }
    });

    boughtEl.textContent = bought.toFixed(2);
    unboughtEl.textContent = unbought.toFixed(2);
  }

  updateTotalsAndStyle();
</script>

</body>
</html>

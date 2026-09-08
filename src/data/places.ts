export interface Place {
  name: string
  lat: number
  lng: number
  date: string
  category: string
  note?: string
}

const data: Place[] = [
  {
    name: "北京",
    lat: 39.9042,
    lng: 116.4074,
    date: "2023-10-01",
    category: "旅游",
    note: "天安门、故宫、长城"
  },
  {
    name: "上海",
    lat: 31.2304,
    lng: 121.4737,
    date: "2024-05-15",
    category: "旅游",
    note: "外滩、迪士尼"
  },
  {
    name: "成都",
    lat: 30.5728,
    lng: 104.0668,
    date: "2024-08-20",
    category: "旅游",
    note: "大熊猫基地、宽窄巷子"
  },
  {
    name: "杭州",
    lat: 30.2741,
    lng: 120.1551,
    date: "2025-04-05",
    category: "旅游",
    note: "西湖、灵隐寺"
  },
  {
    name: "西安",
    lat: 34.3416,
    lng: 108.9398,
    date: "2025-10-03",
    category: "旅游",
    note: "兵马俑、城墙"
  },
  {
    name: "广州",
    lat: 23.1291,
    lng: 113.2644,
    date: "2026-01-18",
    category: "探亲",
    note: "早茶、沙面"
  },
  {
    name: "重庆",
    lat: 29.4316,
    lng: 106.9123,
    date: "2026-07-12",
    category: "旅游",
    note: "洪崖洞、磁器口"
  }
]

export default data

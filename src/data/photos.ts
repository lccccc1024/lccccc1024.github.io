export interface Photo {
  title: string;
  src: string;
  category: string;
  date?: string;
  location?: string;
  description?: string;
}

const photos: Photo[] = [
  { title: '城市黄昏', src: 'https://picsum.photos/seed/city/800/600', category: '城市', date: '2024-03', location: '上海' },
  { title: '山间晨雾', src: 'https://picsum.photos/seed/mountain/800/600', category: '风光', date: '2024-02', location: '黄山' },
  { title: '街角咖啡', src: 'https://picsum.photos/seed/cafe/800/600', category: '街拍', date: '2024-01', location: '杭州' },
  { title: '落日余晖', src: 'https://picsum.photos/seed/sunset/800/600', category: '风光', date: '2023-12', location: '厦门' },
  { title: '老城小巷', src: 'https://picsum.photos/seed/alley/800/600', category: '街拍', date: '2023-11', location: '苏州' },
  { title: '星空之下', src: 'https://picsum.photos/seed/stars/800/600', category: '风光', date: '2023-10', location: '西藏' },
  { title: '雨后彩虹', src: 'https://picsum.photos/seed/rainbow/800/600', category: '风光', date: '2023-09', location: '大理' },
  { title: '地铁穿梭', src: 'https://picsum.photos/seed/metro/800/600', category: '城市', date: '2023-08', location: '北京' },
  { title: '海边日出', src: 'https://picsum.photos/seed/beach/800/600', category: '风光', date: '2023-07', location: '青岛' },
  { title: '灯火阑珊', src: 'https://picsum.photos/seed/night/800/600', category: '城市', date: '2023-06', location: '重庆' },
  { title: '秋叶静美', src: 'https://picsum.photos/seed/autumn/800/600', category: '风光', date: '2023-05', location: '南京' },
  { title: '街头艺人', src: 'https://picsum.photos/seed/street/800/600', category: '街拍', date: '2023-04', location: '成都' },
];

export const categories = [...new Set(photos.map(p => p.category))];
export default photos;

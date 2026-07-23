const signatures = [
  '记录本身，就是意义。',
  '写下来，是为了不忘。',
  '生活不是我们活过的日子，而是我们记住的日子。',
  '写作是在时间里锚定自己。',
  '每一个字都是时光的标本。',
  '保持记录，保持诚实。',
  '文字是思想的化石。',
  '把日子过成文字，把文字过成日子。',
  '我写故我在。',
  '所有未记录的日子都是苍白的。',
  '时间是一匹马，文字是缰绳。',
  '写日记的人，不会完全老去。',
  '给未来的自己留一封信。',
  '在数字世界里种下一棵树。',
  '每一个句子都是时间的切片。',
  '记录平凡，抵抗遗忘。',
];

// Deterministically pick one based on a string hash
function pick(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return signatures[Math.abs(hash) % signatures.length];
}

export default pick;

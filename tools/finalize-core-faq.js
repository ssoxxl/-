const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const faqReplacements = {
  'salary/index.html': [
    ['주요 반영 항목', '연봉 실수령액 계산에는 어떤 공제가 반영되나요?'],
    ['실제 예시 1', '연봉 3,600만원이면 월 실수령액은 어느 정도인가요?'],
    ['실제 예시 2', '연봉 5,000만원이면 세후 월급이 얼마나 달라지나요?'],
    ['자주 헷갈리는 점', '상여 포함 연봉과 기본연봉은 왜 결과가 다르게 나오나요?'],
    ['활용 팁', '비과세 식대와 부양가족 수를 같이 넣어보는 이유는 뭔가요?'],
  ],
  'retire/index.html': [
    ['실제 예시 1', '월 평균임금 12만원에 3년 근무하면 퇴직금은 얼마인가요?'],
    ['실제 예시 2', '근속기간이 1년 6개월이면 퇴직금이 얼마나 달라지나요?'],
  ],
  'unemploy/index.html': [
    ['실제 예시 1', '1일 평균임금 9만원이면 실업급여 총액은 어떻게 계산되나요?'],
    ['실제 예시 2', '월급이 높으면 실업급여 상한선에 바로 걸리나요?'],
  ],
  'annual-leave/index.html': [
    ['실제 예시 1', '입사 첫해에 매달 개근하면 연차는 어떻게 쌓이나요?'],
    ['실제 예시 2', '입사 3년차 연차는 기본 15일에서 얼마나 늘어날 수 있나요?'],
  ],
  'yearend/index.html': [
    ['실제 예시 1', '카드 사용액과 부양가족 수에 따라 환급액은 얼마나 달라지나요?'],
    ['실제 예시 2', '중도 입사한 해에는 왜 연말정산 결과가 크게 달라질 수 있나요?'],
  ],
  'health-insurance/index.html': [
    ['실제 예시 1', '월 보수 300만원이면 건강보험료는 얼마나 빠지나요?'],
    ['실제 예시 2', '직장가입자에서 지역가입자로 바뀌면 보험료가 왜 달라지나요?'],
  ],
  'parental-leave/index.html': [
    ['실제 예시 1', '통상임금이 높아도 육아휴직 급여 상한 때문에 차이가 줄어드나요?'],
    ['실제 예시 2', '부부가 순차적으로 육아휴직을 쓰면 급여가 어떻게 달라지나요?'],
  ],
  'loan/index.html': [
    ['실제 예시 1', '3,000만원을 3년 대출하면 원리금균등과 원금균등 차이가 큰가요?'],
    ['실제 예시 2', '만기일시상환은 월 부담이 적어도 왜 위험하다고 보나요?'],
  ],
  'salary-rank/index.html': [
    ['실제 예시 1', '연봉 4,000만원이면 전체 직장인 기준 어느 정도 위치인가요?'],
    ['실제 예시 2', '연봉 7,000만원이면 상위권으로 봐도 되나요?'],
  ],
  'payday/index.html': [
    ['실제 예시 1', '월급날이 25일이면 생활비 구간을 어떻게 잡는 게 좋나요?'],
    ['실제 예시 2', '월급날이 말일이면 공휴일 때문에 입금일이 달라질 수 있나요?'],
  ],
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

for (const file of walk(root)) {
  let text = fs.readFileSync(file, 'utf8');

  // Remove malformed Daum verification metas entirely, keep only the correct one.
  text = text.replace(/\s*<meta daumoa-verification" content="[^"]*">\s*/g, '\n');

  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (faqReplacements[rel]) {
    for (const [from, to] of faqReplacements[rel]) {
      text = text.replace(
        `<div class="faq-q">${from}</div>`,
        `<div class="faq-q">${to}</div>`
      );
    }
  }

  fs.writeFileSync(file, text, 'utf8');
  console.log(`updated: ${rel}`);
}

const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

const slugPairs = [
  ['salary-negotiation', 'salary-negotiation'],
  ['severance-average-wage', 'retirement-pay'],
  ['unemployment-eligibility', 'unemployment'],
  ['annual-leave-rules', 'annual-leave'],
  ['health-insurance-paycheck', 'health-insurance'],
  ['loan-repayment-methods', 'loan-type'],
];

function remapGuideLinks(source) {
  let html = source;
  for (const [from, to] of slugPairs) {
    html = html.split(`/guides/${from}/`).join(`/guides/${to}/`);
    html = html.split(`guides/${from}/`).join(`guides/${to}/`);
    html = html.split(`./${from}/`).join(`./${to}/`);
    html = html.split(`../guides/${from}/`).join(`../guides/${to}/`);
  }
  return html;
}

function patchIndex() {
  let html = remapGuideLinks(read('index.html'));

  const oldHeadingNeedle = '<h2>광고를 붙이기 위한 얕은 문구 대신, 실제 판단에 필요한 글을 따로 정리했습니다.</h2>';
  const newHeading = '<h2>계산 전에 알아두면 좋은 실무 가이드</h2>';
  if (html.includes(oldHeadingNeedle)) {
    html = html.replace(oldHeadingNeedle, newHeading);
  } else if (!html.includes(newHeading)) {
    html = html.replace(/<h2>.*?<\/h2>/, newHeading);
  }

  const contentStart = html.indexOf('<section class="content-shell">');
  const gridStart = html.indexOf('<div class="calc-grid" id="calcGrid">');
  const buttonMarker = '\n<button class="scroll-top"';
  const buttonIndex = html.indexOf(buttonMarker);

  if (contentStart === -1 || gridStart === -1 || buttonIndex === -1) {
    throw new Error('index markers not found');
  }

  const contentEnd = html.indexOf('</section>', contentStart);
  if (contentEnd === -1) {
    throw new Error('content-shell end not found');
  }

  const contentSection = html.slice(contentStart, contentEnd + '</section>'.length);
  html = html.slice(0, contentStart) + html.slice(contentEnd + '</section>'.length);

  const gridCloseIndex = html.lastIndexOf('</div>', html.indexOf(buttonMarker));
  if (gridCloseIndex === -1 || gridCloseIndex < gridStart) {
    throw new Error('calc grid close not found');
  }

  html =
    html.slice(0, gridCloseIndex + '</div>'.length) +
    '\n\n' +
    contentSection +
    html.slice(gridCloseIndex + '</div>'.length);

  write('index.html', html);
}

function patchGuidesIndex() {
  let html = remapGuideLinks(read('guides/index.html'));
  write('guides/index.html', html);
}

function patchCorePages() {
  const files = [
    'salary/index.html',
    'retire/index.html',
    'unemploy/index.html',
    'annual-leave/index.html',
    'health-insurance/index.html',
    'yearend/index.html',
    'parental-leave/index.html',
    'loan/index.html',
    'salary-rank/index.html',
    'payday/index.html',
  ];

  for (const file of files) {
    write(file, remapGuideLinks(read(file)));
  }
}

function patchSitemap() {
  let xml = remapGuideLinks(read('sitemap.xml'));
  write('sitemap.xml', xml);
}

function articleTemplate({ title, description, slug, category, intro, sections, related, updated }) {
  const canonical = `https://calc.ssoxxl.com/guides/${slug}/`;
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'ko-KR',
    mainEntityOfPage: canonical,
    dateModified: updated,
    author: { '@type': 'Organization', name: '계산왕' },
    publisher: { '@type': 'Organization', name: '계산왕' },
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8390635644947402" crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | 계산왕 가이드</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="계산왕">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://calc.ssoxxl.com/og-image.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="https://calc.ssoxxl.com/og-image.svg">
<meta name="daumoa-verification" content="52638bd43577858cdf80a388c3bf173be6b9be4914b8bde1a3b347cf6786f5b4:Xj5dg0WfAX454QfLeg8nBA==">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="shortcut icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(articleLd)}</script>
<script>
(function(){
  var s=localStorage.getItem('gyesanwang_theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',s);
})();
</script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
:root{--bg:#f7f6f2;--surface:#fff;--surface2:#f0efe9;--border:#e2e0d8;--text:#1a1a18;--muted:#6e6d66;--accent:#2563eb;--accent-light:#eff6ff;}
[data-theme="dark"]{--bg:#0f0f14;--surface:#1a1a24;--surface2:#222230;--border:rgba(255,255,255,0.08);--text:#e8e8f0;--muted:#8b8ba0;--accent-light:rgba(37,99,235,0.15);}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:'Noto Sans KR',sans-serif;transition:background .3s,color .3s;}
header{background:var(--surface);border-bottom:2px solid var(--border);padding:0 24px;height:56px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100;}
.logo{font-size:18px;font-weight:900;letter-spacing:-1px;display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--text);}
.logo-badge{background:#0a0a0f;color:#FFD700;font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px;border:1px solid #D4A017;font-family:'Courier New',monospace;}
.back-btn{margin-left:auto;padding:6px 14px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:inherit;font-size:13px;text-decoration:none;}
.wrap{max-width:860px;margin:0 auto;padding:36px 24px 64px;}
.crumb{font-size:12px;color:var(--muted);margin-bottom:14px;}
.crumb a{color:inherit;text-decoration:none;}
.hero{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:28px 28px 24px;margin-bottom:20px;}
.hero-tag{display:inline-block;padding:5px 10px;border-radius:999px;background:var(--accent-light);color:var(--accent);font-size:11px;font-weight:700;margin-bottom:10px;}
.hero h1{font-size:30px;line-height:1.35;letter-spacing:-1px;margin-bottom:12px;}
.hero p{font-size:15px;line-height:1.92;color:var(--muted);margin-bottom:10px;}
.hero-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;font-size:12px;color:var(--muted);}
.article-card{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:28px;}
.article-card p{font-size:15px;line-height:1.95;color:var(--text);margin-bottom:14px;}
.article-section{margin-top:30px;}
.article-section h2{font-size:20px;letter-spacing:-.4px;margin-bottom:12px;}
.article-section ul{padding-left:20px;margin:0 0 10px;}
.article-section li{font-size:14px;line-height:1.9;color:var(--muted);margin-bottom:6px;}
.note-box{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:18px;margin:24px 0 0;}
.note-box strong{display:block;margin-bottom:8px;font-size:13px;}
.note-box p{font-size:13px;color:var(--muted);margin:0;line-height:1.8;}
.link-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px;}
.link-card{display:block;padding:14px 16px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);text-decoration:none;color:var(--text);font-size:14px;font-weight:700;}
.link-card:hover{border-color:var(--accent);}
footer{background:#1a1a18;color:rgba(255,255,255,.5);text-align:center;padding:24px;font-size:12px;margin-top:40px;}
footer strong{color:#fff;}
@media(max-width:640px){.wrap{padding:20px 14px 48px;}.hero,.article-card{padding:20px 18px;}.hero h1{font-size:24px;}.link-grid{grid-template-columns:1fr;}}
</style>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5E3YW37RYV"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-5E3YW37RYV');
</script>
</head>
<body>
<header>
  <a href="../../" class="logo"><span>계산왕</span><span class="logo-badge">王</span></a>
  <a href="../" class="back-btn">← 가이드 목록</a>
</header>
<div class="wrap">
  <div class="crumb"><a href="../../">홈</a> / <a href="../">가이드</a> / ${category}</div>
  <div class="hero">
    <span class="hero-tag">${category}</span>
    <h1>${title}</h1>
    ${intro.map((p) => `<p>${p}</p>`).join('\n    ')}
    <div class="hero-meta">
      <span>최종 업데이트 ${updated}</span>
      <span>2026년 기준</span>
      <span>실무 판단용 정리</span>
    </div>
  </div>
  <article class="article-card">
    ${sections.map((section) => `
    <section class="article-section">
      <h2>${section.heading}</h2>
      ${section.body.map((p) => `<p>${p}</p>`).join('\n      ')}
      ${section.list ? `<ul>${section.list.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
    </section>`).join('\n')}
    <div class="note-box">
      <strong>안내 및 면책 문구</strong>
      <p>이 페이지는 2026년 기준 제도와 일반적인 실무 흐름을 바탕으로 작성한 참고용 가이드입니다. 실제 지급액, 공제 항목, 수급 가능 여부, 보험료, 상환 조건은 회사 규정과 금융 상품 약관, 신고 서류, 행정기관 판단에 따라 달라질 수 있으니 최종 결정 전에는 공식 안내와 개별 계약 조건을 함께 확인해 주세요.</p>
    </div>
    <section class="article-section">
      <h2>관련 계산기 바로가기</h2>
      <div class="link-grid">
        ${related.map((item) => `<a href="${item.href}" class="link-card">${item.label}</a>`).join('\n        ')}
      </div>
    </section>
  </article>
</div>
<footer><strong>계산왕</strong> — 계산 결과와 해설을 함께 보는 실무 가이드</footer>
</body>
</html>`;
}

function createGuidePages() {
  const pages = [
    {
      file: 'guides/salary-negotiation/index.html',
      slug: 'salary-negotiation',
      category: '연봉 협상',
      title: '연봉 협상 전에 세전보다 실수령액을 먼저 봐야 하는 이유',
      description: '비과세 식대, 가족 수, 공제 차이를 포함해 연봉 협상에서 실수령액 기준으로 비교해야 하는 이유를 정리했습니다.',
      updated: '2026-05-14',
      intro: [
        '연봉 협상이나 이직 제안서를 볼 때 가장 먼저 눈에 들어오는 숫자는 세전 연봉입니다. 하지만 실제 생활비 계획에 직접 연결되는 금액은 월 실수령액입니다. 같은 세전 연봉이라도 비과세 식대가 있는지, 가족 수가 어떻게 반영되는지, 회사가 어떤 수당 구조를 쓰는지에 따라 통장에 들어오는 금액은 꽤 달라질 수 있습니다.',
        '계산왕의 연봉 실수령액 계산기는 빠르게 감을 잡기 좋은 도구이고, 이 가이드는 그 숫자를 어떻게 읽어야 하는지 정리한 문서입니다. 특히 협상 자리에서는 세전 총액보다 매달 손에 쥐는 금액과 고정 수당 구조를 함께 비교해야 실제로 더 유리한 조건을 고를 수 있습니다.',
        '2026년 기준으로 급여 협상에서 자주 놓치는 항목은 비과세 식대, 가족 수에 따른 공제 차이, 그리고 상여와 기본급의 비중입니다. 아래 내용은 제안서를 볼 때 어떤 순서로 확인하면 좋은지 실무 관점에서 정리했습니다.',
      ],
      sections: [
        {
          heading: '세전 연봉이 아니라 실수령액으로 비교해야 하는 이유는 무엇인가요?',
          body: [
            '세전 연봉은 회사가 제시하는 보상 규모를 보여주는 숫자이지만, 생활비 관점에서는 충분하지 않습니다. 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세와 지방소득세가 빠지고 나면 실제 월 수령액은 예상보다 낮아질 수 있기 때문입니다. 특히 연봉 200만~300만원 차이는 세전 숫자로 보면 커 보여도, 월 단위 실수령액 차이로 바꾸면 생각보다 좁아지는 경우가 많습니다.',
            '반대로 세전 연봉 차이가 크지 않아도 비과세 수당이 꾸준히 들어오거나, 상여보다 기본급 비중이 높아서 급여 흐름이 안정적인 회사가 생활 체감상 더 나은 경우도 있습니다. 그래서 협상에서는 연봉 총액을 먼저 보고 끝내기보다 실수령액, 상여 지급 방식, 복리후생 수당까지 함께 확인하는 쪽이 훨씬 현실적입니다.',
          ],
          list: [
            '연봉 총액은 같아도 비과세 수당 여부에 따라 실수령액이 달라집니다.',
            '상여 비중이 높으면 월별 현금 흐름이 흔들릴 수 있습니다.',
            '세전 비교만 하면 실생활 기준에서 손해 보는 선택을 할 수 있습니다.',
          ],
        },
        {
          heading: '비과세 식대와 가족 수 입력은 왜 중요하게 봐야 하나요?',
          body: [
            '비과세 식대는 같은 연봉에서도 과세 대상 급여를 줄여주는 역할을 하기 때문에 체감 수령액에 직접 영향을 줍니다. 협상 과정에서 세전 연봉을 크게 못 올리더라도 식대, 교통비, 일부 복리후생 수당이 비과세로 처리되는 구조라면 실수령액 기준으로는 더 좋은 결과가 나올 수 있습니다.',
            '가족 수 역시 공제 계산에서 의미가 있습니다. 부양가족 수가 반영되는 구조에서는 소득세 부담이 조금씩 달라질 수 있으므로, 단순히 제시 연봉만 비교하지 말고 본인의 실제 가족 구성과 동일한 조건으로 계산기를 돌려보는 것이 좋습니다. 특히 결혼이나 출산, 부모 부양 여부처럼 생활 구조가 바뀐 직후에는 제안서 비교 기준도 함께 바뀌어야 합니다.',
          ],
        },
        {
          heading: '협상 전에 어떤 체크리스트를 보면 실수가 줄어드나요?',
          body: [
            '실무적으로는 먼저 기본급과 상여의 비중을 나눠서 봐야 합니다. 기본급이 높으면 연차수당, 퇴직금, 일부 휴직급여 계산에서도 유리하게 작용할 수 있습니다. 반대로 연봉 총액은 좋아 보여도 상여 의존도가 높고 지급 시점이 분기나 반기 중심이라면 월별 체감 현금 흐름은 훨씬 불안정할 수 있습니다.',
            '그다음은 비과세 항목, 식대, 교통비, 통신비, 복지포인트처럼 과세와 별도로 운영되는 항목을 확인합니다. 마지막으로 수습 기간 급여, 입사 첫달 지급일, 성과급 조건, 연차 정산 방식, 퇴직금 계산에 포함되는 급여 구조까지 연결해서 보면 세전 숫자만 볼 때보다 훨씬 정확한 판단이 가능합니다.',
          ],
          list: [
            '기본급과 상여 비율 확인',
            '비과세 식대와 고정 수당 여부 확인',
            '수습 기간 감액 여부 확인',
            '입사 첫달 지급일과 급여 정산 방식 확인',
          ],
        },
        {
          heading: '실제 사례로 보면 어떤 비교가 더 현실적인가요?',
          body: [
            '예를 들어 A회사가 연봉 5,000만원에 비과세 식대 월 20만원, 기본급 중심 구조를 제안하고, B회사가 연봉 5,100만원이지만 상여 비중이 높고 비과세 항목이 거의 없다고 가정해 보겠습니다. 세전 숫자만 보면 B가 더 좋아 보일 수 있지만, 월 실수령액과 월별 안정성을 같이 보면 A가 더 나은 선택이 되는 경우가 충분히 있습니다.',
            '또 다른 예로 혼자 살 때보다 결혼 후 부양가족 구조가 달라진 상태에서 같은 조건을 다시 계산하면 실수령액 체감이 조금 달라질 수 있습니다. 그래서 협상 직전에는 회사가 제시한 숫자를 그대로 믿기보다 본인의 실제 생활 조건으로 계산기를 다시 돌려보고, 제안서 항목을 표로 적어 하나씩 비교해 보는 방식이 가장 실용적입니다.',
          ],
        },
      ],
      related: [
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../../salary-rank/', label: '연봉 순위 계산기' },
        { href: '../../health-insurance/', label: '건강보험료 계산기' },
        { href: '../../yearend/', label: '연말정산 미리보기' },
      ],
    },
    {
      file: 'guides/retirement-pay/index.html',
      slug: 'retirement-pay',
      category: '퇴직금',
      title: '퇴직금 계산 전에 꼭 알아둘 평균임금 기준과 중간정산 주의사항',
      description: '평균임금에 포함되는 항목, 퇴사 직전 3개월 급여 기준, 중간정산 주의사항까지 퇴직금 계산의 핵심을 정리했습니다.',
      updated: '2026-05-14',
      intro: [
        '퇴직금은 공식만 보면 평균임금 × 30일 × 근속일수 ÷ 365 구조라서 단순해 보입니다. 하지만 실제 계산에서는 평균임금에 어떤 항목이 들어가는지, 퇴사 직전 3개월 급여 구조가 어떻게 바뀌었는지에 따라 결과가 크게 달라질 수 있습니다.',
        '특히 상여금, 연차수당, 통상임금과의 관계를 잘못 이해하면 예상 퇴직금이 실제와 꽤 다르게 나오는 경우가 많습니다. 이 가이드는 계산기를 돌린 뒤 왜 그런 숫자가 나오는지 이해할 수 있도록 퇴직금 계산의 핵심 기준을 실무적으로 정리한 문서입니다.',
        '2026년 기준으로 회사마다 세부 운영 차이는 있을 수 있지만, 퇴직금 확인 전 반드시 봐야 하는 포인트는 평균임금 포함 항목, 직전 3개월 급여 변동, 그리고 중간정산 사유의 적법성입니다.',
      ],
      sections: [
        {
          heading: '평균임금에는 어떤 항목이 포함되나요?',
          body: [
            '퇴직금 계산의 핵심은 평균임금입니다. 평균임금은 보통 퇴직일 이전 3개월 동안 지급된 임금 총액을 그 기간의 총 일수로 나눠 계산합니다. 여기에는 기본급만이 아니라 정기적이고 지급 근거가 분명한 수당, 상여금 일부, 사용하지 않은 연차에 대한 수당처럼 퇴직 시점에 연결되는 항목이 영향을 줄 수 있습니다.',
            '다만 모든 항목이 무조건 포함되는 것은 아닙니다. 일시적이거나 비정기적으로 지급되는 금액, 실비 변상 성격이 강한 항목은 성격에 따라 제외될 수 있습니다. 그래서 급여명세서에 적힌 모든 숫자를 기계적으로 더하는 방식보다는, 해당 수당이 통상적 임금인지, 정기적으로 지급됐는지, 퇴직 시점 계산에서 반영되는 구조인지 함께 봐야 정확해집니다.',
          ],
          list: [
            '기본급은 가장 기본이 되는 평균임금 항목입니다.',
            '정기 상여금, 연차수당은 성격에 따라 평균임금 판단에 영향을 줍니다.',
            '실비 성격 항목은 제외될 수 있어 급여명세서를 그대로 합산하면 오차가 날 수 있습니다.',
          ],
        },
        {
          heading: '퇴사 직전 3개월 급여 기준은 왜 중요하나요?',
          body: [
            '퇴직금은 퇴사 직전 3개월 급여 흐름에 민감합니다. 예를 들어 퇴사 직전 기본급이 인상됐거나, 반대로 무급휴직이나 병가로 지급액이 일시적으로 줄었다면 평균임금도 함께 달라집니다. 그래서 퇴사 시점을 앞두고 급여 구조가 바뀐 경우에는 계산기 결과를 볼 때 직전 3개월 급여 흐름을 반드시 확인해야 합니다.',
            '실무에서 자주 나오는 질문은 “퇴직 직전 3개월에 상여가 들어왔는데 퇴직금이 왜 더 늘었나요?” 또는 “휴직이 겹쳤는데 왜 예상보다 적나요?” 같은 경우입니다. 이런 차이는 대부분 평균임금 산정 대상 기간의 급여 구성이 달라졌기 때문에 생깁니다. 계산기를 볼 때도 월 평균임금을 추정치로 넣기보다 실제 직전 3개월 급여 구조를 반영하는 편이 훨씬 정확합니다.',
          ],
        },
        {
          heading: '중간정산은 아무 때나 가능한가요?',
          body: [
            '퇴직금 중간정산은 직원과 회사가 원한다고 해서 아무 때나 자유롭게 할 수 있는 구조는 아닙니다. 법에서 정한 제한된 사유가 있고, 주택 구입, 장기 요양, 파산에 준하는 경제적 사정처럼 요건을 충족해야 하는 경우가 많습니다. 따라서 단순히 생활비가 필요하다는 이유로는 중간정산이 어렵거나 인정되지 않을 수 있습니다.',
            '또 중간정산을 한 뒤에는 그 시점 이전 근속분이 정리되기 때문에, 이후 퇴직금 계산은 남은 근속기간 기준으로 다시 보게 됩니다. 그래서 중간정산은 “지금 현금이 들어온다”는 장점만 볼 게 아니라, 나중에 최종 퇴사할 때 남는 퇴직금 규모가 어떻게 달라질지도 같이 생각해야 합니다.',
          ],
          list: [
            '중간정산은 제한된 법정 사유가 필요한 경우가 많습니다.',
            '한 번 정산하면 이후 퇴직금 계산 기준점이 다시 잡힙니다.',
            '현재 유동성과 나중 퇴직 시 수령액을 함께 비교해야 합니다.',
          ],
        },
        {
          heading: '실제 사례로 보면 어떤 부분에서 차이가 나나요?',
          body: [
            '예를 들어 월 평균임금이 12만원 수준으로 계산되는 직원이 약 3년 근무했다면 퇴직금은 대략 1천만원 안팎으로 추정될 수 있습니다. 그런데 퇴사 직전 3개월에 정기 상여가 포함되거나 사용하지 않은 연차수당이 함께 반영되면 평균임금이 올라가면서 계산 결과도 커질 수 있습니다.',
            '반대로 퇴사 직전 3개월에 무급휴직, 단축 근무, 성과급 미지급처럼 일시적인 하락 요인이 있었다면 같은 근속연수라도 예상보다 낮게 나올 수 있습니다. 그래서 회사가 제시한 퇴직금 숫자를 볼 때는 단순히 “맞다, 틀리다”보다 어떤 기준 급여로 산정했는지를 먼저 물어보는 것이 가장 중요합니다.',
          ],
        },
      ],
      related: [
        { href: '../../retire/', label: '퇴직금 계산기' },
        { href: '../../annual-leave/', label: '연차 계산기' },
        { href: '../../unemploy/', label: '실업급여 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
      ],
    },
    {
      file: 'guides/unemployment/index.html',
      slug: 'unemployment',
      category: '실업급여',
      title: '실업급여 신청 전에 꼭 확인할 자진퇴사 예외와 준비 서류',
      description: '자진퇴사 예외 조건, 수급 전 준비 서류, 소정급여일수 기준표를 실업급여 계산과 함께 이해하기 쉽게 정리했습니다.',
      updated: '2026-05-14',
      intro: [
        '실업급여는 단순히 퇴사했다고 바로 받을 수 있는 제도가 아니라, 퇴사 사유와 고용보험 가입 이력, 재취업 의사와 구직 활동 여부까지 함께 확인하는 제도입니다. 그래서 계산기에서 예상 금액이 괜찮게 나오더라도 실제 수급 가능 여부는 별도의 판단이 필요합니다.',
        '특히 자진퇴사면 무조건 안 된다고 알고 있는 경우가 많은데, 임금체불, 통근 곤란, 육아·가족 돌봄 문제처럼 예외적으로 인정되는 사유도 존재합니다. 이 가이드는 계산기 숫자와 별개로 실업급여를 준비할 때 어떤 기준을 먼저 체크해야 하는지 정리한 문서입니다.',
        '2026년 기준으로 실업급여는 금액만 보는 것보다 수급 가능성, 준비 서류, 소정급여일수까지 함께 이해해야 실제 계획에 도움이 됩니다.',
      ],
      sections: [
        {
          heading: '자발적 퇴사면 무조건 실업급여를 못 받나요?',
          body: [
            '실업급여는 원칙적으로 비자발적 이직을 기본 전제로 보지만, 자진퇴사라고 해서 모든 경우가 자동으로 제외되는 것은 아닙니다. 예를 들어 회사의 임금체불이 반복되었거나, 통근 시간이 과도하게 길어져 정상적인 근무 지속이 어려운 경우, 또는 가족 돌봄과 건강 문제처럼 계속 근로하기 어려운 사정이 객관적으로 확인되는 경우에는 예외 사유로 검토될 수 있습니다.',
            '핵심은 “내가 스스로 그만뒀다”는 형식이 아니라, 왜 그 선택을 할 수밖에 없었는지를 서류와 사실관계로 설명할 수 있는지입니다. 따라서 자진퇴사를 고민하는 단계라면 퇴사 전에 사유를 입증할 수 있는 자료를 미리 모아두는 것이 중요합니다. 사직 후에 뒤늦게 자료를 찾으려 하면 입증이 훨씬 어려워질 수 있습니다.',
          ],
          list: [
            '임금체불, 근로조건 악화, 통근 곤란은 자주 검토되는 예외 사유입니다.',
            '형식보다 실제 퇴사 배경과 입증 자료가 중요합니다.',
            '퇴사 전에 자료를 정리해두면 수급 판단 과정이 훨씬 수월합니다.',
          ],
        },
        {
          heading: '실업급여 신청 전에 어떤 서류를 챙기면 좋나요?',
          body: [
            '실업급여를 신청할 때는 기본적으로 이직확인서 처리 여부, 고용보험 가입 이력, 신분 확인 자료 등을 확인해야 합니다. 여기에 자진퇴사 예외를 주장하는 경우라면 통근 기록, 진단서, 임금체불 증빙, 육아나 돌봄 관련 자료처럼 퇴사 사유를 설명할 수 있는 문서를 함께 준비하는 것이 좋습니다.',
            '실무적으로는 퇴사 직후 “서류는 회사가 알아서 처리해주겠지”라고 생각했다가 시간이 지체되는 경우가 많습니다. 그래서 퇴사 직전에는 이직확인서 처리 일정, 마지막 급여명세서, 근로계약서, 근무기록과 같은 자료를 한 번에 정리해 두는 편이 좋습니다. 나중에 금액 계산과 자격 판단을 동시에 확인할 때 큰 도움이 됩니다.',
          ],
        },
        {
          heading: '소정급여일수는 무엇을 기준으로 달라지나요?',
          body: [
            '실업급여 총액은 1일 수급액과 소정급여일수의 곱으로 이해하면 쉽습니다. 여기서 소정급여일수는 나이와 고용보험 가입기간에 따라 달라집니다. 가입기간이 길고 나이가 높아질수록 수급 가능 일수가 늘어나는 구조로 이해하면 됩니다.',
            '그래서 같은 월급을 받던 사람이라도 근속기간이 짧은 경우와 긴 경우의 총 수급액은 꽤 차이가 납니다. 계산기를 사용할 때도 1일 수급액만 보지 말고, 내가 해당하는 연령대와 가입기간 기준에서 소정급여일수가 어느 구간인지 함께 확인하는 것이 중요합니다.',
          ],
          list: [
            '1일 수급액만 같아도 소정급여일수가 다르면 총액은 달라집니다.',
            '연령과 가입기간이 길수록 유리한 구간으로 이동할 수 있습니다.',
            '퇴사 전에 내 고용보험 가입기간을 미리 확인해 두면 예상치가 더 정확해집니다.',
          ],
        },
        {
          heading: '실제 사례로 보면 어디서 가장 많이 헷갈리나요?',
          body: [
            '월급 250만원 수준이던 근로자가 계산기에서 예상 수급액을 봤더라도, 실제로는 상한선에 걸리는지, 가입기간이 어느 구간인지에 따라 최종 총액이 달라질 수 있습니다. 특히 “금액은 계산됐는데 나는 자격이 안 되는 건가?”라는 질문이 가장 많고, 이 경우 대부분 퇴사 사유나 이직확인서 처리 상태에서 걸립니다.',
            '또 자진퇴사를 했더라도 예외 사유가 분명한 경우에는 포기하지 말고 자료를 갖춰 설명해야 합니다. 반대로 비자발적 퇴사여도 서류가 늦게 정리되면 신청 일정이 밀릴 수 있습니다. 결국 계산기 숫자는 시작점이고, 실제 수급에서는 서류와 사유 정리가 절반 이상을 차지한다고 봐도 무리가 없습니다.',
          ],
        },
      ],
      related: [
        { href: '../../unemploy/', label: '실업급여 계산기' },
        { href: '../../retire/', label: '퇴직금 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../../health-insurance/', label: '건강보험료 계산기' },
      ],
    },
    {
      file: 'guides/annual-leave/index.html',
      slug: 'annual-leave',
      category: '연차',
      title: '연차 계산 전에 꼭 알아둘 입사일 기준과 회계연도 기준 차이',
      description: '입사일 기준과 회계연도 기준의 차이, 1년차 월차에서 연차로 이어지는 구조, 연차수당 계산 방법을 실무 중심으로 정리했습니다.',
      updated: '2026-05-14',
      intro: [
        '연차는 숫자만 보면 단순해 보이지만 실제 회사 운영에서는 가장 오해가 많이 생기는 항목 중 하나입니다. 입사일 기준으로 보는지, 회계연도 기준으로 관리하는지에 따라 화면에 보이는 잔여일수가 달라지고, 입사 첫해에는 월 단위로 쌓이는 휴가와 이후 연차가 연결되기 때문에 더 헷갈리기 쉽습니다.',
        '계산왕의 연차 계산기는 빠르게 일수를 추정하기 좋은 도구이고, 이 가이드는 왜 회사 시스템 숫자와 계산기 결과가 다르게 보일 수 있는지 설명하는 문서입니다. 2026년 기준으로 연차는 단순히 며칠 남았는지보다 어떤 기준으로 부여되는지, 그리고 사용하지 못한 연차가 수당으로 정산될 때 어떤 흐름을 따르는지 함께 이해하는 것이 중요합니다.',
        '특히 입사 첫해, 육아휴직 전후, 퇴사 직전에는 연차 일수보다 관리 기준과 정산 시점이 더 중요하게 느껴집니다. 아래에서 실제로 많이 헷갈리는 포인트를 순서대로 정리했습니다.',
      ],
      sections: [
        {
          heading: '입사일 기준과 회계연도 기준은 왜 다르게 보이나요?',
          body: [
            '입사일 기준은 개인의 입사일을 중심으로 연차를 계산하는 방식입니다. 반면 회계연도 기준은 회사가 관리 편의를 위해 특정 연도 구간에 맞춰 일괄 운영하는 방식입니다. 둘 다 실무에서 쓰이는 방식이지만, 직원 입장에서는 회계연도 기준에서 보정이 들어가면 화면상 연차가 갑자기 줄거나 재배치된 것처럼 보일 수 있습니다.',
            '예를 들어 하반기 입사자는 입사일 기준으로 보면 첫 1년 동안 월 단위로 휴가가 쌓이는 흐름이 선명하지만, 회사가 다음 회계연도에 맞춰 조정하면 표시 방식이 달라질 수 있습니다. 그래서 계산기 결과와 회사 시스템 숫자가 다를 때는 “누가 틀렸다”보다 어느 기준으로 관리하고 있는지를 먼저 확인하는 것이 더 중요합니다.',
          ],
          list: [
            '입사일 기준은 개인 단위, 회계연도 기준은 회사 운영 단위입니다.',
            '회계연도 보정이 들어가면 잔여일수 표기가 달라질 수 있습니다.',
            '계산기와 회사 시스템 숫자가 다른 가장 흔한 이유가 기준 차이입니다.',
          ],
        },
        {
          heading: '입사 첫해 월차는 언제 연차 구조로 이어지나요?',
          body: [
            '입사 후 1년 미만 근로자는 보통 개근한 달에 대해 휴가가 발생하는 구조를 먼저 경험합니다. 많은 분이 이것을 월차로 부르지만, 실제로는 이후 연차 구조와 연결되는 과정으로 이해하는 편이 정확합니다. 문제는 이 흐름이 입사일 기준으로 보이는지, 회사의 회계연도 조정에 따라 재배치되는지에 따라 체감이 완전히 달라진다는 점입니다.',
            '실무에서는 입사 첫해에 몇 일을 쓸 수 있는지, 다음 해부터는 몇 일이 새로 발생하는지, 이전에 사용한 휴가가 어떻게 차감되는지를 함께 봐야 합니다. 그래서 첫해에는 단순히 며칠이 남았는지보다 “이 일수가 어느 기간에서 온 것인지”를 이해하는 쪽이 훨씬 중요합니다.',
          ],
        },
        {
          heading: '연차수당은 어떤 기준으로 계산하면 되나요?',
          body: [
            '사용하지 못한 연차는 일정 조건에서 연차수당으로 정산될 수 있습니다. 이때 중요한 것은 남은 일수만이 아니라, 어떤 임금 기준으로 정산하는지와 회사가 정산 시점을 어떻게 운영하는지입니다. 퇴사 직전이라면 연차수당이 퇴직금이나 마지막 급여와 연결되어 체감되는 경우도 많기 때문에 더 꼼꼼히 봐야 합니다.',
            '계산기를 쓸 때는 남은 연차 일수를 먼저 확인하고, 그다음 1일 통상임금 또는 회사가 수당 계산에 쓰는 기준 임금을 같이 보는 방식이 실용적입니다. 단순히 남은 일수 × 월급 나누기 식으로 접근하면 실제 회사 정산 방식과 차이가 날 수 있습니다.',
          ],
          list: [
            '잔여일수만이 아니라 수당 계산 기준 임금이 중요합니다.',
            '정산 시점이 퇴사와 겹치면 마지막 급여 체감이 달라질 수 있습니다.',
            '회사가 어떤 기준으로 정산하는지 먼저 확인하면 오차를 줄일 수 있습니다.',
          ],
        },
        {
          heading: '실제 사례로 보면 어떤 오해가 가장 많나요?',
          body: [
            '예를 들어 10월 입사자가 입사일 기준으로 보면 첫해 동안 매달 일정 일수가 쌓이는 구조를 기대할 수 있지만, 회사가 회계연도 기준으로 정리하면 다음 해 초 시스템에 보이는 숫자가 달라질 수 있습니다. 이때 “연차를 뺏긴 것 같다”는 느낌을 받기 쉽지만, 실제로는 기준 전환 과정에서 표시 방식이 바뀐 경우가 많습니다.',
            '또 퇴사 직전에는 남은 연차가 모두 수당으로 나오는지, 일부는 이미 사용 촉진 절차가 있었는지, 정산 기준 임금이 무엇인지가 함께 영향을 줍니다. 그래서 연차 문제는 계산기 숫자와 함께 회사 관리 기준과 정산 방식을 같이 보는 것이 가장 현실적인 접근입니다.',
          ],
        },
      ],
      related: [
        { href: '../../annual-leave/', label: '연차 계산기' },
        { href: '../../parental-leave/', label: '육아휴직 급여 계산기' },
        { href: '../../retire/', label: '퇴직금 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
      ],
    },
    {
      file: 'guides/health-insurance/index.html',
      slug: 'health-insurance',
      category: '건강보험',
      title: '건강보험료 계산 전에 알아두면 좋은 직장가입자와 지역가입자 차이',
      description: '직장가입자와 지역가입자 보험료 차이, 급여 인상 시 반영 시점, 장기요양보험료 구조를 정리했습니다.',
      updated: '2026-05-14',
      intro: [
        '건강보험료는 급여명세서에서 자주 보는 항목이지만, 직장가입자와 지역가입자의 계산 구조가 서로 다르고 장기요양보험료가 함께 붙기 때문에 생각보다 해석이 어렵습니다. 특히 급여가 올랐는데 실수령액이 기대만큼 늘지 않았을 때 가장 먼저 확인하게 되는 항목이기도 합니다.',
        '계산왕의 건강보험료 계산기는 빠른 수치 확인에 적합하고, 이 가이드는 그 숫자를 어떻게 이해해야 하는지 설명하는 문서입니다. 2026년 기준으로 급여 인상 시 반영 시점, 장기요양보험료 구조, 직장가입자와 지역가입자의 차이를 함께 보면 월급 체감이 왜 달라지는지 훨씬 분명해집니다.',
        '특히 이직이나 퇴사, 지역가입 전환 가능성이 있는 시기에는 건강보험료를 단순한 공제 항목이 아니라 생활비 계획의 일부로 보는 것이 좋습니다.',
      ],
      sections: [
        {
          heading: '직장가입자와 지역가입자는 보험료 계산이 어떻게 다른가요?',
          body: [
            '직장가입자는 보통 보수월액을 기준으로 건강보험료가 계산됩니다. 즉 급여명세서에 잡히는 기준 급여를 중심으로 공제가 이루어지기 때문에, 월급을 보면 어느 정도 흐름을 파악할 수 있습니다. 반면 지역가입자는 소득만이 아니라 재산과 자동차 같은 요소가 함께 반영될 수 있어 계산 구조가 더 복합적입니다.',
            '이 차이는 퇴사 후 체감에서 크게 드러납니다. 재직 중에는 급여에서 일정하게 빠지던 금액이었지만, 지역가입자로 전환되면 예상보다 부담이 커질 수 있습니다. 그래서 퇴사나 휴직을 앞둔 시점에는 직장가입자 기준 계산만 보지 말고 이후 전환 가능성도 함께 생각해 두는 것이 좋습니다.',
          ],
          list: [
            '직장가입자는 보수월액 중심으로 보기 쉽습니다.',
            '지역가입자는 재산 등 다른 요소도 함께 반영될 수 있습니다.',
            '퇴사 후 전환 가능성이 있다면 현재 공제만 보고 끝내면 안 됩니다.',
          ],
        },
        {
          heading: '급여 인상 시 보험료는 바로 반영되나요?',
          body: [
            '많은 분이 연봉 인상 직후부터 건강보험료가 바로 바뀐다고 생각하지만, 실제 급여 반영과 보험료 조정 시점이 딱 맞아떨어지지 않는 경우가 많습니다. 그래서 월급은 올랐는데 이번 달 공제는 아직 비슷하거나, 반대로 몇 달 뒤에 보험료가 한 번 더 조정되면서 체감 공제가 커 보이는 경우가 있습니다.',
            '실무적으로는 급여 인상 후 처음 1~2개월 정도는 급여명세서를 함께 보면서 건강보험료와 장기요양보험료 변화가 어떻게 들어오는지 체크하는 편이 좋습니다. 협상이나 이직 비교에서도 세전 인상 폭보다 실수령액 인상 폭이 중요하므로, 보험료 변화를 포함한 체감 증가액을 보는 습관이 필요합니다.',
          ],
        },
        {
          heading: '장기요양보험료는 왜 같이 봐야 하나요?',
          body: [
            '급여명세서에서는 건강보험료와 장기요양보험료가 나란히 공제되는 경우가 많습니다. 그래서 건강보험료만 따로 보면 공제 증가폭이 생각보다 작게 느껴지거나, 반대로 왜 총 공제가 더 많이 늘었는지 이해가 안 되는 상황이 생길 수 있습니다. 실제 체감은 두 항목이 합쳐진 총액에서 오기 때문에 항상 함께 보는 것이 맞습니다.',
            '특히 급여가 오르거나 기준이 조정되는 시기에는 건강보험료만이 아니라 장기요양보험료도 같이 따라 움직입니다. 계산기 결과를 볼 때 총 공제 체감까지 보고 싶다면 건강보험료 항목을 단독 숫자로 이해하기보다 연동 공제 묶음으로 보는 편이 훨씬 현실적입니다.',
          ],
          list: [
            '건강보험료와 장기요양보험료는 실수령액 체감에서 함께 움직입니다.',
            '한 항목만 보면 공제 증가폭을 과소평가하기 쉽습니다.',
            '월급 협상과 생활비 계획에서는 두 항목 합계로 보는 편이 정확합니다.',
          ],
        },
        {
          heading: '실제 사례로 보면 어떤 상황에서 체감 차이가 커지나요?',
          body: [
            '예를 들어 연봉이 올라 월급이 늘었는데도 실수령액 증가폭이 기대보다 작게 느껴지는 경우가 있습니다. 이때는 소득세뿐 아니라 건강보험료와 장기요양보험료가 함께 올라 공제 총액이 커진 영향일 가능성이 높습니다. 세전 인상액만 보고 “월급이 크게 오르겠지”라고 기대하면 실제 체감에서 실망하기 쉬운 이유입니다.',
            '또 다른 사례로는 퇴사 후 지역가입으로 전환되는 경우가 있습니다. 재직 중 공제되던 금액만 기준으로 생각했다가, 전환 후 예상보다 부담이 커져 당황하는 일이 적지 않습니다. 그래서 이직과 퇴사 시점에는 건강보험료를 단순 공제 항목이 아니라 현금 흐름 변수로 같이 보는 것이 좋습니다.',
          ],
        },
      ],
      related: [
        { href: '../../health-insurance/', label: '건강보험료 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../../salary-raise/', label: '연봉 인상률 계산기' },
        { href: '../../unemploy/', label: '실업급여 계산기' },
      ],
    },
    {
      file: 'guides/loan-type/index.html',
      slug: 'loan-type',
      category: '대출',
      title: '대출 비교 전에 꼭 알아둘 상환 방식과 중도상환수수료 체크포인트',
      description: '원리금균등, 원금균등, 만기일시상환 차이와 중도상환수수료, 금리 비교 전에 볼 체크포인트를 정리했습니다.',
      updated: '2026-05-14',
      intro: [
        '대출을 비교할 때 가장 먼저 보이는 숫자는 금리지만, 실제 부담을 결정하는 것은 금리 하나만이 아닙니다. 상환 방식이 무엇인지, 월 상환액이 얼마나 달라지는지, 중도상환수수료가 있는지에 따라 체감 부담은 크게 달라집니다.',
        '계산왕의 대출이자 계산기는 월 상환액과 총 이자를 빠르게 확인하기 좋은 도구이고, 이 가이드는 그 결과를 실제 생활비 계획과 연결해 읽기 위한 문서입니다. 특히 직장인처럼 매달 고정 지출이 분명한 경우에는 금리 몇 소수점 차이보다 상환 구조가 더 중요하게 작용할 때가 많습니다.',
        '2026년 기준으로 대출 상품을 볼 때는 원리금균등, 원금균등, 만기일시상환의 차이를 이해하고, 중도상환 계획까지 함께 생각하는 것이 실무적으로 가장 효율적입니다.',
      ],
      sections: [
        {
          heading: '원리금균등, 원금균등, 만기일시상환은 어떻게 다르나요?',
          body: [
            '원리금균등은 매달 내는 금액이 비교적 일정해서 생활비 계획을 세우기 좋습니다. 월급일에 맞춰 고정 지출을 관리하는 직장인에게는 예측 가능성이 장점이 됩니다. 다만 초기에는 이자 비중이 높기 때문에 총 이자 부담만 보면 기대보다 크게 느껴질 수 있습니다.',
            '원금균등은 초반 상환액이 높지만 시간이 갈수록 부담이 줄어드는 구조입니다. 여유 자금이 있거나 총 이자를 줄이는 데 초점을 두는 경우에 잘 맞지만, 첫해 월 상환액이 높아 현금 흐름을 압박할 수 있습니다. 만기일시상환은 당장 월 부담이 작아 보여도 만기에 원금을 한꺼번에 상환해야 하므로, 자금 계획이 명확할 때만 신중하게 선택하는 편이 좋습니다.',
          ],
          list: [
            '원리금균등: 월 상환액 예측이 쉽습니다.',
            '원금균등: 초반 부담은 크지만 총 이자 절감에 유리할 수 있습니다.',
            '만기일시상환: 당장 부담은 낮지만 만기 대응 계획이 필수입니다.',
          ],
        },
        {
          heading: '중도상환수수료는 왜 금리만큼 중요하게 봐야 하나요?',
          body: [
            '대출을 받은 뒤 예상보다 빨리 갚을 가능성이 있다면 중도상환수수료는 매우 중요한 변수입니다. 금리가 조금 낮은 상품이라도 중도상환수수료가 높으면 총 부담이 오히려 커질 수 있습니다. 반대로 금리가 아주 조금 높아도 중도상환이 자유로운 상품이 내 상황에는 더 나은 선택일 수 있습니다.',
            '특히 보너스, 퇴직금, 전세금 반환, 자산 정리 자금처럼 1~2년 내 목돈이 들어올 가능성이 있는 사람은 반드시 이 항목을 같이 봐야 합니다. 대출 비교는 시작 시점의 금리 경쟁이 아니라 전체 상환 시나리오를 보는 문제이기 때문입니다.',
          ],
        },
        {
          heading: '금리 비교 전에 어떤 체크포인트를 같이 봐야 하나요?',
          body: [
            '실무적으로는 대출 비교 전에 내 월 고정지출 구조를 먼저 보는 편이 좋습니다. 월급, 임대료, 카드값, 교육비, 차량비처럼 고정적으로 빠지는 금액을 적어 놓고 나면 어느 정도 상환액이 버거운지 감이 잡힙니다. 이 기준 없이 금리만 낮다고 선택하면 생활비 부담이 예상보다 커질 수 있습니다.',
            '또 대출 기간, 거치 여부, 상환 방식, 중도상환수수료, 우대금리 조건, 금리 변동 가능성까지 함께 봐야 합니다. 계산기 숫자는 출발점이고, 실제 판단에서는 상환 구조가 내 현금 흐름과 맞는지가 더 중요합니다.',
          ],
          list: [
            '월 고정지출과 함께 상환액을 봐야 합니다.',
            '우대금리 조건이 유지 가능한지도 확인해야 합니다.',
            '기간과 수수료를 빼고 금리만 비교하면 오판하기 쉽습니다.',
          ],
        },
        {
          heading: '실제 사례로 보면 어떤 선택이 더 현실적인가요?',
          body: [
            '예를 들어 A상품은 금리가 조금 더 낮지만 원금균등 구조라 초반 월 상환액이 높고, B상품은 금리가 아주 약간 높지만 원리금균등으로 월 부담이 일정하다고 가정해 보겠습니다. 월급과 고정비가 빡빡한 시기라면 총 이자보다 매달 버틸 수 있는 구조가 더 중요할 수 있어 B가 현실적인 선택이 될 수 있습니다.',
            '반대로 여유 자금이 있고 조기 상환 계획이 뚜렷하다면 총 이자를 줄이기 쉬운 구조가 더 맞을 수 있습니다. 결국 대출 선택은 가장 낮은 금리를 찾는 게임이 아니라, 내 현금 흐름과 상환 계획에 맞는 구조를 찾는 과정이라는 점을 기억하는 것이 좋습니다.',
          ],
        },
      ],
      related: [
        { href: '../../loan/', label: '대출이자 계산기' },
        { href: '../../payday/', label: '월급날 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../../deposit/', label: '예금 이자 계산기' },
      ],
    },
  ];

  for (const page of pages) {
    write(page.file, articleTemplate(page));
  }
}

function main() {
  patchIndex();
  patchGuidesIndex();
  patchCorePages();
  patchSitemap();
  createGuidePages();
}

main();

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

function replaceOrThrow(source, search, replace, label) {
  const next = source.replace(search, replace);
  if (next === source) {
    throw new Error(`Patch failed: ${label}`);
  }
  return next;
}

function addNoindex(rel) {
  let html = read(rel);
  if (html.includes('name="robots"')) return;
  html = replaceOrThrow(
    html,
    /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="robots" content="noindex,follow">`,
    `${rel} noindex insert`
  );
  write(rel, html);
}

function createGuidePage({ title, description, slug, category, updated, intro, sections, related }) {
  const canonical = `https://calc.ssoxxl.com/guides/${slug}/`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'ko-KR',
    author: {
      '@type': 'Organization',
      name: '계산왕',
    },
    publisher: {
      '@type': 'Organization',
      name: '계산왕',
    },
    dateModified: updated,
    mainEntityOfPage: canonical,
  };

  const sectionHtml = sections
    .map(
      (section) => `
      <section class="article-section">
        <h2>${section.heading}</h2>
        ${section.body.map((p) => `<p>${p}</p>`).join('\n        ')}
        ${section.list ? `<ul>${section.list.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
      </section>`
    )
    .join('\n');

  const relatedHtml = related
    .map((item) => `<a href="${item.href}" class="link-card">${item.label}</a>`)
    .join('\n        ');

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
<script type="application/ld+json">${JSON.stringify(ld)}</script>
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
.hero h1{font-size:30px;line-height:1.3;letter-spacing:-1px;margin-bottom:10px;}
.hero p{font-size:15px;line-height:1.8;color:var(--muted);}
.hero-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;font-size:12px;color:var(--muted);}
.article-card{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:28px;}
.article-card p{font-size:15px;line-height:1.9;color:var(--text);margin-bottom:14px;}
.article-section{margin-top:26px;}
.article-section h2{font-size:20px;letter-spacing:-.4px;margin-bottom:12px;}
.article-section ul{padding-left:20px;margin:0 0 10px;}
.article-section li{font-size:14px;line-height:1.9;color:var(--muted);margin-bottom:6px;}
.note-box{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:18px;margin:18px 0;}
.note-box strong{display:block;margin-bottom:8px;font-size:13px;}
.note-box p{font-size:13px;color:var(--muted);margin:0;line-height:1.8;}
.link-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px;}
.link-card{display:block;padding:14px 16px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);text-decoration:none;color:var(--text);font-size:14px;font-weight:700;}
.link-card:hover{border-color:var(--accent);}
footer{background:#1a1a18;color:rgba(255,255,255,.5);text-align:center;padding:24px;font-size:12px;margin-top:40px;}
footer strong{color:#fff;}
@media(max-width:640px){
  .wrap{padding:20px 14px 48px;}
  .hero,.article-card{padding:20px 18px;}
  .hero h1{font-size:24px;}
  .link-grid{grid-template-columns:1fr;}
}
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
  <a href="../" class="back-btn">← 가이드 모아보기</a>
</header>
<div class="wrap">
  <div class="crumb"><a href="../../">홈</a> / <a href="../">가이드</a> / ${category}</div>
  <div class="hero">
    <span class="hero-tag">${category}</span>
    <h1>${title}</h1>
    <p>${intro}</p>
    <div class="hero-meta">
      <span>최종 업데이트 ${updated}</span>
      <span>운영 기준: 계산왕 편집팀</span>
      <span>검토 축: 직장인 · 세금 · 보험 · 생활금융</span>
    </div>
  </div>
  <article class="article-card">
    ${sectionHtml}
    <div class="note-box">
      <strong>계산왕 안내</strong>
      <p>이 가이드는 일반적인 제도 기준과 실무에서 자주 헷갈리는 포인트를 정리한 참고 자료예요. 실제 지급액과 세액은 회사 규정, 신고 자료, 비과세 항목, 고용 형태에 따라 달라질 수 있으니 최종 판단 전에는 해당 기관 공지나 급여명세서를 함께 확인해 주세요.</p>
    </div>
    <section class="article-section">
      <h2>함께 보면 좋은 계산기와 가이드</h2>
      <div class="link-grid">
        ${relatedHtml}
      </div>
    </section>
  </article>
</div>
<footer>
  <strong>계산왕</strong> — 계산기만 모은 사이트가 아니라, 실제 판단에 도움이 되는 해설까지 함께 정리합니다.
</footer>
</body>
</html>`;
}

function patchIndex() {
  let html = read('index.html');

  html = replaceOrThrow(
    html,
    /<title>[\s\S]*?<\/title>/,
    '<title>계산왕 — 직장인 급여·세금·보험 계산기와 해설 가이드</title>',
    'index title'
  );
  html = replaceOrThrow(
    html,
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="연봉 실수령액, 퇴직금, 실업급여, 연차, 건강보험료, 연말정산, 대출이자까지. 직장인 급여·세금·보험 계산기와 실무 가이드를 한곳에서 확인하세요.">',
    'index description'
  );
  html = replaceOrThrow(
    html,
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="계산왕 — 직장인 급여·세금·보험 계산기와 해설 가이드">',
    'index og title'
  );
  html = replaceOrThrow(
    html,
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="계산기만 나열하지 않고, 급여·세금·보험 판단에 필요한 해설 가이드까지 함께 제공합니다.">',
    'index og desc'
  );
  html = replaceOrThrow(
    html,
    /<meta name="twitter:title" content="[^"]*">/,
    '<meta name="twitter:title" content="계산왕 — 직장인 급여·세금·보험 계산기와 해설 가이드">',
    'index twitter title'
  );
  html = replaceOrThrow(
    html,
    /<meta name="twitter:description" content="[^"]*">/,
    '<meta name="twitter:description" content="연봉, 퇴직금, 실업급여, 연차, 건강보험료, 대출이자 계산기와 함께 읽는 실무 가이드를 확인하세요.">',
    'index twitter desc'
  );

  html = replaceOrThrow(
    html,
    /<\/section>\s*<div class="calc-grid" id="calcGrid">/,
    `</section>

<section class="content-shell">
  <div class="focus-note">
    <div class="focus-lead">직장인 · 세금 · 보험 중심</div>
    <h2>계산 결과만 보여주지 않고, 왜 이런 숫자가 나오는지도 같이 설명해요.</h2>
    <p>계산왕은 연봉 실수령액, 퇴직금, 실업급여, 연차, 건강보험료, 연말정산처럼 직장인이 자주 찾는 계산을 중심으로 운영합니다. 각 계산기 아래에는 실제 사례와 계산 기준을 정리했고, 별도 가이드 문서에서는 회사별로 결과가 달라지는 이유, 실무에서 헷갈리는 포인트, 공식 기준을 함께 설명합니다.</p>
  </div>
  <div class="guide-strip">
    <div class="guide-strip-head">
      <div>
        <div class="focus-lead">해설 가이드</div>
        <h2>광고를 붙이기 위한 얇은 문구 대신, 실제 판단에 필요한 글을 따로 정리했습니다.</h2>
      </div>
      <a href="guides/" class="guide-more">가이드 전체 보기</a>
    </div>
    <div class="guide-grid">
      <a href="guides/salary-negotiation/" class="guide-card">
        <span class="guide-tag">급여</span>
        <strong>연봉 협상할 때 세전보다 실수령액을 먼저 봐야 하는 이유</strong>
        <span>비과세 식대, 가족 수, 공제 차이까지 함께 읽는 기본 가이드</span>
      </a>
      <a href="guides/severance-average-wage/" class="guide-card">
        <span class="guide-tag">퇴직금</span>
        <strong>퇴직금 계산에서 평균임금에 포함되는 항목은 무엇인가요?</strong>
        <span>상여금, 연차수당, 통상임금 비교가 왜 중요한지 정리했습니다.</span>
      </a>
      <a href="guides/unemployment-eligibility/" class="guide-card">
        <span class="guide-tag">실업급여</span>
        <strong>자진퇴사인데도 실업급여를 받을 수 있는 예외가 있나요?</strong>
        <span>수급 조건과 퇴사 전 확인할 서류를 중심으로 정리했습니다.</span>
      </a>
      <a href="guides/annual-leave-rules/" class="guide-card">
        <span class="guide-tag">연차</span>
        <strong>입사 첫해 연차와 회계연도 기준 연차는 어떻게 다른가요?</strong>
        <span>월차, 1년 차 연차, 수당 정산까지 실제 회사에서 자주 꼬이는 부분을 다룹니다.</span>
      </a>
      <a href="guides/health-insurance-paycheck/" class="guide-card">
        <span class="guide-tag">보험</span>
        <strong>건강보험료가 오르면 실수령액은 얼마나 줄어드나요?</strong>
        <span>급여명세서를 볼 때 같이 확인해야 할 공제 구조를 설명합니다.</span>
      </a>
      <a href="guides/loan-repayment-methods/" class="guide-card">
        <span class="guide-tag">대출</span>
        <strong>원리금균등, 원금균등, 만기일시상환은 어떻게 다를까요?</strong>
        <span>금리보다 월 상환 구조를 먼저 봐야 하는 이유를 사례와 함께 정리했습니다.</span>
      </a>
    </div>
  </div>
</section>

<div class="calc-grid" id="calcGrid">`,
    'index insert focus section'
  );

  html = replaceOrThrow(
    html,
    /<section class="hero">[\s\S]*?<\/section>/,
    `<section class="hero">
  <h1>직장인 돈 계산은 <span class="end">계산왕</span>에서 끝</h1>
  <p class="subcopy">연봉, 퇴직금, 실업급여, 연차, 건강보험료, 연말정산처럼 실제 생활에 바로 닿는 계산기와 해설 가이드를 함께 제공합니다.</p>
  <div class="popular-tags">
    <span class="popular-label">많이 찾는 계산:</span>
    <a class="popular-tag" href="salary/">연봉 실수령액</a>
    <a class="popular-tag" href="retire/">퇴직금</a>
    <a class="popular-tag" href="unemploy/">실업급여</a>
    <a class="popular-tag" href="annual-leave/">연차</a>
    <a class="popular-tag" href="health-insurance/">건강보험료</a>
    <a class="popular-tag" href="guides/"><span class="tag-dot"></span> 해설 가이드</a>
  </div>
  <div class="search-bar">
    <input type="text" id="searchInput" placeholder="계산기 검색... (예: 퇴직금, 연봉, 건강보험료)" oninput="searchCalc()">
    <button>검색</button>
  </div>
</section>`,
    'index hero rewrite'
  );

  html = replaceOrThrow(
    html,
    `.scroll-top:hover{transform:translateY(-2px) !important;}`,
    `.scroll-top:hover{transform:translateY(-2px) !important;}
.content-shell{max-width:900px;margin:0 auto;padding:0 24px 28px;}
.focus-note,.guide-strip{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:24px;margin-bottom:16px;}
.focus-note h2,.guide-strip-head h2{font-size:24px;line-height:1.4;letter-spacing:-.8px;margin-bottom:10px;}
.focus-note p{font-size:14px;line-height:1.9;color:var(--muted);}
.focus-lead{font-size:11px;font-weight:800;color:var(--accent);letter-spacing:.6px;text-transform:uppercase;margin-bottom:8px;}
.guide-strip-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-end;margin-bottom:18px;}
.guide-more{display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap;}
.guide-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.guide-card{display:block;padding:18px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);text-decoration:none;color:var(--text);transition:all .2s;}
.guide-card:hover{border-color:var(--accent);transform:translateY(-2px);}
.guide-tag{display:inline-block;padding:4px 8px;border-radius:999px;background:var(--accent-light);color:var(--accent);font-size:11px;font-weight:700;margin-bottom:8px;}
.guide-card strong{display:block;font-size:15px;line-height:1.6;margin-bottom:6px;}
.guide-card span:last-child{display:block;font-size:12px;color:var(--muted);line-height:1.7;}`,
    'index css insert'
  );

  html = replaceOrThrow(
    html,
    `@media(max-width:600px){
  .calc-grid{grid-template-columns:1fr;padding:0 16px 80px;}
  nav .nav-btn{display:none;}
  .hero{padding:32px 16px 24px;}
  .logo-sub{display:none;}
}`,
    `@media(max-width:600px){
  .calc-grid{grid-template-columns:1fr;padding:0 16px 80px;}
  .content-shell{padding:0 16px 24px;}
  .guide-grid{grid-template-columns:1fr;}
  .guide-strip-head{display:block;}
  .guide-strip-head h2,.focus-note h2{font-size:20px;}
  .guide-more{margin-top:10px;}
  nav .nav-btn{display:none;}
  .hero{padding:32px 16px 24px;}
  .logo-sub{display:none;}
}`,
    'index media query update'
  );

  const removableCards = [
    'coffee-savings/',
    'youtube/',
    'bmi/',
    'bmr/',
    'dday/',
    'ovulation/',
    'lotto/',
  ];
  for (const href of removableCards) {
    const pattern = new RegExp(`<a href="${href}"[\\s\\S]*?<\\/a>\\s*`, 'g');
    html = html.replace(pattern, '');
  }

  write('index.html', html);
}

function patchAbout() {
  let html = read('about/index.html');
  html = replaceOrThrow(
    html,
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="계산왕은 직장인 급여·세금·보험·생활금융 계산과 해설 가이드를 함께 제공하는 정보 사이트입니다.">',
    'about description'
  );
  html = replaceOrThrow(
    html,
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="직장인 급여·세금·보험·생활금융 계산과 해설 가이드를 함께 제공하는 정보 사이트.">',
    'about og description'
  );
  html = replaceOrThrow(
    html,
    /<p>대한민국 직장인과 재테크족을 위한<br>무료 온라인 계산기 모음 사이트입니다\.<\/p>/,
    '<p>직장인 급여·세금·보험·생활금융 계산과<br>실제 판단에 필요한 해설 가이드를 함께 운영합니다.</p>',
    'about hero text'
  );

  if (!html.includes('계산 기준과 편집 원칙')) {
    html = replaceOrThrow(
      html,
      /<div class="section">\s*<h2>📂 제공 계산기 카테고리<\/h2>[\s\S]*?<\/div>/,
      `$&

  <div class="section">
    <h2>🧭 계산 기준과 편집 원칙</h2>
    <p>계산왕은 계산기 수를 늘리는 것보다, 실제로 많이 쓰는 계산을 정확한 기준과 함께 정리하는 방향을 우선합니다. 연봉, 퇴직금, 실업급여, 연차, 건강보험료, 연말정산, 대출이자처럼 직장인의 현금흐름과 바로 연결되는 주제를 핵심 축으로 삼고 있습니다.</p>
    <p>급여·세금·보험 관련 계산기는 국세청, 고용노동부, 국민건강보험공단, 고용보험 제도 안내 등 공식 기준을 우선 참고해 반영합니다. 다만 회사별 급여 규정, 비과세 항목, 지급 방식, 신고 시점에 따라 실제 결과는 달라질 수 있으므로 각 계산기와 가이드에는 반드시 참고용 안내를 함께 표시합니다.</p>
    <p>계산기 페이지 아래의 해설 섹션과 별도 가이드 문서는 단순 글자 수 채우기가 아니라, 사용자가 실제로 헷갈리는 질문에 답하는 형태로 편집합니다. 예를 들어 퇴직금은 평균임금 포함 항목을, 실업급여는 수급 조건과 자진퇴사 예외를, 연차는 입사 첫해와 회계연도 기준 차이를 중심으로 다룹니다.</p>
  </div>

  <div class="section">
    <h2>📚 함께 읽는 가이드</h2>
    <p>계산왕은 계산기만 나열하는 구조에서 벗어나기 위해 해설형 가이드 문서를 함께 운영하고 있습니다. 연봉 협상 시 실수령액을 어떻게 비교해야 하는지, 퇴직금 계산에서 평균임금에 포함되는 항목이 무엇인지, 자진퇴사와 실업급여 수급 조건은 어떻게 다른지처럼 계산기 한 화면만으로 설명하기 어려운 내용을 따로 정리합니다.</p>
    <p><a href="/guides/" style="color:var(--accent);font-weight:700;text-decoration:none;">가이드 모아보기 바로가기</a></p>
  </div>`,
      'about insert editorial sections'
    );
  }

  write('about/index.html', html);
}

function patchCoreGuideLinks() {
  const guideBlocks = {
    'salary/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/salary-negotiation/" class="related-btn">📘 실수령액으로 연봉 비교하기</a>
      <a href="../guides/health-insurance-paycheck/" class="related-btn">🏥 건강보험료와 월급 차이</a>
    </div>
  </div>`,
    'retire/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/severance-average-wage/" class="related-btn">📘 평균임금 포함 항목 정리</a>
      <a href="../guides/unemployment-eligibility/" class="related-btn">📋 퇴사 후 수급 조건 체크</a>
    </div>
  </div>`,
    'unemploy/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/unemployment-eligibility/" class="related-btn">📘 자진퇴사 예외와 수급 조건</a>
      <a href="../guides/severance-average-wage/" class="related-btn">📦 퇴직금과 실업급여 준비 순서</a>
    </div>
  </div>`,
    'annual-leave/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/annual-leave-rules/" class="related-btn">📘 입사 첫해 연차 기준</a>
      <a href="../guides/" class="related-btn">🗂 계산왕 가이드 모아보기</a>
    </div>
  </div>`,
    'health-insurance/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/health-insurance-paycheck/" class="related-btn">📘 건강보험료가 월급에 미치는 영향</a>
      <a href="../guides/salary-negotiation/" class="related-btn">💼 실수령액으로 조건 비교하기</a>
    </div>
  </div>`,
    'yearend/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/salary-negotiation/" class="related-btn">📘 실수령액과 공제 구조 이해하기</a>
      <a href="../guides/" class="related-btn">🗂 계산왕 가이드 모아보기</a>
    </div>
  </div>`,
    'parental-leave/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/annual-leave-rules/" class="related-btn">📘 휴직 전 연차 정리 포인트</a>
      <a href="../guides/" class="related-btn">🗂 계산왕 가이드 모아보기</a>
    </div>
  </div>`,
    'loan/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/loan-repayment-methods/" class="related-btn">📘 상환 방식별 차이 정리</a>
      <a href="../guides/" class="related-btn">🗂 계산왕 가이드 모아보기</a>
    </div>
  </div>`,
    'salary-rank/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/salary-negotiation/" class="related-btn">📘 연봉 협상에서 숫자 읽는 법</a>
      <a href="../guides/" class="related-btn">🗂 계산왕 가이드 모아보기</a>
    </div>
  </div>`,
    'payday/index.html': `
  <div class="related">
    <h2>함께 읽으면 좋은 가이드</h2>
    <div class="related-grid">
      <a href="../guides/loan-repayment-methods/" class="related-btn">📘 월 상환액과 급여일 관리</a>
      <a href="../guides/" class="related-btn">🗂 계산왕 가이드 모아보기</a>
    </div>
  </div>`,
  };

  for (const [file, block] of Object.entries(guideBlocks)) {
    let html = read(file);
    if (!html.includes('함께 읽으면 좋은 가이드')) {
      html = replaceOrThrow(
        html,
        /<div class="related">/,
        `${block}\n\n  <div class="related">`,
        `${file} guide links`
      );
      write(file, html);
    }
  }
}

function rebuildSitemap() {
  const urls = [
    ['/', 'weekly', '1.0'],
    ['/guides/', 'weekly', '0.9'],
    ['/guides/salary-negotiation/', 'monthly', '0.8'],
    ['/guides/severance-average-wage/', 'monthly', '0.8'],
    ['/guides/unemployment-eligibility/', 'monthly', '0.8'],
    ['/guides/annual-leave-rules/', 'monthly', '0.8'],
    ['/guides/health-insurance-paycheck/', 'monthly', '0.8'],
    ['/guides/loan-repayment-methods/', 'monthly', '0.8'],
    ['/salary/', 'monthly', '0.9'],
    ['/salary-rank/', 'monthly', '0.9'],
    ['/retire/', 'monthly', '0.9'],
    ['/unemploy/', 'monthly', '0.8'],
    ['/yearend/', 'monthly', '0.8'],
    ['/salary-raise/', 'monthly', '0.8'],
    ['/health-insurance/', 'monthly', '0.8'],
    ['/youth-savings/', 'monthly', '0.8'],
    ['/payday/', 'monthly', '0.8'],
    ['/income-tax/', 'monthly', '0.8'],
    ['/jeonse/', 'monthly', '0.8'],
    ['/jeonse-vs-wolse/', 'monthly', '0.8'],
    ['/cheongak/', 'monthly', '0.8'],
    ['/yangdo/', 'monthly', '0.8'],
    ['/gift-tax/', 'monthly', '0.8'],
    ['/stock/', 'monthly', '0.8'],
    ['/savings/', 'monthly', '0.8'],
    ['/deposit/', 'monthly', '0.8'],
    ['/loan/', 'monthly', '0.8'],
    ['/retirement-fund/', 'monthly', '0.7'],
    ['/freelancer/', 'monthly', '0.8'],
    ['/smartstore/', 'monthly', '0.8'],
    ['/coupang/', 'monthly', '0.8'],
    ['/baemin/', 'monthly', '0.8'],
    ['/halbu/', 'monthly', '0.7'],
    ['/cartax/', 'monthly', '0.7'],
    ['/vat/', 'monthly', '0.8'],
    ['/parental-leave/', 'monthly', '0.8'],
    ['/electricity/', 'monthly', '0.8'],
    ['/used-car-tax/', 'monthly', '0.7'],
    ['/annual-leave/', 'monthly', '0.8'],
    ['/about/', 'monthly', '0.5'],
    ['/contact/', 'monthly', '0.5'],
    ['/privacy/', 'yearly', '0.3'],
  ];

  const body = urls
    .map(
      ([loc, changefreq, priority]) =>
        `  <url><loc>https://calc.ssoxxl.com${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
    )
    .join('\n');

  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}

function createGuides() {
  const guides = [
    {
      file: 'guides/salary-negotiation/index.html',
      title: '연봉 협상할 때 세전보다 실수령액을 먼저 봐야 하는 이유',
      description: '연봉 협상과 이직 제안서를 볼 때 세전 금액보다 실수령액을 먼저 비교해야 하는 이유를 정리했습니다.',
      slug: 'salary-negotiation',
      category: '급여 가이드',
      updated: '2026-05-14',
      intro:
        '연봉 숫자가 커 보인다고 바로 좋은 조건은 아니에요. 실제로는 비과세 식대, 부양가족 수, 보험료, 공제 구조에 따라 통장에 들어오는 금액이 꽤 달라질 수 있어서 세전 연봉보다 실수령액 기준으로 비교하는 습관이 더 중요합니다.',
      sections: [
        {
          heading: '세전 연봉만 보면 놓치기 쉬운 이유',
          body: [
            '이직 제안서를 받을 때 가장 먼저 보이는 숫자는 보통 세전 연봉입니다. 그런데 생활비 계획은 세전이 아니라 실제 입금되는 월급을 기준으로 돌아갑니다. 같은 5천만 원 연봉이라도 비과세 식대가 있느냐, 부양가족 수가 몇 명이냐, 상여금이 기본급에 포함되느냐에 따라 체감 월급은 분명히 달라집니다.',
            '특히 대기업, 스타트업, 중소기업처럼 보상 구조가 다른 회사끼리 비교할 때는 더 그렇습니다. 어떤 회사는 연봉은 높아 보여도 상여 비중이 커서 월 고정 수령액은 낮을 수 있고, 다른 회사는 복지포인트 대신 비과세 수당이 많아 실수령액이 예상보다 높게 나올 수 있습니다.',
          ],
          list: [
            '세전 금액이 같아도 비과세 항목이 다르면 월 수령액 차이가 생깁니다.',
            '상여와 인센티브 비중이 높을수록 월별 체감 수입은 흔들릴 수 있습니다.',
            '연봉 협상은 숫자 자체보다 월 고정 현금흐름 기준으로 보는 편이 안전합니다.',
          ],
        },
        {
          heading: '실수령액 비교에서 꼭 같이 봐야 할 항목',
          body: [
            '실수령액을 비교할 때는 4대보험 공제와 소득세만 보는 것으로 끝나지 않습니다. 비과세 식대, 가족 수, 통근비와 같은 공제 외 항목, 상여 포함 여부, 연봉을 12개월로 나누는지 13분의 1 구조인지 같은 급여 설계 방식도 함께 봐야 합니다.',
            '또 같은 연봉이라도 회사가 제공하는 복지 중 일부는 현금 흐름에 직접 영향을 줍니다. 예를 들어 월세 지원, 교통비, 식대처럼 지출을 줄이는 항목은 실질적인 체감 소득을 높이는 역할을 합니다. 따라서 계산왕의 연봉 실수령액 계산기 결과와 함께 제안서의 급여 구성표를 나란히 보는 편이 좋습니다.',
          ],
        },
        {
          heading: '협상 전에 체크하면 좋은 질문',
          body: [
            '연봉을 올리는 협상에서는 단순히 총액만 올려달라고 말하기보다, 기본급과 고정수당, 비과세 처리 가능 항목, 상여 지급 기준을 같이 확인하는 것이 더 실질적입니다. 같은 총액 인상이라도 월 고정 수령액이 커지는 방향이 생활비 관리에는 더 도움이 되는 경우가 많습니다.',
            '신규 입사라면 첫 급여 지급일과 수습기간 급여 기준도 함께 물어보세요. 입사 첫달은 일할 계산이 적용되기 쉽고, 수습기간에 기본급 비율이 달라지면 첫 2~3개월 체감 수입이 달라질 수 있습니다.',
          ],
        },
      ],
      related: [
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../../salary-rank/', label: '연봉 순위 계산기' },
        { href: '../../health-insurance/', label: '건강보험료 계산기' },
        { href: '../health-insurance-paycheck/', label: '건강보험료와 실수령액 가이드' },
      ],
    },
    {
      file: 'guides/severance-average-wage/index.html',
      title: '퇴직금 계산에서 평균임금에 포함되는 항목은 무엇인가요?',
      description: '퇴직금 계산의 핵심인 평균임금에 어떤 항목이 포함되는지, 상여금과 연차수당은 어떻게 보는지 정리했습니다.',
      slug: 'severance-average-wage',
      category: '퇴직금 가이드',
      updated: '2026-05-14',
      intro:
        '퇴직금 계산은 공식이 단순해 보여도, 실제로는 평균임금에 어떤 항목을 넣느냐에서 차이가 크게 납니다. 퇴사 직전 3개월 급여, 상여금, 미사용 연차수당처럼 자주 헷갈리는 포인트를 먼저 정리해두면 계산 결과를 훨씬 자신 있게 읽을 수 있어요.',
      sections: [
        {
          heading: '평균임금이 왜 중요한가요?',
          body: [
            '퇴직금은 평균임금 × 30일 × 근속일수 ÷ 365 구조로 계산됩니다. 결국 퇴직금 총액을 좌우하는 핵심은 평균임금입니다. 평균임금은 퇴직일 이전 3개월 동안 지급된 임금 총액을 그 기간의 총 일수로 나눈 값이라서, 퇴사 직전 급여 변동이 있으면 결과도 함께 바뀝니다.',
            '이 때문에 퇴사 직전 성과급이 들어왔는지, 직책수당이 변했는지, 무급휴직이 있었는지 같은 요소가 실제 계산에서 중요하게 작용합니다. 단순히 현재 월급만 넣어서 보는 계산은 참고용일 뿐이고, 실제 정산 직전에는 지급 항목을 세부적으로 다시 확인해야 합니다.',
          ],
        },
        {
          heading: '상여금과 연차수당은 항상 들어가나요?',
          body: [
            '상여금과 연차수당은 무조건 자동 포함이라고 보면 위험합니다. 정기적이고 계속적으로 지급된 상여라면 평균임금 산정에 반영될 수 있지만, 일회성 포상 성격의 금액은 성격이 다를 수 있습니다. 미사용 연차수당도 언제 발생했고 언제 정산됐는지에 따라 판단 포인트가 달라질 수 있습니다.',
            '그래서 퇴직금이 예상보다 작게 나왔을 때는 가장 먼저 최근 3개월 급여명세서와 연간 상여 지급 내역을 같이 봐야 합니다. 평균임금에 포함되지 않은 항목이 있는지, 반대로 회사가 이미 별도 수당으로 처리한 항목은 없는지 확인해야 오해가 줄어듭니다.',
          ],
          list: [
            '정기 상여인지, 일회성 포상인지 구분해야 합니다.',
            '미사용 연차수당은 정산 시점과 발생 구조를 같이 봐야 합니다.',
            '퇴사 직전 3개월 급여명세서를 꼭 확보해두는 편이 좋습니다.',
          ],
        },
        {
          heading: '퇴사 전에 준비하면 좋은 자료',
          body: [
            '퇴직금 정산 전에는 최근 3개월 급여명세서, 연간 상여 지급 내역, 미사용 연차 내역, 근로계약서의 임금 구성표 정도는 미리 챙겨두는 것이 좋습니다. 나중에 계산이 맞는지 확인할 때 숫자보다 항목명이 더 중요할 때가 많기 때문입니다.',
            '특히 회사마다 식대, 직책수당, 성과급, 인센티브 이름이 다르기 때문에 본인이 실제로 어떤 성격의 돈을 받았는지 미리 정리해두면 퇴사 후 문의 과정이 훨씬 쉬워집니다.',
          ],
        },
      ],
      related: [
        { href: '../../retire/', label: '퇴직금 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../../annual-leave/', label: '연차 계산기' },
        { href: '../unemployment-eligibility/', label: '실업급여 조건 가이드' },
      ],
    },
    {
      file: 'guides/unemployment-eligibility/index.html',
      title: '자진퇴사인데도 실업급여를 받을 수 있는 예외가 있나요?',
      description: '실업급여 수급 조건과 자진퇴사 예외, 퇴사 전 챙기면 좋은 확인 사항을 한눈에 정리했습니다.',
      slug: 'unemployment-eligibility',
      category: '실업급여 가이드',
      updated: '2026-05-14',
      intro:
        '실업급여는 단순히 퇴사했다고 바로 받을 수 있는 제도가 아니에요. 다만 자진퇴사라고 해서 항상 불가능한 것도 아닙니다. 퇴사 사유와 입증 자료에 따라 예외가 갈릴 수 있어서, 퇴사 전에 먼저 확인할 항목을 알고 움직이는 편이 훨씬 유리합니다.',
      sections: [
        {
          heading: '기본 수급 조건부터 다시 정리',
          body: [
            '실업급여는 고용보험 가입 기간, 비자발적 이직 여부, 재취업 활동 가능 상태 등 여러 요건이 함께 맞아야 합니다. 많은 사람이 마지막 월급만으로 계산하려고 하지만, 실제로는 가입 기간과 퇴사 사유가 먼저 확인됩니다. 금액 계산은 조건 확인 이후의 단계라고 보는 편이 맞습니다.',
            '권고사직, 계약만료, 회사 사정으로 인한 이직은 일반적으로 많이 언급되는 사례지만, 같은 문구가 이직확인서에 어떻게 적히느냐에 따라서도 처리 흐름이 달라질 수 있습니다. 그래서 퇴사 전 회사와 어떤 사유로 정리될지 확인하는 일이 중요합니다.',
          ],
        },
        {
          heading: '자진퇴사 예외가 문제 되는 경우',
          body: [
            '자진퇴사 예외는 건강 문제, 임금체불, 장거리 출퇴근, 육아와 가족 돌봄, 직장 내 괴롭힘이나 근로조건의 중대한 변경처럼 실무에서 자주 거론됩니다. 다만 단순히 본인이 힘들었다는 사정만으로는 부족하고, 실제로 이를 뒷받침할 자료가 있는지가 중요합니다.',
            '예를 들어 임금체불이라면 급여 미지급 내역과 명세서를, 건강 문제라면 진단서와 근무 곤란 사유를, 장거리 출퇴근이라면 이전 주소와 변경 후 거리 자료를 같이 준비해야 합니다. 결국 예외 인정 여부는 상황 자체보다 자료 준비 정도에 더 크게 좌우될 수 있습니다.',
          ],
          list: [
            '퇴사 전에 이직확인서 사유가 어떻게 들어가는지 확인하세요.',
            '예외 사유는 증빙 없이는 설명만으로 통과되기 어렵습니다.',
            '실업급여 계산보다 먼저 수급 가능 여부와 가입 기간을 확인하는 편이 좋습니다.',
          ],
        },
        {
          heading: '퇴사 전에 챙기면 좋은 순서',
          body: [
            '첫째, 고용보험 가입기간과 퇴사 사유를 먼저 확인합니다. 둘째, 급여명세서와 근로계약서, 퇴직 관련 문서, 예외 사유를 입증할 자료를 정리합니다. 셋째, 계산왕 실업급여 계산기로 대략적인 금액과 기간을 본 뒤 생활비 계획을 잡는 흐름이 효율적입니다.',
            '실업급여는 금액보다 시점 관리가 더 중요한 경우도 많습니다. 마지막 급여, 퇴직금, 실업급여 첫 수급 시점 사이에 공백이 생길 수 있으니 이 기간의 현금흐름을 미리 그려두는 것이 좋습니다.',
          ],
        },
      ],
      related: [
        { href: '../../unemploy/', label: '실업급여 계산기' },
        { href: '../../retire/', label: '퇴직금 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../severance-average-wage/', label: '평균임금과 퇴직금 가이드' },
      ],
    },
    {
      file: 'guides/annual-leave-rules/index.html',
      title: '입사 첫해 연차와 회계연도 기준 연차는 어떻게 다른가요?',
      description: '입사 첫해 연차, 1년 미만 월차, 회계연도 기준 연차 운영에서 자주 헷갈리는 포인트를 정리했습니다.',
      slug: 'annual-leave-rules',
      category: '연차 가이드',
      updated: '2026-05-14',
      intro:
        '연차는 숫자만 보면 쉬워 보여도 회사마다 운영 기준이 달라서 가장 자주 오해가 생기는 영역 중 하나예요. 입사일 기준으로 보는지, 회계연도로 맞추는지, 첫해 월차와 1년 이상 근무자의 연차를 어떻게 연결하는지에 따라 체감 결과가 달라집니다.',
      sections: [
        {
          heading: '입사 첫해에 가장 많이 헷갈리는 부분',
          body: [
            '입사 후 1년 미만 근로자는 매달 개근할 때마다 연차가 생기는 구조를 먼저 이해해야 합니다. 여기서 회사가 회계연도 기준으로 휴가를 운영하면, 실제 부여와 사용 방식이 입사일 기준 계산과 다르게 보일 수 있습니다. 그래서 직원 입장에서는 “왜 내 연차가 줄어든 것처럼 보이지?”라는 오해가 생기기 쉽습니다.',
            '실제로는 제도 자체가 바뀐 것이 아니라, 회사가 관리 편의를 위해 회계연도로 정산하면서 선부여나 조정이 들어가는 경우가 많습니다. 따라서 연차 개수만 볼 게 아니라 부여 기준과 정산 시점을 같이 확인해야 정확합니다.',
          ],
        },
        {
          heading: '회계연도 기준 운영의 장단점',
          body: [
            '회계연도 기준은 회사 입장에서는 관리가 편하고, 직원 입장에서는 팀 전체 일정과 휴가 계획을 맞추기 쉽다는 장점이 있습니다. 다만 입사 시점이 애매한 경우에는 초기에 부여되는 연차 수가 입사일 기준 계산과 달라 보여 혼란이 생기기 쉽습니다.',
            '그래서 입사 첫해에는 급여명세서와 휴가관리 시스템에서 표시되는 연차 잔여일수를 그대로 믿기보다, 계산왕 연차 계산기 결과와 함께 회사 내규를 같이 확인하는 편이 좋습니다. 특히 이직 첫해와 육아휴직 전후에는 연차 정산 방식이 더 민감하게 작동할 수 있습니다.',
          ],
          list: [
            '입사일 기준과 회계연도 기준은 결과 숫자가 다르게 보일 수 있습니다.',
            '연차수당 정산은 남은 개수보다 정산 기준 시점이 더 중요합니다.',
            '입사 첫해, 휴직 전후, 퇴사 직전에는 꼭 회사 기준을 다시 확인하세요.',
          ],
        },
        {
          heading: '연차수당까지 같이 봐야 하는 이유',
          body: [
            '연차는 결국 휴가를 쓰는 문제이기도 하지만, 퇴사 직전이나 특정 시점에는 연차수당과 직접 연결됩니다. 그래서 남은 연차 개수만 보는 것보다 사용 계획과 정산 시점을 같이 보는 편이 좋습니다. 특히 퇴사 예정이라면 미사용 연차가 어떤 기준으로 수당 처리되는지 확인해야 오해를 줄일 수 있습니다.',
            '연차수당이 퇴직금 평균임금 계산과 연결될 수 있는 경우도 있기 때문에, 연차는 급여 관리 전체 흐름 안에서 보는 편이 훨씬 실용적입니다.',
          ],
        },
      ],
      related: [
        { href: '../../annual-leave/', label: '연차 계산기' },
        { href: '../../retire/', label: '퇴직금 계산기' },
        { href: '../../parental-leave/', label: '육아휴직 급여 계산기' },
        { href: '../severance-average-wage/', label: '퇴직금 평균임금 가이드' },
      ],
    },
    {
      file: 'guides/health-insurance-paycheck/index.html',
      title: '건강보험료가 오르면 실수령액은 얼마나 줄어드나요?',
      description: '건강보험료와 장기요양보험료가 월 실수령액에 어떤 영향을 주는지 급여명세서 기준으로 정리했습니다.',
      slug: 'health-insurance-paycheck',
      category: '보험 가이드',
      updated: '2026-05-14',
      intro:
        '건강보험료는 급여명세서에서 당연하게 빠지는 항목처럼 보이지만, 연봉이 바뀌거나 직장가입자와 지역가입자 상태가 바뀔 때 체감 차이가 크게 납니다. 월급이 올랐는데 생각보다 손에 남는 돈이 적다면 건강보험료와 장기요양보험료 구조를 먼저 확인해볼 필요가 있어요.',
      sections: [
        {
          heading: '실수령액에서 건강보험료가 체감되는 순간',
          body: [
            '연봉 인상 직후, 이직 직후, 육아휴직 복귀 이후처럼 보수월액이 바뀌는 구간에서는 건강보험료 차이가 더 또렷하게 느껴집니다. 단순히 보험료 한 항목만 오르는 것이 아니라 장기요양보험료도 함께 연결되기 때문에, 실제 급여명세서에서는 생각보다 공제액이 빠르게 커지는 느낌을 받을 수 있습니다.',
            '특히 실수령액 비교를 할 때는 소득세보다 건강보험료 차이가 먼저 눈에 들어오는 경우도 많습니다. 고정비가 많은 가구라면 월 3만 원, 5만 원의 차이도 체감이 크기 때문에 계산왕 건강보험료 계산기와 연봉 실수령액 계산기를 같이 보는 편이 좋습니다.',
          ],
        },
        {
          heading: '직장가입자와 지역가입자의 관점이 다른 이유',
          body: [
            '직장가입자는 주로 보수월액 중심으로 보험료를 체감하지만, 지역가입자는 소득 외에 재산과 자동차 등도 함께 고려될 수 있어 완전히 다른 구조로 느껴집니다. 퇴사 후 지역가입으로 전환되는 시점에는 급여 계산기에서 보던 감각으로는 체감이 잘 안 잡힐 수 있습니다.',
            '그래서 직장인이 퇴사를 앞두고 있다면 단순히 현재 급여명세서만 보는 것보다, 퇴사 후 어떤 형태로 보험료 부담이 달라질 수 있는지까지 같이 가늠해야 합니다. 실업급여, 퇴직금, 건강보험료는 퇴사 직후 현금흐름에서 같이 움직이는 경우가 많습니다.',
          ],
          list: [
            '연봉 인상 직후 실수령액 차이가 생각보다 작다면 건강보험료 증가분을 먼저 보세요.',
            '퇴사나 휴직처럼 자격 상태가 바뀌는 시점은 별도로 계산하는 편이 좋습니다.',
            '장기요양보험료는 건강보험료와 함께 움직여 체감 공제를 더 키울 수 있습니다.',
          ],
        },
        {
          heading: '급여명세서를 읽을 때 함께 볼 항목',
          body: [
            '건강보험료만 따로 보는 것보다 국민연금, 고용보험, 소득세와 같이 보면 연봉 조건을 더 정확히 읽을 수 있습니다. 회사가 제시하는 세전 연봉보다 월 실수령액이 궁금한 이유는 결국 여러 공제가 한 번에 빠져나가기 때문입니다.',
            '연봉 협상, 이직, 복귀, 퇴사 같은 상황에서는 건강보험료가 단순 비용이 아니라 전체 현금흐름의 일부라는 관점으로 읽어두는 편이 좋습니다.',
          ],
        },
      ],
      related: [
        { href: '../../health-insurance/', label: '건강보험료 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../../salary-raise/', label: '연봉 인상률 계산기' },
        { href: '../salary-negotiation/', label: '실수령액 중심 연봉 비교 가이드' },
      ],
    },
    {
      file: 'guides/loan-repayment-methods/index.html',
      title: '원리금균등, 원금균등, 만기일시상환은 어떻게 다를까요?',
      description: '대출 상환 방식에 따라 월 상환액과 총이자가 어떻게 달라지는지 실제 생활비 관점에서 정리했습니다.',
      slug: 'loan-repayment-methods',
      category: '대출 가이드',
      updated: '2026-05-14',
      intro:
        '대출 비교를 할 때 금리만 보면 놓치는 게 많아요. 같은 금리라도 상환 방식에 따라 첫 달 부담, 총이자, 중도상환 전략이 완전히 달라집니다. 그래서 대출은 숫자 하나보다 월 상환 구조를 같이 읽는 습관이 더 중요합니다.',
      sections: [
        {
          heading: '원리금균등은 왜 가장 많이 쓰일까요?',
          body: [
            '원리금균등은 매달 내는 금액이 일정해서 생활비 계획을 세우기 가장 쉽습니다. 월급날과 고정비를 기준으로 돈을 관리하는 직장인에게는 예측 가능성이 큰 장점입니다. 다만 초반에는 이자 비중이 상대적으로 높아 총이자만 놓고 보면 아쉬울 수 있습니다.',
            '그래서 대출 기간이 길고 현금흐름 안정이 더 중요한 사람에게는 원리금균등이 편할 수 있습니다. 반대로 여유 자금이 있고 총이자를 조금이라도 줄이고 싶다면 다른 방식이 더 맞을 수 있습니다.',
          ],
        },
        {
          heading: '원금균등과 만기일시상환은 어떤 사람이 더 잘 맞을까요?',
          body: [
            '원금균등은 초반 상환액이 크지만 시간이 갈수록 부담이 줄어드는 구조입니다. 월급 상승이 예상되거나 초반 자금 여력이 있는 경우에는 총이자를 줄이는 데 도움이 될 수 있습니다. 다만 첫 1년의 현금흐름 압박을 견딜 수 있는지가 더 중요합니다.',
            '만기일시상환은 당장 월 부담은 작아 보여도 만기 시점에 큰 원금 상환이 남습니다. 그래서 실제로는 상환 계획이 분명한 사람에게만 맞는 경우가 많고, 단순히 월 납입액이 적다는 이유로 선택하면 오히려 위험할 수 있습니다.',
          ],
          list: [
            '원리금균등: 월 납입액 안정이 필요한 경우',
            '원금균등: 총이자 절감이 중요하고 초반 부담을 감당할 수 있는 경우',
            '만기일시상환: 만기 시점 상환 계획이 명확한 경우',
          ],
        },
        {
          heading: '대출 계산기를 볼 때 같이 판단할 포인트',
          body: [
            '대출 이자 계산기 결과는 숫자를 보여주지만, 실제 의사결정은 월급날, 고정지출, 비상자금, 향후 소득 변화와 함께 봐야 합니다. 월 상환액이 20만 원 차이 나도 생활비 여유가 달라질 수 있기 때문에, 실수령액 계산기와 함께 놓고 비교하는 편이 실용적입니다.',
            '특히 카드대금, 월세, 보육비처럼 날짜가 고정된 지출이 있다면 월급날 계산기와 함께 보는 것도 좋은 방법입니다. 결국 대출은 금리 비교보다 현금흐름 관리 문제에 가깝습니다.',
          ],
        },
      ],
      related: [
        { href: '../../loan/', label: '대출 이자 계산기' },
        { href: '../../payday/', label: '월급날 계산기' },
        { href: '../../salary/', label: '연봉 실수령액 계산기' },
        { href: '../../deposit/', label: '예금 이자 계산기' },
      ],
    },
  ];

  for (const guide of guides) {
    write(guide.file, createGuidePage(guide));
  }

  const guidesIndex = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8390635644947402" crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>계산왕 가이드 — 급여·세금·보험·생활금융 해설 모음</title>
<meta name="description" content="연봉, 퇴직금, 실업급여, 연차, 건강보험료, 대출 상환 방식까지 계산왕 해설 가이드를 모아봤어요.">
<link rel="canonical" href="https://calc.ssoxxl.com/guides/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="계산왕">
<meta property="og:title" content="계산왕 가이드 — 급여·세금·보험·생활금융 해설 모음">
<meta property="og:description" content="계산 결과를 읽는 법까지 함께 정리한 계산왕 가이드 모음입니다.">
<meta property="og:url" content="https://calc.ssoxxl.com/guides/">
<meta property="og:image" content="https://calc.ssoxxl.com/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="계산왕 가이드 — 급여·세금·보험·생활금융 해설 모음">
<meta name="twitter:description" content="연봉, 퇴직금, 실업급여, 연차, 건강보험료, 대출 상환 방식까지 계산왕 해설 가이드를 모아봤어요.">
<meta name="twitter:image" content="https://calc.ssoxxl.com/og-image.svg">
<meta name="daumoa-verification" content="52638bd43577858cdf80a388c3bf173be6b9be4914b8bde1a3b347cf6786f5b4:Xj5dg0WfAX454QfLeg8nBA==">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="shortcut icon" href="/favicon.svg">
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
body{background:var(--bg);color:var(--text);font-family:'Noto Sans KR',sans-serif;}
header{background:var(--surface);border-bottom:2px solid var(--border);padding:0 24px;height:56px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100;}
.logo{font-size:18px;font-weight:900;letter-spacing:-1px;display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--text);}
.logo-badge{background:#0a0a0f;color:#FFD700;font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px;border:1px solid #D4A017;font-family:'Courier New',monospace;}
.back-btn{margin-left:auto;padding:6px 14px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:inherit;font-size:13px;text-decoration:none;}
.wrap{max-width:920px;margin:0 auto;padding:34px 24px 60px;}
.hero{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:28px;margin-bottom:20px;}
.hero h1{font-size:32px;letter-spacing:-1px;margin-bottom:10px;}
.hero p{font-size:15px;color:var(--muted);line-height:1.9;}
.guide-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;}
.guide-card{display:block;background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:20px;text-decoration:none;color:var(--text);}
.guide-card:hover{border-color:var(--accent);}
.guide-tag{display:inline-block;padding:4px 8px;border-radius:999px;background:var(--accent-light);color:var(--accent);font-size:11px;font-weight:700;margin-bottom:10px;}
.guide-card strong{display:block;font-size:18px;line-height:1.5;margin-bottom:8px;}
.guide-card p{font-size:14px;color:var(--muted);line-height:1.8;}
.guide-card span.meta{display:block;font-size:12px;color:var(--muted);margin-top:10px;}
.note{background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:20px;margin-top:20px;font-size:14px;color:var(--muted);line-height:1.9;}
footer{background:#1a1a18;color:rgba(255,255,255,.5);text-align:center;padding:24px;font-size:12px;margin-top:40px;}
footer strong{color:#fff;}
@media(max-width:640px){.wrap{padding:18px 14px 48px;}.guide-grid{grid-template-columns:1fr;}.hero h1{font-size:26px;}}
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
  <a href="../" class="logo"><span>계산왕</span><span class="logo-badge">王</span></a>
  <a href="../" class="back-btn">← 홈으로</a>
</header>
<div class="wrap">
  <div class="hero">
    <h1>계산왕 가이드</h1>
    <p>계산기 숫자만으로는 설명하기 어려운 내용을 따로 정리했습니다. 급여, 퇴직금, 실업급여, 연차, 건강보험료, 대출 상환 방식처럼 실제로 많이 헷갈리는 주제를 직장인 관점에서 읽기 쉽게 풀어냅니다.</p>
  </div>
  <div class="guide-grid">
    <a href="./salary-negotiation/" class="guide-card"><span class="guide-tag">급여</span><strong>연봉 협상할 때 세전보다 실수령액을 먼저 봐야 하는 이유</strong><p>비과세 식대, 가족 수, 상여 구조까지 함께 읽어야 실제 조건 비교가 쉬워집니다.</p><span class="meta">관련 계산기: 연봉 실수령액 · 연봉 순위</span></a>
    <a href="./severance-average-wage/" class="guide-card"><span class="guide-tag">퇴직금</span><strong>퇴직금 계산에서 평균임금에 포함되는 항목은 무엇인가요?</strong><p>상여금, 연차수당, 직전 3개월 급여 변동이 퇴직금에 미치는 영향을 정리했습니다.</p><span class="meta">관련 계산기: 퇴직금 · 연차</span></a>
    <a href="./unemployment-eligibility/" class="guide-card"><span class="guide-tag">실업급여</span><strong>자진퇴사인데도 실업급여를 받을 수 있는 예외가 있나요?</strong><p>수급 조건과 퇴사 전 챙겨야 할 자료를 중심으로 실무형으로 정리했습니다.</p><span class="meta">관련 계산기: 실업급여 · 퇴직금</span></a>
    <a href="./annual-leave-rules/" class="guide-card"><span class="guide-tag">연차</span><strong>입사 첫해 연차와 회계연도 기준 연차는 어떻게 다른가요?</strong><p>입사 첫해 월차, 회계연도 운영, 연차수당 정산 포인트를 함께 다룹니다.</p><span class="meta">관련 계산기: 연차 · 육아휴직</span></a>
    <a href="./health-insurance-paycheck/" class="guide-card"><span class="guide-tag">보험</span><strong>건강보험료가 오르면 실수령액은 얼마나 줄어드나요?</strong><p>급여명세서를 읽을 때 건강보험료와 장기요양보험료를 어떻게 봐야 하는지 설명합니다.</p><span class="meta">관련 계산기: 건강보험료 · 연봉 실수령액</span></a>
    <a href="./loan-repayment-methods/" class="guide-card"><span class="guide-tag">대출</span><strong>원리금균등, 원금균등, 만기일시상환은 어떻게 다를까요?</strong><p>금리만이 아니라 월 상환 구조를 같이 봐야 하는 이유를 실제 생활비 관점으로 정리했습니다.</p><span class="meta">관련 계산기: 대출 이자 · 월급날</span></a>
  </div>
  <div class="note">계산왕은 계산기만 나열하는 대신, 실제로 검색되는 질문과 공식 기준을 함께 정리하는 방향으로 콘텐츠를 운영합니다. 이 가이드 문서는 계산 결과 해석을 돕기 위한 참고 자료이며, 회사 규정이나 제도 개편에 따라 실제 적용 결과가 달라질 수 있습니다.</div>
</div>
<footer><strong>계산왕</strong> — 계산과 해설을 함께 제공하는 직장인 정보 사이트</footer>
</body>
</html>`;

  write('guides/index.html', guidesIndex);
}

function main() {
  patchIndex();
  patchAbout();
  patchCoreGuideLinks();
  createGuides();
  rebuildSitemap();

  [
    'lotto/index.html',
    'bmi/index.html',
    'bmr/index.html',
    'dday/index.html',
    'ovulation/index.html',
    'youtube/index.html',
    'coffee-savings/index.html',
  ].forEach(addNoindex);
}

main();

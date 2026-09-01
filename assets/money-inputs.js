(() => {
  const moneyWords = /원|금액|급여|월급|연봉|소득|가격|가액|비용|보증금|대출|월세|자금|매출|매입|납입|보험료|본인부담|재산|세액|자산|부채|원금|투자금|시가|평가액/;
  const excludedWords = /퍼센트|비율|금리|세율|개월|기간|연수|나이|수량|점수|cc|배기량|시간|일수/;
  const formatted = new Set();

  const digits = value => String(value ?? '').replace(/[^0-9-]/g, '');
  const format = input => {
    const raw = digits(input.value);
    if (!raw || raw === '-') { input.value = raw; return; }
    const negative = raw.startsWith('-');
    const value = raw.replace('-', '');
    input.value = (negative ? '-' : '') + Number(value).toLocaleString('ko-KR');
  };
  const unformatAll = () => formatted.forEach(input => { input.value = digits(input.value); });
  const formatAll = () => formatted.forEach(format);

  document.querySelectorAll('input').forEach(input => {
    const field = input.closest('.field');
    const label = field?.querySelector('label')?.textContent || '';
    if (!moneyWords.test(label) || excludedWords.test(label)) return;
    input.type = 'text';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    formatted.add(input);
    format(input);
    input.addEventListener('input', () => format(input));
    input.addEventListener('focus', () => input.select());
  });

  // 기존 계산기들이 Number(input.value)를 사용하므로 계산 직전에 구분기호를 제거한다.
  document.addEventListener('click', event => {
    if (!event.target.closest('button')) return;
    unformatAll();
    setTimeout(formatAll, 0);
  }, true);
  document.addEventListener('submit', unformatAll, true);
})();

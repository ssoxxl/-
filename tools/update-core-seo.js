const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const googleTagSnippet = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5E3YW37RYV"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-5E3YW37RYV');
</script>`;

const targetSections = {
  'salary/index.html': `
  <div class="desc-section">
    <h2>이 계산이 특히 필요한 순간</h2>
    <p>연봉 협상을 앞두고 세전 금액만 보고 판단하기 어려울 때, 이직 제안서를 받았는데 월 실수령액이 감이 오지 않을 때, 부양가족 수나 비과세 수당이 바뀌어 실제 통장 입금액을 다시 확인해야 할 때 가장 많이 찾는 계산기입니다. 세전 연봉은 같아도 4대보험, 소득세, 지방소득세 반영 방식에 따라 체감 월급은 달라질 수 있습니다.</p>
    <h2>실수령액은 어떻게 계산하나요?</h2>
    <p>기본 구조는 세전 연봉을 월 급여로 나눈 뒤 근로자 부담 4대보험과 추정 세금을 차감하는 방식입니다. 계산왕에서는 국민연금, 건강보험, 장기요양보험, 고용보험과 함께 근로소득세, 지방소득세를 반영해 월 기준 예상 실수령액을 보여줍니다. 같은 연봉이라도 비과세 식대, 가족 수, 상여 포함 여부에 따라 실제 지급액은 달라질 수 있습니다.</p>
    <div class="faq-item">
      <div class="faq-q">주요 반영 항목</div>
      <div class="faq-a">국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세를 순서대로 차감합니다. 식대처럼 비과세로 처리되는 금액은 과세표준을 낮추는 역할을 합니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">연봉 3,600만원, 부양가족 1명, 비과세 월 20만원 기준이면 월 실수령액은 대략 260만원 안팎으로 계산됩니다. 동일 연봉이라도 비과세가 없으면 체감 월급이 조금 더 줄어듭니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">연봉 5,000만원이면 공제 총액이 함께 커지므로 단순히 12로 나눈 금액보다 차이가 꽤 납니다. 실수령액은 월 340만원대 전후로 보는 경우가 많지만 회사별 비과세, 복리후생 수당 구성에 따라 달라집니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">자주 헷갈리는 점</div>
      <div class="faq-a">상여금이 별도인지 포함인지, 식대가 비과세인지, 자녀 수에 따른 공제가 있는지에 따라 결과가 바뀝니다. 입사 첫달이나 중도 퇴사월은 정상 월급 기준 계산과 다를 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">활용 팁</div>
      <div class="faq-a">연봉 협상 전에는 세전 연봉보다 월 실수령액 기준으로 비교하는 편이 생활비 계획에 훨씬 유리합니다. 비과세 항목을 따로 입력해두면 체감치에 더 가까운 결과를 볼 수 있습니다.</div>
    </div>
    <p><strong>안내:</strong> 이 페이지는 2026년 기준 요율과 일반적인 공제 구조를 바탕으로 한 간이 계산입니다. 실제 급여명세서에는 회사 규정, 비과세 수당, 연말정산 결과가 반영되므로 최종 수령액과 차이가 날 수 있습니다.</p>
  </div>
`,
  'retire/index.html': `
  <div class="desc-section">
    <h2>퇴직금 계산이 필요한 대표 상황</h2>
    <p>퇴사 시점이 다가와 예상 수령액을 먼저 확인하고 싶을 때, 이직 제안을 받았는데 퇴사 타이밍을 고민할 때, 평균임금에 포함되는 항목이 헷갈릴 때 많이 쓰는 계산기입니다. 퇴직금은 단순히 월급 한 달치가 아니라 평균임금과 근속일수를 기준으로 산정됩니다.</p>
    <h2>계산 기준과 공식</h2>
    <p>기본 공식은 평균임금 × 30일 × 근속일수 ÷ 365입니다. 여기서 평균임금은 통상 최근 3개월 동안 지급된 임금 총액을 그 기간의 총일수로 나눈 금액을 뜻합니다. 상여금, 연차수당, 식대처럼 어떤 항목이 포함되는지는 실제 지급 형태에 따라 달라질 수 있습니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">월 평균임금 12만원, 근속기간 3년이라면 근속일수는 약 1,095일이고 퇴직금은 약 1,080만원 수준으로 계산됩니다. 실제 지급액은 세전 기준입니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">근속기간이 1년 6개월처럼 애매한 경우도 일수로 환산해서 계산해야 합니다. 같은 월급이라도 근속일수가 조금만 달라져도 수령액 차이가 생깁니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">무엇이 평균임금에 들어가나요?</div>
      <div class="faq-a">정기적이고 계속적으로 지급된 임금은 평균임금에 포함될 가능성이 높습니다. 다만 실비변상 성격 수당이나 일시적 포상은 제외될 수 있어 급여명세서를 따로 확인하는 편이 좋습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">1년 미만도 퇴직금이 나오나요?</div>
      <div class="faq-a">법정 퇴직금은 계속근로기간이 1년 이상이고 주당 소정근로시간 요건을 충족해야 합니다. 1년 미만이면 일반적으로 법정 퇴직금 대상이 아닙니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">체크하면 좋은 점</div>
      <div class="faq-a">퇴사 직전 3개월 동안 급여 변동이 있었다면 평균임금이 크게 달라질 수 있습니다. 연차 미사용수당, 성과급 지급 시점도 함께 보면 실제 체감 금액을 더 정확히 가늠할 수 있습니다.</div>
    </div>
    <p><strong>안내:</strong> 이 계산기는 2026년 기준 일반적인 퇴직금 산식으로 계산한 참고값입니다. 평균임금 포함 항목과 계속근로기간 인정 범위는 회사별 자료와 실제 근로 형태에 따라 달라질 수 있습니다.</p>
  </div>
`,
  'unemploy/index.html': `
  <div class="desc-section">
    <h2>실업급여를 미리 계산해두면 좋은 경우</h2>
    <p>퇴사를 고민 중이거나 권고사직 통보를 받은 상황, 수급 가능 기간을 대략 파악하고 생활비 계획을 세워야 하는 상황에서 실업급여 계산이 필요합니다. 실업급여는 단순히 마지막 월급의 일정 비율이 아니라 평균임금, 연령, 고용보험 가입기간에 따라 달라집니다.</p>
    <h2>계산 원리 요약</h2>
    <p>일반적으로 1일 구직급여액은 퇴직 전 평균임금의 일정 비율을 기준으로 산정하되 상한액과 하한액 범위 안에서 결정됩니다. 여기에 연령과 고용보험 가입기간에 따라 정해진 소정급여일수를 곱해 총 수급 예상액을 계산합니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">1일 평균임금이 9만원이고 상한액 범위 안에 들어간다면 1일 수급액은 비율 적용 후 계산됩니다. 여기에 예를 들어 180일 수급이 가능하면 총액은 1일 수급액 × 180일로 볼 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">일급이 높더라도 상한액을 넘으면 상한 기준으로 계산됩니다. 그래서 고연봉자라고 해도 체감 수급액은 급여 대비 낮게 느껴질 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">수급일수는 무엇으로 달라지나요?</div>
      <div class="faq-a">나이와 피보험기간이 핵심입니다. 보통 나이가 높고 가입기간이 길수록 수급일수가 길어지는 구조라 같은 급여라도 총 수급액 차이가 납니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">자진퇴사면 무조건 못 받나요?</div>
      <div class="faq-a">원칙적으로는 제한이 있지만 임금체불, 통근 곤란, 계약 종료 같은 정당한 이직 사유가 인정되면 예외가 있을 수 있습니다. 실제 수급 여부는 고용센터 판단이 중요합니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">준비 팁</div>
      <div class="faq-a">퇴사 전에는 이직확인서, 근로계약서, 급여명세서, 사유 입증 자료를 미리 챙겨두는 편이 좋습니다. 계산기로 대략 규모를 확인한 뒤 고용센터 상담으로 실제 요건을 점검하면 훨씬 수월합니다.</div>
    </div>
    <p><strong>안내:</strong> 2026년 기준 일반 규정을 반영한 참고 계산이며, 실제 수급 여부와 지급일수는 퇴사 사유, 피보험단위기간, 고용센터 심사 결과에 따라 달라질 수 있습니다.</p>
  </div>
`,
  'annual-leave/index.html': `
  <div class="desc-section">
    <h2>연차 계산이 필요한 현실적인 상황</h2>
    <p>입사 1년 미만이라 매달 생기는 연차를 확인해야 할 때, 1년이 지난 뒤 부여되는 연차가 몇 개인지 헷갈릴 때, 퇴사 전에 남은 연차수당을 계산하고 싶을 때 가장 많이 쓰입니다. 연차는 근속연수와 출근율에 따라 달라져서 단순히 매년 같은 개수로 보는 방식이 맞지 않습니다.</p>
    <h2>기본 기준</h2>
    <p>입사 1년 미만 근로자는 보통 1개월 개근 시 1일의 연차가 발생합니다. 1년 이상이 되면 전년도 출근율이 80% 이상일 경우 15일이 기본으로 부여되고, 이후 근속연수에 따라 가산되는 구조가 적용됩니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">2026년 3월 입사자가 2026년 동안 매달 개근했다면 입사 1년 전까지는 월별 발생 연차를 기준으로 사용할 수 있습니다. 이후 1년이 넘는 시점부터는 연간 부여 구조가 적용됩니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">입사 3년차 근로자라면 기본 15일에 근속 가산 여부가 붙을 수 있습니다. 다만 실제 사용 가능일수는 이미 사용한 연차와 회사의 회계연도 운영 방식에 따라 달라집니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">입사일 기준과 회계연도 기준은 뭐가 다른가요?</div>
      <div class="faq-a">법정 원칙은 입사일 기준 계산이지만 회사에 따라 관리 편의를 위해 회계연도 기준으로 운영하기도 합니다. 이 경우 중간 입사자는 첫해 연차 개수가 조정될 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">연차수당은 어떻게 보나요?</div>
      <div class="faq-a">남은 연차일수에 1일 통상임금 또는 평균임금 기준 금액을 곱해 예상할 수 있습니다. 회사 취업규칙에 따라 산정 방식이 달라질 수 있으니 지급 기준을 꼭 함께 확인해야 합니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">주의할 점</div>
      <div class="faq-a">출근율 80% 기준, 휴직 기간 처리, 회계연도 전환 여부가 연차 결과를 크게 바꿉니다. 퇴사 직전에는 남은 연차와 소멸 예정일을 함께 체크하는 편이 좋습니다.</div>
    </div>
    <p><strong>안내:</strong> 이 계산기는 2026년 기준 일반적인 연차 규정을 바탕으로 한 참고용입니다. 실제 부여 방식은 출근율, 회사 운영 기준, 취업규칙에 따라 달라질 수 있습니다.</p>
  </div>
`,
  'yearend/index.html': `
  <div class="desc-section">
    <h2>연말정산 미리보기가 도움이 되는 순간</h2>
    <p>매년 1~2월쯤 환급을 받을지 추가 납부가 생길지 미리 가늠하고 싶을 때, 카드 사용액이나 보험료, 교육비 공제가 얼마나 반영되는지 확인하고 싶을 때 유용합니다. 연말정산은 단순히 월급에서 미리 뗀 세금을 돌려받는 절차가 아니라 한 해 전체 소득과 공제 내역을 다시 정리하는 과정입니다.</p>
    <h2>어떤 항목을 보는 계산기인가요?</h2>
    <p>총급여와 이미 납부한 세액을 바탕으로 기본공제, 신용카드 사용액, 보험료, 교육비, 의료비, 기부금 같은 대표 공제 항목을 반영해 예상 환급 또는 추가 납부 흐름을 확인할 수 있도록 구성됩니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">총급여가 비슷해도 신용카드 사용액이 적거나 공제 대상 가족이 없으면 환급액이 크게 줄 수 있습니다. 반대로 보험료, 교육비, 월세 세액공제 요건이 맞으면 체감 환급액이 커질 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">중도 입사자는 이전 회사 원천징수 내역 합산 여부에 따라 결과가 달라집니다. 이직이 있었던 해라면 더 꼼꼼하게 자료를 챙겨야 합니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">왜 매년 결과가 달라지나요?</div>
      <div class="faq-a">소득 자체가 달라질 수도 있고, 카드 사용 구조나 부양가족, 의료비 지출, 월세 여부가 바뀌기 때문입니다. 같은 연봉이라도 공제 항목이 바뀌면 환급 방향이 달라질 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">놓치기 쉬운 항목은?</div>
      <div class="faq-a">월세 세액공제, 안경 구입비 포함 의료비, 자녀 교육비, 기부금 영수증 누락이 자주 발생합니다. 국세청 간소화 자료에 없는 항목은 직접 챙겨야 합니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">활용 팁</div>
      <div class="faq-a">연말이 되기 전에 카드 사용액, 연금저축 납입액, 기부금 계획을 미리 조정하면 환급 전략을 세우는 데 도움이 됩니다. 계산기 결과를 보고 부족한 공제 항목이 없는지 점검해보면 좋습니다.</div>
    </div>
    <p><strong>안내:</strong> 2026년 세법 구조를 기준으로 한 간이 추정값이며, 실제 연말정산 결과는 회사 원천징수 방식과 개인 공제 증빙에 따라 달라질 수 있습니다.</p>
  </div>
`,
  'health-insurance/index.html': `
  <div class="desc-section">
    <h2>건강보험료를 미리 보는 이유</h2>
    <p>연봉 인상 후 실수령액이 얼마나 줄어드는지 확인하고 싶을 때, 직장가입자와 지역가입자 보험료 차이를 가늠해야 할 때, 급여명세서의 공제액이 맞는지 확인하고 싶을 때 자주 쓰입니다. 건강보험료는 국민연금과 달리 장기요양보험료가 함께 붙어 체감 공제액이 더 커 보일 수 있습니다.</p>
    <h2>계산 구조</h2>
    <p>직장가입자는 보수월액에 건강보험 요율을 곱한 뒤 장기요양보험료를 추가로 계산하는 방식이 기본입니다. 지역가입자는 소득과 재산, 자동차 등 별도 기준이 함께 반영되므로 단순 급여 계산보다 복잡합니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">월 보수 300만원이라면 건강보험료와 장기요양보험료를 각각 계산해 근로자 부담분을 확인할 수 있습니다. 급여가 오르면 보험료도 함께 증가해 체감 실수령액 차이가 생깁니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">직장가입에서 지역가입으로 전환되면 같은 소득이라도 재산 반영 여부 때문에 보험료가 달라질 수 있습니다. 프리랜서 전환이나 퇴사 직후에는 특히 비교가 필요합니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">장기요양보험료는 왜 따로 붙나요?</div>
      <div class="faq-a">건강보험료를 기준으로 일정 비율이 추가 부과됩니다. 그래서 급여명세서에서 건강보험과 장기요양보험이 별도 항목으로 보이는 경우가 많습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">회사 부담도 있나요?</div>
      <div class="faq-a">직장가입자의 경우 회사와 근로자가 나눠 부담하는 구조입니다. 계산기에서 보는 값은 보통 근로자 본인 부담분 기준입니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">확인 팁</div>
      <div class="faq-a">연봉협상이나 이직 비교를 할 때는 건강보험료와 장기요양보험료를 함께 봐야 실제 월급 체감이 맞아집니다. 지역가입 예상이라면 재산 영향도 따로 확인해야 합니다.</div>
    </div>
    <p><strong>안내:</strong> 2026년 기준 일반 요율을 바탕으로 한 참고값입니다. 실제 보험료는 보수월액 확정, 지역가입 산정 요소, 자격 변동 시점에 따라 달라질 수 있습니다.</p>
  </div>
`,
  'parental-leave/index.html': `
  <div class="desc-section">
    <h2>육아휴직 급여 계산이 필요한 경우</h2>
    <p>출산 후 육아휴직을 계획하면서 월별 수입 공백을 계산해야 할 때, 맞돌봄 6+6 제도 적용 여부를 따져봐야 할 때, 회사 급여와 고용보험 급여를 구분해서 보고 싶을 때 도움이 됩니다. 육아휴직은 제도 구간과 기간별 상한이 달라서 단순 월급 비례로 보기 어렵습니다.</p>
    <h2>계산 기준 정리</h2>
    <p>통상임금 또는 육아휴직 개시 전 임금 수준을 바탕으로 월 지급액을 계산하되, 기간별 상한과 하한이 적용됩니다. 맞돌봄 대상 여부, 개시 시점, 휴직 개월 수에 따라 월별 수령액이 달라질 수 있습니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">통상임금이 높더라도 상한액이 적용되면 월 수령액이 일정 수준에서 제한됩니다. 그래서 고연봉자일수록 체감 대체율이 낮게 느껴질 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">부부가 순차적으로 육아휴직을 쓰는 경우 특정 기간에는 맞돌봄 제도가 적용되어 월 수령액이 달라질 수 있습니다. 단독 육아휴직과 비교해 기간별 차이를 확인해보는 것이 좋습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">회사 급여와 같은가요?</div>
      <div class="faq-a">아닙니다. 육아휴직 급여는 고용보험에서 지급되는 제도 급여 기준으로 보는 경우가 일반적입니다. 회사가 별도로 지원금을 얹어주는 경우는 별개입니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">언제부터 신청하나요?</div>
      <div class="faq-a">휴직 개시 전후로 회사 승인 절차와 고용보험 신청 절차를 각각 챙겨야 합니다. 서류 누락이 있으면 첫 지급이 늦어질 수 있어 미리 준비하는 편이 좋습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">생활비 계획 팁</div>
      <div class="faq-a">월별 상한이 적용되기 때문에 실제 통장 유입액은 휴직 전 월급보다 줄어드는 경우가 많습니다. 고정비와 육아비를 먼저 정리한 뒤 계산기 결과로 현금흐름을 맞춰보면 도움이 됩니다.</div>
    </div>
    <p><strong>안내:</strong> 2026년 제도 기준을 바탕으로 한 참고 계산이며, 실제 지급 여부와 지급액은 고용보험 적용 상태, 제도 요건 충족 여부, 신청 시점에 따라 달라질 수 있습니다.</p>
  </div>
`,
  'loan/index.html': `
  <div class="desc-section">
    <h2>대출이자 계산기를 먼저 보는 이유</h2>
    <p>주택담보대출, 신용대출, 전세자금대출을 비교할 때는 금리만 보는 것보다 월 상환액과 총이자를 함께 봐야 합니다. 같은 금리라도 원리금균등, 원금균등, 만기일시상환 방식에 따라 부담 시점이 완전히 달라지기 때문입니다.</p>
    <h2>계산 방식 이해하기</h2>
    <p>대출금액, 금리, 기간, 상환 방식을 입력하면 월 납입액과 총이자 규모를 추정할 수 있습니다. 원리금균등은 매달 같은 금액을 내는 대신 초반 이자 비중이 높고, 원금균등은 초기 납입액이 크지만 총이자가 줄어드는 경향이 있습니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">3,000만원을 연 5%로 3년 동안 원리금균등 상환하면 매달 비슷한 금액을 내게 됩니다. 반면 원금균등으로 바꾸면 첫 달 부담은 커지지만 총이자 규모는 더 작아질 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">만기일시상환은 매달 이자만 내다가 만기에 원금을 한 번에 갚는 구조라 초기 현금흐름은 편하지만 만기 리스크를 꼭 같이 봐야 합니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">고정금리와 변동금리는 어떻게 보나요?</div>
      <div class="faq-a">현재 계산 결과는 입력한 금리를 기준으로 한 참고값입니다. 변동금리 대출은 시장금리 변화에 따라 실제 상환액이 달라질 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">중도상환수수료는 포함되나요?</div>
      <div class="faq-a">보통 기본 상환액 계산에는 포함되지 않습니다. 조기상환을 계획 중이라면 수수료와 우대금리 조건까지 따로 비교해야 실제 비용이 맞습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">활용 팁</div>
      <div class="faq-a">은행 상담 전 여러 금리와 기간을 바꿔보면서 월 부담 상한선을 먼저 정해두면 의사결정이 쉬워집니다. 총이자만 보지 말고 초반 현금흐름도 함께 확인하는 게 중요합니다.</div>
    </div>
    <p><strong>안내:</strong> 2026년 기준 일반적인 이자 계산식으로 추정한 참고값입니다. 실제 대출은 우대금리, 변동금리, 중도상환수수료, 상환일 기준에 따라 달라질 수 있습니다.</p>
  </div>
`,
  'salary-rank/index.html': `
  <div class="desc-section">
    <h2>연봉 순위를 확인하는 이유</h2>
    <p>이직 제안을 받았을 때 내 제안 금액이 시장에서 어느 정도 수준인지 보고 싶거나, 승진 후 연봉이 상위 몇 퍼센트인지 감을 잡고 싶을 때 유용합니다. 단순히 연봉 액수만 보는 것보다 전체 직장인 분포 안에서 자신의 위치를 보는 데 의미가 있습니다.</p>
    <h2>이 페이지는 무엇을 비교하나요?</h2>
    <p>입력한 연봉을 전체 근로소득 분포와 비교해 대략적인 상위 비율을 보여주는 방식입니다. 성별, 연령대처럼 집단을 나눠보면 같은 연봉이라도 체감 위치가 달라질 수 있어 이직·협상 참고자료로 쓰기 좋습니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">연봉 4,000만원은 전체 직장인 기준으로는 중간 이상일 수 있지만, 특정 연령대나 수도권 사무직 집단에서는 체감 위치가 달라질 수 있습니다. 그래서 전체 비교와 집단 비교를 함께 보는 편이 좋습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">연봉 7,000만원이면 전체 기준으로는 상위권에 들어갈 수 있지만, 업종이나 경력 수준에 따라 시장 평균과 비교한 해석은 달라질 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">왜 정확한 순위가 아니라 비율인가요?</div>
      <div class="faq-a">공개 통계는 개인별 순번이 아니라 분포 자료 중심으로 제공되는 경우가 많습니다. 그래서 계산왕에서는 현실적으로 참고하기 좋은 상위 비율 방식으로 보여줍니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">성과급 포함 여부는?</div>
      <div class="faq-a">비교 기준을 맞추는 것이 중요합니다. 제안 연봉에 성과급이 포함되는지, 복리후생 수당이 별도인지에 따라 체감 순위가 달라질 수 있습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">활용 팁</div>
      <div class="faq-a">이직 협상 전에는 연봉 순위와 함께 실수령액, 건강보험료, 퇴직금 변화를 같이 보는 편이 좋습니다. 숫자 하나만 보면 오해하기 쉽기 때문입니다.</div>
    </div>
    <p><strong>안내:</strong> 이 페이지는 2026년 공개 통계 흐름을 바탕으로 한 참고 비교입니다. 업종, 지역, 고용형태, 성과급 포함 여부에 따라 실제 체감 수준은 달라질 수 있습니다.</p>
  </div>
`,
  'payday/index.html': `
  <div class="desc-section">
    <h2>월급날 계산기가 필요한 순간</h2>
    <p>매달 급여일이 다가오는 시점을 확인하고 싶을 때, 고정비 결제일과 월급일 사이 간격을 조정해야 할 때, 이직 후 급여일 변경으로 생활비 일정을 다시 짜야 할 때 유용합니다. 단순한 D-Day 계산처럼 보여도 실제 생활비 계획에는 꽤 자주 쓰입니다.</p>
    <h2>어떻게 활용하면 좋나요?</h2>
    <p>매월 몇 일에 급여가 들어오는지 기준일을 입력하면 다음 급여일까지 남은 일수와 이번 달 진행 상황을 한눈에 볼 수 있습니다. 월세, 카드 결제일, 적금 이체일이 월급일보다 먼저 오는 구조라면 자금 공백 기간을 미리 파악하는 데 특히 도움이 됩니다.</p>
    <div class="faq-item">
      <div class="faq-q">실제 예시 1</div>
      <div class="faq-a">급여일이 매월 25일이라면 26일부터 다음 달 24일까지가 실질적인 한 달 운영 구간이 됩니다. 이 구간 안에서 고정비를 배치하면 현금흐름 관리가 쉬워집니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">실제 예시 2</div>
      <div class="faq-a">급여일이 말일인 회사라면 공휴일이나 주말로 인해 실제 입금일이 당겨질 수 있습니다. 카드 대금 결제일과 겹치는지 같이 체크해두는 편이 좋습니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">상여나 인센티브도 반영되나요?</div>
      <div class="faq-a">기본 계산은 정기 급여일 기준입니다. 상여금이 분기별이나 반기별로 들어온다면 별도로 일정 관리가 필요합니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">왜 진행률이 중요한가요?</div>
      <div class="faq-a">남은 일수만 보는 것보다 현재 급여 주기의 몇 퍼센트가 지났는지 함께 보면 지출 속도를 조절하기 쉽습니다. 월말 과소비를 막는 데도 도움이 됩니다.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">생활비 팁</div>
      <div class="faq-a">급여일 기준으로 자동이체일을 재정렬하면 카드 연체나 잔액 부족을 줄일 수 있습니다. 월급날 계산기와 함께 대출이자, 적금 계산기를 같이 써보면 월별 고정비 관리가 더 편해집니다.</div>
    </div>
    <p><strong>안내:</strong> 이 계산기는 2026년 달력 기준으로 다음 급여일까지 남은 기간을 계산하는 참고용 도구입니다. 실제 입금일은 회사 지급 규정과 공휴일 처리 방식에 따라 달라질 수 있습니다.</p>
  </div>
`,
};

const styleAddition = `
.desc-section h3{font-size:14px;font-weight:700;margin:18px 0 8px;}
.desc-section ul{padding-left:18px;margin:0 0 14px;}
.desc-section li{font-size:13px;color:#555;line-height:1.8;margin-bottom:6px;}
`.trim();

function ensureGoogleTag(text) {
  if (text.includes('G-5E3YW37RYV')) return text;
  return text.replace('</head>', `${googleTagSnippet}\n</head>`);
}

function ensureDescStyles(text) {
  if (text.includes('.desc-section h3{')) return text;
  return text.replace('.faq-a{font-size:13px;color:#555;line-height:1.7;padding-left:12px;border-left:2px solid var(--border);}', `.faq-a{font-size:13px;color:#555;line-height:1.7;padding-left:12px;border-left:2px solid var(--border);}\n${styleAddition}`);
}

function replaceDescSection(text, replacement) {
  return text.replace(/<div class="desc-section">[\s\S]*?<\/div>\s*\n\s*<div class="related">/, `${replacement}\n\n  <div class="related">`);
}

const allHtmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) allHtmlFiles.push(full);
  }
}
walk(root);

for (const file of allHtmlFiles) {
  let text = fs.readFileSync(file, 'utf8');
  text = ensureGoogleTag(text);
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (targetSections[rel]) {
    text = ensureDescStyles(text);
    text = replaceDescSection(text, targetSections[rel].trim());
  }
  fs.writeFileSync(file, text, 'utf8');
  console.log(`updated: ${rel}`);
}

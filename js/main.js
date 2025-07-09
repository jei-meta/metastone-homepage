const backToTop = document.getElementById('backtotop');

function checkScroll() {

    let pageYOffset = window.pageYOffset;

    if(pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

function moveBackToTop() {
    if (window.pageYOffset > 0) {

        window.scrollTo({top:0, behavior:"smooth"})
    }
}

window.addEventListener('scroll', checkScroll);
backToTop.addEventListener('click', moveBackToTop);

/* --------------------------------------------------------- */
function transformNext(event) {
    const slideNext = event.target;
    const slidePrev = slideNext.previousElementSibling;

    const classList = slideNext.parentElement.parentElement.nextElementSibling;
    let activeLi = Number(classList.getAttribute('data-position'));
    const liList = classList.getElementsByTagName('li');

    const cardWidth = 320;
    const visibleWidth = classList.clientWidth;
    const totalCardWidth = liList.length * cardWidth;
    const maxTranslateX = visibleWidth - totalCardWidth; // 음수 (최대로 밀 수 있는 위치)

    if (activeLi > maxTranslateX) {
        let nextPosition = activeLi - cardWidth;

        if (nextPosition < maxTranslateX) {
            nextPosition = maxTranslateX; // 넘치지 않게 제한
        }

        // PREV 활성화
        slidePrev.style.color = '#2f3059';
        slidePrev.classList.add('slide-prev-hover');
        slidePrev.addEventListener('click', transformPrev);

        // NEXT 비활성화 조건
        if (nextPosition === maxTranslateX) {
            slideNext.style.color = '#cfd8dc';
            slideNext.classList.remove('slide-next-hover');
            slideNext.removeEventListener('click', transformNext);
        }

        classList.style.transition = 'transform 1s';
        classList.style.transform = `translateX(${nextPosition}px)`;
        classList.setAttribute('data-position', nextPosition);
    }
}

function transformPrev(event) {
    const slidePrev = event.target;
    const slideNext = slidePrev.nextElementSibling;

    const classList = slidePrev.parentElement.parentElement.nextElementSibling;
    let activeLi = Number(classList.getAttribute('data-position'));
    const cardWidth = 320;

    if (activeLi < 0) {
        let nextPosition = activeLi + cardWidth;

        if (nextPosition > 0) {
            nextPosition = 0;
        }

        // NEXT 활성화
        slideNext.style.color = '#2f3059';
        slideNext.classList.add('slide-next-hover');
        slideNext.addEventListener('click', transformNext);

        // PREV 비활성화 조건
        if (nextPosition === 0) {
            slidePrev.style.color = '#cfd8dc';
            slidePrev.classList.remove('slide-prev-hover');
            slidePrev.removeEventListener('click', transformPrev);
        }

        classList.style.transition = 'transform 1s';
        classList.style.transform = `translateX(${nextPosition}px)`;
        classList.setAttribute('data-position', nextPosition);
    }
}

const slidePrevList = document.getElementsByClassName('slide-prev');

for (let i = 0; i < slidePrevList.length; i++) {
    const classList = slidePrevList[i].parentElement.parentElement.nextElementSibling;
    const liList = classList.getElementsByTagName('li');
    const slideNext = slidePrevList[i].nextElementSibling;
    const cardWidth = 320;

    const totalCardWidth = liList.length * cardWidth;
    const visibleWidth = classList.clientWidth;

    if (totalCardWidth > visibleWidth) {
        // NEXT 활성화
        slideNext.style.color = '#2f3059';
        slideNext.classList.add('slide-next-hover');
        slideNext.addEventListener('click', transformNext);

        // PREV 비활성화 (시작 상태)
        slidePrevList[i].style.color = '#cfd8dc';
        slidePrevList[i].classList.remove('slide-prev-hover');
        slidePrevList[i].removeEventListener('click', transformPrev);

        // 초기 위치
        classList.setAttribute('data-position', '0');
        classList.style.transition = 'none';
        classList.style.transform = 'translateX(0px)';
    } else {
        // 카드가 넘치지 않으면 버튼 제거
        const arrowContainer = slidePrevList[i].parentElement;
        arrowContainer.removeChild(slidePrevList[i].nextElementSibling);
        arrowContainer.removeChild(slidePrevList[i]);
    }
}

/* ---------------------------------------------------------------*/

const header = document.getElementById("main-header");
let timeoutId = null;

window.addEventListener("scroll", () => {
  clearTimeout(timeoutId);

  if (window.scrollY === 0) {
    // 맨 위에서는 헤더 무조건 보이게
    header.classList.remove("hide");
    return;  // 아래 숨기기 타이머 실행하지 않음
  }

  // 맨 위가 아니면 헤더 보이기
  header.classList.remove("hide");

  //  숨기기
  timeoutId = setTimeout(() => {
    header.classList.add("hide");
  }, 300);
});

header.addEventListener("mouseenter", () => {
  clearTimeout(timeoutId);
  header.classList.remove("hide");
});

header.addEventListener("mouseleave", () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    // 스크롤이 맨 위일 때는 숨기지 않도록 조건 추가
    if (window.scrollY !== 0) {
      header.classList.add("hide");
    }
  }, 300);
});

/* ---------------------------------------------------------------*/

const form = document.getElementById("form");
const statusMessage = document.getElementById("status-message");

if (form && statusMessage) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      statusMessage.innerText = "✅ 정상적으로 전송되었습니다.";
      statusMessage.classList.add("success");
      form.reset();
    } else {
      statusMessage.innerText = "❌ 오류가 발생했습니다.";
      statusMessage.classList.add("error");
    }
  });
}

/* ---------------------------------------------------------------*/

// 최근 본 제품 저장
function saveRecentProduct(name, url, imageUrl) {
  let recent = JSON.parse(sessionStorage.getItem('recentProducts')) || [];

  // 동일 제품 중복 제거
  recent = recent.filter(p => p.name !== name);

  // 새 제품 맨 앞에 추가
  recent.unshift({ name, url, imageUrl });

  // 최대 5개까지 저장
  if (recent.length > 5) recent = recent.slice(0, 5);

  sessionStorage.setItem('recentProducts', JSON.stringify(recent));

  // 박스 보이게 하기
  const box = document.getElementById('recent-products');
  const toggleBtn = document.getElementById('recent-toggle');
  if (box) box.style.display = '';
  if (toggleBtn) toggleBtn.style.display = '';

  // 최근 제품 목록 새로고침
  showRecentProducts();

  // 접힘 상태 적용 (토글버튼과 동일하게)
  const isCollapsed = localStorage.getItem('recentCollapsed') === 'true';
  if (isCollapsed && box) {
    box.classList.add('collapsed');
  } else if (box) {
    box.classList.remove('collapsed');
  }
}

// 최근 본 제품 목록 표시
function showRecentProducts() {
  const list = document.getElementById('recent-list');
  if (!list) return;

  const recent = JSON.parse(sessionStorage.getItem('recentProducts')) || [];
  list.innerHTML = '';

  recent.forEach(p => {
    const a = document.createElement('a');
    a.href = p.url;
    a.className = 'recent-item';

    const img = document.createElement('img');
    img.src = p.imageUrl;
    img.alt = p.name;
    img.className = 'recent-thumb';

    const span = document.createElement('span');
    span.textContent = p.name;

    a.appendChild(img);
    a.appendChild(span);
    list.appendChild(a);
  });
}

// recent.html 불러온 후 실행
document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.id = 'recent-container';
  document.body.appendChild(container);

  fetch('C-recent.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      const box = document.getElementById('recent-products');
      const toggleBtn = document.getElementById('recent-toggle');
      const recent = JSON.parse(sessionStorage.getItem('recentProducts')) || [];

      if (recent.length === 0) {
        // 최근 제품 없으면 박스와 토글 버튼 숨기기
        if (box) box.style.display = 'none';
        if (toggleBtn) toggleBtn.style.display = 'none';
      } else {
        // 제품 있으면 보이기 + 목록 표시
        if (box) box.style.display = '';
        if (toggleBtn) toggleBtn.style.display = '';

        showRecentProducts();

        // 저장된 접힘 상태 확인
        const isCollapsed = localStorage.getItem('recentCollapsed') === 'true';
        if (isCollapsed) {
          box.classList.add('collapsed');
          toggleBtn.textContent = '＜';
        } else {
          box.classList.remove('collapsed');
          toggleBtn.textContent = '＞';
        }

        // 버튼 클릭 시 상태 저장
        toggleBtn.addEventListener('click', () => {
          box.classList.toggle('collapsed');
          const collapsed = box.classList.contains('collapsed');
          toggleBtn.textContent = collapsed ? '＜' : '＞';
          localStorage.setItem('recentCollapsed', collapsed); // 상태 저장
        });
      }
    });
});

/* ---------------------------------------------------------------*/

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
  });
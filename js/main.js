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


/* ---------------------------------------------------------------*/

const header = document.getElementById("main-header");
let timeoutId = null;

window.addEventListener("scroll", () => {
  clearTimeout(timeoutId);

  if (window.scrollY === 0) {
   
    header.classList.remove("hide");
    return;  
  }

 
  header.classList.remove("hide");

  
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


function saveRecentProduct(name, url, imageUrl) {
  let recent = JSON.parse(sessionStorage.getItem('recentProducts')) || [];

  
  recent = recent.filter(p => p.name !== name);

  
  recent.unshift({ name, url, imageUrl });

  
  if (recent.length > 5) recent = recent.slice(0, 5);

  sessionStorage.setItem('recentProducts', JSON.stringify(recent));

  
  const box = document.getElementById('recent-products');
  const toggleBtn = document.getElementById('recent-toggle');
  if (box) box.style.display = '';
  if (toggleBtn) toggleBtn.style.display = '';

  
  showRecentProducts();

  
  const isCollapsed = localStorage.getItem('recentCollapsed') === 'true';
  if (isCollapsed && box) {
    box.classList.add('collapsed');
  } else if (box) {
    box.classList.remove('collapsed');
  }
}


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


document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.id = 'recent-container';
  document.body.appendChild(container);

  fetch('../C-recent.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      const box = document.getElementById('recent-products');
      const toggleBtn = document.getElementById('recent-toggle');
      const recent = JSON.parse(sessionStorage.getItem('recentProducts')) || [];

      if (recent.length === 0) {
       
        if (box) box.style.display = 'none';
        if (toggleBtn) toggleBtn.style.display = 'none';
      } else {
        
        if (box) box.style.display = '';
        if (toggleBtn) toggleBtn.style.display = '';

        showRecentProducts();

        
        const isCollapsed = localStorage.getItem('recentCollapsed') === 'true';
        if (isCollapsed) {
          box.classList.add('collapsed');
          toggleBtn.textContent = '＜';
        } else {
          box.classList.remove('collapsed');
          toggleBtn.textContent = '＞';
        }

        
        toggleBtn.addEventListener('click', () => {
          box.classList.toggle('collapsed');
          const collapsed = box.classList.contains('collapsed');
          toggleBtn.textContent = collapsed ? '＜' : '＞';
          localStorage.setItem('recentCollapsed', collapsed); 
        });
      }
    });
});



fetch("/C-header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("main-header").innerHTML = data;

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('show');
      });
    }
  });

/* ===== (모바일 전용) 드래그 + 스냅: 안정 초기화 버전 ===== */




/* ---------------------------------------------------------------*/


(() => {
  const lightbox = document.querySelector('.lightbox');
  const viewport = lightbox.querySelector('.lightbox__viewport');
  const imgEl = lightbox.querySelector('.lightbox__img');
  const backdrop = lightbox.querySelector('.lightbox__backdrop');
  const btnIn = lightbox.querySelector('.lb-zoom-in');
  const btnOut = lightbox.querySelector('.lb-zoom-out');
  const btnClose = lightbox.querySelector('.lb-close');

  // 터치 기기 여부
  const isTouch = window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window;

  // 브라우저 기본 드래그 유령 썸네일 방지
  imgEl.setAttribute('draggable', 'false');

  let scale = 1, tx = 0, ty = 0;      // 사용자 확대/이동 상태
  let fit = 1, natW = 1, natH = 1;    // 프레임 맞춤 배율 / 원본 크기
  const MIN = 1, MAX = 5, STEP = 0.2;

  // 핀치용 보조값/함수
  let dragging = false, sx = 0, sy = 0;
  let lastDist = 0;
  function getDistance(touches) {
    const [a, b] = touches;
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.hypot(dx, dy);
  }
  function getMidpoint(touches) {
    const [a, b] = touches;
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  }

  function calcFit() {
    natW = imgEl.naturalWidth || 1;
    natH = imgEl.naturalHeight || 1;
    const vw = viewport.clientWidth || 1;
    const vh = viewport.clientHeight || 1;
    // 이미지가 프레임 안에 완전히 보이도록 맞춤
    fit = Math.min(vw / natW, vh / natH);
  }

  function clampOffsets() {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const dispW = natW * fit * scale;   // 현재 표시 폭/높이
    const dispH = natH * fit * scale;
    const maxX = dispW > vw ? (dispW - vw) / 2 : 0;
    const maxY = dispH > vh ? (dispH - vh) / 2 : 0;
    tx = Math.max(-maxX, Math.min(tx, maxX));
    ty = Math.max(-maxY, Math.min(ty, maxY));
  }

  function apply() {
    clampOffsets();
    imgEl.style.setProperty('--scale', (fit * scale).toString());
    imgEl.style.setProperty('--tx', tx + 'px');
    imgEl.style.setProperty('--ty', ty + 'px');
    imgEl.style.cursor = dragging ? 'grabbing' : 'grab';
  }

  function openLightbox(src, alt='') {
    // 초기 CSS 변수값 보장
    imgEl.style.setProperty('--scale', '1');
    imgEl.style.setProperty('--tx', '0px');
    imgEl.style.setProperty('--ty', '0px');

    imgEl.onload = () => {
      calcFit();
      scale = 1; tx = 0; ty = 0;
      apply();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    imgEl.src = src;
    imgEl.alt = alt || '';

    // 캐시 이미지 대응(onload 안 타는 경우)
    if (imgEl.complete && imgEl.naturalWidth > 0) {
      requestAnimationFrame(() => {
        calcFit();
        scale = 1; tx = 0; ty = 0;
        apply();
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 트리거: .zoomable 클릭으로 열기
  document.addEventListener('click', (e) => {
    const z = e.target.closest('.zoomable');
    if (!z) return;
    openLightbox(z.src, z.alt);
  });

  // 휠로 확대/축소 (데스크톱 전용; 모바일은 핀치)
  imgEl.addEventListener('wheel', (e) => {
    e.preventDefault();
    const prev = scale;
    scale = Math.min(MAX, Math.max(MIN, scale - Math.sign(e.deltaY) * STEP));

    const rect = viewport.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width / 2);
    const cy = (e.clientY - rect.top  - rect.height / 2);
    const factor = (scale - prev) / Math.max(scale, 1e-6);
    tx -= cx * factor;
    ty -= cy * factor;

    apply();
  }, { passive: false });

  // 버튼 확대/축소 (데스크톱에서만 동작)
  if (!isTouch) {
    btnIn?.addEventListener('click', () => { scale = Math.min(MAX, scale + STEP); apply(); });
    btnOut?.addEventListener('click', () => { scale = Math.max(MIN, scale - STEP); apply(); });
  }

  // 드래그(틀 고정, 내부 이미지 이동) — 마우스
  imgEl.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;            // 기본 배율에선 드래그 비활성
    dragging = true; sx = e.clientX; sy = e.clientY;
    imgEl.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    tx += e.clientX - sx; ty += e.clientY - sy;
    sx = e.clientX; sy = e.clientY;
    apply();
  });
  window.addEventListener('mouseup', () => { dragging = false; imgEl.style.cursor = 'grab'; });

  // 터치 제스처: 한 손가락 드래그 + 두 손가락 핀치 줌
  imgEl.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      if (scale <= 1) return; // 확대 상태에서만 드래그
      const t = e.touches[0];
      dragging = true; sx = t.clientX; sy = t.clientY;
    } else if (e.touches.length === 2) {
      dragging = false;
      lastDist = getDistance(e.touches);
      // 핀치 중점 기준 보정 준비
      const rect = viewport.getBoundingClientRect();
      const mid = getMidpoint(e.touches);
      sx = mid.x - rect.left - rect.width / 2;
      sy = mid.y - rect.top  - rect.height / 2;
    }
  }, { passive: false });

  imgEl.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && dragging) {
      e.preventDefault(); // 바깥 스크롤 차단
      const t = e.touches[0];
      tx += t.clientX - sx; ty += t.clientY - sy;
      sx = t.clientX; sy = t.clientY;
      apply();
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const dist = getDistance(e.touches);
      if (lastDist) {
        const prev = scale;
        // 핀치 변화량 → 배율 반영 (감도 0.005 조절 가능)
        scale = Math.min(MAX, Math.max(MIN, scale + (dist - lastDist) * 0.005));

        // 핀치 중점 기준 약한 팬 보정
        const rect = viewport.getBoundingClientRect();
        const mid = getMidpoint(e.touches);
        const cx = (mid.x - rect.left - rect.width  / 2);
        const cy = (mid.y - rect.top  - rect.height / 2);
        const factor = (scale - prev) / Math.max(scale, 1e-6);
        tx -= cx * factor; ty -= cy * factor;
        apply();
      }
      lastDist = dist;
    }
  }, { passive: false });

  imgEl.addEventListener('touchend', (e) => {
    dragging = false;
    if (e.touches.length < 2) lastDist = 0; // 핀치 종료
  }, { passive: false });

  // 닫기
  backdrop.addEventListener('click', closeLightbox);
  btnClose.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // 리사이즈 시 프레임 유지 + 경계 재계산
  window.addEventListener('resize', () => {
    if (!lightbox.classList.contains('open')) return;
    calcFit(); apply();
  });
})();

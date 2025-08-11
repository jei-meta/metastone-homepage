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
    const maxTranslateX = visibleWidth - totalCardWidth; 

    if (activeLi > maxTranslateX) {
        let nextPosition = activeLi - cardWidth;

        if (nextPosition < maxTranslateX) {
            nextPosition = maxTranslateX; 
        }

       
        slidePrev.style.color = '#2f3059';
        slidePrev.classList.add('slide-prev-hover');
        slidePrev.addEventListener('click', transformPrev);

       
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

        slideNext.style.color = '#2f3059';
        slideNext.classList.add('slide-next-hover');
        slideNext.addEventListener('click', transformNext);

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
       
        slideNext.style.color = '#2f3059';
        slideNext.classList.add('slide-next-hover');
        slideNext.addEventListener('click', transformNext);

        
        slidePrevList[i].style.color = '#cfd8dc';
        slidePrevList[i].classList.remove('slide-prev-hover');
        slidePrevList[i].removeEventListener('click', transformPrev);

        
        classList.setAttribute('data-position', '0');
        classList.style.transition = 'none';
        classList.style.transform = 'translateX(0px)';
    } else {
        
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
(function () {
  const MOBILE_QUERY = '(max-width: 767px)';
  const CARD_WIDTH = 320;

  function bindMobileDrag(wrap) {
    
    if (!wrap || !(wrap instanceof HTMLElement)) return;

    
    const prevEl = wrap.querySelector('.slide-prev');
    const nextEl = wrap.querySelector('.slide-next');
    const track  = wrap.querySelector('.class-list');
    if (!track) return;

    
    if (track.dataset.dragBound === '1') return;
    track.dataset.dragBound = '1';

    track.style.touchAction = 'pan-y';
    track.style.cursor = 'grab';

    const getMaxX = () => {
      const count   = track.querySelectorAll('li').length;
      const total   = count * CARD_WIDTH;
      const visible = track.clientWidth;
      return Math.min(0, visible - total); 
    };

    function setPos(x, withAnim) {
      track.style.transition = withAnim ? 'transform .35s' : 'none';
      track.style.transform  = `translateX(${x}px)`;
      track.setAttribute('data-position', String(x));
    }

    function updateArrows(pos, maxX) {
      if (nextEl) {
        if (pos === maxX) {
          nextEl.style.color = '#cfd8dc';
          nextEl.classList.remove('slide-next-hover');
          nextEl.removeEventListener('click', transformNext);
        } else {
          nextEl.style.color = '#2f3059';
          nextEl.classList.add('slide-next-hover');
          nextEl.addEventListener('click', transformNext);
        }
      }
      if (prevEl) {
        if (pos === 0) {
          prevEl.style.color = '#cfd8dc';
          prevEl.classList.remove('slide-prev-hover');
          prevEl.removeEventListener('click', transformPrev);
        } else {
          prevEl.style.color = '#2f3059';
          prevEl.classList.add('slide-prev-hover');
          prevEl.addEventListener('click', transformPrev);
        }
      }
    }

    if (!track.getAttribute('data-position')) setPos(0, false);
    let maxX = getMaxX();
    updateArrows(Number(track.getAttribute('data-position')) || 0, maxX);

    
    let dragging = false, moved = false;
    let startX = 0, startPos = Number(track.getAttribute('data-position')) || 0;
    const getX = (e) => e.clientX ?? e.touches?.[0]?.clientX ?? 0;

    const onDown = (e) => {
      dragging = true; moved = false;
      startX = getX(e);
      startPos = Number(track.getAttribute('data-position')) || 0;
      track.style.cursor = 'grabbing';
      track.style.transition = 'none';
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = getX(e) - startX;
      if (Math.abs(dx) > 3) moved = true;
      let next = startPos + dx;
      const limit = getMaxX();
      if (next > 0) next = 0;
      if (next < limit) next = limit;
      setPos(next, false);
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      track.style.cursor = 'grab';
      maxX = getMaxX();
      let cur = Number(track.getAttribute('data-position')) || 0;
      let snapped = Math.round(cur / CARD_WIDTH) * CARD_WIDTH;
      if (snapped > 0) snapped = 0;
      if (snapped < maxX) snapped = maxX;
      setPos(snapped, true);
      updateArrows(snapped, maxX);
    };

    if ('PointerEvent' in window) {
      track.addEventListener('pointerdown', onDown, { passive: false });
      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onUp, { passive: true });
      window.addEventListener('pointercancel', onUp, { passive: true });
    } else {
      track.addEventListener('mousedown', onDown, { passive: false });
      window.addEventListener('mousemove', onMove, { passive: false });
      window.addEventListener('mouseup', onUp, { passive: true });
      track.addEventListener('touchstart', onDown, { passive: false });
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp, { passive: true });
      window.addEventListener('touchcancel', onUp, { passive: true });
    }

    track.addEventListener('click', (e) => { if (moved) e.preventDefault(); });

    
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const limit = getMaxX();
        let pos = Number(track.getAttribute('data-position')) || 0;
        if (pos < limit) pos = limit;
        if (pos > 0) pos = 0;
        setPos(pos, true);
        updateArrows(pos, limit);
      }, 120);
    });
  }

  function tryInitAll() {
    if (!window.matchMedia(MOBILE_QUERY).matches) return;
    const wraps = document.querySelectorAll('.best-container');
    if (!wraps.length) return;
    
    requestAnimationFrame(() =>
      requestAnimationFrame(() => wraps.forEach(bindMobileDrag))
    );
  }

  
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    tryInitAll();
    setTimeout(tryInitAll, 150); 
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      tryInitAll();
      setTimeout(tryInitAll, 150);
    });
  }

  
  window.addEventListener('load', () => {
    tryInitAll();
    setTimeout(tryInitAll, 0);
  }, { once: true });

  
  const mo = new MutationObserver(tryInitAll);
  mo.observe(document.documentElement, { childList: true, subtree: true });

  
  const mql = window.matchMedia(MOBILE_QUERY);
  const onChange = () => { if (mql.matches) tryInitAll(); }
  mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange);
})();

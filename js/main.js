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
      statusMessage.innerText = "✅ 정상적으로 전송되었습니다. 담당자 확인후 순차적으로 연락드릴 예정입니다. 감사합니다! :)";
      statusMessage.classList.add("success");
      form.reset();
    } else {
      statusMessage.innerText = "❌ 오류가 발생했습니다. 다시 시도해 주세요.";
      statusMessage.classList.add("error");
    }
  });
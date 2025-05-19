document.addEventListener('DOMContentLoaded', function() {
    // 개인정보 처리방침 토글
    const showPrivacyBtn = document.getElementById('showPrivacy');
    const privacyContent = document.getElementById('privacyContent');
    
    if (showPrivacyBtn && privacyContent) {
        showPrivacyBtn.addEventListener('click', function() {
            if (privacyContent.style.display === 'block') {
                privacyContent.style.display = 'none';
                showPrivacyBtn.textContent = '▼';
            } else {
                privacyContent.style.display = 'block';
                showPrivacyBtn.textContent = '▲';
            }
        });
    }
    
    // 마케팅 정보 토글
    const showMarketingBtn = document.getElementById('showMarketing');
    const marketingContent = document.getElementById('marketingContent');
    
    if (showMarketingBtn && marketingContent) {
        showMarketingBtn.addEventListener('click', function() {
            if (marketingContent.style.display === 'block') {
                marketingContent.style.display = 'none';
                showMarketingBtn.textContent = '▼';
            } else {
                marketingContent.style.display = 'block';
                showMarketingBtn.textContent = '▲';
            }
        });
    }
    
    // 스크롤 시 헤더 스타일 변경
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 부드러운 스크롤 효과
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 이미지 갤러리 팝업 기능
    const caseItems = document.querySelectorAll('.case-item');
    
    if (caseItems.length > 0) {
        caseItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                const popup = document.createElement('div');
                popup.className = 'img-popup';
                popup.innerHTML = `
                    <div class="popup-content">
                        <span class="close-popup">&times;</span>
                        <img src="${imgSrc}" alt="확대 이미지">
                    </div>
                `;
                
                document.body.appendChild(popup);
                document.body.style.overflow = 'hidden';
                
                // 팝업 닫기 기능
                popup.querySelector('.close-popup').addEventListener('click', function() {
                    document.body.removeChild(popup);
                    document.body.style.overflow = 'auto';
                });
                
                // 배경 클릭 시 팝업 닫기
                popup.addEventListener('click', function(e) {
                    if (e.target === popup) {
                        document.body.removeChild(popup);
                        document.body.style.overflow = 'auto';
                    }
                });
            });
        });
        
        // 팝업 스타일 추가
        const style = document.createElement('style');
        style.textContent = `
            .img-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1001;
            }
            
            .popup-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .popup-content img {
                max-width: 100%;
                max-height: 80vh;
                display: block;
                border: 5px solid white;
            }
            
            .close-popup {
                position: absolute;
                top: -30px;
                right: -30px;
                color: white;
                font-size: 30px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 문의 폼 제출 처리
    const inquiryForm = document.getElementById('inquiryForm');
    const resultDiv = document.getElementById('result');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbymxiaaRM4yncJ5ertwLrW-5Pd2fPXiH15dZTs0Z7s5TaMKBbcpLy7NJ47TUMcHsiD2/exec'; // TODO: 실제 배포 URL로 교체

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 폼 데이터 수집
            const data = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // 전송 중 메시지 표시
            if (resultDiv) {
                resultDiv.textContent = '전송 중입니다...';
                resultDiv.style.color = '#555';
            }

            fetch(scriptURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (!res.ok) throw new Error('network');
                return res.json();
            })
            .then(res => {
                // 성공 메시지
                const msg = '문의가 성공적으로 제출되었습니다!';
                if (resultDiv) {
                    resultDiv.textContent = msg;
                    resultDiv.style.color = '#2ecbcc';
                } else {
                    alert(msg);
                }
                inquiryForm.reset();
            })
            .catch(err => {
                const msg = '오류가 발생했습니다. 다시 시도해주세요.';
                if (resultDiv) {
                    resultDiv.textContent = msg;
                    resultDiv.style.color = 'red';
                } else {
                    alert(msg);
                }
            });
        });
    }
    
    // 애니메이션 효과
    const scrollElements = document.querySelectorAll('.service-box, .step');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 80)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // 초기 로드 시 화면에 있는 요소 체크
    handleScrollAnimation();
}); 
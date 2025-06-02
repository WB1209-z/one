// 全局变量
let currentPage = 0;
let isTransitioning = false;
let backgroundMusic;
let isMusicPlaying = false;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 初始化背景音乐
    backgroundMusic = document.getElementById('backgroundMusic');
    
    // 登录功能
    setupLogin();
    
    // 音乐控制
    setupMusicControl();
    
    // 页面滑动
    setupPageNavigation();
    
    // 图片点击音频
    setupPhotoAudio();
    
    // 添加更多动画效果
    addDynamicAnimations();
}

// 登录功能设置
function setupLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    loginBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // 这里设置正确的账户名和密码
        if (username === '1' && password === '1') {
            startTransition();
        } else {
            alert('账户名或密码错误！');
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });
    
    // 回车键登录
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
}

// 开始过渡动画
function startTransition() {
    const loginPage = document.getElementById('loginPage');
    const transitionPage = document.getElementById('transitionPage');
    const mainContainer = document.getElementById('mainContainer');
    
    // 隐藏登录页面
    loginPage.classList.remove('active');
    
    // 显示过渡页面
    setTimeout(() => {
        transitionPage.classList.add('active');
    }, 500);
    
    // 2秒黑屏
    setTimeout(() => {
        transitionPage.style.background = '#000';
        transitionPage.innerHTML = '';
    }, 2000);
    
    // 4秒惊喜动画
    setTimeout(() => {
        transitionPage.innerHTML = `
            <div class="transition-animation">
                <div class="surprise-text">生日快乐！</div>
                <div class="hearts"></div>
                <div class="sparkles"></div>
            </div>
        `;
    }, 2500);
    
    // 6秒后进入主页面
    setTimeout(() => {
        transitionPage.classList.remove('active');
        mainContainer.classList.add('active');
        
        // 开始播放背景音乐
        playBackgroundMusic();
    }, 6000);
}

// 音乐控制设置
function setupMusicControl() {
    const musicBtn = document.getElementById('musicBtn');
    
    musicBtn.addEventListener('click', function() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicBtn.innerHTML = '<span class="music-icon">♪</span>';
            isMusicPlaying = false;
        } else {
            backgroundMusic.play();
            musicBtn.innerHTML = '<span class="music-icon">⏸</span>';
            isMusicPlaying = true;
        }
    });
}

function playBackgroundMusic() {
    backgroundMusic.play().then(() => {
        isMusicPlaying = true;
        document.getElementById('musicBtn').innerHTML = '<span class="music-icon">⏸</span>';
    }).catch(error => {
        console.log('音乐自动播放被阻止，用户需要手动开启');
    });
}

// 页面导航设置
function setupPageNavigation() {
    let startY = 0;
    let currentY = 0;
    const threshold = 50; // 滑动阈值
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        currentY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (isTransitioning) return;
        
        const deltaY = startY - currentY;
        
        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                // 向上滑动
                nextPage();
            } else {
                // 向下滑动
                prevPage();
            }
        }
    }, { passive: true });
    
    // 鼠标滚轮支持
    document.addEventListener('wheel', function(e) {
        if (isTransitioning) return;
        
        if (e.deltaY > 0) {
            nextPage();
        } else {
            prevPage();
        }
    }, { passive: true });
}

function nextPage() {
    const pages = document.querySelectorAll('.main-page');
    if (currentPage < pages.length - 1) {
        changePage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 0) {
        changePage(currentPage - 1);
    }
}

function changePage(newPage) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const pages = document.querySelectorAll('.main-page');
    
    // 移除当前页面的active类
    pages[currentPage].classList.remove('active-main');
    
    // 添加新页面的active类
    setTimeout(() => {
        pages[newPage].classList.add('active-main');
        currentPage = newPage;
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }, 100);
}

// 图片点击音频设置
function setupPhotoAudio() {
    const photos = document.querySelectorAll('.photo');
    
    photos.forEach(photo => {
        photo.addEventListener('click', function() {
            const audioSrc = this.getAttribute('data-audio');
            if (audioSrc) {
                // 停止之前的音频
                const existingAudio = document.querySelector('.temp-audio');
                if (existingAudio) {
                    existingAudio.pause();
                    existingAudio.remove();
                }
                
                // 播放新音频
                const audio = new Audio(audioSrc);
                audio.className = 'temp-audio';
                audio.play().catch(error => {
                    console.log('音频播放失败:', error);
                });
                
                // 添加点击效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}

// 添加动态动画效果
function addDynamicAnimations() {
    // 为登录页面添加更多星星
    createStars();
    
    // 为粉色页面添加更多气泡
    createBubbles();
    
    // 添加页面切换时的粒子效果
    createPageTransitionEffects();
}

function createStars() {
    const loginPage = document.getElementById('loginPage');
    const starsContainer = loginPage.querySelector('.stars');
    
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.innerHTML = '✦';
        star.style.position = 'absolute';
        star.style.color = 'rgba(255,255,255,0.6)';
        star.style.fontSize = Math.random() * 15 + 10 + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`;
        star.style.animationDelay = Math.random() * 2 + 's';
        
        starsContainer.appendChild(star);
    }
}

function createBubbles() {
    const pinkPages = document.querySelectorAll('.pink-bg');
    
    pinkPages.forEach(page => {
        const bubblesContainer = page.querySelector('.floating-bubbles');
        
        for (let i = 0; i < 10; i++) {
            const bubble = document.createElement('div');
            bubble.style.position = 'absolute';
            bubble.style.width = Math.random() * 30 + 20 + 'px';
            bubble.style.height = bubble.style.width;
            bubble.style.background = 'rgba(139, 92, 246, 0.1)';
            bubble.style.borderRadius = '50%';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.top = Math.random() * 100 + '%';
            bubble.style.animation = `bubbleFloat ${Math.random() * 4 + 4}s ease-in-out infinite`;
            bubble.style.animationDelay = Math.random() * 3 + 's';
            
            bubblesContainer.appendChild(bubble);
        }
    });
}

function createPageTransitionEffects() {
    // 页面切换时的粒子效果可以在这里添加
    // 这里预留了扩展空间
}

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    if (document.getElementById('mainContainer').classList.contains('active')) {
        switch(e.key) {
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                nextPage();
                break;
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                prevPage();
                break;
            case ' ': // 空格键控制音乐
                e.preventDefault();
                document.getElementById('musicBtn').click();
                break;
        }
    }
});

// 防止页面刷新时的状态丢失
window.addEventListener('beforeunload', function() {
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
    }
});

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (backgroundMusic && !backgroundMusic.paused) {
            backgroundMusic.pause();
        }
    } else {
        if (isMusicPlaying && backgroundMusic.paused) {
            backgroundMusic.play();
        }
    }
});
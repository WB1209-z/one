class BirthdayWebsite {
    constructor() {
        this.currentPage = 0;
        this.isLoggedIn = false;
        this.musicPlaying = false;
        this.credentials = {
            username: '111',
            password: '111'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTouchEvents();
        this.setupAudioEvents();
    }
    
    setupEventListeners() {
        // 登录按钮事件
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.addEventListener('click', () => this.handleLogin());
        
        // 回车键登录
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isLoggedIn) {
                this.handleLogin();
            }
        });
        
        // 音乐控制按钮
        const musicToggle = document.getElementById('musicToggle');
        musicToggle.addEventListener('click', () => this.toggleMusic());
        
        // 图片点击播放音频
        const clickableImages = document.querySelectorAll('.clickable-image');
        clickableImages.forEach(img => {
            img.addEventListener('click', () => this.playAudio(img.dataset.audio));
        });
    }
    
    setupTouchEvents() {
        const pagesContainer = document.querySelector('.pages-container');
        let startY = 0;
        let currentY = 0;
        let isScrolling = false;
        
        pagesContainer.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isScrolling = true;
        });
        
        pagesContainer.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            currentY = e.touches[0].clientY;
        });
        
        pagesContainer.addEventListener('touchend', () => {
            if (!isScrolling) return;
            
            const deltaY = startY - currentY;
            const threshold = 50;
            
            if (Math.abs(deltaY) > threshold) {
                if (deltaY > 0) {
                    // 向上滑动
                    this.nextPage();
                } else {
                    // 向下滑动
                    this.prevPage();
                }
            }
            
            isScrolling = false;
        });
        // 鼠标滚轮事件
        pagesContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                this.nextPage();
            } else {
                this.prevPage();
            }
        });
    }
    
    setupAudioEvents() {
        // 自动播放背景音乐（需要用户交互后才能播放）
        document.addEventListener('click', () => {
            if (!this.musicPlaying && this.isLoggedIn) {
                this.startBackgroundMusic();
            }
        }, { once: true });
    }
    
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === this.credentials.username && password === this.credentials.password) {
            this.isLoggedIn = true;
            this.showTransitionAnimation();
        } else {
            this.showLoginError();
        }
    }
    
    showLoginError() {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'login-error';
        errorMsg.textContent = '用户名或密码错误';
        errorMsg.style.cssText = `
            position: absolute;
            top: 70%;
            left: 50%;
            transform: translateX(-50%);
            color: #ff6b6b;
            font-size: 14px;
            animation: shake 0.5s ease-in-out;
        `;
        
        document.querySelector('.login-container').appendChild(errorMsg);
        
        setTimeout(() => {
            errorMsg.remove();
        }, 3000);
    }
    
    
    showTransitionAnimation() {
        const loginPage = document.getElementById('loginPage');
        const mainPage = document.getElementById('mainPages'); // Changed from 'mainPage' to 'mainPages'
        
        // 第一阶段：黑屏2秒
        const blackScreen = document.createElement('div');
        blackScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            z-index: 9999;
            opacity: 0;
        `;
        
        document.body.appendChild(blackScreen);
        
        // 淡入黑屏
        setTimeout(() => {
            blackScreen.style.transition = 'opacity 0.5s';
            blackScreen.style.opacity = '1';
        }, 100);
        
        // 2秒后开始惊喜动画
        setTimeout(() => {
            this.showSurpriseAnimation(blackScreen, loginPage, mainPage);
        }, 2500);
    }
    
    // showSurpriseAnimation 方法定义应为：
    showSurpriseAnimation(blackScreen, loginPage, mainPage) {
        // 创建惊喜动画容器
        const surpriseContainer = document.createElement('div');
        surpriseContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #8B5CF6, #A855F7, #C084FC);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
        `;
        
        // 添加生日祝福文字
        const birthdayText = document.createElement('div');
        birthdayText.innerHTML = `
            <h1 style="color: white; font-size: 3rem; margin-bottom: 2rem; text-align: center; animation: bounceIn 1s ease-out;">🎉 生日快乐 🎉</h1>
            <p style="color: white; font-size: 1.5rem; text-align: center; animation: fadeInUp 1s ease-out 0.5s both;">愿你的每一天都充满阳光与快乐</p>
        `;
        
        surpriseContainer.appendChild(birthdayText);
        
        // 添加飘落的花瓣
        for (let i = 0; i < 20; i++) {
            const petal = document.createElement('div');
            petal.innerHTML = '🌸';
            petal.style.cssText = `
                position: absolute;
                font-size: 2rem;
                animation: fall ${2 + Math.random() * 3}s linear infinite;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            surpriseContainer.appendChild(petal);
        }
        
        document.body.appendChild(surpriseContainer);
        
        // 显示惊喜动画
        setTimeout(() => {
            blackScreen.style.opacity = '0';
            surpriseContainer.style.transition = 'opacity 0.5s';
            surpriseContainer.style.opacity = '1';
        }, 100);
        
        // 4秒后进入主页面
        setTimeout(() => {
            surpriseContainer.style.opacity = '0';
            setTimeout(() => {
                blackScreen.remove();
                surpriseContainer.remove();
                loginPage.classList.remove('active');
                mainPage.classList.add('active');
                this.currentPage = 0;
                this.updatePagePosition();
                const pagesContainer = document.querySelector('.pages-container');
                if (pagesContainer) {
                    pagesContainer.style.display = 'block';
                }
                this.startBackgroundMusic();
            }, 500);
        }, 4000);
    }
    
    updatePagePosition() {
        const pagesContainer = document.querySelector('.pages-container');
        if (pagesContainer) {
            const translateY = -this.currentPage * 100;
            pagesContainer.style.transform = `translateY(${translateY}vh)`;
            
            // 确保页面容器可见
            pagesContainer.style.display = 'block';
            
            // 更新页面指示器
            this.updatePageIndicator();
        }
    }
    
    updatePageIndicator() {
        const indicators = document.querySelectorAll('.page-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentPage);
        });
    }
    
    toggleMusic() {
        const bgMusic = document.getElementById('bgMusic');
        const musicToggle = document.getElementById('musicToggle');
        
        if (this.musicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '🔇';
            this.musicPlaying = false;
        } else {
            bgMusic.play();
            musicToggle.innerHTML = '🎵';
            this.musicPlaying = true;
        }
    }
    
    startBackgroundMusic() {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.play().catch(e => {
                console.log('音频自动播放被阻止，需要用户交互');
            });
            this.musicPlaying = true;
            document.getElementById('musicToggle').innerHTML = '🎵';
        }
    }
    
    playAudio(audioSrc) {
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play().catch(e => {
                console.log('音频播放失败:', e);
            });
        }
    }
    nextPage() {
        if (this.currentPage < 9) { // 假设总共10页
            this.currentPage++;
            this.updatePagePosition();
        }
    }
    
    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updatePagePosition();
        }
    }
}
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BirthdayWebsite();
    
    // 添加CSS动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeInUp {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fall {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(-50%); }
            25% { transform: translateX(-55%); }
            75% { transform: translateX(-45%); }
        }
    `;
    document.head.appendChild(style);
});


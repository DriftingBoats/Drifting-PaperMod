// 固定导航滚动效果
function initFixedHeader() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    // 监听滚动事件
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    // 添加滚动监听
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // 初始检查
    updateHeader();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initFixedHeader);

// 如果页面已经加载完成，立即初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFixedHeader);
} else {
    initFixedHeader();
}
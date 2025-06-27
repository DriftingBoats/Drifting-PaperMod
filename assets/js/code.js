// PE代码块复制功能
function initPECodeCopy() {
    const copyButtons = document.querySelectorAll('.pe-code-copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.closest('.pe-code-block-wrap');
            const code = codeBlock.querySelector('pre code');
            
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<svg class="pe-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>';
                    button.style.color = '#28a745';
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            }
        });
    });
}

// PE代码块折叠功能
function initPECodeFolding() {
    const codeDetails = document.querySelectorAll('.pe-code-details');
    
    codeDetails.forEach(details => {
        const content = details.querySelector('.pe-code-details-content');
        
        // 监听原生details的toggle事件
        details.addEventListener('toggle', () => {
            if (details.open) {
                details.classList.add('open');
                
                // 检查是否需要滚动条
                setTimeout(() => {
                    if (content && content.scrollHeight > content.clientHeight) {
                        details.classList.add('scrollable');
                    }
                }, 100);
            } else {
                details.classList.remove('open');
                details.classList.remove('scrollable');
            }
        });
        
        // 初始状态检查
        if (details.open) {
            details.classList.add('open');
            // 检查初始状态是否需要滚动条
            setTimeout(() => {
                if (content && content.scrollHeight > content.clientHeight) {
                    details.classList.add('scrollable');
                }
            }, 100);
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initPECodeCopy();
    initPECodeFolding();
});
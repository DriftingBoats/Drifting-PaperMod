// 代码块复制功能
function initCodeCopy() {
    const copyButtons = document.querySelectorAll('.code-copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.closest('.code-block-wrap');
            const code = codeBlock.querySelector('pre code');
            
            if (code) {
                // 获取代码内容，过滤掉行号
                let codeText = '';
                
                // 检查是否使用了表格形式的行号（chroma lntable）
                const table = code.querySelector('table.lntable');
                if (table) {
                    // 表格形式：只获取代码列的内容（最后一列）
                    const codeLines = table.querySelectorAll('tr');
                    codeText = Array.from(codeLines).map(tr => {
                        const codeTd = tr.querySelector('td.lntd:last-child');
                        return codeTd ? codeTd.textContent : '';
                    }).join('');
                } else {
                    // 非表格形式：创建代码副本并移除行号
                    const codeClone = code.cloneNode(true);
                    
                    // Hugo chroma 生成的行号通常有以下特征：
                    // 1. 使用 .lnt 类的 span 元素
                    // 2. 内容只包含数字和空白字符
                    // 3. 通常在每行的开头
                    
                    // 移除明确的行号元素
                    const lineNumberElements = codeClone.querySelectorAll('.lnt, .lnlinks');
                    lineNumberElements.forEach(el => el.remove());
                    
                    // 移除可能的其他行号格式
                    const allSpans = codeClone.querySelectorAll('span');
                    allSpans.forEach(span => {
                        // 如果span只包含数字和空白字符，且长度较短，很可能是行号
                        const text = span.textContent.trim();
                        if (/^\d+$/.test(text) && text.length <= 4) {
                            // 检查是否在行首位置（前面只有空白字符或换行）
                            const prevText = span.previousSibling?.textContent || '';
                            if (!prevText || /^\s*$/.test(prevText) || prevText.endsWith('\n')) {
                                span.remove();
                            }
                        }
                    });
                    
                    codeText = codeClone.textContent;
                    
                    // 清理可能残留的行号模式（行首的数字+空格）
                    codeText = codeText.replace(/^\s*\d+\s+/gm, '');
                }
                
                navigator.clipboard.writeText(codeText).then(() => {
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
                    button.style.color = '#28a745';
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.style.color = '';
                    }, 1000);
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            }
        });
    });
}

// 代码块折叠功能
function initCodeFolding() {
    const codeDetails = document.querySelectorAll('.code-details');
    
    codeDetails.forEach(details => {
        const content = details.querySelector('.code-details-content');
        
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
    initCodeCopy();
    initCodeFolding();
});
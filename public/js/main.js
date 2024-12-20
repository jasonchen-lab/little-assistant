document.addEventListener('DOMContentLoaded', async () => {
    // 加载保存的API设置
    try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
            const settings = await response.json();
            if (settings.provider === 'baidu') {
                // 如果已经配置了文心一言，启用优化按钮
                document.getElementById('optimizeBtn').disabled = false;
            } else {
                // 如果未配置，禁用优化按钮并显示提示
                document.getElementById('optimizeBtn').disabled = true;
                document.getElementById('optimizeBtn').title = '请先在管理面板配置API';
            }
        }
    } catch (error) {
        console.error('加载API设置失败:', error);
    }

    // 滚动效果
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 主旨模块功能
    const themeInput = document.getElementById('themeInput');
    const themeCharCounter = themeInput.closest('.input-group').querySelector('.char-counter');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const themeResults = themeInput.closest('.theme-input-container').querySelector('.optimization-results');
    const defaultText = '本文案旨在[核心目标]，通过 [传达方式/内容特点]，深入阐述 [主题/理念]，以期达到[预期效果/目标受众的反应]，从而 [实现的目的]。';

    // 字数计数功能
    themeInput.addEventListener('input', function() {
        const length = this.value.length;
        themeCharCounter.textContent = `${length}/100`;
        optimizeBtn.disabled = length === 0;
    });

    // 优化按钮点击事件
    optimizeBtn.addEventListener('click', async () => {
        const theme = themeInput.value;
        if (!theme) return;

        try {
            // 先检查API是否已配置
            const settingsResponse = await fetch('/api/admin/settings');
            if (settingsResponse.ok) {
                const settings = await settingsResponse.json();
                if (!settings.apiKey || !settings.secretKey) {
                    alert('请先在管理面板配置API密钥');
                    return;
                }
            }

            // 显示加载状态
            optimizeBtn.disabled = true;
            optimizeBtn.querySelector('.button-text').style.display = 'none';
            optimizeBtn.querySelector('.loading-text').style.display = 'inline';

            // 调用大模型API
            const response = await fetch('/api/optimize-theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    theme: theme,
                    maxLength: 100,
                    numSuggestions: 3
                })
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            const data = await response.json();
            const suggestions = data.suggestions;

            // 显示建议
            const suggestionsContainer = themeResults.querySelector('.suggestions');
            suggestionsContainer.innerHTML = '';
            
            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = suggestion;
                div.addEventListener('click', () => {
                    themeInput.value = suggestion;
                    themeCharCounter.textContent = `${suggestion.length}/100`;
                    themeResults.style.display = 'none';
                });
                suggestionsContainer.appendChild(div);
            });

            themeResults.style.display = 'block';
        } catch (error) {
            console.error('优化失败:', error);
            alert('优化失败，请稍后重试');
        } finally {
            // 恢复按钮状态
            optimizeBtn.disabled = false;
            optimizeBtn.querySelector('.button-text').style.display = 'inline';
            optimizeBtn.querySelector('.loading-text').style.display = 'none';
        }
    });

    // 添加管理员入口点击事件监听
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            console.log('管理员入口被点击');
        });
    }

    // 标题模块功能
    const titleInput = document.getElementById('titleInput');
    const titleCharCounter = titleInput.closest('.input-group').querySelector('.char-counter');
    const optimizeTitleBtn = document.getElementById('optimizeTitleBtn');
    const titleResults = titleInput.closest('.title-input-container').querySelector('.optimization-results');
    const defaultTitleText = '在这里输入你的标题';

    // 字数计数功能
    titleInput.addEventListener('input', function() {
        const length = this.value.length;
        titleCharCounter.textContent = `${length}/50`;
        optimizeTitleBtn.disabled = length === 0;
    });

    // 优化按钮点击事件
    optimizeTitleBtn.addEventListener('click', async () => {
        const title = titleInput.value;
        const theme = themeInput.value;  // 获取主旨内容
        if (!title) return;

        try {
            // 先检查API是否已配置
            const settingsResponse = await fetch('/api/admin/settings');
            if (settingsResponse.ok) {
                const settings = await settingsResponse.json();
                if (!settings.apiKey || !settings.secretKey) {
                    alert('请先在管理面板配置API密钥');
                    return;
                }
            }

            // 显示加载状态
            optimizeTitleBtn.disabled = true;
            optimizeTitleBtn.querySelector('.button-text').style.display = 'none';
            optimizeTitleBtn.querySelector('.loading-text').style.display = 'inline';

            // 调用优化API
            const response = await fetch('/api/optimize-title', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    theme: theme,  // 传递主旨内容
                    maxLength: 50
                })
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            const data = await response.json();
            const suggestions = data.suggestions;

            // 显示建议
            const suggestionsContainer = titleResults.querySelector('.suggestions');
            suggestionsContainer.innerHTML = '';
            
            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = suggestion;
                div.addEventListener('click', () => {
                    titleInput.value = suggestion;
                    titleCharCounter.textContent = `${suggestion.length}/50`;
                    titleResults.style.display = 'none';
                });
                suggestionsContainer.appendChild(div);
            });

            titleResults.style.display = 'block';
        } catch (error) {
            console.error('优化失败:', error);
            alert('优化失败，请稍后重试');
        } finally {
            // 恢复按钮状态
            optimizeTitleBtn.disabled = false;
            optimizeTitleBtn.querySelector('.button-text').style.display = 'inline';
            optimizeTitleBtn.querySelector('.loading-text').style.display = 'none';
        }
    });

    // 用途模块功能
    const otherPurpose = document.getElementById('otherPurpose');
    const otherPurposeCounter = otherPurpose.closest('.other-purpose').querySelector('.char-counter');
    const radioButtons = document.querySelectorAll('input[name="purpose"]');

    // 字数计数功能
    otherPurpose.addEventListener('input', function() {
        const length = this.value.length;
        otherPurposeCounter.textContent = `${length}/100`;
        
        // 如果有内容，禁用单选框
        radioButtons.forEach(radio => {
            radio.disabled = length > 0;
            if (length > 0) {
                radio.checked = false;
            }
        });
    });

    // 单选框点击时自动填充文本框
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                otherPurpose.value = radio.value;  // 将选中的值填充到文本框
                otherPurposeCounter.textContent = `${radio.value.length}/100`;  // 更新字数统计
            }
        });
    });

    // 文本框获得焦点时的处理
    otherPurpose.addEventListener('focus', function() {
        // 将光标到文本末尾
        const length = this.value.length;
        this.setSelectionRange(length, length);
    });

    // 自动调整文本框高度
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // 为所有文本框添加自动调整高度功能
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        // 初始调整
        autoResizeTextarea(textarea);
        
        // 输入时调整
        textarea.addEventListener('input', () => {
            autoResizeTextarea(textarea);
        });
        
        // 窗口大小改变时调整
        window.addEventListener('resize', () => {
            autoResizeTextarea(textarea);
        });
    });

    // 点击时只改变文字颜色
    themeInput.addEventListener('focus', function() {
        this.classList.add('theme-input-active');
    });

    // 失去焦点时，如果内容为空则恢复默认文本和灰色
    themeInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.value = defaultText;
            this.classList.remove('theme-input-active');
        }
    });

    // 初始化字数统计
    themeCharCounter.textContent = `${defaultText.length}/100`;

    // 点击时只改变文字颜色
    titleInput.addEventListener('focus', function() {
        this.classList.add('title-input-active');
    });

    // 失去焦点时，如果内容为空则恢复默认文本和灰色
    titleInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.value = defaultTitleText;
            this.classList.remove('title-input-active');
        }
    });

    // 初始化字数统计
    titleCharCounter.textContent = `${defaultTitleText.length}/50`;

    // 字数模块功能
    const wordCount = document.getElementById('wordCount');
    const readingTime = document.getElementById('readingTime');

    // 计算阅读时间
    function calculateReadingTime(words) {
        // 假设平均阅读速度为400字/分钟
        const readingSpeed = 400;
        const minutes = Math.ceil(words / readingSpeed);
        return minutes;
    }

    // 设置默认值
    wordCount.value = 1500;
    const initialTime = calculateReadingTime(1500);
    readingTime.textContent = initialTime;

    // 字数输入处理
    wordCount.addEventListener('input', function() {
        const count = parseInt(this.value) || 0;
        
        // 限制输入范围
        if (count < 500) {
            this.value = 500;
        } else if (count > 50000) {
            this.value = 50000;
        }
        
        // 更新阅读时间
        const time = calculateReadingTime(this.value);
        readingTime.textContent = time;
    });

    // 失去焦点时确保是100的倍数
    wordCount.addEventListener('blur', function() {
        if (this.value) {
            const count = parseInt(this.value);
            this.value = Math.round(count / 100) * 100;
            
            // 更新阅读时间
            const time = calculateReadingTime(this.value);
            readingTime.textContent = time;
        }
    });

    // 读者画像模块功能
    const readerInput = document.getElementById('readerInput');
    const readerCharCounter = readerInput.closest('.input-group').querySelector('.char-counter');
    const defaultReaderText = '读者是[年龄段]的[性别]，[职业背景]，[兴趣爱好]。目前正在经历[心理困扰/需求]，希望通过[期待的改变]来[达到的目标]。';

    // 字数计数功能
    readerInput.addEventListener('input', function() {
        const length = this.value.length;
        readerCharCounter.textContent = `${length}/100`;
        autoResizeTextarea(this);
    });

    // 点击时只改变文字颜色
    readerInput.addEventListener('focus', function() {
        this.classList.add('reader-input-active');
    });

    // 失去焦点时，如果内容为空则恢复默认文本和灰色
    readerInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.value = defaultReaderText;
            this.classList.remove('reader-input-active');
        }
    });

    // 初始化字数统计
    readerCharCounter.textContent = `${defaultReaderText.length}/100`;

    // 技术流派模块功能
    const approachInput = document.getElementById('approachInput');
    const approachCharCounter = approachInput.closest('.input-group').querySelector('.char-counter');
    const defaultApproachText = '采用[技术流派]的视角，重点关注[核心理念]。';

    // 字数计数功能
    approachInput.addEventListener('input', function() {
        const length = this.value.length;
        approachCharCounter.textContent = `${length}/200`;
        autoResizeTextarea(this);
    });

    // 点击时只改变文字颜色
    approachInput.addEventListener('focus', function() {
        this.classList.add('approach-input-active');
    });

    // 失去焦点时，如果内容为空则恢复默认文本和灰色
    approachInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.value = defaultApproachText;
            this.classList.remove('approach-input-active');
        }
    });

    // 初始化字数统计
    approachCharCounter.textContent = `${defaultApproachText.length}/200`;

    // 风格模块功能
    const styleInput = document.getElementById('styleInput');
    const styleCharCounter = styleInput.closest('.input-group').querySelector('.char-counter');
    const defaultStyleText = '采用[风格特点]的写作风格，文案整体[语言特征]，让读者感受到[情感体验]。';

    // 字数计数功能
    styleInput.addEventListener('input', function() {
        const length = this.value.length;
        styleCharCounter.textContent = `${length}/100`;
        autoResizeTextarea(this);
    });

    // 点击时只改变文字颜色
    styleInput.addEventListener('focus', function() {
        this.classList.add('style-input-active');
    });

    // 失去焦点时，如果内容为空则恢复默认文本和灰色
    styleInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.value = defaultStyleText;
            this.classList.remove('style-input-active');
        }
    });

    // 初始化字数统计
    styleCharCounter.textContent = `${defaultStyleText.length}/100`;

    // 结构模块功能
    const structureInput = document.getElementById('structureInput');
    const structureCharCounter = structureInput.closest('.input-group').querySelector('.char-counter');
    const defaultStructureText = '点击上方结构或在此输入自定义结构要求';
    const structureOptions = document.querySelectorAll('.structure-option');

    // 字数计数功能
    structureInput.addEventListener('input', function() {
        const length = this.value.length;
        structureCharCounter.textContent = `${length}/1500`;
        autoResizeTextarea(this);
    });

    // 点击��只改变文字颜色
    structureInput.addEventListener('focus', function() {
        this.classList.add('structure-input-active');
    });

    // 失去焦点时，如果内容为空则恢复默认文本和灰色
    structureInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.value = defaultStructureText;
            this.classList.remove('structure-input-active');
        }
    });

    // 初始化字数统计
    structureCharCounter.textContent = `${defaultStructureText.length}/1500`;

    // 结构选项点击事件
    structureOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除其他选项的选中状态
            structureOptions.forEach(opt => opt.classList.remove('selected'));
            // 添加当前选项的选中状态
            this.classList.add('selected');
            
            // 获取结构内容
            const content = this.querySelector('.structure-content').textContent;
            // 更新输入框内容
            structureInput.value = content;
            structureInput.classList.add('structure-input-active');
            // 更新字数统计
            structureCharCounter.textContent = `${content.length}/1500`;
            // 自动调整高度
            autoResizeTextarea(structureInput);
        });
    });

    // 范文模块功能
    const referenceList = document.querySelector('.reference-list');
    const addReferenceBtn = document.querySelector('.add-reference');

    // 创建新的范文输入框
    function createReferenceInput() {
        const referenceItem = document.createElement('div');
        referenceItem.className = 'reference-item';
        
        referenceItem.innerHTML = `
            <div class="input-group">
                <textarea 
                    class="reference-input" 
                    placeholder="请粘贴参考文案（5000字以内）" 
                    maxlength="5000"
                ></textarea>
                <div class="char-counter">0/5000</div>
                <button class="remove-reference" title="删除此范文">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        // 添加字数统计功能
        const textarea = referenceItem.querySelector('textarea');
        const counter = referenceItem.querySelector('.char-counter');
        
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/5000`;
            autoResizeTextarea(this);
        });
        
        // 添加删除功能
        const removeBtn = referenceItem.querySelector('.remove-reference');
        removeBtn.addEventListener('click', () => {
            referenceItem.remove();
        });
        
        return referenceItem;
    }

    // 添加范文按钮点击事件
    addReferenceBtn.addEventListener('click', () => {
        const newReference = createReferenceInput();
        referenceList.appendChild(newReference);
        
        // 自动调整新添加的文本框高度
        const textarea = newReference.querySelector('textarea');
        autoResizeTextarea(textarea);
    });

    // 初始化第一个范文输入框的功能
    document.querySelectorAll('.reference-input').forEach(textarea => {
        const counter = textarea.closest('.input-group').querySelector('.char-counter');
        
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/5000`;
            autoResizeTextarea(this);
        });
    });

    // 文案生成功能
    const generateBtn = document.getElementById('generateBtn');
    const generatedContent = document.getElementById('generatedContent');
    const generatedCounter = document.querySelector('.generated-content-counter');

    // 自动调整文本框高度
    function autoResizeTextarea(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight + 2) + 'px';
    }

    // 更新字数统计
    function updateWordCount(text) {
        const count = text.trim().length;
        generatedCounter.textContent = `${count}字`;
    }

    // 监听文本变化
    generatedContent.addEventListener('input', function() {
        autoResizeTextarea(this);
        updateWordCount(this.value);
    });

    // 收集所有输入信息
    function collectInputs() {
        console.log('Collecting inputs...');
        
        // 获取主旨
        const theme = document.getElementById('themeInput').value.trim();
        if (!theme) {
            throw new Error('请输入文案主旨');
        }

        // 获取标题
        const title = document.getElementById('titleInput').value.trim();
        if (!title) {
            throw new Error('请输入文案标题');
        }

        // 获取用途
        let purpose = '';
        const purposeRadio = document.querySelector('input[name="purpose"]:checked');
        if (purposeRadio) {
            purpose = purposeRadio.value;
        } else {
            purpose = document.getElementById('otherPurpose').value.trim();
        }
        if (!purpose) {
            throw new Error('请选择或输入文案用途');
        }

        // 获取字数要求
        const wordCount = document.getElementById('wordCount').value;
        if (!wordCount || wordCount < 500 || wordCount > 50000) {
            throw new Error('请输入合适的字数要求(500-50000)');
        }

        // 获取读者画像
        const reader = document.getElementById('readerInput').value.trim();
        if (!reader) {
            throw new Error('请描述��标读者');
        }

        // 获取技术流派
        const approach = document.getElementById('approachInput').value.trim();
        if (!approach) {
            throw new Error('请输入技术流派');
        }

        // 获取写作风格
        const style = document.getElementById('styleInput').value.trim();
        if (!style) {
            throw new Error('请输入写作风格');
        }

        // 获取文章结构
        const structure = document.getElementById('structureInput').value.trim();
        if (!structure) {
            throw new Error('请选择或输入文章结构');
        }

        // 获取所有范文
        const references = Array.from(document.querySelectorAll('.reference-input'))
            .map(input => input.value.trim())
            .filter(text => text);

        console.log('Inputs collected successfully');
        return {
            theme,
            title,
            purpose,
            wordCount,
            reader,
            approach,
            style,
            structure,
            references
        };
    }

    // 生成文案
    generateBtn.addEventListener('click', async () => {
        try {
            // 显示加载状态
            generateBtn.disabled = true;
            generateBtn.querySelector('.button-text').style.display = 'none';
            generateBtn.querySelector('.loading-text').style.display = 'inline';
            generatedContent.value = '正在生成文案，请稍候...';
            autoResizeTextarea(generatedContent);
            updateWordCount('正在生成文案，请稍候...');

            // 收集输入信息
            const inputs = collectInputs();
            console.log('Collected inputs:', inputs);

            // 调用生成API
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || '生成失败');
            }

            // 显示生成的文案
            generatedContent.value = data.content;
            autoResizeTextarea(generatedContent);
            updateWordCount(data.content);

            // 启用复制和下载按钮
            document.getElementById('copyBtn').disabled = false;
            document.getElementById('downloadBtn').disabled = false;

        } catch (error) {
            console.error('生成失败:', error);
            alert(error.message || '生成失败，请重试');
            generatedContent.value = '生成失败，请检查输入并重试';
            autoResizeTextarea(generatedContent);
            updateWordCount('生成失败，请检查输入并重试');
        } finally {
            // 恢复按钮状态
            generateBtn.disabled = false;
            generateBtn.querySelector('.button-text').style.display = 'inline';
            generateBtn.querySelector('.loading-text').style.display = 'none';
        }
    });

    // 复制文案
    document.getElementById('copyBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(generatedContent.value)
            .then(() => alert('文案已复制到剪贴板'))
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制');
            });
    });

    // 下载文案
    document.getElementById('downloadBtn').addEventListener('click', () => {
        const blob = new Blob([generatedContent.value], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `生成的文案_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
}); 
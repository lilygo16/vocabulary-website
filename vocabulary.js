// 记单词应用核心功能
class VocabularyApp {
    constructor() {
        this.words = this.loadWords();
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.renderWordBook();
        this.renderWordLibrary();
        this.renderTagSuggestions();
    }

    // 绑定事件
    bindEvents() {
        // 页面导航
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchPage(e.target.dataset.page);
            });
        });

        // 表单提交
        document.getElementById('word-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWord();
        });

        // 搜索功能
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.currentSearch = e.target.value;
            this.renderWordBook();
        });

        document.getElementById('library-search-input').addEventListener('input', (e) => {
            this.currentSearch = e.target.value;
            this.renderWordLibrary();
        });

        // 标签输入事件
        document.getElementById('tags-input').addEventListener('input', () => {
            this.renderTagSuggestions();
        });
    }

    // 页面切换
    switchPage(pageName) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 移除所有导航项的激活状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // 激活当前页面和导航项
        if (pageName === 'ai-news') {
            // 跳转到AI新闻页面
            window.location.href = 'index.html';
            return;
        }

        document.getElementById(pageName).classList.add('active');
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // 根据页面重新渲染内容
        if (pageName === 'word-book') {
            this.renderWordBook();
        } else if (pageName === 'word-library') {
            this.renderWordLibrary();
        }
    }

    // 加载单词数据
    loadWords() {
        const stored = localStorage.getItem('vocabularyWords');
        return stored ? JSON.parse(stored) : [];
    }

    // 保存单词数据
    saveWords() {
        localStorage.setItem('vocabularyWords', JSON.stringify(this.words));
    }

    // 添加新单词
    addWord() {
        const form = document.getElementById('word-form');
        const formData = new FormData(form);
        
        const word = formData.get('word').trim();
        const phrase = formData.get('phrase').trim();
        const tagsInput = formData.get('tags').trim();
        
        // 处理标签
        const tags = tagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');

        // 创建单词对象
        const newWord = {
            id: Date.now().toString(),
            word: word,
            phrase: phrase,
            tags: tags,
            mastered: false,
            createdAt: new Date().toISOString()
        };

        // 添加到单词列表
        this.words.push(newWord);
        this.saveWords();

        // 清空表单
        form.reset();
        
        // 显示成功通知
        this.showNotification('单词添加成功！', 'success');

        // 重新渲染相关页面
        this.renderWordBook();
        this.renderTagSuggestions();
    }

    // 标记单词为掌握
    markAsMastered(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (word) {
            word.mastered = true;
            this.saveWords();
            this.renderWordBook();
            this.renderWordLibrary();
            this.showNotification('恭喜你掌握了这个单词！', 'success');
        }
    }

    // 从单词库移除（放回单词本）
    removeFromLibrary(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (word) {
            word.mastered = false;
            this.saveWords();
            this.renderWordBook();
            this.renderWordLibrary();
            this.showNotification('单词已放回单词本', 'success');
        }
    }

    // 删除单词
    deleteWord(wordId) {
        if (confirm('确定要删除这个单词吗？')) {
            this.words = this.words.filter(w => w.id !== wordId);
            this.saveWords();
            this.renderWordBook();
            this.renderWordLibrary();
            this.renderTagSuggestions();
            this.showNotification('单词已删除', 'success');
        }
    }

    // 按标签分组单词
    groupWordsByTags(words) {
        const grouped = {};
        words.forEach(word => {
            word.tags.forEach(tag => {
                if (!grouped[tag]) {
                    grouped[tag] = [];
                }
                grouped[tag].push(word);
            });
        });
        return grouped;
    }

    // 获取所有唯一标签
    getAllTags() {
        const tags = new Set();
        this.words.forEach(word => {
            word.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }

    // 渲染标签建议
    renderTagSuggestions() {
        const input = document.getElementById('tags-input');
        const suggestions = document.getElementById('tag-suggestions');
        const allTags = this.getAllTags();
        
        suggestions.innerHTML = '';
        
        if (allTags.length === 0) return;
        
        allTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag-suggestion';
            tagElement.textContent = tag;
            tagElement.addEventListener('click', () => {
                const currentValue = input.value.trim();
                if (currentValue) {
                    input.value = `${currentValue}, ${tag}`;
                } else {
                    input.value = tag;
                }
                this.renderTagSuggestions();
            });
            suggestions.appendChild(tagElement);
        });
    }

    // 渲染单词本
    renderWordBook() {
        const container = document.getElementById('word-container');
        const emptyState = document.getElementById('empty-wordbook');
        
        // 筛选未掌握的单词
        let filteredWords = this.words.filter(word => !word.mastered);
        
        // 应用搜索过滤
        if (this.currentSearch) {
            const searchLower = this.currentSearch.toLowerCase();
            filteredWords = filteredWords.filter(word => 
                word.word.toLowerCase().includes(searchLower) ||
                word.phrase.toLowerCase().includes(searchLower) ||
                word.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }
        
        // 应用标签过滤
        if (this.currentFilter !== 'all') {
            filteredWords = filteredWords.filter(word => 
                word.tags.includes(this.currentFilter)
            );
        }
        
        // 按标签分组
        const groupedWords = this.groupWordsByTags(filteredWords);
        const tags = Object.keys(groupedWords).sort();
        
        // 渲染内容
        if (tags.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            this.renderFilterTabs([]);
            return;
        }
        
        emptyState.style.display = 'none';
        
        // 渲染筛选标签
        this.renderFilterTabs(this.getAllTags());
        
        // 渲染单词卡片
        container.innerHTML = '';
        tags.forEach(tag => {
            const tagGroup = document.createElement('div');
            tagGroup.className = 'tag-group';
            tagGroup.innerHTML = `<h3>${tag}</h3>`;
            
            groupedWords[tag].forEach(word => {
                const card = this.createWordCard(word, false);
                tagGroup.appendChild(card);
            });
            
            container.appendChild(tagGroup);
        });
    }

    // 渲染单词库
    renderWordLibrary() {
        const container = document.getElementById('library-container');
        const emptyState = document.getElementById('empty-library');
        
        // 筛选已掌握的单词
        let filteredWords = this.words.filter(word => word.mastered);
        
        // 应用搜索过滤
        if (this.currentSearch) {
            const searchLower = this.currentSearch.toLowerCase();
            filteredWords = filteredWords.filter(word => 
                word.word.toLowerCase().includes(searchLower) ||
                word.phrase.toLowerCase().includes(searchLower) ||
                word.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }
        
        // 应用标签过滤
        if (this.currentFilter !== 'all') {
            filteredWords = filteredWords.filter(word => 
                word.tags.includes(this.currentFilter)
            );
        }
        
        // 按标签分组
        const groupedWords = this.groupWordsByTags(filteredWords);
        const tags = Object.keys(groupedWords).sort();
        
        // 渲染内容
        if (tags.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            this.renderLibraryFilterTabs([]);
            return;
        }
        
        emptyState.style.display = 'none';
        
        // 渲染筛选标签
        this.renderLibraryFilterTabs(this.getAllTags());
        
        // 渲染单词卡片
        container.innerHTML = '';
        tags.forEach(tag => {
            const tagGroup = document.createElement('div');
            tagGroup.className = 'tag-group';
            tagGroup.innerHTML = `<h3>${tag}</h3>`;
            
            groupedWords[tag].forEach(word => {
                const card = this.createWordCard(word, true);
                tagGroup.appendChild(card);
            });
            
            container.appendChild(tagGroup);
        });
    }

    // 创建单词卡片
    createWordCard(word, isLibrary = false) {
        const card = document.createElement('div');
        card.className = 'word-card';
        
        const tagsHtml = word.tags.map(tag => 
            `<span class="word-tag">${tag}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="word-card-header">
                <h3 class="word-card-title">${word.word}</h3>
                ${word.phrase ? `<p class="word-card-phrase">${word.phrase}</p>` : ''}
                <div class="word-card-tags">${tagsHtml}</div>
            </div>
            <div class="word-card-footer">
                ${isLibrary ? `
                    <div class="mastered-checkbox">
                        <input type="checkbox" checked disabled>
                        <span>已掌握</span>
                    </div>
                ` : `
                    <div class="mastered-checkbox">
                        <input type="checkbox" id="mastered-${word.id}">
                        <label for="mastered-${word.id}">记住啦</label>
                    </div>
                `}
                <div class="word-actions">
                    ${isLibrary ? `
                        <button class="action-btn" onclick="app.removeFromLibrary('${word.id}')">放回单词本</button>
                    ` : ''}
                    <button class="action-btn" onclick="app.deleteWord('${word.id}')">删除</button>
                </div>
            </div>
        `;
        
        // 添加记住单词的事件
        if (!isLibrary) {
            const checkbox = card.querySelector(`#mastered-${word.id}`);
            checkbox.addEventListener('change', () => {
                this.markAsMastered(word.id);
            });
        }
        
        return card;
    }

    // 渲染筛选标签
    renderFilterTabs(tags) {
        const tabsContainer = document.getElementById('filter-tabs');
        tabsContainer.innerHTML = '<button class="filter-tab active" data-filter="all">全部</button>';
        
        tags.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'filter-tab';
            button.dataset.filter = tag;
            button.textContent = tag;
            button.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                // 更新激活状态
                tabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                e.target.classList.add('active');
                this.renderWordBook();
            });
            tabsContainer.appendChild(button);
        });
    }

    // 渲染单词库筛选标签
    renderLibraryFilterTabs(tags) {
        const tabsContainer = document.getElementById('library-filter-tabs');
        tabsContainer.innerHTML = '<button class="filter-tab active" data-filter="all">全部</button>';
        
        tags.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'filter-tab';
            button.dataset.filter = tag;
            button.textContent = tag;
            button.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                // 更新激活状态
                tabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                e.target.classList.add('active');
                this.renderWordLibrary();
            });
            tabsContainer.appendChild(button);
        });
    }

    // 显示通知
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // 加载单词数据（静态方法）
    static loadWords() {
        const stored = localStorage.getItem('vocabularyWords');
        return stored ? JSON.parse(stored) : [];
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VocabularyApp();
});
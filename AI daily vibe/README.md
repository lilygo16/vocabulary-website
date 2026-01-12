# 记单词应用

一个基于HTML、CSS和JavaScript开发的静态记单词网页应用，无需后端服务，数据保存在浏览器本地存储中。

## 功能特性

### 1. 记单词
- 输入单词、词组/例句和标签
- 支持自定义标签和自动补全
- 提交后保存到单词本

### 2. 单词本
- 按标签分类展示未掌握的单词
- 每个单词卡片显示单词、词组/例句和标签
- 勾选"记住啦"复选框，将单词移到单词库
- 支持按单词或标签搜索
- 可删除单词

### 3. 单词库
- 展示已掌握的单词
- 同样按标签分类
- 可将单词放回单词本
- 支持搜索功能

### 4. 其他特性
- 响应式设计，适配移动端和桌面端
- 与AI新闻页面无缝切换
- 本地存储，数据持久化

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript (ES6+)** - 功能实现
- **localStorage** - 数据存储

## 项目结构

```
vocabulary-app/
├── index.html          # AI新闻页面
├── vocabulary.html     # 记单词应用主页面
├── style.css           # 样式文件
├── script.js           # AI新闻脚本
├── vocabulary.js       # 记单词应用核心脚本
├── ai_news_data.json   # AI新闻数据
├── test.html           # 功能测试页面
├── DEPLOYMENT_GUIDE.md # 部署指南
└── README.md           # 项目说明
```

## 使用方法

### 本地使用

1. 直接在浏览器中打开 `vocabulary.html` 文件
2. 或使用本地HTTP服务器：
   ```bash
   # 使用Python 3
   python -m http.server 8000
   
   # 或使用Node.js http-server
   npx http-server -p 3000
   ```
3. 在浏览器中访问：`http://localhost:8000/vocabulary.html`

### 在线访问

应用已部署到GitHub Pages，可直接访问：
- 应用首页：https://your-username.github.io/vocabulary-app
- 记单词页面：https://your-username.github.io/vocabulary-app/vocabulary.html
- AI新闻页面：https://your-username.github.io/vocabulary-app/index.html

## 部署说明

详细的部署步骤请参考：[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 作者

AI Daily Vibe Team
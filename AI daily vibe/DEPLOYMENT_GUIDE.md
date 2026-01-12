# 记单词应用部署指南

## 项目概述
这是一个基于HTML、CSS和JavaScript开发的静态记单词应用，包含以下功能：
- 记单词：输入单词、词组/例句、标签
- 单词本：按标签分类展示未掌握的单词
- 单词库：展示已掌握的单词
- 搜索功能：支持按单词或标签搜索

## 部署方案
我们将使用 **GitHub Pages** 进行部署，这是一个免费的静态网站托管服务，适合部署HTML、CSS和JavaScript开发的静态网站。

## 部署步骤

### 1. 创建GitHub仓库
1. 登录或注册GitHub账号：https://github.com
2. 点击右上角的「+」按钮，选择「New repository」
3. 填写仓库信息：
   - Repository name：例如 `vocabulary-app`
   - Description：记单词应用
   - Public：选择公开仓库（GitHub Pages需要公开仓库才能免费使用）
   - Initialize this repository with a README：可选
4. 点击「Create repository」创建仓库

### 2. 上传项目文件

#### 方法一：使用Git命令行（推荐）
1. 在本地项目目录打开命令行
2. 初始化Git仓库：
   ```bash
   git init
   ```
3. 添加所有文件：
   ```bash
   git add .
   ```
4. 提交文件：
   ```bash
   git commit -m "Initial commit"
   ```
5. 关联GitHub仓库：
   ```bash
   git remote add origin https://github.com/your-username/vocabulary-app.git
   ```
6. 推送文件到GitHub：
   ```bash
   git push -u origin main
   ```

#### 方法二：使用GitHub网页界面
1. 进入刚创建的GitHub仓库
2. 点击「Add file」按钮，选择「Upload files」
3. 拖拽所有项目文件到上传区域，或点击「choose your files」选择文件
4. 填写提交信息，点击「Commit changes」

### 3. 配置GitHub Pages
1. 进入GitHub仓库，点击「Settings」
2. 在左侧菜单中点击「Pages」
3. 在「Source」部分：
   - 选择「Deploy from a branch」
   - Branch：选择「main」
   - Folder：选择「/(root)」
4. 点击「Save」按钮
5. 等待几分钟，GitHub Pages会自动部署你的网站
6. 部署完成后，你会在页面顶部看到部署成功的提示和访问URL

### 4. 测试访问
1. 复制GitHub Pages提供的URL，例如：https://your-username.github.io/vocabulary-app
2. 在浏览器中打开该URL，测试应用是否能正常访问和使用
3. 分享该URL给其他人，他们就可以访问你的记单词应用了

## 其他部署选项

### Vercel
1. 登录或注册Vercel账号：https://vercel.com
2. 点击「New Project」
3. 选择「Import Git Repository」
4. 输入GitHub仓库URL，点击「Import」
5. 配置项目设置，点击「Deploy」
6. 部署完成后，Vercel会提供一个访问URL

### Netlify
1. 登录或注册Netlify账号：https://www.netlify.com
2. 点击「Add new site」，选择「Import an existing project」
3. 选择GitHub，授权Netlify访问你的GitHub账号
4. 选择要部署的仓库
5. 配置构建设置（静态网站无需特殊配置）
6. 点击「Deploy site」
7. 部署完成后，Netlify会提供一个访问URL

## 项目文件说明
- `index.html` - AI新闻页面
- `vocabulary.html` - 记单词应用主页面
- `style.css` - 样式文件
- `script.js` - AI新闻脚本
- `vocabulary.js` - 记单词应用核心脚本
- `ai_news_data.json` - AI新闻数据
- `test.html` - 功能测试页面

## 访问路径
- 应用首页：https://your-username.github.io/vocabulary-app
- 记单词页面：https://your-username.github.io/vocabulary-app/vocabulary.html
- AI新闻页面：https://your-username.github.io/vocabulary-app/index.html

## 注意事项
1. 确保项目中的所有文件路径都是相对路径，避免使用绝对路径
2. 测试所有功能，确保在部署后能正常工作
3. 如果需要自定义域名，可以在GitHub Pages、Vercel或Netlify中配置
4. 定期更新内容，保持应用的活跃度

## 后续维护
1. 如需更新应用，只需将修改后的文件推送到GitHub仓库
2. GitHub Pages会自动重新部署，无需手动操作
3. 定期检查应用的访问情况，确保正常运行

---

**部署成功后，你的记单词应用就可以在互联网上访问了！**
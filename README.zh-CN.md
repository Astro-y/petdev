# Petdev 中文说明

Petdev 是一个给 Codex 桌面宠物使用的多宠物图鉴站点，同时包含一个 `petdev` npm 命令行工具。站点可以部署到 Vercel，宠物包文件托管在 GitHub Releases。

## 挑选并安装宠物

先查看可安装的宠物列表：

```powershell
npx petdev list
```

也可以打开图鉴网站挑选：

```text
https://petdev.8xy.net/
```

选好后再安装：

```powershell
npx petdev install <pet-id>
```

命令会从 `Astro-y/petdev` 的 GitHub Releases 下载对应 ZIP，并安装到本机 Codex 宠物目录：

```text
C:\Users\<你的用户名>\.codex\pets\<pet-id>
```

安装完成后，在 Codex 里打开 `Appearance -> Pets`，选择对应宠物即可。

## 本地开发

```powershell
npm install
npm run dev
npm test
npm run build
```

本地站点默认地址：

```text
http://localhost:3000
```

## 新增宠物

先准备一个宠物文件夹，里面必须有：

```text
pet.json
spritesheet.webp
```

然后运行：

```powershell
npm run add:pet -- --source "C:\path\to\pet-folder" --tag v1.0.1 --zh-name "中文名"
```

这个命令会自动完成：

- 复制宠物文件到 `public\pets\<pet-id>\`
- 追加宠物信息到 `packages\petdev\src\catalog.js`
- 生成 `release\<pet-id>.zip`

新增后，本地检查：

```powershell
npm test
npm run build
node packages\petdev\bin\petdev.js list
```

如果 `npm run build` 输出里出现 `/pets/<pet-id>`，说明详情页已经自动生成。

## 发布新宠物

新增宠物后，还需要做三件事。

第一步，创建 GitHub Release。

在 `Astro-y/petdev` 仓库创建与脚本参数一致的 tag，例如：

```text
v1.0.1
```

然后上传：

```text
release\<pet-id>.zip
```

注意文件必须上传到 Release 的 `Assets` 区域，不是正文描述区域。正确下载链接应类似：

```text
https://github.com/Astro-y/petdev/releases/download/v1.0.1/<pet-id>.zip
```

第二步，提升 npm 包版本号。

编辑：

```text
packages\petdev\package.json
```

例如：

```json
{
  "version": "0.1.1"
}
```

第三步，发布 npm：

```powershell
npm publish --workspace packages/petdev --access public
```

发布后测试：

```powershell
npx --yes petdev@latest list
npx --yes petdev@latest install <pet-id>
```

## 重要文件

- `packages\petdev\src\catalog.js`：宠物目录数据，站点和 CLI 都读取这里。
- `public\pets\`：站点展示用宠物资源。
- `release\`：要上传到 GitHub Releases 的 ZIP。
- `scripts\add-pet.mjs`：新增宠物自动化脚本。
- `app\`：Next.js 页面。

## 常见问题

### `npx petdev install ...` 报 404

如果错误是 npm registry 404，说明 npm 包还没有发布，或者本地 registry 配置不对。

如果错误是 GitHub Release ZIP 404，说明 `catalog.js` 里的 `releaseZip` 指向的 Release 文件不存在，或者 ZIP 没有上传到 Release Assets。

### 为什么新增宠物后页面会自动增加？

首页和详情页都读取 `packages\petdev\src\catalog.js`。`npm run add:pet` 会自动追加这个文件，所以新增宠物后首页会多卡片，详情页 `/pets/<pet-id>` 也会自动生成。

> 技术栈： react、expo、react-native、ts

> 前置准备：手机端下载 Expo Go 软件

启动

```
pnpm install

```

```
pnpm start

```

```
手机登录 Expo Go 软件 输入链接/扫码

```

```
终端 `R` 强制更新
```


```
flashNoteAI
├─ .env
├─ app.json
├─ App.tsx
├─ assets
│  ├─ adaptive-icon.png
│  ├─ favicon.png
│  ├─ icon.png
│  └─ splash-icon.png
├─ index.ts
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ README.md
├─ src
│  ├─ api
│  │  ├─ ai.ts
│  │  ├─ mock.ts
│  │  └─ notes.ts
│  ├─ components
│  │  ├─ common
│  │  │  ├─ Button.tsx
│  │  │  └─ Input.tsx
│  │  ├─ notes
│  │  │  ├─ DraggableCard.tsx
│  │  │  ├─ NoteCard.tsx
│  │  │  ├─ NoteDetailModal.tsx
│  │  │  ├─ NoteInput.tsx
│  │  │  └─ StructureEditor.tsx
│  │  └─ SafeAreaContainer.tsx
│  ├─ constants
│  │  └─ Colors.ts
│  ├─ context
│  │  └─ NotesContext.tsx
│  ├─ hooks
│  ├─ screens
│  │  ├─ HomeScreen.tsx
│  │  ├─ NotesScreen.tsx
│  │  ├─ OrganizeScreen.tsx
│  │  ├─ ProfileScreen.tsx
│  │  └─ TimelineScreen.tsx
│  ├─ types
│  │  └─ index.ts
│  └─ utils
│     └─ note.ts
└─ tsconfig.json

```
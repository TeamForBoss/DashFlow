## run 
npm run dev

# 설치
npx create-react-app 프로젝트명 --template typescript
npm i sass

## setting
npm create vite@latest 프로젝트명 --template react-ts
cd frontend
npm install

## 구조
frontend
├── src
│   ├── assets/            # 이미지, 아이콘 등의 정적 파일
│   ├── components/        # 재사용 가능한 컴포넌트 폴더
│   ├── pages/             # 페이지 단위 컴포넌트 폴더
│   ├── features/          # 각 페이지별 컴포넌트 폴더

│   ├── App.tsx            # 메인 컴포넌트
│   ├── main.tsx           # 앱 진입점 (Vite 기준)

│   ├── vite.config.ts      # Vite 설정 파일 (Vite 사용 시)
│   ├── tsconfig.json       # TypeScript 설정 파일
│   ├── package.json        # 프로젝트 설정 파일
│   └── ...                


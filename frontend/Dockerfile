# 1. Node.js + 필요한 패키지 포함한 이미지 사용
FROM node:18-alpine

# 2. 필수 패키지 설치 (Alpine 환경에서 필요한 경우)
RUN apk add --no-cache python3 make g++

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. package.json 및 lock 파일만 먼저 복사 (의존성 캐싱 최적화)
COPY package.json package-lock.json ./

# 5. 깨끗한 환경에서 패키지 설치
RUN npm install

# 6. 나머지 파일 복사
COPY . .

# 7. 실행 명령어 설정 (빌드 없이 개발 모드 실행)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

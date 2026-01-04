#!/bin/bash

# 강원도 여행 웹페이지 업데이트 스크립트
echo "GitHub에 변경사항을 업로드합니다..."

# 1. 변경된 파일 스테이징
git add .

# 2. 커밋 (메시지는 날짜/시간 포함)
COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S') 수정사항 반영"
git commit -m "$COMMIT_MSG"

# 3. 푸시
git push

echo ""
echo "✅ 업로드 완료!"
echo "이제 Vercel에서 자동으로 배포가 시작됩니다."

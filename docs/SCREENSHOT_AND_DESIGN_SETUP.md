# 스크린샷 및 개선 디자인 이미지 기능 설정 가이드

## 개요

이 가이드는 웹사이트 분석 시 스크린샷을 자동으로 생성하고, 각 이슈에 대해 개선된 디자인 이미지를 AI로 생성하는 기능을 설정하는 방법을 설명합니다.

## 기능 설명

1. **스크린샷 생성**: 분석 대상 웹사이트의 스크린샷을 자동으로 생성
2. **개선 디자인 이미지 생성**: 각 이슈(특히 높은 심각도)에 대해 OpenAI DALL-E를 사용하여 개선된 디자인 이미지 생성

## 필요한 API 키

### 1. 스크린샷 API 키 (선택사항 - 하나만 선택)

#### 옵션 A: ScreenshotAPI (권장)
- 웹사이트: https://screenshotapi.net/
- 무료 플랜: 월 100회
- 환경 변수: `SCREENSHOT_API_KEY`

#### 옵션 B: HTML/CSS to Image
- 웹사이트: https://htmlcsstoimage.com/
- 무료 플랜: 월 50회
- 환경 변수: `HTMLCSSTOIMAGE_API_KEY`

#### 옵션 C: URLBox
- 웹사이트: https://www.urlbox.io/
- 무료 플랜: 월 100회
- 환경 변수: `URLBOX_API_KEY`, `URLBOX_SECRET`

### 2. OpenAI API 키 (필수)

- 웹사이트: https://platform.openai.com/
- DALL-E 3 이미지 생성에 사용
- 환경 변수: `OPENAI_API_KEY` (이미 설정되어 있어야 함)

## Supabase Edge Function 환경 변수 설정

1. Supabase Dashboard에 로그인
2. **Edge Functions** > **Settings** 이동
3. **Secrets** 섹션에서 다음 환경 변수 추가:

```bash
# 스크린샷 API (하나만 선택)
SCREENSHOT_API_KEY=your_screenshot_api_key
# 또는
HTMLCSSTOIMAGE_API_KEY=your_htmlcsstoimage_api_key
# 또는
URLBOX_API_KEY=your_urlbox_api_key
URLBOX_SECRET=your_urlbox_secret

# OpenAI API (이미 설정되어 있어야 함)
OPENAI_API_KEY=your_openai_api_key
```

## 데이터베이스 스키마 업데이트

다음 SQL을 Supabase SQL Editor에서 실행하세요:

```sql
-- analyses 테이블에 스크린샷 및 개선 디자인 URL 컬럼 추가
ALTER TABLE analyses 
ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS improved_design_urls JSONB;
```

## 사용 방법

### 1. 스크린샷 생성

분석 요청 시 자동으로 스크린샷이 생성됩니다:
- 분석 대상 URL의 스크린샷을 자동으로 생성
- 결과 페이지에 스크린샷 표시

### 2. 개선 디자인 이미지 생성

분석 결과에 따라 자동으로 생성됩니다:
- 높은 심각도 이슈에 대해 우선적으로 생성
- 각 이슈 카드에 개선된 디자인 이미지 표시
- AI가 생성한 개선 제안 시각화

## 비용 고려사항

### 스크린샷 API
- 무료 플랜: 월 50-100회
- 유료 플랜: 사용량에 따라 결정

### OpenAI DALL-E 3
- 이미지 생성: $0.04/image (1024x1024)
- 높은 심각도 이슈만 생성하도록 최적화
- 최대 3개 이미지 생성 (비용 절감)

## 트러블슈팅

### 스크린샷이 생성되지 않는 경우

1. API 키가 올바르게 설정되었는지 확인
2. 환경 변수가 Supabase Edge Function에 설정되었는지 확인
3. API 서비스의 할당량을 확인

### 개선 디자인 이미지가 생성되지 않는 경우

1. OpenAI API 키가 설정되었는지 확인
2. API 할당량을 확인
3. DALL-E 3 모델이 사용 가능한지 확인

### 이미지가 표시되지 않는 경우

1. 이미지 URL이 유효한지 확인
2. CORS 설정 확인
3. 브라우저 콘솔에서 오류 확인

## 향후 개선 사항

1. **Supabase Storage 통합**: 생성된 이미지를 Supabase Storage에 저장
2. **이미지 최적화**: 생성된 이미지 자동 최적화
3. **배치 처리**: 여러 이슈에 대한 이미지를 배치로 생성
4. **캐싱**: 동일한 이슈에 대한 이미지 재사용

## 참고 자료

- [ScreenshotAPI Documentation](https://screenshotapi.net/docs)
- [OpenAI DALL-E Documentation](https://platform.openai.com/docs/guides/images)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)










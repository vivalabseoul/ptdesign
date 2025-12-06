/**
 * 스크린샷 생성 유틸리티
 * 외부 API를 사용하여 웹사이트 스크린샷 생성
 */

export async function takeScreenshot(url: string): Promise<string | null> {
  try {
    // 방법 1: ScreenshotAPI 사용 (무료 플랜 제공)
    // https://screenshotapi.net/
    const screenshotApiKey = Deno.env.get("SCREENSHOT_API_KEY");
    if (screenshotApiKey) {
      console.log("ScreenshotAPI를 사용하여 스크린샷 생성 시도 중...");
      const screenshotUrl = `https://shot.screenshotapi.net/screenshot?token=${screenshotApiKey}&url=${encodeURIComponent(
        url
      )}&width=1920&height=1080&output=image&file_type=png&wait_for_event=load`;

      // URL을 직접 반환 (이미지가 외부 서비스에 저장됨)
      // 실제로 이미지가 로드될 때까지 대기하지 않으므로, 이미지가 즉시 사용 가능하지 않을 수 있음
      return screenshotUrl;
    }

    // 방법 2: htmlcsstoimage.com 사용
    const htmlcsstoimageApiKey = Deno.env.get("HTMLCSSTOIMAGE_API_KEY");
    if (htmlcsstoimageApiKey) {
      console.log("HTML/CSS to Image API를 사용하여 스크린샷 생성 시도 중...");
      try {
        const response = await fetch("https://hcti.io/v1/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(htmlcsstoimageApiKey + ":")}`,
          },
          body: JSON.stringify({
            url: url,
            viewport_width: 1920,
            viewport_height: 1080,
            device_scale: 1,
            format: "png",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("HTML/CSS to Image API로 스크린샷 생성 성공");
          return data.url; // 이미지 URL 반환
        } else {
          const errorText = await response.text();
          console.error(
            `HTML/CSS to Image API 오류 (${response.status}):`,
            errorText
          );
        }
      } catch (error) {
        console.error("HTML/CSS to Image API 요청 실패:", error);
      }
    }

    // 방법 3: urlbox.io 사용
    const urlboxApiKey = Deno.env.get("URLBOX_API_KEY");
    const urlboxSecret = Deno.env.get("URLBOX_SECRET");
    if (urlboxApiKey && urlboxSecret) {
      console.log("URLbox API를 사용하여 스크린샷 생성 시도 중...");
      const screenshotUrl = `https://api.urlbox.io/v1/${urlboxApiKey}/png?url=${encodeURIComponent(
        url
      )}&width=1920&height=1080&wait_for=load`;

      // URL을 직접 반환
      return screenshotUrl;
    }

    // 방법 4: 서버리스 브라우저 사용 (Playwright for Deno)
    // 더 복잡하지만 더 유연함
    // TODO: Playwright for Deno 구현

    console.warn(
      "스크린샷 API 키가 설정되지 않았습니다. 다음 환경 변수 중 하나를 설정하세요:"
    );
    console.warn("- SCREENSHOT_API_KEY (ScreenshotAPI)");
    console.warn("- HTMLCSSTOIMAGE_API_KEY (HTML/CSS to Image)");
    console.warn("- URLBOX_API_KEY + URLBOX_SECRET (URLbox)");
    console.warn(
      "참고: 스크린샷 생성은 선택적 기능이며, API 키가 없어도 분석은 정상적으로 진행됩니다."
    );
    return null;
  } catch (error) {
    console.error(
      "스크린샷 생성 중 예외 발생:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

/**
 * Base64로 스크린샷 다운로드
 */
export async function downloadScreenshotAsBase64(
  imageUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`이미지 다운로드 실패: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("이미지 다운로드 오류:", error);
    return null;
  }
}

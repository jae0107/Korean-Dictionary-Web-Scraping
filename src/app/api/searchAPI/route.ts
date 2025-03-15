import { NextResponse } from "next/server";
// import puppeteer, { Browser } from "puppeteer";
import * as cheerio from "cheerio";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import axios from "axios";

// const koDic = async (userSearch: string) => {
//   let browser: Browser | null = null;
//   try {
//     browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-software-rasterizer'],
//     });
//     const page = await browser.newPage();

//     const encodedSearch = userSearch.replace(/ /g, "+");
//     const koDicUrl = `https://krdict.korean.go.kr/kor/dicMarinerSearch/search?nationCode=&ParaWordNo=&mainSearchWord=${encodedSearch}`;
    
//     await page.setRequestInterception(true);
//     page.on('request', (request) => {
//       if (['image', 'stylesheet', 'font', 'script'].includes(request.resourceType())) {
//         request.abort();
//       } else {
//         request.continue();
//       }
//     });

//     await page.goto(koDicUrl, { waitUntil: 'domcontentloaded' });

//     const meaning = await page.evaluate(() => {
//       const elements = document.querySelectorAll('dl#article0 dd');
//       console.log("elements: ", elements);
//       if (!elements.length) return [];
      
//       return Array.from(elements).map(element => {
//         let textContent = element.textContent ? element.textContent.trim() : '';
        
//         // Remove any number followed by a period (e.g., "1.", "2.", etc.)
//         textContent = textContent.replace(/^\d+\./, '').trim(); // Remove leading number + period

//         // Clean up unwanted characters like \t, \n, \r, and extra spaces
//         textContent = textContent.replace(/[\t\r\n]+/g, ' '); // Replace tabs, newlines, and carriage returns with a single space
//         textContent = textContent.replace(/\s+/g, ' '); // Replace multiple spaces with a single space

//         // Updated regex to include punctuation and Korean characters
//         const koreanAndPunctuation = textContent.match(/[\uac00-\ud7af\s.,!?…]+/g);
        
//         return koreanAndPunctuation ? koreanAndPunctuation.join('').trim() : '';
//       });
//     });

//     return meaning;
//   } catch (error) {
//     console.log(`koDic: ${(error as Error).message}`);
//     return { error: `An error occurred: ${(error as Error).message}` };
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// };

// const naverDic = async (userSearch: string) => {
// 	let browser: Browser | null = null;
// 	try {
// 		browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-software-rasterizer'],
//     });
// 		const page = await browser.newPage();

// 		const naverEncodedSearch = userSearch.replace(/ /g, "%20");
// 		const naverDicUrl = `https://ko.dict.naver.com/#/search?query=${naverEncodedSearch}`;

// 		await page.goto(naverDicUrl, { waitUntil: 'networkidle2' }); // Wait for network to be idle (2 requests or fewer)

// 		// Wait for the <div id="content"> to have content
// 		await page.waitForSelector('#content:not(:empty)', { timeout: 60000 }); // Adjust timeout if needed

// 		const html = await page.content();

// 		const $ = cheerio.load(html); //load the html content
		
// 		const meaning = $("div#searchPage_entry div.row:first-child li.mean_item p.mean")
// 			.map((index, element) => {
// 				// Clone the element to avoid modifying the original
// 				const clonedElement = $(element).clone();
//         console.log("clonedElement: ", clonedElement)
// 				// Remove undesired span elements
// 				clonedElement.find("span.word_class, span.mark").remove();

// 				// Extract text and clean it
// 				const koreanAndPunctuation = clonedElement.text().match(/[\uac00-\ud7af\s.,!?]+/g);
//         console.log("koreanAndPunctuation: ", koreanAndPunctuation)
// 				const cleanMeaning = koreanAndPunctuation ? koreanAndPunctuation.join('').trim() : '';

// 				return cleanMeaning;
// 			})
// 			.get();
		
// 		return Array.isArray(meaning) ? meaning : [];;
// 	} catch (error: any) {
//     console.log(`naverDic: ${(error as Error).message}`);
// 		return NextResponse.json(
// 			{ error: `An error occurred: ${error.message}` },
// 			{ status: 200 }
// 		);
// 	} finally {
// 		if (browser) {
// 			await browser.close();
// 		}
// 	}
// }

const koDic = async (userSearch: string) => {
  try {
    const encodedSearch = userSearch.replace(/ /g, "+");
    const koDicUrl = `https://krdict.korean.go.kr/kor/dicMarinerSearch/search?nationCode=&ParaWordNo=&mainSearchWord=${encodedSearch}`;

    // Axios로 HTML 가져오기
    const { data } = await axios.get(koDicUrl);

    // Cheerio로 HTML 파싱
    const $ = cheerio.load(data);

    // 원하는 데이터 추출
    const meaning = $("dl#article0 dd")
      .map((index, element) => {
        let textContent = $(element).text().trim();

        // Remove any number followed by a period (e.g., "1.", "2.", etc.)
        textContent = textContent.replace(/^\d+\./, '').trim(); // Remove leading number + period

        // Clean up unwanted characters like \t, \n, \r, and extra spaces
        textContent = textContent.replace(/[\t\r\n]+/g, ' '); // Replace tabs, newlines, and carriage returns with a single space
        textContent = textContent.replace(/\s+/g, ' '); // Replace multiple spaces with a single space

        // Return cleaned-up text
        return textContent;
      })
      .get();

    return meaning;
  } catch (error) {
    console.log(`koDic: ${(error as Error).message}`);
    return { error: `An error occurred: ${(error as Error).message}` };
  }
};

// Naver Dictionary (naverDic) 크롤링
const naverDic = async (userSearch: string) => {
  try {
    const naverEncodedSearch = userSearch.replace(/ /g, "%20");
    const naverDicUrl = `https://ko.dict.naver.com/#/search?query=${naverEncodedSearch}`;

    // Axios로 HTML 가져오기
    const { data } = await axios.get(naverDicUrl);
    console.log("data: ", data)
    // Cheerio로 HTML 파싱
    const $ = cheerio.load(data);

    // 원하는 데이터 추출
    const meaning = $("div#searchPage_entry div.row:first-child li.mean_item p.mean")
      .map((index, element) => {
        const clonedElement = $(element).clone();
        console.log("clonedElement: ", clonedElement)
        // 불필요한 span 요소 제거
        clonedElement.find("span.word_class, span.mark").remove();

        // 텍스트 추출 및 정리
        const koreanAndPunctuation = clonedElement.text().match(/[\uac00-\ud7af\s.,!?]+/g);

        return koreanAndPunctuation ? koreanAndPunctuation.join('').trim() : '';
      })
      .get();

    return meaning;
  } catch (error: any) {
    console.log(`naverDic: ${(error as Error).message}`);
    return { error: `An error occurred: ${error.message}` };
  }
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // If no session, return an unauthorized error
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  const { searchPrompt: userSearch } = await request.json();

  if (!userSearch) {
    return NextResponse.json(
      { error: "Search parameter not provided" },
      { status: 400 }
    );
  }

  // Run both scrapers concurrently
  const [koDicRes, naverDicRes] = await Promise.all([koDic(userSearch), naverDic(userSearch)]);

  return NextResponse.json({
    title: userSearch,
    koDic: Array.isArray(koDicRes) ? koDicRes : [],
    naverDic: Array.isArray(naverDicRes) ? naverDicRes : [],
  });
}

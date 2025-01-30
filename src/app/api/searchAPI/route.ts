import { NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";
import * as cheerio from "cheerio";

const koDic = async (userSearch: string) => {
	let browser: Browser | null = null;
	try {
		browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		const encodedSearch = userSearch.replace(/ /g, "+");
		const koDicUrl = `https://krdict.korean.go.kr/kor/dicMarinerSearch/search?nationCode=&ParaWordNo=&mainSearchWord=${encodedSearch}`;
		
		await page.goto(koDicUrl, { waitUntil: 'networkidle2' });

		const html = await page.content(); //get the entire html content
		const $ = cheerio.load(html); //load the html content
		const meaning = $("dl#article0 dd")
			.map((index, element) => {
				const koreanAndSpaces = $(element).text().match(/[\uac00-\ud7af ]+/g)
				const cleanMeaning = koreanAndSpaces ? koreanAndSpaces.join('').trim() : '';
				return cleanMeaning;
			})
			.get();
		
		return meaning;
	} catch (error: any) {
		return NextResponse.json(
			{ error: `An error occurred: ${error.message}` },
			{ status: 200 }
		);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

const naverDic = async (userSearch: string) => {
	let browser: Browser | null = null;
	try {
		browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		const naverEncodedSearch = userSearch.replace(/ /g, "%20");
		const naverDicUrl = `https://ko.dict.naver.com/#/search?query=${naverEncodedSearch}`;

		await page.goto(naverDicUrl, { waitUntil: 'networkidle2' }); // Wait for network to be idle (2 requests or fewer)

		// Wait for the <div id="content"> to have content
		await page.waitForSelector('#content:not(:empty)', { timeout: 60000 }); // Adjust timeout if needed

		const html = await page.content();

		const $ = cheerio.load(html); //load the html content
		
		const meaning = $("div#searchPage_entry div.row:first-child li.mean_item p.mean").map((index, element) => {
			const koreanAndSpaces = $(element).text().match(/[\uac00-\ud7af ]+/g)
			const cleanMeaning = koreanAndSpaces ? koreanAndSpaces.join('').trim() : '';
			return cleanMeaning;
		}).get();
		
		return meaning;
	} catch (error: any) {
		return NextResponse.json(
			{ error: `An error occurred: ${error.message}` },
			{ status: 200 }
		);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

export async function POST(request: Request) {
  const { searchPrompt: userSearch } = await request.json();
	
	if (!userSearch) {
		return NextResponse.json(
			{ error: "Search parameter not provided" },
			{ status: 400 }
		);
	}
	
	const koDicRes = await koDic(userSearch);
	const naverDicRes = await naverDic(userSearch);

	return NextResponse.json({ 
		title: userSearch,
		koDic: koDicRes,
		naverDic: naverDicRes
	});
}
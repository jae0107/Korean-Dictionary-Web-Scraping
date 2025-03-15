import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import axios from "axios";

interface NaverResponse {
  searchResultMap: {
    searchResultListMap: {
      WORD: {
        query: string;
        items: {
          entryId: string;
          meansCollector: {
            means: {
              value: string;
            }[];
          }[];
        }[];
      };
    };
  };
};

interface NaverSubResponse {
  entry: {
    means: {
      origin_mean: string;
    }[];
  };
};

const koDic = async (userSearch: string) => {
  try {
    const encodedSearch = userSearch.replace(/ /g, "+");
    const koDicUrl = `https://krdict.korean.go.kr/kor/dicMarinerSearch/search?nationCode=&ParaWordNo=&mainSearchWord=${encodedSearch}`;

    const { data } = await axios.get(koDicUrl);

    const $ = cheerio.load(data);

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
    return { error: `An error occurred: ${(error as Error).message}` };
  }
};

// Naver Dictionary (naverDic) 크롤링
const naverDic = async (userSearch: string) => {
  try {
    const naverEncodedSearch = userSearch.replace(/ /g, "%20");
    const naverRes = await fetch(`https://ko.dict.naver.com/api3/koko/search?query=${naverEncodedSearch}=&range=all&lang=ko&hid=174202349183224740`, {
      "headers": {
        "accept": "text/html, */*; q=0.01",
        "accept-language": "en-GB,en;q=0.7",
        "alldict-locale": "en",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Brave\";v=\"134\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "NNB=EIUDPN2LUYFGO; NAC=DuOhBYAI7rZ3; nid_inf=158752215; NID_JKL=Gd7PjHT3lN8Bq+qmOQ28kAwla3zjK62tsu7Ba1asMv8=; page_uid=i8x9rsqps8wssijqUG8ssssstbK-507855; ba.uuid=963a84a2-6b26-4369-a1f6-23853dae71b6; BUC=mc5H_7MGn8irGBPC6zz8SSEH4nY_2JByjt66YWD6jpk=; JSESSIONID=D57118271705E31D6EAD9ED22E95F1CA",
        "Referer": "https://ko.dict.naver.com/",
        "Referrer-Policy": "unsafe-url"
      },
      "body": null,
      "method": "GET"
    });

    const data: NaverResponse = await naverRes.json();
    console.log(data.searchResultMap.searchResultListMap.WORD)
    const meaningsWithHtml = data.searchResultMap.searchResultListMap.WORD.items[0].meansCollector[0].means.map((mean) => mean.value)
    const meanings = meaningsWithHtml.map((mean) => {
      const $ = cheerio.load(mean); 
      return $.text().trim();
    });

    const isEndWithEllipsis = meanings.some((mean) => mean.endsWith('...'));
    if (isEndWithEllipsis) {
      const naverSubRes = await fetch(`https://ko.dict.naver.com/api/platform/koko/entry?entryId=${data.searchResultMap.searchResultListMap.WORD.items[0].entryId}&isConjsShowTTS=true&searchResult=false&hid=174202181249334940`, {
        "headers": {
          "accept": "text/html, */*; q=0.01",
          "accept-language": "en-GB,en;q=0.7",
          "alldict-locale": "en",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Brave\";v=\"134\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "x-requested-with": "XMLHttpRequest",
          "cookie": "NNB=EIUDPN2LUYFGO; NAC=DuOhBYAI7rZ3; nid_inf=158752215; NID_JKL=Gd7PjHT3lN8Bq+qmOQ28kAwla3zjK62tsu7Ba1asMv8=; page_uid=i8x9rsqps8wssijqUG8ssssstbK-507855; ba.uuid=963a84a2-6b26-4369-a1f6-23853dae71b6; JSESSIONID=C672B4C565D701688CA820DA3FC20F84; BUC=eqbPhf6BsazIwkaXp_A8ijWWwnpZq2Sbxjpug-URQHc=",
          "Referer": "https://ko.dict.naver.com/",
          "Referrer-Policy": "unsafe-url"
        },
        "body": null,
        "method": "GET"
      });
      
      const subData: NaverSubResponse = await naverSubRes.json();
      const originMeaningsWithHtml = subData.entry.means.map((mean) => mean.origin_mean);
      const originMeanings = originMeaningsWithHtml.map((mean) => {
        const $ = cheerio.load(mean); 
        return $.text().trim();
      });

      return originMeanings;
    }
    
    return meanings;
  } catch (error: any) {
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

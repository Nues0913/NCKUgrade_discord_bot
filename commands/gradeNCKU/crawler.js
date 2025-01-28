import axios from 'axios';
import { Cookie, CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import * as cheerio from 'cheerio';
import { readFileSync } from 'fs';

CookieJar

class AuthService {
    #instance = null;
    #authUrl = "https://fs.ncku.edu.tw/adfs/oauth2/authorize?response_type=code&client_id=ed91740c-7959-4a7d-9f2d-2c40ca668de6&redirect_uri=https:%2F%2Fqrys.ncku.edu.tw%2Fncku%2Fqrys02.asp&state=a3d43d78695f1e9a25332a4f52dc7903&resource=http:%2F%2Fqrys.ncku.edu.tw%2Fncku%2Fqrys02.asp";
    #baseUrl = "https://qrys.ncku.edu.tw/ncku/";
    #mainPage = "qrys02.asp";
    #account = null;
    #cookieJar = new CookieJar();
    #cache = {gradeCur : null};
    // TODO: cache

    constructor() {
        this.#instance = wrapper(axios.create({
            baseURL: this.#baseUrl,
            jar: this.#cookieJar,
            withCredentials: true,
            // validateStatus: (status) => status >= 200 && status < 400,
            maxRedirects: 5,
        }));
    }

    /**
     * Login.
     * 
     * When password is undefined, account will be treated as cookie.
     * 
     * You can directly get the cookie string from browser, function will auto parse it.
     * 
     * @param {string} account - account, treated as cookie when password is undefined
     * @param {string} password
     * @throws {Error} - login error message
     */
    async login(account, password) {
        // login with cookie
        if(password === undefined) {
            const cookie = account;
            account.split('; ').forEach((cookieStr) => {
                const cookie = Cookie.parse(cookieStr);
                try {
                    if (cookie.key.startsWith("ASPSESSIONID")) {
                        this.#cookieJar.setCookieSync(cookie, this.#baseUrl);
                    }
                } catch (error) {
                    throw error;
                }
            });
            return;
        }
        // login with account and password
        try {
            const loginResponse = await this.#instance.post(this.#authUrl, {
                UserName: account,
                Password: password,
                AuthMethod: 'FormsAuthentication',
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            if (loginResponse.status == 200 && loginResponse.request.res.responseUrl.includes(this.#baseUrl + this.#mainPage)) {
                console.log('登入成功:', loginResponse.request.res.responseUrl);
                this.#account = account;
            } else {
                throw new Error("未能跳轉至目標頁面");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * 回傳學籍系統選單中指定項目的連結
     * 
     * @param {string} rowSubString 
     * @returns {string|undefined} full href
     */
    async #getRowHref(rowSubString) {
        const mainPageRespose = await this.#instance.get(this.#baseUrl + 'qrys02.asp');
        const mainPage = mainPageRespose.data;
        const $ = cheerio.load(mainPage);
        const $tableElement = $('table[border="0"][bgcolor="#66CCFF"][align="center"]');
        let $a;
        $tableElement.find('b').each((index, element) => {
            if ($(element).text().includes(rowSubString)) {
                $a = $(element).parent();
                return false;   // break
            }
        });
        return $a.attr('href');
    }

    async getGradeCur() {
        try {
            if (this.#account === null && this.#cookieJar === null) {
                throw new Error("not login yet.");
            }
            if(this.#cache.gradeCur === null) {
                const herf = await this.#getRowHref('學期選課資料查詢');
                const gradeResponse = await this.#instance.get(herf);
                this.#cache.gradeCur = gradeResponse.data;
            }
            // parse data
            const $ = cheerio.load(this.#cache.gradeCur);
            console.log(`獲取用戶 ${this.#account ? this.#account : "透過cookie登入"} 成績`);
            const gradeObj = {title: '', subjects: []};
            $('body > table[bgcolor="#66CCFF"] > tbody').find('tr').each((index, element) => {
                if($(element).text().includes('學年第')) {
                    gradeObj["title"] = $(element).find('b').text().trim();
                } else if($(element).find('td:nth-child(1)').find('div').text().length >= 2) {  // 第一格有資料
                    const subject = {}; // subject[sbjectName, sbjectType, sbjectCode, score, credit]
                    subject['sbjectName'] = $(element).find('td:nth-child(5)').find('div').text().trim()
                    subject['sbjectType'] = $(element).find('td:nth-child(1)').find('div').text().trim()
                    subject['sbjectCode'] = $(element).find('td:nth-child(4)').find('div').text().trim()
                    subject['score'] = $(element).find('td:nth-child(7)').find('div').text().trim()
                    subject['credit'] = $(element).find('td:nth-child(6)').find('div').text().trim()
                    gradeObj["subjects"].push(subject);
                }
            });
            if(gradeObj["title"] === '') {
                throw new Error("no grade data.");
            }
            console.log(this.#cookieJar.getCookiesSync(this.#baseUrl));
            return gradeObj;
        } catch (error) {
            throw error;
        }
    }
}

export default AuthService;

// const scraper = new AuthService();
// // scraper.login('cookies')
// scraper.login('', '')
//     .then(async () => {
//         const grade = await scraper.getGradeCur();
//         console.dir(grade);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

class AuthService {
    #instance = null;
    #authUrl = "https://fs.ncku.edu.tw/adfs/oauth2/authorize?response_type=code&client_id=ed91740c-7959-4a7d-9f2d-2c40ca668de6&redirect_uri=https:%2F%2Fqrys.ncku.edu.tw%2Fncku%2Fqrys02.asp&state=a3d43d78695f1e9a25332a4f52dc7903&resource=http:%2F%2Fqrys.ncku.edu.tw%2Fncku%2Fqrys02.asp";
    #baseUrl = "https://qrys.ncku.edu.tw/ncku/";
    #account;
    #cookieJar;

    constructor() {
        this.#cookieJar = new CookieJar();
        this.#instance = wrapper(axios.create({
            baseURL: this.#baseUrl,
            jar: this.#cookieJar,
            withCredentials: true,
            // validateStatus: (status) => status >= 200 && status < 400,
            maxRedirects: 5,
        }));
    }

    /**
     * 登入
     * @param {string} account
     * @param {string} password
     */
    async login(account, password) {
        try {
            const loginResponse = await this.#instance.post(this.#authUrl, {
                UserName: account,
                Password: password,
                AuthMethod: 'FormsAuthentication',
            }, {
                headers: {
                    // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    // "Accept-Encoding": "gzip, deflate, br, zstd",
                    // "Accept-Language": "zh-TW,zh;q=0.9",
                    // "Cache-Control": "max-age=0",
                    // "Connection": "keep-alive",
                    // "Content-Length": "83",
                    "Content-Type": "application/x-www-form-urlencoded",
                    // "Host": "fs.ncku.edu.tw",
                    // "Origin": "https://fs.ncku.edu.tw",
                    // "Referer": "https://fs.ncku.edu.tw/adfs/oauth2/authorize?response_type=code&client_id=ed91740c-7959-4a7d-9f2d-2c40ca668de6&redirect_uri=https:%2F%2Fqrys.ncku.edu.tw%2Fncku%2Fqrys02.asp&state=a3d43d78695f1e9a25332a4f52dc7903&resource=http:%2F%2Fqrys.ncku.edu.tw%2Fncku%2Fqrys02.asp",
                    // "Sec-Fetch-Dest": "document",
                    // "Sec-Fetch-Mode": "navigate",
                    // "Sec-Fetch-Site": "same-origin",
                    // "Sec-Fetch-User": "?1",
                    // "Upgrade-Insecure-Requests": "1",
                    // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                    // "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                    // "sec-ch-ua-mobile": "?0",
                    // "sec-ch-ua-platform": '"Windows"',
                }
            });
            if (loginResponse.status == 200 && loginResponse.request.res.responseUrl.includes('https://qrys.ncku.edu.tw/ncku/qrys02.asp')) {
                console.log('登入成功:', loginResponse.request.res.responseUrl);
                console.log(this.#cookieJar);
                this.#account = account;
            } else {
                throw new Error("未能跳轉至目標頁面");
            }
        } catch (error) {
            throw error;
        }
    }

    async getGrade() {
        try {
            if (this.#account === undefined) {
                throw new Error("not login yet.");
            }
            const gradeResponse = await this.#instance.get('/qrys41021.asp');
            console.log(`獲取用戶 ${this.#account} 成績:`, gradeResponse.data);
        } catch (error) {
            throw error;
        }
    }
}

const scraper = new AuthService();
scraper.login('', '')
    .then(() => {
        // scraper.getGrade();
    })
    .catch((error) => {
        console.error(error);
    });

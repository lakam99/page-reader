//@ts-check
/**
 * page-reader
 * Written by Arkam Mazrui
 * arkam.mazrui[at]gmail.com
 * https://github.com/lakam99/page-reader
 * Licensed under the MIT license
 * Buy me a coffee at https://www.buymeacoffee.com/lakam99
 */

const parse = require('node-html-parser').parse;
const {Configuration, OpenAIApi} = require('openai');
const fetch = (async () => await (await import('node-fetch')).default)();

const page_reader = (function () {
    this.api_key = '';
    this.chatgpt = new OpenAIApi(new Configuration());
    /**
     * @param {string | undefined} apiKey 
     */
    this.configure = function(apiKey) {
        // @ts-ignore
        if (apiKey) {
            this.chatgpt = new OpenAIApi(new Configuration({apiKey}));
            this.api_key = apiKey;
        }
    }
    /**
     * @param {string} url 
     * @returns {Promise<string>}
     */
    this.get_page_text = async function(url) {
        const raw_html = await (await (await fetch)(url)).text();
        const page = parse(raw_html);
        let body = page.querySelector('body');
        body?.querySelectorAll('script, style').forEach((e) => e.parentNode.removeChild(e));
        return body?.innerText || '';
    }

    this.summarise_page = async function(url) { 
        if (!this.api_key) { throw new Error('API key not configured. Use the configure method.'); }
        const page_text = await this.get_page_text(url);
        const response = await this.chatgpt.createChatCompletion({model: "gpt-3.5-turbo", messages: [{role: "user", content: "Summarise this page: " + page_text}]});
        return response.data.choices[0].message?.content || '';
    }

    return {configure: this.configure, summarise_page: this.summarise_page};
})();

exports.default = {page_reader}
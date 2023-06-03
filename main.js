//@ts-check
const parse = require('node-html-parser').parse;
const fetch = (async () => await (await import('node-fetch')).default)();

const page_reader = (function () {
    this.config = {'api-key': undefined};
    /**
     * 
     * @param {string | undefined} apiKey 
     */
    this.configure = function(apiKey) {
        // @ts-ignore
        if (apiKey) this.config["api-key"] = apiKey;
    }
    /**
     * 
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

    this.read_page = async function(url) { 
        const page_text = await this.get_page_text(url);
        
    }

    return {configure: this.configure, summarise_page: this.get_page_text};
})();

exports.default = {page_reader}
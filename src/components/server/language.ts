import acceptLanguage from 'accept-language';
import {
    // langDeDE,
    langEnUS,
    langEsES,
    langFrFR,
    // langHiIN,
    langJaJP,
    // langPtPT,
    // langRuRU,
    langZhCN,
    // langZhTW
} from "@/components/common/language";

acceptLanguage.languages([
    // langDeDE,
    langEnUS, langEsES, langFrFR,
    // langHiIN,
    langJaJP,
    // langPtPT, langRuRU,
    langZhCN,
    // langZhTW
]);

export function filterAcceptLanguage(acceptLang: string): string {
    const lang = acceptLanguage.get(acceptLang);
    if (lang) {
        return lang;
    }
    return langEnUS
}

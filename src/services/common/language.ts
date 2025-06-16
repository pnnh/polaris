export interface ILanguageProvider {
    slogan: string
}

class EnglishLanguageProvider implements ILanguageProvider {
    slogan = 'HUABLE';
}

class ChineseLanguageProvider implements ILanguageProvider {
    slogan = '希波万象';
}

export const englishLanguageProvider = new EnglishLanguageProvider();
export const chineseLanguageProvider = new ChineseLanguageProvider();

export function getLanguageProvider(lang: string): ILanguageProvider {
    if (lang === 'zh') {
        return chineseLanguageProvider;
    }
    return englishLanguageProvider;
}

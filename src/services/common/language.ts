import {langEn, langZh} from "@/atom/common/language";

export interface ILanguageProvider {
    lang: string;
    siteName: string
    frequentOperation: string
    handwrittenNotes: string
    codeNotes: string
    signin: string
    signup: string
}

class EnglishLanguageProvider implements ILanguageProvider {
    lang = langEn;
    siteName = 'HUABLE';
    frequentOperation = 'Too frequent operation';
    handwrittenNotes = 'Handwritten Notes';
    codeNotes = 'Code Notes';
    signin = 'Signin';
    signup = 'Signup';
}

class ChineseLanguageProvider implements ILanguageProvider {
    lang = langZh;
    siteName = '希波万象';
    frequentOperation = '操作过于频繁';
    handwrittenNotes = '手写笔记';
    codeNotes = '代码笔记';
    signin = '登录';
    signup = '注册';
}

export const englishLanguageProvider = new EnglishLanguageProvider();
export const chineseLanguageProvider = new ChineseLanguageProvider();

export function getLanguageProvider(lang: string): ILanguageProvider {
    if (lang === 'zh') {
        return chineseLanguageProvider;
    }
    return englishLanguageProvider;
}

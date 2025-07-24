import {langEn, langZh} from "@/atom/common/language";

export interface ILanguageProvider {
    lang: string;
    navArticles: string
    navChannels: string
    siteName: string
    frequentOperation: string
    handwrittenNotes: string
    codeNotes: string
    signin: string
    signup: string
    latest: string
    readCount: string
    lastMonth: string
    lastYear: string
    all: string
    readRank: string
    searchPlaceholder: string
    invalidUsername: string
    invalidPassword: string;
    unauthorized: string;
}

class ChineseLanguageProvider implements ILanguageProvider {
    lang = langZh;
    navArticles = '文章';
    navChannels = '频道';
    siteName = '希波';
    frequentOperation = '操作过于频繁';
    handwrittenNotes = '手写笔记';
    codeNotes = '代码笔记';
    signin = '登录';
    signup = '注册';
    latest = '最新';
    readCount = '阅读量';
    lastMonth = '近一月';
    lastYear = '近一年';
    all = '全部';
    readRank = '阅读排行';
    searchPlaceholder = '搜索';
    invalidUsername = '无效账户名称';
    invalidPassword = '无效密码';
    unauthorized = '未授权';
}

class EnglishLanguageProvider implements ILanguageProvider {
    lang = langEn;
    siteName = 'HUABLE';
    navArticles = 'Articles';
    navChannels = 'Channels';
    frequentOperation = 'Too frequent operation';
    handwrittenNotes = 'Handwritten Notes';
    codeNotes = 'Code Notes';
    signin = 'Signin';
    signup = 'Signup';
    latest = 'Latest';
    readCount = 'Read Count';
    lastMonth = 'Last Month';
    lastYear = 'Last Year';
    all = 'All';
    readRank = 'Read Rank';
    searchPlaceholder = 'Search';
    invalidUsername = 'Invalid Account Name';
    invalidPassword = 'Invalid Password';
    unauthorized = 'Unauthorized';
}

export const englishLanguageProvider = new EnglishLanguageProvider();
export const chineseLanguageProvider = new ChineseLanguageProvider();

export function getLanguageProvider(lang: string): ILanguageProvider {
    if (lang === 'zh') {
        return chineseLanguageProvider;
    }
    return englishLanguageProvider;
}

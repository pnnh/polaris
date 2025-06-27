import styles from './language.module.scss';
import {langEn, langZh} from "@/atom/common/language";

export function PSLanguageSelector({lang, currentUrl}: { lang: string, currentUrl: string }) {
    let currentLang = lang
    if (!currentLang || currentLang !== langZh) {
        currentLang = langEn;
    }
    const targetLang = currentLang === langEn ? langZh : langEn;
    let targetUrl = '';
    if (currentUrl === '/') {
        // 访问首页的情况
        targetUrl = `/${targetLang}`;
    } else if (currentUrl.startsWith('/?')) {
        // 访问首页带参数的情况
        targetUrl = currentUrl.replace(`/?`, `/${targetLang}?`);
    } else {
        // 访问其他页面的情况
        targetUrl = currentUrl.replace(`/${lang}`, `/${targetLang}`);
    }
    const linkTip = lang === langZh ? '访问英文页面' : 'Switch to Chinese page';
    return <div className={styles.langSelector}>
        <a href={targetUrl} title={linkTip}>
            <img src={lang === 'en' ? '/icons/language/langEn.svg' : '/icons/language/langZh.svg'} alt={'lang'}/>
        </a>
    </div>
}

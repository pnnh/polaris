import styles from './language.module.scss';
import {langEn, langZh} from "@/atom/common/language";

export function PSLanguageSelector({lang, currentUrl}: { lang: string, currentUrl: string }) {
    if (!lang || lang !== 'zh') {
        lang = 'en';
    }
    if (lang === 'en') {
        currentUrl = currentUrl.replace(`/${langEn}/`, `/${langZh}/`);
    } else {
        currentUrl = currentUrl.replace(`/${langZh}/`, `/${langEn}/`);
    }
    const linkTip = lang === langZh ? '访问英文页面' : 'Switch to Chinese page';
    return <div className={styles.langSelector}>
        <a href={currentUrl} title={linkTip}>
            <img src={lang === 'en' ? '/icons/language/langEn.svg' : '/icons/language/langZh.svg'} alt={'lang'}/>
        </a>
    </div>
}

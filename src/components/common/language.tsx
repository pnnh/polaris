import styles from './language.module.scss';

export function PSLanguageSelector({lang}: { lang: string }) {
    if (!lang || lang !== 'en') {
        lang = 'zh';
    }

    return <div className={styles.langSelector}>
        <img src={lang === 'en' ? '/icons/language/langEn.svg' : '/icons/language/langZh.svg'} alt={'lang'}/>
    </div>
}

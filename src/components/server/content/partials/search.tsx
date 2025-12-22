import {css} from '@emotion/css'
import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react";
import {transKey} from "@/components/common/locales/normal";

const styles = {
    globalSearchBox: css`
        border: solid 1px #ccc;
        border-radius: 6px;
        height: 26px;
        width: 200px;
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        padding: 0 0.5rem;

        input {
            border: none;
            outline: none;
            flex-grow: 1;
        }
    `
}

export function ContentSearchAction({pathname, queryKeyword, lang}: {
    pathname: string, queryKeyword: string,
    lang: string
}) {
    const [searchText, setSearchText] = useState(queryKeyword || '')
    const goSearch = () => {
        if (!searchText || !searchText.trim()) {
            return
        }
        window.location.href = `/${lang}/search?keyword=${searchText}`
    }
    return <div className={styles.globalSearchBox}>
        <input placeholder={transKey(lang, "searchPlaceholder")} maxLength={128} value={searchText}
               onChange={(event) => setSearchText(event.target.value)}
               onKeyDown={(event) => {
                   if (event.key === 'Enter') {
                       goSearch()
                   }
               }}/>
        <SearchIcon fontSize={'small'} onClick={goSearch}/>
    </div>
}

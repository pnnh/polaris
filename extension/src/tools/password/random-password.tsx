import {useState} from 'react'
import {randomPassword} from '@/utils/rand'
import {passwordStrength} from '@cmss/check-password-strength'
import {copyToClipboard} from "@/utils/clipboard";
import {Button, IconButton, Tooltip} from "@mui/material";
import {ContentCopy} from "@mui/icons-material";
import {css} from "@emotion/css";
import ReportOffIcon from '@mui/icons-material/ReportOff';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {getAppLang, useTranslation} from '@/i18n/i18n';

const styleToolTitle = css`
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 0.7rem;
`

const styleParagraphTitle = css`
    font-size: 1.2rem;
`

const styleRandomPassword = css`
    background: #FFFFFF;
    padding: 8px;
    border-radius: 4px;
    margin: 0 auto;
`

const styleSymbolRow = css`
    margin-bottom: 8px;
`

const classToolDesc = css`
    font-size: 13px;
    color: #5c5c5c;
`

const classGenPassword = css`
    font-size: 1.2rem;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
`
const classPasswordItem = css`
    color: #000;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
`
const stylePwdLength = css`
    width: 2rem;
`
const classPwdText = css`
    flex-grow: 1;
    word-break: break-all;
`

export default function RandomPasswordPage() {
    const [password, setPassword] = useState<string>('')
    const [length, setLength] = useState<number>(16)
    const [passwordHistory, setPasswordHistory] = useState<string[]>([])
    const [allowLetter, setAllowLetter] = useState<boolean>(true)
    const [allowUppercaseLetter, setAllowUppercaseLetter] = useState<boolean>(true)
    const [allowSymbol, setAllowSymbol] = useState<boolean>(true)
    const [allowNumber, setAllowNumber] = useState<boolean>(true)
    const [lang, setLang] = useState<string>(getAppLang())
    const {i18n} = useTranslation(lang);
    const t = i18n.getFixedT(lang)

    const renderPassword = () => {
        if (password.length < 1) {
            return <span></span>
        }
        return <>
            <h2 className={styleParagraphTitle}>{t('GeneratorResult')}</h2>
            <div className={classGenPassword}>
                <CopyIcon password={password}/>
                <div className={classPwdText}>{password}</div>
                <PasswordStrength password={password}/>
            </div>
        </>
    }
    const renderHistory = () => {
        if (passwordHistory.length < 1) {
            return <span></span>
        }
        const historyList = passwordHistory.map(pwd => {
            return <div key={pwd} className={classPasswordItem}>
                <CopyIcon password={pwd}/>
                <span className={classPwdText}>{pwd}</span>
                <PasswordStrength password={pwd}/>
            </div>
        })
        return <>
            <h2 className={styleParagraphTitle}>{t('GenerateHistory')}</h2>
            {historyList}
        </>
    }
    const styleLangContainer = css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        font-size: 0.9rem;
    `
    return <div>
        <div className={styleRandomPassword}>
            <div>
                <h2 className={styleToolTitle}>{t('ProductTitle')}</h2>
                <div className={styleLangContainer}>
                    <span style={{color: lang === 'en' ? '#1976d2' : '#5c5c5c'}}
                          onClick={() => setLang('en')}>English</span>
                    <span style={{color: lang === 'zh' ? '#1976d2' : '#5c5c5c'}}
                          onClick={() => setLang('zh')}>中文</span>
                    <span style={{color: lang === 'ru' ? '#1976d2' : '#5c5c5c'}}
                          onClick={() => setLang('ru')}>Русский</span>
                    <span style={{color: lang === 'fr' ? '#1976d2' : '#5c5c5c'}}
                          onClick={() => setLang('fr')}>Français</span>
                    <span style={{color: lang === 'ar' ? '#1976d2' : '#5c5c5c'}}
                          onClick={() => setLang('ar')}>العربية</span>
                    <span style={{color: lang === 'es' ? '#1976d2' : '#5c5c5c'}}
                          onClick={() => setLang('es')}>Español</span>
                </div>
                <p className={classToolDesc}>{t('ToolDesc')}</p>
            </div>
            <div className={styleSymbolRow}>
                <label>
                    <input type={'checkbox'} checked={allowLetter} title={'a-z'} onChange={(event) => {
                        console.debug('radio', event.target.checked)
                        setAllowLetter(event.target.checked)
                    }}/>
                    {t('LowercaseLetter')}
                </label>
                <label>
                    <input type={'checkbox'} title={'A-Z'} checked={allowUppercaseLetter} onChange={(event) => {
                        setAllowUppercaseLetter(event.target.checked)
                    }}/>
                    {t('UppercaseLetter')}
                </label>
                <label>
                    <input type={'checkbox'} title={'0-9'} checked={allowNumber} onChange={(event) => {
                        setAllowNumber(event.target.checked)
                    }}/>
                    {t('Number')}
                </label>
                <label>
                    <input type={'checkbox'} title={'@#$...'} checked={allowSymbol} onChange={(event) => {
                        setAllowSymbol(event.target.checked)
                    }}/>
                    {t('SpecialCharacter')}
                </label>
            </div>
            <div className={styleSymbolRow}>
                <input value={length} className={stylePwdLength}
                       onChange={(event) => {
                           setLength(Number(event.target.value))
                       }} title={t('PasswordLength')} type={'number'} min={4} max={48}/>
            </div>
            <div className={'calc-row'}>
                <Button variant={'contained'} size={'small'} className={'btn btn-sm mb-2'} onClick={() => {
                    const options = {
                        number: allowNumber,
                        letter: allowLetter,
                        uppercaseLetter: allowUppercaseLetter,
                        symbol: allowSymbol
                    }
                    const realLength = length < 2 ? 2 : (length > 64 ? 64 : length)
                    const password = randomPassword(realLength, options)

                    setPassword(password)
                    const history = passwordHistory.slice(0, 15)
                    history.splice(0, 0, password)
                    setPasswordHistory(history)
                }}>{t('GeneratePassword')}
                </Button>
            </div>
            <div>
                {renderPassword()}
            </div>
            <div>
                {renderHistory()}
            </div>
        </div>
    </div>
}

function CopyIcon({password}: { password: string }) {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    return <Tooltip title={message} open={open} arrow>
        <IconButton aria-label="copy" size="small"
                    onClick={() => {
                        copyToClipboard(password).then(() => {
                            setMessage('copied')
                        }).catch(() => {
                            setMessage('failed')
                        })
                        setOpen(true)
                        setTimeout(() => {
                            setOpen(false)
                        }, 1000)
                    }}>
            <ContentCopy fontSize={'inherit'}/>
        </IconButton>
    </Tooltip>
}

function PasswordStrength({password}: { password: string }) {
    const strength = passwordStrength(password).value.toLowerCase()

    if (strength === 'strong') {
        return <CheckCircleIcon fontSize={'small'} color={'success'} titleAccess={strength}/>
    }
    if (strength === 'medium') {
        return <InfoIcon fontSize={'small'} color={'info'} titleAccess={strength}/>
    }
    if (strength === 'weak') {
        return <WarningIcon fontSize={'small'} color={'warning'} titleAccess={strength}/>
    }

    return <ReportOffIcon fontSize={'small'} color={'error'} titleAccess={strength}/>

}

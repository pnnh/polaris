import {langEsES, langFrFR, langJaJP, LangKeyType, LangTextValue, langZhCN} from "../language"

export const AccountTransTexts: {
    [key: string]: LangTextValue
} = {
    "loginFailed": {
        'zh': '登录失败',
        'en': 'Login failed',
        'es': 'Error de inicio de sesión',
        'fr': 'Échec de la connexion',
        'ja': 'ログインに失敗しました'
    },
    "loginSuccessRedirecting": {
        'zh': '登录成功，前往首页...',
        'en': 'Login successful, redirecting to homepage...',
        'es': 'Inicio de sesión exitoso, redirigiendo a la página principal...',
        'fr': 'Connexion réussie, redirection vers la page d\'accueil...',
        'ja': 'ログイン成功、ホームページにリダイレクトしています...'
    },
}

export function accountTransText(lang: string, keyName: keyof typeof AccountTransTexts): string {
    const langText = AccountTransTexts[keyName]
    if (!langText) {
        throw new Error('Translation key not found: ' + keyName)
    }
    switch (lang) {
        case langZhCN:
            return langText.zh
        case langJaJP:
            return langText.ja
        case langEsES:
            return langText.es
        case langFrFR:
            return langText.fr
    }
    // Fallback to English
    return langText.en
}

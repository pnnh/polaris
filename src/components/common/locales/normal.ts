import {langEsES, langFrFR, langJaJP, LangKeyType, LangTextValue, langZhCN} from "../language"

export const TransTexts: {
    [key: string]: LangTextValue
} = {
    "siteName": {
        "zh": "希波",
        "en": "HUABLE",
        "es": "HUABLE",
        "fr": "HUABLE",
        "ja": "HUABLE"
    },
    "navArticles": {
        "zh": "文章",
        "en": "Articles",
        "es": "Artículos",
        "fr": "Articles",
        "ja": "記事"
    },
    "navChannels": {
        "zh": "频道",
        "en": "Channels",
        "es": "Canales",
        "fr": "Chaînes",
        "ja": "チャンネル"
    },
    "frequentOperation": {
        "zh": "操作过于频繁",
        "en": "Frequent Operation",
        "es": "Operación frecuente",
        "fr": "Opération fréquente",
        "ja": "頻繁な操作"
    },
    "handwrittenNotes": {
        "zh": "手写笔记",
        "en": "Handwritten Notes",
        "es": "Notas manuscritas",
        "fr": "Notes manuscrites",
        "ja": "手書きノート"
    },
    "codeNotes": {
        "zh": "代码笔记",
        "en": "Code Notes",
        "es": "Notas de código",
        "fr": "Notes de code",
        "ja": "コードノート"
    },
    "signin": {
        "zh": "登录",
        "en": "Sign In",
        "es": "Iniciar sesión",
        "fr": "Se connecter",
        "ja": "サインイン"
    },
    "signup": {
        "zh": "注册",
        "en": "Sign Up",
        "es": "Regístrate",
        "fr": "S'inscrire",
        "ja": "サインアップ"
    },
    "latest": {
        "zh": "最新",
        "en": "Latest",
        "es": "Último",
        "fr": "Dernier",
        "ja": "最新"
    },
    "readCount": {
        "zh": "阅读量",
        "en": "Read Count",
        "es": "Recuento de lecturas",
        "fr": "Nombre de lectures",
        "ja": "閲覧数"
    },
    "lastMonth": {
        "zh": "近一月",
        "en": "Last Month",
        "es": "El mes pasado",
        "fr": "Le mois dernier",
        "ja": "先月"
    },
    "lastYear": {
        "zh": "近一年",
        "en": "Last Year",
        "es": "El año pasado",
        "fr": "L'année dernière",
        "ja": "昨年"
    },
    "all": {
        "zh": "全部",
        "en": "All",
        "es": "Todo",
        "fr": "Tout",
        "ja": "すべて"
    },
    "readRank": {
        "zh": "阅读排行",
        "en": "Read Rank",
        "es": "Rango de lectura",
        "fr": "Classement de lecture",
        "ja": "読書ランク"
    },
    "searchPlaceholder": {
        "zh": "搜索",
        "en": "Search",
        "es": "Buscar",
        "fr": "Chercher",
        "ja": "検索"
    },
    "invalidUsername": {
        "zh": "无效账户名称",
        "en": "Invalid Username",
        "es": "Nombre de usuario no válido",
        "fr": "Nom d'utilisateur non valide",
        "ja": "無効なユーザー名"
    },
    "invalidPassword": {
        "zh": "无效密码",
        "en": "Invalid Password",
        "es": "Contraseña inválida",
        "fr": "Mot de passe invalide",
        "ja": "無効なパスワード"
    },
    "unauthorized": {
        "zh": "未授权",
        "en": "Unauthorized",
        "es": "No autorizado",
        "fr": "Non autorisé",
        "ja": "認証されていません"
    },
    "AutoTheme": {
        "zh": "自动",
        "en": "Auto",
        "es": "Auto",
        "fr": "Auto",
        "ja": "自動"
    },
    "LightTheme": {
        "zh": "浅色",
        "en": "Light",
        "es": "Claro",
        "fr": "Clair",
        "ja": "ライト"
    },
    "DarkTheme": {
        "zh": "深色",
        "en": "Dark",
        "es": "Oscuro",
        "fr": "Sombre",
        "ja": "ダーク"
    },
    "NeedLogin": {
        "zh": "请先登录",
        "en": "Please Sign In First",
        "es": "Por favor inicie sesión primero",
        "fr": "Veuillez vous connecter d'abord",
        "ja": "まずサインインしてください"
    },
    "PageNotFound": {
        "zh": "未找到页面",
        "en": "Page Not Found",
        "es": "Página no encontrada",
        "fr": "Page non trouvée",
        "ja": "ページが見つかりません"
    },
    "navImages": {
        "zh": "图片",
        "en": "Images",
        "es": "Imágenes",
        "fr": "Images",
        "ja": "画像"
    },
    "navTools": {
        "zh": "工具",
        "en": "Tools",
        "es": "Herramientas",
        "fr": "Outils",
        "ja": "ツール"
    },
}

export function transText(lang: string, keyName: keyof typeof TransTexts): string {
    const langText = TransTexts[keyName]
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

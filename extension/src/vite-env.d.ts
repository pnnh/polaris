/// <reference types="vite/client" />

import resources from './i18n/translations.json' with {type: "json"}

export const defaultNS = "translation";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources["en"];
    }
}

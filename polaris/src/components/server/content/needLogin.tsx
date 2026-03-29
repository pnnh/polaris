import React from "react";
import {transKey} from "@/components/common/locales/normal";

export function NeedLoginPage({lang}: { lang: string }) {
    return <div>
        {transKey(lang, 'NeedLogin')}
    </div>
}

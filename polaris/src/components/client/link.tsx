'use client'

import React from "react";

interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;           // 用户输入的 URL（可能不安全）
    children: React.ReactNode;
    fallback?: string;      // 不安全时 fallback URL，默认 '#'
    allowRelative?: boolean; // 是否允许站内相对路径（如 /about）
}

/**
 * 判断 URL 是否安全（只允许 http/https，可扩展 mailto:、tel: 等）
 */
export function isSafeUrl(url: string, allowRelative = false): string | null {
    if (!url || typeof url !== 'string') return null;

    const trimmed = url.trim();

    try {
        // 使用 new URL 规范化解析（推荐方式）
        const parsed = new URL(trimmed);  // 相对 URL 会抛错，可在 catch 处理
        const protocol = parsed.protocol.toLowerCase();

        if (protocol === 'http:' || protocol === 'https:') {
            return trimmed;  // 返回原始（或 parsed.toString() 规范化）
        }

        // 可选：允许 mailto:、tel: 等（根据业务谨慎添加）
        // if (protocol === 'mailto:' || protocol === 'tel:') return trimmed;

        return null;
    } catch (e) {
        // 解析失败：可能是相对路径或 malformed URL
        if (allowRelative && trimmed.startsWith('/') && !trimmed.includes(':')) {
            return trimmed;  // 允许站内相对链接（仍建议后端验证）
        }
        return null;
    }
}

/**
 * SafeLink 组件：自动验证 + 安全渲染
 */
export function SafeLink({
                             href,
                             children,
                             fallback = '#',
                             allowRelative = false,
                             ...restProps
                         }: SafeLinkProps) {
    let safeHref = ''
    const validated = isSafeUrl(href, allowRelative);
    if (validated) {
        safeHref = validated;
    } else {
        console.warn(`[Security] Blocked potentially unsafe URL: ${href}`);
        safeHref = fallback;
    }

    return (
        <a
            href={safeHref}
            rel="noopener noreferrer"  // 重要：防止新窗口被 opener 控制（target="_blank" 时）
            {...restProps}
        >
            {children}
        </a>
    );
}

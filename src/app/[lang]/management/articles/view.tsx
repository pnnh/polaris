'use client'

import React from "react";
import { transKey } from "@/components/common/locales/normal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Hourglass, Search, X } from 'lucide-react';
import { PSArticleModel } from "@/components/common/models/article";
import { ManagementBrowser } from "@/components/management/browser";
import { css } from "@/gen/styled/css";

const STATUS_APPROVED = 1;

function StatusBadge({ status, lang }: { status: number; lang: string }) {
    if (status === 1) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs border-green-500 text-green-700">
                <BadgeCheck size={12} />{transKey(lang, "management.article.statusApproved")}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs border-yellow-500 text-yellow-700">
            <Hourglass size={12} />{transKey(lang, "management.article.statusPending")}
        </span>
    );
}

function InlineCheckbox({ checked, indeterminate, onChange, onClick, disabled }: {
    checked: boolean; indeterminate?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}) {
    const ref = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
    return <input type="checkbox" ref={ref} checked={checked} onChange={onChange}
        onClick={onClick} disabled={disabled} className="w-4 h-4 cursor-pointer" />;
}

// ─── Status helpers ─────────────────────────────────────────

const filterStyles = {
    toolbar: css`
        border-bottom: solid 1px #e1e1e280;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background-color: var(--background-color);
        min-height: 3rem;
        gap: 0.5rem;
        flex-wrap: wrap;
    `,
    leftGroup: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
    `,
    rightGroup: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
    `,
    searchBox: css`
        border: solid 1px #ccc;
        border-radius: 6px;
        height: 26px;
        width: 200px;
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        padding: 0 0.5rem;

        & input {
            border: none;
            outline: none;
            flex-grow: 1;
            font-size: 0.8rem;
        }
    `,
}

// ─── Main component ──────────────────────────────────────────

export function ManagementArticlesView({
    lang,
    stargateUrl,
    articlesJson,
    keyword,
    statusFilter,
}: {
    lang: string
    stargateUrl: string
    articlesJson: string
    keyword: string
    statusFilter: string
}) {
    const articles: PSArticleModel[] = JSON.parse(articlesJson);

    const [selectedUids, setSelectedUids] = React.useState<Set<string>>(new Set());
    const [approving, setApproving] = React.useState(false);
    const [approveResult, setApproveResult] = React.useState<{ success: number; fail: number } | null>(null);
    const [searchText, setSearchText] = React.useState(keyword || '');

    // ── Selection helpers ────────────────────────────────────
    const allSelected = articles.length > 0 && selectedUids.size === articles.length;
    const someSelected = selectedUids.size > 0 && selectedUids.size < articles.length;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUids(e.target.checked
            ? new Set(articles.map(a => a.uid))
            : new Set());
    };

    const handleToggle = (uid: string) => {
        const next = new Set(selectedUids);
        next.has(uid) ? next.delete(uid) : next.add(uid);
        setSelectedUids(next);
    };

    // ── Search / filter navigation ───────────────────────────
    const navigate = (updates: Record<string, string | undefined>) => {
        const url = new URL(window.location.href);
        for (const [k, v] of Object.entries(updates)) {
            if (v) {
                url.searchParams.set(k, v);
            } else {
                url.searchParams.delete(k);
            }
        }
        url.searchParams.delete('page'); // reset to page 1
        window.location.href = url.pathname + url.search;
    };

    const goSearch = () => navigate({ keyword: searchText || undefined });
    const clearSearch = () => {
        setSearchText('');
        navigate({ keyword: undefined });
    };

    const togglePendingFilter = () => {
        navigate({ status: statusFilter === 'pending' ? undefined : 'pending' });
    };

    // ── Approve ──────────────────────────────────────────────
    const handleApprove = async () => {
        if (selectedUids.size === 0) {
            alert(transKey(lang, "management.article.selectFirst"));
            return;
        }
        setApproving(true);
        setApproveResult(null);
        try {
            const result = await ManagementBrowser.clientApproveArticles(
                stargateUrl,
                Array.from(selectedUids),
                STATUS_APPROVED
            );
            setApproveResult(result);
            setSelectedUids(new Set());
            if (result.success > 0) {
                // Reload page to reflect updated statuses
                setTimeout(() => window.location.reload(), 1200);
            }
        } catch (err) {
            console.error('Approve error:', err);
            alert(transKey(lang, "management.article.approveFailed"));
        } finally {
            setApproving(false);
        }
    };

    // ── Render ───────────────────────────────────────────────
    return (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* ── Toolbar ── */}
            <div className={filterStyles.toolbar}>
                <div className={filterStyles.leftGroup}>
                    <Button
                        onClick={handleApprove}
                        disabled={approving || selectedUids.size === 0}
                    >
                        {approving
                            ? transKey(lang, "management.article.approving")
                            : selectedUids.size > 0
                                ? transKey(lang, "management.article.approve") +
                                ` (${transKey(lang, "management.article.selectedCount").replace('{count}', selectedUids.size.toString())})`
                                : transKey(lang, "management.article.approve")}
                    </Button>

                    <Button
                        variant={statusFilter === 'pending' ? 'default' : 'outline'}
                        onClick={togglePendingFilter}
                    >
                        {transKey(lang, "management.article.onlyPending")}
                    </Button>
                </div>

                <div className={filterStyles.rightGroup}>
                    <div className={filterStyles.searchBox}>
                        <input
                            placeholder={transKey(lang, "searchPlaceholder")}
                            maxLength={128}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') goSearch(); }}
                        />
                        {searchText && (
                            <X size={16} onClick={clearSearch} style={{ cursor: 'pointer', color: '#999' }} />
                        )}
                        <Search size={16} onClick={goSearch} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>

            {/* ── Approve result ── */}
            {approveResult && (
                <Alert className="mx-1 mt-1">
                    <div className="flex items-center justify-between">
                        <AlertDescription>
                            {transKey(lang, "management.article.approveSuccess")
                                .replace('{count}', approveResult.success.toString())}
                            {approveResult.fail > 0 && ` (${approveResult.fail} failed)`}
                        </AlertDescription>
                        <button onClick={() => setApproveResult(null)} className="ml-2 opacity-70 hover:opacity-100">
                            <X size={14} />
                        </button>
                    </div>
                </Alert>
            )}

            {/* ── Article table ── */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 bg-background">
                        <tr>
                            <th className="w-12 p-1 border-b text-left">
                                <InlineCheckbox indeterminate={someSelected} checked={allSelected}
                                    onChange={handleSelectAll} disabled={approving} />
                            </th>
                            <th className="p-2 border-b text-left font-semibold">
                                {transKey(lang, "management.article.articleName")}
                            </th>
                            <th className="w-40 p-2 border-b text-left font-semibold">
                                {transKey(lang, "management.article.ownerName")}
                            </th>
                            <th className="w-40 p-2 border-b text-left font-semibold">
                                {transKey(lang, "management.article.channelName")}
                            </th>
                            <th className="w-28 p-2 border-b text-left font-semibold">
                                {transKey(lang, "management.article.statusLabel")}
                            </th>
                            <th className="w-44 p-2 border-b text-left font-semibold">
                                {transKey(lang, "management.article.updateTime")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                    No articles found
                                </td>
                            </tr>
                        )}
                        {articles.map(article => (
                            <tr
                                key={article.uid}
                                data-selected={selectedUids.has(article.uid) || undefined}
                                onClick={() => !approving && handleToggle(article.uid)}
                                className="hover:bg-muted/50 data-[selected]:bg-muted border-b"
                                style={{ cursor: approving ? 'default' : 'pointer' }}
                            >
                                <td className="w-12 p-1">
                                    <InlineCheckbox checked={selectedUids.has(article.uid)}
                                        disabled={approving}
                                        onClick={e => e.stopPropagation()}
                                        onChange={() => handleToggle(article.uid)} />
                                </td>
                                <td className="p-2 max-w-[400px]">
                                    <p className="font-medium truncate">{article.title || article.name}</p>
                                    {article.description && (
                                        <p className="text-xs text-muted-foreground truncate">{article.description}</p>
                                    )}
                                </td>
                                <td className="w-40 p-2 text-muted-foreground text-xs">
                                    {(article as unknown as Record<string, string>)['owner_name'] || '—'}
                                </td>
                                <td className="w-40 p-2 text-muted-foreground text-xs">
                                    {article.channel_name || '—'}
                                </td>
                                <td className="w-28 p-2">
                                    <StatusBadge status={article.status ?? 0} lang={lang} />
                                </td>
                                <td className="w-44 p-2 text-muted-foreground text-xs">
                                    {article.update_time ? new Date(article.update_time).toLocaleString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

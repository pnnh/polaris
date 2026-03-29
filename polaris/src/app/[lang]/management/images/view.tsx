'use client'

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Hourglass, Search, X } from 'lucide-react';
import { PSImageModel } from "@/components/common/models/image";
import { ManagementBrowser } from "@/components/management/browser";
import { css } from "@/gen/styled/css";

function StatusBadge({ status }: { status: number }) {
    if (status === 1) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs border-green-500 text-green-700">
                <BadgeCheck size={12} />已审核
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs border-yellow-500 text-yellow-700">
            <Hourglass size={12} />待审核
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
        flex-shrink: 0;
    `,
    leftGroup: css`display: flex; flex-direction: row; gap: 0.5rem; align-items: center; flex-wrap: wrap;`,
    rightGroup: css`display: flex; flex-direction: row; gap: 0.5rem; align-items: center;`,
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
        & input { border: none; outline: none; flex-grow: 1; font-size: 0.8rem; }
    `,
}

export function ManagementImagesView({ lang, stargateUrl, dataJson, keyword, statusFilter }: {
    lang: string
    stargateUrl: string
    dataJson: string
    keyword: string
    statusFilter: string
}) {
    const images: PSImageModel[] = JSON.parse(dataJson);
    const [selectedUids, setSelectedUids] = React.useState<Set<string>>(new Set());
    const [approving, setApproving] = React.useState(false);
    const [approveResult, setApproveResult] = React.useState<{ success: number; fail: number } | null>(null);
    const [searchText, setSearchText] = React.useState(keyword || '');

    const allSelected = images.length > 0 && selectedUids.size === images.length;
    const someSelected = selectedUids.size > 0 && selectedUids.size < images.length;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUids(e.target.checked ? new Set(images.map(i => i.uid)) : new Set());
    };
    const handleToggle = (uid: string) => {
        const next = new Set(selectedUids);
        next.has(uid) ? next.delete(uid) : next.add(uid);
        setSelectedUids(next);
    };

    const navigate = (updates: Record<string, string | undefined>) => {
        const url = new URL(window.location.href);
        for (const [k, v] of Object.entries(updates)) {
            v ? url.searchParams.set(k, v) : url.searchParams.delete(k);
        }
        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    };

    const goSearch = () => navigate({ keyword: searchText || undefined });
    const clearSearch = () => { setSearchText(''); navigate({ keyword: undefined }); };
    const togglePendingFilter = () => navigate({ status: statusFilter === 'pending' ? undefined : 'pending' });

    const handleApprove = async () => {
        if (selectedUids.size === 0) { alert('请先选择图片'); return; }
        setApproving(true);
        setApproveResult(null);
        try {
            const result = await ManagementBrowser.clientApproveImages(stargateUrl, Array.from(selectedUids), 1);
            setApproveResult(result);
            setSelectedUids(new Set());
            if (result.success > 0) setTimeout(() => window.location.reload(), 1200);
        } catch (err) {
            console.error('Approve error:', err);
            alert('审核失败，请重试');
        } finally {
            setApproving(false);
        }
    };

    return (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className={filterStyles.toolbar}>
                <div className={filterStyles.leftGroup}>
                    <Button size="sm" onClick={handleApprove} disabled={approving || selectedUids.size === 0}>
                        <BadgeCheck size={16} />
                        {approving ? '审核中...' : selectedUids.size > 0 ? `审核 (${selectedUids.size})` : '审核'}
                    </Button>
                    <Button size="sm" variant={statusFilter === 'pending' ? 'default' : 'outline'}
                        onClick={togglePendingFilter}>
                        <Hourglass size={16} />仅待审核
                    </Button>
                </div>
                <div className={filterStyles.rightGroup}>
                    <div className={filterStyles.searchBox}>
                        <input placeholder="搜索图片..." maxLength={128} value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') goSearch(); }} />
                        {searchText && <X size={16} onClick={clearSearch} style={{ cursor: 'pointer', color: '#999' }} />}
                        <Search size={16} onClick={goSearch} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
            {approveResult && (
                <Alert className="mx-1 mt-1">
                    <div className="flex items-center justify-between">
                        <AlertDescription>
                            已成功审核 {approveResult.success} 张图片{approveResult.fail > 0 && `（${approveResult.fail} 个失败）`}
                        </AlertDescription>
                        <button onClick={() => setApproveResult(null)} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
                    </div>
                </Alert>
            )}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 bg-background">
                        <tr>
                            <th className="w-12 p-1 border-b text-left">
                                <InlineCheckbox indeterminate={someSelected} checked={allSelected}
                                    onChange={handleSelectAll} disabled={approving} />
                            </th>
                            <th className="p-2 border-b text-left font-semibold">标题</th>
                            <th className="w-40 p-2 border-b text-left font-semibold">所有者</th>
                            <th className="w-28 p-2 border-b text-left font-semibold">状态</th>
                            <th className="w-44 p-2 border-b text-left font-semibold">更新时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.length === 0 && (
                            <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">暂无数据</td></tr>
                        )}
                        {images.map(image => (
                            <tr key={image.uid}
                                data-selected={selectedUids.has(image.uid) || undefined}
                                onClick={() => !approving && handleToggle(image.uid)}
                                className="hover:bg-muted/50 data-[selected]:bg-muted border-b"
                                style={{ cursor: approving ? 'default' : 'pointer' }}>
                                <td className="w-12 p-1">
                                    <InlineCheckbox checked={selectedUids.has(image.uid)} disabled={approving}
                                        onClick={e => e.stopPropagation()}
                                        onChange={() => handleToggle(image.uid)} />
                                </td>
                                <td className="p-2 max-w-[400px]">
                                    <p className="font-medium truncate">{image.title || image.name}</p>
                                    {image.description && (
                                        <p className="text-xs text-muted-foreground truncate">{image.description}</p>
                                    )}
                                </td>
                                <td className="w-40 p-2 text-muted-foreground text-xs">{image.owner_name || '—'}</td>
                                <td className="w-28 p-2"><StatusBadge status={image.status ?? 0} /></td>
                                <td className="w-44 p-2 text-muted-foreground text-xs">
                                    {image.update_time ? new Date(image.update_time).toLocaleString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

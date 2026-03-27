'use client'

import React from "react";
import {transKey} from "@/components/common/locales/normal";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { Square, SquareCheck, Hourglass, BadgeCheck, Search, X } from 'lucide-react';
import {PSArticleModel} from "@/components/common/models/article";
import {ManagementBrowser} from "@/components/management/browser";
import {css} from "@/gen/styled/css";

// ─── Status helpers ─────────────────────────────────────────

const STATUS_PENDING = 0;
const STATUS_APPROVED = 1;

function StatusChip({status, lang}: { status: number; lang: string }) {
    if (status === STATUS_APPROVED) {
        return (
            <Chip
                icon={<BadgeCheck size={14}/>}
                label={transKey(lang, "management.article.statusApproved")}
                color="success"
                size="small"
                variant="outlined"
            />
        );
    }
    return (
        <Chip
            icon={<Hourglass size={14}/>}
            label={transKey(lang, "management.article.statusPending")}
            color="warning"
            size="small"
            variant="outlined"
        />
    );
}

// ─── Toolbar ────────────────────────────────────────────────

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

    const goSearch = () => navigate({keyword: searchText || undefined});
    const clearSearch = () => {
        setSearchText('');
        navigate({keyword: undefined});
    };

    const togglePendingFilter = () => {
        navigate({status: statusFilter === 'pending' ? undefined : 'pending'});
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
        <Box sx={{flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>

            {/* ── Toolbar ── */}
            <div className={filterStyles.toolbar}>
                <div className={filterStyles.leftGroup}>
                    {/* Approve button */}
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<BadgeCheck size={18}/>}
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

                    {/* Pending-only quick filter */}
                    <Button
                        size="small"
                        variant={statusFilter === 'pending' ? 'contained' : 'outlined'}
                        color={statusFilter === 'pending' ? 'warning' : 'inherit'}
                        startIcon={<Hourglass size={18}/>}
                        onClick={togglePendingFilter}
                    >
                        {transKey(lang, "management.article.onlyPending")}
                    </Button>
                </div>

                <div className={filterStyles.rightGroup}>
                    {/* Search box */}
                    <div className={filterStyles.searchBox}>
                        <input
                            placeholder={transKey(lang, "searchPlaceholder")}
                            maxLength={128}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') goSearch();
                            }}
                        />
                        {searchText && (
                            <X
                                size={16}
                                onClick={clearSearch}
                                style={{cursor: 'pointer', color: '#999'}}
                            />
                        )}
                        <Search
                            size={16}
                            onClick={goSearch}
                            style={{cursor: 'pointer'}}
                        />
                    </div>
                </div>
            </div>

            {/* ── Approve result ── */}
            {approveResult && (
                <Alert
                    severity={approveResult.fail === 0 ? 'success' : 'warning'}
                    onClose={() => setApproveResult(null)}
                    sx={{mx: 1, mt: 1}}
                >
                    {transKey(lang, "management.article.approveSuccess")
                        .replace('{count}', approveResult.success.toString())}
                    {approveResult.fail > 0 && ` (${approveResult.fail} failed)`}
                </Alert>
            )}

            {/* ── Article table ── */}
            <Box sx={{flex: 1, overflowY: 'auto', overflowX: 'hidden'}}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {/* Select-all checkbox */}
                            <TableCell padding="checkbox" sx={{width: 48}}>
                                <Checkbox
                                    indeterminate={someSelected}
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                    icon={<Square size={20}/>}
                                    checkedIcon={<SquareCheck size={20}/>}
                                    disabled={approving}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                    {transKey(lang, "management.article.articleName")}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{width: 160}}>
                                <Typography variant="body2" fontWeight={600}>
                                    {transKey(lang, "management.article.ownerName")}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{width: 160}}>
                                <Typography variant="body2" fontWeight={600}>
                                    {transKey(lang, "management.article.channelName")}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{width: 120}}>
                                <Typography variant="body2" fontWeight={600}>
                                    {transKey(lang, "management.article.statusLabel")}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{width: 180}}>
                                <Typography variant="body2" fontWeight={600}>
                                    {transKey(lang, "management.article.updateTime")}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{py: 4}}>
                                    <Typography color="text.secondary">No articles found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {articles.map(article => (
                            <TableRow
                                key={article.uid}
                                hover
                                selected={selectedUids.has(article.uid)}
                                onClick={() => !approving && handleToggle(article.uid)}
                                sx={{cursor: approving ? 'default' : 'pointer'}}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedUids.has(article.uid)}
                                        icon={<Square size={20}/>}
                                        checkedIcon={<SquareCheck size={20}/>}
                                        disabled={approving}
                                        onClick={e => e.stopPropagation()}
                                        onChange={() => handleToggle(article.uid)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500} noWrap>
                                        {article.title || article.name}
                                    </Typography>
                                    {article.description && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: 400
                                            }}
                                        >
                                            {article.description}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {/* owner_name is returned by the management SQL join */}
                                        {(article as unknown as Record<string, string>)['owner_name'] || '—'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {article.channel_name || '—'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={article.status ?? 0} lang={lang}/>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {article.update_time
                                            ? new Date(article.update_time).toLocaleString()
                                            : '—'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}

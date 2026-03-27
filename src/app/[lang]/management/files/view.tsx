'use client'

import React from "react";
import {
    Alert, Box, Button, Checkbox, Chip,
    Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {CmFileModel} from "@/components/common/models/file";
import {ManagementBrowser} from "@/components/management/browser";
import {css} from "@/gen/styled/css";

const STATUS_PENDING = 0;
const STATUS_APPROVED = 1;

function StatusChip({status}: { status: number }) {
    if (status === STATUS_APPROVED) {
        return <Chip icon={<VerifiedIcon sx={{fontSize: 14}}/>} label="已审核" color="success" size="small" variant="outlined"/>;
    }
    return <Chip icon={<HourglassEmptyIcon sx={{fontSize: 14}}/>} label="待审核" color="warning" size="small" variant="outlined"/>;
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

export function ManagementFilesView({lang, stargateUrl, dataJson, keyword, statusFilter}: {
    lang: string
    stargateUrl: string
    dataJson: string
    keyword: string
    statusFilter: string
}) {
    const files: CmFileModel[] = JSON.parse(dataJson);
    const [selectedUids, setSelectedUids] = React.useState<Set<string>>(new Set());
    const [approving, setApproving] = React.useState(false);
    const [approveResult, setApproveResult] = React.useState<{ success: number; fail: number } | null>(null);
    const [searchText, setSearchText] = React.useState(keyword || '');

    const allSelected = files.length > 0 && selectedUids.size === files.length;
    const someSelected = selectedUids.size > 0 && selectedUids.size < files.length;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUids(e.target.checked ? new Set(files.map(f => f.uid)) : new Set());
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

    const goSearch = () => navigate({keyword: searchText || undefined});
    const clearSearch = () => { setSearchText(''); navigate({keyword: undefined}); };
    const togglePendingFilter = () => navigate({status: statusFilter === 'pending' ? undefined : 'pending'});

    const handleApprove = async () => {
        if (selectedUids.size === 0) { alert('请先选择文件'); return; }
        setApproving(true);
        setApproveResult(null);
        try {
            const result = await ManagementBrowser.clientApproveFiles(stargateUrl, Array.from(selectedUids), STATUS_APPROVED);
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
        <Box sx={{flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <div className={filterStyles.toolbar}>
                <div className={filterStyles.leftGroup}>
                    <Button size="small" variant="contained" color="primary" startIcon={<VerifiedIcon/>}
                            onClick={handleApprove} disabled={approving || selectedUids.size === 0}>
                        {approving ? '审核中...' : selectedUids.size > 0 ? `审核 (${selectedUids.size})` : '审核'}
                    </Button>
                    <Button size="small" variant={statusFilter === 'pending' ? 'contained' : 'outlined'}
                            color={statusFilter === 'pending' ? 'warning' : 'inherit'}
                            startIcon={<HourglassEmptyIcon/>} onClick={togglePendingFilter}>
                        仅待审核
                    </Button>
                </div>
                <div className={filterStyles.rightGroup}>
                    <div className={filterStyles.searchBox}>
                        <input placeholder="搜索文件..." maxLength={128} value={searchText}
                               onChange={e => setSearchText(e.target.value)}
                               onKeyDown={e => { if (e.key === 'Enter') goSearch(); }}/>
                        {searchText && <ClearIcon fontSize="small" onClick={clearSearch} style={{cursor: 'pointer', color: '#999'}}/>}
                        <SearchIcon fontSize="small" onClick={goSearch} style={{cursor: 'pointer'}}/>
                    </div>
                </div>
            </div>
            {approveResult && (
                <Alert severity={approveResult.fail === 0 ? 'success' : 'warning'} onClose={() => setApproveResult(null)} sx={{mx: 1, mt: 1}}>
                    已成功审核 {approveResult.success} 个文件{approveResult.fail > 0 && `（${approveResult.fail} 个失败）`}
                </Alert>
            )}
            <Box sx={{flex: 1, overflowY: 'auto', overflowX: 'hidden'}}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{width: 48}}>
                                <Checkbox indeterminate={someSelected} checked={allSelected}
                                          onChange={handleSelectAll} icon={<CheckBoxOutlineBlankIcon/>}
                                          checkedIcon={<CheckBoxIcon/>} disabled={approving}/>
                            </TableCell>
                            <TableCell><Typography variant="body2" fontWeight={600}>文件名</Typography></TableCell>
                            <TableCell sx={{width: 160}}><Typography variant="body2" fontWeight={600}>所有者</Typography></TableCell>
                            <TableCell sx={{width: 160}}><Typography variant="body2" fontWeight={600}>类型</Typography></TableCell>
                            <TableCell sx={{width: 120}}><Typography variant="body2" fontWeight={600}>状态</Typography></TableCell>
                            <TableCell sx={{width: 180}}><Typography variant="body2" fontWeight={600}>更新时间</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{py: 4}}>
                                    <Typography color="text.secondary">暂无数据</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {files.map(file => (
                            <TableRow key={file.uid} hover selected={selectedUids.has(file.uid)}
                                      onClick={() => !approving && handleToggle(file.uid)}
                                      sx={{cursor: approving ? 'default' : 'pointer'}}>
                                <TableCell padding="checkbox">
                                    <Checkbox checked={selectedUids.has(file.uid)} icon={<CheckBoxOutlineBlankIcon/>}
                                              checkedIcon={<CheckBoxIcon/>} disabled={approving}
                                              onClick={e => e.stopPropagation()} onChange={() => handleToggle(file.uid)}/>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500} noWrap>{file.title || file.name}</Typography>
                                    {file.description && (
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400}}>
                                            {file.description}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell><Typography variant="body2" color="text.secondary">{file.owner_name || '—'}</Typography></TableCell>
                                <TableCell><Typography variant="body2" color="text.secondary">{file.mimetype || '—'}</Typography></TableCell>
                                <TableCell><StatusChip status={file.status ?? 0}/></TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {file.update_time ? new Date(file.update_time).toLocaleString() : '—'}
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

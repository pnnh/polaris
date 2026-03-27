'use client'

import React from "react";
import {transKey} from "@/components/common/locales/normal";
import {
    Alert,
    Box,
    Button,
    Card,
    Checkbox,
    LinearProgress,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {PSChannelModel} from "@/components/common/models/channel";
import {CommunityBrowser} from "@/components/community/browser";
import { FolderOpen, Upload, Square, SquareCheck } from 'lucide-react';

interface MdFileItem {
    name: string;
    path: string;
    content: string;
    size: number;
}

// Recursively scan a directory for .md files
async function scanDirectoryForMdFiles(
    dirHandle: FileSystemDirectoryHandle,
    relativePath = ''
): Promise<MdFileItem[]> {
    const results: MdFileItem[] = [];
    // @ts-ignore - FileSystemDirectoryHandle async iteration is not yet in TS lib
    for await (const entry of dirHandle.values()) {
        const entryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        if (entry.kind === 'file' && (entry.name as string).endsWith('.md')) {
            const file: File = await (entry as FileSystemFileHandle).getFile();
            const content = await file.text();
            results.push({
                name: entry.name as string,
                path: entryPath,
                content,
                size: file.size
            });
        } else if (entry.kind === 'directory') {
            const subResults = await scanDirectoryForMdFiles(
                entry as FileSystemDirectoryHandle,
                entryPath
            );
            results.push(...subResults);
        }
    }
    return results;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Extract title from markdown content (first H1 heading) or fallback to filename
function extractTitle(content: string, filename: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    if (match) {
        return match[1].trim().substring(0, 128);
    }
    return filename.replace(/\.md$/i, '').substring(0, 128);
}

// Extract first non-heading paragraph as description
function extractDescription(content: string): string {
    const lines = content.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith('#');
    });
    return (lines[0] || '').substring(0, 200);
}

export function UploadArticlesForm({stargateUrl, channelsString, lang}: {
    stargateUrl: string,
    channelsString: string,
    lang: string
}) {
    const channels = JSON.parse(channelsString) as PSChannelModel[];

    const [files, setFiles] = React.useState<MdFileItem[]>([]);
    const [selectedChannel, setSelectedChannel] = React.useState('');
    const [selectedFiles, setSelectedFiles] = React.useState<Set<string>>(new Set());
    const [uploading, setUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [uploadResult, setUploadResult] = React.useState<{ success: number; fail: number } | null>(null);
    const [scanning, setScanning] = React.useState(false);

    // Handle folder selection via File System Access API
    const handleSelectFolder = async () => {
        try {
            setScanning(true);
            setUploadResult(null);

            // showDirectoryPicker is part of the File System Access API
            // @ts-ignore
            const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker({
                mode: 'read'
            });

            const mdFiles = await scanDirectoryForMdFiles(dirHandle);
            mdFiles.sort((a, b) => a.path.localeCompare(b.path));

            setFiles(mdFiles);
            // Select all files by default
            setSelectedFiles(new Set(mdFiles.map(f => f.path)));
        } catch (err: unknown) {
            // User cancelled the picker - no error needed
            if (err instanceof Error && err.name !== 'AbortError') {
                console.error('Failed to select folder:', err);
                alert('无法访问该文件夹，请重试。\nFailed to access folder. Please try again.');
            }
        } finally {
            setScanning(false);
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedFiles(new Set(files.map(f => f.path)));
        } else {
            setSelectedFiles(new Set());
        }
    };

    const handleToggleFile = (path: string) => {
        const newSelected = new Set(selectedFiles);
        if (newSelected.has(path)) {
            newSelected.delete(path);
        } else {
            newSelected.add(path);
        }
        setSelectedFiles(newSelected);
    };

    const handleUpload = async () => {
        if (!selectedChannel) {
            alert(transKey(lang, "console.article.selectChannelFirst"));
            return;
        }
        if (selectedFiles.size === 0) {
            alert(transKey(lang, "console.article.selectFilesFirst"));
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setUploadResult(null);

        try {
            const selectedFilesList = files.filter(f => selectedFiles.has(f.path));

            // Build article models from .md files
            const articleModels = selectedFilesList.map(f => ({
                uid: '00000000-0000-0000-0000-000000000000',
                title: extractTitle(f.content, f.name),
                header: '',
                body: f.content,
                description: extractDescription(f.content),
                keywords: '',
                cover: '',
                lang: lang,
                channel: selectedChannel,
                name: f.name.replace(/\.md$/i, '').substring(0, 128),
                mimetype: 'text/markdown'
            }));

            // Batch upload via stargate
            const result = await CommunityBrowser.clientConsoleBatchInsertArticles(
                stargateUrl,
                articleModels
            );

            setUploadProgress(100);
            setUploadResult(result);

            // Redirect to articles list on success
            if (result.success > 0) {
                setTimeout(() => {
                    window.location.href = `/${lang}/community/articles`;
                }, 2000);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert(transKey(lang, "console.article.uploadFailed"));
        } finally {
            setUploading(false);
        }
    };

    const allSelected = files.length > 0 && selectedFiles.size === files.length;
    const someSelected = selectedFiles.size > 0 && selectedFiles.size < files.length;

    return (
        <Box>
            <Typography variant="h5" gutterBottom fontWeight={600}>
                {transKey(lang, "console.article.uploadPageTitle")}
            </Typography>

            {/* Toolbar Card */}
            <Card sx={{mb: 3, p: 2}}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between"
                       flexWrap="wrap" gap={1}>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
                        {/* Select Folder button */}
                        <Button
                            variant="outlined"
                            startIcon={<FolderOpen size={18}/>}
                            onClick={handleSelectFolder}
                            disabled={scanning || uploading}
                        >
                            {scanning
                                ? transKey(lang, "console.article.scanningFolder")
                                : transKey(lang, "console.article.selectFolder")}
                        </Button>

                        {/* File count info */}
                        {files.length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                                {transKey(lang, "console.article.mdFilesFound")
                                    .replace('{count}', files.length.toString())
                                    .replace('{selected}', selectedFiles.size.toString())}
                            </Typography>
                        )}

                        {/* Channel selector - shown when files are loaded */}
                        {files.length > 0 && (
                            <Select
                                value={selectedChannel}
                                size="small"
                                onChange={(e) => setSelectedChannel(e.target.value)}
                                displayEmpty
                                sx={{minWidth: 280}}
                                disabled={uploading}
                            >
                                <MenuItem value="" disabled>
                                    {transKey(lang, "console.article.pleaseSelectChannel")}
                                </MenuItem>
                                {channels.map(ch => (
                                    <MenuItem key={ch.uid} value={ch.uid}>
                                        {ch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    </Stack>

                    {/* Upload button - only shown when files are loaded */}
                    {files.length > 0 && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<Upload size={18}/>}
                            onClick={handleUpload}
                            disabled={!selectedChannel || selectedFiles.size === 0 || uploading}
                        >
                            {uploading
                                ? transKey(lang, 'console.article.uploading')
                                : `${transKey(lang, 'console.article.uploadFiles')} (${selectedFiles.size})`}
                        </Button>
                    )}
                </Stack>
            </Card>

            {/* Upload progress bar */}
            {uploading && (
                <Box sx={{mb: 2}}>
                    <LinearProgress variant={uploadProgress > 0 ? 'determinate' : 'indeterminate'}
                                    value={uploadProgress}/>
                </Box>
            )}

            {/* Upload result alert */}
            {uploadResult && (
                <Alert
                    severity={uploadResult.fail === 0 ? 'success' : (uploadResult.success > 0 ? 'warning' : 'error')}
                    sx={{mb: 2}}
                >
                    {transKey(lang, "console.article.uploadResult")
                        .replace('{success}', uploadResult.success.toString())
                        .replace('{fail}', uploadResult.fail.toString())}
                </Alert>
            )}

            {/* Empty state - no folder selected yet */}
            {files.length === 0 && !scanning && (
                <Card sx={{p: 6, textAlign: 'center'}}>
                    <FolderOpen size={72} style={{color: 'var(--text-disabled-color)', marginBottom: '0.5rem'}}/>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {transKey(lang, "console.article.noFolderSelected")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 3, maxWidth: 480, mx: 'auto'}}>
                        {transKey(lang, "console.article.noFolderHint")}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<FolderOpen size={18}/>}
                        onClick={handleSelectFolder}
                        size="large"
                    >
                        {transKey(lang, "console.article.selectFolder")}
                    </Button>
                </Card>
            )}

            {/* File list table */}
            {files.length > 0 && (
                <Card>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={someSelected}
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                        icon={<Square size={20}/>}
                                        checkedIcon={<SquareCheck size={20}/>}
                                        disabled={uploading}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {transKey(lang, "console.article.fileName")}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {transKey(lang, "console.article.filePath")}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {transKey(lang, "console.article.fileSize")}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {transKey(lang, "console.article.filePreview")}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow
                                    key={file.path}
                                    hover
                                    onClick={() => !uploading && handleToggleFile(file.path)}
                                    sx={{cursor: uploading ? 'default' : 'pointer'}}
                                    selected={selectedFiles.has(file.path)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedFiles.has(file.path)}
                                                    icon={<Square size={20}/>}
                                                    checkedIcon={<SquareCheck size={20}/>}
                                            disabled={uploading}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleToggleFile(file.path)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {file.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{fontSize: '0.75rem', fontFamily: 'monospace'}}
                                        >
                                            {file.path}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {formatFileSize(file.size)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{maxWidth: 300}}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {file.content.substring(0, 100)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </Box>
    );
}

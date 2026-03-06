'use client'

import React from "react";
import {transKey} from "@/components/common/locales/normal";
import {
    Box,
    Button,
    Card,
    Checkbox,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import {PSArticleModel} from "@/components/common/models/article";
import {PSChannelModel} from "@/components/common/models/channel";
import {CommunityBrowser} from "@/components/community/browser";
import {EmptyUUID, formatRfc3339, STSubString} from "@pnnh/atom";
import PublishIcon from '@mui/icons-material/Publish';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export function ImportArticlesForm({stargateUrl, notesString, channelsString, keyword, lang}: {
    stargateUrl: string,
    notesString: string,
    channelsString: string,
    keyword: string,
    lang: string
}) {
    const notes = JSON.parse(notesString) as PSArticleModel[];
    const channels = JSON.parse(channelsString) as PSChannelModel[];
    
    const [selectedChannel, setSelectedChannel] = React.useState('');
    const [selectedNotes, setSelectedNotes] = React.useState<Set<string>>(new Set());
    const [searchText, setSearchText] = React.useState(keyword || '');
    const [importing, setImporting] = React.useState(false);
    
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedNotes(new Set(notes.map(note => note.uid)));
        } else {
            setSelectedNotes(new Set());
        }
    };
    
    const handleSelectNote = (noteUid: string) => {
        const newSelected = new Set(selectedNotes);
        if (newSelected.has(noteUid)) {
            newSelected.delete(noteUid);
        } else {
            newSelected.add(noteUid);
        }
        setSelectedNotes(newSelected);
    };
    
    const handleSearch = () => {
        const url = new URL(window.location.href);
        if (searchText) {
            url.searchParams.set('keyword', searchText);
        } else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url.pathname + url.search;
    };
    
    const handleImport = async () => {
        if (!selectedChannel) {
            alert(transKey(lang, "console.article.selectChannelFirst"));
            return;
        }
        if (selectedNotes.size === 0) {
            alert(transKey(lang, "console.article.selectNotesFirst"));
            return;
        }
        
        setImporting(true);
        
        try {
            const selectedNotesList = notes.filter(note => selectedNotes.has(note.uid));
            let successCount = 0;
            let failCount = 0;
            
            for (const note of selectedNotesList) {
                const articleModel = {
                    uid: EmptyUUID,
                    title: note.title,
                    description: note.description,
                    body: note.body,
                    cover: note.cover,
                    header: note.header,
                    lang: note.lang,
                    channel: selectedChannel,
                    keywords: note.keywords,
                    name: note.name
                };
                
                const articleId = await CommunityBrowser.clientConsoleInsertArticle(stargateUrl, articleModel);
                if (articleId) {
                    successCount++;
                } else {
                    failCount++;
                }
            }
            
            alert(transKey(lang, "console.article.importResult")
                .replace('{success}', successCount.toString())
                .replace('{fail}', failCount.toString()));
            
            if (successCount > 0) {
                window.location.href = `/${lang}/community/articles`;
            }
        } catch (error) {
            console.error('Import failed:', error);
            alert(transKey(lang, "console.article.importFailed"));
        } finally {
            setImporting(false);
        }
    };
    
    const allSelected = notes.length > 0 && selectedNotes.size === notes.length;
    const someSelected = selectedNotes.size > 0 && selectedNotes.size < notes.length;
    
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {transKey(lang, "console.article.importFromNotes")}
            </Typography>
            
            {/* Toolbar */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ minWidth: 100 }}>
                            {transKey(lang, "console.article.selectChannel")}:
                        </Typography>
                        <Select
                            value={selectedChannel}
                            size="small"
                            onChange={(event) => setSelectedChannel(event.target.value)}
                            displayEmpty
                            sx={{ minWidth: 300 }}
                        >
                            <MenuItem value="" disabled>
                                {transKey(lang, "console.article.pleaseSelectChannel")}
                            </MenuItem>
                            {channels.map(channel => (
                                <MenuItem key={channel.uid} value={channel.uid}>
                                    {channel.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>
                    
                    <Button 
                        variant="contained" 
                        color="primary"
                        size="large"
                        startIcon={<PublishIcon />}
                        onClick={handleImport}
                        disabled={!selectedChannel || selectedNotes.size === 0 || importing}
                    >
                        {importing 
                            ? transKey(lang, 'console.article.importing')
                            : transKey(lang, 'console.article.confirmImport')}
                        {selectedNotes.size > 0 && ` (${selectedNotes.size})`}
                    </Button>
                </Stack>
            </Card>
            
            {/* Search Box */}
            <Card sx={{ mb: 2, p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={transKey(lang, "searchPlaceholder")}
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <Button 
                        variant="outlined" 
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >
                        {transKey(lang, "common.search")}
                    </Button>
                </Stack>
            </Card>
            
            {/* Info Alert */}
            {selectedNotes.size > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {transKey(lang, "console.article.selectedCount")
                        .replace('{count}', selectedNotes.size.toString())}
                </Alert>
            )}
            
            {/* Notes List */}
            <Card>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={someSelected}
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                    icon={<CheckBoxOutlineBlankIcon />}
                                    checkedIcon={<CheckBoxIcon />}
                                />
                            </TableCell>
                            <TableCell>{transKey(lang, "console.note.title")}</TableCell>
                            <TableCell>{transKey(lang, "console.note.body")}</TableCell>
                            <TableCell>{transKey(lang, "console.note.language")}</TableCell>
                            <TableCell>{transKey(lang, "console.note.updateTime")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    {transKey(lang, "console.note.noData")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            notes.map((note) => (
                                <TableRow 
                                    key={note.uid}
                                    hover
                                    onClick={() => handleSelectNote(note.uid)}
                                    sx={{ cursor: 'pointer' }}
                                    selected={selectedNotes.has(note.uid)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedNotes.has(note.uid)}
                                            icon={<CheckBoxOutlineBlankIcon />}
                                            checkedIcon={<CheckBoxIcon />}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {note.title || transKey(lang, "console.note.untitled")}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {STSubString(note.body || note.description || '', 100)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {note.lang.toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {formatRfc3339(note.update_time)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
            
            {notes.length >= 50 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    {transKey(lang, "console.article.maxNotesShown")}
                </Alert>
            )}
        </Box>
    )
}

'use client'

import {EmptyUUID, generatorRandomString, isLangEn, langEn, langZh, TocItem, uuidToBase58} from "@pnnh/atom";
import {ConsoleArticleEditor} from "./editor";
import Button from "@mui/material/Button";
import React from "react";
import {PSArticleModel} from "@/components/common/models/article";
import {getDefaultImageUrl} from "@/components/common/note";
import MenuItem from '@mui/material/MenuItem';
import {supportedLanguages} from "@/components/common/language";
import {Select, TextField, Card, CardMedia, CardContent, Box, Stack, Chip, IconButton, Tooltip} from "@mui/material";
import {transKey} from "@/components/common/locales/normal";
import {PersonalNotesBrowser} from "@/components/personal/notes";
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LanguageIcon from '@mui/icons-material/Language';

function PSConsoleLanguageSelector({lang, onChange}: { lang: string, onChange: (newLang: string) => void }) {
    return (
        <Select
            value={lang}
            size={'small'}
            variant="outlined"
            startAdornment={<LanguageIcon sx={{ mr: 1, fontSize: 20 }} />}
            onChange={(event) => onChange(event.target.value)}
            sx={{ minWidth: 140 }}
        >
            {
                supportedLanguages.map(language => (
                    <MenuItem key={language.key} value={language.key}>
                        {language.name}
                    </MenuItem>
                ))
            }
        </Select>
    )
}

export function ConsoleArticleForm({stargateUrl, modelString, lang}: {
    stargateUrl: string,
    modelString: string,
    lang: string,
}) {
    const oldModel = JSON.parse(modelString) as PSArticleModel;
    const [wangLang, setWantLang] = React.useState(oldModel.lang);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);
    const [bodyText, setBodyText] = React.useState(oldModel.body || '');

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: oldModel.title, header: 0, id: titleId})
    const isNew = oldModel.uid === EmptyUUID;

    const onSubmit = () => {
        const newModel = {
            uid: oldModel.uid,
            title: title,
            description: description,
            body: bodyText,
            coverUrl: oldModel.coverUrl,
            header: oldModel.header,
            lang: wangLang,
            channel: oldModel.channel
        }
        if (isNew) {
            PersonalNotesBrowser.clientConsoleInsertNote(stargateUrl, newModel).then((newNoteId) => {
                if (!newNoteId) {
                    console.error(transKey(lang, 'console.note.insertFailed'))
                    return
                }
                window.location.href = `/${lang}/console/personal/notes`
            })
        } else {
            PersonalNotesBrowser.clientConsoleUpdateNote(stargateUrl, oldModel.uid, newModel).then((noteId) => {
                if (!noteId) {
                    console.error(transKey(lang, 'console.note.updateFailed'))
                    return
                }
                window.location.href = `/${lang}/console/personal/notes`
            })
        }
    }
    const coverUrl = oldModel.coverUrl || getDefaultImageUrl();
    const createUrl = `/${lang}/console/personal/notes/${uuidToBase58(EmptyUUID)}?wantLang=${isLangEn(wangLang) ? langZh : langEn}&copyFrom=${uuidToBase58(oldModel.uid)}`
    
    return (
        <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <Box className="max-w-7xl mx-auto space-y-6">
                {/* Header Card */}
                <Card elevation={3} className="overflow-hidden">
                    <Box className="flex flex-col md:flex-row">
                        <Box className="flex-1 p-6">
                            <Stack spacing={3}>
                                <Box className="flex items-center gap-2">
                                    <Chip 
                                        label={isNew ? transKey(lang, 'console.note.createNew') : transKey(lang, 'console.note.edit')}
                                        color={isNew ? 'success' : 'primary'}
                                        size="small"
                                    />
                                    <Chip 
                                        label={wangLang.toUpperCase()}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                                
                                <TextField
                                    fullWidth
                                    label={transKey(lang, 'console.note.title')}
                                    variant="outlined"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder={transKey(lang, 'console.note.titlePlaceholder')}
                                    InputProps={{
                                        sx: { fontSize: '1.25rem', fontWeight: 600 }
                                    }}
                                />
                                
                                <TextField
                                    fullWidth
                                    label={transKey(lang, 'console.note.description')}
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    placeholder={transKey(lang, 'console.note.descriptionPlaceholder')}
                                />
                            </Stack>
                        </Box>
                        
                        <Box className="md:w-64 relative">
                            <CardMedia
                                component="img"
                                image={coverUrl}
                                alt={title || 'Note cover'}
                                className="h-full object-cover"
                                sx={{ minHeight: 250 }}
                            />
                            <Box className="absolute top-2 right-2">
                                <Tooltip title="Change cover">
                                    <IconButton
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
                                    >
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </Card>

                {/* Editor Card */}
                <Card elevation={3} className="overflow-hidden">
                    <CardContent className="p-0">
                        <ConsoleArticleEditor 
                            tocList={tocList} 
                            header={oldModel.header}
                            body={bodyText} 
                            assetsUrl={'assetsUrl'}
                            onChange={(bodyText) => setBodyText(bodyText)}
                        />
                    </CardContent>
                </Card>

                {/* Action Bar */}
                <Card elevation={3}>
                    <Box className="p-4">
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            <Stack direction="row" spacing={2} alignItems="center">
                                <PSConsoleLanguageSelector lang={wangLang} onChange={setWantLang}/>
                            </Stack>
                            
                            <Stack direction="row" spacing={2}>
                                {!isNew && (
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<ContentCopyIcon />}
                                        href={createUrl}
                                    >
                                        {transKey(lang, 'console.note.viewCopy')}
                                    </Button>
                                )}
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    onClick={onSubmit}
                                    sx={{ minWidth: 120 }}
                                >
                                    {transKey(lang, 'console.note.save')}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Card>
            </Box>
        </Box>
    )
}




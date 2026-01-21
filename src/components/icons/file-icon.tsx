import {HugeiconsIcon} from '@hugeicons/react';
import {
    Document,
    FileEmpty02Icon,
    Folder01Icon,
    Image01Icon,
    Music2,
    SearchIcon,
    Video01Icon
} from '@hugeicons/core-free-icons';

export function FileIcon() {
    return <HugeiconsIcon
        icon={FileEmpty02Icon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
    />;
}

export function PSDirectoryIcon({size}: { size?: number }) {
    return <HugeiconsIcon
        icon={Folder01Icon}
        size={size || 24}
        color="currentColor"
        strokeWidth={1.5}
    />;
}

export function PSSearchIcon() {
    return <HugeiconsIcon
        icon={SearchIcon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
    />;
}


export function PSAutoIcon({filename, size}: { filename: string, size?: number }) {
    if (size !== 16 && size !== 24 && size !== 32 && size !== 48 && size !== 64 && size !== 96 && size !== 128
        && size !== 256 && size !== 512) {
        size = 32;
    }
    const extName = filename.split('.').pop()?.toLowerCase();
    if (!extName) {
        return <FileIcon/>;
    }
    const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
    const audioExts = ['mp3', 'wav', 'aac', 'flac', 'ogg'];
    const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md'];
    if (imageExts.includes(extName)) {
        return <HugeiconsIcon
            icon={Image01Icon}
            size={size || 24}
            color="currentColor"
            strokeWidth={1.5}
        />;
    } else if (videoExts.includes(extName)) {
        return <HugeiconsIcon
            icon={Video01Icon}
            size={size || 24}
            color="currentColor"
            strokeWidth={1.5}
        />;
    } else if (audioExts.includes(extName)) {
        return <HugeiconsIcon
            icon={Music2}
            size={size || 24}
            color="currentColor"
            strokeWidth={1.5}
        />;
    } else if (documentExts.includes(extName)) {
        return <HugeiconsIcon
            icon={Document}
            size={size || 24}
            color="currentColor"
            strokeWidth={1.5}
        />;
    } else if (extName === 'py') {
        return <img style={{width: `${size}px`, height: `${size}px`}} src={'/icons/files/python128.png'}
                    alt={'python'}/>
    } else {
        return <HugeiconsIcon
            icon={FileEmpty02Icon}
            size={size || 24}
            color="currentColor"
            strokeWidth={1.5}
        />;
    }
}

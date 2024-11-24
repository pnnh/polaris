import { Mime } from 'mime'

import standardTypes from 'mime/types/standard.js';
import otherTypes from 'mime/types/other.js';

const mime = new Mime(standardTypes, otherTypes);

const textFileList = [];

// xcode 项目文件
textFileList.push('swift', 'xcconfig', 'modulemap', 'pch', 'plist', 'pbxproj', 'xcworkspace', 'entitlements');

// nodejs 项目文件
textFileList.push('lock');

mime.define({ 'text/plain': textFileList });

export function getType(path: string) {
    return mime.getType(path) || 'application/octet-stream'
}

export type getMimeType = typeof getType
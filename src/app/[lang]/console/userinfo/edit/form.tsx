'use client'

import {useState} from "react";
import {sanitizeUrl} from "@pnnh/atom";
import {transText} from "@/components/common/locales/normal";
import {AccountModel, getAccountUrn} from "@/components/common/models/account/account";

export function UserinfoEditForm({portalUrl, userInfo, lang}: {
    portalUrl: string,
    userInfo: AccountModel,
    lang: string
}) {
    const accountUrn = getAccountUrn(userInfo.uid);
    const [username, setUsername] = useState(userInfo.username || accountUrn);
    const [nickname, setNickname] = useState(userInfo.nickname || '');
    const [email, setEmail] = useState(userInfo.mail || '');
    const [description, setDescription] = useState(userInfo.description || '');

    const onSubmit = () => {
        // 获取文件输入框中的文件
        const fileInput = document.querySelector('#fileInput');
        if (!fileInput || !(fileInput instanceof HTMLInputElement) || !fileInput.files) {
            console.error(transText(lang, '文件输入框未找到或未正确设置', 'File input not found or not set correctly'));
            return;
        }
        const file = fileInput.files[0]; // 获取选择的文件

        // 创建 FormData 对象
        const formData = new FormData();
        formData.append('file', file); // 添加文件到 FormData，'file' 是字段名
        // 可选：添加其他表单数据
        formData.append("username", username);
        formData.append("nickname", nickname);
        formData.append("email", email);
        formData.append("description", description);

        const fetchUrl = `${portalUrl}/console/userinfo/edit`; // 替换为实际的上传 URL
        fetch(fetchUrl, {
            method: 'POST',
            body: formData // 直接使用 FormData 作为 body
        })
            .then(response => response.json()) // 假设服务器返回 JSON
            .then(data => {
                console.log(transText(lang, '成功', 'Success'), data);
            })
            .catch(error => {
                console.error(transText(lang, '错误', 'Failed'), error);
            });
        return false;
    }

    return (
        <>
        <div className="userInfoCard">
            <div className="avatarContainer">
                <div className="avatar">
                    <img src={sanitizeUrl(userInfo.photoUrl)} alt="User Avatar"/>
                </div>
                <input id={"fileInput"} type="file" name="file"/>

            </div>
            <div className="details">
                <p className="row">
                    <label className="rowLabel">{transText(lang, '用户标识', 'UserID')}:</label>
                    <span className="rowContent">{accountUrn}</span>
                </p>
                <p className="row">
                    <label className="rowLabel">{transText(lang, '用户名', 'Username')}: </label>
                    <input value={username} onChange={(event) => setUsername(event.target.value)}/>
                </p>
                <p className="row">
                    <label className="rowLabel">{transText(lang, '用户昵称', 'Nickname')}：</label>
                    <input value={nickname} onChange={(event => setNickname(event.target.value))}/>
                </p>
                <p className="row"><label
                    className="rowLabel">{transText(lang, '邮箱', 'Email')}:</label>
                    <input value={email} onChange={(event) => setEmail(event.target.value)}/>
                </p>
                <p className="row"><label
                    className="rowLabel">{transText(lang, '个人简介', 'Description')}:</label>
                    <textarea value={description}
                              onChange={(event) => setDescription(event.target.value)}></textarea>
                </p>
            </div>
            <div className="submitButtons">
                <button type="button" onClick={onSubmit}>{transText(lang, '保存', 'Save')}</button>
                <button type="button" onClick={() => {
                    window.location.href = `/${lang}/console/userinfo`; // 返回用户信息页面
                    return false
                }}>{transText(lang, '取消', 'Cancel')}
                </button>
            </div>
        </div>
        <style jsx>{`
          .userInfoCard {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            background-color: #ffffff;
            margin-top: 16px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: relative;
          }
          .avatarContainer {
            width: 40%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 2rem;
          }
          .avatar {
            width: 12rem;
            height: 12rem;
            border-radius: 50%;
            margin-bottom: 20px;
          }
          .avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
          .details {
            display: table;
            align-items: center;
            text-align: center;
            width: 40%;
            margin: 0 auto;
          }
          .row {
            display: table-row;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .rowLabel {
            font-weight: normal;
            color: #666;
            width: 50%;
            display: table-cell;
            text-align: right;
            padding-right: 1rem;
          }
          .rowContent {
            color: #333;
            font-size: 1rem;
            display: table-cell;
            text-align: left;
            word-break: break-all;
          }
          .submitButtons {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 20px;
            height: 4rem;
          }
        `}</style>
        </>
    );
}

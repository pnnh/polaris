'use client'

import styles from "./form.module.scss";
import {AccountModel, getAccountUrn} from "@/atom/common/models/account";
import {getDefaultImageUrl, getDefaultNoteImageByUid} from "@/services/common/note";
import {useState} from "react";

export function UserinfoEditForm({portalUrl, userInfo}: { portalUrl: string, userInfo: AccountModel }) {
    const accountUrn = getAccountUrn(userInfo.uid);
    const [username, setUsername] = useState(userInfo.username || accountUrn);
    const [nickname, setNickname] = useState(userInfo.nickname || '');
    const [email, setEmail] = useState(userInfo.mail || '');
    const [description, setDescription] = useState(userInfo.description || '');

    const onSubmit = () => {
        // 获取文件输入框中的文件
        const fileInput = document.querySelector('#fileInput');
        if (!fileInput || !(fileInput instanceof HTMLInputElement) || !fileInput.files) {
            console.error('文件输入框未找到或未正确设置');
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

        const fetchUrl = `${portalUrl}/account/userinfo/edit`; // 替换为实际的上传 URL
        fetch(fetchUrl, {
            method: 'POST',
            body: formData // 直接使用 FormData 作为 body
        })
            .then(response => response.json()) // 假设服务器返回 JSON
            .then(data => {
                console.log('成功:', data);
            })
            .catch(error => {
                console.error('错误:', error);
            });
        return false;
    }

    return (
        <div className={styles.userInfoCard}>
            <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                    <img src={userInfo.photoUrl} alt="User Avatar"/>
                </div>
                <input id={"fileInput"} type="file" name="file"/>

            </div>
            <div className={styles.details}>
                <p className={styles.row}>
                    <label className={styles.rowLabel}>用户标识:</label>
                    <span className={styles.rowContent}>{accountUrn}</span>
                </p>
                <p className={styles.row}>
                    <label className={styles.rowLabel}>用户名: </label>
                    <input value={username} onChange={(event) => setUsername(event.target.value)}/>
                </p>
                <p className={styles.row}>
                    <label className={styles.rowLabel}>用户昵称：</label>
                    <input value={nickname} onChange={(event => setNickname(event.target.value))}/>
                </p>
                <p className={styles.row}><label className={styles.rowLabel}>邮箱:</label>
                    <input value={email} onChange={(event) => setEmail(event.target.value)}/>
                </p>
                <p className={styles.row}><label className={styles.rowLabel}>个人简介:</label>
                    <textarea value={description}
                              onChange={(event) => setDescription(event.target.value)}></textarea>
                </p>
            </div>
            <div className={styles.submitButtons}>
                <button type="button" onClick={onSubmit}>保存</button>
                <button type="button" onClick={() => {
                    window.location.href = '/account/userinfo'; // 返回用户信息页面
                    return false
                }}>取消
                </button>
            </div>
        </div>
    );
}

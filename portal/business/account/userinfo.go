package account

import (
	"fmt"
	"net/http"
	"path/filepath"

	nemodels "github.com/pnnh/neutron/models"

	"portal/business"
	"portal/models"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/services/filesystem"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// 获取当前登录用户的信息，需要当前登录用户的cookie
func UserinfoHandler(gctx *gin.Context) {
	sessionAccountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("UserinfoHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错b"))
		return
	}
	if sessionAccountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在"))
		return
	}
	databaseAccountModel, err := models.GetAccount(sessionAccountModel.Uid)
	if err != nil {
		logrus.Warnln("UserinfoHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号信息出错"))
		return
	}
	selfAccountModel := &models.SelfAccountModel{
		AccountModel: *databaseAccountModel,
		Username:     sessionAccountModel.Username,
	}

	result := nemodels.NECodeOk.WithData(selfAccountModel)

	gctx.JSON(http.StatusOK, result)
}

func UserinfoEditHandler(gctx *gin.Context) {
	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("UserinfoHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错b"))
		return
	}
	if accountModel == nil || accountModel.IsAnonymous() {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在"))
		return
	}
	// 获取上传的文件
	file, err := gctx.FormFile("file")
	if err == nil && file != nil {
		if file.Size > 10*1024*1024 { // 限制文件大小为10MB
			logrus.Warningln("文件大小超过限制", file.Filename)
			gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("文件大小超过限制"))
			return
		}
		if !helpers.IsImageFile(file.Filename) {
			logrus.Warningln("上传的文件不是图片", file.Filename)
			gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("上传的文件不是图片"))
			return
		}
		storageUrl, ok := config.GetConfigurationString("STORAGE_URL")
		if !ok || storageUrl == "" {
			logrus.Warnln("UserinfoHandler STORAGE_URL 未配置2")
			gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "STORAGE_URL 未配置3"))
			return
		}
		storagePath, err := filesystem.ResolvePath(storageUrl)
		if err != nil {
			logrus.Warnln("UserinfoHandler", fmt.Sprintf("解析路径失败: %v", err))
			gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "解析路径失败"))
			return
		}
		fileUuid, err := helpers.NewUuid()
		if err != nil {
			logrus.Warnln("UserinfoHandler", fmt.Sprintf("生成UUID失败: %v", err))
			gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "生成UUID失败"))
			return
		}
		extName := filesystem.LowerExtName(file.Filename)

		// 构造保存文件的完整路径
		filename := fileUuid + extName
		photoStorageDir := fmt.Sprintf("%s/%s/%s", storagePath, "photos", accountModel.Uid)
		if err := filesystem.MkdirAll(photoStorageDir); err != nil {
			logrus.Warnln("UserinfoHandler", fmt.Sprintf("创建目录失败: %v", err))
			gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "创建目录失败"))
			return
		}
		savePath := filepath.Join(photoStorageDir, filename)

		// 保存文件到指定目录
		if err := gctx.SaveUploadedFile(file, savePath); err != nil {
			gctx.String(http.StatusInternalServerError, fmt.Sprintf("upload file err: %s", err.Error()))
			return
		}
		accountModel.Photo = fmt.Sprintf("/%s/%s/%s", "photos", accountModel.Uid, filename)
	}
	accountModel.Nickname = gctx.PostForm("nickname")
	accountModel.EMail = gctx.PostForm("email")
	accountModel.Description = gctx.PostForm("description")

	err = models.UpdateAccountInfo(accountModel)
	if err != nil {
		logrus.Warnln("UserinfoEditHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "更新账号信息出错"))
		return
	}

	result := nemodels.NECodeOk

	gctx.JSON(http.StatusOK, result)
}

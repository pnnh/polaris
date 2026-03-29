package comments

import (
	"encoding/json"
	"net/http"
	"time"

	nemodels "github.com/pnnh/neutron/models"
	"portal/business/viewers"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/services/redisdb"
	"portal/business"
	"portal/models"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type CommentInsertRequest struct {
	//cloudflare.TurnstileModel
	CommentModel
}

func CommentInsertHandler(gctx *gin.Context) {
	request := &CommentInsertRequest{}
	if err := gctx.ShouldBindJSON(request); err != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
		return
	}

	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("CommentInsertHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错c"))
		return
	}
	if accountModel == nil || accountModel.IsAnonymous() {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在或匿名用户不能评论"))
		return
	}

	request.Uid = helpers.MustUuid()
	request.CreateTime = time.Now().UTC()
	request.UpdateTime = time.Now().UTC()
	request.Creator = accountModel.Uid
	request.Thread = helpers.EmptyUuid()
	request.Referer = helpers.EmptyUuid()
	request.IPAddress = helpers.GetIpAddress(gctx)
	request.EMail = accountModel.EMail
	request.Nickname = accountModel.Nickname
	request.Website = accountModel.Website

	err = PGInsertComment(&request.CommentModel)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "插入评论出错"))
		return
	}

	result := nemodels.NECodeOk.WithData(map[string]any{
		"changes": 1,
		"uid":     request.Uid,
	})

	gctx.JSON(http.StatusOK, result)
}

func CommentSelectHandler(gctx *gin.Context) {
	target := gctx.Query("resource")
	if target == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("资源不存在"))
		return
	}

	selectResult, err := SelectComments(target, 1, 60)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询评论出错"))
		return
	}
	responseResult := nemodels.NECodeOk.WithData(selectResult)

	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("FindAccountFromCookie查询账号出错d", err)
	}

	//addr := helpers.GetIpAddress(gctx)
	isBotRequest, userAgent := helpers.IsBotRequest(gctx)
	if !isBotRequest && accountModel != nil && !accountModel.IsAnonymous() {
		// 发送评论消息到消息队列
		//sendCommentViewerMQMessages(gctx, accountModel, selectResult, addr)
	} else {
		logrus.Infoln("CommentSelectHandler isBotRequest:", userAgent, "accountModel:", accountModel)
	}
	gctx.JSON(http.StatusOK, responseResult)
}

// 发送评论消息到消息队列
func sendCommentViewerMQMessages(gctx *gin.Context, accountModel *models.AccountModel,
	selectResult *nemodels.NESelectResponse, addr string) {

	commentViewers := make([]*viewers.MTViewerModel, 0)
	for _, item := range selectResult.Range {
		comment := item.(*CommentModel)
		// 跳过匿名评论或当前用户的评论
		if comment == nil || comment.Creator == "" {
			continue
		}
		model := &viewers.MTViewerModel{
			MTViewerTable: viewers.MTViewerTable{
				Uid:        helpers.MustUuid(),
				Target:     comment.Uid,
				Address:    addr,
				CreateTime: time.Now(),
				UpdateTime: time.Now(),
				Class:      "comment",
			},
		}
		if accountModel != nil && !accountModel.IsAnonymous() {
			if comment.Creator == accountModel.Uid {
				continue
			}
			model.Source = accountModel.Uid
		}
		commentViewers = append(commentViewers, model)
	}
	if len(commentViewers) > 0 {
		viewersJson, err := json.Marshal(commentViewers)
		if err != nil {
			logrus.Errorln("CommentSelectHandler json.Marshal error:", err)
			gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
			return
		}
		redisUrl, ok := config.GetConfigurationString("REDIS_URL")
		if !ok || redisUrl == "" {
			logrus.Fatalln("REDIS_URL未配置")
		}
		redisClient, err := redisdb.ConnectRedis(gctx, redisUrl)
		if err != nil {
			logrus.Errorln("CommentSelectHandler ConnectRedis error:", err)
			gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
			return
		}
		err = redisdb.Produce(gctx, redisClient, CommentViewersRedisKey, viewersJson)
		if err != nil {
			logrus.Errorln("CommentSelectHandler Producer error:", err)
			gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
			return
		}
	}
}

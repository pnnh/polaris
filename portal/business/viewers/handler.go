package viewers

import (
	"database/sql"
	"errors"
	"net/http"
	"time"

	"github.com/pnnh/neutron/helpers"
	nemodels "github.com/pnnh/neutron/models"
	"portal/business"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type ViewerInsertRequest struct {
	ClientIp string `json:"clientIp"`
	Headers  string `json:"headers"`
}

func NoteViewerInsertHandler(gctx *gin.Context) {
	uid := gctx.Param("uid")
	if uid == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("uid不能为空"))
		return
	}
	request := &ViewerInsertRequest{}
	if err := gctx.ShouldBindJSON(request); err != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
		return
	}

	model := &MTViewerTable{
		Uid:        helpers.MustUuid(),
		Target:     uid,
		Address:    request.ClientIp,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
		Class:      "note",
		Headers:    request.Headers,
		Direction:  "uta",
	}
	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("HandleInsert", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错c"))
		return
	}
	if accountModel != nil {
		model.Owner = sql.NullString{
			String: accountModel.Uid,
			Valid:  true,
		}
		model.Source = sql.NullString{
			String: accountModel.Uid,
			Valid:  true,
		}
	}

	opErr, itemErrs := PGInsertViewer(model)
	if opErr != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(opErr))
		return
	}
	for key, item := range itemErrs {
		if !errors.Is(item, ErrViewerLogExists) {
			logrus.Warnln("NoteViewerInsertHandler", key, item)
		}
	}
	result := nemodels.NECodeOk.WithData(map[string]any{
		"changes": 1,
	})

	gctx.JSON(http.StatusOK, result)
}

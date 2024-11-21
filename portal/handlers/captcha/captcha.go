package captcha

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"multiverse-authorization/models"

	"github.com/gin-gonic/gin"
	"github.com/wenlng/go-captcha/captcha"
)

func GetCaptchaData(ctx *gin.Context) {
	w, _ := ctx.Writer, ctx.Request
	capt := captcha.GetCaptcha()

	dots, b64, tb64, key, err := capt.Generate()
	if err != nil {
		bt, _ := json.Marshal(map[string]interface{}{
			"code":    1,
			"message": "GenCaptcha err",
		})
		_, _ = fmt.Fprintf(w, string(bt))
		return
	}
	if err := writeCache(dots, key); err != nil {
		bt, _ := json.Marshal(map[string]interface{}{
			"code":    1,
			"message": "GenCaptcha err",
		})
		_, _ = fmt.Fprintf(w, string(bt))
		return
	}
	bt, _ := json.Marshal(map[string]interface{}{
		"code":         0,
		"image_base64": b64,
		"thumb_base64": tb64,
		"captcha_key":  key,
	})
	_, _ = fmt.Fprintf(w, string(bt))
}

func CheckCaptcha(ctx *gin.Context) {
	w, r := ctx.Writer, ctx.Request
	code := 1
	err := r.ParseForm()
	if err != nil {
		bt, _ := json.Marshal(map[string]interface{}{
			"code":    code,
			"message": "illegal param",
		})
		_, _ = fmt.Fprintf(w, string(bt))
		return
	}
	dots := r.Form.Get("dots")
	key := r.Form.Get("key")
	if dots == "" || key == "" {
		bt, _ := json.Marshal(map[string]interface{}{
			"code":    code,
			"message": "dots or key param is empty",
		})
		_, _ = fmt.Fprintf(w, string(bt))
		return
	}

	cacheData, err := readCache(key)
	if err != nil {
		bt, _ := json.Marshal(map[string]interface{}{
			"code":    code,
			"message": "illegal key",
		})
		_, _ = fmt.Fprintf(w, string(bt))
		return
	}
	if cacheData == "" {
		bt, _ := json.Marshal(map[string]interface{}{
			"code":    code,
			"message": "illegal key2",
		})
		_, _ = fmt.Fprintf(w, string(bt))
		return
	}
	src := strings.Split(dots, ",")

	var dct map[int]captcha.CharDot
	if err := json.Unmarshal([]byte(cacheData), &dct); err != nil {
		bt, _ := json.Marshal(map[string]interface{}{
			"code":    code,
			"message": "illegal key3",
		})
		_, _ = fmt.Fprintf(w, string(bt))
		return
	}

	chkRet := false
	if (len(dct) * 2) == len(src) {
		for i, dot := range dct {
			j := i * 2
			k := i*2 + 1
			sx, _ := strconv.ParseFloat(fmt.Sprintf("%v", src[j]), 64)
			sy, _ := strconv.ParseFloat(fmt.Sprintf("%v", src[k]), 64)

			// 检测点位置
			// chkRet = captcha.CheckPointDist(int64(sx), int64(sy), int64(dot.Dx), int64(dot.Dy), int64(dot.Width), int64(dot.Height))

			// 校验点的位置,在原有的区域上添加额外边距进行扩张计算区域,不推荐设置过大的padding
			// 例如：文本的宽和高为30，校验范围x为10-40，y为15-45，此时扩充5像素后校验范围宽和高为40，则校验范围x为5-45，位置y为10-50
			chkRet = captcha.CheckPointDistWithPadding(int64(sx), int64(sy), int64(dot.Dx), int64(dot.Dy), int64(dot.Width), int64(dot.Height), 5)
			if !chkRet {
				break
			}
		}
	}

	if chkRet {
		// 通过校验
		code = 0

		if err = models.UpdateCaptcha(key, 1); err != nil {
			bt, _ := json.Marshal(map[string]interface{}{
				"code":    code,
				"message": "更新验证码状态出错",
			})
			_, _ = fmt.Fprintf(w, string(bt))
			return
		}
	}

	bt, _ := json.Marshal(map[string]interface{}{
		"code": code,
	})
	_, _ = fmt.Fprintf(w, string(bt))
	return
}

func readCache(file string) (string, error) {
	model, err := models.FindCaptcha(file)
	if err != nil {
		return "", err
	}
	return model.Content, nil
}
func checkFileIsExist(filename string) bool {
	var exist = true
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		exist = false
	}
	return exist
}
func writeCache(v interface{}, file string) (err error) {
	bt, err := json.Marshal(v)
	if err != nil {
		return err
	}
	model := &models.CaptchaModel{
		Pk:         file,
		Content:    string(bt),
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
		Checked:    0, // 未校验
	}
	return models.PutCaptcha(model)
}

func getCacheDir() (string, error) {
	workDir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	cacheDir := workDir + "/.cache/"
	if checkFileIsExist(cacheDir) {
		return cacheDir, nil
	}
	err = os.Mkdir(cacheDir, os.ModePerm)
	if err != nil {
		return "", err
	}
	return cacheDir, nil
}

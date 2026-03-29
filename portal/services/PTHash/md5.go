package PTHash

import (
	"crypto/md5"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/google/uuid"
)

func PTCalculateMD5File(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hash := md5.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", hash.Sum(nil)), nil
}

func PTCalculateMD5String(rawString string) (string, error) {

	hash := md5.New()
	strReader := strings.NewReader(rawString)
	if _, err := io.Copy(hash, strReader); err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", hash.Sum(nil)), nil
}

// PTMd5ToUuid 将32位的MD5字符串转换为标准的UUID格式（8-4-4-4-12）
func PTMd5ToUuid(md5Str string) (string, error) {
	md5hex := strings.ReplaceAll(md5Str, "-", "")
	if len(md5hex) != 32 {
		return "", fmt.Errorf("invalid md5 hex length")
	}

	// 把 md5 字符串当作名字，计算一个 v5 UUID
	// 这里使用一个固定的命名空间（可以自己定义，也可以直接用 nil UUID）
	ns := uuid.NameSpaceDNS // 或 uuid.NamespaceOID / uuid.NamespaceURL / uuid.NamespaceX500

	// 直接把 md5 字符串当作 name
	u := uuid.NewMD5(ns, []byte(md5Str))

	return u.String(), nil
}

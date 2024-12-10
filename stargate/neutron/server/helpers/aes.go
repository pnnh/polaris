package helpers

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"io"
)
const saltLength = 16


func AesEncrypt(str string, key []byte) (string, error) {
	crypted, err := AesEncryptBytes([]byte(str), key)
	if err != nil {
		return "", fmt.Errorf("加密出错: %w", err)
	}
	salt := make([]byte, saltLength)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("生成salt出错: %w", err)
	}
	data := append(salt, crypted...)
	//data := crypted
	return base64.RawURLEncoding.EncodeToString(data), nil
}

func AesDecrypt(str string, key []byte) (ret string, err error) {
	if len(str) == 0 {
		return "", nil
	}
	data, err := base64.RawURLEncoding.DecodeString(str)
	if err != nil {
		return "", err
	}
	crypted := data[saltLength:]
	//crypted := data
	decrypted, err := AesDecryptBytes(crypted, key)
	if err != nil {
		return "", fmt.Errorf("解密出错: %w", err)
	}
	return string(decrypted), nil
}

func AesEncryptBytes(bytes []byte, key []byte) ([]byte, error) {
	//origData:=bytes
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, fmt.Errorf("Encrypt创建Cipher出错: %w", err)
	}
	blockSize := block.BlockSize()
	bytes = pkcs5Padding(bytes, blockSize)
	iv := make([]byte, blockSize)
	blockMode := cipher.NewCBCEncrypter(block, iv)
	crypted := make([]byte, len(bytes))
	blockMode.CryptBlocks(crypted, bytes)

	return crypted, nil
}

func AesDecryptBytes(bytes []byte, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, fmt.Errorf("Decrypt创建Cipher出错: %w", err)
	}
	blockSize := block.BlockSize()
	iv := make([]byte, blockSize)
	blockMode := cipher.NewCBCDecrypter(block, iv)
	origData := make([]byte, len(bytes))
	blockMode.CryptBlocks(origData, bytes)

	length := len(origData)
	// 去掉最后一个字节 unpadding 次
	unpadding := int(origData[length-1])
	origData = origData[:(length - unpadding)]

	return origData, nil
}

func zeroPadding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	padtext := bytes.Repeat([]byte{0}, padding)
	return append(ciphertext, padtext...)
}

func zeroUnPadding(origData []byte) []byte {
	length := len(origData)
	unpadding := int(origData[length-1])
	return origData[:(length - unpadding)]
}

func pkcs5Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(ciphertext, padtext...)
}
func pkcs5UnPadding(origData []byte) []byte {
	length := len(origData)
	// 去掉最后一个字节 unpadding 次
	unpadding := int(origData[length-1])
	return origData[:(length - unpadding)]
}


//生成32位md5字串
func GetMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

// 生成GUID
func GetGuid() string {
	b := make([]byte, 48)

	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return GetMd5String(base64.URLEncoding.EncodeToString(b))
}

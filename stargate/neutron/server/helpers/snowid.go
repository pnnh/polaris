package helpers

import (
	"encoding/base64"
	"encoding/binary"
	"hash/crc64"

	"github.com/bwmarrin/snowflake"
	"github.com/sirupsen/logrus"
)

var snowflakeNode *snowflake.Node
var crc64Table *crc64.Table

func init() {
	node, err := snowflake.NewNode(1)
	if err != nil {
		logrus.Fatalln("初始化snowflake出错", err)
		return
	}
	snowflakeNode = node
	crc64Table = crc64.MakeTable(crc64.ISO)
}

func NewPostId() string {
	id := snowflakeNode.Generate()

	data := id.IntBytes()
	return base64.RawURLEncoding.EncodeToString(data[:])
}

func EncodeId(id uint64) string {
	data := make([]byte, 8)
	binary.BigEndian.PutUint64(data, id)
	return base64.RawURLEncoding.EncodeToString(data)
}

func DecodeId(str string) (uint64, error) {
	data, err := base64.RawURLEncoding.DecodeString(str)
	if err != nil {
		return 0, err
	}
	return binary.BigEndian.Uint64(data), nil
}

func CalcPostId() uint64 {
	id := snowflakeNode.Generate()

	data := id.IntBytes()
	return crc64.Checksum(data[:], crc64Table)
}

func CalcUserID(email string) uint64 {
	return crc64.Checksum([]byte(email), crc64Table)
}

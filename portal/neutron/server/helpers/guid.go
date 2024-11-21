package helpers

import (
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

func NewUuid() (string, error) {
	id, err := uuid.NewUUID()
	if err != nil {
		return "", err
	}
	return id.String(), nil
}

func MustUuid() string {
	id, err := uuid.NewUUID()
	if err != nil {
		logrus.Fatalln("初始化uuid出错", err)
		return ""
	}
	return id.String()
}

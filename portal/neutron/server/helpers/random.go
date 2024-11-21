package helpers

import (
	"math/rand"
	"time"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

var numberRunes = []rune("0123456789")
var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
var allRunes = append(letterRunes, numberRunes...)

func RandStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = allRunes[rand.Intn(len(allRunes))]
	}
	return string(b)
}

func RandNumberRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = numberRunes[rand.Intn(len(numberRunes))]
	}
	return string(b)
}

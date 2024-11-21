package services

import (
	"strconv"
	"strings"
 
	redis "github.com/go-redis/redis/v8"
	"github.com/sirupsen/logrus"
)

const keyAddr = "addr"
const keyPassword = "password"
const keyDb = "db"

type RedisService struct {
	*redis.Client
	addr     string
	password string
	db       int
}

func NewRedisService(addr string) *RedisService {
	redisList := strings.Split(addr, " ")

	addr, password, db := "", "", ""

	for _, v := range redisList {
		kvList := strings.Split(v, "=")
		if len(kvList) != 2 {
			logrus.Fatalln("Redis KV配置有误: " + v)
		}
		switch kvList[0] {
		case keyAddr:
			addr = kvList[1]
		case keyPassword:
			password = kvList[1]
		case keyDb:
			db = kvList[1]
		}
	}
	if len(addr) < 1 {
		logrus.Fatalln("Redis地址配置有误: " + addr)
	}
	dbInt, err := strconv.Atoi(db)
	if err != nil {
		logrus.Errorln("Redis转换db出错: ["+db+"]", err)
	}

	serv := &RedisService{
		addr:     addr,
		password: password,
		db:       dbInt,
	}
	return serv
}

func (s *RedisService) Init() error {
	rdb := redis.NewClient(&redis.Options{
		Addr:     s.addr,
		Password: s.password,
		DB:       s.db,
	})
	s.Client = rdb
	return nil
}

func (s *RedisService) Start() error {
	return nil
}

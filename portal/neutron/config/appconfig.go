package config

import (
	"flag"
	"time"

	"github.com/sirupsen/logrus"
	v2 "multiverse-authorization/neutron/config/v2"
)

// Deprecated: 已废弃，不再解析flag
var configFile = flag.String("config", "config.yaml", "配置文件路径")

// Deprecated: 已废弃，不再解析flag
var runMode = flag.String("mode", "", "运行模式(debug, release)")

var staticConfigModel v2.ConfigMap

// Deprecated: 避免全局静态初始化行为
func init() {
	configLog()
	// 在执行单元测试时，不进行后续处理
	// if debug.IsTesting() {
	// 	return
	// }
	flag.Parse()
	model, err := v2.ParseConfig(*configFile, *runMode)
	if err != nil {
		logrus.Errorf("配置文件[%s]解析失败: %s", *configFile, err)
	}
	staticConfigModel = model
}

// Deprecated: 已废弃，采用v2 API
func GetConfiguration(key interface{}) (interface{}, bool) {
	if key, ok := key.(string); ok {
		if value, err := staticConfigModel.GetValue(key); err == nil {
			return value, true
		}
	}
	return nil, false
}

// Deprecated: 已废弃，采用v2 API
func GetConfigurationString(key interface{}) (string, bool) {
	if key, ok := key.(string); ok {
		if value, err := staticConfigModel.GetString(key); err == nil {
			return value, true
		}
	}
	return "", false
}

// Deprecated: 已废弃，采用v2 API
func MustGetConfigurationString(key interface{}) string {
	value, ok := GetConfigurationString(key)
	if !ok {
		logrus.Fatalf("配置项[%s]不存在", key)
	}
	return value
}

// Deprecated: 已废弃，采用v2 API
func GetConfigurationInt64(key interface{}) (int64, bool) {
	if key, ok := key.(string); ok {
		if value, err := staticConfigModel.GetInt64(key); err == nil {
			return value, true
		}
	}
	return 0, false
}

// Deprecated: 已废弃，采用v2 API
func GetConfigOrDefaultInt64(key interface{}, defaultValue int64) int64 {
	value, ok := GetConfigurationInt64(key)
	if !ok {
		return defaultValue
	}
	return value
}

// Deprecated: 已废弃，该功能应统一通过配置项来管理
func Debug() bool {
	var mode, ok = GetConfiguration("mode")
	if ok && mode == "debug" {
		return true
	}
	return false
}

func configLog() {
	logrus.SetLevel(logrus.ErrorLevel)
	logrus.SetReportCaller(false)
	logrus.SetFormatter(&logrus.TextFormatter{
		ForceColors:     false,
		TimestampFormat: time.RFC3339,
	})
}

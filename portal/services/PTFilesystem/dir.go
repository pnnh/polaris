package PTFilesystem

import (
	"os"
	"runtime"
)

func MTCreateDir(path string) error {
	// 0755 是最常见的目录权限：owner 全权，其他人可读可进
	if err := os.MkdirAll(path, 0755); err != nil {
		return err
	}

	// Windows 上 chmod 基本无效（只影响 readonly 位），无需执行
	if runtime.GOOS != "windows" {
		if err := os.Chmod(path, 0755); err != nil {
			return err
		}
	}

	return nil
}

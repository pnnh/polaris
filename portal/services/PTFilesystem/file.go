package PTFilesystem

import (
	"os"
	"path/filepath"
)

func IsTextFile(fileName string) (bool, error) {
	extName := filepath.Ext(fileName)
	textFileExts := map[string]bool{
		".txt":  true,
		".md":   true,
		".json": true,
		".xml":  true,
		".yaml": true,
		".yml":  true,
		".csv":  true,
		".log":  true,
		".html": true,
		".htm":  true,
		".css":  true,
		".js":   true,
		".go":   true,
		".py":   true,
		".java": true,
		".c":    true,
		".cpp":  true,
		".h":    true,
		".sh":   true,
	}
	_, exists := textFileExts[extName]
	return exists, nil
}

// PTReadFileAsString reads a file and returns its content as a string
func PTReadFileAsString(filePath string) (string, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

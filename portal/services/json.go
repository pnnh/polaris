package services

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/pnnh/neutron/helpers/jsonmap"
)

// 将jsonmap.JsonMap中的子JsonMap进行预处理，转换成普通的map[string]interface{}，以便于后续的json.Marshal操作
// 处理空值和嵌套的JsonMap
func ptPreprocessJsonMap(jsonMap *jsonmap.JsonMap) map[string]interface{} {
	newMap := make(map[string]interface{})
	for key, val := range jsonMap.InnerMap() {
		switch val.(type) {
		case *jsonmap.JsonMap:
			newMap[key] = ptPreprocessJsonMap(val.(*jsonmap.JsonMap))
		case sql.NullString:
			nullStr := val.(sql.NullString)
			if nullStr.Valid {
				newMap[key] = nullStr.String
			}
		case sql.NullInt64:
			nullInt := val.(sql.NullInt64)
			if nullInt.Valid {
				newMap[key] = nullInt.Int64
			}
		case sql.NullTime:
			nullTime := val.(sql.NullTime)
			if nullTime.Valid {
				newMap[key] = nullTime.Time
			}
		case sql.NullBool:
			nullBool := val.(sql.NullBool)
			if nullBool.Valid {
				newMap[key] = nullBool.Bool
			}
		case sql.NullByte:
			nullByte := val.(sql.NullByte)
			if nullByte.Valid {
				newMap[key] = nullByte.Byte
			}
		case sql.NullFloat64:
			nullFloat := val.(sql.NullFloat64)
			if nullFloat.Valid {
				newMap[key] = nullFloat.Float64
			}
		case sql.NullInt32:
			nullInt32 := val.(sql.NullInt32)
			if nullInt32.Valid {
				newMap[key] = nullInt32.Int32
			}
		case sql.NullInt16:
			nullInt16 := val.(sql.NullInt16)
			if nullInt16.Valid {
				newMap[key] = nullInt16.Int16
			}
		default:
			newMap[key] = val
		}
	}
	return newMap
}

func PTMarshalJsonMap(jsonMap *jsonmap.JsonMap) ([]byte, error) {
	newMap := ptPreprocessJsonMap(jsonMap)
	data, err := json.Marshal(newMap)
	if err != nil {
		return nil, fmt.Errorf("PTMarshalJsonMap error: %w", err)
	}
	return data, nil
}

func PTMarshalJsonMapToString(jsonMap *jsonmap.JsonMap) (string, error) {
	data, err := PTMarshalJsonMap(jsonMap)
	if err != nil {
		return "", fmt.Errorf("PTMarshalJsonMapToString error: %w", err)
	}
	return string(data), nil
}

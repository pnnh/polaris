package jsonmap

import (
	"fmt"
)

type IIntValue interface {
	int | int8 | uint8 | int16 | uint16 | int32 | uint32 | int64 | uint64
}

type IMapValue interface {
	IIntValue | string
}

type MapValue[T IMapValue] struct {
	Value T
	Error error
}

func NewMapValue[T IMapValue](value T) *MapValue[T] {
	return &MapValue[T]{value, nil}
}

func NewErrorMapValue[T IMapValue](err error) *MapValue[T] {
	return &MapValue[T]{Error: err}
}

func HasError(errs ...error) error {
	for _, e := range errs {
		if e != nil {
			return e
		}
	}
	return nil
}

type JsonMap map[string]interface{}

func New() *JsonMap {
	return new(JsonMap)
}

func (m JsonMap) MustGetInt(key string) int {
	if v, ok := m[key]; ok {
		return v.(int)
	}
	panic(fmt.Sprintf("MustGetInt error, not found key: %s", key))
}

func (m JsonMap) GetInt(key string) *MapValue[int] {
	return GetInt[int](&m, key)
}

func (m JsonMap) GetString(key string) *MapValue[string] {
	if v, ok := m[key]; ok {
		return NewMapValue(v.(string))
	}
	// err := fmt.Errorf("GetString error, not found key: %s", key)
	// return NewErrorMapValue[string](err)
	return NewMapValue("")
}

func GetInt[T IIntValue](m *JsonMap, key string) *MapValue[T]  {
	if v, ok := (*m)[key]; ok {
		switch v := v.(type) {
		case int:
			return NewMapValue((T)(v))
		case uint:
			return NewMapValue((T)(v))
		case int8:
			return NewMapValue((T)(v))
		case uint8:
			return NewMapValue((T)(v))
		case int16:
			return NewMapValue((T)(v))
		case uint16:
			return NewMapValue((T)(v))
		case int32:
			return NewMapValue((T)(v))
		case uint32:
			return NewMapValue((T)(v))
		case int64:
			return NewMapValue((T)(v)) 
		case uint64:
			return NewMapValue((T)(v)) 
		case float32:
			return NewMapValue((T)(v))
		case float64:
			return NewMapValue((T)(v))
		}
	}
	err := fmt.Errorf("MustGetInt error, not found key: %s", key)
	return NewErrorMapValue[T](err)
}

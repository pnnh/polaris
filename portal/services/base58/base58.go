package base58

import (
	"fmt"

	"github.com/dromara/dongle"
	"github.com/google/uuid"
)

func EncodeBase58String(rawStr string) string {
	encoded := dongle.Encode.FromBytes([]byte(rawStr)).ByBase58().ToString()
	//encoded := base58.CheckEncode([]byte(rawStr), 0x00)
	return encoded
}

func UuidToBase58(uuidStr string) (string, error) {
	if uuidStr == "" {
		return "", fmt.Errorf("uuid string is empty")
	}
	if len(uuidStr) != 36 {
		return "", fmt.Errorf("invalid uuid string length: expected 36, got %d", len(uuidStr))
	}
	uuidValue, err := uuid.Parse(uuidStr)
	if err != nil {
		return "", err
	}
	uuidBytes := uuidValue[:]
	encoded := dongle.Encode.FromBytes(uuidBytes).ByBase58().ToString()
	return encoded, nil
}

func DecodeBase58String(encodedStr string) (string, error) {

	result := dongle.Decode.FromString(encodedStr).ByBase58()
	if result.Error != nil {
		return "", fmt.Errorf("dongle.Decode.FromString: %w", result.Error)
	}
	decoded := result.ToBytes()
	//decoded, _, err := base58.CheckDecode(encodedStr)
	//if err != nil {
	//	return "", fmt.Errorf("base58.CheckDecode: %w", err)
	//}

	return string(decoded), nil
}

func Base58ToUuid(encodedStr string) (string, error) {
	decodedResult := dongle.Decode.FromString(encodedStr).ByBase58()
	if decodedResult.Error != nil {
		return "", fmt.Errorf("dongle.Decode.FromString: %w", decodedResult.Error)
	}
	decodedBytes := decodedResult.ToBytes()
	if len(decodedBytes) != 16 {
		return "", fmt.Errorf("invalid decoded byte length: expected 16, got %d", len(decodedBytes))
	}

	uuidValue, err := uuid.FromBytes(decodedBytes)
	if err != nil {
		return "", fmt.Errorf("uuid.FromBytes: %w", err)
	}
	return uuidValue.String(), nil
}

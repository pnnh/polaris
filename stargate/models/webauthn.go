package models

import (
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/sirupsen/logrus"
	"multiverse-authorization/neutron/services/datastore"
)

type WebauthnAccount struct {
	AccountModel
	WebauthnCredentials
}

func NewWebauthnAccount(name string, displayName string) *WebauthnAccount {
	user := &WebauthnAccount{
		AccountModel: *NewAccountModel(name, displayName),
	}
	return user
}

func CopyWebauthnAccount(account *AccountModel) *WebauthnAccount {
	user := &WebauthnAccount{
		AccountModel: *account,
	}
	return user
}

type WebauthnCredentials struct {
	CredentialsSlice []webauthn.Credential
}

// WebAuthnID returns the user's ID
func (u *WebauthnAccount) WebAuthnID() []byte {
	// buf := make([]byte, binary.MaxVarintLen64)
	// binary.PutUvarint(buf, uint64(u.Id))
	// return buf
	return []byte(u.Pk)
}

// WebAuthnName returns the user's username
func (u *WebauthnAccount) WebAuthnName() string {
	//return u.Name
	return u.Username
}

// WebAuthnDisplayName returns the user's display name
func (u *WebauthnAccount) WebAuthnDisplayName() string {
	return u.Nickname
}

// WebAuthnIcon is not (yet) implemented
func (u *WebauthnAccount) WebAuthnIcon() string {
	return ""
}

// AddCredential associates the credential to the user
func (u *WebauthnAccount) AddCredential(cred webauthn.Credential) {
	u.CredentialsSlice = append(u.CredentialsSlice, cred)
}

// WebAuthnCredentials returns credentials owned by the user
func (u *WebauthnAccount) WebAuthnCredentials() []webauthn.Credential {
	if len(u.CredentialsSlice) < 1 && u.Credentials != "" {
		decodeBytes, err := base64.StdEncoding.DecodeString(u.Credentials)
		if err != nil {
			logrus.Errorln("WebAuthnCredentials DecodeString: %w", err)
			return u.CredentialsSlice
		}
		webauthnCredentials := &WebauthnCredentials{}
		if err := json.Unmarshal(decodeBytes, webauthnCredentials); err != nil {
			logrus.Errorln("WebAuthnCredentials Unmarshal error: %w", err)
			return u.CredentialsSlice
		}
		u.WebauthnCredentials = *webauthnCredentials
	}
	return u.CredentialsSlice
}

func (model *WebauthnAccount) MarshalCredentials() (string, error) {
	if len(model.CredentialsSlice) < 1 {
		return "", fmt.Errorf("credentialsSlice为空")
	}
	data, err := json.Marshal(model.WebauthnCredentials)
	if err != nil {
		return "", fmt.Errorf("MarshalCredentials error: %w", err)
	}

	return base64.StdEncoding.EncodeToString(data), nil
}

// CredentialExcludeList returns a CredentialDescriptor array filled
// with all the user's credentials
func (u *WebauthnAccount) CredentialExcludeList() []protocol.CredentialDescriptor {

	credentialExcludeList := []protocol.CredentialDescriptor{}
	for _, cred := range u.CredentialsSlice {
		descriptor := protocol.CredentialDescriptor{
			Type:         protocol.PublicKeyCredentialType,
			CredentialID: cred.ID,
		}
		credentialExcludeList = append(credentialExcludeList, descriptor)
	}

	return credentialExcludeList
}

func UpdateAccountCredentials(model *WebauthnAccount) error {
	sqlText := `update accounts set portal.credentials = :credentials where pk = :pk;`

	credentials, err := model.MarshalCredentials()
	if err != nil {
		return fmt.Errorf("MarshalCredentiials: %w", err)
	}

	sqlParams := map[string]interface{}{"pk": model.Pk, "credentials": credentials}

	_, err = datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("UpdateAccountCredentials: %w", err)
	}
	return nil
}

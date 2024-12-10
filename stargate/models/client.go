package models

import (
	"fmt"
	"strings"

	"multiverse-authorization/neutron/services/datastore"

	"github.com/jmoiron/sqlx"
	"github.com/ory/fosite"
)

func ApplicationToClient(app *ApplicationModel) *ClientModel {
	model := &ClientModel{
		ID:     app.Id,
		Secret: []byte(app.Secret),
	}

	for _, v := range strings.Split(app.RotatedSecrets, ",") {
		model.RotatedSecrets = append(model.RotatedSecrets, []byte(v))
	}

	model.RedirectURIs = append(model.RedirectURIs, strings.Split(app.RedirectUris, ",")...)
	model.GrantTypes = append(model.GrantTypes, strings.Split(app.GrantTypes, ",")...)
	model.ResponseTypes = append(model.ResponseTypes, strings.Split(app.ResponseTypes, ",")...)
	model.Scopes = append(model.Scopes, strings.Split(app.Scopes, ",")...)
	model.Audience = append(model.Audience, strings.Split(app.Audience, ",")...)

	if app.Public == 1 {
		model.Public = true
	}

	return model
}

type ClientModel struct {
	ID             string   `json:"id"`
	Secret         []byte   `json:"client_secret,omitempty"`
	RotatedSecrets [][]byte `json:"rotated_secrets,omitempty"`
	RedirectURIs   []string `json:"redirect_uris"`
	GrantTypes     []string `json:"grant_types"`
	ResponseTypes  []string `json:"response_types"`
	Scopes         []string `json:"scopes"`
	Audience       []string `json:"audience"`
	Public         bool     `json:"public"`
}

func (c *ClientModel) GetID() string {
	return c.ID
}

func (c *ClientModel) IsPublic() bool {
	return c.Public
}

func (c *ClientModel) GetAudience() fosite.Arguments {
	return c.Audience
}

func (c *ClientModel) GetRedirectURIs() []string {
	return c.RedirectURIs
}

func (c *ClientModel) GetHashedSecret() []byte {
	return c.Secret
}

func (c *ClientModel) GetRotatedHashes() [][]byte {
	return c.RotatedSecrets
}

func (c *ClientModel) GetScopes() fosite.Arguments {
	return c.Scopes
}

func (c *ClientModel) GetGrantTypes() fosite.Arguments {
	if len(c.GrantTypes) == 0 {
		return fosite.Arguments{"authorization_code"}
	}
	return fosite.Arguments(c.GrantTypes)
}

func (c *ClientModel) GetResponseTypes() fosite.Arguments {

	if len(c.ResponseTypes) == 0 {
		return fosite.Arguments{"code"}
	}
	return fosite.Arguments(c.ResponseTypes)
}

func GetClient(id string) (*ClientModel, error) {
	sqlText := `select pk, id, secret, rotated_secrets, redirect_uris, response_types, grant_types, scopes,
		audience, public
	from portal.applications where id = :id;`

	sqlParams := map[string]interface{}{"id": id}
	var sqlResults []*ApplicationModel

	rows, err := datastore.NamedQuery(sqlText, sqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}

	for _, v := range sqlResults {
		model := ApplicationToClient(v)
		return model, nil
	}

	return nil, nil
}

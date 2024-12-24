export interface ServerAuthParams {
    client_id: string
    response_type: string
    redirect_uri: string
    scope: string
    state: string
    nonce: string
    error: string
    authed: string
}

export interface ServerAuthResponse {
    requested_scopes: string[]
}

export interface ServerAuthGrantParams {
    client_id: string
    response_type: string
    redirect_uri: string
    scope: string
    state: string
    nonce: string
    code: string
    scopes: string[]
}

export interface ServerAuthGrantResponse {
    access_token: string
}

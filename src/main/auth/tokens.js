function saveTokens(tokens)
{
    const {accessToken,refreshToken}=tokens;
    saveAccessToken(accessToken);
    saveRefreshToken(refreshToken);
}

function getRefreshToken()
{
    return localStorage.getItem('refreshToken');
}

function getAccessToken()
{
    return sessionStorage.getItem('accessToken');
}

function saveAccessToken(token)
{
    sessionStorage.setItem("accessToken",token);
}

function saveRefreshToken(token)
{
    sessionStorage.setItem("refreshToken",token);
}

export {saveTokens,getRefreshToken,getAccessToken,saveAccessToken,saveRefreshToken}
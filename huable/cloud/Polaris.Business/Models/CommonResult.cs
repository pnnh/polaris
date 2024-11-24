using System.Text.Json.Serialization;

namespace Polaris.Business.Models;

public class PLBizException : Exception
{
    public PLBizException(string message, int code = (int)PLCodes.Error) : base(message)
    {
        Code = code;
    }

    public PLBizException(int code = (int)PLCodes.Error, string publicMessage = "",
        string internalMessage = "") : base(publicMessage + "\n" + internalMessage)
    {
        Code = code;
        InternalMessage = internalMessage;
        PublicMessage = publicMessage;
    }

    public int Code { get; set; }
    public string InternalMessage { get; set; } = "";
    public string PublicMessage { get; set; } = "";

    public static PLBizException BadRequest(string message)
    {
        return new PLBizException(message, (int)PLCodes.BadRequest);
    }

    public static PLBizException NotFound(string message)
    {
        return new PLBizException(message, (int)PLCodes.NotFound);
    }

    public static PLBizException Error(string message)
    {
        return new PLBizException(message);
    }

    public static PLBizException Unauthorized(string message)
    {
        return new PLBizException(message, (int)PLCodes.Unauthorized);
    }

    public static PLBizException New(int code = (int)PLCodes.Error, string publicMessage = "",
        string internalMessage = "")
    {
        return new PLBizException(code, publicMessage, internalMessage);
    }

    public static PLBizException New(PLCodes code = PLCodes.Error, string publicMessage = "",
        string internalMessage = "")
    {
        return new PLBizException((int)code, publicMessage, internalMessage);
    }
}

public enum PLCodes
{
    Ok = 200,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    Error = 500,
    Pending = 600, // 业务处理中
    InvalidArgument = 601
}

public class PLExceptionResult
{
    [JsonPropertyName("code")] public int Code { get; set; }

    [JsonPropertyName("message")] public string Message { get; set; } = "";
}

public class PModifyResult
{
    public Guid Uid { get; set; }
    public int Changes { get; set; }
} 
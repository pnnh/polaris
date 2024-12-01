using System.Buffers.Binary;
using System.Text;
using Base62;
using DaanV2.UUID;
using IdGen;
using SimpleBase;

namespace Molecule.Helpers;

internal class TestTimeSource : ITimeSource
{
    public DateTimeOffset Epoch { get; } = new(2023, 6, 1, 0, 0, 0, TimeSpan.Zero);

    public TimeSpan TickDuration { get; } = TimeSpan.FromMilliseconds(1);

    public long GetTicks()
    {
        return (long)(DateTimeOffset.UtcNow - Epoch).TotalMilliseconds;
    }
}

public class BizIdendity
{
    public BizIdendity(long id)
    {
        Id = id;
    }

    private long Id { get; }

    public long LongValue()
    {
        return Id;
    }

    public string StringValue()
    {
        var bytes = BitConverter.GetBytes(Id);
        if (BitConverter.IsLittleEndian)
            Array.Reverse(bytes);

        var base62Converter = new Base62Converter(Base62Converter.CharacterSet.INVERTED);
        const string invertedCharacterSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numArray = base62Converter.Encode(bytes);
        var stringBuilder = new StringBuilder();
        foreach (var index in numArray)
            stringBuilder.Append(invertedCharacterSet[index]);
        return stringBuilder.ToString().TrimStart('0');
    }

    public override string ToString()
    {
        return StringValue();
    }
}

public class MIDHelper
{
    static MIDHelper()
    {
        var structure = new IdStructure(47, 6, 10);

        var options = new IdGeneratorOptions(structure, new TestTimeSource());

        Generator = new IdGenerator(0, options);
    }

    public static MIDHelper Default { get; } = new();

    public static Base58Encoder Base58 { get; } = new();

    private static IdGenerator Generator { get; }

    public static BizIdendity NewIdendity()
    {
        return new BizIdendity(Generator.CreateId());
    }

    public string LongToBase62(long id)
    {
        return new BizIdendity(id).StringValue();
    }

    public string NewUUIDv7String()
    {
        var uuid = V7.Generate();

        return uuid.ToString();
    }

    public UUID NewUUIDv7()
    {
        return V7.Generate();
    }

    public string LongBase32(long intValue)
    {
        var bytes = new byte[8];
        BinaryPrimitives.WriteInt64BigEndian(bytes, intValue);
        var list = new List<byte>();
        foreach (var b in bytes)
            if (b != 0)
                list.Add(b);

        var base32String = Base32.Rfc4648.Encode(list.ToArray());
        return base32String.ToLower();
    }


    public string GuidBase32(Guid guidValue)
    {
        var bytes = guidValue.ToByteArray();
        var base32String = Base32.Rfc4648.Encode(bytes);

        return base32String.ToLower();
    }

    public Guid Base32Guid(string base32String)
    {
        if (base32String.Length < 1 || base32String.Length > 26) return Guid.Empty;
        base32String = base32String.ToUpper();
        var bytes = new byte[16];

        if (Base32.Rfc4648.TryDecode(base32String, bytes, out var numBytesWritten))
        {
            var list = new List<byte>();
            list.AddRange(bytes.Take(numBytesWritten));
            var itemCount = list.Count;
            for (var i = 0; i < 16 - itemCount; i++) list.Insert(0, 0);
            var value = new Guid(list.ToArray());
            return value;
        }

        return Guid.Empty;
    }


    public bool Base32Long(string base32String, out long longValue)
    {
        var value = Base32Long(base32String);
        if (value != null)
        {
            longValue = value.Value;
            return true;
        }

        longValue = 0;
        return false;
    }

    public long? Base32Long(string base32String)
    {
        if (base32String.Length < 1 || base32String.Length > 16) return null;
        base32String = base32String.ToUpper();
        var bytes = new byte[8];

        if (Base32.Rfc4648.TryDecode(base32String, bytes, out var numBytesWritten))
        {
            var list = new List<byte>();
            list.AddRange(bytes.Take(numBytesWritten));
            var itemCount = list.Count;
            for (var i = 0; i < 8 - itemCount; i++) list.Insert(0, 0);
            var value = BinaryPrimitives.ReadInt64BigEndian(list.ToArray());
            return value;
        }

        return null;
    }


    public long? Base58Long(string base58String)
    {
        if (base58String.Length < 1 || base58String.Length > 16) return null;
        var bytes = new byte[8];

        if (SimpleBase.Base58.Flickr.TryDecode(base58String, bytes, out var numBytesWritten))
        {
            var list = new List<byte>();
            list.AddRange(bytes.Take(numBytesWritten));
            var itemCount = list.Count;
            for (var i = 0; i < 8 - itemCount; i++) list.Insert(0, 0);
            var value = BinaryPrimitives.ReadInt64BigEndian(list.ToArray());
            return value;
        }

        return null;
    }
}

public class Base58Encoder
{
    public string GuidEncode(Guid guidValue)
    {
        var bytes = guidValue.ToByteArray(true);

        var base58String = Base58.Ripple.Encode(bytes);

        return base58String;
    }

    public Guid? GuidDecode(string base36String)
    {
        var bytes = new byte[16];
        if (Base58.Ripple.TryDecode(base36String, bytes, out var numBytesWritten))
        {
            byte[] binaryData = bytes.Take(numBytesWritten).ToArray();
            string strHex = BitConverter.ToString(binaryData);
            if (Guid.TryParse(strHex.Replace("-", ""), out var value))
                return value;
        }

        return null;
    }
}
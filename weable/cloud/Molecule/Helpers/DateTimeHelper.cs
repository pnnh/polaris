using System;
using System.Globalization;

namespace Molecule.Helpers;

public class DateTimeHelper
{
    public static DateTime ParseRfc3339(string rfc3339)
    {
        return DateTime.Parse(rfc3339, null, DateTimeStyles.RoundtripKind);
    }

    public static string ToRfc3339(DateTime dateTime)
    {
        return dateTime.ToString("yyyy-MM-dd'T'HH:mm:ss.fffZ");
    }

    public static string ToRfc3339(DateTimeOffset dateTime)
    {
        return dateTime.ToString("yyyy-MM-dd'T'HH:mm:ss.fffZ");
    }
}
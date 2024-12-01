using System;
using System.ComponentModel;

namespace Molecule.Helpers;

public static class EnumHelper
{
    public static string GetEnumDescription<T>(T value)
    {
        if (value == null)
            return string.Empty;

        var strVal = value.ToString();
        if (strVal == null)
            return string.Empty;

        var fi = value.GetType().GetField(strVal);
        if (fi == null)
            return string.Empty;

        var attributes = (DescriptionAttribute[])fi.GetCustomAttributes(typeof(DescriptionAttribute), false);

        if (attributes.Length > 0)
            return attributes[0].Description;

        return fi.Name;
    }
}
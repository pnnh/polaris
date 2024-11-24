using System;
using Microsoft.AspNetCore.Http;

namespace Molecule.Helpers;

public class FormHelper
{
    private readonly IFormCollection _form;

    public FormHelper(IFormCollection form)
    {
        _form = form;
    }

    public int? GetInt(string name)
    {
        if (_form.TryGetValue(name, out var value)) return Convert.ToInt32(value);

        return null;
    }

    public string? GetString(string name)
    {
        if (_form.TryGetValue(name, out var value)) return value;

        return null;
    }
}
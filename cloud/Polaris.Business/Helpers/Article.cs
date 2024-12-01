
 
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text; 
using Newtonsoft.Json.Linq;
using Markdig;

namespace Polaris.Business.Helpers;

public class TocItem
{
    public string Title = "";
    public int Header = 0;
}
public class ArticleUtils
{

    public static string BuildBody(List<TocItem> tocList, object? node)
    {
        if (node == null)
            return "";
        var token = node as JToken;
        if (token == null)
            return "";
        var children = token["children"] as JArray;
        if (children == null)
            return "";
        var sb = new StringBuilder();
        foreach (JObject item in children)
        {
            var nodeStr = BuildNode(tocList, item);
            sb.Append(nodeStr);
        }

        return sb.ToString();
    }

    static string BuildNode(List<TocItem> tocList, JObject node)
    {
        var nodeName = ((string?)node["name"]);
        if (nodeName == null)
            return "";
        switch (nodeName)
        {
            case "paragraph":
                return BuildParagraph(tocList, node);
            case "header":
                return BuildHeader(tocList, node);
            case "code-block":
                return BuildCodeBlock(node);
        }

        return "";
    }

    static string BuildParagraph(List<TocItem> tocList, JObject node)
    {
        var children = node["children"] as JArray;
        if (children == null)
            return "";

        var sb = new StringBuilder();
        sb.Append("<p>");
        foreach (JObject item in children)
        {
            var nodeStr = BuildText(item);
            sb.Append(nodeStr);
        }
        sb.Append("</p>");

        return sb.ToString();
    }
    static string BuildText(JObject node)
    {
        var text = ((string?)node["text"]);
        if (text == null)
            return "";

        return text;
    }
    static string BuildHeader(List<TocItem> tocList, JObject node)
    {
        var header = ((int?)node["header"]);
        if (header == null)
            return "";

        var children = node["children"] as JArray;
        if (children == null)
            return "";

        var sb = new StringBuilder();
        sb.Append($"<h{header}>");
        var headerTitle = "";
        foreach (JObject item in children)
        {
            var nodeStr = BuildText(item);
            headerTitle += nodeStr;
        }
        tocList.Add(new TocItem
        {
            Title = headerTitle,
            Header = (int)header,
        });
        sb.Append(headerTitle);
        sb.Append($"</h{header}>");

        return sb.ToString();
    }
    static string BuildCodeBlock(JObject node)
    {
        var language = ((string?)node["language"]);
        if (language == null)
            return "";

        var children = node["children"] as JArray;
        if (children == null)
            return "";

        var sb = new StringBuilder();
        sb.Append($"<pre class='code' data-lang='{language}'><code>");
        foreach (JObject item in children)
        {
            var nodeStr = BuildText(item);
            sb.Append(nodeStr);
        }
        sb.Append($"</code></pre>");

        return sb.ToString();
    }

}
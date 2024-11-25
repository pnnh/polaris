#include "router.h"
#include <regex>
#include "galaxy/quantum/types/String.h"
#include "controllers/article.h"
#include "controllers/channel.h"
#include "controllers/index.h"
#include "controllers/sitemap.h"

void routeHandleGet(WFHttpTask* httpTask, const std::string& request_uri)
{
	if (request_uri == "/")
	{
		huable::server::HandleIndex(httpTask);
	}
	else if (request_uri == "/server/sitemap")
	{
		huable::server::HandleSitemap(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/server/articles/get"))
	{
		huable::server::HandleArticleGet(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/server/articles"))
	{
		huable::server::HandleArticles(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/server/channels"))
	{
		huable::server::HandleChannels(httpTask);
	}
	else
	{
		protocol::HttpResponse* response = httpTask->get_resp();
		response->set_status_code("404");
	}
}

void huable::server::route_request(WFHttpTask* httpTask)
{
	protocol::HttpRequest* request = httpTask->get_req();
	std::string request_uri = request->get_request_uri();
	std::string request_method = request->get_method();

	if (request_method == "GET")
	{
		routeHandleGet(httpTask, request_uri);
	}
	else
	{
		protocol::HttpResponse* response = httpTask->get_resp();
		response->set_status_code("404");
	}
}

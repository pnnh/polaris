#include "router.h"
#include <regex>
#include "galaxy/quantum/types/String.h"

#include "controllers/article.h"
#include "controllers/channel.h"
#include "controllers/index.h"
#include "controllers/sitemap.h"
#include "controllers/filesystem/filesystem.h"


void routeHandleGet(WFHttpTask* httpTask, const std::string& request_uri)
{
	if (request_uri == "/")
	{
		polaris::server::HandleIndex(httpTask);
	}
	else if (request_uri == "/server/sitemap")
	{
		polaris::server::HandleSitemap(httpTask);
	}
	else if (request_uri == "/server/articles")
	{
		polaris::server::HandleArticles(httpTask);
	}
	else if (request_uri == "/server/channels")
	{
		polaris::server::HandleChannels(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/server/files"))
	{
		polaris::server::HandleFileList(httpTask);
	}
	else if (request_uri == "/server/articles/get")
	{
		polaris::server::HandleArticleGet(httpTask);
	}
	else
	{
		protocol::HttpResponse* response = httpTask->get_resp();
		response->set_status_code("404");
	}
}

void polaris::server::route_request(WFHttpTask* httpTask)
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

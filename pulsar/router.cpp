#include "router.h"

#include <iostream>
#include <regex>
#include "quantum/types/String.h"

#include "controllers/article.h"
#include "controllers/channel.h"
#include "controllers/index.h"
#include "controllers/sitemap.h"
#include "controllers/filesystem/filesystem.h"


void routeHandleGet(WFHttpTask* httpTask, const std::string& request_uri)
{
	if (quantum::PSString::StartsWith(request_uri, "/sitemap"))
	{
		pulsar::HandleSitemap(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/articles"))
	{
		pulsar::HandleArticles(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/channels"))
	{
		pulsar::HandleChannels(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/files"))
	{
		pulsar::HandleFileList(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/articles/get"))
	{
		pulsar::HandleArticleGet(httpTask);
	}
	else if (quantum::PSString::StartsWith(request_uri, "/"))
	{
		pulsar::HandleIndex(httpTask);
	}
	else
	{
		protocol::HttpResponse* response = httpTask->get_resp();
		response->set_status_code("404");
	}
}

void pulsar::route_request(WFHttpTask* httpTask)
{
	protocol::HttpRequest* request = httpTask->get_req();
	std::string request_uri = request->get_request_uri();
	std::string request_method = request->get_method();

	try
	{
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
	catch (const std::exception& exception)
	{
		std::cerr << "[" << request_method << " " << request_uri << "] server exception: " << exception.what() <<
			std::endl;
		protocol::HttpResponse* response = httpTask->get_resp();
		response->set_status_code("500");
	}
}

#include "router.h"
#include <regex>

void Router::register_route(std::string url_regex, 
		std::string request_method, 
		void (*callback)(WFHttpTask *) )
{
	Route route;
	route.url_regex = url_regex;
	route.request_method = request_method;
	route.callback = callback;
	routes.push_back(route);	
}

void Router::route_request(WFHttpTask *httpTask)
{
    protocol::HttpRequest *request = httpTask->get_req();
    std::string request_uri = request -> get_request_uri();
	std::string request_method = request -> get_method();
	for (auto& r : routes) {
		std::regex pat {r.url_regex};
		std::smatch match;

		if (std::regex_match(request_uri, match, pat) 
				&& (request_method.compare(r.request_method) == 0)) {
			r.callback(httpTask);
			return;
		}
	}
	protocol::HttpResponse *response = httpTask->get_resp();
	response->set_status_code("404");
}
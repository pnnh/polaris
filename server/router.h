#ifndef PL_ROUTE_H
#define PL_ROUTE_H

#include <string>
#include <vector>
#include "workflow/WFTaskFactory.h"

class Router {
	struct Route {
		std::string url_regex;
		std::string request_method;
		void (*callback)(WFHttpTask *);
	};

	std::vector<Route> routes;

	public:
		void register_route(std::string url_regex, 
				std::string request_method, 
				void (*callback)(WFHttpTask *));

		void route_request(WFHttpTask *httpTask);
};
#endif //PL_ROUTE_H
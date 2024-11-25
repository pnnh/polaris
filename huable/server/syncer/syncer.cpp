#include "syncer.h"

#include <build.h>
#include <iostream>
#include <chrono>
#include <thread>
#include <galaxy/quantum/services/database/SqliteService.h>
#include <galaxy/quantum/services/filesystem/filesystem.h>
#include <galaxy/quantum/services/logger/logger.h>
#include <huable/starlight/business/articles/channel.h>

void initDatabase()
{
    auto database_path = quantum::JoinFilePath({PROJECT_BINARY_DIR, "polaris.sqlite"});
    auto sqliteService = quantum::SqliteService(database_path);

    std::string initChannelsSqlText = R"sql(
        CREATE TABLE IF NOT EXISTS channels
        (
            urn TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            image TEXT
        );
)sql";

    std::string initArticlesSqlText = R"sql(
        CREATE TABLE IF NOT EXISTS articles
        (
            urn TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            header TEXT,
            body TEXT,
            create_time TEXT,
            update_time TEXT,
            creator TEXT,
            keywords TEXT,
            description TEXT,
            cover TEXT DEFAULT '',
            discover INTEGER DEFAULT 0,
            owner TEXT,
            channel TEXT,
            partition TEXT,
            path TEXT
        );
)sql";

    auto initSqlList = std::vector{initChannelsSqlText, initArticlesSqlText};
    sqliteService.runSqlBatch(initSqlList);
}

void syncChannel()
{
    const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "huable", "tests", "data"});
    auto channelServer = std::make_shared<huable::starlight::ChannelServerBusiness>(baseUrl);
    auto channelsPtr = channelServer->selectChannels();

    auto insertSqlText = R"sql(
    INSERT INTO channels (urn, name, description, image)
            VALUES ($urn, $name, $description, $image)
            ON CONFLICT(urn) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                image = excluded.image
            WHERE channels.urn = excluded.urn;
)sql";

    auto database_path = quantum::JoinFilePath({PROJECT_BINARY_DIR, "polaris.sqlite"});
    auto sqliteService = quantum::SqliteService(database_path);

    auto sqlCommand = sqliteService.createCommand(insertSqlText);


    for (const auto& model : *channelsPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Name, model.Title});

        sqlCommand->BindString("$urn", model.URN);
        sqlCommand->BindString("$name", model.Name);
        sqlCommand->BindString("$description", model.Description);
        sqlCommand->BindString("$image", model.Image);
        sqlCommand->Run();
        sqlCommand->Reset();
    }
}

void huable::server::runSync()
{
    initDatabase();
    while (true)
    {
        std::cout << "runSync" << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(5000));
        syncChannel();
    }
}

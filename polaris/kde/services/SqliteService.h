#pragma once

#include <QSqlDatabase>
#include <QString>
#include <QVariant>
#include <map>

namespace services
{
	class SqlIterator
	{
	public:
		explicit SqlIterator(std::unique_ptr<QSqlQuery> query);
		[[nodiscard]] bool next() const;
		[[nodiscard]] QVariant value(int index) const;
		[[nodiscard]] QVariant value(const QString& name) const;
		[[nodiscard]] int column_count() const;
		[[nodiscard]] QString column_name(int index) const;

	private:
		std::unique_ptr<QSqlQuery> sqlQueryPtr;
	};

	class SqliteService
	{
	public:
		explicit SqliteService() = default;

		[[nodiscard]] static QString sql_version(const QString &dbPath);
		[[nodiscard]] static std::shared_ptr<SqlIterator> execute_query(
		  const QString& dbPath, const QString& sql_text,
		  const QMap<QString, QVariant> &parameters = QMap<QString, QVariant>());
	};
}

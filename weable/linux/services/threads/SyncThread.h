#pragma once

#include <qthread.h>


class SyncThread : public QThread
{
  Q_OBJECT

public:
  explicit SyncThread();
  ~SyncThread() override;

  void run() override;

signals:
  void resultReady(const QString& result);

private:
  bool closed = false;
};

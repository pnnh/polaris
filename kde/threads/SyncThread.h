//
// Created by Larry on 2024/5/8.
//

#ifndef SYNCTHREAD_H
#define SYNCTHREAD_H

#include <qthread.h>


class SyncThread : public QThread {
  Q_OBJECT

public:
  explicit SyncThread();
  ~SyncThread() override;

  void run() override;

signals:
  void resultReady(const QString &result);

private:
  bool closed = false;
};



#endif //SYNCTHREAD_H

import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import quick
import an.qt.CModel 1.0

ListView {
    id: listView
    signal itemPressed(var pk)
    topMargin: 16
    spacing: 4
    clip: true
    orientation: ListView.Vertical
    delegate: Rectangle {
        id: wrapper
        anchors.left: parent.left
        anchors.right: parent.right
        height: 32
        color: wrapper.ListView.isCurrentItem ? "#EDF3FF" : "#FFF"
        RowLayout {
            anchors.fill: parent
            spacing: 2

            CheckBox {
                Layout.preferredWidth: 15
            }
            TextField {
                Layout.alignment: Qt.AlignVCenter
                Layout.fillWidth: true
                verticalAlignment: Text.AlignVCenter
                horizontalAlignment: Text.AlignHLeft
                text: name
                selectByMouse: true
                background: Item {
                    opacity: 0
                }
                onAccepted: {
                    console.log("accepted", text)
                }
                onEditingFinished: {
                    console.log("onEditingFinished", text)
                    listView.model.update(index, {
                                              "name": text
                                          })
                }

                onPressed: {
                    wrapper.ListView.view.currentIndex = index
                    let item = listView.model.get(index)
                    console.log("item", item.pk, item.title)
                    listView.itemPressed(item.pk)
                }
            }
                MyType{
                    answer: 43
                }
        }
    }
    boundsBehavior: Flickable.StopAtBounds
    model: VideoListModel {
        source: "videos.xml"
    }
    ScrollBar.vertical: ScrollBar {
        visible: active
        background: Item {
            opacity: 0
        }
    }
}

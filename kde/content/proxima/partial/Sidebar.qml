import QtQml
import QtQuick
import QtQuick.Layouts
import QtQuick.Window
import QtQml.Models
import QtQuick.Shapes 1.4
import quick

Rectangle {
    id: sidebar
    Layout.fillHeight: true
    Layout.preferredWidth: 256
    color: "#f1f1f3"
    border.width: 0

    property string clickKey: ""

    ColumnLayout {
        spacing: 8
        anchors.fill: parent

        Rectangle {
            color: "transparent"
            Layout.preferredHeight: 12
            Layout.fillWidth: true
            Layout.alignment: Qt.AlignLeft | Qt.AlignTop
        }

        ListView {
            id: folderView
            Layout.preferredHeight: 160 // todo 不该写死
            Layout.fillWidth: true
            highlightFollowsCurrentItem: false

            model: FolderListModel {
                source: "xxxxdata"
            }

            delegate: Rectangle {
                id: folderItem
                width: parent.width
                height: 32
                color: sidebar.clickKey === "folder_" + index ? "#d3d3d3" : "transparent"

                RowLayout {
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16
                    anchors.fill: parent
                    spacing: 8
                    Image {
                        height: 16
                        width: 16
                        source: icon
                        Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                    }
                    Text {
                        text: title
                        font.pixelSize: 14
                        Layout.fillWidth: true
                        Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                    }
                    Text {
                        text: count
                        font.pixelSize: 14
                        Layout.preferredWidth: 32
                        horizontalAlignment: Text.AlignRight
                        Layout.alignment: Qt.AlignVCenter | Qt.RightToLeft
                    }
                }
                property double dragLineStartY: 0
                property double dragLineEndX: 0
                property double dragLineEndY: 0

                Shape {
                    anchors.fill: parent
                    ShapePath {
                        fillColor: "transparent"
                        strokeWidth: 0
                        strokeColor: "black"
                        strokeStyle: ShapePath.SolidLine
                        startX: 0
                        startY: dragLineStartY
                        PathLine {
                            x: dragLineEndX
                            y: dragLineEndY
                        }
                    }
                }
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        console.debug("path: ", path, "height: ", parent.height)
                        sidebar.clickKey = "folder_" + index
                        //grid.model.source = "/Users/linyangz/temp/images"
                        grid.model.source = path
                    }
                }
                DropArea {
                    anchors.fill: parent
                    onPositionChanged: drag => {
                                           console.debug("draging x: ", drag.x,
                                                         "y: ", drag.y,
                                                         parent.height / 5,
                                                         parent.height / 5 * 4)
                                           if (drag.y <= parent.height / 5) {
                                               console.debug(
                                                   "draging x: drag.y <= parent.height / 5")
                                               folderItem.dragLineStartY = 0
                                               folderItem.dragLineEndX = parent.width
                                               folderItem.dragLineEndY = 0
                                           } else if (drag.y >= parent.height / 5 * 4) {
                                               console.debug(
                                                   "draging x: drag.y >= parent.height / 5 * 4")
                                               folderItem.dragLineStartY = parent.height
                                               folderItem.dragLineEndX = parent.width
                                               folderItem.dragLineEndY = parent.height
                                           } else
                                           folderItem.dragLineEndX = 0
                                       }
                    onExited: {
                        folderItem.dragLineEndX = 0
                    }

                    onDropped: drop => {
                                   folderItem.dragLineEndX = 0
                                   if (drop.hasUrls) {
                                       for (var i = 0; i < drop.urls.length; i++) {
                                           console.log("drop1", index,
                                                       drop.urls.length,
                                                       drop.urls[i])
                                       }
                                       var insertIndex = -1
                                       if (drag.y <= parent.height / 5) {
                                           insertIndex = index
                                       } else if (drag.y >= parent.height / 5 * 4) {
                                           insertIndex = index + 1
                                       }
                                       if (insertIndex >= 0) {
                                           folderView.model.add({
                                                                    "index": insertIndex,
                                                                    "path": drop.urls[0]
                                                                })
                                       }
                                   }
                               }
                }
            }
        }

        Rectangle {
            Layout.fillHeight: true
        }
    }
}

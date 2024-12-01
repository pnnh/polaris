import QtQuick 6.7
import QtQuick.Controls 6.7
import QtQuick.Layouts 6.7
import quick 1.0

Rectangle {
    anchors.fill: parent

    signal picturePathChanged(string path)

    Rectangle {
        id: favoritesArea
        width: parent.width
        height: 200

        Rectangle {
            height: 32
            width: parent.width

            Row {
                height: parent.height
                Rectangle {
                    width: 8
                    height: parent.height
                }

                Text {
                    text: "收藏"
                    color: "gray"
                }
            }
        }
        Text {
            text: "收藏区域"
            anchors.centerIn: parent
        }
    }

    Rectangle {
        width: parent.width
        height: parent.height - favoritesArea.height
        anchors.top: favoritesArea.bottom

        Rectangle {
            height: 32
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right

            Row {
                height: parent.height
                Rectangle {
                    width: 8
                    height: parent.height
                }

                Text {
                    text: "位置"
                    color: "gray"
                }
            }
        }

        ListView {
            id: locationListView
            width: parent.width
            height: parent.height - 32
            y: 32
            boundsBehavior: Flickable.StopAtBounds
            model: PictureLocationViewModel {}

            ScrollBar.vertical: ScrollBar {
                policy: ScrollBar.AsNeeded
                background: Rectangle {
                    color: "#fafafa"
                    radius: 4
                }

                snapMode: ScrollBar.SnapAlways
            }

            delegate: Rectangle {
                width: 240
                height: 40
                color: "#ffffff"

                MouseArea {
                    anchors.fill: parent
                    hoverEnabled: true
                    onEntered: parent.color = "#e0e0e0"
                    onExited: parent.color = "#ffffff"
                    onClicked: {
                        picturePathChanged(path)
                    }
                }

                Rectangle {
                    width: parent.width
                    height: parent.height
                    anchors.centerIn: parent
                    color: "transparent"
                    RowLayout {
                        height: parent.height

                        Rectangle {
                            width: level * 16
                            height: 24
                            color: "transparent"
                        }

                        Rectangle {
                            Layout.alignment: Qt.AlignLeft | Qt.AlignCenter
                            width: 24
                            height: 24
                            color: "transparent"

                            property bool isExpand: false

                            MouseArea {
                                anchors.fill: parent
                                hoverEnabled: true

                                onClicked: {
                                    console.log('展开目录', index)
                                    if (parent.isExpand) {
                                        locationListView.model.close(index)
                                        parent.isExpand = false
                                    } else {
                                        locationListView.model.open(index)
                                        parent.isExpand = true
                                    }

                                }
                            }

                            Image {
                                anchors.centerIn: parent
                                width: 20
                                height: 20
                                visible: hasChildDirectory
                                source: "qrc:/qt/qml/quick/content/assets/material/symbols/chevron_right_24dp_FILL.svg"
                                rotation: parent.isExpand ? 90 : 0
                            }
                        }

                        Text {
                            Layout.alignment: Qt.AlignLeft | Qt.AlignCenter
                            text: title
                        }
                    }
                }
            }
        }

    }
}

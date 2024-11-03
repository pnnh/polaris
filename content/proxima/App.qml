import QtQuick
import QtQuick.Window
import QtQuick.Layouts
import "partial"
import quick

Rectangle {
    width: 1392
    height: 954
    color: "#ffffff"
    border.color: "#ffffff"

    Topbar {
        id: topBar
    }
    Rectangle {
        anchors.top: topBar.bottom
        width: parent.width
        height: parent.height - 40
        RowLayout {
            anchors.fill: parent
            spacing: 0
            Sidebar {}
            Rectangle {
                Layout.fillWidth: true
                Layout.fillHeight: true

                GridView {
                    id: grid
                    anchors.fill: parent
                    anchors.margins: 8
                    cellWidth: grid.width / grid.columns
                    cellHeight: cellWidth
                    //model: Model {}
                    model: PictureGridModel {
                        source: "/Users/linyangz/Projects/github/emotion-desktop/data"
                    }
                    delegate: Cell {}
                    boundsBehavior: Flickable.StopAtBounds
                    clip: true // 超出边界的进行裁剪，即不显示，默认为false

                    property int columns: 10
                    property string selectKey: ""

                    onMovementStarted: {
                        quickView.visible = false
                    }
                }

                Rectangle {
                    id: quickView
                    visible: false
                    width: 320
                    height: 320
                    x: 16
                    y: 128
                    //color: "#EEEEEE"
                    border.width: 1
                    border.color: "#E2E2E2"
                    radius: 6

                    ColumnLayout {
                        anchors.fill: parent
                        anchors.leftMargin: 8
                        anchors.rightMargin: 8
                        anchors.bottomMargin: 8
                        //anchors.margins: 8
                        spacing: 4
                        Image {
                            id: quickViewImage
                            //Layout.fillHeight: true
                            Layout.preferredWidth: 192
                            Layout.preferredHeight: 192
                            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
                            source: "file:data/1.png"
                        }

                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 32
                            Text {
                                anchors.fill: parent
                                text: "别问这些乱七八糟的，我是来玩游戏的，不是来学数学的"
                                font.pixelSize: 12
                                color: "#BDBDBD"
                            }
                        }
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 16
                            RowLayout {
                                anchors.fill: parent
                                spacing: 8
                                Image {
                                    height: 16
                                    width: 16
                                    source: "qrc:/desktop/assets/images/icons/shoucang.svg"
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Text {
                                    text: "收藏"
                                    font.pixelSize: 12
                                    Layout.fillWidth: true
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Image {
                                    height: 16
                                    width: 16
                                    source: "qrc:/desktop/assets/images/icons/hao.svg"
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Text {
                                    text: "赞"
                                    font.pixelSize: 12
                                    Layout.fillWidth: true
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Image {
                                    height: 16
                                    width: 16
                                    source: "qrc:/desktop/assets/images/icons/cha.svg"
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Text {
                                    text: "踩"
                                    font.pixelSize: 12
                                    Layout.fillWidth: true
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Rectangle {
                                    Layout.fillWidth: true
                                }

                                Image {
                                    height: 16
                                    width: 16
                                    source: "qrc:/desktop/assets/images/icons/trash_fill.svg"
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Text {
                                    text: "删除"
                                    font.pixelSize: 12
                                    Layout.fillWidth: true
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Image {
                                    height: 16
                                    width: 16
                                    source: "qrc:/desktop/assets/images/icons/close_fill.svg"
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                                Text {
                                    text: "关闭"
                                    font.pixelSize: 12
                                    Layout.fillWidth: true
                                    Layout.alignment: Qt.AlignVCenter | Qt.LeftToRight
                                }
                            }
                        }
                    }
                    MouseArea {
                        anchors.fill: parent
                        hoverEnabled: true
                        onEntered: {
                            console.debug("quickView entered")
                        }
                    }
                }
            }
        }
    }
    function windowResize() {
        quickView.visible = false
        console.debug("windowResize", grid.width, grid.width / 112)
        grid.columns = Math.ceil(grid.width / 112)
    }
}

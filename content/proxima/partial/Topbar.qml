import QtQuick
import QtQuick.Window
import QtQuick.Layouts

Rectangle {
    id: topBar
    width: parent.width
    height: 40
    color: "#f3f3f3"
    border.color: "#ffffff"
    border.width: 0
    RowLayout {
        anchors.fill: parent
        spacing: 8
        anchors.leftMargin: 16
        anchors.rightMargin: 16
        Rectangle {
            Layout.preferredWidth: 12
            Layout.preferredHeight: 12
            color: "#FF5F57"
            radius: width * 0.5
            Layout.alignment: Qt.AlignVCenter
            Layout.fillWidth: false
            MouseArea {
                anchors.fill: parent
                onClicked: {
                    Qt.quit()
                }
            }
        }
        Rectangle {
            Layout.preferredWidth: 12
            Layout.preferredHeight: 12
            color: "#FEBC2D"
            radius: width * 0.5
            Layout.alignment: Qt.AlignVCenter
            Layout.fillWidth: false

            MouseArea {
                anchors.fill: parent
                onClicked: {
                    mainWindow.visibility = Window.Minimized
                }
            }
        }
        // 不太需要最大化功能
        Rectangle {
            Layout.preferredWidth: 12
            Layout.preferredHeight: 12
            color: "#2AC740"
            radius: width * 0.5
            Layout.alignment: Qt.AlignVCenter
            Layout.fillWidth: false
            MouseArea {
                anchors.fill: parent
                onClicked: {
                    mainWindow.visibility = mainWindow.visibility
                            === Window.FullScreen ? Window.Windowed : Window.FullScreen
                }
            }
        }
        Rectangle {
            color: "#f3f3f3"
            border.color: "#ffffff"
            border.width: 0
            Layout.fillWidth: true
            Layout.fillHeight: true
            Text {
                anchors.centerIn: parent
                text: "筑梦表情"
            }
        }
        Rectangle {
            color: "#F7F1F8"
            border.width: 1
            border.color: "#D6D6D6"
            radius: 2
            Layout.preferredHeight: 20
            Layout.preferredWidth: 200
            Layout.fillWidth: false
            Layout.alignment: Qt.AlignVCenter
            RowLayout {
                anchors.fill: parent
                Image {
                    height: 16
                    width: 16
                    source: "qrc:/desktop/assets/images/icons/search.svg"
                    Layout.alignment: Qt.AlignVCenter
                    Layout.leftMargin: 8
                }
                Text {
                    text: "搜索表情"
                    color: "#BABABA"
                    Layout.alignment: Qt.AlignVCenter
                }
                Rectangle {
                    Layout.fillWidth: true
                }
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        propagateComposedEvents: true
        property point clickPos

        onPressed: (mouse) => {
            clickPos  = Qt.point(mouse.x,mouse.y)
        }

        onPositionChanged: (mouse) => {
            var delta = Qt.point(mouse.x-clickPos.x, mouse.y-clickPos.y)
            mainWindow.x += delta.x;
            mainWindow.y += delta.y;
        }
    }
}

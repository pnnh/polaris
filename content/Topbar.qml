import QtQuick
import QtQuick.Window
import QtQuick.Layouts

Rectangle {
    id: topBar
    Layout.preferredWidth: parent.width
    height: 40
    color: "transparent"

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

        Rectangle {
            color: "transparent"
            border.width: 0
            Layout.fillWidth: true
            Layout.fillHeight: true
            Text {
                anchors.centerIn: parent
                text: "北极星笔记"
            }
        }
    }

}

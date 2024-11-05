import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3
import quick 1.0

Rectangle {
    anchors.fill: parent

    ListView {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: parent.height
        boundsBehavior: Flickable.StopAtBounds
        model: SAChannelViewModel {}
        delegate: Rectangle {
            width: 240
            height: 40
            color: "#ffffff"

            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                onEntered: parent.color = "#e0e0e0"
                onExited: parent.color = "#ffffff"
            }

            Rectangle {
                width: parent.width - 16
                height: parent.height
                anchors.centerIn: parent
                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: title
                }
            }
        }
    }
}

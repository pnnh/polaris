import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3

Rectangle {
    Layout.preferredHeight: parent.height
    Layout.preferredWidth: parent.width - 48
    color:"green"

    RowLayout {
        height: parent.height
        width: parent.width
        spacing: 0

        Rectangle {
            width: 240
            visible: showSidebar
            Layout.preferredHeight: parent.height
            color: "transparent"

            Sidebar {}
        }
        Rectangle {
            Layout.alignment: Qt.AlignLeft
            Layout.preferredHeight: parent.height
            width: 1
            color: "#e2e2e2"
            visible: showSidebar
        }
        Rectangle {
            Layout.fillWidth: true
            Layout.fillHeight: true
            color: "#FFFFFF"

            RowLayout {
                height: parent.height
                width: parent.width
                spacing: 0

                Rectangle {
                    Layout.fillHeight: true
                    Layout.preferredWidth: parent.width / 2 - 0.5
                    color: "#FFFFFF"
                    Text {
                        text: qsTr("图片库主页")
                        color: "green"
                        anchors.centerIn: parent
                    }
                }
                Rectangle {
                    Layout.preferredHeight: parent.height
                    Layout.preferredWidth: 1
                    color: "#e2e2e2"
                }

            }
        }
    }
}

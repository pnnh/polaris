import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3
import QtQuick.Effects

Rectangle {
    Layout.preferredHeight: parent.height
    Layout.preferredWidth: parent.width - 48
    color: "green"

    RowLayout {
        height: parent.height
        width: parent.width
        spacing: 0

        Rectangle {
            width: 240
            Layout.preferredHeight: parent.height
            Layout.alignment: Qt.AlignTop | Qt.AlignLeading
            color: "blue"

            ChannelList {}
        }
        Rectangle {
            Layout.alignment: Qt.AlignLeft
            Layout.preferredHeight: parent.height
            width: 1
            color: "#e2e2e2"
        }
        Rectangle {
            width: 240
            Layout.preferredHeight: parent.height
            Layout.alignment: Qt.AlignTop | Qt.AlignLeading
            color: "blue"

            SessionList {}
        }
        Rectangle {
            Layout.alignment: Qt.AlignLeft
            Layout.preferredHeight: parent.height
            width: 1
            color: "#e2e2e2"
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




                    Image {
                            id: sourceItem
                            visible: false
                            width: 320
                            height: 320
                            anchors.centerIn: parent
                            source: "qrc:/qt/qml/quick/content/assets/photos/photo1.webp"
                        }

                        MultiEffect {
                            source: sourceItem
                            anchors.fill: sourceItem
                            maskEnabled: true
                            maskSource: mask
                        }

                        Item {
                            id: mask
                            width: sourceItem.width
                            height: sourceItem.height
                            layer.enabled: true
                            visible: false

                            Rectangle {
                                width: sourceItem.width
                                height: sourceItem.height
                                radius: 16
                                color: "black"
                            }
                        }


                }
            }
        }
    }
}

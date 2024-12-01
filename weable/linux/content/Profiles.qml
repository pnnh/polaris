import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3

Rectangle {
    color: "#FFFFFF"
    height: 76
    width: 36
    Layout.topMargin: 16
    Layout.alignment: Qt.AlignVTop | Qt.AlignHCenter
    radius: 16

    property string currentItem: "polaris"

    signal profileNameChanged(string name)


    ColumnLayout {
        width: parent.width
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        spacing: 4


        Rectangle {
            Layout.topMargin: 4
            Layout.alignment: Qt.AlignTop | Qt.AlignCenter
            width: 32
            height: 32
            color: currentItem === "polaris" ? "#eee" : "transparent"
            border.width: 1
            border.color: "#eee"
            radius: width/2

            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                // onEntered: parent.color = "#EEE"
                // onExited: {if (currentItem !== "polaris") parent.color = "transparent"}
                onClicked: {
                    currentItem = "polaris"
                    profileNameChanged(currentItem)
                }
            }


            Image {
                anchors.centerIn: parent
                width: 20
                height: 20
                source: "qrc:/qt/qml/quick/content/assets/material/symbols/web/book_2/book_2_48px.svg"

            }
        }

        Rectangle {
            Layout.alignment: Qt.AlignTop | Qt.AlignCenter
            width: 32
            height: 32
            color: currentItem === "venus" ? "#eee" : "transparent"
            border.width: 1
            border.color: "#eee"
            radius: width/2

            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                // onEntered: parent.color = "#EEE"
                // onExited: {if (currentItem !== "venus") parent.color = "transparent"}
                onClicked: {
                    currentItem = "venus"
                    profileNameChanged(currentItem)
                }
            }


            Image {
                anchors.centerIn: parent
                width: 20
                height: 20
                source: "qrc:/qt/qml/quick/content/assets/material/symbols/web/imagesmode/imagesmode_48px.svg"
            }
        }

    }
}

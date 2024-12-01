import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3

Rectangle {
    Layout.topMargin: 16
    Layout.alignment: Qt.AlignTop | Qt.AlignCenter
    Layout.preferredHeight: 100
    Layout.preferredWidth: parent.width
    color: "transparent"

    signal pageChanged(string page)

    ColumnLayout {
        width: parent.width
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        spacing: 16

        Rectangle {
            width: 20
            height: 20
            color: "transparent"
            Layout.alignment: Qt.AlignTop | Qt.AlignCenter
            Image {
                anchors.fill: parent
                source: "qrc:/qt/qml/quick/content/assets/material/symbols/web/library_books/library_books_48px.svg"
                MouseArea {
                    anchors.fill: parent
                    onClicked: () => pageChanged('/polaris/library')
                }
            }
        }
    }
}

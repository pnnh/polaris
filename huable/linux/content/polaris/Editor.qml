import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3
import quick 1.0

Rectangle {
    Layout.fillHeight: true
    Layout.preferredWidth: parent.width / 2 - 0.5
    color: "#FFFFFF"

    property string markdown: "暂无内容"

    ColumnLayout {
        height: parent.height
        width: parent.width
        spacing: 0

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: parent.height / 2
            color: "#FFFFFF"

            TextArea {
                color: "green"
                width: parent.width - 32
                height: parent.height - 32
                anchors.centerIn: parent
                // background: Rectangle {
                //     color: "#FFFFFF"
                // }
                placeholderText: qsTr("输入Markdown内容")

                onTextChanged: () => {
                                   console.log('text change', this.text)
                                   markdown = this.text ? markdownModel.markdownToHtml(
                                                              this.text) : ""
                               }
            }
        }

        Rectangle {
            Layout.preferredHeight: 1
            Layout.preferredWidth: parent.width
            color: "#e2e2e2"
        }

        MarkdownModel {
            id: markdownModel
            Component.onCompleted: console.log("MarkdownModel completed")
        }

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: parent.height / 2
            color: "#FFFFFF"

            Text {
                textFormat: Text.RichText
                text: markdown ? markdown : "暂无内容"
                color: "green"
                width: parent.width - 32
                height: parent.height - 32
                anchors.centerIn: parent
            }
        }
    }
}

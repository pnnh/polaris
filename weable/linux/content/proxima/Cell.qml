import QtQuick
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

Rectangle {
    id: cell
    height: grid.cellHeight
    width: grid.cellWidth

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 8
        spacing: 4

        Rectangle {
            Layout.alignment: Qt.AlignTop | Qt.AlignHCenter
            Layout.preferredHeight: grid.cellHeight - 32
            Layout.preferredWidth: grid.cellWidth - 32
            color: grid.selectKey === model.picSrc ? "#0073E0" : "#D7D7D7"
            radius: 4

            Rectangle {
                id: imgFrame
                anchors.fill: parent
                anchors.margins: grid.selectKey === model.picSrc ? 2 : 1
                color: "#FFFFFF"
                layer.enabled: true
                radius: 4

                layer.effect: OpacityMask {
                    maskSource: Rectangle {
                        height: imgFrame.height
                        radius: imgFrame.radius
                        width: imgFrame.width
                    }
                }

                Image {
                    anchors.fill: parent
                    anchors.horizontalCenter: parent.horizontalCenter
                    anchors.verticalCenter: parent.verticalCenter
                    source: picSrc
                }
            }
        }
        Text {
            Layout.alignment: Qt.AlignHCenter
            color: "#5E5E5E"
            text: "文件名.txt"
        }
    }
    MouseArea {
        anchors.fill: parent
        hoverEnabled: true

        onClicked: {
            grid.selectKey = model.picSrc;
        }
    }
}

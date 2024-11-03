import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ColumnLayout {
    id: colNav
    property string activeRow: ""
    Layout.minimumHeight: 100
    Layout.maximumWidth: 100
    Layout.fillHeight: true
    Layout.leftMargin: 8
    Layout.rightMargin: 8
    Layout.topMargin: 8
    Layout.bottomMargin: 8
    RowLayout {
        Layout.minimumHeight: 32
        Layout.maximumHeight: 32
        Layout.fillWidth: true
        Layout.minimumWidth: parent.width
        Layout.maximumWidth: parent.width

        Button {
            Layout.fillWidth: true
            Layout.minimumWidth: parent.width
            Layout.fillHeight: true
            Layout.alignment: Qt.AlignVCenter
            contentItem: Text {
                verticalAlignment: Text.AlignVCenter
                text: "所有"
            }
            onClicked: colNav.activeRow = 'all'
            background: Rectangle {
                color: parent.hovered
                       || (colNav.activeRow === 'all') ? "#EDF3FF" : "#FFF"
            }
        }
    }
    RowLayout {
        Layout.minimumHeight: 32
        Layout.maximumHeight: 32
        Layout.fillWidth: true
        Layout.minimumWidth: parent.width
        Layout.maximumWidth: parent.width
        Button {
            Layout.fillWidth: true
            Layout.minimumWidth: parent.width
            Layout.fillHeight: true
            Layout.alignment: Qt.AlignVCenter
            contentItem: Text {
                verticalAlignment: Text.AlignVCenter
                text: "今天"
            }
            onClicked: colNav.activeRow = 'today'
            background: Rectangle {
                color: parent.hovered
                       || (colNav.activeRow === 'today') ? "#EDF3FF" : "#FFF"
            }
        }
    }
    RowLayout {
        Layout.minimumHeight: 32
        Layout.maximumHeight: 32
        Layout.fillWidth: true
        Layout.minimumWidth: parent.width
        Layout.maximumWidth: parent.width
        Button {
            Layout.fillWidth: true
            Layout.minimumWidth: parent.width
            Layout.fillHeight: true
            Layout.alignment: Qt.AlignVCenter
            contentItem: Text {
                verticalAlignment: Text.AlignVCenter
                text: "明天"
            }
            onClicked: colNav.activeRow = 'tomorrow'
            background: Rectangle {
                color: parent.hovered
                       || (colNav.activeRow === 'tomorrow') ? "#EDF3FF" : "#FFF"
            }
        }
    }
    RowLayout {
        Layout.minimumHeight: 32
        Layout.maximumHeight: 32
        Layout.fillWidth: true
        Layout.minimumWidth: parent.width
        Layout.maximumWidth: parent.width
        Button {
            Layout.fillWidth: true
            Layout.minimumWidth: parent.width
            Layout.fillHeight: true
            Layout.alignment: Qt.AlignVCenter
            contentItem: Text {
                verticalAlignment: Text.AlignVCenter
                text: "最近七天"
            }
            onClicked: colNav.activeRow = 'next7days'
            background: Rectangle {
                color: parent.hovered
                       || (colNav.activeRow === 'next7days') ? "#EDF3FF" : "#FFF"
            }
        }
    }
    RowLayout {
        Layout.minimumHeight: 32
        Layout.maximumHeight: 32
        Layout.fillWidth: true
        Layout.minimumWidth: parent.width
        Layout.maximumWidth: parent.width
        Button {
            Layout.fillWidth: true
            Layout.minimumWidth: parent.width
            Layout.fillHeight: true
            Layout.alignment: Qt.AlignVCenter
            contentItem: Text {
                verticalAlignment: Text.AlignVCenter
                text: "收集箱"
            }
            onClicked: colNav.activeRow = 'inbox'
            background: Rectangle {
                color: parent.hovered
                       || (colNav.activeRow === 'inbox') ? "#EDF3FF" : "#FFF"
            }
        }
    }

    Item {
        Layout.fillHeight: true
    }
    RowLayout {
        Layout.minimumHeight: 32
        Layout.maximumHeight: 32
        Layout.fillWidth: true
        Layout.minimumWidth: parent.width
        Layout.maximumWidth: parent.width

        Button {
            Layout.fillWidth: true
            Layout.minimumWidth: parent.width
            Layout.fillHeight: true
            Layout.alignment: Qt.AlignVCenter
            contentItem: Text {
                verticalAlignment: Text.AlignVCenter
                text: "已完成"
            }
            onClicked: colNav.activeRow = 'complete'
            background: Rectangle {
                color: parent.hovered
                       || (colNav.activeRow === 'complete') ? "#EDF3FF" : "#FFF"
            }
        }
    }
    RowLayout {
        Layout.minimumHeight: 32
        Layout.maximumHeight: 32
        Layout.fillWidth: true
        Layout.minimumWidth: parent.width
        Layout.maximumWidth: parent.width
        Button {
            Layout.fillWidth: true
            Layout.minimumWidth: parent.width
            Layout.fillHeight: true
            Layout.alignment: Qt.AlignVCenter
            contentItem: Text {
                verticalAlignment: Text.AlignVCenter
                text: "已放弃"
            }
            onClicked: colNav.activeRow = 'droped'
            background: Rectangle {
                color: parent.hovered
                       || (colNav.activeRow === 'droped') ? "#EDF3FF" : "#FFF"
            }
        }
    }
    RowLayout {
        Layout.minimumHeight: 32
        Layout.maximumHeight: 32
        Layout.fillWidth: true
        Layout.minimumWidth: parent.width
        Layout.maximumWidth: parent.width
        Button {
            Layout.fillWidth: true
            Layout.minimumWidth: parent.width
            Layout.fillHeight: true
            Layout.alignment: Qt.AlignVCenter
            contentItem: Text {
                verticalAlignment: Text.AlignVCenter
                text: "垃圾箱"
            }
            onClicked: colNav.activeRow = 'trash'
            background: Rectangle {
                color: parent.hovered
                       || (colNav.activeRow === 'trash') ? "#EDF3FF" : "#FFF"
            }
        }
    }
}

/*##^##
Designer {
    D{i:0;autoSize:true;formeditorZoom:0.9;height:480;width:640}D{i:2}D{i:1}D{i:6}D{i:5}
D{i:10}D{i:9}D{i:14}D{i:13}D{i:18}D{i:17}D{i:21}D{i:23}D{i:22}D{i:27}D{i:26}D{i:31}
D{i:30}
}
##^##*/

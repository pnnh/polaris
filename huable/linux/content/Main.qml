import QtQuick
import QtQuick.Window

Window {
    id: mainWindow
    objectName: "mainWindow"

    function sayHello() {//console.log("hello from mainWindow")
    }

    title: "Emotion Design"
    visible: true
    width: 1280
    height: 800
    minimumWidth: 1024
    minimumHeight: 720
    maximumWidth: 4096
    maximumHeight: 4096

    Component.onCompleted: {
        setX(Screen.width / 2 - width / 2)
        setY(Screen.height / 2 - height / 2)
        x = Screen.width / 2 - width / 2
        y = Screen.height / 2 - height / 2
    }

    App {
        id: app

        anchors.fill: parent
    }
}

import QtQuick 2.0

Rectangle {
    id: scrollBar
    opacity: 0

    property ListView target : ListView{}

    width: 15
    height: target.height
    anchors.right: parent.right
    color: "#ccbfbf"
    radius: 10
    clip: true

    Rectangle {
        id: button
        x: 0
        y: target.visibleArea.yPosition * scrollBar.height
        width: 15
        height: target.visibleArea.heightRatio * scrollBar.height
        color: "#6D665C"
        radius: 10
        Text{
            text:"☰"
            anchors.centerIn: parent
        }

        MouseArea {
            id: mouseArea
            anchors.fill: button
            hoverEnabled: true
            drag.target: button;
            drag.axis: Drag.YAxis
            drag.minimumY: 0
            drag.maximumY: scrollBar.height - button.height
            onEntered: {
                if(!mouseArea.pressed)
                fadeIn.start()
            }
            onExited: {
                if(!mouseArea.pressed)
                fadeOut.start()
            }
            onPressed: {
                button.color = Qt.darker("#6D665C")
            }
            onReleased: {
                button.color = "#6D665C"
                if(!mouseArea.containsMouse)
                fadeOut.start()
            }
            onMouseYChanged: {
                target.contentY = button.y / scrollBar.height * target.contentHeight
            }
        }
    }

    Connections{
        target: scrollBar.target

        onMovingVerticallyChanged: {
            if (target.movingVertically)
                fadeIn.start()
            else
                fadeOut.start()
        }
        onMovingHorizontallyChanged: {
            if (target.movingHorizontally)
                fadeIn.start()
            else
                fadeOut.start()
        }
    }

    NumberAnimation {
        id:fadeIn
        target: scrollBar
        properties: "opacity"
        duration: 500
        from: 0;
        to: 1
    }

    NumberAnimation {
        id:fadeOut
        target: scrollBar
        properties: "opacity"
        duration: 500
        from: 1
        to: 0
    }
}
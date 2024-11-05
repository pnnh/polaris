import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3

Rectangle {
    color: "transparent"
    height: 36
    width: 36
    Layout.topMargin: 16
    Layout.alignment: Qt.AlignVTop | Qt.AlignHCenter

    Image {
        id: image
        width: parent.width
        height: parent.height
        anchors.centerIn: parent
        source: "qrc:/qt/qml/quick/content/assets/photos/photo1.webp"

        layer.enabled: true
        layer.effect: ShaderEffect {
            property variant src: image
            property double edge: 1.0
            anchors.fill: parent

            fragmentShader: "qrc:/content/shaders/rounded.frag.qsb"
            vertexShader: "qrc:/content/shaders/rounded.vert.qsb"
        }
    }
}

import QtQuick 2.15
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.3
import quick 1.0

Rectangle {
    anchors.fill: parent

    property int gap: 16
    property int cardSize: calcCardSize()

    function calcCardSize() {
        console.log('width:', this.width)
        return (this.width - gap * 2) / 8
    }

    GridView {
        id: grid

        anchors.fill: parent
        anchors.margins: gap / 2
        boundsBehavior: Flickable.StopAtBounds // 滑动不超出父框的大小
        cellHeight: cardSize
        cellWidth: cardSize
        clip: true // 超出边界的进行裁剪，即不显示，默认为false
        cacheBuffer: cardSize * 32 // 缓存的大小，超出这个大小就会被释放

        ScrollBar.vertical: ScrollBar {
            visible: true
            background: Rectangle {
                color: "#fafafa"
                radius: 4
            }
            snapMode: ScrollBar.SnapAlways
        }

        delegate: Rectangle {
            width: cardSize
            height: cardSize

            Rectangle {
                width: parent.width - gap
                height: parent.height - gap
                radius: 4
                border.color: "#e0e0e0"
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.verticalCenter: parent.verticalCenter

                Image {
                    anchors.centerIn: parent
                    source: model.picSrc
                    fillMode: Image.PreserveAspectCrop
                    sourceSize.width: 128 // 预览图片的尺寸，避免图片过大影响性能
                    sourceSize.height: 128
                    width: parent.width - 2
                    height: parent.height - 2
                }
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        console.log(parent.width, parent.height)
                    }
                }
            }
        }
        model: PictureGridModel {
            folder: '/Users/Larry/Pictures/插画'
        }
    }
}

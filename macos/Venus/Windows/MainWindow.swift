import Cocoa
import SwiftUI


public func showWindow(imgPath: String) {
    var windowRef:NSWindow
    windowRef = NSWindow(
        contentRect: NSRect(x: 0, y: 0, width: 600, height: 600),
        styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
        backing: .buffered, defer: false)
    //windowRef.contentView = NSHostingView(rootView: MyView(myWindow: windowRef, imagePath: imgPath))
    windowRef.makeKeyAndOrderFront(nil)
}

class PSMainWindow : NSWindow, NSWindowDelegate {
    static let minWinSize:NSSize = NSSize(width:1024, height:768)
    static let maxWinSize:NSSize = NSSize(width:1920, height:1080)
    
    weak var mainWindowDelegate: PSMainWindowProtocol?
       
       override var canBecomeKey: Bool{
           return true
       }
    
    
    //window尺寸变化
    func windowWillResize(_ sender: NSWindow, to frameSize: NSSize) -> NSSize {
//        if let delegate = self.qqDelegate,delegate.responds(to: #selector(QQBaseWindowProtocol.windowWillResize(size:))) {
//            delegate.windowWillResize(size: frameSize)
//        }
        //frameSize.width = sender.frame.size.width + 10
        var newSize = NSSize(width: frameSize.width, height: frameSize.height)
//        if frameSize.width - sender.frame.size.width > 0 {
//            newSize.width = sender.frame.size.width + 50
//        } else if frameSize.width - sender.frame.size.width < 0 {
//           // newSize.width = sender.frame.size.width - 50
//        }
        
        // 按指定步长调整宽度
        //newSize.width = CGFloat((Int(frameSize.width) / 150 + 1) * 150)
        
        if newSize.width < 1024 {
            newSize.width = 1024
        }
        if newSize.width > 1920 {
            newSize.width = 1920
        }
        if newSize.height < 768 {
            newSize.height = 768
        }
        if newSize.height > 1080 {
            newSize.height = 1080
        }
        //print("window delegate \(sender.frame.size) \(frameSize) \(newSize)")
        return newSize
    }
    
}
 

@objc protocol PSMainWindowProtocol:NSObjectProtocol {
    @objc func windowWillResize(size:NSSize);
}

import Cocoa
import SwiftUI
import Native
import Logging
import Alamofire

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!

    func applicationDidFinishLaunching(_ aNotification: Notification) {
         let contentView = ContentView()
 
        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 480, height: 300),
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered, defer: false)
        window.isReleasedWhenClosed = false
        window.center()
        window.setFrameAutosaveName("Main Window")
        window.contentView = NSHostingView(rootView: contentView)
        window.makeKeyAndOrderFront(nil)
        
        // 尝试调用C++侧的日志打印
        Native.native.Logger.log("Call From Swift")
        
        // 尝试调用SPM里的Swift-log来打印日志
        let logger = Logger(label: "xyz.huable.venus")
        logger.info("Hello Venus")
    }
}
 

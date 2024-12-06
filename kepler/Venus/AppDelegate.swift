import Cocoa
import SwiftUI
import MTQuantum
import Logging

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    var window: PSMainWindow!


    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Create the SwiftUI view that provides the window contents.
        //let contentView = ContentView()
//        let contentView = GridLayoutView()
        let contentView = PSMainView()

        window = PSMainWindow(
            contentRect: NSRect(x: 0, y: 0, width: PSMainWindow.minWinSize.width, height: PSMainWindow.minWinSize.height),
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered, defer: false)
        window.isReleasedWhenClosed = false
        window.center()
        window.setFrameAutosaveName("Main Window")
        window.contentView = NSHostingView(rootView: contentView)
        window.makeKeyAndOrderFront(nil)
        
        // 尝试调用C++侧的日志打印
        MTQuantum.quantum.Logger.LogInfo("Call From Swift")
        
        // 尝试调用SPM里的Swift-log来打印日志
        let logger = Logger(label: "xyz.huable.venus.main")
        logger.info("Hello Venus")
    }

    func applicationWillTerminate(_ aNotification: Notification) {
    }
}

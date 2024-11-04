//
//  AppDelegate.swift
//  Venus
//
//  Created by Larry on 2020/10/29.
//

import Cocoa
import SwiftUI
import Native
import Logging

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

    var window: QQBaseWindow!


    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Create the SwiftUI view that provides the window contents.
        //let contentView = ContentView()
//        let contentView = GridLayoutView()
        let contentView = WaterfallsView()
       // let contentView = LayoutView()

        // Create the window and set the content view.
        window = QQBaseWindow(
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
        let logger = Logger(label: "xyz.huable.venus.main")
        logger.info("Hello Venus")
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }

    
    func testRunC() -> Void {
        print("\n")
        print("收到C函数的随机数是：\(421)");
        
        let name = "hello"
        print("fetch name is：\(name)");
        
    }
}

class QQBaseWindow : NSWindow, NSWindowDelegate {
    
    weak var qqDelegate: QQBaseWindowProtocol?
       
       override var canBecomeKey: Bool{
   //        self.delegate = self
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
        
        if newSize.width < 1152 {
            newSize.width = 1152
        }
        if newSize.width > 1600 {
            newSize.width = 1600
        }
        if newSize.height < 768 {
            newSize.height = 768
        }
        if newSize.height > 1000 {
            newSize.height = 1000
        }
        print("window delegate \(sender.frame.size) \(frameSize) \(newSize)")
        return newSize
    }
    
}
 

@objc protocol QQBaseWindowProtocol:NSObjectProtocol {
    @objc func windowWillResize(size:NSSize);
}

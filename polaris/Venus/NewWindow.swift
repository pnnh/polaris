//
//  NewWindow.swift
//  Venus
//
//  Created by Larry on 2020/11/23.
//

import Foundation
import Cocoa
import SwiftUI

func showWindow(imgPath: String) {
    var windowRef:NSWindow
    windowRef = NSWindow(
        contentRect: NSRect(x: 0, y: 0, width: 600, height: 600),
        styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
        backing: .buffered, defer: false)
    windowRef.contentView = NSHostingView(rootView: MyView(myWindow: windowRef, imagePath: imgPath))
    windowRef.makeKeyAndOrderFront(nil)
}

struct MyView: View {
    let myWindow:NSWindow?
    let imagePath: String
    
    var body: some View {
        VStack{
            Text("This is in a separate window.")
            //ScrollView() {
            HStack {
                SJImageView(imagePath: imagePath)
            }
           // }
            HStack{
                Button(action:{
                    self.myWindow!.close()
                }) {
                    Text("Close this window")
                }
            }
        }
    .padding()
    }
}

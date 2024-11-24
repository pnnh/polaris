import Foundation
import SwiftUI
import Cocoa


struct PSImageView: NSViewRepresentable {
    typealias NSViewType = NSImageView
    
    func updateNSView(_ nsView: NSImageView, context: Context) {
        print("SJImageView updateView")
    }
    
    private var image:NSImage?
    
    
    init(image: NSImage) {
        self.image = image
    }
    
    init(imagePath: String) {
        self.image = NSImage(contentsOfFile: imagePath)
    }
    
    func makeNSView(context: Context) -> NSImageView {
        
        let rect = NSRect(x: 0, y: 0, width: 36, height: 36)
        let view = NSImageView(frame: rect)
        view.imageFrameStyle = .photo
        view.isEditable = false
        view.imageScaling = .scaleProportionallyUpOrDown
        view.animates = true
        
        if self.image != nil {
            view.image = self.image
        }
         
        return view
    }
    
     
}

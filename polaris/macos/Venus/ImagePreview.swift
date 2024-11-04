//
//  ImagePreview.swift
//  Venus
//
//  Created by Larry on 2020/11/15.
//

import Foundation
import SwiftUI
import Combine

struct ImagePreview : View {
    //var student = Student(name: "Jack", score: 90)
    
    @State var prevModel: PreviewModel = PreviewModel()
    var publisher: PassthroughSubject<String, Never>
    @State var imgPath: String = "Documents/kong.png"
    
    init(publisher: PassthroughSubject<String, Never>) {
        print("ImagePreview created")
//
//        let observer: Subscribers.Sink<String,Never> = Subscribers.Sink(receiveCompletion: {
//            print("completed: \($0)")
//        }, receiveValue: {
//            print("received value2: \($0)")
//        })
//        publisher.subscribe(observer)
        //publisher.subscribe(self)
        self.publisher = publisher
        
    }
    
    var body: some View {
        VStack {
            
            Image(nsImage: NSImage(contentsOfFile: self.imgPath)!)
                    .resizable().aspectRatio(contentMode: .fit)
                    .frame(maxWidth: 300, maxHeight: 300)
        }
        .onAppear() {
                print("ImagePreview onAppear")
                
                let observer: Subscribers.Sink<String,Never> = Subscribers.Sink(receiveCompletion: {
                    print("completed: \($0)")
                }, receiveValue: {
                    print("received value2: \($0)")
                    //self.prevModel.Image = NSImage(contentsOfFile: "Documents/pic2/b.png")!
                    self.imgPath = $0
                })
                publisher.subscribe(observer)
        }.background(Color.blue)
    }
}

//
//  ContentView.swift
//  emoticons
//
//  Created by Larry on 2020/9/8.
//  Copyright © 2020 larry. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        
        VStack {
            HStack {
                
                Spacer()
                Text("Top Text")
                Spacer()
                Text("Bottom Text")
                Spacer()
                Button(action: {
                    print("follow")
                    
                    let manager = FileManager.default
                    let urlForDocument = manager.urls(for: .documentDirectory, in:.userDomainMask)
                    let url = urlForDocument[0] as URL
                    print(url)
                    
                }){
                    Text("click")
                }
            }
            HStack {
                
                Spacer()
                Text("Top Text")
                Spacer()
                Text("Bottom Text")
                Spacer()
                Button(action: {
                    print("follow2")
                    
                    //                           let openPanel = NSOpenPanel();
                    //                           openPanel.allowsMultipleSelection = false;
                    //                           openPanel.canChooseDirectories = true;
                    //                           openPanel.canChooseFiles = true;
                    //                           openPanel.message = "本应用需要访问该目录，请点击允许按钮"
                    //                           openPanel.prompt = "允许"
                    //                           openPanel.directoryURL = URL.init(string: NSHomeDirectory());
                    //                           openPanel.begin(completionHandler: { (result) in
                    //                            if result == .OK {
                    //                                   print("ddsskj")
                    //
                    //
                    //
                    //
                    //                               }
                    //                           })
                    
                    
                    let manager = FileManager.default
                    //                       let urlForDocument = manager.urls(for: .documentDirectory, in:.userDomainMask)
                    //                       let url = urlForDocument[0] as URL
                    let url = promptForWorkingDirectoryPermission()
                    print(url)
                    
                    if let path = url?.path {
                        
                        print("ssss\(  path)" )
                        let contentsOfPath = try? manager.contentsOfDirectory(atPath: path)
                        print("contentsOfPath: \(contentsOfPath)")
                    }
                    
                }){
                    Text("open file")
                }
            }
            Spacer()
            HStack{
                Image(nsImage: NSImage(contentsOfFile: "Documents/zhe.jpg")!).resizable().scaledToFit().frame(width: 150.0, height: 150.0)
                
            }
            Spacer()
        }
        
        //        Text("Helsssaaa我今天没吃饭lo, Worlsssssd22222!")
        //            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

//struct ContentView_Previews: PreviewProvider {
//    static var previews: some View {
//        ContentView()
//    }
//}

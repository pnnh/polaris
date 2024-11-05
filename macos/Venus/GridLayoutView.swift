//
//  GridLayoutView.swift
//  emoticons
//
//  Created by Larry on 2020/10/11.
//  Copyright © 2020 larry. All rights reserved.
//

import SwiftUI 

struct GridLayoutView: View {
//    @State private var data = ["c.gif", "d.jpg", "e.jpg", "f.png", "g.png", "zhe.jpg", "b.png"]
    @State private var data:[ImageModel] = []
    
    let columnCount = 5
    //let (data, rowCount, columnCount) = loadData()

    var body: some View {
        ScrollView {
//            LazyVGrid(columns: columns, spacing: 20) {
//                ForEach(data, id: \.self) { item in
//                    Text(item)
//                }
//            }
//            .padding(.horizontal)
            VStack(alignment: .leading) {
                Spacer()
                HStack(alignment: .top) {
                    Spacer().frame(width: 10)
                    Button(action: {
                        print("follow")
                        
                        let manager = FileManager.default
                     
                         
                        //                       let urlForDocument = manager.urls(for: .documentDirectory, in:.userDomainMask)
                        //                       let url = urlForDocument[0] as URL
                        let url = promptForWorkingDirectoryPermission()
                        print(url)
                        
                        if let path = url?.path {
                            
                            print("ssss\(  path)" )
                            let contentsOfPath = try? manager.contentsOfDirectory(atPath: path)
                            print("contentsOfPath: \(contentsOfPath)")
                            
                            if let paths = contentsOfPath {
                                //var imageArray:[String] = []
                                self.data.removeAll()
                                for fileName in paths {
                                    print("file path: \(fileName)")
                                    if fileName.hasSuffix(".jpg") || fileName.hasSuffix(".png") || fileName.hasSuffix(".gif"){
                                        let imgModel = ImageModel(Path: "\(path)/\(fileName)", Text: "待检查")
                                        self.data.append(
                                            imgModel
                                        )
                                    }
                                }
                                print("imageArray: \(self.data)")
                             //   self.data = imageArray
                            }
                        }
                        
                    }) {
                        Text("Open")
                    }.frame(alignment: .leading)
                    Spacer()
                }
            
                ForEach(0 ..< calcRow(data: self.data, columnCount: self.columnCount), id: \.self) { rowIndex in
                    HStack(alignment: .top) {
                        Spacer().frame(width: 10)
                        ForEach(0 ..< columnCount, id: \.self) { colIndex in
//                            if rowIndex * columnCount + colIndex < data.count {
////                                Text("text \(data[rowIndex * columnCount + colIndex])").frame(width: 100, height: 100, alignment: .leading)
//                                Image(nsImage: NSImage(contentsOfFile: "Documents/\(data[rowIndex * columnCount + colIndex])")!).resizable().scaledToFit().frame(width: 100.0, height: 100.0).border(Color.black, width: 1)
//                            } else {
//                                Text("空").frame(width: 100, height: 100, alignment: .leading)
//                            }
                            //getImageView(data: data, index: rowIndex * columnCount + colIndex)
                            //aaa(data: data, index: rowIndex * columnCount + colIndex)
//                            EmoView(data: $data, index: rowIndex * columnCount + colIndex, imgText: "待识别")
                            EmoView(data: $data, index: rowIndex * columnCount + colIndex )
                        }
                        Spacer()
                    }
                }
                Spacer()
            }
        }
    }
}
 
struct EmoView : View {
    @Binding var data: [ImageModel]
    @State var index: Int
    
    @State private var isPopover = true
   // @State  var imgText: String
    
//    var isShow: Bool = false
//   var imgPath: String = "Documents/kong.png"
//
//    init(isShow: Bool, imgPath: String) {
//
//        print("jjj333 \(isShow) \(imgPath)")
//        self.isShow = isShow
//        self.imgPath = imgPath
//       // self.imgText = "待识别2"
//        _imgText = .init(initialValue: "待识别2")
//    }
    
    @ViewBuilder
    func buildView() -> some View {
        
        if self.index < self.data.count {
            
    //        Button(action: {}, label: {
    //            Text("识别")
    //        })
            VStack{
                Image(nsImage: NSImage(contentsOfFile:getImagePath(data:  self.data, index: self.index))!).resizable().scaledToFit().frame(width: 100.0, height: 100.0).border(Color.black, width: 1)
                
                HStack {
//                    Text(self.data[self.index].Text)
                    Text("取消上面注释")
                    
                    Button(action: {
                        print("无效内容")
                    }, label: {
                        Text("识别")
                    }).popover(isPresented: self.$isPopover,attachmentAnchor: .point(.bottom),   // here !
                               arrowEdge: .bottom){
                        Text(self.data[self.index].Text)
                    }.onHover(perform: { hovering in
                        print("jjjj23432")
                        self.isPopover.toggle()
                    })
                }
            }
        }
    }
    
    
    var body: some View {
        buildView()
    }
}


func getImagePath(data: [ImageModel], index: Int) -> String {
    //print("aaa \(data) \(index)")
    if index >= data.count {
        return "Documents/kong.png"
    }
    var imgPath = data[index].Path
    if !imgPath.hasPrefix("/") {
        imgPath = "Documents/\(data[index])"
    }
    return imgPath
}


//
//func getImageView(data: [String], index: Int) -> View {
//    if index >= data.count {
////        return VStack {
////            Image(nsImage: NSImage(contentsOfFile: "Documents/kong.png")!).resizable().scaledToFit().frame(width: 100.0, height: 100.0).border(Color.black, width: 1)
////
////            HStack {
////                Text("空图片")
////                Button(action: {}, label: {
////                    Text("识别")
////                })
////            }
////        }
//        return nil
//    }
//    var imgPath = data[index]
//    if !imgPath.hasPrefix("/") {
//        imgPath = "Documents/\(data[index])"
//    }
//    return VStack{
//        Image(nsImage: NSImage(contentsOfFile: imgPath)!).resizable().scaledToFit().frame(width: 100.0, height: 100.0).border(Color.black, width: 1)
//
//        HStack {
//            Text("jjjj222")
//            Button(action: {}, label: {
//                Text("识别")
//            })
//        }
//    }
//
//}
 

func calcRow(data: [ImageModel], columnCount: Int = 10) -> Int {
    //let data = (1...135).map { "Item \($0)" }
    //let data = ["c.gif", "d.jpg", "e.jpg", "f.png", "g.png", "zhe.jpg", "b.png"]
   // let columnCount = 3
 
//    let columns = [
//        GridItem(.adaptive(minimum: 80))
//    ]
    
    print("data \(data)")
    
    //let columnCount = 10
    var rowCount = data.count / columnCount
    
    if data.count % columnCount != 0 {
        rowCount += 1
    }
    
    print("rowcount \(rowCount)")
    
    return rowCount
}

 
private func promptForWorkingDirectoryPermission() -> URL? {
    let openPanel = NSOpenPanel()
    openPanel.message = "Choose your directory"
    openPanel.prompt = "Choose"
    openPanel.allowedFileTypes = ["none"]
    openPanel.allowsOtherFileTypes = false
    openPanel.canChooseFiles = false
    openPanel.canChooseDirectories = true
    
    let response = openPanel.runModal()
    print(openPanel.urls) // this contains the chosen folder
    return openPanel.urls.first
}

struct GridLayoutView_Previews: PreviewProvider {
    static var previews: some View {
        GridLayoutView()
    }
}

//
//  Waterfalls.swift
//  Venus
//
//  Created by Larry on 2020/10/31.
//  以瀑布流形式展示图片列表

import Foundation
import SwiftUI
import Combine

class Student {
    let name: String
    var score: Int
    
    init(name: String, score: Int) {
        self.name = name
        self.score = score
    }
}

struct WaterfallsView: View {
    //    @State private var data = ["c.gif", "d.jpg", "e.jpg", "f.png", "g.png", "zhe.jpg", "b.png"]
    @State private var dataFiles: [String] = []

    @State var columnCount: Int = 10
    //let (data, rowCount, columnCount) = loadData()
    @State var sliderValue: Double = 10
    let publisher = PassthroughSubject<String, Never>()
    
    func showImages(path: String) {

        let manager = FileManager.default
        
        print("ssss\(path) \(manager.currentDirectoryPath)")
            let contentsOfPath = try? manager.contentsOfDirectory(atPath: path)
            print("contentsOfPath:")

            if let paths = contentsOfPath {
                var imageArray: [String] = []
                for fileName in paths {
                    print("file path: \(fileName)")
                    if fileName.hasSuffix(".jpg") || fileName.hasSuffix(".png") || fileName.hasSuffix(".gif") {

                        imageArray.append(
                            "\(path)/\(fileName)"
                        )
                    }
                }
                self.dataFiles.removeAll()
                self.dataFiles = imageArray
                // print("imageArray: \(self.data)")
                //   self.data = imageArray
            }
        
    }
    
    func printSize(_ tag: String, width: CGFloat, height: CGFloat) {
        print("printSize \(tag), \(width), \(height)")
        
        
    }
    
    var body: some View {
        HStack() {
            VStack {
                HStack {
                    VStack {
                        HStack {
                            Text("相册").foregroundColor(Color.gray)
                                .fontWeight(.bold)
                                .font(Font.system(size: 14, design: .default))
                            Spacer()
                            Button(action: {
                            
                                print("打开文件")
                                let url = promptForWorkingDirectoryPermission()
                                
                                if let mustUrl = url {
                                    self.showImages(path: mustUrl.path)
                                }
                                
                            } ) {
                                
                                Image(nsImage: NSImage(systemSymbolName: "plus.circle", accessibilityDescription: nil)!)
                            }.buttonStyle(EmptyButtonStyle())
                        }
                        HStack{
                            Image(nsImage: NSImage(systemSymbolName: "folder", accessibilityDescription: nil)!)
                            Text("表情")
                            Spacer()
                        }
                        HStack{
                            Image(nsImage: NSImage(systemSymbolName: "folder", accessibilityDescription: nil)!)
                            Text("Videos")
                            Spacer()
                        }
                        HStack{
                            Image(nsImage: NSImage(systemSymbolName: "folder", accessibilityDescription: nil)!)
                            Text("emos")
                            Spacer()
                        }
                        HStack{
                            Image(nsImage: NSImage(systemSymbolName: "folder", accessibilityDescription: nil)!)
                            Text("高清壁纸集合")
                            Spacer()
                        }
                    }
                }
                Spacer()
                
                HStack(alignment: .center){
                    Spacer(minLength: 0)
                    //SJImageView(image: NSImage(contentsOfFile: previewPath)! )
                    //ImagePreview(publisher: self.publisher)
                    Spacer(minLength: 0)
                }.frame(maxHeight: 300)
            }.frame(maxWidth: 300).padding(15)//.background(Color.blue)
            VStack(alignment: .leading, spacing: 10) {
                    HStack(alignment: .center) {
                        Button(action: {
                            let url = promptForWorkingDirectoryPermission()
                            
                            if let mustUrl = url {
                                self.showImages(path: mustUrl.path)
                            }
                            
                        }) {
                            Text("打开")
                        }.frame(alignment: .leading)
                        Button(action: {
                            if self.sliderValue > 5 {
                                self.sliderValue -= 1
                                self.columnCount += 1
                                
                            }
                        }) {
                            Text("小图")
                        }
                        Slider(value: $sliderValue, in: 5...15, step: 1) { _ in
                            print("jjjj=== \(sliderValue)")
                            self.columnCount = 20 - Int(self.sliderValue)
                        }.frame(width: 100)
                        Button(action: {
                            if self.sliderValue < 15 {
                                
                            self.sliderValue += 1
                            self.columnCount -= 1
                            }
                        }) {
                            Text("大图")
                        }
                        //Spacer()
                    }
                       // .background(Color.green)
                    .padding(10)
                //}

                GeometryReader { gp in
                    ScrollView() {
                       
                        GridView(colCount: $columnCount, files: $dataFiles, publisher: self.publisher)
                                .frame(
                                    maxHeight: (gp.size.width / CGFloat(columnCount) + 10) * CGFloat(dataFiles.count / Int(columnCount) + 1))//.background(Color.green)
                                //.frame(maxWidth: gp.size.width)
                                .padding(.leading, 10).padding(.trailing, 10)
                        

                        //} .background(Color.gray)//.frame(width: gp.size.width )
                    } //.background(Color.yellow)
                }
                Spacer()
            }.onAppear() {
                print("jjjddd")
                // view显示时展示某个文件夹内图片列表
                self.showImages(path: "Documents/pics")
    //                                print("jjjj333 \(dataFiles.count) \((gp.size.width / CGFloat(columnCount) + 20) * CGFloat(dataFiles.count / columnCount + 1))")
            }
        }
         
    }

    func getPath(index: Int) -> String {
        if index < dataFiles.count {
            return dataFiles[index]
        }
        return ""
    }

    private func promptForWorkingDirectoryPermission() -> URL? {
        let openPanel = NSOpenPanel()
        openPanel.message = "Choose your directory"
        openPanel.prompt = "Choose"
        openPanel.allowedFileTypes = ["none"]
        openPanel.allowsOtherFileTypes = false
        openPanel.canChooseFiles = false
        openPanel.canChooseDirectories = true

        _ = openPanel.runModal()
        print(openPanel.urls) // this contains the chosen folder
        return openPanel.urls.first
    }
}


class PreviewModel: ObservableObject {
    init() {
        print("PreviewModel Created")
    }
    @Published var imagePath: String = "Documents/kong.png"
    @Published var Image: NSImage = NSImage(contentsOfFile: "Documents/kong.png")!
    
    func TestPrint(path: String) {
        self.imagePath = path
        print("PreviewModel imagePath \(path) \(self.imagePath)")
    }
    
}

struct WaterfallsView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            WaterfallsView()
        }
    }
}

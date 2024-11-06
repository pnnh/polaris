import Foundation
import SwiftUI
import Combine

struct PSMainView: View {
    //    @State private var data = ["c.gif", "d.jpg", "e.jpg", "f.png", "g.png", "zhe.jpg", "b.png"]
    @State private var dataFiles: [String] = []

    @State var columnCount: Int = 10
    //let (data, rowCount, columnCount) = loadData()
    @State var sliderValue: Double = 10
    let publisher = PassthroughSubject<String, Never>()
    
    
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
                                    self.dataFiles.removeAll()
                                    self.dataFiles = selectImages(path: mustUrl.path)
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
            }.frame(maxWidth: 300).padding(15)
            VStack(alignment: .leading, spacing: 10) {

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
                self.dataFiles.removeAll()
                self.dataFiles = selectImages(path: "Documents/pics")
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
}

struct PSMainView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            PSMainView()
        }
    }
}

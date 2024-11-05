//
//  LayoutView.swift
//  Venus
//
//  Created by Larry on 2020/11/9.
//
//  Swift UI 布局学习

import Foundation
import SwiftUI

struct LayoutView: View {
//    var body: some View {
//        HStack {
//            Spacer()
//            VStack{
//                Text("A")
//
//                Spacer()
//            }.background(Color.blue) .frame(maxWidth: .infinity)
//            VStack{
//                Text("B")
//
//            }.background(Color.orange) .frame(maxWidth: .infinity)
//            VStack{
//                Text("C")
//
//            }.background(Color.yellow) .frame(maxWidth: .infinity)
//            Spacer()
//        }.background(Color.green)
//    }
    
    // 该ScrollView调整窗口大小时会崩溃
//    var body: some View {
//           ScrollView {
//               HStack {
//                   ForEach(1...3, id: \.self) { idx in
//                       TextField("", text: .constant("text \(idx)"))
//                   }
//               }
//           }
//       }
    
    var body: some View {
            GeometryReader { gp in
                ScrollView {
                    HStack {
                        ForEach(1...3, id: \.self) { idx in
                            TextField("", text: .constant("text \(idx)"))
                        }
                    }.frame(width: gp.size.width)
                }
            }
        }
}

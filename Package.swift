// swift-tools-version:6.0
import PackageDescription

let package = Package(
    name: "rudder",
    platforms: [
       .macOS(.v14)
    ],
    dependencies: [
        .package(url: "https://github.com/vapor/vapor.git", from: "4.99.3"),
        .package(url: "https://github.com/apple/swift-nio.git", from: "2.65.0"),
    ],
    targets: [
        .executableTarget(
            name: "App",
            dependencies: [
                .product(name: "Vapor", package: "vapor"),
                .product(name: "NIOCore", package: "swift-nio"),
                .product(name: "NIOPosix", package: "swift-nio"),
                "cpplib"
            ],
            path: "huable/rudder",
            swiftSettings: swiftSettings
        ),
        .target(name: "cpplib", dependencies: [], path: "huable/cpplib"),
    ],
    swiftLanguageModes: [.v6],
    cLanguageStandard: .c17,
    cxxLanguageStandard: .cxx20
)

var swiftSettings: [SwiftSetting] { [
    .enableExperimentalFeature("StrictConcurrency"),
] }

import Cocoa
import FlutterMacOS

public class QuantumPlugin: NSObject, FlutterPlugin {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "quantum", binaryMessenger: registrar.messenger)
    let instance = QuantumPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    switch call.method {
    case "getPlatformVersion":
      result("macOS " + ProcessInfo.processInfo.operatingSystemVersionString)
    case "initPlugin":
      result("ok")
    default:
      result(FlutterMethodNotImplemented)
    }
  }
}

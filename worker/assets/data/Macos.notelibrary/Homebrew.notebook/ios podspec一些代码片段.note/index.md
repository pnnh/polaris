## 配置引用第三方frameworks
```bash

#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html.
# Run `pod lib lint quantum.podspec` to validate before publishing.
#
Pod::Spec.new do |s|
  s.name             = 'quantum'
  s.version          = '0.0.1'
  s.summary          = 'A new flutter plugin project.'
  s.description      = <<-DESC
A new flutter plugin project.
                       DESC
  s.homepage         = 'https://multiverse.direct'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Your Company' => 'email@example.com' }
  s.source           = { :path => '.' }
  s.source_files = 'Classes/**/*'
  s.dependency 'Flutter'
  s.platform = :ios, '14.0'

  s.swift_version = '5.0'

#   s.prepare_command = <<-CMD
#   cmake --preset Default
#   xcodebuild -project target/QuantumIOS.xcodeproj -scheme QuantumNative -destination generic/platform=iOS -configuration Release build
# CMD
  #s.ios.vendored_libraries = 'target/lib/Release-iphoneos/libquantum_native.a'
  s.ios.vendored_frameworks = 'target/lib/Release-iphoneos/**/*.framework'
  s.ios.preserve_path = 'target/lib/Release-iphoneos/*'
  # s.ios.libraries = 'c++'
  #s.vendored_frameworks = 'Frameworks/AipBase.framework', 'Frameworks/AipOcrSdk.framework', 'Frameworks/IdcardQuality.framework', 'Frameworks/quantum_native.framework' #'target/lib/Release-iphoneos/quantum_native.framework'
  
  # s.vendored_frameworks = 'Frameworks/**/*.framework'
  # s.preserve_path = 'Frameworks/*'
  # s.libraries = ['z']
  # s.frameworks = ['CFNetwork', 'Security']
  #s.dependency 'quantum_native'
  #s.ios.public_header_files = 'target/lib/Release-iphoneos/quantum_native.framework/Headers/*'
  #s.static_framework = true
  #s.ios.libraries = "quantum"
  #s.vendored_library    = 'target/lib/Release-iphoneos/libquantum_native.dylib'
  # s.ios.vendored_library    = 'libquantum_native.dylib'
  # s.ios.library  = 'quantum_native'

  #s.resources = ["target/lib/Release-iphoneos/libquantum.dylib"]
  #s.info_plist = { 'CFBundleIdentifier' => 'direct.multiverse.quantum' } 

  # Flutter.framework does not contain a i386 slice.
  s.pod_target_xcconfig = { 
    'DEFINES_MODULE' => 'YES',
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386',
    'LD_RUNPATH_SEARCH_PATHS' => '@loader_path/../Frameworks',
    # 'LIBRARY_SEARCH_PATHS' => '"${PODS_ROOT}/target/lib/Release-iphoneos"',
    # 'FRAMEWORK_SEARCH_PATHS' => '"${PODS_ROOT}/target/lib/Release-iphoneos"',
    'OTHER_LDFLAGS' => '$(inherited) -ObjC'
   }
end

```

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
  s.homepage         = 'http://example.com'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Your Company' => 'xspanni@gmail.com' }
  s.source           = { :path => '.' }
  s.source_files     = 'Classes/**/*'
  s.dependency 'FlutterMacOS'

  s.platform = :osx, '10.13'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
  s.swift_version = '5.0'

  #s.vendored_library    = '../bundle/lib/libhello.dylib'
  #s.vendored_library    = 'libquantum.dylib'
#   s.vendored_libraries = "../bundle/lib/libhello.dylib"
#   s.library  = 'hello'
#   s.library = 'c++', 'stdc++', 'z'
 #s.vendored_frameworks = '../bundle/lib/quantum_native.framework'
 s.vendored_frameworks = 'frameworks/lib/quantum_native.framework'
#   s.library = 'quantum_native'
#   s.pod_target_xcconfig = {
# #     'LIBRARY_SEARCH_PATHS' => '$(PODS_ROOT)/../bundle/lib',
#     'OTHER_LDFLAGS' => '-lquantum_native'
#   }
    #s.vendored_library    = 'libcouch_shared.dylib'
#   s.library  = 'couch_shared'
end

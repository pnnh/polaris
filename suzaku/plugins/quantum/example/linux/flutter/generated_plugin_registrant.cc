//
//  Generated file. Do not edit.
//

// clang-format off

#include "generated_plugin_registrant.h"

#include <quantum/quantum_plugin.h>

void fl_register_plugins(FlPluginRegistry* registry) {
  g_autoptr(FlPluginRegistrar) quantum_registrar =
      fl_plugin_registry_get_registrar_for_plugin(registry, "QuantumPlugin");
  quantum_plugin_register_with_registrar(quantum_registrar);
}

#include "react-native-rust-bridge.h"

namespace rustbridge {
	const char* execute(const char *cmd) {
		return rust_execute(cmd);
	}
}

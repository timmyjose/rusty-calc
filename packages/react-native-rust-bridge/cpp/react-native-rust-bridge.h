#ifndef RUSTBRIDGE_H
#define RUSTBRIDGE_H

extern "C" const char* rust_execute(const char*);

namespace rustbridge {
  const char* execute(const char*);
}

#endif /* RUSTBRIDGE_H */

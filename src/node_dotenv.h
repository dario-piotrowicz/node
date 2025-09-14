#ifndef SRC_NODE_DOTENV_H_
#define SRC_NODE_DOTENV_H_

#if defined(NODE_WANT_INTERNALS) && NODE_WANT_INTERNALS

#include "util-inl.h"
#include "v8.h"

#include <map>

namespace node {

class Dotenv {
 public:
  enum ParseResult { Valid, FileError, InvalidContent };
  struct env_file_data {
    std::string path;
    bool is_optional;
  };

  struct position {
    int line;
    int col;
  };

  struct validation_error {
    std::string message;
    position pos;
  };

  Dotenv() = default;
  Dotenv(const Dotenv& d) = delete;
  Dotenv(Dotenv&& d) noexcept = default;
  Dotenv& operator=(Dotenv&& d) noexcept = default;
  Dotenv& operator=(const Dotenv& d) = delete;
  ~Dotenv() = default;

  void ParseContent(const std::string_view content);
  ParseResult ParsePath(const std::string_view path);
  void AssignNodeOptionsIfAvailable(std::string* node_options) const;
  v8::Maybe<void> SetEnvironment(Environment* env);
  v8::MaybeLocal<v8::Object> ToObject(Environment* env) const;

  bool HasErrors() const;

  std::string GetErrorsMessage() const;

  static std::vector<env_file_data> GetDataFromArgs(
      const std::vector<std::string>& args);

 private:
  std::map<std::string, std::string> store_;
  std::vector<validation_error> errors;
};

}  // namespace node

#endif  // defined(NODE_WANT_INTERNALS) && NODE_WANT_INTERNALS

#endif  // SRC_NODE_DOTENV_H_

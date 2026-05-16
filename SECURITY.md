# Security Policy

This project is distributed as source code plus optional Windows build scripts.

## Reporting

If you find a security concern, report it to the project maintainer through the GitHub repository or the mod distribution page where this source is linked.

## Scope

The application is an external Electron overlay. It should not:

- inject into The Isle
- patch game files
- read or write game memory
- install drivers or services
- collect hidden all-player tracking data

Any behavior outside that scope should be treated as a bug or security issue.

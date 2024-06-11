Steps:

```bash
$ cd rusty-calc/packages/client
$ yarn
$ eas-build -p ios -e preview-sim --local
```

CI has been set up to auto submit apps to the App Store.

## Dev Build

```
$ cd app/packages/calc
$ yarn setup --clean
$ yarn android --device OR yarn ios --device

```

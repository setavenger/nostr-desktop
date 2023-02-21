# build react frontend
npm run build

# build apps
npx electron-packager --icon public/nostr-electron-icon.icns --ignore=build . --out=build
npx electron-packager --icon public/nostr-electron-icon.icns --ignore=build --arch=arm64 . --out=build

# make dmg files
electron-installer-dmg --out=build/dmgs "build/Nostr Desktop-darwin-x64/Nostr Desktop.app" "Nostr Desktop Intel"
electron-installer-dmg --out=build/dmgs "build/Nostr Desktop-darwin-arm64/Nostr Desktop.app" "Nostr Desktop Silicon"

sips -z 16 16     brave.png --out icons.iconset/icon_16x16.png
sips -z 32 32     brave.png --out icons.iconset/icon_16x16@2x.png
sips -z 32 32     brave.png --out icons.iconset/icon_32x32.png
sips -z 64 64     brave.png --out icons.iconset/icon_32x32@2x.png
sips -z 64 64     brave.png --out icons.iconset/icon_64x64.png
sips -z 128 128   brave.png --out icons.iconset/icon_64x64@2x.png
sips -z 128 128   brave.png --out icons.iconset/icon_128x128.png
sips -z 256 256   brave.png --out icons.iconset/icon_128x128@2x.png
sips -z 256 256   brave.png --out icons.iconset/icon_256x256.png
sips -z 512 512   brave.png --out icons.iconset/icon_256x256@2x.png
sips -z 512 512   brave.png --out icons.iconset/icon_512x512.png
sips -z 1024 1024   brave.png --out icons.iconset/icon_512x512@2x.png
iconutil -c icns icons.iconset -o icon.icns

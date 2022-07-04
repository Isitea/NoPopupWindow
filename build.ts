import { regexCopy } from "regex-copy"
import { rename, mkdir } from "node:fs/promises"

await regexCopy(
    [
        "src/**/*",
        "node_modules/@shopify/draggable/lib/draggable.bundle.js",
        "dist"
    ],
    {
        enlist: [],
        exclude: [ "*.ts", "*.log" ],
        remove: [ "src/*.js" ],
        preserve: [ "node_modules/**/*" ],
        flat: 1,
        removeEmpty: true,
        //test: true
    }
);
await mkdir( "dist/lib", { recursive: true } );
await rename( "dist/draggable.bundle.js", "dist/lib/draggable.bundle.js" );
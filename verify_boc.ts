
import { Cell } from "@ton/core";

const boc = "te6cckEBBgEA+gAB5YgB/sXzA6AVx7d8jMV2d7XwEXz9/EvzdObnJVBkYW8+VmgDm0s7c////+tKwR84AAAAdDI8TvxJW9H1vFzQHj353o/sKaSZQDEEVfs9k6+lfUynWPDdld1fvxlXglZWUuokrSD7R+BFIGvWp0H7vPeGkB8BAgoOw8htAwUCAodiAAU4D+zsuyk88jA04S5keKhthY8gasgwx6Zr9JMnilgTIDRzvAAAAAAAAAAAAAAAAAAADYUMPQAAAAAAAAAKOYloCAQDADJjbWp3eWsxdGwwMDAwaXQyODlyaW84b2w3AChsaWRfbWp4YW1yMXVxcGZpcGJ2YgAAwEdpaA==";

const cell = Cell.fromBase64(boc);
const hash = cell.hash().toString('hex');

console.log("Message Hash (from BOC):", hash);

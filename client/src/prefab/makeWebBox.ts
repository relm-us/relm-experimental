import { Color } from "three";

import { makeBox, makeWebPage } from "~/prefab";

export function makeWebBox(
  world,
  {
    x = 0,
    y = 1.6,
    z = 0,
    w = 3.2,
    h = 3.2,
    d = 0.6,
    yOffset = 0,
    url = "https://google.com?igu=1",
    color = "gray",
  }
) {
  const linearColor = new Color(color);
  linearColor.convertSRGBToLinear();

  console.log("create web box", y, yOffset);
  const box = makeBox(world, {
    ...{ x, y: y + yOffset, z, w, h, d },
    color: `#${linearColor.getHexString()}`,
    name: "Web Box",
  });

  const page = makeWebPage(world, {
    x: 0.0,
    y: 0.0,
    z: 0.301,
    url,
    frameWidth: 560,
    frameHeight: 560,
    worldWidth: 3,
  });
  page.setParent(box);

  return box;
}

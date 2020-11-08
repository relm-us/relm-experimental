import { createPlugin } from "hecs";
import ThreePlugin from "hecs-plugin-three";

import { CssPresentation } from "./CssPresentation";

import * as Components from "./components";
import * as Systems from "./systems";

export * from "./components";

export { Components };

export default createPlugin({
  name: "hecs-plugin-css3d",
  plugins: [ThreePlugin],
  systems: Object.values(Systems),
  components: Object.values(Components),
  decorate(world) {
    // world.presentation is generated by hecs-plugin-three
    // world.presentation.camera, .renderer, .scene, .viewport (HTMLElement)
    // console.log("css3d world", world);
    world.cssPresentation = new CssPresentation(world);
  },
});
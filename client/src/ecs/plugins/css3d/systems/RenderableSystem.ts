import { System, Groups, Not, Modified } from "~/ecs/base";
import { WorldTransform } from "~/ecs/plugins/core";
import {
  CSS3DObject,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer";

import { isBrowser } from "~/utils/isBrowser";

import { Renderable, RenderableRef } from "../components";

import { getRenderableComponentByType } from "../renderables";
import { Queries } from "~/ecs/base/Query";
import { CssPresentation } from "../CssPresentation";

export class RenderableSystem extends System {
  cssPresentation: CssPresentation;

  active = isBrowser();
  // This needs to be after WorldTransformationSystem, so that the CSS
  // is updated with the latest world coords as soon as possible after
  // having computed them during WebGL render. It must be immediately
  // followed up with CssRenderSystem so that the actual render occurs.
  order = Groups.Presentation + 300;

  static queries: Queries = {
    added: [Renderable, Not(RenderableRef)],
    modified: [Modified(Renderable), RenderableRef],
    active: [Renderable, RenderableRef],
    removed: [Not(Renderable), RenderableRef],
  };

  init({ cssPresentation }) {
    if (!cssPresentation) {
      throw new Error("RenderableSystem requires CssPresentation");
    }
    this.cssPresentation = cssPresentation;
  }

  update() {
    this.queries.added.forEach((entity) => {
      this.build(entity);
    });

    this.queries.modified.forEach((entity) => {
      this.remove(entity);
      this.build(entity);
    });

    this.queries.active.forEach((entity) => {
      const spec = entity.get(Renderable);
      const ref = entity.get(RenderableRef);
      const transform = entity.get(WorldTransform);
      if (!transform) return;

      this.copyTransform(ref.value, transform, spec.scale);
    });

    this.queries.removed.forEach((entity) => {
      this.remove(entity);
    });
  }

  build(entity) {
    const spec = entity.get(Renderable);
    const transform = entity.get(WorldTransform);

    if (!transform) return;

    let object;

    // Prepare a container for Svelte
    const containerElement = document.createElement("div");
    containerElement.style.width = spec.width + "px";
    containerElement.style.height = spec.height + "px";
    object = new CSS3DObject(containerElement);

    // Create whatever Svelte component is specified by the type
    const RenderableComponent = getRenderableComponentByType(spec.kind);
    object.userData.renderable = new RenderableComponent({
      target: containerElement,
      props: { ...spec, entity },
    });

    this.copyTransform(object, transform, spec.scale);

    this.cssPresentation.scene.add(object);

    entity.add(RenderableRef, { value: object });
  }

  remove(entity) {
    const ref = entity.get(RenderableRef);
    if (ref && ref.value) {
      // Remove CSS3DObject from scene, which will emit 'removed' event
      // and also remove HTML node from DOM.
      ref.value.parent.remove(ref.value);
    }

    entity.remove(RenderableRef);
  }

  copyTransform(object, transform, scale) {
    if (!object) {
      console.warn(`Can't copyTransform, object is null`, object);
      return;
    }
    object.position
      .copy(transform.position)
      .multiplyScalar(this.cssPresentation.FACTOR);
    object.quaternion.copy(transform.rotation);
    object.scale
      .copy(transform.scale)
      .multiplyScalar(this.cssPresentation.FACTOR * scale);
  }
}

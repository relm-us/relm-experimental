import { Asset, Transform } from "~/ecs/plugins/core";
import { Vector3 } from "three";
import { Model } from "~/ecs/plugins/core";

// Components from ECS plugins (organized alphabetically by plugin name)
import { Renderable, CssPlane } from "~/ecs/plugins/css3d";
import { NormalizeMesh } from "~/ecs/plugins/normalize";
import {
  HandController,
  HeadController,
  ThrustController,
} from "~/ecs/plugins/player-control";
import { PointerPlane } from "~/ecs/plugins/pointer-plane";
import {
  RigidBody,
  BallJoint,
  Collider,
  Impactable,
} from "~/ecs/plugins/rapier";

import { keyE, keyQ } from "~/input";

import { makeEntity, makeBall } from "./index";
import { InvisibleToMouse } from "~/ecs/components/InvisibleToMouse";

export function makeAvatarAndActivate(
  world,
  { x = 0, y = 0.75, z = -10 } = {}
) {
  // Create the avatar's torso, which we connect everything else to
  const avatar = makeEntity(world, "Avatar")
    .add(ThrustController, {
      thrust: 15,
      torque: 4,
    })
    .add(PointerPlane)
    .add(Impactable)
    .add(Transform, {
      position: new Vector3(x, y, z),
    })
    .add(Model, {
      asset: new Asset("/avatar.glb"),
    })
    .add(NormalizeMesh)
    .add(RigidBody, {
      kind: "DYNAMIC",
      linearDamping: 0.1,
      angularDamping: 12.5,
      mass: 0.5,
    })
    .add(Collider, {
      shape: "CAPSULE",
      capsuleHeight: 0.8,
      capsuleRadius: 0.36,
    })
    .add(InvisibleToMouse)
    .activate();

  // Make debugging easier
  (window as any).avatar = avatar;

  const head = makeEntity(world, "Head")
    .add(HeadController)
    .add(PointerPlane)
    .add(Transform, {
      position: new Vector3(0, 0.85, 0),
      scale: new Vector3(0.6, 0.6, 0.6),
    })
    .add(Model, {
      asset: new Asset("/head.glb"),
    })
    .add(NormalizeMesh)
    .add(InvisibleToMouse)
    .activate();
  head.setParent(avatar);

  const face = makeEntity(world, "Face")
    .add(Transform, {
      position: new Vector3(0, 0, 0.4),
    })
    .add(Renderable, {
      kind: "AVATAR_HEAD",
      width: 70,
      height: 70,
      scale: 0.7 / 70,
    })
    .add(CssPlane, {
      kind: "CIRCLE",
      circleRadius: 0.35,
    })
    .activate();
  face.setParent(head);

  // Left Hand (from avatar's point of view)
  const leftHand = makeBall(world, {
    ...{ x: x - 0.6, y: y + 0.0, z: z + 0.05 },
    r: 0.12,
    density: 0.2,
    color: "#59a4d8",
    name: "LeftHand",
    linearDamping: 4,
  })
    .add(BallJoint, {
      entity: avatar.id,
      position: new Vector3(-0.6, 0.5, 0.05),
    })
    .add(HandController, {
      pointerPlaneEntity: avatar.id,
      keyStore: keyE,
    })
    .add(InvisibleToMouse)
    .activate();

  // Right Hand (from avatar's point of view)
  const rightHand = makeBall(world, {
    ...{ x: x + 0.6, y: y + 0.0, z: z + 0.05 },
    r: 0.12,
    density: 0.2,
    color: "#59a4d8",
    name: "RightHand",
    linearDamping: 4,
  })
    .add(BallJoint, {
      entity: avatar.id,
      position: new Vector3(0.6, 0.5, 0.05),
    })
    .add(HandController, {
      pointerPlaneEntity: avatar.id,
      keyStore: keyQ,
    })
    .add(InvisibleToMouse)
    .activate();

  // Move these things as a unit on portal
  avatar.subgroup = [leftHand, rightHand];

  return avatar;
}

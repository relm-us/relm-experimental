import { Component, NumberType, StringType } from "~/ecs/base";
import { Vector3Type } from "~/ecs/plugins/core";
import { Vector3 } from "three";

export class Html2d extends Component {
  static props = {
    kind: {
      type: StringType,
      default: "LABEL",
      editor: {
        label: "Kind",
        input: "Select",
        options: [
          { label: "Label", value: "LABEL" },
          { label: "Test", value: "TEST" },
        ],
      },
    },

    offset: {
      type: Vector3Type,
      default: new Vector3(),
      editor: {
        label: "Position Offset",
      },
    },

    vanchor: {
      type: NumberType,
      default: 0,
      editor: {
        label: "Anchor (Vertical)",
        input: "Select",
        options: [
          { label: "Center", value: 0 },
          { label: "Top", value: 1 },
          { label: "Bottom", value: 2 },
        ],
      },
    },

    hanchor: {
      type: NumberType,
      default: 0,
      editor: {
        label: "Anchor (Horz.)",
        input: "Select",
        options: [
          { label: "Center", value: 0 },
          { label: "Left", value: 1 },
          { label: "Right", value: 2 },
        ],
      },
    },

    color: {
      type: StringType,
      default: "#FFFFFF",
      editor: {
        label: "Text Color",
        input: "Color",
      },
    },

    shadowColor: {
      type: StringType,
      default: "#000000",
      editor: {
        label: "Shadow Color",
        input: "Color",
      },
    },

    content: {
      type: StringType,
      default: null,
      editor: {
        label: "HTML Content",
      },
    },
  };

  static editor = {
    label: "Label",
  };
}
<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Capsule from "../Capsule.svelte";
  import { NumberDragger } from "../NumberDragger";

  export let key: string;
  export let component;
  export let prop;

  const dispatch = createEventDispatcher();

  let editing = {
    x: false,
    y: false,
    z: false,
  };

  let value: { x: number; y: number; z: number };
  $: value = component[key];

  function fmt(n) {
    return n === undefined ? "un" : n.toFixed(1);
  }

  const onInputChange = (dimension) => (event) => {
    component[key][dimension] = parseFloat(event.target.value);
    component.modified();
    dispatch("modified");
    editing[dimension] = false;
  };

  const onInputCancel = (dimension) => (event) => {
    editing[dimension] = false;
  };

  const makeDragger = (dimension) => {
    return new NumberDragger({
      getValue: () => value[dimension],
      onDrag: (newValue) => {
        component[key][dimension] = newValue;
      },
      onChange: (newValue) => {
        component[key][dimension] = newValue;
        component.modified();
        dispatch("modified");
      },
      onClick: () => {
        editing[dimension] = true;
      },
    });
  };

  const draggers = {
    x: makeDragger("x"),
    y: makeDragger("y"),
    z: makeDragger("z"),
  };

  const mousemove = (event) => {
    draggers.x.mousemove(event);
    draggers.y.mousemove(event);
    draggers.z.mousemove(event);
  };
  const mouseup = (event) => {
    draggers.x.mouseup(event);
    draggers.y.mouseup(event);
    draggers.z.mouseup(event);
  };
</script>

<style>
  div {
    margin-left: 16px;
    display: flex;
    flex-wrap: wrap;
  }
</style>

<div>{(prop.editor && prop.editor.label) || key}:</div>
<div>
  {#each ['x', 'y', 'z'] as dim}
    <Capsule
      editing={editing[dim]}
      on:mousedown={draggers[dim].mousedown}
      on:change={onInputChange(dim)}
      on:cancel={onInputCancel(dim)}
      label={dim.toUpperCase()}
      value={fmt(value[dim])} />
  {/each}
</div>

<svelte:window on:mousemove={mousemove} on:mouseup={mouseup} />
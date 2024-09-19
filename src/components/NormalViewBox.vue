<template>
  <div class="normal-view-box">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style >
.normal-view-box {
  cursor: pointer;
  width: 96%;
  height: 270px;
  margin: 2%;
  display: flex;
  justify-content: left;
  background-color: #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease;
}

.normal-view-box:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

</style>
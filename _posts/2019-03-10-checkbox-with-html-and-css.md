---
layout: post
title: "Checkbox with HTML and CSS"
categories: tech
---

# Checkbox with HTML and CSS


Checkbox switch, input element only + CSS, crossbrowser
Pretty clever idea to turn an <input type="checkbox"> into a toggle without any additional elements (box-shadow!)

```html
<style>
input.switch {
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;
  position: relative;
  height: 20px;
  width: 40px;
  border-radius: 10px;
  box-shadow: inset -20px 0px 0px 1px rgba(192, 192, 192, 0.5);
  background-color: white;
  border: 1px solid rgba(192, 192, 192, 1);
  outline: none;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
input.switch:checked {
  box-shadow: inset 20px 0px 0px 1px rgba(33, 150, 243, 0.5);
  border: 1px solid rgba(33, 150, 243, 1);
}
input.switch::-ms-check {
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; /* IE 8 */
  filter: alpha(opacity=0); /* IE 5-7 */
  opacity: 0;
}
</style>

<input class="switch" type="checkbox">
```
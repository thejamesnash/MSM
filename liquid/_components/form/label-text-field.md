---
title: "Label text field"
layout: msm/form-component
root: "form/label-text-field"
trueRoot: "form"
usage: "This is a text field"
tags:
    - current
    - question
    - form
---

{% include msm/components/form-field/index.html 
answer="text-field" 
empty=true
label="Text label"
placeholder="0" 
%}

{% include msm/components/form-field/index.html 
answer="text-field" 
label="Text label"
placeholder="0" 
%}
---
title: "Dropdown"
layout: msm/form-component
root: "form/dropdown"
trueRoot: "form"
usage: "This is a"
tags: 
    - current
    - question
    - form
---

<!--{% include msm/components/{{ page.root }}/index.html %}-->
{% include msm/components/form-field/index.html 
answer="dropdown"
answers="Option 1#one|Option 2#two|Option 3#three"
%}
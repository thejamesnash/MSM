---
title: "Dependant"
layout: msm/form-component
root: "form/dependant"
trueRoot: "form"
usage: "This is a"
tags: 
    - current
    - question
    - form
---

{% include msm/components/form-field/index.html
answer="radio-buttons"
class="form-inline-radios"
answers= "Yes|No"
question="Would you like to add any additional drivers"
hint="You can add up to 3 other people on to your insurance."
%}

{% include msm/components/form/dependant/index.html
id="addDriver"
dependParent="radio-buttons1-1-1"
%}
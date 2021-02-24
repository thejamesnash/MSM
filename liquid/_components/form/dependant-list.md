---
title: "Dependant List"
layout: msm/form-component
root: "form/dependant-list"
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
question="Has the car been modified in anyway?"
%}

{% include msm/components/form/dependant-list/index.html
id="modCar"
class="card-list"
dependParent="radio-buttons1-1-1"
%}